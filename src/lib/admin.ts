import { AdminStatsEntity } from 'types/api/admin';
import { Window } from 'types/models/window';
import { api } from 'utils/apiUtils';

export const getAdminWindows = async (): Promise<Window[]> => {
  const response = await api.get('admin/windows');
  return response.data;
};

export const getAdminStats = async (
  windowId: number,
): Promise<AdminStatsEntity> => {
  const response = await api.get(`admin/stats/${windowId}`);
  return response.data;
};
