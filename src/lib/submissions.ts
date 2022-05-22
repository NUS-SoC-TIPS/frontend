import { CreateSubmissionDto } from 'types/api/submissions';
import { QuestionSubmission } from 'types/models/submission';
import { api } from 'utils/apiUtils';

export const createSubmission = async (
  data: CreateSubmissionDto,
): Promise<QuestionSubmission> => {
  const response = await api.post('submissions', data);
  return response.data;
};
