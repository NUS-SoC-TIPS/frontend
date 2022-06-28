import { ReactElement, useState } from 'react';
import { FiMic, FiMicOff, FiVideo, FiVideoOff } from 'react-icons/fi';
import { DarkMode, HStack, IconButton, Text } from '@chakra-ui/react';
import { ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';

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
        position="absolute"
        px={2}
        py={0.5}
        width="100%"
      >
        <Text color="white" fontSize="xs" noOfLines={1}>
          {name}
        </Text>
        {tracks && (
          <HStack>
            <IconButton
              aria-label="Audio"
              color="white"
              icon={trackState.audio ? <FiMic /> : <FiMicOff />}
              onClick={(): Promise<void> => toggle('audio')}
              size="xs"
            />
            <IconButton
              aria-label="Video"
              color="white"
              icon={trackState.video ? <FiVideo /> : <FiVideoOff />}
              onClick={(): Promise<void> => toggle('video')}
              size="xs"
            />
          </HStack>
        )}
      </HStack>
    </DarkMode>
  );
};
