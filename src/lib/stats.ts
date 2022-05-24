import { QuestionStats, TaskStats } from 'types/api/stats';
import { api } from 'utils/apiUtils';

export const getQuestionStats = async (): Promise<QuestionStats> => {
  const response = await api.get('stats/questions');
  return response.data as QuestionStats;
};

export const getTaskStats = async (): Promise<TaskStats> => {
  const response = await api.get('stats/tasks');
  return response.data as TaskStats;
};
