import { ReactElement } from 'react';
import { Box } from '@chakra-ui/react';

import { QuestionBase } from '@/types/api/questions';

import { QuestionBox } from './QuestionBox';

interface Props {
  question: QuestionBase;
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
