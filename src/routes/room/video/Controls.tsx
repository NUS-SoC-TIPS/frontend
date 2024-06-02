import { ReactElement, useState } from 'react';
import { FiMic, FiMicOff, FiVideo, FiVideoOff } from 'react-icons/fi';
import { DarkMode, HStack, IconButton, Text } from '@chakra-ui/react';
import { ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-react';

interface Props {
  tracks?: [IMicrophoneAudioTrack, ICameraVideoTrack];
  name: string;
}

export const Controls = ({
  tracks,
  name,
}: Props): ReactElement<Props, typeof HStack> => {
  const [trackState, setTrackState] = useState({ video: true, audio: true });
  const toggle = async (type: 'audio' | 'video'): Promise<void> => {
    if (!tracks) {
      return;
    }
    if (type === 'audio') {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === 'video') {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  return (
    <DarkMode>
      <HStack
        backgroundColor="rgba(0, 0, 0, 0.4)"
        bottom={0}
        justifyContent="space-between"
        minH={7}
        pl={2}
        position="absolute"
        pr={0.5}
        py={0.5}
        width="100%"
      >
        <Text color="white" fontSize="xs" noOfLines={1}>
          {name}
        </Text>
        {tracks && (
          <HStack spacing={1}>
            <IconButton
              aria-label="Audio"
              bg={trackState.audio ? undefined : 'red'}
              border="none"
              icon={trackState.audio ? <FiMic /> : <FiMicOff />}
              onClick={(): Promise<void> => toggle('audio')}
              size="xs"
              variant="secondary"
            />
            <IconButton
              aria-label="Video"
              bg={trackState.video ? undefined : 'red'}
              border="none"
              icon={trackState.video ? <FiVideo /> : <FiVideoOff />}
              onClick={(): Promise<void> => toggle('video')}
              size="xs"
              variant="secondary"
            />
          </HStack>
        )}
      </HStack>
    </DarkMode>
  );
};
