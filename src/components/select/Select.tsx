import { ReactElement } from 'react';
import { PropsOf, SystemStyleObject } from '@chakra-ui/react';
import { Select as ChakraSelect } from 'chakra-react-select';

import { getChakraStyles } from './chakraStyles';

interface Props extends Omit<PropsOf<typeof ChakraSelect>, 'noOptionsMessage'> {
  noOptionsMessage?: string;
  containerStyles?: SystemStyleObject;
}

export const Select = ({
  noOptionsMessage,
  containerStyles = {},
  ...props
}: Props): ReactElement<Props, typeof ChakraSelect> => {
  return (
    <ChakraSelect
      chakraStyles={getChakraStyles(containerStyles)}
      isClearable={true}
      noOptionsMessage={
        noOptionsMessage ? (): string => noOptionsMessage : undefined
      }
      selectedOptionColor="blue"
      {...props}
    />
  );
};
