import {
  InterviewItem,
  InterviewListItem,
  InterviewStats,
} from 'types/api/interviews';
import { api } from 'utils/apiUtils';

export const createRoom = async (): Promise<string> => {
  const response = await api.post('interviews/rooms');
  return response.data.slug as string;
};

export const getCurrentRoom = async (): Promise<string | null> => {
  const response = await api.get('interviews/rooms');
  return response.data?.slug ?? null;
};

export const getInterviewStats = async (): Promise<InterviewStats> => {
  const response = await api.get('interviews/stats');
  return response.data;
};

export const getInterviews = async (): Promise<InterviewListItem[]> => {
  const response = await api.get('interviews');
  return response.data;
};

export const getInterview = async (id: number): Promise<InterviewItem> => {
  const response = await api.get(`interviews/records/${id}`);
  return response.data;
};
