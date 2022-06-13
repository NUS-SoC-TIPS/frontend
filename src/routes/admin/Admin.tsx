import { ReactElement, useEffect, useReducer } from 'react';
import { SimpleGrid } from '@chakra-ui/react';

import { StatCard } from 'components/card';
import { ErrorBanner } from 'components/errorBanner';
import { getAdminStats, getAdminWindows } from 'lib/admin';
import { AdminStatsEntity } from 'types/api/admin';
import { Window } from 'types/models/window';
import { compareStartAtsDescending } from 'utils/sortUtils';

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
  windows: Window[];
  stats: AdminStatsEntity | null;
  selectedIndex: number;
}

export const Admin = (): ReactElement<typeof AdminPage> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>) => ({ ...s, ...a }),
    {
      isLoading: true,
      isError: false,
      windows: [],
      stats: null,
      selectedIndex: 0,
    } as State,
  );

  useEffect(() => {
    let didCancel = false;
    const fetchData = (): Promise<void> => {
      return getAdminWindows()
        .then((windows) => {
          windows.sort(compareStartAtsDescending);
          if (!didCancel) {
            setState({ windows });
          }
          return getAdminStats(windows[0].id);
        })
        .then((stats) => {
          if (!didCancel) {
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

  const { windows, stats, isLoading, isError, selectedIndex } = state;

  if (isLoading) {
    return <AdminSkeleton selectedIndex={selectedIndex} windows={windows} />;
  }

  if (isError || stats == null || windows.length === 0) {
    return (
      <AdminPage>
        <ErrorBanner maxW="100%" px={0} />
      </AdminPage>
    );
  }

  return (
    <AdminPage
      onChangeWindow={(index): void => {
        setState({ selectedIndex: index, isLoading: true });
        getAdminStats(windows[index].id).then((stats) =>
          setState({ stats, isLoading: false }),
        );
      }}
      selectedIndex={selectedIndex}
      windows={windows}
    >
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        <StatCard
          stat={stats.numberOfStudents}
          title="Number of Students This Window"
        />
        <StatCard
          stat={stats.numberOfCompletedStudents}
          title="Number of Students Completed"
        />
        <StatCard
          stat={stats.averageNumberOfQuestions.toFixed(2)}
          title="Average Number of Submissions"
        />
      </SimpleGrid>
      <CompletedTable
        users={stats.studentsWithCompletedWindow}
        window={stats}
      />
      <IncompleteTable
        users={stats.studentsWithIncompleteWindow}
        window={stats}
      />
      <MissingTable users={stats.studentsYetToJoin} window={stats} />
      <NonStudentTable users={stats.nonStudents} window={stats} />
    </AdminPage>
  );
};
