import { ReactElement } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Stack,
} from '@chakra-ui/react';

interface Props {
  name: string;
  onChange: (name: string) => void;
}

export const NameFormControl = ({
  name,
  onChange,
}: Props): ReactElement<Props, typeof FormControl> => {
  return (
    <FormControl id="name">
      <Stack
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        spacing={{ base: '1.5', md: '8' }}
      >
        <FormLabel variant="inline">Name</FormLabel>
        <InputGroup maxW={{ md: '3xl' }}>
          <Input
            onChange={(event): void => onChange(event.target.value)}
            value={name}
          />
        </InputGroup>
      </Stack>
    </FormControl>
  );
};
