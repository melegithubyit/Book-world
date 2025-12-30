"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { refresh } from "@/services/auth";
import { LogoutButton } from "@/components/protected/LogoutButton";
import { PreferencesModal } from "@/components/protected/PreferencesModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/themeProvider";
import { Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/saved", label: "Saved" },
  { href: "/finished", label: "Finished" },
  { href: "/profile", label: "Profile" },
];

export function ProtectedShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { theme, toggleTheme } = useTheme();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("book-world-sidebar-collapsed");
      setSidebarCollapsed(stored === "true");
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "book-world-sidebar-collapsed",
        sidebarCollapsed ? "true" : "false"
      );
    } catch {
      // ignore
    }
  }, [sidebarCollapsed]);

  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setUser = useAuthStore((s) => s.setUser);
  const doLogout = useAuthStore((s) => s.logout);

  useEffect(() => {
    let cancelled = false;

    async function ensureSession() {
      // If we already have a token, do nothing.
      if (accessToken) return;

      // Try to refresh using httpOnly cookie.
      try {
        const res = await refresh();
        if (cancelled) return;
        setAccessToken(res.accessToken);
        if (res.user) setUser(res.user);
      } catch {
        doLogout();
        router.replace("/login");
      }
    }

    ensureSession();

    return () => {
      cancelled = true;
    };
  }, [accessToken, setAccessToken, setUser, doLogout, router]);

  const displayName = user?.fullName?.trim() || user?.email || "Signed in user";
  const fallback = (user?.fullName || user?.email || "U")
    .split(/\s|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  const sidebarLabel = useMemo(() => (sidebarCollapsed ? "BW" : "Book World"), [sidebarCollapsed]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex",
            sidebarCollapsed ? "w-16" : "w-64"
          )}
        >
          <div
            className={cn(
              "flex h-14 items-center font-semibold",
              sidebarCollapsed ? "justify-center px-2" : "px-4"
            )}
          >
            <span className={cn(sidebarCollapsed && "text-sm")}>{sidebarLabel}</span>
          </div>

          <div className={cn("flex justify-center pb-2", sidebarCollapsed ? "px-1" : "px-4")}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed((v) => !v)}
              className="h-8 w-8"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          <nav className={cn("mt-3 flex flex-1 flex-col gap-1 pb-4", sidebarCollapsed ? "px-1" : "px-2")}>
            {navItems.map((item) => {
              const active = pathname === item.href;
              const short = item.label.slice(0, 1).toUpperCase();
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    sidebarCollapsed ? "px-0 text-center" : "px-3",
                    active && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                  aria-label={item.label}
                >
                  {sidebarCollapsed ? short : item.label}
                </Link>
              );
            })}
          </nav>

          <div className={cn("pb-4", sidebarCollapsed ? "px-1" : "px-2")}>
            <LogoutButton />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 h-14 border-b bg-background/80 backdrop-blur">
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium">Book World</div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={toggleTheme}>
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Link href="/profile" aria-label="Go to profile" className="rounded-full">
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.avatar ?? undefined} alt={displayName} />
                    <AvatarFallback>{fallback || "U"}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="text-sm text-muted-foreground">{displayName}</div>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl px-4 py-6">{children}</main>
        </div>
      </div>

      <PreferencesModal />
    </div>
  );
}
