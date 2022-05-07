import { theme as proTheme } from '@chakra-ui/pro-theme';
import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme(
  {
    colors: { ...proTheme.colors, brand: proTheme.colors.blue },
    config: {
      initialColorMode: 'dark',
      useSystemColorMode: false,
    },
    semanticTokens: {
      colors: {
        error: {
          default: 'red.600',
          _dark: 'red.400',
        },
        'error-subtle': {
          default: 'red.500',
          _dark: 'red.300',
        },
      },
    },
  },
  proTheme,
);
