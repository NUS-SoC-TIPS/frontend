import { ReactElement } from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import { Landing } from 'routes/landing';

import { theme } from './theme';

export const App = (): ReactElement => (
  <ChakraProvider theme={theme}>
    <Landing />
  </ChakraProvider>
);
