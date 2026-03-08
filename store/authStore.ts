import { create } from 'zustand';

type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  clearToken: () => void;
  hydrate: (token: string | null) => void;
};

export const authStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  setToken: (token) => set({ token, isAuthenticated: true }),
  clearToken: () => set({ token: null, isAuthenticated: false }),
  hydrate: (token) => set({ token, isAuthenticated: !!token }),
}));
