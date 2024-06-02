import { ReactElement } from 'react';

import { FormControl } from '@/components/formControl';
import { RadioButton, RadioButtonGroup } from '@/components/radio';
import { QuestionDifficulty } from '@/types/models/question';

interface Props {
  question: { difficulty: QuestionDifficulty };
}

export const DifficultyFormControl = ({
  question,
}: Props): ReactElement<Props, typeof FormControl> => {
  return (
    <FormControl id="difficulty" label="Difficulty">
      <RadioButtonGroup size="md" value={question.difficulty} w="100%">
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
    </FormControl>
  );
};
