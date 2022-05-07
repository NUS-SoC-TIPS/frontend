import { lazy, Suspense, useEffect } from 'react';
import { ReactElement } from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import { Loading } from 'components/loading';
import { useUser } from 'contexts/UserContext';
import { retryPromise } from 'utils/promiseUtils';

import { theme } from './theme';

// Code splitting with React.lazy and Suspense
type ModuleType = typeof import('./AuthenticatedApp');

const loadAuthenticatedApp = (): Promise<ModuleType> =>
  import('./AuthenticatedApp');
const AuthenticatedApp = lazy(
  () =>
    retryPromise(loadAuthenticatedApp) as Promise<
      typeof import('./AuthenticatedApp')
    >,
);
const UnauthenticatedApp = lazy(() => import('./UnauthenticatedApp'));

export const App = (): ReactElement<typeof ChakraProvider> => {
  const user = useUser();

  useEffect(() => {
    loadAuthenticatedApp();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Suspense fallback={<Loading />}>
        {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      </Suspense>
    </ChakraProvider>
  );
};
