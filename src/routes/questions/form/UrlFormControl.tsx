import { ReactElement } from 'react';
import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';

import { FormControl } from 'components/formControl';
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
      case QuestionSource.KATTIS:
        return `open.kattis.com/problems/${question.slug}`;
      default:
        return '';
    }
  };

  return (
    <FormControl id="url" label="URL">
      <InputGroup>
        <InputLeftAddon>https://</InputLeftAddon>
        <Input
          _active={{}}
          _focus={{
            borderColor: 'border',
          }}
          _hover={{ cursor: 'not-allowed' }}
          readOnly={true}
          value={getUrl()}
        />
      </InputGroup>
    </FormControl>
  );
};
