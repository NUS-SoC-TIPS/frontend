import { ReactElement } from 'react';
import { Box, Spinner } from '@chakra-ui/react';

import { TasksPage } from './TasksPage';

export const TasksSkeleton = (): ReactElement<typeof TasksPage> => {
  return (
    <TasksPage>
      <Box display="flex" justifyContent="center" p={2}>
        <Spinner color="accent" size="xl" thickness="4px" />
      </Box>
    </TasksPage>
  );
};
