import { ReactElement } from 'react';
import { HiCheck } from 'react-icons/hi';
import {
  Badge,
  Box,
  Circle,
  Container,
  HStack,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

import { difficultyToString } from 'constants/enumStrings';
import { TaskStatsSubmissions } from 'types/api/stats';
import { formatDate } from 'utils/dateUtils';

interface Props {
  numQuestions: number;
  submissions: TaskStatsSubmissions[];
}

export const Submissions = ({
  submissions,
  numQuestions,
}: Props): ReactElement<typeof Box> => {
  const shownSubmissions = submissions
    .sort(
      (a, b) =>
        b.submission.createdAt.getTime() - a.submission.createdAt.getTime(),
    )
    .slice(0, numQuestions);
  const hasEnoughSubmissions = submissions.length >= numQuestions;

  return (
    <Box as="section" flex={1}>
      <Container maxW="3xl" px="0">
        <Box
          bg="bg-surface"
          borderRadius="lg"
          boxShadow={useColorModeValue('sm', 'sm-dark')}
          p={{ base: '4', md: '6' }}
        >
          <Stack spacing="4">
            <HStack justify="space-between">
              <Stack spacing="1">
                <Text fontSize="lg" fontWeight="medium">
                  Questions
                </Text>
                <Text color="muted" fontSize="sm">
                  {submissions.length}/{numQuestions} Completed
                </Text>
              </Stack>
              {hasEnoughSubmissions ? (
                <Circle bg="accent" size="8">
                  <Icon as={HiCheck} boxSize="5" color="inverted" />
                </Circle>
              ) : (
                <Circle borderWidth="2px" size="8">
                  <Circle bg="border" size="3" />
                </Circle>
              )}
            </HStack>
            {shownSubmissions.map((sub) => {
              return (
                <Box
                  borderRadius="lg"
                  borderWidth={{ base: '1px' }}
                  key={sub.submission.id}
                  p={{ base: '3', md: '4' }}
                >
                  <Stack
                    align="center"
                    direction="row"
                    justify="space-between"
                    spacing="5"
                  >
                    <Box fontSize="sm">
                      <Text color="empahsized" fontWeight="medium">
                        {sub.question.name}
                      </Text>
                      <Text color="muted">
                        {formatDate(sub.submission.createdAt)}
                      </Text>
                    </Box>
                    <Badge colorScheme="blue" variant="subtle">
                      {difficultyToString[sub.question.difficulty]}
                    </Badge>
                  </Stack>
                </Box>
              );
            })}
            {submissions.length > numQuestions && (
              <Text color="muted" fontSize="xs" textAlign="center">
                Only the latest {numQuestions} submissions are shown.
              </Text>
            )}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
