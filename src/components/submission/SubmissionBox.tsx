import { memo, ReactElement } from 'react';
import { Badge, Box, Stack, Text } from '@chakra-ui/react';

import { difficultyToString } from 'constants/enumStrings';
import { Question } from 'types/models/question';
import { QuestionSubmission } from 'types/models/submission';
import { formatDate } from 'utils/dateUtils';

interface Props {
  submission: QuestionSubmission;
  question: Question;
  withBox?: boolean;
  noOfLines?: number;
}

const RawSubmissionBox = ({
  submission,
  question,
  withBox = true,
  noOfLines,
}: Props): ReactElement<Props, typeof Box | typeof Stack> => {
  const wrapComponent = (
    component: ReactElement<Props, typeof Stack>,
  ): ReactElement<Props, typeof Box | typeof Stack> => {
    if (withBox) {
      return (
        <Box
          borderRadius="lg"
          borderWidth={{ base: '1px' }}
          key={submission.id}
          p={{ base: 3, md: 4 }}
        >
          {component}
        </Box>
      );
    }
    return component;
  };

  return wrapComponent(
    <Stack align="center" direction="row" justify="space-between" spacing={5}>
      <Box fontSize="sm">
        <Text color="empahsized" fontWeight="medium" noOfLines={noOfLines}>
          {question.name}
        </Text>
        <Text color="muted">{formatDate(submission.createdAt)}</Text>
      </Box>
      <Badge colorScheme="blue" variant="subtle">
        {difficultyToString[question.difficulty]}
      </Badge>
    </Stack>,
  );
};

const propsAreEqual = (prevProps: Props, nextProps: Props): boolean => {
  return (
    prevProps.submission.id === nextProps.submission.id &&
    prevProps.noOfLines === nextProps.noOfLines &&
    prevProps.submission.createdAt.getTime() ===
      nextProps.submission.createdAt.getTime() &&
    prevProps.question.name === nextProps.question.name &&
    prevProps.question.difficulty === nextProps.question.difficulty
  );
};

export const SubmissionBox = memo(RawSubmissionBox, propsAreEqual);
