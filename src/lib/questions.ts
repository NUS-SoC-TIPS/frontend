import { Question } from 'types/models/question';
import { api } from 'utils/apiUtils';

export const getQuestions = async (): Promise<Question[]> => {
  const response = await api.get('questions');
  return response.data as Question[];
};
