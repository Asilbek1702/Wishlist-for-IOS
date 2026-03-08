import axios, { AxiosError } from 'axios';
import { getToken, logout } from './auth';

const BASE_URL = 'https://wishlist-uxic.vercel.app';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers['x-user-token'] = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await logout();
    }
    return Promise.reject(error);
  }
);