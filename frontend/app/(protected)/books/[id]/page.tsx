"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFinishBookMutation, useSaveBookMutation } from "@/hooks/mutations/useBooksMutations";
import {
  useBookDetailQuery,
  useFinishedBooksQuery,
  useSavedBooksQuery,
} from "@/hooks/queries/useBooksQuery";

export default function Page() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();

  const [actionError, setActionError] = useState<string | null>(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [learningNotes, setLearningNotes] = useState("");

  const bookQuery = useBookDetailQuery(id);
  const book = bookQuery.data;

  const savedQuery = useSavedBooksQuery();
  const finishedQuery = useFinishedBooksQuery();

  const isSaved = useMemo(
    () => (savedQuery.data ?? []).some((b) => b.bookId === id),
    [savedQuery.data, id]
  );

  const isFinished = useMemo(
    () => (finishedQuery.data ?? []).some((b) => b.bookId === id),
    [finishedQuery.data, id]
  );

  const saveMutation = useSaveBookMutation({
    onMutate: () => setActionError(null),
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Could not save this book.";
      setActionError(message);
    },
  });

  const finishMutation = useFinishBookMutation({
    onMutate: () => setActionError(null),
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Could not mark this book as finished.";
      setActionError(message);
    },
  });

  if (bookQuery.isLoading) {
    return (
      <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
        Loading book...
      </div>
    );
  }

  if (bookQuery.isError || !book) {
    return (
      <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
        Could not load book details.
      </div>
    );
  }

  const cover =
    book.imageLinks?.large ||
    book.imageLinks?.medium ||
    book.imageLinks?.thumbnail ||
    book.imageLinks?.smallThumbnail ||
    "";

  return (
    <div className="space-y-6">
      <div>
        <Button variant="outline" onClick={() => router.back()}>
          ← Back
        </Button>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full max-w-60 overflow-hidden rounded-lg border bg-muted">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt={book.title} className="h-full w-full object-cover" />
          ) : null}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h1 className="text-xl font-semibold">{book.title}</h1>
            {book.subtitle ? (
              <p className="text-sm text-muted-foreground">{book.subtitle}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {book.previewLink ? (
              <Button asChild variant="outline">
                <a href={book.previewLink} target="_blank" rel="noreferrer">
                  Preview on Google
                </a>
              </Button>
            ) : null}

            <Button
              variant="outline"
              disabled={!id || isSaved || saveMutation.isPending}
              onClick={() => {
                if (!id) return;
                saveMutation.mutate({ bookId: id });
              }}
            >
              {isSaved ? "Saved" : saveMutation.isPending ? "Saving..." : "Save"}
            </Button>

            <Button
              disabled={!id || isFinished || finishMutation.isPending}
              onClick={() => {
                setActionError(null);
                setLearningNotes("");
                setIsNotesOpen(true);
              }}
            >
              {isFinished
                ? "Finished"
                : finishMutation.isPending
                  ? "Finishing..."
                  : "Mark as finished"}
            </Button>
          </div>

          {actionError ? (
            <div className="text-sm text-destructive">{actionError}</div>
          ) : null}

          <div className="grid gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Authors: </span>
              <span>{book.authors?.length ? book.authors.join(", ") : "Unknown Author"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Published: </span>
              <span>{book.publishedDate ?? "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Categories: </span>
              <span>{book.categories?.length ? book.categories.join(", ") : "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Language: </span>
              <span>{book.language ?? "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Rating: </span>
              <span>{book.averageRating ?? "—"}</span>
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-lg border bg-card p-4">
        <div className="text-sm font-semibold">Description</div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {book.description ?? "No description available."}
        </p>
      </section>

      {isNotesOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-foreground/20" aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-xl rounded-lg border bg-background p-6 shadow-sm"
          >
            <div className="space-y-1">
              <div className="text-lg font-semibold">Learning note</div>
              <p className="text-sm text-muted-foreground">
                Add a short note about what you learned.
              </p>
            </div>

            <div className="mt-4">
              <textarea
                value={learningNotes}
                onChange={(e) => setLearningNotes(e.target.value)}
                placeholder="e.g. Key takeaways, ideas to apply, quotes..."
                className={cn(
                  "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input min-h-28 w-full min-w-0 resize-none rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                )}
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsNotesOpen(false)}
                disabled={finishMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (!id) return;
                  finishMutation.mutate(
                    {
                      bookId: id,
                      learningNotes: learningNotes.trim() || undefined,
                    },
                    {
                      onSuccess: () => {
                        setIsNotesOpen(false);
                        setLearningNotes("");
                      },
                    }
                  );
                }}
                disabled={!id || finishMutation.isPending}
              >
                {finishMutation.isPending ? "Saving..." : "Save as finished"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
