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

import { QuestionBox } from '@/components/question';
import { ExcuseBase } from '@/types/api/excuses';
import { SubmissionBase } from '@/types/api/questions';
import { ExcuseFrom } from '@/types/models/excuse';
import { compareIdsAscending } from '@/utils/sortUtils';

import { ExcuseTag } from './ExcuseTag';

interface Props {
  numQuestions: number;
  submissions: SubmissionBase[];
  excuses: ExcuseBase[];
  hasCompletedQuestions: boolean;
}

export const SubmissionTasksBox = ({
  submissions,
  numQuestions,
  hasCompletedQuestions,
  excuses,
}: Props): ReactElement<typeof Box> => {
  submissions.sort(compareIdsAscending);

  const excuse = excuses.find(
    (e) =>
      e.excuseFrom === ExcuseFrom.QUESTION ||
      e.excuseFrom === ExcuseFrom.INTERVIEW_AND_QUESTION,
  );

  return (
    <Box as="section" flex={1}>
      <Container maxW="3xl" px={0}>
        <Box
          bg="bg.surface"
          borderRadius="lg"
          boxShadow={useColorModeValue('sm', 'sm-dark')}
          p={{ base: 4, md: 6 }}
        >
          <Stack spacing={4}>
            <HStack justify="space-between">
              <Stack spacing={1}>
                <HStack>
                  <Text fontSize="lg" fontWeight="medium">
                    Questions
                  </Text>
                  {excuse && <ExcuseTag status={excuse.status} />}
                </HStack>
                <Text color="fg.muted" fontSize="sm">
                  {submissions.length}/{numQuestions} Completed
                </Text>
              </Stack>
              {hasCompletedQuestions ? (
                <Circle bg="accent" size={8}>
                  <Icon as={HiCheck} boxSize={5} color="fg.inverted" />
                </Circle>
              ) : (
                <Circle borderWidth="2px" size={8}>
                  <Circle bg="border.default" size={3} />
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
