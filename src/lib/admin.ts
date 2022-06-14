import { AdminStatsEntity, CreateExclusionDto } from 'types/api/admin';
import { Exclusion } from 'types/models/exclusion';
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

export const createExclusion = async (
  dto: CreateExclusionDto,
): Promise<Exclusion> => {
  const response = await api.post('admin/exclusions', dto);
  return response.data;
};

export const deleteExclusion = async (id: number): Promise<void> => {
  const response = await api.delete(`admin/exclusions/${id}`);
  return response.data;
};
