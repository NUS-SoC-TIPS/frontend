import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

import { PeerCallError, PeerCallManager } from './peerCall';

export interface UsePeerCallResult {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  connectionState: RTCPeerConnectionState;
  error: PeerCallError | null;
  audioEnabled: boolean;
  videoEnabled: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
}

/**
 * React wrapper around PeerCallManager (see peerCall.ts for the
 * transport design). `iceServers` and `isPartnerInRoom` are only read
 * when the call starts; afterwards the manager follows presence and ICE
 * configuration changes directly from the room socket.
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
  const [error, setError] = useState<PeerCallError | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const managerRef = useRef<PeerCallManager | null>(null);
  const initialStateRef = useRef({ iceServers, isPartnerInRoom });

  useEffect(() => {
    if (socket == null) {
      return () => {};
    }
    const manager = new PeerCallManager(
      socket,
      initialStateRef.current.iceServers,
      initialStateRef.current.isPartnerInRoom,
      {
        onLocalStream: setLocalStream,
        onRemoteStream: setRemoteStream,
        onConnectionStateChange: setConnectionState,
        onError: setError,
      },
    );
    managerRef.current = manager;
    return () => {
      manager.dispose();
      managerRef.current = null;
      setLocalStream(null);
      setRemoteStream(null);
      setAudioEnabled(true);
      setVideoEnabled(true);
    };
  }, [socket]);

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
