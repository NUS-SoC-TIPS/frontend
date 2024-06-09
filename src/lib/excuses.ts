import { CreateExcuseDto, ExcuseBase } from '@/types/api/excuses';
import { ExcuseStatus } from '@/types/models/excuse';
import { api } from '@/utils/apiUtils';

export const getExcuses = async (cohortId: number): Promise<ExcuseBase[]> => {
  const response = await api.get(`excuses?cohortId=${cohortId}`);
  return response.data;
};

export const getExcuse = async (id: number): Promise<ExcuseBase> => {
  const response = await api.get(`excuses/${id}`);
  return response.data;
};

export const getSelfExcuses = async (
  windowId?: number,
): Promise<ExcuseBase[]> => {
  const response = await api.get(
    `excuses/self${windowId ? `?windowId=${windowId}` : ''}`,
  );
  return response.data;
};

export const createExcuse = async (
  data: CreateExcuseDto,
): Promise<{ id: number }> => {
  const response = await api.post('excuses/create', data);
  return response.data;
};

export const updateExcuse = async (
  id: number,
  updateData: Partial<ExcuseBase>,
): Promise<number> => {
  return await api.put(`excuses/${id}`, updateData);
};

export const approveExcuse = async (id: number): Promise<number> => {
  return await updateExcuse(id, { status: ExcuseStatus.ACCEPTED });
};

export const rejectExcuse = async (id: number): Promise<number> => {
  return await updateExcuse(id, { status: ExcuseStatus.REJECTED });
};

export const deleteExcuse = async (id: number): Promise<void> => {
  await api.delete(`excuses/${id}`);
};
