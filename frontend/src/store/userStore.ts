import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      accessToken: null,
      isAuthenticated: false,
      setAccessToken: (token: string) =>
        set({ accessToken: token, isAuthenticated: true }),
      logout: () => set({ accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
    },
  ),
);
