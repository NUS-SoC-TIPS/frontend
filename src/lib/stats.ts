import { QuestionStats } from 'types/api/stats/question';
import { TaskStats } from 'types/api/stats/task';
import { api } from 'utils/apiUtils';

export const getQuestionStats = async (): Promise<QuestionStats> => {
  const response = await api.get('stats/questions');
  return response.data as QuestionStats;
};

export const getTaskStats = async (): Promise<TaskStats> => {
  const response = await api.get('stats/tasks');
  return response.data as TaskStats;
};
