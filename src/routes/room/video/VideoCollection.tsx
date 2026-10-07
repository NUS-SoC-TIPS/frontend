import {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useRef,
} from 'react';
import { Box, useBreakpointValue, useToast } from '@chakra-ui/react';
import { Socket } from 'socket.io-client';

import { useAppSelector } from '@/app/hooks';
import { ERROR_TOAST_PROPS } from '@/constants/toast';
import { useUser } from '@/contexts/UserContext';
import { usePeerCall } from '@/lib/webrtc/usePeerCall';

import { Controls } from './Controls';
import './VideoCollection.scss';

const VideoPanel = ({
  children,
}: PropsWithChildren<unknown>): ReactElement<
  PropsWithChildren<unknown>,
  typeof Box
> => {
  return (
    <Box
      bg="black"
      borderRadius="md"
      h="100%"
      overflow="hidden"
      position="relative"
      w="48%"
    >
      {children}
    </Box>
  );
};

const VideoPlayer = ({
  stream,
  muted = false,
}: {
  stream: MediaStream;
  muted?: boolean;
}): ReactElement<'video'> => {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (ref.current != null) {
      ref.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      autoPlay
      className="peer-video"
      muted={muted}
      playsInline
      ref={ref}
    />
  );
};

interface Props {
  partnerName?: string;
  isPartnerInRoom: boolean;
  socket: Socket;
}

export const VideoCollection = ({
  partnerName = '',
  isPartnerInRoom,
  socket,
}: Props): ReactElement<Props, typeof Box> | null => {
  const user = useUser();
  const { iceServers } = useAppSelector((state) => state.room);
  const {
    localStream,
    remoteStream,
    error,
    audioEnabled,
    videoEnabled,
    toggleAudio,
    toggleVideo,
  } = usePeerCall(socket, iceServers, isPartnerInRoom);
  const height = useBreakpointValue(
    {
      base: '25vw',
      sm: '15vw',
      md: '10vw',
      lg: '8vw',
    },
    { ssr: false },
  );
  const width = useBreakpointValue(
    {
      base: 'calc(100vw - 1rem)',
      sm: '50vw',
      md: '33vw',
      lg: '27vw',
    },
    { ssr: false },
  );
  const toast = useToast();

  useEffect(() => {
    if (error != null && !toast.isActive('video_error_toast')) {
      toast({
        ...ERROR_TOAST_PROPS,
        id: 'video_error_toast',
        title: 'Failed to start video communication!',
        description:
          'Please check your camera/microphone permissions and refresh the page to try again.',
      });
    }
  }, [error, toast]);

  if (!user) {
    return null;
  }

  return (
    <Box
      alignItems="center"
      bottom={0}
      display="flex"
      flexDirection="row-reverse"
      height={height}
      justifyContent="space-between"
      padding={2}
      position="absolute"
      right={0}
      width={width}
      zIndex={4}
    >
      {localStream != null && (
        <>
          <VideoPanel>
            <VideoPlayer muted stream={localStream} />
            <Controls
              mediaControls={{
                audioEnabled,
                videoEnabled,
                onToggleAudio: toggleAudio,
                onToggleVideo: toggleVideo,
              }}
              name={user.name}
            />
          </VideoPanel>
          {isPartnerInRoom ? (
            <VideoPanel>
              {remoteStream != null && (
                <VideoPlayer stream={remoteStream} />
              )}
              <Controls name={partnerName} />
            </VideoPanel>
          ) : null}
        </>
      )}
    </Box>
  );
};
