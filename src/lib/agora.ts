import { createClient, createMicrophoneAndCameraTracks } from 'agora-rtc-react';
import AgoraRTC, { ClientConfig } from 'agora-rtc-sdk-ng';

const config: ClientConfig = {
  mode: 'rtc',
  codec: 'vp8',
};

export const AGORA_APP_ID = import.meta.env.VITE_AGORA_APP_ID ?? '';

if (import.meta.env.MODE !== 'development') {
  AgoraRTC.setLogLevel(4);
}

export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
