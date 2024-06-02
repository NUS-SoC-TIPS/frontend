import { ReactElement, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { SimpleGrid, useToast } from '@chakra-ui/react';

import { StatCard } from '@/components/card';
import { ErrorBanner } from '@/components/errorBanner';
import { DEFAULT_TOAST_PROPS, ERROR_TOAST_PROPS } from '@/constants/toast';
import {
  autoExclude,
  createExclusion,
  deleteExclusion,
  getWindowAdmin,
  pairStudents,
} from '@/lib/admin';
import { WindowItem } from '@/types/api/admin';
import { InterviewBase } from '@/types/api/interviews';
import { SubmissionBase } from '@/types/api/questions';
import { StudentBase, StudentBaseWithId } from '@/types/api/students';
import { formatDateWithoutYear } from '@/utils/dateUtils';

import {
  ConfirmAutoExclusion,
  ConfirmExclusion,
  ConfirmInclusion,
  ConfirmPairStudents,
  InterviewsCompleted,
  PairedPartner,
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
  partnerViewed: StudentBase | null;
  isAutoExclusionModalShown: boolean;
  isPairStudentsModalShown: boolean;
  isExcluding: boolean;
  isIncluding: boolean;
  isAutoExcluding: boolean;
  isPairingStudents: boolean;
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
      partnerViewed: null,
      isAutoExclusionModalShown: false,
      isPairStudentsModalShown: false,
      isExcluding: false,
      isIncluding: false,
      isAutoExcluding: false,
      isPairingStudents: false,
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
    partnerViewed,
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
  const numPaired = window.students.filter(
    (student) => student.pairedPartner != null,
  ).length;
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

  const onConfirmPairStudents = (): void => {
    setState({ isPairingStudents: true });
    let numPaired = 0;
    pairStudents(window.id)
      .then((data) => {
        numPaired = data;
        refetchWindow();
      })
      .then(() => {
        toast({
          ...DEFAULT_TOAST_PROPS,
          title: `${numPaired} ${
            numPaired === 1 ? 'student' : 'students'
          } paired!`,
          description:
            'They will now be able to see their paired partner on the app.',
          status: 'info',
        });
        setState({ isPairingStudents: false, isPairStudentsModalShown: false });
      })
      .catch(() => {
        toast(ERROR_TOAST_PROPS);
        setState({ isPairingStudents: false, isPairStudentsModalShown: false });
      });
  };

  const onViewSubmissions = (submissionsViewed: SubmissionBase[]): void =>
    setState({ submissionsViewed });

  const onViewInterviews = (interviewsViewed: InterviewBase[]): void =>
    setState({ interviewsViewed });

  const onViewPartner = (partnerViewed: StudentBase): void =>
    setState({ partnerViewed });

  return (
    <ViewWindowPage
      cohortId={window.cohortId}
      heading={`Viewing Window (${formatDateWithoutYear(
        window.startAt,
      )} - ${formatDateWithoutYear(window.endAt)})`}
    >
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        <StatCard
          stat={window.students.length}
          title="Number of Students This Window"
        />
        {window.requireInterview && (
          <StatCard stat={numPaired} title="Number of Students Paired" />
        )}
        <StatCard stat={numCompleted} title="Number of Students Completed" />
      </SimpleGrid>
      <StudentTable
        onAutoExclude={(): void =>
          setState({ isAutoExclusionModalShown: true })
        }
        onExclude={onExclude}
        onPairStudents={(): void =>
          setState({ isPairStudentsModalShown: true })
        }
        onViewInterviews={onViewInterviews}
        onViewPartner={onViewPartner}
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
        isLoading={state.isExcluding}
        isOpen={studentBeingExcluded != null}
        name={studentBeingExcluded?.name ?? ''}
        onClose={(): void => setState({ studentBeingExcluded: null })}
        onConfirmExclude={onConfirmExclude}
      />
      <ConfirmInclusion
        isLoading={state.isIncluding}
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
      <PairedPartner
        isOpen={partnerViewed != null}
        onClose={(): void => setState({ partnerViewed: null })}
        partner={partnerViewed}
      />
      <ConfirmAutoExclusion
        isLoading={state.isAutoExcluding}
        isOpen={state.isAutoExclusionModalShown}
        onClose={(): void => setState({ isAutoExclusionModalShown: false })}
        onConfirmAutoExclude={onConfirmAutoExclude}
      />
      <ConfirmPairStudents
        isLoading={state.isPairingStudents}
        isOpen={state.isPairStudentsModalShown}
        onClose={(): void => setState({ isPairStudentsModalShown: false })}
        onConfirmPairStudents={onConfirmPairStudents}
      />
    </ViewWindowPage>
  );
};
