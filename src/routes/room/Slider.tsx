import { ReactElement, useEffect } from 'react';
import { FiAlignJustify } from 'react-icons/fi';
import { Box, Icon, useBreakpointValue } from '@chakra-ui/react';

interface Props {
  onDrag: (distance: number) => void;
  height: string;
}

let isDragging = false;
const onMouseUp = (): void => {
  isDragging = false;
};

export const Slider = ({
  onDrag,
  height,
}: Props): ReactElement<Props, typeof Box> => {
  const isTablet = useBreakpointValue(
    { base: false, md: true },
    { ssr: false },
  );

  useEffect(() => {
    document.addEventListener('mouseup', onMouseUp, { passive: false });
    document.addEventListener('touchend', onMouseUp, { passive: false });
    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchend', onMouseUp);
    };
  }, []);

  useEffect(() => {
    const onMouseMove = (event: MouseEvent): void => {
      if (isDragging) {
        event.preventDefault();
        onDrag(isTablet ? event.clientX : event.clientY - 48); // 48 px for the top bar
      }
    };
    const onTouchMove = (event: TouchEvent): void => {
      if (isDragging && event.touches[0]) {
        event.preventDefault();
        onDrag(
          // 48 px for the top bar
          isTablet ? event.touches[0].clientX : event.touches[0].clientY - 48,
        );
      }
    };
    document.addEventListener('mousemove', onMouseMove, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onTouchMove);
    };
  }, [isTablet, onDrag]);

  const onMouseDown = (): void => {
    isDragging = true;
  };

  return (
    <Box
      alignItems="center"
      bg="bg.surface"
      cursor={isTablet ? 'col-resize' : 'row-resize'}
      display="flex"
      flexGrow={0}
      flexShrink={0}
      height={isTablet ? height : 4}
      justifyContent="center"
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
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
