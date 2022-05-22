import { ReactElement } from 'react';
import { FormControl, FormLabel, Stack } from '@chakra-ui/react';

import { RadioButton, RadioButtonGroup } from 'components/radio';
import { Question, QuestionDifficulty } from 'types/models/question';

interface Props {
  question: Question;
}

export const DifficultyFormControl = ({
  question,
}: Props): ReactElement<Props, typeof FormControl> => {
  return (
    <FormControl id="difficulty">
      <Stack
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        spacing={{ base: '1.5', md: '8' }}
      >
        <FormLabel variant="inline">Difficulty</FormLabel>
        <RadioButtonGroup
          maxW={{ md: '3xl' }}
          size="md"
          value={question.difficulty}
          w="100%"
        >
          <RadioButton
            _active={{}}
            _focus={{}}
            _hover={{ cursor: 'not-allowed' }}
            value={QuestionDifficulty.EASY}
          >
            Easy
          </RadioButton>
          <RadioButton
            _active={{}}
            _focus={{}}
            _hover={{ cursor: 'not-allowed' }}
            value={QuestionDifficulty.MEDIUM}
          >
            Medium
          </RadioButton>
          <RadioButton
            _active={{}}
            _focus={{}}
            _hover={{ cursor: 'not-allowed' }}
            value={QuestionDifficulty.HARD}
          >
            Hard
          </RadioButton>
        </RadioButtonGroup>
      </Stack>
    </FormControl>
  );
};
