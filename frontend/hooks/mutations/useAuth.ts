"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import type {
  AuthResponse,
  GoogleAuthRequest,
  LoginRequest,
  SignupRequest,
} from "@/types/auth";
import { googleAuth, login, signup } from "@/services/auth";
import { logout as logoutApi } from "@/services/auth";

type MutationOpts<TVariables> = Omit<
  UseMutationOptions<AuthResponse, unknown, TVariables, unknown>,
  "mutationFn"
>;

export function useSignupMutation(options?: MutationOpts<SignupRequest>) {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: signup,
    onSuccess: (...args) => {
      const [data] = args;
      setAuth(data.accessToken, {
        id: data.user.id,
        fullName: data.user.fullName,
        email: data.user.email,
        avatar: data.user.avatar,
        preferencesCompleted: data.user.preferencesCompleted,
      });
      options?.onSuccess?.(
        ...(args as Parameters<NonNullable<typeof options.onSuccess>>)
      );
    },
    ...options,
  });
}

export function useLoginMutation(options?: MutationOpts<LoginRequest>) {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: login,
    onSuccess: (...args) => {
      const [data] = args;
      setAuth(data.accessToken, {
        id: data.user.id,
        fullName: data.user.fullName,
        email: data.user.email,
        avatar: data.user.avatar,
        preferencesCompleted: data.user.preferencesCompleted,
      });
      options?.onSuccess?.(
        ...(args as Parameters<NonNullable<typeof options.onSuccess>>)
      );
    },
    ...options,
  });
}

export function useGoogleAuthMutation(
  options?: MutationOpts<GoogleAuthRequest>
) {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: googleAuth,
    onSuccess: (...args) => {
      const [data] = args;
      setAuth(data.accessToken, {
        id: data.user.id,
        fullName: data.user.fullName,
        email: data.user.email,
        avatar: data.user.avatar,
        preferencesCompleted: data.user.preferencesCompleted,
      });
      options?.onSuccess?.(
        ...(args as Parameters<NonNullable<typeof options.onSuccess>>)
      );
    },
    ...options,
  });
}

export function useLogoutMutation(
  options?: Omit<
    UseMutationOptions<{ message: string }, unknown, void, unknown>,
    "mutationFn"
  >
) {
  const doLogout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: (...args) => {
      doLogout();
      options?.onSuccess?.(
        ...(args as Parameters<NonNullable<typeof options.onSuccess>>)
      );
    },
    ...options,
  });
}
