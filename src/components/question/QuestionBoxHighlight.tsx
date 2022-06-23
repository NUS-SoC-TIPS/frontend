import { ReactElement } from 'react';
import { Box } from '@chakra-ui/react';

import { Question } from 'types/models/question';

import { QuestionBox } from './QuestionBox';

interface Props {
  question: Question;
}

export const QuestionBoxHighlight = ({
  question,
}: Props): ReactElement<Props, typeof Box> => {
  return (
    <Box
      _hover={{ bg: 'whiteAlpha.300' }}
      bg="whiteAlpha.200"
      borderRadius="lg"
      p={3}
    >
      <QuestionBox question={question} withBox={false} />
    </Box>
  );
};
