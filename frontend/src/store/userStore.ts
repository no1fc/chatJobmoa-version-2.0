import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  accessToken: string | null;
  token: string | null; // Alias for accessToken for compatibility
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      accessToken: null,
      token: null,
      isAuthenticated: false,
      setAccessToken: (token: string) =>
        set({ accessToken: token, token: token, isAuthenticated: true }),
      logout: () => set({ accessToken: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
