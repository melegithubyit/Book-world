"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  UpdatePreferencesRequest,
  UpdatePreferencesResponse,
} from "@/types/users";
import { updateUserPreferences } from "@/services/users";

type MutationOpts = Omit<
  UseMutationOptions<
    UpdatePreferencesResponse,
    unknown,
    UpdatePreferencesRequest,
    unknown
  >,
  "mutationFn"
>;

export function useUpdatePreferencesMutation(options?: MutationOpts) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserPreferences,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["users", "preferences"] });
      queryClient.invalidateQueries({ queryKey: ["books", "recommendations"] });

      toast.success("Preferences updated");
      options?.onSuccess?.(
        ...(args as Parameters<NonNullable<typeof options.onSuccess>>)
      );
    },
    onError: (error: any, variables, context) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Could not update preferences.";
      toast.error(message);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}
