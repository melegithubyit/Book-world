"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useGoogleAuthMutation, useLoginMutation } from "@/hooks/mutations/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLoginMutation({
    onSuccess: () => {
      toast.success("Logged in successfully");
      router.push("/dashboard");
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Check your credentials and try again.";
      toast.error(message);
    },
  });

  const googleAuthMutation = useGoogleAuthMutation({
    onSuccess: () => {
      toast.success("Logged in with Google successfully");
      router.push("/dashboard");
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login with Google failed. Please try again.";
      toast.error(message);
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  // const handleGoogleSignin = useGoogleLogin({
  //   onSuccess: async (tokenResponse) => {
  //      try {
  //       const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
  //         headers: {
  //           'Authorization': `Bearer ${tokenResponse.access_token}`,
  //         },
  //       });
  //       const userInfo = await userInfoResponse.json();
  //       googleAuthMutation.mutate({ idToken: tokenResponse.access_token });
  //     } catch (error) {
  //       console.error("Error fetching user info from Google:", error);
  //       toast.error("Failed to fetch user info from Google.");
  //      }
  //   },
  //   onError: (error) => {
  //     console.log("Google login error:", error);
  //     toast.error("Google Sign-In was unsuccessful. Please try again.");
  //   },
  // })

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your Book World account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* <Button
          variant="outline"
          className="w-full"
          onClick={() => handleGoogleSignin()}
        >
          {googleAuthMutation.isPending ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in with Google...
            </span>
          ) : (
            <>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
            </>
          )}
        </Button> */}

        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              googleAuthMutation.mutate({
                idToken: credentialResponse.credential,
              });
            }
          }}
          onError={() => {
            toast.error('Google login failed');
          }}
          ux_mode="popup"
          use_fedcm_for_prompt={false}
          use_fedcm_for_button={false}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
        />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don&apos;t have an account? </span>
          <Link
            href="/signup"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}