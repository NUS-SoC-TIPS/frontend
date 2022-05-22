import { ReactElement } from 'react';
import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';

const DEFAULT_PROPS: Partial<BoxProps> = {
  bg: 'bg-surface',
  borderRadius: 'lg',
  minH: '36',
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
