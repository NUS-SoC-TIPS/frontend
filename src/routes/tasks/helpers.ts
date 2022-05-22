import { TaskStatsWindow } from 'types/api/stats';

export const computeSteps = (
  steps: TaskStatsWindow[],
): { initialStep: number; maxStep: number } => {
  const currentTime = new Date();
  const maxStep = steps.length;
  let initialStep = steps.findIndex(
    (w) => w.window.startAt <= currentTime && w.window.endAt >= currentTime,
  );
  if (initialStep === -1) {
    initialStep =
      steps[0]?.window.startAt ?? currentTime > currentTime
        ? 0
        : Math.max(steps.length - 1, 0);
  }
  return { maxStep, initialStep };
};

export const computeCompletion = (
  steps: TaskStatsWindow[],
): { isSuccess: boolean; isFailure: boolean }[] => {
  const currentTime = new Date();
  return steps.map((step) => {
    const isSuccess = ((): boolean => {
      if (step.window.requireInterview && step.interviews.length === 0) {
        return false;
      }
      return step.submissions.length >= step.window.numQuestions;
    })();
    const isFailure = !isSuccess && currentTime > step.window.endAt;
    return { isSuccess, isFailure };
  });
};
