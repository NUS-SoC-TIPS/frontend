import { ReactElement } from 'react';

import { Step } from 'components/steps';
import { TaskStatWindow, TaskStatWindowStatus } from 'types/api/tasks';
import { formatDate } from 'utils/dateUtils';

interface Props {
  window: TaskStatWindow;
  id: number;
  isLastStep: boolean;
  currentStep: number;
  setStep: (step: number) => void;
  isPreviousStepFailure: boolean;
}

export const TaskStep = ({
  window,
  id,
  currentStep,
  isLastStep,
  setStep,
  isPreviousStepFailure,
}: Props): ReactElement<Props, typeof Step> => {
  const isDisabled = id > currentStep;
  const isActive = id === currentStep;
  const isFailure = window.status === TaskStatWindowStatus.FAILED;
  const isSuccess = window.status === TaskStatWindowStatus.COMPLETED;

  return (
    <Step
      description={formatDate(window.startAt)}
      isActive={isActive}
      isDisabled={isDisabled}
      isFailure={isFailure}
      isFirstStep={id === 0}
      isLastStep={isLastStep}
      isSuccess={isSuccess}
      leftLineColor={
        isPreviousStepFailure && currentStep >= id
          ? 'error'
          : !isDisabled
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
