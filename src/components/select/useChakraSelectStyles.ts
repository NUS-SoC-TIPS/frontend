import { useColorModeValue } from '@chakra-ui/react';
import { ChakraStylesConfig, GroupBase } from 'chakra-react-select';

export const useChakraSelectStyles = (): ChakraStylesConfig<
  unknown,
  boolean,
  GroupBase<unknown>
> => {
  const backgroundColor = 'bg.surface';
  const foregroundColor = 'bg.subtle';
  const controlHoverBorderColor = useColorModeValue('gray.300', 'gray.600');
  const controlFocusBorderColor = useColorModeValue('brand.500', 'brand.200');
  const controlFocusBoxShadow = useColorModeValue(
    '0px 0px 0px 1px var(--chakra-colors-brand-500)',
    '0px 0px 0px 1px var(--chakra-colors-brand-200)',
  );

  return {
    container: (styles) => ({
      ...styles,
      width: '100%',
    }),
    control: (styles) => ({
      ...styles,
      background: backgroundColor,
      _hover: {
        borderColor: controlHoverBorderColor,
        cursor: 'text',
      },
      _focus: {
        borderColor: controlFocusBorderColor,
        zIndex: 1,
        boxShadow: controlFocusBoxShadow,
      },
      _disabled: {
        borderColor: 'border.default',
        cursor: 'not-allowed',
      },
    }),
    dropdownIndicator: (styles) => ({
      ...styles,
      background: foregroundColor,
    }),
    menuList: (styles) => ({
      ...styles,
      background: backgroundColor,
    }),
    menu: (styles) => ({
      ...styles,
      zIndex: 10,
    }),
    option: (styles) => ({
      ...styles,
    }),
    crossIcon: (styles) => ({
      ...styles,
      boxSize: '2.5',
    }),
    clearIndicator: (styles) => ({
      ...styles,
      height: '100%',
      width: '9',
      bg: 'none',
    }),
  };
};
