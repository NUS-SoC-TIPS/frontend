import { ReactElement } from 'react';

import { Step } from 'components/steps';
import { formatDateWithoutYear } from 'utils/dateUtils';

interface Props {
  window: { startAt: Date };
  id: number;
  isLastStep: boolean;
  currentStep: number;
  setStep: (step: number) => void;
  leftLineColor: 'RED' | 'GREEN' | 'GREY' | 'NONE';
  rightLineColor: 'RED' | 'GREEN' | 'GREY' | 'NONE';
  icon: 'CHECK' | 'CROSS' | 'NONE';
}

export const TaskStep = ({
  window,
  id,
  currentStep,
  isLastStep,
  setStep,
  leftLineColor,
  rightLineColor,
  icon,
}: Props): ReactElement<Props, typeof Step> => {
  const isDisabled = id > currentStep;
  const isActive = id === currentStep;

  return (
    <Step
      color={currentStep >= id ? rightLineColor : 'NONE'}
      description={formatDateWithoutYear(window.startAt)}
      icon={currentStep >= id ? icon : 'NONE'}
      isActive={isActive}
      isDisabled={isDisabled}
      isFirstStep={id === 0}
      isLastStep={isLastStep}
      leftLineColor={currentStep >= id ? leftLineColor : 'NONE'}
      onClick={(): void => setStep(id)}
      rightLineColor={currentStep > id ? rightLineColor : 'NONE'}
      title={`Week ${id + 1}`}
    />
  );
};
