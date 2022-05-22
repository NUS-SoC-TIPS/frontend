import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  useMemo,
} from 'react';
import { ButtonGroup, ButtonGroupProps, useRadioGroup } from '@chakra-ui/react';

import { Props as RadioButtonProps } from './RadioButton';

interface Props<T>
  extends Omit<ButtonGroupProps, 'onChange' | 'variant' | 'isAttached'> {
  name?: string;
  value?: T;
  defaultValue?: string;
  onChange?: (value: T) => void;
}

export const RadioButtonGroup = <T extends string>(
  props: Props<T>,
): ReactElement<Props<T>, typeof ButtonGroup> => {
  const { children, name, defaultValue, value, onChange, ...rest } = props;
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    defaultValue,
    value,
    onChange,
  });

  const buttons = useMemo(
    () =>
      Children.toArray(children)
        .filter<React.ReactElement<RadioButtonProps>>(isValidElement)
        .map((button, index, array) => {
          const isFirstItem = index === 0;
          const isLastItem = array.length === index + 1;

          const styleProps = Object.assign({
            ...(isFirstItem && !isLastItem ? { borderRightRadius: 0 } : {}),
            ...(!isFirstItem && isLastItem ? { borderLeftRadius: 0 } : {}),
            ...(!isFirstItem && !isLastItem ? { borderRadius: 0 } : {}),
            ...(!isLastItem ? { mr: '-px' } : {}),
          });

          return cloneElement(button, {
            ...styleProps,
            radioProps: getRadioProps({
              value: button.props.value,
              disabled: props.isDisabled ?? button.props.isDisabled,
            }),
          });
        }),
    [children, getRadioProps, props.isDisabled],
  );

  return (
    <ButtonGroup
      display="flex"
      isAttached={true}
      variant="outline"
      {...getRootProps(rest)}
    >
      {buttons}
    </ButtonGroup>
  );
};
