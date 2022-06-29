/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import { AgoraVideoPlayer, IAgoraRTCRemoteUser } from 'agora-rtc-react';

import { useAppSelector } from 'app/hooks';
import { useUser } from 'contexts/UserContext';
import {
  AGORA_APP_ID,
  useClient,
  useMicrophoneAndCameraTracks,
} from 'lib/agora';

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

interface Props {
  partnerName?: string;
  isPartnerInRoom: boolean;
}

export const VideoCollection = ({
  partnerName = '',
  isPartnerInRoom,
}: Props): ReactElement<Props, typeof Box> | null => {
  const [inCall, setInCall] = useState(true);
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [start, setStart] = useState<boolean>(false);
  const [hasInitialised, setHasInitialised] = useState<boolean>(false);
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();
  const user = useUser();
  const { id, videoToken } = useAppSelector((state) => state.room);
  const height = useBreakpointValue({
    base: '25vw',
    sm: '15vw',
    md: '10vw',
    lg: '8vw',
  });
  const width = useBreakpointValue({
    base: 'calc(100vw - 1rem)',
    sm: '50vw',
    md: '33vw',
    lg: '27vw',
  });

  useEffect(() => {
    if (!AGORA_APP_ID) {
      return () => {};
    }

    const init = async (channelName: string): Promise<void> => {
      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === 'video') {
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
      });

      client.on('user-unpublished', async (user, mediaType) => {
        await client.unsubscribe(user, mediaType);
        if (mediaType === 'audio') {
          user.audioTrack?.stop();
        }
        if (mediaType === 'video') {
          setUsers((prevUsers) => {
            return prevUsers.filter((prevUser) => prevUser.uid !== user.uid);
          });
        }
      });

      client.on('user-left', async (user) => {
        await client.unsubscribe(user);
        setUsers((prevUsers) => {
          return prevUsers.filter((prevUser) => prevUser.uid !== user.uid);
        });
      });

      await client.join(AGORA_APP_ID, channelName, videoToken, `${user!.id}`);
      setInCall(true);

      if (tracks) {
        await client.publish([tracks[0], tracks[1]]);
      }

      setStart(true);
    };

    if (ready && tracks && !hasInitialised) {
      setHasInitialised(true);
      init(`${id}`);
    }

    return () => {
      if (hasInitialised) {
        client.unpublish();
        client.leave();
      }
    };
  }, [client, hasInitialised, id, ready, tracks, user, videoToken]);

  useEffect(() => {
    return () => {
      tracks?.forEach((track) => track.close());
    };
  }, [tracks]);

  if (!client || !user) {
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
      {inCall && start && tracks && (
        <>
          <VideoPanel>
            <AgoraVideoPlayer className="agora-video" videoTrack={tracks[1]} />
            <Controls name={user.name} tracks={tracks} />
          </VideoPanel>
          {isPartnerInRoom ? (
            users.length > 0 && users[0].videoTrack ? (
              <VideoPanel>
                <AgoraVideoPlayer
                  className="agora-video"
                  videoTrack={users[0].videoTrack}
                />
                <Controls name={partnerName} />
              </VideoPanel>
            ) : (
              <VideoPanel>
                <Controls name={partnerName} />
              </VideoPanel>
            )
          ) : null}
        </>
      )}
    </Box>
  );
};
