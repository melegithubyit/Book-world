"use client";

import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useUpdatePreferencesMutation } from "@/hooks/mutations/useUsersMutations";
import { useAuthStore } from "@/store/auth.store";
import { useUserPreferencesQuery } from "@/hooks/queries/useUsersQuery";
import { toast } from "sonner";

const quickGenres = [
  "Fiction", "Non-Fiction", "Science Fiction", "Fantasy", "Mystery", "Romance",
  "Thriller", "Biography", "History", "Self-Help", "Business", "Technology",
  "Health", "Travel", "Cooking", "Poetry", "Drama", "Horror", "Comedy"
];

function parseCsv(value: string) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function PreferencesModal({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const accessToken = useAuthStore((s) => s.accessToken);

  const prefsQuery = useUserPreferencesQuery(Boolean(user));

  const shouldOpen = Boolean(user && !user.preferencesCompleted);

  const [dismissed, setDismissed] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [authors, setAuthors] = useState("");
  const [authorInput, setAuthorInput] = useState("");

  const isOpen = open !== undefined ? open : (shouldOpen && !dismissed);

  useEffect(() => {
    if (prefsQuery.data) {
      setGenres(prefsQuery.data.genres ?? []);
      setAuthors((prefsQuery.data.authors ?? []).join(", "));
    }
  }, [prefsQuery.data]);

  const payload = useMemo(
    () => ({ genres, authors: parseCsv(authors) }),
    [genres, authors]
  );

  const mutation = useUpdatePreferencesMutation({
    onSuccess: () => {
      if (user && accessToken) {
        setAuth(accessToken, { ...user, preferencesCompleted: true });
      }

      toast.success(open ? "Preferences updated" : "Preferences saved");

      if (onClose) onClose();
      else setDismissed(true);
    },
  });

  const addGenre = (genre: string) => {
    if (!genres.includes(genre)) {
      setGenres([...genres, genre]);
    }
  };

  const removeGenre = (genre: string) => {
    setGenres(genres.filter(g => g !== genre));
  };

  const addAuthor = () => {
    if (authorInput.trim()) {
      const currentAuthors = parseCsv(authors);
      if (!currentAuthors.includes(authorInput.trim())) {
        const newAuthors = [...currentAuthors, authorInput.trim()];
        setAuthors(newAuthors.join(", "));
        setAuthorInput("");
      }
    }
  };

  const removeAuthor = (author: string) => {
    const currentAuthors = parseCsv(authors);
    const newAuthors = currentAuthors.filter(a => a !== author);
    setAuthors(newAuthors.join(", "));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-foreground/20"
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border bg-background p-6 shadow-sm"
      >
        <div className="space-y-1 mb-6">
          <div className="text-lg font-semibold">{open ? "Update your preferences" : "Complete your preferences"}</div>
          <p className="text-sm text-muted-foreground">
            Add genres and authors to get better book recommendations.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Genres</Label>
            <div className="flex flex-wrap gap-2">
              {quickGenres.map((genre) => (
                <Button
                  key={genre}
                  variant={genres.includes(genre) ? "default" : "outline"}
                  size="sm"
                  onClick={() => genres.includes(genre) ? removeGenre(genre) : addGenre(genre)}
                >
                  {genre}
                </Button>
              ))}
            </div>
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {genres.map((genre) => (
                  <Badge key={genre} variant="secondary" className="cursor-pointer" onClick={() => removeGenre(genre)}>
                    {genre} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="authors" className="text-sm font-medium">Authors</Label>
            <div className="flex gap-2">
              <Input
                id="authors"
                value={authorInput}
                onChange={(e) => setAuthorInput(e.target.value)}
                placeholder="e.g. James Clear"
                onKeyPress={(e) => e.key === 'Enter' && addAuthor()}
              />
              <Button onClick={addAuthor} disabled={!authorInput.trim()}>
                Add
              </Button>
            </div>
            {authors && (
              <div className="flex flex-wrap gap-2 mt-2">
                {parseCsv(authors).map((author) => (
                  <Badge key={author} variant="secondary" className="cursor-pointer" onClick={() => removeAuthor(author)}>
                    {author} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (onClose) onClose();
              else setDismissed(true);
            }}
            disabled={mutation.isPending}
          >
            {open ? "Cancel" : "Skip for now"}
          </Button>
          <Button
            onClick={() => mutation.mutate(payload)}
            disabled={mutation.isPending || (genres.length === 0 && parseCsv(authors).length === 0)}
          >
            {mutation.isPending ? "Saving..." : "Save preferences"}
          </Button>
        </div>
      </div>
    </div>
  );
}
