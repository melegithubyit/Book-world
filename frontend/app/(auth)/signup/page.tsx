"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useGoogleAuthMutation, useSignupMutation } from "@/hooks/mutations/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { GoogleLogin } from '@react-oauth/google';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signupMutation = useSignupMutation({
    onSuccess: () => {
      toast.success("Account created successfully");
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
        "Signup failed. Please try again.";
      toast.error(message);
    },
  });

  const googleAuthMutation = useGoogleAuthMutation({
    onSuccess: () => {
      toast.success("Signed up with Google successfully");
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
        "Signup with Google failed. Please try again.";
      toast.error(message);
    }
  })

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate({ fullName, email, password });
  };

  const handleGoogleSignup = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      googleAuthMutation.mutate({
        idToken: credentialResponse.credential,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-muted-foreground mt-2">
            Join Book World and start your reading journey
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </span>
            ) : (
              "Create Account"
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

        <GoogleLogin
          onSuccess={handleGoogleSignup}
          onError={() => {
            toast.error('Google signup failed');
          }}
          ux_mode="popup"
          use_fedcm_for_prompt={false}
          use_fedcm_for_button={false}
          theme="outline"
          size="large"
          text="signup_with"
          shape="rectangular"
        />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}