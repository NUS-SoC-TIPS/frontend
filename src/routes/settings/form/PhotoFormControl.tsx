import { ReactElement } from 'react';
import { Avatar, FormControl, FormLabel, Stack } from '@chakra-ui/react';

import { ImageDropzone } from 'components/dropzone';

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
    <FormControl id="name">
      <Stack
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        spacing={{ base: '1.5', md: '8' }}
      >
        <FormLabel variant="inline">Photo</FormLabel>
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          maxW={{ md: '3xl' }}
          spacing={{ base: '3', md: '5' }}
          width="full"
        >
          <Avatar name={name} size="lg" src={photoUrl} />
          <ImageDropzone onChange={onChange} width="full" />
        </Stack>
      </Stack>
    </FormControl>
  );
};
