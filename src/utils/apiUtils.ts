import axios from 'axios';

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
    return Promise.reject(new Error(error));
  },
);

export { api };
