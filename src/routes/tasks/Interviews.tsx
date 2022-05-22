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
import { TaskStatsInterviews } from 'types/api/stats';

interface Props {
  numInterviews: number;
  requireInterview: boolean;
  interviews: TaskStatsInterviews[];
}

export const Interviews = ({
  numInterviews,
  interviews,
  requireInterview,
}: Props): ReactElement<typeof Box> => {
  const shownInterviews = interviews.slice(0, numInterviews);
  const hasEnoughInterviews = !requireInterview || interviews.length >= 1;

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
                  Interviews
                </Text>
                <Text color="muted" fontSize="sm">
                  {requireInterview
                    ? `${interviews.length}/1`
                    : interviews.length}{' '}
                  Completed
                </Text>
              </Stack>
              {hasEnoughInterviews ? (
                <Circle bg="accent" size="8">
                  <Icon as={HiCheck} boxSize="5" color="inverted" />
                </Circle>
              ) : (
                <Circle borderWidth="2px" size="8">
                  <Circle bg="border" size="3" />
                </Circle>
              )}
            </HStack>
            {shownInterviews.map((interview) => {
              return (
                <Box
                  borderRadius="lg"
                  borderWidth={{ base: '1px' }}
                  key={interview.record.id}
                  p={{ base: '3', md: '4' }}
                >
                  <Stack
                    align="center"
                    direction="row"
                    justify="space-between"
                    spacing="5"
                  >
                    <UserProfile user={interview.partner} />
                  </Stack>
                </Box>
              );
            })}
            {interviews.length > numInterviews && (
              <Text color="muted" fontSize="xs" textAlign="center">
                Only the latest {numInterviews} interviews are shown.
              </Text>
            )}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
