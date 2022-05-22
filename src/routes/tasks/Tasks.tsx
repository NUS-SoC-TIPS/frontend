import { ReactElement, useEffect, useMemo, useReducer } from 'react';
import { Heading, Stack, Text, useBreakpointValue } from '@chakra-ui/react';

import { Page } from 'components/page';
import { Step, useStep } from 'components/steps';
import { getTaskStats } from 'lib/stats';
import { TaskStats } from 'types/api/stats';
import { formatDate } from 'utils/dateUtils';

import { computeCompletion, computeSteps } from './helpers';

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

  return (
    <Page>
      <Stack spacing={{ base: '8', lg: '6' }}>
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
          {steps.map((step, id) => {
            const isActive = id <= currentStep;
            const isFailure = state.completion[id].isFailure;
            const isSuccess = state.completion[id].isSuccess;
            const isPreviousStepFailure =
              state.completion[Math.max(0, id - 1)].isFailure;

            return (
              <Step
                cursor="pointer"
                description={formatDate(step.window.startAt)}
                isActive={isActive}
                isFailure={isFailure}
                isFirstStep={id === 0}
                isLastStep={steps.length === id + 1}
                isSuccess={isSuccess}
                key={id}
                leftLineColor={
                  isPreviousStepFailure && currentStep >= id
                    ? 'error'
                    : isActive
                    ? 'accent'
                    : undefined
                }
                onClick={(): void => setStep(id)}
                rightLineColor={
                  isFailure && currentStep > id
                    ? 'error'
                    : id < currentStep
                    ? 'accent'
                    : undefined
                }
                title={`Week ${id + 1}`}
              />
            );
          })}
        </Stack>
      </Stack>
    </Page>
  );
};
