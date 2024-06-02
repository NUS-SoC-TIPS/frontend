import {
  AdminOverview,
  CohortAdminItem,
  CohortAdminUpdateResult,
  CohortStudentValidationResult,
  CreateCohortDto,
  CreateExclusionDto,
  CreateStudentDto,
  CreateWindowDto,
  UpdateCohortDto,
  UpdateWindowDto,
  WindowItem,
} from '@/types/api/admin';
import { WindowBase } from '@/types/api/windows';
import { api } from '@/utils/apiUtils';

export const getOverviewAdmin = async (): Promise<AdminOverview> => {
  const response = await api.get('admin');
  return response.data;
};

export const getCohortAdmin = async (id: number): Promise<CohortAdminItem> => {
  const response = await api.get(`cohorts_admin/${id}`);
  return response.data;
};

export const createCohortAdmin = async (
  dto: CreateCohortDto,
): Promise<{ id: number }> => {
  const response = await api.post('cohorts_admin', dto);
  return response.data;
};

export const updateCohortAdmin = async (
  id: number,
  dto: UpdateCohortDto,
): Promise<CohortAdminUpdateResult> => {
  const response = await api.patch(`cohorts_admin/${id}`, dto);
  return response.data;
};

export const createWindowAdmin = async (
  cohortId: number,
  dto: CreateWindowDto,
): Promise<WindowBase> => {
  const response = await api.post(`cohorts_admin/${cohortId}/windows`, dto);
  return response.data;
};

export const updateWindowAdmin = async (
  cohortId: number,
  dto: UpdateWindowDto,
): Promise<WindowBase> => {
  const response = await api.patch(`cohorts_admin/${cohortId}/windows`, dto);
  return response.data;
};

export const deleteWindowAdmin = async (id: number): Promise<void> => {
  await api.delete(`windows/${id}`);
};

export const validateStudentsAdmin = async (
  cohortId: number,
  dto: CreateStudentDto[],
): Promise<CohortStudentValidationResult> => {
  const response = await api.post(
    `cohorts_admin/${cohortId}/students/validate`,
    dto,
  );
  return response.data;
};

export const createStudentsAdmin = async (
  cohortId: number,
  dto: CreateStudentDto[],
): Promise<CohortStudentValidationResult> => {
  const response = await api.post(
    `cohorts_admin/${cohortId}/students/create`,
    dto,
  );
  return response.data;
};

export const getWindowAdmin = async (id: number): Promise<WindowItem> => {
  const response = await api.get(`windows/${id}`);
  return response.data;
};

export const createExclusion = async (
  dto: CreateExclusionDto,
): Promise<void> => {
  await api.post('exclusions', dto);
};

export const deleteExclusion = async (id: number): Promise<void> => {
  await api.delete(`exclusions/${id}`);
};

export const autoExclude = async (id: number): Promise<number> => {
  const response = await api.post(`windows/${id}/autoexclude`);
  return response.data;
};

export const pairStudents = async (id: number): Promise<number> => {
  const response = await api.post(`windows/${id}/pairs`);
  return response.data;
};

export const rematchWindows = async (id: number): Promise<void> => {
  await api.post(`cohorts_admin/${id}/windows/rematch`);
};
