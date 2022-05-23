import { ReactElement } from 'react';
import { Badge, Box, Stack, Text } from '@chakra-ui/react';

import { difficultyToString } from 'constants/enumStrings';
import { Question } from 'types/models/question';
import { QuestionSubmission } from 'types/models/submission';
import { formatDate } from 'utils/dateUtils';

interface Props {
  submission: QuestionSubmission;
  question: Question;
}

export const SubmissionBox = ({
  submission,
  question,
}: Props): ReactElement<Props, typeof Box> => {
  return (
    <Box
      borderRadius="lg"
      borderWidth={{ base: '1px' }}
      key={submission.id}
      p={{ base: '3', md: '4' }}
    >
      <Stack align="center" direction="row" justify="space-between" spacing="5">
        <Box fontSize="sm">
          <Text color="empahsized" fontWeight="medium">
            {question.name}
          </Text>
          <Text color="muted">{formatDate(submission.createdAt)}</Text>
        </Box>
        <Badge colorScheme="blue" variant="subtle">
          {difficultyToString[question.difficulty]}
        </Badge>
      </Stack>
    </Box>
  );
};
