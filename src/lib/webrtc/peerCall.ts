import { Socket } from 'socket.io-client';

import { ROOM_EVENTS } from '@/constants/events';

interface SessionDescriptionPayload {
  type: RTCSdpType;
  sdp?: string;
}

export interface PeerCallCallbacks {
  onLocalStream: (stream: MediaStream | null) => void;
  onRemoteStream: (stream: MediaStream | null) => void;
  onConnectionStateChange: (state: RTCPeerConnectionState) => void;
  onError: (error: Error) => void;
}

/**
 * Owns a single 1:1 WebRTC peer connection: local media capture, the
 * RTCPeerConnection itself, and signaling over the room socket.
 *
 * Media flows directly between the two browsers (DTLS-SRTP encrypted);
 * the backend only relays SDP offers/answers and ICE candidates between
 * the two sockets in the room, and supplies the ICE server list (STUN,
 * plus TURN for the minority of calls that cannot connect directly).
 *
 * Roles are fixed to avoid offer collisions: the peer who joined the
 * room second (i.e. the partner was already present) is the initiator
 * and creates the offer; the first joiner answers.
 */
export class PeerCallManager {
  private readonly socket: Socket;

  private readonly iceServers: RTCIceServer[];

  private readonly callbacks: PeerCallCallbacks;

  private peerConnection: RTCPeerConnection | null = null;

  private localStream: MediaStream | null = null;

  private pendingIceCandidates: RTCIceCandidateInit[] = [];

  private isInitiator = false;

  private disposed = false;

  constructor(
    socket: Socket,
    iceServers: RTCIceServer[],
    callbacks: PeerCallCallbacks,
  ) {
    this.socket = socket;
    this.iceServers = iceServers;
    this.callbacks = callbacks;
    this.socket.on(
      ROOM_EVENTS.VIDEO_OFFER,
      this.handleOffer as (...args: unknown[]) => void,
    );
    this.socket.on(
      ROOM_EVENTS.VIDEO_ANSWER,
      this.handleAnswer as (...args: unknown[]) => void,
    );
    this.socket.on(
      ROOM_EVENTS.VIDEO_ICE_CANDIDATE,
      this.handleIceCandidate as (...args: unknown[]) => void,
    );
  }

  /** Captures local camera/microphone. Does not connect to anyone yet. */
  async start(): Promise<void> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      if (this.disposed) {
        this.stopLocalTracks();
        return;
      }
      this.callbacks.onLocalStream(this.localStream);
    } catch (e: unknown) {
      this.callbacks.onError(
        e instanceof Error
          ? e
          : new Error('Failed to access camera/microphone'),
      );
    }
  }

  /**
   * Reacts to partner presence. When the partner is present, ensures a
   * peer connection exists (creating an offer if this peer is the
   * initiator). When the partner leaves, tears the connection down so a
   * later join starts from a clean state.
   */
  setPartnerPresent(present: boolean, isInitiator: boolean): void {
    if (!present) {
      this.closePeerConnection();
      return;
    }
    this.isInitiator = isInitiator;
    this.ensurePeerConnection();
  }

  setAudioEnabled(enabled: boolean): void {
    this.localStream
      ?.getAudioTracks()
      .forEach((track) => (track.enabled = enabled));
  }

  setVideoEnabled(enabled: boolean): void {
    this.localStream
      ?.getVideoTracks()
      .forEach((track) => (track.enabled = enabled));
  }

  dispose(): void {
    this.disposed = true;
    this.socket.off(ROOM_EVENTS.VIDEO_OFFER, this.handleOffer);
    this.socket.off(ROOM_EVENTS.VIDEO_ANSWER, this.handleAnswer);
    this.socket.off(ROOM_EVENTS.VIDEO_ICE_CANDIDATE, this.handleIceCandidate);
    this.closePeerConnection();
    this.stopLocalTracks();
    this.callbacks.onLocalStream(null);
  }

  private ensurePeerConnection(): void {
    if (this.peerConnection != null || this.localStream == null) {
      return;
    }
    const peerConnection = new RTCPeerConnection({
      iceServers: this.iceServers,
    });
    this.peerConnection = peerConnection;

    this.localStream
      .getTracks()
      .forEach((track) =>
        peerConnection.addTrack(track, this.localStream as MediaStream),
      );

    peerConnection.onicecandidate = (event): void => {
      if (event.candidate) {
        this.socket.emit(
          ROOM_EVENTS.VIDEO_ICE_CANDIDATE,
          event.candidate.toJSON(),
        );
      }
    };
    peerConnection.ontrack = (event): void => {
      const [remoteStream] = event.streams;
      this.callbacks.onRemoteStream(
        remoteStream ?? new MediaStream([event.track]),
      );
    };
    peerConnection.onconnectionstatechange = (): void => {
      this.callbacks.onConnectionStateChange(peerConnection.connectionState);
    };
    peerConnection.onnegotiationneeded = async (): Promise<void> => {
      if (!this.isInitiator || this.peerConnection !== peerConnection) {
        return;
      }
      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        this.socket.emit(ROOM_EVENTS.VIDEO_OFFER, {
          type: offer.type,
          sdp: offer.sdp,
        } satisfies SessionDescriptionPayload);
      } catch (e: unknown) {
        this.callbacks.onError(
          e instanceof Error ? e : new Error('Failed to create offer'),
        );
      }
    };
  }

  private handleOffer = async (
    payload: SessionDescriptionPayload,
  ): Promise<void> => {
    try {
      this.ensurePeerConnection();
      const peerConnection = this.peerConnection;
      if (peerConnection == null) {
        return;
      }
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(payload),
      );
      await this.flushPendingIceCandidates();
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      this.socket.emit(ROOM_EVENTS.VIDEO_ANSWER, {
        type: answer.type,
        sdp: answer.sdp,
      } satisfies SessionDescriptionPayload);
    } catch (e: unknown) {
      this.callbacks.onError(
        e instanceof Error ? e : new Error('Failed to answer offer'),
      );
    }
  };

  private handleAnswer = async (
    payload: SessionDescriptionPayload,
  ): Promise<void> => {
    try {
      if (this.peerConnection == null) {
        return;
      }
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(payload),
      );
      await this.flushPendingIceCandidates();
    } catch (e: unknown) {
      this.callbacks.onError(
        e instanceof Error ? e : new Error('Failed to accept answer'),
      );
    }
  };

  private handleIceCandidate = async (
    payload: RTCIceCandidateInit,
  ): Promise<void> => {
    if (
      this.peerConnection == null ||
      this.peerConnection.remoteDescription == null
    ) {
      this.pendingIceCandidates.push(payload);
      return;
    }
    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(payload));
    } catch (e: unknown) {
      this.callbacks.onError(
        e instanceof Error ? e : new Error('Failed to add ICE candidate'),
      );
    }
  };

  private async flushPendingIceCandidates(): Promise<void> {
    const queued = this.pendingIceCandidates;
    this.pendingIceCandidates = [];
    for (const candidate of queued) {
      await this.handleIceCandidate(candidate);
    }
  }

  private closePeerConnection(): void {
    if (this.peerConnection != null) {
      this.peerConnection.onicecandidate = null;
      this.peerConnection.ontrack = null;
      this.peerConnection.onconnectionstatechange = null;
      this.peerConnection.onnegotiationneeded = null;
      this.peerConnection.close();
      this.peerConnection = null;
    }
    this.pendingIceCandidates = [];
    this.callbacks.onRemoteStream(null);
    this.callbacks.onConnectionStateChange('closed');
  }

  private stopLocalTracks(): void {
    this.localStream?.getTracks().forEach((track) => track.stop());
    this.localStream = null;
  }
}
