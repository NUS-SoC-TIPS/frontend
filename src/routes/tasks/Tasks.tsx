import { ReactElement, useEffect, useReducer } from 'react';
import { Heading, Stack } from '@chakra-ui/react';

import { ErrorBanner } from 'components/errorBanner';
import { Page } from 'components/page';
import { getTaskStats } from 'lib/stats';
import { TaskStats } from 'types/api/stats';
import { formatDate } from 'utils/dateUtils';
import { computeWindowCompletion, findCurrentWindow } from 'utils/windowUtils';

import { InterviewTasksBox } from './InterviewTasksBox';
import { SubmissionTasksBox } from './SubmissionTasksBox';
import { TasksPage } from './TasksPage';
import { TasksSkeleton } from './TasksSkeleton';
import { TaskStep } from './TaskStep';

interface State {
  isLoading: boolean;
  isError: boolean;
  stats: TaskStats | null;
  step: number;
  completion: { isCompleted: boolean; isFailure: boolean }[];
}

export const Tasks = (): ReactElement<typeof Page> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>) => ({ ...s, ...a }),
    {
      isLoading: true,
      isError: false,
      stats: null,
      step: 0,
      completion: [],
    } as State,
  );

  useEffect(() => {
    let didCancel = false;
    const fetchData = (): Promise<void> => {
      return getTaskStats()
        .then((stats) => {
          const { index } = findCurrentWindow(
            stats.windows.map((w) => w.window),
          );
          if (!didCancel) {
            setState({
              isLoading: false,
              stats,
              step: index,
              completion: stats.windows.map((w) => computeWindowCompletion(w)),
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

  const { stats, isLoading, isError, step, completion } = state;

  if (isLoading) {
    return <TasksSkeleton />;
  }

  if (isError || stats == null || stats.windows.length === 0) {
    return (
      <TasksPage>
        <ErrorBanner maxW="100%" px={0} />
      </TasksPage>
    );
  }

  const setStep = (step: number): void => {
    setState({ step });
  };

  const selectedWindow = stats.windows[step];

  return (
    <TasksPage>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        my={{ base: 0, md: 4 }}
        spacing={0}
      >
        {stats.windows.map((window, id) => (
          <TaskStep
            completion={completion}
            currentStep={step}
            id={id}
            isLastStep={stats.windows.length === id + 1}
            key={id}
            setStep={setStep}
            taskWindow={window}
          />
        ))}
      </Stack>
      <Stack spacing={4}>
        <Heading fontWeight="medium" mb={0} size="xxs">
          Week {step + 1} ({formatDate(selectedWindow.window.startAt)} -{' '}
          {formatDate(selectedWindow.window.endAt)})
        </Heading>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: 6, md: 6 }}
        >
          <SubmissionTasksBox
            numQuestions={selectedWindow.window.numQuestions}
            submissions={selectedWindow.submissions}
          />
          <InterviewTasksBox
            interviews={selectedWindow.interviews}
            numInterviews={selectedWindow.window.numQuestions}
            requireInterview={selectedWindow.window.requireInterview}
          />
        </Stack>
      </Stack>
    </TasksPage>
  );
};
