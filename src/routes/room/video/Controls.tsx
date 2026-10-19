import { ReactElement } from 'react';
import { FiMic, FiMicOff, FiVideo, FiVideoOff } from 'react-icons/fi';
import { DarkMode, HStack, IconButton, Text } from '@chakra-ui/react';

export interface MediaControls {
  audioEnabled: boolean;
  videoEnabled: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
}

interface Props {
  mediaControls?: MediaControls;
  name: string;
}

export const Controls = ({
  mediaControls,
  name,
}: Props): ReactElement<Props, typeof HStack> => {
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
        {mediaControls && (
          <HStack spacing={1}>
            <IconButton
              aria-label="Audio"
              bg={mediaControls.audioEnabled ? undefined : 'red'}
              border="none"
              icon={mediaControls.audioEnabled ? <FiMic /> : <FiMicOff />}
              onClick={mediaControls.onToggleAudio}
              size="xs"
              variant="secondary"
            />
            <IconButton
              aria-label="Video"
              bg={mediaControls.videoEnabled ? undefined : 'red'}
              border="none"
              icon={mediaControls.videoEnabled ? <FiVideo /> : <FiVideoOff />}
              onClick={mediaControls.onToggleVideo}
              size="xs"
              variant="secondary"
            />
          </HStack>
        )}
      </HStack>
    </DarkMode>
  );
};
