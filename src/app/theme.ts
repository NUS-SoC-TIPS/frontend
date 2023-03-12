import { theme as proTheme } from '@chakra-ui/pro-theme';
import { extendTheme, theme as baseTheme } from '@chakra-ui/react';

import '@fontsource/inter/variable.css';

export const theme = extendTheme(
  {
    colors: { ...baseTheme.colors, brand: baseTheme.colors.blue },
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
    components: {
      Menu: {
        baseStyle: {
          item: {
            _focus: { bg: 'gray.700' },
          },
        },
      },
    },
  },
  proTheme,
  {
    components: {
      Button: {
        baseStyle: {
          fontWeight: 'medium',
        },
      },
    },
  },
);
