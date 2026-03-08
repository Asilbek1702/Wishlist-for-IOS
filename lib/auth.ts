import * as SecureStore from 'expo-secure-store';
import { authStore } from '../store/authStore';

const TOKEN_KEY = 'session_token';

export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  authStore.getState().setToken(token);
}

export async function logout(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } finally {
    authStore.getState().clearToken();
  }
}

export type RegisterPayload = {
  name?: string;
  email: string;
  password: string;
};

export async function register(payload: RegisterPayload): Promise<string> {
  const { api } = await import('./api');
  await api.post('/api/auth/register', payload);
  return login(payload.email, payload.password);
}

export async function login(email: string, password: string): Promise<string> {
  const { api } = await import('./api');
  const { data } = await api.post('/api/auth/mobile', { email, password });
  await setToken(data.token);
  return data.token;
}
