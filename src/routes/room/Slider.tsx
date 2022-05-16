import { ReactElement, useEffect } from 'react';
import { FiAlignJustify } from 'react-icons/fi';
import { Box, Icon, useBreakpointValue } from '@chakra-ui/react';

interface Props {
  onDrag: (distance: number) => void;
}

let isDragging = false;
const onMouseUp = (): void => {
  isDragging = false;
};

export const Slider = ({ onDrag }: Props): ReactElement<Props, typeof Box> => {
  const isTablet = useBreakpointValue({ base: false, md: true });

  useEffect(() => {
    document.onmouseup = onMouseUp;
    return () => {
      document.onmouseup = null;
    };
  }, []);

  useEffect(() => {
    const onMouseMove = (event: MouseEvent): void => {
      if (isDragging) {
        onDrag(isTablet ? event.clientX : event.clientY);
      }
    };
    document.onmousemove = onMouseMove;

    return () => {
      document.onmousemove = null;
    };
  }, [isTablet, onDrag]);

  const onMouseDown = (): void => {
    isDragging = true;
  };

  return (
    <Box
      alignItems="center"
      bg="bg-surface"
      cursor={isTablet ? 'col-resize' : 'row-resize'}
      display="flex"
      flexGrow={0}
      flexShrink={0}
      height={isTablet ? '100%' : 4}
      justifyContent="center"
      onMouseDown={onMouseDown}
      userSelect="none"
      w={isTablet ? 4 : '100%'}
    >
      <Icon
        __css={{
          transform: isTablet ? 'rotate(90deg)' : undefined,
          transformOrigin: 'center',
        }}
        as={FiAlignJustify}
        color="gray"
      />
    </Box>
  );
};
