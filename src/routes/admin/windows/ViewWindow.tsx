import { ReactElement, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { SimpleGrid, useToast } from '@chakra-ui/react';

import { StatCard } from 'components/card';
import { ErrorBanner } from 'components/errorBanner';
import { DEFAULT_TOAST_PROPS, ERROR_TOAST_PROPS } from 'constants/toast';
import {
  autoExclude,
  createExclusion,
  deleteExclusion,
  getWindowAdmin,
} from 'lib/admin';
import { WindowItem } from 'types/api/admin';
import { InterviewBase } from 'types/api/interviews';
import { SubmissionBase } from 'types/api/questions';
import { StudentBaseWithId } from 'types/api/students';

import {
  ConfirmAutoExclusion,
  ConfirmExclusion,
  ConfirmInclusion,
  InterviewsCompleted,
  QuestionsCompleted,
} from './modals';
import { ExcludedStudentTable, StudentTable } from './tables';
import { ViewWindowPage } from './ViewWindowPage';
import { ViewWindowSkeleton } from './ViewWindowSkeleton';

interface State {
  isError: boolean;
  window: WindowItem | null;
  studentBeingExcluded: StudentBaseWithId | null;
  studentBeingIncluded:
    | (StudentBaseWithId & {
        exclusion: {
          id: number;
          reason: string;
        };
      })
    | null;
  submissionsViewed: SubmissionBase[] | null;
  interviewsViewed: InterviewBase[] | null;
  isAutoExclusionModalShown: boolean;
  isAutoExcluding: boolean;
}

export const ViewWindow = (): ReactElement<typeof ViewWindowPage> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>) => ({ ...s, ...a }),
    {
      isError: false,
      window: null,
      studentBeingExcluded: null,
      studentBeingIncluded: null,
      submissionsViewed: null,
      interviewsViewed: null,
    } as State,
  );
  const toast = useToast();
  const { id } = useParams();

  useEffect(() => {
    let didCancel = false;
    const fetchData = (): Promise<void> => {
      if (id == null) {
        return Promise.resolve();
      }
      return getWindowAdmin(+id)
        .then((window) => {
          if (!didCancel) {
            setState({ window });
          }
        })
        .catch(() => {
          if (!didCancel) {
            setState({ isError: true });
          }
        });
    };

    fetchData();
    return (): void => {
      didCancel = true;
    };
  }, [id]);

  const {
    window,
    isError,
    studentBeingExcluded,
    studentBeingIncluded,
    submissionsViewed,
    interviewsViewed,
  } = state;

  if (isError || id == null) {
    return (
      <ViewWindowPage>
        <ErrorBanner />
      </ViewWindowPage>
    );
  }

  if (window == null) {
    return <ViewWindowSkeleton />;
  }

  const includedStudents = window.students.filter(
    (student) => student.exclusion == null,
  );
  const excludedStudents = window.students.filter(
    (student) => student.exclusion != null,
  );
  const numCompleted = window.students.filter(
    (student) => student.hasCompletedWindow,
  ).length;

  const refetchWindow = (): Promise<void> => {
    return getWindowAdmin(+id).then((window) => setState({ window }));
  };

  const onExclude = (studentId: number): void => {
    const student = includedStudents.find(
      (student) => student.studentId === studentId,
    );
    if (!student) {
      toast(ERROR_TOAST_PROPS);
      return;
    }
    setState({ studentBeingExcluded: student });
  };

  const onConfirmExclude = (reason: string): void => {
    if (!studentBeingExcluded) {
      return;
    }
    createExclusion({
      studentId: studentBeingExcluded.studentId,
      windowId: window.id,
      reason,
    })
      .then(refetchWindow)
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

  const onInclude = (studentId: number): void => {
    const student = excludedStudents.find(
      (student) => student.studentId === studentId,
    );
    if (student == null) {
      toast(ERROR_TOAST_PROPS);
      return;
    }
    const { exclusion } = student;
    if (exclusion == null) {
      toast(ERROR_TOAST_PROPS);
      return;
    }
    setState({ studentBeingIncluded: { ...student, exclusion } });
  };

  const onConfirmInclude = (): void => {
    if (!studentBeingIncluded) {
      return;
    }
    deleteExclusion(studentBeingIncluded.exclusion.id)
      .then(refetchWindow)
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

  const onConfirmAutoExclude = (): void => {
    setState({ isAutoExcluding: true });
    let numExcluded = 0;
    autoExclude(window.id)
      .then((data) => {
        numExcluded = data;
        refetchWindow();
      })
      .then(() => {
        toast({
          ...DEFAULT_TOAST_PROPS,
          title: `${numExcluded} ${
            numExcluded === 1 ? 'student' : 'students'
          } automatically excluded!`,
          description: 'What a bummer...',
          status: 'info',
        });
        setState({ isAutoExcluding: false, isAutoExclusionModalShown: false });
      })
      .catch(() => {
        toast(ERROR_TOAST_PROPS);
        setState({ isAutoExcluding: false, isAutoExclusionModalShown: false });
      });
  };

  const onViewSubmissions = (submissionsViewed: SubmissionBase[]): void =>
    setState({ submissionsViewed });

  const onViewInterviews = (interviewsViewed: InterviewBase[]): void =>
    setState({ interviewsViewed });

  return (
    <ViewWindowPage cohortId={window.cohortId}>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        <StatCard
          stat={window.students.length}
          title="Number of Students This Window"
        />
        <StatCard stat={numCompleted} title="Number of Students Completed" />
      </SimpleGrid>
      <StudentTable
        onAutoExclude={(): void =>
          setState({ isAutoExclusionModalShown: true })
        }
        onExclude={onExclude}
        onViewInterviews={onViewInterviews}
        onViewSubmissions={onViewSubmissions}
        users={includedStudents}
        window={window}
      />
      <ExcludedStudentTable
        onInclude={onInclude}
        onViewInterviews={onViewInterviews}
        onViewSubmissions={onViewSubmissions}
        users={excludedStudents}
        window={window}
      />
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
      <QuestionsCompleted
        isOpen={submissionsViewed != null}
        onClose={(): void => setState({ submissionsViewed: null })}
        submissions={submissionsViewed ?? []}
      />
      <InterviewsCompleted
        interviews={interviewsViewed ?? []}
        isOpen={interviewsViewed != null}
        onClose={(): void => setState({ interviewsViewed: null })}
      />
      <ConfirmAutoExclusion
        isLoading={state.isAutoExcluding}
        isOpen={state.isAutoExclusionModalShown}
        onClose={(): void => setState({ isAutoExclusionModalShown: false })}
        onConfirmAutoExclude={onConfirmAutoExclude}
      />
    </ViewWindowPage>
  );
};
