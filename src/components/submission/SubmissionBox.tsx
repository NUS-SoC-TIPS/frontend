import { memo, ReactElement } from 'react';
import { Badge, Box, Stack, Text } from '@chakra-ui/react';

import { difficultyToString, sourceToString } from 'constants/enumStrings';
import { Question } from 'types/models/question';

interface Props {
  question: Question;
  withBox?: boolean;
  withDifficulty?: boolean;
  noOfLines?: number;
}

const RawSubmissionBox = ({
  question,
  withBox = true,
  withDifficulty = true,
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
        <Text color="muted">{sourceToString[question.source]}</Text>
      </Box>
      {withDifficulty && (
        <Badge colorScheme="blue" variant="subtle">
          {difficultyToString[question.difficulty]}
        </Badge>
      )}
    </Stack>,
  );
};

const propsAreEqual = (prevProps: Props, nextProps: Props): boolean => {
  return (
    prevProps.noOfLines === nextProps.noOfLines &&
    prevProps.question.name === nextProps.question.name &&
    prevProps.question.difficulty === nextProps.question.difficulty &&
    prevProps.question.source === nextProps.question.source
  );
};

export const SubmissionBox = memo(RawSubmissionBox, propsAreEqual);
