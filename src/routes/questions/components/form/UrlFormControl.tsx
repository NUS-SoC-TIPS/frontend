import { ReactElement } from 'react';
import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';

import { FormControl } from '@/components/formControl';
import { QuestionSource } from '@/types/models/question';
import { getQuestionUrl } from '@/utils/questionUtils';

interface Props {
  question: { source: QuestionSource; slug: string };
}

export const UrlFormControl = ({
  question,
}: Props): ReactElement<Props, typeof FormControl> => {
  return (
    <FormControl id="url" label="URL">
      <InputGroup>
        <InputLeftAddon>https://</InputLeftAddon>
        <Input
          _active={{}}
          _focus={{
            borderColor: 'border.default',
          }}
          _hover={{ cursor: 'not-allowed' }}
          readOnly={true}
          value={getQuestionUrl(question)}
        />
      </InputGroup>
    </FormControl>
  );
};
