import { ReactElement } from 'react';

import { Step } from 'components/steps';
import { TaskStatsWindow } from 'types/api/stats';
import { formatDate } from 'utils/dateUtils';

interface Props {
  step: TaskStatsWindow;
  id: number;
  isLastStep: boolean;
  currentStep: number;
  completion: { isSuccess: boolean; isFailure: boolean }[];
  setStep: (step: number) => void;
}

export const TaskStep = ({
  step,
  id,
  currentStep,
  completion,
  isLastStep,
  setStep,
}: Props): ReactElement<Props, typeof Step> => {
  const isActive = id <= currentStep;
  const isFailure = completion[id].isFailure;
  const isSuccess = completion[id].isSuccess;
  const isPreviousStepFailure = completion[Math.max(0, id - 1)].isFailure;

  return (
    <Step
      cursor="pointer"
      description={formatDate(step.window.startAt)}
      isActive={isActive}
      isFailure={isFailure}
      isFirstStep={id === 0}
      isLastStep={isLastStep}
      isSuccess={isSuccess}
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
};
