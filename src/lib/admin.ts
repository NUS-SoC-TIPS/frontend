import { AdminStatsEntity } from 'types/api/admin';
import { api } from 'utils/apiUtils';

export const getAdminStats = async (): Promise<AdminStatsEntity> => {
  const response = await api.get('admin/stats');
  return response.data;
};
