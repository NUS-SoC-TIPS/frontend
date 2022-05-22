import { ReactElement } from 'react';
import {
  Box,
  Button,
  ButtonProps,
  useId,
  useRadio,
  UseRadioProps,
} from '@chakra-ui/react';

export interface Props extends ButtonProps {
  value: string;
  radioProps?: UseRadioProps;
}

export const RadioButton = (props: Props): ReactElement<Props, typeof Box> => {
  const { radioProps, ...rest } = props;
  const { getInputProps, getCheckboxProps, getLabelProps } =
    useRadio(radioProps);
  const id = useId(undefined, 'radio-button');

  const inputProps = getInputProps();
  const checkboxProps = getCheckboxProps();
  const labelProps = getLabelProps();

  return (
    <Box
      as="label"
      cursor="pointer"
      {...labelProps}
      flex={1}
      sx={{
        '.focus-visible + [data-focus]': {
          boxShadow: 'outline',
          zIndex: 1,
        },
      }}
    >
      <input {...inputProps} aria-labelledby={id} />
      <Button
        _focus={{ boxShadow: 'none' }}
        as="div"
        id={id}
        w="100%"
        {...checkboxProps}
        {...rest}
      />
    </Box>
  );
};
