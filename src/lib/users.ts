import { UpdateSettingsDto } from 'types/api/users';
import { UserSettingsConfig } from 'types/models/user';
import { api } from 'utils/apiUtils';

export const updateSettings = async (
  dto: UpdateSettingsDto,
): Promise<UserSettingsConfig> => {
  const response = await api.patch('users/settings', dto);
  return response.data as UserSettingsConfig;
};
