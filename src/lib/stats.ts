import { QuestionStats, TaskStats } from 'types/api/stats';
import { api } from 'utils/apiUtils';

export const getQuestionStats = async (): Promise<QuestionStats> => {
  const response = await api.get('stats/questions');
  return {
    ...response.data,
    closestWindow: {
      ...response.data.closestWindow,
      startAt: new Date(response.data.closestWindow.startAt),
      endAt: new Date(response.data.closestWindow.endAt),
    },
  };
};

export const getTaskStats = async (): Promise<TaskStats> => {
  const response = await api.get('stats/tasks');
  return {
    windows: (response.data as TaskStats).windows.map((w) => ({
      ...w,
      window: {
        ...w.window,
        startAt: new Date(w.window.startAt),
        endAt: new Date(w.window.endAt),
      },
      submissions: w.submissions.map((s) => ({
        ...s,
        submission: {
          ...s.submission,
          createdAt: new Date(s.submission.createdAt),
        },
      })),
      interviews: w.interviews.map((i) => ({
        ...i,
        record: {
          ...i.record,
          createdAt: new Date(i.record.createdAt),
        },
      })),
    })),
  };
};
