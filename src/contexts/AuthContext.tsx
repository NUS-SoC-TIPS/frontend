import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import { getAdditionalUserInfo } from 'firebase/auth';

import { ErrorBanner } from 'components/errorBanner';
import { Loading } from 'components/loading';
import {
  getSelf,
  login as apiLogin,
  loginDev as apiLoginDev,
  logout as apiLogout,
} from 'lib/auth';
import { signInWithFirebase } from 'lib/firebase';
import { UserSelf } from 'types/api/users';

export interface AuthContextInterface {
  data: UserSelf | null;
  login(): Promise<void>;
  loginDev(): Promise<void>;
  logout(): Promise<void>;
  isLoggingIn: boolean;
}

export const AuthContext = createContext<AuthContextInterface | undefined>(
  undefined,
);

const AuthProvider = (props: PropsWithChildren<unknown>): ReactElement => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<UserSelf | null>(null);
  const [isError, setIsError] = useState(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    setIsError(false);

    getSelf()
      .then((user) => {
        setIsLoading(false);
        setData(user);
        setIsError(false);
        setHasFetchedOnce(true);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
        setHasFetchedOnce(true);
      });
  }, []);

  useLayoutEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!hasFetchedOnce) {
    if (isLoading) {
      return <Loading />;
    }
    if (isError) {
      return <ErrorBanner />;
    }
  }

  const login = async (): Promise<void> => {
    setIsLoggingIn(true);
    const response = await signInWithFirebase().catch((e: Error) => {
      setIsLoggingIn(false);
      return Promise.reject(e);
    });
    if (!response) {
      setIsLoggingIn(false);
      return Promise.reject(new Error('Failed to sign in'));
    }
    const token = await response.user.getIdToken();
    const additionalInfo = getAdditionalUserInfo(response);
    const githubUsername = additionalInfo?.username;
    const name =
      (additionalInfo?.profile?.name as string | null) ??
      response.user.displayName ??
      githubUsername;
    // TODO: Provide a default photo url and null coalesce it
    const photoUrl = (additionalInfo?.profile?.avatar_url ??
      response.user.photoURL) as string | undefined;
    const profileUrl =
      additionalInfo?.profile?.html_url ?? githubUsername
        ? `https://github.com/${githubUsername}`
        : undefined;

    if (!githubUsername || !photoUrl || !profileUrl || !name) {
      setIsLoggingIn(false);
      return Promise.reject(new Error('Missing credentials'));
    }

    return apiLogin({ token, name, githubUsername, photoUrl, profileUrl })
      .then(() => {
        fetchData();
        setIsLoggingIn(false);
      })
      .catch((e) => {
        setIsLoggingIn(false);
        return Promise.reject(e);
      });
  };

  const loginDev = async (): Promise<void> => {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('Should only be called in development');
    }
    setIsLoggingIn(true);
    return apiLoginDev()
      .then(() => {
        fetchData();
        setIsLoggingIn(false);
      })
      .catch((e) => {
        setIsLoggingIn(false);
        return Promise.reject(e);
      });
  };

  const logout = (): Promise<void> => apiLogout().then(fetchData);

  return (
    <AuthContext.Provider
      value={{ data, login, loginDev, logout, isLoggingIn }}
      {...props}
    />
  );
};

const useAuth = (): AuthContextInterface => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
