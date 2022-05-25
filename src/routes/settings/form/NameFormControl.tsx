import { ReactElement } from 'react';
import { Input, InputGroup } from '@chakra-ui/react';

import { FormControl } from 'components/formControl';

interface Props {
  name: string;
  onChange: (name: string) => void;
}

export const NameFormControl = ({
  name,
  onChange,
}: Props): ReactElement<Props, typeof FormControl> => {
  return (
    <FormControl id="name" label="Name">
      <InputGroup>
        <Input
          onChange={(event): void => onChange(event.target.value)}
          value={name}
        />
      </InputGroup>
    </FormControl>
  );
};
