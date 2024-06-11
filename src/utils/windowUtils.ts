import { WindowBase } from '@/types/api/windows';

export const findCurrentWindow = (windows: WindowBase[]): number => {
  if (windows.length === 0) {
    return 0;
  }
  const currentTime = new Date();
  const index = windows.findIndex(
    (w) => w.startAt <= currentTime && w.endAt >= currentTime,
  );
  if (index !== -1) {
    return index;
  }
  if (windows[0].startAt > currentTime) {
    return 0;
  }
  const lastIndex = windows.length - 1;
  return lastIndex;
};

export const findWindowIdFromStep = (
  step: number,
  windows: WindowBase[],
): number => {
  if (windows.length === 0) {
    return 0;
  }
  if (step < 0) {
    return windows[0].id;
  }
  if (step >= windows.length) {
    return windows[windows.length - 1].id;
  }
  return windows[step].id;
};

type TaskStepData = {
  left: 'RED' | 'GREEN' | 'GREY' | 'NONE';
  right: 'RED' | 'GREEN' | 'GREY' | 'NONE';
  icon: 'CHECK' | 'CROSS' | 'NONE';
}[];

export const computeTaskStepData = (
  windows: {
    id: number;
    startAt: Date;
    endAt: Date;
    exclusion: {
      reason: string;
    } | null;
    previouslyExcluded: boolean;
    hasCompletedQuestions: boolean;
    hasCompletedInterview: boolean;
  }[],
): TaskStepData => {
  const currentTime = new Date();
  const taskStepColors: TaskStepData = [];
  windows.forEach((window, index) => {
    if (window.previouslyExcluded) {
      // Index is guaranteed to be non-zero, since there must have been a previous exclusion.
      taskStepColors.push({
        left: taskStepColors[index - 1].right,
        right: 'GREY',
        icon: 'CROSS',
      });
      return;
    }
    if (window.exclusion != null) {
      taskStepColors.push({
        left: index === 0 ? 'NONE' : taskStepColors[index - 1].right,
        right: 'RED',
        icon: 'CROSS',
      });
      return;
    }
    if (window.hasCompletedQuestions && window.hasCompletedInterview) {
      taskStepColors.push({
        left: index === 0 ? 'NONE' : taskStepColors[index - 1].right,
        right: 'GREEN',
        icon: 'CHECK',
      });
      return;
    }
    if (window.startAt > currentTime || currentTime <= window.endAt) {
      taskStepColors.push({
        left: index === 0 ? 'NONE' : taskStepColors[index - 1].right,
        right: 'NONE',
        icon: 'NONE',
      });
      return;
    }
    taskStepColors.push({
      left: index === 0 ? 'NONE' : taskStepColors[index - 1].right,
      right: 'GREY',
      icon: 'CHECK',
    });
  });

  return taskStepColors;
};
