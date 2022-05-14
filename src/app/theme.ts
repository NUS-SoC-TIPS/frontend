import { theme as proTheme } from '@chakra-ui/pro-theme';
import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme(
  {
    colors: { ...proTheme.colors, brand: proTheme.colors.blue },
    config: {
      // This is a hacky fix for an issue where ChakraUI doesn't load the theme correctly
      // at first. What we do is to set the initial theme to light then change it to dark
      // in App.tsx, which triggers a re-rendering and loads the theme correctly thereafter.
      initialColorMode: 'light',
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
