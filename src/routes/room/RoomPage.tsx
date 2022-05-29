import { PropsWithChildren, ReactElement, useEffect } from 'react';
import { Box, DarkMode, useColorMode, useToast } from '@chakra-ui/react';

import { DEFAULT_TOAST_PROPS } from 'constants/toast';

export const RoomPage = ({
  children,
}: PropsWithChildren<unknown>): ReactElement<
  PropsWithChildren<unknown>,
  typeof DarkMode
> => {
  const { colorMode, setColorMode } = useColorMode();
  const toast = useToast();

  useEffect(() => {
    setColorMode('dark');
    // Hacky workaround with isActive. Unfortunately, I was unable to prevent duplicated
    // toasts from showing up otherwise.
    if (colorMode === 'light' && !toast.isActive(1)) {
      toast({
        ...DEFAULT_TOAST_PROPS,
        id: 1,
        title: 'Dark mode has been activated.',
        description:
          'Currently, this page looks the best with dark mode. We will look into supporting light mode in the future.',
        status: 'info',
      });
    }
  }, [colorMode, toast, setColorMode]);

  return (
    <Box
      as="section"
      display="flex"
      flexDirection="column"
      height="100vh"
      width="100vw"
    >
      {children}
    </Box>
  );
};
