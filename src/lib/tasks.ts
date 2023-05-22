import { CohortItem, CohortListItem } from 'types/api/cohorts';
import { api } from 'utils/apiUtils';

export const getCohorts = async (): Promise<CohortListItem[]> => {
  const response = await api.get('cohorts');
  return response.data;
};

export const getCohort = async (id: number): Promise<CohortItem> => {
  const response = await api.get(`cohort/${id}`);
  return response.data;
};
