import { PropsWithChildren, ReactElement } from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';

type Props = PropsWithChildren<RenderOptions>;

const AllProviders = ({
  children,
}: Props): ReactElement<Props, typeof ChakraProvider> => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);

const customRender = (
  ui: ReactElement,
  options?: RenderOptions,
): RenderResult => render(ui, { wrapper: AllProviders, ...options });

export { customRender as render };
