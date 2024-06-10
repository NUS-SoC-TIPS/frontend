import { ReactElement, useCallback, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { Heading, HStack, Stack } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';

import { ErrorBanner } from '@/components/errorBanner';
import { Page } from '@/components/page';
import { getSelfExcuses } from '@/lib/excuses';
import { getCohort } from '@/lib/tasks';
import { CohortItem } from '@/types/api/cohorts';
import { ExcuseBase } from '@/types/api/excuses';
import { formatDateWithYear } from '@/utils/dateUtils';
import {
  computeTaskStepData,
  findCurrentWindow,
  findWindowIdFromStep,
} from '@/utils/windowUtils';

import { ExclusionBanner } from './banners';
import { ExcuseModal } from './ExcuseModal';
import { InterviewTasksBox } from './InterviewTasksBox';
import { SubmissionTasksBox } from './SubmissionTasksBox';
import { TasksBreakdownPage } from './TasksBreakdownPage';
import { TasksBreakdownSkeleton } from './TasksBreakdownSkeleton';
import { TaskStep } from './TaskStep';

interface State {
  isError: boolean;
  cohort: CohortItem | null;
  excuses: ExcuseBase[] | null;
  step: number;
  isExcuseModalOpen: boolean;
}

export const TasksBreakdown = (): ReactElement<typeof Page> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>) => ({ ...s, ...a }),
    {
      isError: false,
      cohort: null,
      excuses: null,
      step: 0,
      isExcuseModalOpen: false,
    } as State,
  );
  const { id } = useParams();

  useEffect(() => {
    let didCancel = false;
    const fetchData = (): Promise<void> => {
      if (!id) {
        return Promise.resolve();
      }
      return getCohort(+id)
        .then(async (cohort) => {
          if (cohort.windows.length === 0) {
            throw new Error('Cohort is not configured yet!');
          }
          const step = findCurrentWindow(cohort.windows);
          if (!didCancel) {
            setState({ cohort, step });
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

  const fetchExcuses = useCallback((): Promise<void> => {
    return getSelfExcuses(
      findWindowIdFromStep(+state.step, state.cohort?.windows ?? []),
    ).then((excuses) => {
      setState({ excuses });
    });
  }, [state.step, state.cohort?.windows]);

  useEffect(() => {
    if (!state.cohort?.windows) {
      return;
    }

    fetchExcuses();
  }, [fetchExcuses, state.cohort?.windows, state.step]);

  const { cohort, isError, isExcuseModalOpen, excuses } = state;

  if (isError || id == null) {
    return (
      <TasksBreakdownPage>
        <ErrorBanner maxW="100%" px={0} />
      </TasksBreakdownPage>
    );
  }

  if (cohort == null || cohort.windows.length === 0) {
    return <TasksBreakdownSkeleton />;
  }

  const selectedWindow = cohort.windows[state.step];

  const setStep = (step: number): void => {
    setState({ step });
  };

  const taskStepData = computeTaskStepData(cohort.windows);

  const handleClose = (): Promise<void> => {
    setState({ isExcuseModalOpen: false });
    return fetchExcuses();
  };

  return (
    <>
      <ExcuseModal
        excuses={excuses ?? []}
        handleClose={handleClose}
        isOpen={isExcuseModalOpen}
        window={selectedWindow}
      />
      <TasksBreakdownPage
        coursemologyUrl={cohort.coursemologyUrl}
        email={cohort.email}
      >
        <Stack
          direction={{ base: 'column', md: 'row' }}
          my={{ base: 0, md: 4 }}
          spacing={0}
        >
          {cohort.windows.map((window, id) => {
            const data = taskStepData[id];
            return (
              <TaskStep
                currentStep={state.step}
                icon={data.icon}
                id={id}
                isLastStep={cohort.windows.length === id + 1}
                key={id}
                leftLineColor={data.left}
                rightLineColor={data.right}
                setStep={setStep}
                window={window}
              />
            );
          })}
        </Stack>
        <Stack spacing={4}>
          <HStack spacing={4}>
            <Heading fontWeight="medium" mb={0} size="xxs">
              Window {state.step + 1} (
              {formatDateWithYear(selectedWindow.startAt)} -{' '}
              {formatDateWithYear(selectedWindow.endAt)})
            </Heading>
            <Button
              // should be disabled if end date of window has passed and there are no excuses
              isDisabled={
                excuses !== null &&
                selectedWindow.endAt < new Date() &&
                excuses.length === 0
              }
              isLoading={excuses === null}
              onClick={(): void => setState({ isExcuseModalOpen: true })}
              variant="secondary"
            >
              Excuse
            </Button>
          </HStack>
          {selectedWindow.exclusion != null ? (
            <ExclusionBanner
              email={cohort.email}
              exclusion={selectedWindow.exclusion}
            />
          ) : (
            <></>
          )}
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={{ base: 6, md: 6 }}
          >
            <SubmissionTasksBox
              excuses={excuses ?? []}
              hasCompletedQuestions={selectedWindow.hasCompletedQuestions}
              numQuestions={selectedWindow.numQuestions}
              submissions={selectedWindow.submissions}
            />
            <InterviewTasksBox
              excuses={excuses ?? []}
              hasCompletedInterview={selectedWindow.hasCompletedInterview}
              interviews={selectedWindow.interviews}
              pairedPartner={selectedWindow.pairedPartner}
              requireInterview={selectedWindow.requireInterview}
            />
          </Stack>
        </Stack>
      </TasksBreakdownPage>
    </>
  );
};
