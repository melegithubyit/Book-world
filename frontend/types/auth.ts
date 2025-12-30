export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  avatar: string | null;
  preferencesCompleted: boolean;
};

export type AuthResponse = {
  message: string;
  accessToken: string;
  user: AuthUser;
};

export type SignupRequest = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type GoogleAuthRequest = {
  idToken: string;
};
