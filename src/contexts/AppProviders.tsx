import { PropsWithChildren, ReactElement } from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import { theme } from 'app/theme';

import { AuthProvider } from './AuthContext';
import { UserProvider } from './UserContext';

const AppProviders = ({
  children,
}: PropsWithChildren<unknown>): ReactElement<
  PropsWithChildren<unknown>,
  typeof ChakraProvider
> => {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <UserProvider>{children}</UserProvider>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default AppProviders;
