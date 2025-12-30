import api from "@/lib/api-client";
import type { Book, BookSearchParams, BookSearchResponse } from "@/types/books";

type MessageResponse = { message: string };

export type SaveBookRequest = {
  bookId: string;
};

export type FinishBookRequest = {
  bookId: string;
  learningNotes?: string;
};

export type UpdateLearningNotesRequest = {
  bookId: string;
  learningNotes: string;
};

export async function searchBooks(
  params: BookSearchParams
): Promise<BookSearchResponse> {
  const { data } = await api.get<BookSearchResponse>("/books/search", {
    params,
  });
  return data;
}

export async function getRecommendations(): Promise<BookSearchResponse> {
  const { data } = await api.get<BookSearchResponse>("/books/recommendations");
  return data;
}

export async function getBookById(id: string): Promise<Book> {
  const { data } = await api.get<Book>(`/books/${id}`);
  return data;
}

export async function getSavedBooks(): Promise<Book[]> {
  const { data } = await api.get<Book[]>("/books/saved");
  return data;
}

export async function getFinishedBooks(): Promise<Book[]> {
  const { data } = await api.get<Book[]>("/books/finished");
  return data;
}

export async function saveBook(
  payload: SaveBookRequest
): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>("/books/saved", payload);
  return data;
}

export async function removeSavedBook(
  bookId: string
): Promise<MessageResponse> {
  const { data } = await api.delete<MessageResponse>(`/books/saved/${bookId}`);
  return data;
}

export async function markBookAsFinished(
  payload: FinishBookRequest
): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>("/books/finished", payload);
  return data;
}

export async function removeFinishedBook(
  bookId: string
): Promise<MessageResponse> {
  const { data } = await api.delete<MessageResponse>(
    `/books/finished/${bookId}`
  );
  return data;
}

export async function updateLearningNotes(
  payload: UpdateLearningNotesRequest
): Promise<MessageResponse> {
  const { bookId, learningNotes } = payload;
  const { data } = await api.put<MessageResponse>(
    `/books/finished/${bookId}/notes`,
    { learningNotes }
  );
  return data;
}
