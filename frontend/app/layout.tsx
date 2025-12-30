import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/themeProvider";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from '@react-oauth/google';

export const metadata: Metadata = {
  title: "Book World",
  description: "Discover, Read, and Share Your Favorite Books",
  icons: {
    icon: "/Books2.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    throw new Error("Google Client ID is not configured");
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        { googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <ThemeProvider>
              <QueryProvider>
                  {children}
                <Toaster richColors position="top-right" />
              </QueryProvider>
            </ThemeProvider>
          </GoogleOAuthProvider>
        ) : (
          <ThemeProvider>
            <QueryProvider>
                {children}
              <Toaster richColors position="top-right" />
            </QueryProvider>
          </ThemeProvider>
        ) }
      </body>
    </html>
  );
}