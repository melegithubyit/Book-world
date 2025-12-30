"use client";

import Link from "next/link";
import type { Book } from "@/types/books";
import { useSavedBooksQuery } from "@/hooks/queries/useBooksQuery";
import { Button } from "@/components/ui/button";
import { useRemoveSavedBookMutation } from "@/hooks/mutations/useBooksMutations";

function SavedBookRow({ book }: { book: Book }) {
  const authors = book.authors?.length ? book.authors.join(", ") : "Unknown Author";
  const removeMutation = useRemoveSavedBookMutation();
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4 text-card-foreground">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{book.title}</div>
        <div className="truncate text-sm text-muted-foreground">{authors}</div>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => removeMutation.mutate(book.bookId)}
          disabled={removeMutation.isPending}
        >
          {removeMutation.isPending ? "Removing..." : "Remove"}
        </Button>
        <Link
          href={`/books/${book.bookId}`}
          className="text-xs text-muted-foreground hover:underline"
        >
          View
        </Link>
      </div>
    </div>
  );
}

export default function Page() {
  const savedQuery = useSavedBooksQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Saved</h1>
        <p className="text-sm text-muted-foreground">
          Books you saved to read later.
        </p>
      </div>

      {savedQuery.isLoading ? (
        <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
          Loading...
        </div>
      ) : savedQuery.isError ? (
        <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
          Could not load saved books.
        </div>
      ) : null}

      <div className="space-y-3">
        {(savedQuery.data ?? []).map((b) => (
          <SavedBookRow key={b.bookId} book={b} />
        ))}
      </div>
    </div>
  );
}
