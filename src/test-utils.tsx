import { ReactElement, ReactNode } from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';

const AllProviders = ({ children }: { children?: ReactNode }): ReactElement => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);

const customRender = (
  ui: ReactElement,
  options?: RenderOptions,
): RenderResult => render(ui, { wrapper: AllProviders, ...options });

export { customRender as render };
