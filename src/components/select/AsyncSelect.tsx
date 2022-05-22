import { ReactElement } from 'react';
import { PropsOf, SystemStyleObject } from '@chakra-ui/react';
import { AsyncSelect as ChakraAsyncSelect } from 'chakra-react-select';

import { getChakraStyles } from './chakraStyles';

interface Props
  extends Omit<PropsOf<typeof ChakraAsyncSelect>, 'noOptionsMessage'> {
  noOptionsMessage?: string;
  containerStyles?: SystemStyleObject;
}

export const AsyncSelect = ({
  noOptionsMessage,
  containerStyles = {},
  ...props
}: Props): ReactElement<Props, typeof ChakraAsyncSelect> => {
  return (
    <ChakraAsyncSelect
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
