"use client";

import { useQuery } from "@tanstack/react-query";
import type { BookSearchParams } from "@/types/books";
import {
  getBookById,
  getFinishedBooks,
  getRecommendations,
  getSavedBooks,
  searchBooks,
} from "@/services/books";

export function useBookSearchQuery(params: BookSearchParams) {
  return useQuery({
    queryKey: ["books", "search", params],
    queryFn: () => searchBooks(params),
  });
}

export function useRecommendationsQuery(enabled = true) {
  return useQuery({
    queryKey: ["books", "recommendations"],
    queryFn: () => getRecommendations(),
    enabled,
  });
}

export function useBookDetailQuery(id: string) {
  return useQuery({
    queryKey: ["books", "detail", id],
    queryFn: () => getBookById(id),
    enabled: Boolean(id),
  });
}

export function useSavedBooksQuery() {
  return useQuery({
    queryKey: ["books", "saved"],
    queryFn: () => getSavedBooks(),
  });
}

export function useFinishedBooksQuery() {
  return useQuery({
    queryKey: ["books", "finished"],
    queryFn: () => getFinishedBooks(),
  });
}
