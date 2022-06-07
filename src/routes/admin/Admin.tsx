import { ReactElement, useEffect, useReducer } from 'react';
import { SimpleGrid } from '@chakra-ui/react';

import { StatCard } from 'components/card';
import { ErrorBanner } from 'components/errorBanner';
import { getAdminStats } from 'lib/admin';
import { AdminStatsEntity } from 'types/api/admin';

import { AdminPage } from './AdminPage';
import { AdminSkeleton } from './AdminSkeleton';
import {
  CompletedTable,
  IncompleteTable,
  MissingTable,
  NonStudentTable,
} from './tables';

interface State {
  isLoading: boolean;
  isError: boolean;
  stats: AdminStatsEntity | null;
  selectedIndex: number;
}

export const Admin = (): ReactElement<typeof AdminPage> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>) => ({ ...s, ...a }),
    {
      isLoading: true,
      isError: false,
      stats: null,
      selectedIndex: 0,
    } as State,
  );

  useEffect(() => {
    let didCancel = false;
    const fetchData = (): Promise<void> => {
      return getAdminStats()
        .then((stats) => {
          if (!didCancel) {
            stats.sort((a, b) => b.startAt.getTime() - a.startAt.getTime());
            setState({
              isLoading: false,
              stats,
            });
          }
        })
        .catch(() => {
          if (!didCancel) {
            setState({
              isLoading: false,
              isError: true,
            });
          }
        });
    };

    fetchData();

    return (): void => {
      didCancel = true;
    };
  }, []);

  const { stats, isLoading, isError, selectedIndex } = state;

  if (isLoading) {
    return <AdminSkeleton />;
  }

  if (isError || stats == null || stats.length === 0) {
    return (
      <AdminPage>
        <ErrorBanner maxW="100%" px={0} />
      </AdminPage>
    );
  }

  const selectedWindow = stats[selectedIndex];

  return (
    <AdminPage
      onChangeWindow={(index): void => {
        setState({ selectedIndex: index });
      }}
      selectedIndex={selectedIndex}
      windows={stats}
    >
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        <StatCard
          stat={selectedWindow.numberOfStudents}
          title="Number of Students on Platform"
        />
        <StatCard
          stat={selectedWindow.numberOfCompletedStudents}
          title="Number of Students Completed"
        />
        <StatCard
          stat={selectedWindow.averageNumberOfQuestions.toFixed(2)}
          title="Average Number of Submissions"
        />
      </SimpleGrid>
      <CompletedTable
        users={selectedWindow.studentsWithCompletedWindow}
        window={selectedWindow}
      />
      <IncompleteTable
        users={selectedWindow.studentsWithIncompleteWindow}
        window={selectedWindow}
      />
      <MissingTable
        users={selectedWindow.studentsYetToJoin}
        window={selectedWindow}
      />
      <NonStudentTable
        users={selectedWindow.nonStudents}
        window={selectedWindow}
      />
    </AdminPage>
  );
};
