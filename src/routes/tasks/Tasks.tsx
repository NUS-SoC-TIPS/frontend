import { ReactElement, useEffect, useReducer } from 'react';
import { Heading, Stack } from '@chakra-ui/react';

import { ErrorBanner } from 'components/errorBanner';
import { Page } from 'components/page';
import { getTaskStats } from 'lib/tasks';
import { TaskStatsEntity, TaskStatWindowStatus } from 'types/api/tasks';
import { formatDate } from 'utils/dateUtils';
import { findCurrentWindow } from 'utils/windowUtils';

import { InterviewTasksBox } from './InterviewTasksBox';
import { SubmissionTasksBox } from './SubmissionTasksBox';
import { TasksPage } from './TasksPage';
import { TasksSkeleton } from './TasksSkeleton';
import { TaskStep } from './TaskStep';

interface State {
  isLoading: boolean;
  isError: boolean;
  stats: TaskStatsEntity;
  step: number;
}

export const Tasks = (): ReactElement<typeof Page> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>) => ({ ...s, ...a }),
    {
      isLoading: true,
      isError: false,
      stats: [],
      step: 0,
      completion: [],
    } as State,
  );

  useEffect(() => {
    let didCancel = false;
    const fetchData = (): Promise<void> => {
      return getTaskStats()
        .then((stats) => {
          const { index } = findCurrentWindow(stats);
          if (!didCancel) {
            setState({
              isLoading: false,
              stats,
              step: index,
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

  const { stats, isLoading, isError, step } = state;

  if (isLoading) {
    return <TasksSkeleton />;
  }

  if (isError || stats == null || stats.length === 0) {
    return (
      <TasksPage>
        <ErrorBanner maxW="100%" px={0} />
      </TasksPage>
    );
  }

  const setStep = (step: number): void => {
    setState({ step });
  };

  const selectedWindow = stats[step];

  return (
    <TasksPage>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        my={{ base: 0, md: 4 }}
        spacing={0}
      >
        {stats.map((window, id) => (
          <TaskStep
            currentStep={step}
            id={id}
            isLastStep={stats.length === id + 1}
            isPreviousStepFailure={
              stats[Math.max(0, id - 1)].status === TaskStatWindowStatus.FAILED
            }
            key={id}
            setStep={setStep}
            window={window}
          />
        ))}
      </Stack>
      <Stack spacing={4}>
        <Heading fontWeight="medium" mb={0} size="xxs">
          Week {step + 1} ({formatDate(selectedWindow.startAt)} -{' '}
          {formatDate(selectedWindow.endAt)})
        </Heading>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: 6, md: 6 }}
        >
          <SubmissionTasksBox
            hasCompletedQuestions={selectedWindow.hasCompletedQuestions}
            numQuestions={selectedWindow.numQuestions}
            numToShow={selectedWindow.numQuestions}
            submissions={selectedWindow.submissions}
          />
          <InterviewTasksBox
            hasCompletedInterview={selectedWindow.hasCompletedInterview}
            numToShow={selectedWindow.numQuestions}
            records={selectedWindow.records}
            requireInterview={selectedWindow.requireInterview}
          />
        </Stack>
      </Stack>
    </TasksPage>
  );
};
