"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserPreferences } from "@/services/users";

export function useUserPreferencesQuery(enabled = true) {
  return useQuery({
    queryKey: ["users", "preferences"],
    queryFn: () => getUserPreferences(),
    enabled,
  });
}
