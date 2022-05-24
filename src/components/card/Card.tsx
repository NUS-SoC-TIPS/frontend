import { ReactElement } from 'react';
import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';

const DEFAULT_PROPS: Partial<BoxProps> = {
  bg: 'bg-surface',
  borderRadius: 'lg',
  px: { base: 4, md: 6 },
  py: { base: 5, md: 6 },
};

export const Card = (props: BoxProps): ReactElement<typeof Box> => (
  <Box
    {...{
      ...DEFAULT_PROPS,
      ...props,
      boxShadow: useColorModeValue('sm', 'sm-dark'),
    }}
  />
);
