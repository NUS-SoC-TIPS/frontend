import { memo, ReactElement } from 'react';
import { Badge, Box, Link, Stack, Text } from '@chakra-ui/react';

import { DIFFICULTY_TO_STRING, SOURCE_TO_STRING } from 'constants/enumStrings';
import { QuestionBase } from 'types/api/questions';
import { getQuestionUrlWithHttps } from 'utils/questionUtils';

interface Props {
  question: QuestionBase;
  withBox?: boolean;
  withDifficulty?: boolean;
  noOfLines?: number;
}

const RawQuestionBox = ({
  question,
  withBox = true,
  withDifficulty = true,
  noOfLines = 1,
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
        <Text
          color="emphasized"
          fontSize="sm"
          fontWeight="medium"
          noOfLines={noOfLines}
          textAlign="left"
        >
          {question.name}
        </Text>
        <Link
          color="muted"
          fontSize="sm"
          href={getQuestionUrlWithHttps(question)}
          isExternal={true}
          noOfLines={1}
          textAlign="left"
        >
          {SOURCE_TO_STRING[question.source]}
        </Link>
      </Box>
      {withDifficulty && (
        <Badge colorScheme="blue" variant="subtle">
          {DIFFICULTY_TO_STRING[question.difficulty]}
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

export const QuestionBox = memo(RawQuestionBox, propsAreEqual);
