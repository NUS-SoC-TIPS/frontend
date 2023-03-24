import axios from 'axios';

import { handleDates } from './dateUtils';
import tokenUtils from './tokenUtils';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_API}`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = tokenUtils.getToken();

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    throw error;
  },
);

api.interceptors.response.use((originalResponse) => {
  originalResponse.data = handleDates(originalResponse.data);
  return originalResponse;
});

export { api };
