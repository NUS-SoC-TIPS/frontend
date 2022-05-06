import { theme as proTheme } from '@chakra-ui/pro-theme';
import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme(
  {
    colors: { ...proTheme.colors, brand: proTheme.colors.blue },
    config: {
      initialColorMode: 'dark',
      useSystemColorMode: false,
    },
  },
  proTheme,
);
