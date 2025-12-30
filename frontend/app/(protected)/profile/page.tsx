"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useUserPreferencesQuery } from "@/hooks/queries/useUsersQuery";
import { PreferencesModal } from "@/components/protected/PreferencesModal";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}

export default function Page() {
  const user = useAuthStore((s) => s.user);
  const prefsQuery = useUserPreferencesQuery(Boolean(user));
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Your account details and reading preferences.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-lg border bg-card text-card-foreground lg:col-span-2">
          <div className="p-4">
            <div className="text-sm font-semibold">Account</div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <InfoRow label="Name" value={user?.fullName ?? "—"} />
              <InfoRow label="Email" value={user?.email ?? "—"} />
              <InfoRow label="Status" value="Active (placeholder)" />
              <InfoRow label="Joined" value={"—"} />
            </div>
          </div>
        </section>

        <section className="rounded-lg border bg-card text-card-foreground">
          <div className="p-4">
            <div className="text-sm font-semibold">Preferences</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Used to recommend books on your dashboard.
            </p>

            {prefsQuery.isLoading ? (
              <div className="mt-4 text-sm text-muted-foreground">Loading...</div>
            ) : prefsQuery.isError ? (
              <div className="mt-4 text-sm text-muted-foreground">
                Could not load preferences.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Genres</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(prefsQuery.data?.genres ?? []).length ?
                      (prefsQuery.data?.genres ?? []).map((g) => (
                        <span
                          key={g}
                          className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {g}
                        </span>
                      )) :
                      <span className="text-sm text-muted-foreground">—</span>}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-muted-foreground">Authors</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(prefsQuery.data?.authors ?? []).length ?
                      (prefsQuery.data?.authors ?? []).map((a) => (
                        <span
                          key={a}
                          className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {a}
                        </span>
                      )) :
                      <span className="text-sm text-muted-foreground">—</span>}
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={() => setShowModal(true)} variant="outline">
                    Update Preferences
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <PreferencesModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
