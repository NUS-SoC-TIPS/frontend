import { ReactElement } from 'react';
import { PropsOf } from '@chakra-ui/react';
import { AsyncSelect as ChakraAsyncSelect } from 'chakra-react-select';

import { customComponents } from './Option';
import { useChakraSelectStyles } from './useChakraSelectStyles';

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
      chakraStyles={useChakraSelectStyles()}
      components={customComponents}
      isClearable={true}
      noOptionsMessage={
        noOptionsMessage ? (): string => noOptionsMessage : undefined
      }
      selectedOptionColor="blue"
      {...props}
    />
  );
};
