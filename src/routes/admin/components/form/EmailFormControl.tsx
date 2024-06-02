import { ReactElement } from 'react';
import { Input, InputGroup, InputRightAddon } from '@chakra-ui/react';

import { FormControl } from '@/components/formControl';
import { COHORT_EMAIL_SUFFIX } from '@/constants/urls';

interface Props {
  email: string;
  onChange: (email: string) => void;
}

export const EmailFormControl = ({
  email,
  onChange,
}: Props): ReactElement<Props, typeof FormControl> => {
  return (
    <FormControl id="email" label="Email">
      <InputGroup>
        <Input
          onChange={(event): void => onChange(event.target.value)}
          value={email}
        />
        <InputRightAddon>{COHORT_EMAIL_SUFFIX}</InputRightAddon>
      </InputGroup>
    </FormControl>
  );
};
