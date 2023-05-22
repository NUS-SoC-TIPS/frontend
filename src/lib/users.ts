import { UpdateSettingsDto } from 'types/api/users';
import { api } from 'utils/apiUtils';

export const updateSettings = (dto: UpdateSettingsDto): Promise<void> => {
  return api.patch('users/settings', dto);
};
