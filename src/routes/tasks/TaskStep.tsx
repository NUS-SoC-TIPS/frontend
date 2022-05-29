import { ReactElement } from 'react';

import { Step } from 'components/steps';
import { TaskStatWindow, TaskStatWindowStatus } from 'types/api/stats';
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
  const isActive = id <= currentStep;
  const isFailure = window.status === TaskStatWindowStatus.FAILED;
  const isSuccess = window.status === TaskStatWindowStatus.COMPLETED;

  return (
    <Step
      cursor="pointer"
      description={formatDate(window.startAt)}
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
