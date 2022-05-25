import { ReactElement } from 'react';
import { PropsOf } from '@chakra-ui/react';
import { Select as ChakraSelect } from 'chakra-react-select';

import { getChakraStyles } from './chakraStyles';

interface Props extends Omit<PropsOf<typeof ChakraSelect>, 'noOptionsMessage'> {
  noOptionsMessage?: string;
}

export const Select = ({
  noOptionsMessage,
  ...props
}: Props): ReactElement<Props, typeof ChakraSelect> => {
  return (
    <ChakraSelect
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
