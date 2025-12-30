"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  FinishBookRequest,
  SaveBookRequest,
  UpdateLearningNotesRequest,
} from "@/services/books";
import {
  markBookAsFinished,
  removeFinishedBook,
  removeSavedBook,
  saveBook,
  updateLearningNotes,
} from "@/services/books";

type MessageResponse = { message: string };

type SaveMutationOpts = Omit<
  UseMutationOptions<MessageResponse, unknown, SaveBookRequest, unknown>,
  "mutationFn"
>;

export function useSaveBookMutation(options?: SaveMutationOpts) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveBook,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["books", "saved"] });

      toast.success("Book saved");
      options?.onSuccess?.(
        ...(args as Parameters<NonNullable<typeof options.onSuccess>>)
      );
    },
    onError: (error: any, variables, context) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Could not save book.";
      toast.error(message);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}

type RemoveSavedMutationOpts = Omit<
  UseMutationOptions<MessageResponse, unknown, string, unknown>,
  "mutationFn"
>;

export function useRemoveSavedBookMutation(options?: RemoveSavedMutationOpts) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeSavedBook,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["books", "saved"] });

      toast.success("Removed from saved");
      options?.onSuccess?.(
        ...(args as Parameters<NonNullable<typeof options.onSuccess>>)
      );
    },
    onError: (error: any, variables, context) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Could not remove saved book.";
      toast.error(message);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}

type FinishMutationOpts = Omit<
  UseMutationOptions<MessageResponse, unknown, FinishBookRequest, unknown>,
  "mutationFn"
>;

export function useFinishBookMutation(options?: FinishMutationOpts) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markBookAsFinished,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["books", "finished"] });

      toast.success("Marked as finished");
      options?.onSuccess?.(
        ...(args as Parameters<NonNullable<typeof options.onSuccess>>)
      );
    },
    onError: (error: any, variables, context) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Could not mark as finished.";
      toast.error(message);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}

type RemoveFinishedMutationOpts = Omit<
  UseMutationOptions<MessageResponse, unknown, string, unknown>,
  "mutationFn"
>;

export function useRemoveFinishedBookMutation(
  options?: RemoveFinishedMutationOpts
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFinishedBook,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["books", "finished"] });

      toast.success("Removed from finished");
      options?.onSuccess?.(
        ...(args as Parameters<NonNullable<typeof options.onSuccess>>)
      );
    },
    onError: (error: any, variables, context) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Could not remove finished book.";
      toast.error(message);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}

type UpdateNotesMutationOpts = Omit<
  UseMutationOptions<
    MessageResponse,
    unknown,
    UpdateLearningNotesRequest,
    unknown
  >,
  "mutationFn"
>;

export function useUpdateLearningNotesMutation(
  options?: UpdateNotesMutationOpts
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLearningNotes,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["books", "finished"] });

      toast.success("Learning note updated");
      options?.onSuccess?.(
        ...(args as Parameters<NonNullable<typeof options.onSuccess>>)
      );
    },
    onError: (error: any, variables, context) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Could not update learning note.";
      toast.error(message);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}
