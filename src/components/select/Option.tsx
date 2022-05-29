import { ReactElement } from 'react';
import {
  Box,
  SystemStyleObject,
  useColorModeValue,
  useStyles,
} from '@chakra-ui/react';
import { GroupBase, OptionProps, SizeProps } from 'chakra-react-select';
import { ThemeObject } from 'chakra-react-select/dist/types/types';

const Option = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
>(
  props: OptionProps<Option, IsMulti, Group>,
): ReactElement<typeof Box> => {
  const {
    className,
    cx,
    innerRef,
    innerProps,
    children,
    isFocused,
    isDisabled,
    isSelected,
    selectProps: {
      size,
      selectedOptionStyle,
      selectedOptionColor,
      chakraStyles,
    },
  } = props;

  const itemStyles = useStyles().item as ThemeObject;

  const paddings: SizeProps = {
    sm: '0.3rem 0.6rem',
    md: '0.4rem 0.8rem',
    lg: '0.5rem 1rem',
  };

  /**
   * Use the same selected color as the border of the select component
   *
   * @see {@link https://github.com/chakra-ui/chakra-ui/blob/13c6d2e08b61e179773be4722bb81173dd599306/packages/theme/src/components/input.ts#L73}
   */
  const selectedBg = useColorModeValue(
    `${selectedOptionColor}.500`,
    `${selectedOptionColor}.300`,
  );
  const selectedColor = useColorModeValue('white', 'black');
  const focusBg = useColorModeValue('gray.50', 'gray.700');

  const shouldHighlight: boolean =
    selectedOptionStyle === 'color' && isSelected;

  const initialStyles: SystemStyleObject = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    textAlign: 'start',
    fontSize: size,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    padding: paddings[size!],
    bg: isFocused ? focusBg : 'transparent',
    ...(shouldHighlight && {
      bg: selectedBg,
      color: selectedColor,
      _active: { bg: selectedBg },
    }),
    ...(isDisabled && itemStyles._disabled),
    ...(isDisabled && { _active: {} }),
  };

  const sx: SystemStyleObject = chakraStyles?.option
    ? chakraStyles.option(initialStyles, props)
    : initialStyles;

  return (
    <Box
      className={cx(
        {
          option: true,
          'option--is-disabled': isDisabled,
          'option--is-focused': isFocused,
          'option--is-selected': isSelected,
        },
        className,
      )}
      ref={innerRef}
      role="button"
      sx={sx}
      {...innerProps}
      aria-disabled={isDisabled ? true : undefined}
      data-disabled={isDisabled ? true : undefined}
    >
      {children}
    </Box>
  );
};

export const customComponents = {
  Option,
};
