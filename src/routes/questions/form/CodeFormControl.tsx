import { ReactElement } from 'react';
import { Box, FormControl, FormLabel, Stack } from '@chakra-ui/react';

import { SimpleCodeEditor } from 'components/codeEditor';
import { Language } from 'types/models/code';

interface Props {
  code: string;
  language: Language | null;
  onChange: (code: string) => void;
}

export const CodeFormControl = ({
  code,
  language,
  onChange,
}: Props): ReactElement<Props, typeof FormControl> => {
  return (
    <FormControl id="code">
      <Stack
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        spacing={{ base: '1.5', md: '8' }}
      >
        <FormLabel variant="inline">Code Written</FormLabel>
        <Box maxW={{ md: '3xl' }} w="100%">
          <SimpleCodeEditor
            height="15rem"
            language={language}
            onChange={onChange}
            value={code}
            width="100%"
          />
        </Box>
      </Stack>
    </FormControl>
  );
};
