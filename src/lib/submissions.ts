import {
  CreateSubmissionDto,
  SubmissionStatsEntity,
} from 'types/api/submissions';
import { QuestionSubmission } from 'types/models/submission';
import { api } from 'utils/apiUtils';

export const createSubmission = async (
  data: CreateSubmissionDto,
): Promise<QuestionSubmission> => {
  const response = await api.post('submissions', data);
  return response.data;
};

export const getSubmissionStats = async (): Promise<SubmissionStatsEntity> => {
  const response = await api.get('submissions/stats');
  return response.data;
};
