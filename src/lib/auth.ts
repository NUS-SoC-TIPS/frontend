import { AuthDto } from 'types/api/auth';
import { UserSelf } from 'types/api/users';
import { api } from 'utils/apiUtils';
import tokenUtils from 'utils/tokenUtils';

export const login = async (data: AuthDto): Promise<void> => {
  const response = await api.post('auth/login', data);
  const { token } = response.data;
  tokenUtils.storeToken(token);
};

export const loginDev = async (): Promise<void> => {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Should only be called in development');
  }
  const response = await api.post('dev/login');
  const { token } = response.data;
  tokenUtils.storeToken(token);
};

export const logout = (): Promise<void> => {
  tokenUtils.removeToken();
  return Promise.resolve();
};

export const getSelf = async (): Promise<UserSelf | null> => {
  const token = tokenUtils.getToken();
  if (token == null) {
    return Promise.resolve(null);
  }

  // Check with backend to see if token is still valid
  try {
    const response = await api.get('users/self');
    return response.data as UserSelf;
  } catch (error) {
    logout();
    return Promise.reject(error);
  }
};
