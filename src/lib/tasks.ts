import { TaskStatsEntity } from 'types/api/tasks';
import { api } from 'utils/apiUtils';

export const getTaskStats = async (): Promise<TaskStatsEntity> => {
  const response = await api.get('tasks/stats');
  return response.data;
};
