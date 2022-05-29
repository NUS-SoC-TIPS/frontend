import { useColorModeValue } from '@chakra-ui/react';
import { ChakraStylesConfig, GroupBase } from 'chakra-react-select';

export const useChakraSelectStyles = (): ChakraStylesConfig<
  unknown,
  boolean,
  GroupBase<unknown>
> => {
  const backgroundColor = useColorModeValue('white', 'gray.800');
  const foregroundColor = useColorModeValue('gray.50', 'gray.700');
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
  };
};
