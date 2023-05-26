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
import { InterviewBase } from 'types/api/interviews';
import { compareIdsAscending } from 'utils/sortUtils';

interface Props {
  requireInterview: boolean;
  hasCompletedInterview: boolean;
  interviews: InterviewBase[];
}

export const InterviewTasksBox = ({
  interviews,
  requireInterview,
  hasCompletedInterview,
}: Props): ReactElement<typeof Box> => {
  interviews.sort(compareIdsAscending);

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
            {interviews.map((interview) => {
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
                    <UserProfile ps={0} user={interview.partner} />
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
