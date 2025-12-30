import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AuthUser } from "@/types/auth";

type User = AuthUser;

type AuthState = {
  accessToken: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,

      setAuth: (token, user) => set({ accessToken: token, user }),

      setAccessToken: (token) => set({ accessToken: token }),

      setUser: (user) => set({ user }),

      logout: () => set({ accessToken: null, user: null }),
    }),
    {
      name: "book-world-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
);
