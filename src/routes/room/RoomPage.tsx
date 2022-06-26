import { PropsWithChildren, ReactElement } from 'react';
import { Box, DarkMode } from '@chakra-ui/react';

export const RoomPage = ({
  children,
}: PropsWithChildren<unknown>): ReactElement<
  PropsWithChildren<unknown>,
  typeof DarkMode
> => {
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
