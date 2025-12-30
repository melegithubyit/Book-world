export type BookImageLinks = {
  smallThumbnail?: string;
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
  extraLarge?: string;
  [key: string]: unknown;
};

export type Book = {
  title: string;
  subtitle?: string;
  authors: string[];
  bookId: string;
  publishedDate?: string;
  description?: string;
  categories?: string[];
  averageRating?: number | null;
  language?: string;
  imageLinks?: BookImageLinks;
  previewLink?: string | null;
  learningNotes?: string | null;
};

export type BookSearchResponse = {
  totalItems: number;
  books: Book[];
};

export type BookSearchParams = {
  q?: string;
  startIndex?: number;
  maxResults?: number;
  orderBy?: "relevance" | "newest";
  printType?: "books" | "magazines" | "all";
};
