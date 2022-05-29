import { UpdateSettingsDto } from 'types/api/users';
import { UserWithSettingsAndConfig } from 'types/models/user';
import { api } from 'utils/apiUtils';

export const updateSettings = async (
  dto: UpdateSettingsDto,
): Promise<UserWithSettingsAndConfig> => {
  const response = await api.patch('users/settings', dto);
  return response.data as UserWithSettingsAndConfig;
};
