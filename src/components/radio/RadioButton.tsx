import { ReactElement } from 'react';
import {
  Box,
  Button,
  ButtonProps,
  chakra,
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
  const { state, getInputProps, getRadioProps, htmlProps, getLabelProps } =
    useRadio(radioProps);
  const id = useId(undefined, 'radio-button');

  return (
    <chakra.label
      {...htmlProps}
      cursor="pointer"
      flex={1}
      sx={{
        '.focus-visible + [data-focus]': {
          boxShadow: 'outline',
          zIndex: 1,
        },
      }}
    >
      <input {...getInputProps({})} aria-labelledby={id} hidden={true} />
      <Button
        _focus={{ boxShadow: 'none' }}
        _hover={{ bg: 'bg.subtle' }}
        as="div"
        bg={state.isChecked ? 'bg.subtle' : 'bg.surface'}
        borderColor="border.emphasized"
        color="inherit"
        id={id}
        w="100%"
        {...getRadioProps()}
        {...getLabelProps()}
        {...rest}
      />
    </chakra.label>
  );
};
