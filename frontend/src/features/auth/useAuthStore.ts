import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import type { User, AuthTokens, Role } from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

interface AuthStore {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: Role) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const res = await axios.post<{ access: string; refresh: string; user: User }>(
          `${BASE_URL}/api/v1/auth/login/`,
          { email, password },
        );
        set({
          user: res.data.user,
          tokens: { access: res.data.access, refresh: res.data.refresh },
          isAuthenticated: true,
        });
      },

      logout: async () => {
        const tokens = get().tokens;
        if (tokens?.refresh) {
          try {
            await axios.post(
              `${BASE_URL}/api/v1/auth/logout/`,
              { refresh: tokens.refresh },
              { headers: { Authorization: `Bearer ${tokens.access}` } },
            );
          } catch {
            // Ignore — clear local state regardless
          }
        }
        set({ user: null, tokens: null, isAuthenticated: false });
      },

      hasRole: (role: Role) => get().user?.role === role,

      hasAnyRole: (roles: Role[]) => {
        const userRole = get().user?.role;
        return userRole ? roles.includes(userRole) : false;
      },
    }),
    {
      name: 'fatakpay-auth',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
