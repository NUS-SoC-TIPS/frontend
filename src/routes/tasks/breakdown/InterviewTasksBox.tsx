import { ReactElement } from 'react';
import { HiCheck } from 'react-icons/hi';
import {
  Badge,
  Box,
  Circle,
  Container,
  Divider,
  HStack,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

import { UserProfile } from '@/components/userProfile';
import { InterviewBase } from '@/types/api/interviews';
import { StudentBase } from '@/types/api/students';
import { compareIdsAscending } from '@/utils/sortUtils';

interface Props {
  requireInterview: boolean;
  hasCompletedInterview: boolean;
  interviews: InterviewBase[];
  pairedPartner: StudentBase | null;
}

export const InterviewTasksBox = ({
  interviews,
  pairedPartner,
  requireInterview,
  hasCompletedInterview,
}: Props): ReactElement<typeof Box> => {
  const boxShadow = useColorModeValue('sm', 'sm-dark');
  interviews.sort(compareIdsAscending);
  const hasIncompletePairedPartner =
    pairedPartner != null &&
    interviews.every(
      (interview) =>
        interview.partner.githubUsername !== pairedPartner.githubUsername,
    );

  return (
    <Box as="section" flex={1}>
      <Container maxW="3xl" px={0}>
        {hasIncompletePairedPartner && (
          <>
            <Box
              bg="bg.surface"
              borderTopLeftRadius="lg"
              borderTopRightRadius="lg"
              boxShadow={boxShadow}
              p={{ base: 4, md: 6 }}
            >
              <Stack spacing={4}>
                <HStack justify="space-between">
                  <Stack spacing={1}>
                    <Text fontSize="lg" fontWeight="medium">
                      Paired Partner
                    </Text>
                    <Text color="fg.muted" fontSize="sm">
                      Interview Incomplete
                    </Text>
                  </Stack>
                  <Circle borderWidth="2px" size={8}>
                    <Circle bg="border.default" size={3} />
                  </Circle>
                </HStack>
                <Box
                  borderRadius="lg"
                  borderWidth={{ base: '1px' }}
                  p={{ base: 3, md: 4 }}
                >
                  <Stack
                    align="center"
                    direction="row"
                    justify="space-between"
                    spacing={5}
                  >
                    <UserProfile ps={0} user={pairedPartner} />
                  </Stack>
                </Box>
              </Stack>
            </Box>
            <Divider />
          </>
        )}
        <Box
          bg="bg.surface"
          borderBottomLeftRadius="lg"
          borderBottomRightRadius="lg"
          borderTopLeftRadius={hasIncompletePairedPartner ? undefined : 'lg'}
          borderTopRightRadius={hasIncompletePairedPartner ? undefined : 'lg'}
          boxShadow={boxShadow}
          p={{ base: 4, md: 6 }}
        >
          <Stack spacing={4}>
            <HStack justify="space-between">
              <Stack spacing={1}>
                <Text fontSize="lg" fontWeight="medium">
                  Interviews
                </Text>
                <Text color="fg.muted" fontSize="sm">
                  {requireInterview
                    ? `${interviews.length}/1`
                    : interviews.length}{' '}
                  Completed
                </Text>
              </Stack>
              {hasCompletedInterview ? (
                <Circle bg="accent" size={8}>
                  <Icon as={HiCheck} boxSize={5} color="fg.inverted" />
                </Circle>
              ) : (
                <Circle borderWidth="2px" size={8}>
                  <Circle bg="border.default" size={3} />
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
                  <HStack justify="space-between">
                    <UserProfile ps={0} user={interview.partner} />
                    {interview.partner.githubUsername ===
                      pairedPartner?.githubUsername && (
                      <Badge variant="fg.subtle">Paired Partner</Badge>
                    )}
                  </HStack>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
