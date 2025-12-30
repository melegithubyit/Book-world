"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLogoutMutation } from "@/hooks/mutations/useAuth";
import { useAuthStore } from "@/store/auth.store";
import { Loader2 } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const clearAuth = useAuthStore((s) => s.logout);

  const mutation = useLogoutMutation({
    onSuccess: () => {
      clearAuth();
      router.push("/login");
    },
    onError: () => {
      clearAuth();
      router.push("/login");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start cursor-pointer">
          Logout
        </Button>
      </DialogTrigger>
      <DialogOverlay className="backdrop-blur-sm" />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={mutation.isPending}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="cursor-pointer"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging out...
              </>
            ) : (
              "Logout"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
