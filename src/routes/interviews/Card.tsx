import { ReactElement } from 'react';
import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';

export const Card = (props: BoxProps): ReactElement<typeof Box> => (
  <Box
    bg="bg-surface"
    borderRadius="lg"
    boxShadow={useColorModeValue('sm', 'sm-dark')}
    minH="36"
    {...props}
  />
);
