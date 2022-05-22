import { ReactElement, useEffect, useMemo, useReducer } from 'react';
import { Heading, Stack, Text, useBreakpointValue } from '@chakra-ui/react';

import { Page } from 'components/page';
import { useStep } from 'components/steps';
import { getTaskStats } from 'lib/stats';
import { TaskStats } from 'types/api/stats';

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
      <Stack spacing="8">
        <Stack spacing="1">
          <Heading
            fontWeight="medium"
            size={useBreakpointValue({ base: 'xs', lg: 'sm' })}
          >
            Tasks
          </Heading>
          <Text color="muted">
            Track your progress for the current window here!
          </Text>
        </Stack>
        <Stack direction={{ base: 'column', md: 'row' }} spacing="0">
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
        <Stack direction={{ base: 'column', md: 'row' }} spacing="6">
          {selectedStep && (
            <Submissions
              numQuestions={selectedStep.window.numQuestions}
              submissions={selectedStep.submissions}
            />
          )}
          {selectedStep && (
            <Interviews
              interviews={selectedStep.interviews}
              numInterviews={selectedStep.window.numQuestions}
              requireInterview={selectedStep.window.requireInterview}
            />
          )}
        </Stack>
      </Stack>
    </Page>
  );
};
