import { Socket } from 'socket.io-client';

import { ROOM_EVENTS } from '@/constants/events';

interface SessionDescriptionPayload {
  type: RTCSdpType;
  sdp?: string;
}

interface OfferPayload extends SessionDescriptionPayload {
  // Random per-peer value used to decide who backs off when both offer.
  tiebreaker: number;
}

export type PeerCallErrorKind = 'media' | 'connection';

export class PeerCallError extends Error {
  readonly kind: PeerCallErrorKind;

  constructor(kind: PeerCallErrorKind, message: string) {
    super(message);
    this.kind = kind;
  }
}

export interface PeerCallCallbacks {
  onLocalStream: (stream: MediaStream | null) => void;
  onRemoteStream: (stream: MediaStream | null) => void;
  onConnectionStateChange: (state: RTCPeerConnectionState) => void;
  onError: (error: PeerCallError) => void;
}

// How many ICE restarts the initiator attempts before giving up on a
// connection that has failed (e.g. after a network change).
const MAX_ICE_RESTARTS = 2;

// An offer can be lost if it reaches the partner before their video
// component has mounted; resend it if it is still unanswered by then.
const OFFER_RETRY_MS = 4000;

/**
 * Owns a single 1:1 WebRTC peer connection: local media capture, the
 * RTCPeerConnection itself, and signaling over the room socket.
 *
 * Media flows directly between the two browsers (DTLS-SRTP encrypted);
 * the backend only relays SDP offers/answers and ICE candidates between
 * the two sockets in the room, and supplies the ICE server list (STUN,
 * plus TURN for the minority of calls that cannot connect directly).
 *
 * Presence is read straight off the room socket, so it is ordered with
 * the signaling messages it relates to:
 * - Our own (re)join with the partner present: we are the newcomer, so we
 *   start a fresh connection and send the offer.
 * - The partner (re)joins: they are the newcomer, so we start a fresh
 *   connection and wait for their offer.
 * - The partner disconnects: we tear the connection down.
 * If both sides still offer at once (e.g. the partner joined while this
 * component was mounting), the peer with the lower tiebreaker backs off.
 * Unanswered offers are resent, so a lost offer only delays the call.
 *
 * All presence and signaling work runs through one serial queue, after
 * local media capture has settled, so nothing is dropped while the
 * camera permission prompt is open. A peer without camera/microphone
 * still connects and receives the partner's media.
 */
export class PeerCallManager {
  private readonly socket: Socket;

  private readonly callbacks: PeerCallCallbacks;

  private iceServers: RTCIceServer[];

  private peerConnection: RTCPeerConnection | null = null;

  private localStream: MediaStream | null = null;

  private pendingIceCandidates: RTCIceCandidateInit[] = [];

  private isInitiator = false;

  private iceRestarts = 0;

  private readonly tiebreaker = Math.random();

  private offerRetryTimer: ReturnType<typeof setTimeout> | null = null;

  private audioEnabled = true;

  private videoEnabled = true;

  private disposed = false;

  private queue: Promise<void>;

  constructor(
    socket: Socket,
    iceServers: RTCIceServer[],
    isPartnerInRoom: boolean,
    callbacks: PeerCallCallbacks,
  ) {
    this.socket = socket;
    this.iceServers = iceServers;
    this.callbacks = callbacks;
    this.queue = this.acquireLocalMedia();
    if (isPartnerInRoom) {
      this.enqueue(() => this.connect(true));
    }
    this.socket.on(ROOM_EVENTS.JOIN_ROOM, this.handleSelfJoined);
    this.socket.on(ROOM_EVENTS.JOINED_ROOM, this.handlePartnerJoined);
    this.socket.on(
      ROOM_EVENTS.PARTNER_DISCONNECTED,
      this.handlePartnerDisconnected,
    );
    this.socket.on(ROOM_EVENTS.VIDEO_OFFER, this.handleOffer);
    this.socket.on(ROOM_EVENTS.VIDEO_ANSWER, this.handleAnswer);
    this.socket.on(ROOM_EVENTS.VIDEO_ICE_CANDIDATE, this.handleIceCandidate);
  }

  setAudioEnabled(enabled: boolean): void {
    this.audioEnabled = enabled;
    this.localStream
      ?.getAudioTracks()
      .forEach((track) => (track.enabled = enabled));
  }

  setVideoEnabled(enabled: boolean): void {
    this.videoEnabled = enabled;
    this.localStream
      ?.getVideoTracks()
      .forEach((track) => (track.enabled = enabled));
  }

  dispose(): void {
    this.disposed = true;
    this.socket.off(ROOM_EVENTS.JOIN_ROOM, this.handleSelfJoined);
    this.socket.off(ROOM_EVENTS.JOINED_ROOM, this.handlePartnerJoined);
    this.socket.off(
      ROOM_EVENTS.PARTNER_DISCONNECTED,
      this.handlePartnerDisconnected,
    );
    this.socket.off(ROOM_EVENTS.VIDEO_OFFER, this.handleOffer);
    this.socket.off(ROOM_EVENTS.VIDEO_ANSWER, this.handleAnswer);
    this.socket.off(ROOM_EVENTS.VIDEO_ICE_CANDIDATE, this.handleIceCandidate);
    this.closePeerConnection();
    this.stopLocalTracks();
  }

  private enqueue(task: () => Promise<void> | void): void {
    this.queue = this.queue
      .then(() => (this.disposed ? undefined : task()))
      .catch((e: unknown) => {
        this.reportError(
          'connection',
          e instanceof Error ? e.message : 'WebRTC negotiation failed',
        );
      });
  }

  private async acquireLocalMedia(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      if (this.disposed) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      this.localStream = stream;
      this.setAudioEnabled(this.audioEnabled);
      this.setVideoEnabled(this.videoEnabled);
      this.callbacks.onLocalStream(stream);
    } catch (e: unknown) {
      // Carry on receive-only: the partner can still be seen and heard.
      this.reportError(
        'media',
        e instanceof Error ? e.message : 'Failed to access camera/microphone',
      );
    }
  }

  private handleSelfJoined = (data: {
    iceServers?: RTCIceServer[];
    isPartnerInRoom?: boolean;
  }): void => {
    this.enqueue(() => {
      // Our socket reconnected and rejoined; ICE credentials may be new.
      this.iceServers = data.iceServers ?? this.iceServers;
      this.closePeerConnection();
      if (data.isPartnerInRoom) {
        return this.connect(true);
      }
    });
  };

  private handlePartnerJoined = (): void => {
    this.enqueue(() => {
      this.closePeerConnection();
      return this.connect(false);
    });
  };

  private handlePartnerDisconnected = (): void => {
    this.enqueue(() => this.closePeerConnection());
  };

  private handleOffer = (payload: OfferPayload): void => {
    this.enqueue(async () => {
      let peerConnection = this.peerConnection;
      if (peerConnection == null) {
        await this.connect(false);
        peerConnection = this.peerConnection as RTCPeerConnection | null;
        if (peerConnection == null) {
          return;
        }
      }
      if (peerConnection.signalingState === 'have-local-offer') {
        // Both sides offered. Deterministically pick one to back off.
        if (this.tiebreaker > payload.tiebreaker) {
          return; // The partner backs off and will answer our offer.
        }
        this.clearOfferRetry();
        await peerConnection.setLocalDescription({ type: 'rollback' });
        this.isInitiator = false;
      }
      await peerConnection.setRemoteDescription({
        type: payload.type,
        sdp: payload.sdp,
      });
      await this.flushPendingIceCandidates();
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      this.socket.emit(ROOM_EVENTS.VIDEO_ANSWER, {
        type: answer.type,
        sdp: answer.sdp,
      } satisfies SessionDescriptionPayload);
    });
  };

  private handleAnswer = (payload: SessionDescriptionPayload): void => {
    this.enqueue(async () => {
      const peerConnection = this.peerConnection;
      // Ignore answers to offers we no longer have (e.g. after a reset).
      if (peerConnection?.signalingState !== 'have-local-offer') {
        return;
      }
      this.clearOfferRetry();
      await peerConnection.setRemoteDescription(payload);
      await this.flushPendingIceCandidates();
    });
  };

  private handleIceCandidate = (payload: RTCIceCandidateInit): void => {
    this.enqueue(() => this.addIceCandidate(payload));
  };

  private async addIceCandidate(payload: RTCIceCandidateInit): Promise<void> {
    const peerConnection = this.peerConnection;
    if (peerConnection?.remoteDescription == null) {
      this.pendingIceCandidates.push(payload);
      return;
    }
    try {
      await peerConnection.addIceCandidate(payload);
    } catch {
      // Candidates for an offer we declined, or from a torn-down session,
      // are expected to fail and are harmless.
    }
  }

  private async flushPendingIceCandidates(): Promise<void> {
    const queued = this.pendingIceCandidates;
    this.pendingIceCandidates = [];
    for (const candidate of queued) {
      await this.addIceCandidate(candidate);
    }
  }

  private async connect(isInitiator: boolean): Promise<void> {
    if (this.peerConnection != null) {
      return;
    }
    this.isInitiator = isInitiator;
    this.iceRestarts = 0;
    const peerConnection = new RTCPeerConnection({
      iceServers: this.iceServers,
    });
    this.peerConnection = peerConnection;

    const { localStream } = this;
    if (localStream != null) {
      localStream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, localStream));
    } else if (isInitiator) {
      // Without local media, the offer still needs m-lines to receive on.
      peerConnection.addTransceiver('audio', { direction: 'recvonly' });
      peerConnection.addTransceiver('video', { direction: 'recvonly' });
    }

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
      if (this.peerConnection !== peerConnection) {
        return;
      }
      const state = peerConnection.connectionState;
      this.callbacks.onConnectionStateChange(state);
      if (state !== 'failed' || !this.isInitiator) {
        return;
      }
      if (this.iceRestarts >= MAX_ICE_RESTARTS) {
        this.reportError('connection', 'Failed to connect to partner');
        return;
      }
      this.iceRestarts += 1;
      this.enqueue(() => this.sendOffer(peerConnection, true));
    };

    if (isInitiator) {
      await this.sendOffer(peerConnection, false);
    }
  }

  private async sendOffer(
    peerConnection: RTCPeerConnection,
    iceRestart: boolean,
  ): Promise<void> {
    if (this.peerConnection !== peerConnection) {
      return;
    }
    if (peerConnection.signalingState === 'have-local-offer') {
      await peerConnection.setLocalDescription({ type: 'rollback' });
    }
    const offer = await peerConnection.createOffer({ iceRestart });
    await peerConnection.setLocalDescription(offer);
    this.socket.emit(ROOM_EVENTS.VIDEO_OFFER, {
      type: offer.type,
      sdp: offer.sdp,
      tiebreaker: this.tiebreaker,
    } satisfies OfferPayload);

    this.clearOfferRetry();
    this.offerRetryTimer = setTimeout(() => {
      this.offerRetryTimer = null;
      this.enqueue(() => {
        if (
          this.peerConnection === peerConnection &&
          peerConnection.signalingState === 'have-local-offer'
        ) {
          return this.sendOffer(peerConnection, iceRestart);
        }
      });
    }, OFFER_RETRY_MS);
  }

  private clearOfferRetry(): void {
    if (this.offerRetryTimer != null) {
      clearTimeout(this.offerRetryTimer);
      this.offerRetryTimer = null;
    }
  }

  private closePeerConnection(): void {
    this.clearOfferRetry();
    if (this.peerConnection != null) {
      this.peerConnection.onicecandidate = null;
      this.peerConnection.ontrack = null;
      this.peerConnection.onconnectionstatechange = null;
      this.peerConnection.close();
      this.peerConnection = null;
    }
    this.pendingIceCandidates = [];
    if (!this.disposed) {
      this.callbacks.onRemoteStream(null);
      this.callbacks.onConnectionStateChange('closed');
    }
  }

  private stopLocalTracks(): void {
    this.localStream?.getTracks().forEach((track) => track.stop());
    this.localStream = null;
  }

  private reportError(kind: PeerCallErrorKind, message: string): void {
    if (!this.disposed) {
      this.callbacks.onError(new PeerCallError(kind, message));
    }
  }
}
