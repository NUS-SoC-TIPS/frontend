import { ReactElement } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
} from '@chakra-ui/react';

import { Question, QuestionSource } from 'types/models/question';

interface Props {
  question: Question;
}

export const UrlFormControl = ({
  question,
}: Props): ReactElement<Props, typeof FormControl> => {
  const getUrl = (): string => {
    switch (question.source) {
      case QuestionSource.LEETCODE:
        return `leetcode.com/problems/${question.slug}`;
      default:
        return '';
    }
  };

  return (
    <FormControl id="url">
      <Stack
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        spacing={{ base: '1.5', md: '8' }}
      >
        <FormLabel variant="inline">URL</FormLabel>
        <InputGroup maxW={{ md: '3xl' }}>
          <InputLeftAddon>https://</InputLeftAddon>
          <Input
            _active={{}}
            _focus={{}}
            _hover={{ cursor: 'not-allowed' }}
            readOnly={true}
            value={getUrl()}
          />
        </InputGroup>
      </Stack>
    </FormControl>
  );
};
