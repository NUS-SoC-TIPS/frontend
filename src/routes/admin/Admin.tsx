import { ReactElement, useEffect, useReducer } from 'react';
import { SimpleGrid } from '@chakra-ui/react';

import { StatCard } from 'components/card';
import { ErrorBanner } from 'components/errorBanner';
import { getAdminStats } from 'lib/stats';
import { AdminStats } from 'types/api/stats/admin';

import { IncompleteTable } from './tables/IncompleteTable';
import { MissingTable } from './tables/MissingTable';
import { AdminPage } from './AdminPage';
import { AdminSkeleton } from './AdminSkeleton';

interface State {
  isLoading: boolean;
  isError: boolean;
  stats: AdminStats | null;
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
          stat={selectedWindow.numStudents}
          title="Number of Students on Platform"
        />
        <StatCard
          stat={selectedWindow.numStudentsCompleted}
          title="Number of Students Completed"
        />
        <StatCard
          stat={selectedWindow.avgNumQuestions.toFixed(2)}
          title="Average Number of Submissions"
        />
      </SimpleGrid>
      <IncompleteTable
        users={selectedWindow.studentsWithIncompleteWindow}
        window={selectedWindow}
      />
      <MissingTable users={selectedWindow.studentsYetToJoin} />
    </AdminPage>
  );
};
