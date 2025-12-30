import api from "@/lib/api-client";
import type {
  UpdatePreferencesRequest,
  UpdatePreferencesResponse,
  UserPreferences,
} from "@/types/users";

export async function getUserPreferences(): Promise<UserPreferences> {
  const { data } = await api.get<UserPreferences>("/users/preferences");
  return data;
}

export async function updateUserPreferences(
  payload: UpdatePreferencesRequest
): Promise<UpdatePreferencesResponse> {
  const { data } = await api.put<UpdatePreferencesResponse>(
    "/users/preferences",
    payload
  );
  return data;
}
