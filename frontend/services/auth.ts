import api from "@/lib/api-client";
import type {
  AuthResponse,
  AuthUser,
  GoogleAuthRequest,
  LoginRequest,
  SignupRequest,
} from "@/types/auth";

export async function signup(payload: SignupRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/signup", payload);
  return data;
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  return data;
}

export async function googleAuth(
  payload: GoogleAuthRequest
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/google", payload);
  return data;
}

export async function logout(): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>("/auth/logout");
  return data;
}

export async function refresh(): Promise<{
  accessToken: string;
  user?: AuthUser;
}> {
  const { data } = await api.post<{ accessToken: string; user?: AuthUser }>(
    "/auth/refresh",
    {}
  );
  return data;
}
