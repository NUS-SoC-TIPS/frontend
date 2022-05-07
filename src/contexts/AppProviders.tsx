import { PropsWithChildren, ReactElement } from 'react';

import { AuthProvider } from './AuthContext';
import { UserProvider } from './UserContext';

const AppProviders = ({
  children,
}: PropsWithChildren<unknown>): ReactElement => {
  return (
    <AuthProvider>
      <UserProvider>{children}</UserProvider>
    </AuthProvider>
  );
};

export default AppProviders;
