import { useEffect, useMemo, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

import { PeerCallManager } from './peerCall';

export interface UsePeerCallResult {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  connectionState: RTCPeerConnectionState;
  error: Error | null;
  audioEnabled: boolean;
  videoEnabled: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
}

/**
 * React wrapper around PeerCallManager (see peerCall.ts for the
 * transport design). `joinedWithPartner` captures whether the partner
 * was already in the room when this client joined; that side is the
 * initiator, so the two peers never offer at the same time.
 */
export const usePeerCall = (
  socket: Socket | null,
  iceServers: RTCIceServer[],
  isPartnerInRoom: boolean,
): UsePeerCallResult => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] =
    useState<RTCPeerConnectionState>('new');
  const [error, setError] = useState<Error | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const managerRef = useRef<PeerCallManager | null>(null);
  const joinedWithPartnerRef = useRef<boolean | null>(null);

  // The ICE server list only changes when (re)joining a room; key the
  // effect by value so a fresh array identity does not restart media.
  const iceServersKey = useMemo(() => JSON.stringify(iceServers), [iceServers]);

  useEffect(() => {
    if (socket == null) {
      return () => {};
    }
    const manager = new PeerCallManager(socket, iceServers, {
      onLocalStream: setLocalStream,
      onRemoteStream: setRemoteStream,
      onConnectionStateChange: setConnectionState,
      onError: setError,
    });
    managerRef.current = manager;
    void manager.start();
    return () => {
      manager.dispose();
      managerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, iceServersKey]);

  useEffect(() => {
    const manager = managerRef.current;
    if (manager == null) {
      return;
    }
    if (joinedWithPartnerRef.current === null) {
      joinedWithPartnerRef.current = isPartnerInRoom;
    }
    manager.setPartnerPresent(
      isPartnerInRoom,
      joinedWithPartnerRef.current === true,
    );
  }, [isPartnerInRoom, localStream]);

  const toggleAudio = (): void => {
    const next = !audioEnabled;
    managerRef.current?.setAudioEnabled(next);
    setAudioEnabled(next);
  };

  const toggleVideo = (): void => {
    const next = !videoEnabled;
    managerRef.current?.setVideoEnabled(next);
    setVideoEnabled(next);
  };

  return {
    localStream,
    remoteStream,
    connectionState,
    error,
    audioEnabled,
    videoEnabled,
    toggleAudio,
    toggleVideo,
  };
};
