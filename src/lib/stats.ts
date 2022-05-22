import { QuestionStats } from 'types/api/stats';
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
