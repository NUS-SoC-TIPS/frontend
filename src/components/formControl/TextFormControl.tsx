import { ReactElement } from 'react';
import { Input, InputGroup } from '@chakra-ui/react';

import { FormControl } from './FormControl';

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (name: string) => void;
}

export const TextFormControl = ({
  id,
  label,
  value,
  onChange,
}: Props): ReactElement<Props, typeof FormControl> => {
  return (
    <FormControl id={id} label={label}>
      <InputGroup>
        <Input
          onChange={(event): void => onChange(event.target.value)}
          value={value}
        />
      </InputGroup>
    </FormControl>
  );
};
