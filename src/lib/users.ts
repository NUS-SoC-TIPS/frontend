import { UpdateSettingsDto } from 'types/api/users';
import { User } from 'types/models/user';
import { api } from 'utils/apiUtils';

export const updateSettings = async (dto: UpdateSettingsDto): Promise<User> => {
  const response = await api.patch('users/settings', dto);
  return response.data;
};
