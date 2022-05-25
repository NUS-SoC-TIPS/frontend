import { PropsWithChildren, ReactElement } from 'react';
import {
  Box,
  FormControl as ChakraFormControl,
  FormLabel,
  Stack,
} from '@chakra-ui/react';

interface Props {
  id: string;
  label: string;
}

export const FormControl = ({
  id,
  label,
  children,
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
          {children}
        </Box>
      </Stack>
    </ChakraFormControl>
  );
};
