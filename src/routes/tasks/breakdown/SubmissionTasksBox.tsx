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

import { QuestionBox } from 'components/question';
import { SubmissionBase } from 'types/api/questions';
import { compareIdsAscending } from 'utils/sortUtils';

interface Props {
  numQuestions: number;
  submissions: SubmissionBase[];
  hasCompletedQuestions: boolean;
}

export const SubmissionTasksBox = ({
  submissions,
  numQuestions,
  hasCompletedQuestions,
}: Props): ReactElement<typeof Box> => {
  submissions.sort(compareIdsAscending);

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
              {hasCompletedQuestions ? (
                <Circle bg="accent" size={8}>
                  <Icon as={HiCheck} boxSize={5} color="inverted" />
                </Circle>
              ) : (
                <Circle borderWidth="2px" size={8}>
                  <Circle bg="border" size={3} />
                </Circle>
              )}
            </HStack>
            {submissions.map((sub) => (
              <QuestionBox key={sub.id} question={sub.question} />
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
