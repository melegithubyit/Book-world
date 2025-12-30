export type UserPreferences = {
  genres: string[];
  authors: string[];
};

export type UpdatePreferencesRequest = UserPreferences;

export type UpdatePreferencesResponse = {
  message: string;
  preferences: UserPreferences;
};
