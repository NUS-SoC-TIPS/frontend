import { ReactElement, useEffect, useReducer } from 'react';
import { SimpleGrid, useToast } from '@chakra-ui/react';

import { StatCard } from 'components/card';
import { ErrorBanner } from 'components/errorBanner';
import { DEFAULT_TOAST_PROPS, ERROR_TOAST_PROPS } from 'constants/toast';
import {
  createExclusion,
  deleteExclusion,
  getAdminStats,
  getAdminWindows,
} from 'lib/admin';
import {
  AdminStatsEntity,
  ExcludedUserWithWindowData,
  UserWithWindowData,
} from 'types/api/admin';
import { Window } from 'types/models/window';
import { compareStartAtsDescending } from 'utils/sortUtils';

import { AdminPage } from './AdminPage';
import { AdminSkeleton } from './AdminSkeleton';
import { ConfirmExclusion, ConfirmInclusion } from './modals';
import { ExcludedStudentTable, NonStudentTable, StudentTable } from './tables';

interface State {
  isLoading: boolean;
  isError: boolean;
  windows: Window[];
  stats: AdminStatsEntity | null;
  selectedIndex: number;
  studentBeingExcluded: UserWithWindowData | null;
  studentBeingIncluded: ExcludedUserWithWindowData | null;
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
      studentBeingExcluded: null,
      studentBeingIncluded: null,
    } as State,
  );
  const toast = useToast();

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

  const {
    windows,
    stats,
    isLoading,
    isError,
    selectedIndex,
    studentBeingExcluded,
    studentBeingIncluded,
  } = state;

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

  const refetchStats = (): Promise<void> => {
    return getAdminStats(stats.id).then((stats) => setState({ stats }));
  };

  const onExclude = (id: string): void => {
    const student = stats.students.find((student) => student.id === id);
    if (!student) {
      toast(ERROR_TOAST_PROPS);
      return;
    }
    setState({ studentBeingExcluded: student });
  };

  const onConfirmExclude = async (reason: string): Promise<void> => {
    if (!studentBeingExcluded) {
      return;
    }
    createExclusion({
      userId: studentBeingExcluded.id,
      windowId: stats.id,
      reason,
    })
      .then(refetchStats)
      .then(() => {
        setState({ studentBeingExcluded: null });
        toast({
          ...DEFAULT_TOAST_PROPS,
          title: `${studentBeingExcluded.name} excluded.`,
          description: 'What a bummer...',
          status: 'info',
        });
      })
      .catch(() => {
        toast(ERROR_TOAST_PROPS);
      });
  };

  const onInclude = (id: string): void => {
    const student = stats.excludedStudents.find((student) => student.id === id);
    if (!student) {
      toast(ERROR_TOAST_PROPS);
      return;
    }
    setState({ studentBeingIncluded: student });
  };

  const onConfirmInclude = async (): Promise<void> => {
    if (!studentBeingIncluded) {
      return;
    }
    deleteExclusion(studentBeingIncluded.exclusion.id)
      .then(refetchStats)
      .then(() => {
        setState({ studentBeingIncluded: null });
        toast({
          ...DEFAULT_TOAST_PROPS,
          title: `${studentBeingIncluded.name} included!`,
          description: 'Glad to have them back!',
          status: 'success',
        });
      })
      .catch(() => {
        toast(ERROR_TOAST_PROPS);
      });
  };

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
      <StudentTable
        onExclude={onExclude}
        users={stats.students}
        window={stats}
      />
      <ExcludedStudentTable
        onInclude={onInclude}
        users={stats.excludedStudents}
        window={stats}
      />
      <NonStudentTable users={stats.nonStudents} window={stats} />
      <ConfirmExclusion
        isOpen={studentBeingExcluded != null}
        name={studentBeingExcluded?.name ?? ''}
        onClose={(): void => setState({ studentBeingExcluded: null })}
        onConfirmExclude={onConfirmExclude}
      />
      <ConfirmInclusion
        isOpen={studentBeingIncluded != null}
        name={studentBeingIncluded?.name ?? ''}
        onClose={(): void => setState({ studentBeingIncluded: null })}
        onConfirmInclude={onConfirmInclude}
      />
    </AdminPage>
  );
};
