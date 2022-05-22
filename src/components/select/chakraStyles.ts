import { SystemStyleObject } from '@chakra-ui/react';
import { ChakraStylesConfig, GroupBase } from 'chakra-react-select';

export const getChakraStyles = (
  containerStyles: SystemStyleObject = {},
): ChakraStylesConfig<unknown, boolean, GroupBase<unknown>> => ({
  container: (styles) => ({
    ...styles,
    width: '100%',
    ...containerStyles,
  }),
  control: (styles) => ({
    ...styles,
    background: 'gray.800',
    _hover: {
      borderColor: 'gray.600',
      cursor: 'text',
    },
    _focus: {
      borderColor: 'brand.200',
      zIndex: 1,
      boxShadow: '0px 0px 0px 1px var(--chakra-colors-brand-200)',
    },
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    background: 'gray.700',
  }),
  menuList: (styles) => ({
    ...styles,
    background: 'gray.800',
    borderColor: 'gray.700',
  }),
  menu: (styles) => ({
    ...styles,
    zIndex: 10,
  }),
  option: (styles) => ({
    ...styles,
    _hover: {
      background: 'gray.700',
    },
  }),
});
