"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Book } from "@/types/books";
import { useBookSearchQuery, useRecommendationsQuery } from "@/hooks/queries/useBooksQuery";
import { useAuthStore } from "@/store/auth.store";

function BookCard({ book }: { book: Book }) {
  const cover =
    book.imageLinks?.thumbnail ||
    book.imageLinks?.smallThumbnail ||
    book.imageLinks?.small ||
    "";

  const authors = book.authors?.length ? book.authors.join(", ") : "Unknown Author";
  const category = book.categories?.[0];

  return (
    <Link href={`/books/${book.bookId}`} className="block">
      <div className="h-80 rounded-lg border bg-card/60 text-card-foreground backdrop-blur-sm transition-colors hover:bg-card/70">
        <div className="flex h-full flex-col p-5">
          <div className="flex flex-1 flex-col gap-4">
            <div className="mx-auto h-36 w-24 shrink-0 overflow-hidden rounded bg-muted">
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover} alt={book.title} className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1 text-center">
              <div className="text-base font-semibold leading-tight line-clamp-2">{book.title}</div>
              {book.subtitle ? (
                <div className="mt-1 text-sm text-muted-foreground line-clamp-1">{book.subtitle}</div>
              ) : null}
              <div className="mt-2 text-sm text-muted-foreground line-clamp-1">{authors}</div>
              {category ? (
                <span className="mt-2 inline-block rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                  {category}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Page() {
  const user = useAuthStore((s) => s.user);
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("a");
  const [startIndex, setStartIndex] = useState(0);

  const params = useMemo(
    () => ({
      q: submittedQuery || "a",
      startIndex,
      maxResults: 40,
      orderBy: "relevance" as const,
      printType: "books" as const,
    }),
    [submittedQuery, startIndex]
  );

  const searchQuery = useBookSearchQuery(params);
  const recommendationsQuery = useRecommendationsQuery(Boolean(user?.preferencesCompleted));

  const books = searchQuery.data?.books ?? [];
  const totalItems = searchQuery.data?.totalItems ?? 0;

  const canPrev = startIndex > 0;
  const canNext = startIndex + 40 < totalItems;

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">All books</h1>
          <p className="text-muted-foreground">Browse everything available.</p>
        </div>

        <form
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
          onSubmit={(e) => {
            e.preventDefault();
            setStartIndex(0);
            setSubmittedQuery(query.trim() || "a");
          }}
        >
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books..."
          />
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={searchQuery.isFetching}>
              {searchQuery.isFetching ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>

        {searchQuery.isError ? (
          <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
            Could not load books.
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((b) => (
            <BookCard key={b.bookId} book={b} />
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStartIndex((v) => Math.max(0, v - 40))}
            disabled={!canPrev || searchQuery.isFetching}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setStartIndex((v) => v + 40)}
            disabled={!canNext || searchQuery.isFetching}
          >
            Next
          </Button>
        </div>
      </section>

      {user?.preferencesCompleted && (
        <section className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold">Recommended books</h2>
            <p className="text-muted-foreground">
              This section will be based on your preferences.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(recommendationsQuery.data?.books ?? []).map((b) => (
              <BookCard key={b.bookId} book={b} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Powered by Google Books API
      </div>
    </div>
  );
}
