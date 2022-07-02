import { ReactElement, useEffect, useState } from 'react';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import { Socket } from 'socket.io-client';

import { useAppSelector } from 'app/hooks';
import { CodeEditor } from 'components/codeEditor';
import { useUser } from 'contexts/UserContext';
import { useWindowDimensions } from 'utils/hookUtils';

import { Panel } from './panel';
import { Slider } from './Slider';
import { VideoCollection } from './video';

interface Props {
  socket: Socket;
  slug: string;
}

export const MiddleSection = ({
  socket,
  slug,
}: Props): ReactElement<Props, typeof Box> => {
  const { language } = useAppSelector((state) => state.code);
  const { partner, isPartnerInRoom } = useAppSelector((state) => state.room);
  const isTablet = useBreakpointValue({ base: false, md: true });
  const { width, height } = useWindowDimensions();
  const [editorSize, setEditorSize] = useState(0.5);
  const user = useUser();

  useEffect(() => {
    if (!isTablet && editorSize > 0.8) {
      setEditorSize(0.8);
    }
  }, [isTablet, editorSize]);

  const isPanelCollapsed = editorSize >= 1 && isTablet;
  const fullLength = isTablet ? width : height - 96; // 48 (top) + 48 (bottom)
  const scaledLength = fullLength * editorSize - 16; // 16 is for the slider

  const onSliderDrag = (distance: number): void => {
    let ratio = Math.min(Math.max(distance / fullLength, 0.3), 1);
    if (!isTablet && ratio > 0.8) {
      ratio = 0.8;
    } else if (ratio > 0.9) {
      ratio = 1;
    } else if (
      (!isPanelCollapsed && ratio >= 0.8) ||
      (isPanelCollapsed && ratio <= 0.9)
    ) {
      ratio = 0.8;
    }
    setEditorSize(ratio);
  };

  return (
    <Box
      display="flex"
      flex={1}
      flexDirection={isTablet ? 'row' : 'column'}
      position="relative"
    >
      <CodeEditor
        height={isTablet ? `${height - 96}px` : `${scaledLength}px`}
        language={language}
        roomSlug={slug}
        socket={socket}
        username={user?.name ?? ''}
        width={isTablet ? `${scaledLength}px` : '100%'}
      />
      <Slider onDrag={onSliderDrag} />
      {!isPanelCollapsed && (
        <Panel
          height={isTablet ? height - 96 : height - 112 - scaledLength}
          socket={socket}
        />
      )}
      <VideoCollection
        isPartnerInRoom={isPartnerInRoom}
        partnerName={partner?.name}
      />
    </Box>
  );
};
