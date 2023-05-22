import {
  QuestionListItem,
  QuestionStats,
  SubmissionItem,
  SubmissionListItem,
} from 'types/api/questions';
import {
  CreateSubmissionDto,
  UpdateSubmissionDto,
} from 'types/api/submissions';
import { api } from 'utils/apiUtils';

export const getQuestions = async (): Promise<QuestionListItem[]> => {
  const response = await api.get('questions');
  return response.data;
};

export const getQuestionStats = async (): Promise<QuestionStats> => {
  const response = await api.get('questions/stats');
  return response.data;
};

export const createSubmission = async (
  data: CreateSubmissionDto,
): Promise<{ id: number }> => {
  const response = await api.post('questions/submissions', data);
  return response.data;
};

export const getSubmissions = async (): Promise<SubmissionListItem[]> => {
  const response = await api.get('questions/submissions');
  return response.data;
};

export const getSubmission = async (id: number): Promise<SubmissionItem> => {
  const response = await api.get(`questions/submissions/${id}`);
  return response.data;
};

export const updateSubmission = async (
  id: number,
  data: UpdateSubmissionDto,
): Promise<{ codeWritten: string }> => {
  const response = await api.patch(`questions/submissions/${id}`, data);
  return response.data;
};
