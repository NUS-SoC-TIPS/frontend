import { PropsWithChildren, ReactElement } from 'react';
import {
  Box,
  FormControl as ChakraFormControl,
  FormLabel,
  Input,
  Skeleton,
  Stack,
} from '@chakra-ui/react';

interface Props {
  id: string;
  label: string;
}

export const FormControlSkeleton = ({
  id,
  label,
}: PropsWithChildren<Props>): ReactElement<
  PropsWithChildren<Props>,
  typeof ChakraFormControl
> => {
  return (
    <ChakraFormControl id={id}>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        spacing={{ base: 1.5, md: 8 }}
      >
        <FormLabel variant="inline">{label}</FormLabel>
        <Box maxW={{ md: '3xl' }} w="100%">
          <Skeleton>
            <Input />
          </Skeleton>
        </Box>
      </Stack>
    </ChakraFormControl>
  );
};
