import { ReactElement } from 'react';
import { Avatar, Stack } from '@chakra-ui/react';

import { ImageDropzone } from 'components/dropzone';
import { FormControl } from 'components/formControl';

interface Props {
  photoUrl: string;
  name: string;
  onChange: (photoUrl: string) => void;
}

export const PhotoFormControl = ({
  photoUrl,
  name,
  onChange,
}: Props): ReactElement<Props, typeof FormControl> => {
  return (
    <FormControl id="name" label="Photo">
      <Stack
        direction={{ base: 'column', sm: 'row' }}
        spacing={{ base: 3, md: 5 }}
        width="full"
      >
        <Avatar name={name} size="lg" src={photoUrl} />
        <ImageDropzone onChange={onChange} width="full" />
      </Stack>
    </FormControl>
  );
};
