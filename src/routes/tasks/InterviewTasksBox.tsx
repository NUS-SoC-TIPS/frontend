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

import { UserProfile } from 'components/userProfile';
import { TaskStatInterview } from 'types/api/stats';

interface Props {
  numToShow: number;
  requireInterview: boolean;
  hasCompletedInterview: boolean;
  interviews: TaskStatInterview[];
}

export const InterviewTasksBox = ({
  numToShow,
  interviews,
  requireInterview,
  hasCompletedInterview,
}: Props): ReactElement<typeof Box> => {
  const shownInterviews = interviews
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
                  Interviews
                </Text>
                <Text color="muted" fontSize="sm">
                  {requireInterview
                    ? `${interviews.length}/1`
                    : interviews.length}{' '}
                  Completed
                </Text>
              </Stack>
              {hasCompletedInterview ? (
                <Circle bg="accent" size={8}>
                  <Icon as={HiCheck} boxSize={5} color="inverted" />
                </Circle>
              ) : (
                <Circle borderWidth="2px" size={8}>
                  <Circle bg="border" size={3} />
                </Circle>
              )}
            </HStack>
            {shownInterviews.map((interview) => {
              return (
                <Box
                  borderRadius="lg"
                  borderWidth={{ base: '1px' }}
                  key={interview.id}
                  p={{ base: 3, md: 4 }}
                >
                  <Stack
                    align="center"
                    direction="row"
                    justify="space-between"
                    spacing={5}
                  >
                    <UserProfile user={interview.partner} />
                  </Stack>
                </Box>
              );
            })}
            {interviews.length > numToShow && (
              <Text color="muted" fontSize="xs" textAlign="center">
                Only the latest {numToShow} interviews are shown.
              </Text>
            )}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
