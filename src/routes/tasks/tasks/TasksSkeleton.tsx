import { ReactElement } from 'react';
import { Container, Stack } from '@chakra-ui/react';

import { CohortCardSkeleton } from './CohortCardSkeleton';
import { TasksPage } from './TasksPage';

export const TasksSkeleton = (): ReactElement<typeof TasksPage> => {
  return (
    <TasksPage>
      <Container maxW="3xl" px={0}>
        <Stack flex="1" spacing="5">
          <CohortCardSkeleton />
        </Stack>
      </Container>
    </TasksPage>
  );
};
