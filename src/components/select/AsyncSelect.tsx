import { ReactElement } from 'react';
import { PropsOf } from '@chakra-ui/react';
import { AsyncSelect as ChakraAsyncSelect } from 'chakra-react-select';

import { getChakraStyles } from './chakraStyles';

interface Props
  extends Omit<PropsOf<typeof ChakraAsyncSelect>, 'noOptionsMessage'> {
  noOptionsMessage?: string;
}

export const AsyncSelect = ({
  noOptionsMessage,
  ...props
}: Props): ReactElement<Props, typeof ChakraAsyncSelect> => {
  return (
    <ChakraAsyncSelect
      chakraStyles={getChakraStyles()}
      isClearable={true}
      noOptionsMessage={
        noOptionsMessage ? (): string => noOptionsMessage : undefined
      }
      selectedOptionColor="blue"
      {...props}
    />
  );
};
