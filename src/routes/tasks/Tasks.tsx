import { ReactElement, useEffect, useMemo, useReducer } from 'react';
import { Heading, Stack, useBreakpointValue } from '@chakra-ui/react';

import { Dashboard, Page } from 'components/page';
import { useStep } from 'components/steps';
import { getTaskStats } from 'lib/stats';
import { TaskStats } from 'types/api/stats';
import { formatDate } from 'utils/dateUtils';

import { computeCompletion, computeSteps } from './helpers';
import { Interviews } from './Interviews';
import { Submissions } from './Submissions';
import { TaskStep } from './TaskStep';

interface State {
  isLoading: boolean;
  isError: boolean;
  stats: TaskStats | null;
  completion: { isSuccess: boolean; isFailure: boolean }[];
}

export const Tasks = (): ReactElement<typeof Page> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>) => ({ ...s, ...a }),
    {
      isLoading: true,
      isError: false,
      stats: null,
      completion: [],
    } as State,
  );
  const steps = useMemo(
    () => state.stats?.windows ?? [],
    [state.stats?.windows],
  );
  const { maxStep, initialStep } = useMemo(() => computeSteps(steps), [steps]);
  const [currentStep, { setStep }] = useStep({ maxStep, initialStep });
  const titleSize = useBreakpointValue({ base: 'xxs' });

  useEffect(() => {
    let didCancel = false;
    const fetchData = async (): Promise<void> => {
      try {
        const stats = await getTaskStats();
        if (!didCancel) {
          setState({
            isLoading: false,
            stats,
            completion: computeCompletion(stats.windows),
          });
        }
      } catch {
        if (!didCancel) {
          setState({
            isLoading: false,
            isError: true,
          });
        }
      }
    };

    fetchData();

    return (): void => {
      didCancel = true;
    };
  }, []);

  const selectedStep = steps[currentStep];

  return (
    <Page>
      <Dashboard
        heading="Tasks"
        subheading="Track your progress for the current window here!"
      >
        <Stack
          direction={{ base: 'column', md: 'row' }}
          my={{ base: 0, md: 4 }}
          spacing={0}
        >
          {steps.map((step, id) => (
            <TaskStep
              completion={state.completion}
              currentStep={currentStep}
              id={id}
              isLastStep={steps.length === id + 1}
              key={id}
              setStep={setStep}
              step={step}
            />
          ))}
        </Stack>
        {selectedStep && (
          <Stack spacing={4}>
            <Heading fontWeight="medium" mb={0} size={titleSize}>
              Week {currentStep + 1} ({formatDate(selectedStep.window.startAt)}{' '}
              - {formatDate(selectedStep.window.endAt)})
            </Heading>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              spacing={{ base: 6, md: 6 }}
            >
              <Submissions
                numQuestions={selectedStep.window.numQuestions}
                submissions={selectedStep.submissions}
              />
              <Interviews
                interviews={selectedStep.interviews}
                numInterviews={selectedStep.window.numQuestions}
                requireInterview={selectedStep.window.requireInterview}
              />
            </Stack>
          </Stack>
        )}
      </Dashboard>
    </Page>
  );
};
