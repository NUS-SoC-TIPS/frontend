import { Room } from 'types/models/room';
import { api } from 'utils/apiUtils';

export const createRoom = async (): Promise<string> => {
  const response = await api.post('rooms');
  return response.data.slug;
};

export const getCurrentRoom = async (): Promise<Room | null> => {
  const response = await api.get('rooms');
  return response.data;
};
