import { createClient, createMicrophoneAndCameraTracks } from 'agora-rtc-react';
import AgoraRTC, { ClientConfig } from 'agora-rtc-sdk-ng';

const config: ClientConfig = {
  mode: 'rtc',
  codec: 'vp8',
};

export const AGORA_APP_ID = process.env.REACT_APP_AGORA_APP_ID ?? '';

if (process.env.NODE_ENV !== 'development') {
  AgoraRTC.setLogLevel(4);
}

export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
