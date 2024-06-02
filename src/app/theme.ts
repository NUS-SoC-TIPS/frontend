import { theme as proTheme } from '@chakra-ui/pro-theme';
import { extendTheme } from '@chakra-ui/react';

import '@fontsource-variable/inter';

const baseTheme = extendTheme(proTheme);

const extension = {
  colors: { ...baseTheme.colors, brand: baseTheme.colors.blue },
  fonts: {
    heading: "'Inter Variable', -apple-system, system-ui, sans-serif",
    body: "'Inter Variable', -apple-system, system-ui, sans-serif",
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  components: {
    Link: {
      variants: {
        underline: {
          _before: 'none',
          _hover: {
            textDecoration: 'underline',
            _before: 'none',
          },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: 'bg.surface',
          },
        },
      },
    },
    Button: {
      baseStyle: {
        fontWeight: 'medium',
      },
    },
    Menu: {
      baseStyle: {
        item: {
          _focus: { bg: 'gray.700' },
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: 'xl',
        textTransform: 'none',
        fontWeight: 'regular',
      },
    },
  },
};

const extendedThemeWithoutNumberInput = extendTheme(extension, baseTheme);

// We do this as a separate step so as to get the final extended config for Input
const extensionForNumberInput = {
  components: {
    NumberInput: extendedThemeWithoutNumberInput.components.Input,
  },
};

const theme = extendTheme(
  extensionForNumberInput,
  extendedThemeWithoutNumberInput,
);

export { theme };
