import { PropsWithChildren, ReactElement } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';

import { theme } from 'app/theme';
import { AuthContext } from 'contexts/AuthContext';
import { UserContext } from 'contexts/UserContext';
import { UserSettingsConfig } from 'types/models/user';

import { emptyPromiseFunction } from './functionUtils';

interface CustomRenderOptions extends RenderOptions {
  data?: UserSettingsConfig | null;
  login?: () => Promise<void>;
  logout?: () => Promise<void>;
  isLoggingIn?: boolean;
}

type Props = PropsWithChildren<CustomRenderOptions>;

const AllProviders = ({
  children,
  data = null,
  login = emptyPromiseFunction,
  logout = emptyPromiseFunction,
  isLoggingIn = false,
}: Props): ReactElement<Props, typeof ChakraProvider> => (
  <ChakraProvider theme={theme}>
    <AuthContext.Provider
      value={{
        data,
        logout,
        login,
        isLoggingIn,
      }}
    >
      <UserContext.Provider value={data}>{children}</UserContext.Provider>
    </AuthContext.Provider>
  </ChakraProvider>
);

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions,
): RenderResult => render(ui, { wrapper: AllProviders, ...options });

export { customRender as render };
