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
import { getSelf, login as apiLogin, logout as apiLogout } from 'lib/auth';
import { signInWithFirebase } from 'lib/firebase';
import { User } from 'types/models/user';

export interface AuthContextInterface {
  data: User | null;
  login(): Promise<void>;
  logout(): Promise<void>;
}

export const AuthContext = createContext<AuthContextInterface | undefined>(
  undefined,
);

const AuthProvider = (props: PropsWithChildren<unknown>): ReactElement => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<User | null>(null);
  const [isError, setIsError] = useState(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

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
    const response = await signInWithFirebase();
    const token = await response.user.getIdToken();
    const additionalInfo = getAdditionalUserInfo(response);
    const githubUsername = additionalInfo?.username;
    // TODO: Provide a default photo url and null coalesce it
    const photoUrl = (additionalInfo?.profile?.avatar_url ??
      response.user.photoURL) as string | undefined;
    const profileUrl =
      additionalInfo?.profile?.html_url ?? githubUsername
        ? `https://github.com/${githubUsername}`
        : undefined;

    if (!githubUsername || !photoUrl || !profileUrl) {
      return Promise.reject(new Error('Missing credentials'));
    }

    return apiLogin({ token, githubUsername, photoUrl, profileUrl })
      .then(fetchData)
      .catch((e: Error) => Promise.reject(e));
  };

  const logout = (): Promise<void> => apiLogout().then(fetchData);

  return <AuthContext.Provider value={{ data, login, logout }} {...props} />;
};

const useAuth = (): AuthContextInterface => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
