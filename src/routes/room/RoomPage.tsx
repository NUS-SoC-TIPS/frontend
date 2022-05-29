import { PropsWithChildren, ReactElement, useEffect } from 'react';
import { Box, DarkMode, useColorMode } from '@chakra-ui/react';

export const RoomPage = ({
  children,
}: PropsWithChildren<unknown>): ReactElement<
  PropsWithChildren<unknown>,
  typeof DarkMode
> => {
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode('dark');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
