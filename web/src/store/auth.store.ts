import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CLIENT' | 'PROVIDER' | 'ADMIN';
  avatar?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  init: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,

  setAuth: (user, token) => {
    localStorage.setItem('qestra_token', token);
    localStorage.setItem('qestra_user', JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('qestra_token');
    localStorage.removeItem('qestra_user');
    set({ user: null, token: null });
  },

  init: () => {
    const token = localStorage.getItem('qestra_token');
    const userStr = localStorage.getItem('qestra_user');
    if (token && userStr) {
      set({ token, user: JSON.parse(userStr) });
    }
  },
}));
