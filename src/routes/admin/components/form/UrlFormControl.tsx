import { ReactElement } from 'react';
import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';

import { FormControl } from '@/components/formControl';
import { COURSEMOLOGY_COURSE_URL_PREFIX } from '@/constants/urls';

interface Props {
  url: string;
  onChange: (url: string) => void;
}

export const UrlFormControl = ({
  url,
  onChange,
}: Props): ReactElement<Props, typeof FormControl> => {
  return (
    <FormControl id="url" label="URL">
      <InputGroup>
        <InputLeftAddon>{COURSEMOLOGY_COURSE_URL_PREFIX}</InputLeftAddon>
        <Input
          onChange={(event): void => onChange(event.target.value)}
          value={url}
        />
      </InputGroup>
    </FormControl>
  );
};
