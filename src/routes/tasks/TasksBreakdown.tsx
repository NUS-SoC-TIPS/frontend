import { ReactElement, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { Heading, Stack } from '@chakra-ui/layout';

import { ErrorBanner } from 'components/errorBanner';
import { Page } from 'components/page';
import { getCohort } from 'lib/tasks';
import { CohortItem } from 'types/api/cohorts';
import { formatDateWithYear } from 'utils/dateUtils';
import { computeTaskStepData, findCurrentWindow } from 'utils/windowUtils';

import { InterviewTasksBox } from './InterviewTasksBox';
import { SubmissionTasksBox } from './SubmissionTasksBox';
import { TasksBreakdownPage } from './TasksBreakdownPage';
import { TasksBreakdownSkeleton } from './TasksBreakdownSkeleton';
import { TaskStep } from './TaskStep';

interface State {
  isError: boolean;
  cohort: CohortItem | null;
  step: number;
}

export const TasksBreakdown = (): ReactElement<typeof Page> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>) => ({ ...s, ...a }),
    { isError: false, cohort: null, step: 0 } as State,
  );
  const { id } = useParams();

  useEffect(() => {
    let didCancel = false;
    const fetchData = (): Promise<void> => {
      if (!id) {
        return Promise.resolve();
      }
      return getCohort(+id)
        .then((cohort) => {
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

  const { cohort, isError } = state;

  if (isError) {
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

  return (
    <TasksBreakdownPage>
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
        <Heading fontWeight="medium" mb={0} size="xxs">
          Week {state.step + 1} ({formatDateWithYear(selectedWindow.startAt)} -{' '}
          {formatDateWithYear(selectedWindow.endAt)})
        </Heading>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: 6, md: 6 }}
        >
          <SubmissionTasksBox
            hasCompletedQuestions={selectedWindow.hasCompletedQuestions}
            numQuestions={selectedWindow.numQuestions}
            submissions={selectedWindow.submissions}
          />
          <InterviewTasksBox
            hasCompletedInterview={selectedWindow.hasCompletedInterview}
            interviews={selectedWindow.interviews}
            requireInterview={selectedWindow.requireInterview}
          />
        </Stack>
      </Stack>
    </TasksBreakdownPage>
  );
};
