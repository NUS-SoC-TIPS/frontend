import { AuthDto } from 'types/api/auth';
import { UserSettingsConfig } from 'types/models/user';
import { api } from 'utils/apiUtils';
import tokenUtils from 'utils/tokenUtils';

export const login = async (data: AuthDto): Promise<void> => {
  const response = await api.post('auth/login', data);
  const { token } = response.data;
  tokenUtils.storeToken(token);
};

export const logout = (): Promise<void> => {
  tokenUtils.removeToken();
  return Promise.resolve();
};

export const getSelf = async (): Promise<UserSettingsConfig | null> => {
  const token = tokenUtils.getToken();
  if (token == null) {
    return Promise.resolve(null);
  }

  // Check with backend to see if token is still valid
  try {
    const response = await api.get('users/self');
    return response.data as UserSettingsConfig;
  } catch (error) {
    logout();
    return Promise.reject(error);
  }
};
