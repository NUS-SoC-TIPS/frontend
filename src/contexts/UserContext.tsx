import { createContext, PropsWithChildren } from 'react';
import { useContext } from 'react';
import { ReactElement } from 'react';

import { User } from 'types/models/user';

import { useAuth } from './AuthContext';

export const UserContext = createContext<User | null | undefined>(undefined);

// Allows user data to be accessible from everywhere
const UserProvider = (props: PropsWithChildren<unknown>): ReactElement => {
  const { data } = useAuth();
  return <UserContext.Provider value={data} {...props} />;
};

const useUser = (): User | null => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserProvider, useUser };
