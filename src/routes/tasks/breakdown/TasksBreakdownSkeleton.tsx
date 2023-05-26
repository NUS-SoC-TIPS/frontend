import { ReactElement } from 'react';
import { Box, Spinner } from '@chakra-ui/react';

import { TasksBreakdownPage } from './TasksBreakdownPage';

export const TasksBreakdownSkeleton = (): ReactElement<
  typeof TasksBreakdownPage
> => {
  return (
    <TasksBreakdownPage>
      <Box display="flex" justifyContent="center" p={2}>
        <Spinner color="accent" size="xl" thickness="4px" />
      </Box>
    </TasksBreakdownPage>
  );
};
