import { ReactElement } from 'react';
import { Badge, Box, Stack, Text } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';

import { CohortListItem } from '@/types/api/cohorts';
import { formatDateWithYear } from '@/utils/dateUtils';

interface Props {
  cohort: CohortListItem;
  onClick: (id: number) => void;
}

export const CohortCard = ({
  cohort,
  onClick,
}: Props): ReactElement<Props, typeof Box> => {
  const getBadgeColor = (): string => {
    switch (cohort.status) {
      case 'COMPLETED':
        return 'green';
      case 'FAILED':
        return 'red';
      case 'HAS NOT STARTED':
        return 'gray';
      case 'IN PROGRESS':
        return 'blue';
    }
  };

  const getBadgeText = (): string => {
    switch (cohort.status) {
      case 'COMPLETED':
        return 'Completed';
      case 'FAILED':
        return 'Did Not Complete';
      case 'HAS NOT STARTED':
        return 'Has Not Started';
      case 'IN PROGRESS':
        return 'In Progress';
    }
  };

  const hasWindowsConfigured = cohort.startAt != null && cohort.endAt != null;

  return (
    <Box
      bg="bg.surface"
      borderRadius="lg"
      boxShadow="sm"
      p={{ base: 4, md: 6 }}
    >
      <Stack
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        spacing={{ base: 4, md: 6 }}
      >
        <Stack spacing={{ base: 0, md: 1 }}>
          <Stack
            align={{ base: 'flex-start', md: 'center' }}
            direction={{ base: 'column-reverse', md: 'row' }}
            spacing={{ base: 0.5, md: 3 }}
          >
            <Text fontSize="lg" fontWeight="medium">
              {cohort.name}
            </Text>
            <Badge colorScheme={getBadgeColor()} size="sm">
              {getBadgeText()}
            </Badge>
          </Stack>
          <Text color="fg.muted" fontSize="sm">
            {hasWindowsConfigured
              ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                formatDateWithYear(cohort.startAt!) +
                ' - ' +
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                formatDateWithYear(cohort.endAt!)
              : 'Cohort is still being configured!'}
          </Text>
        </Stack>
        <Box>
          <Button
            isDisabled={!hasWindowsConfigured}
            onClick={(): void => onClick(cohort.id)}
            variant="primary"
          >
            View
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
