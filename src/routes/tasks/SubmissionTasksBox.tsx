import { ReactElement } from 'react';
import { HiCheck } from 'react-icons/hi';
import {
  Box,
  Circle,
  Container,
  HStack,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

import { SubmissionBox } from 'components/submission';
import { TaskStatSubmission } from 'types/api/stats/task';

interface Props {
  numToShow: number;
  numQuestions: number;
  submissions: TaskStatSubmission[];
  hasCompletedSubmissions: boolean;
}

export const SubmissionTasksBox = ({
  submissions,
  numToShow,
  numQuestions,
  hasCompletedSubmissions,
}: Props): ReactElement<typeof Box> => {
  const shownSubmissions = submissions
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, numToShow);

  return (
    <Box as="section" flex={1}>
      <Container maxW="3xl" px={0}>
        <Box
          bg="bg-surface"
          borderRadius="lg"
          boxShadow={useColorModeValue('sm', 'sm-dark')}
          p={{ base: 4, md: 6 }}
        >
          <Stack spacing={4}>
            <HStack justify="space-between">
              <Stack spacing={1}>
                <Text fontSize="lg" fontWeight="medium">
                  Questions
                </Text>
                <Text color="muted" fontSize="sm">
                  {submissions.length}/{numQuestions} Completed
                </Text>
              </Stack>
              {hasCompletedSubmissions ? (
                <Circle bg="accent" size={8}>
                  <Icon as={HiCheck} boxSize={5} color="inverted" />
                </Circle>
              ) : (
                <Circle borderWidth="2px" size={8}>
                  <Circle bg="border" size={3} />
                </Circle>
              )}
            </HStack>
            {shownSubmissions.map((sub) => (
              <SubmissionBox
                key={sub.id}
                question={sub.question}
                submission={sub}
              />
            ))}
            {submissions.length > numToShow && (
              <Text color="muted" fontSize="xs" textAlign="center">
                Only the latest {numToShow} submissions are shown.
              </Text>
            )}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
