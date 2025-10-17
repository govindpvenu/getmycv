"use client";

import { Loader } from "lucide-react";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ConfirmLogOut() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  return (
    <Button
      className="w-16"
      variant="destructive"
      disabled={isLoading}
      onClick={async () => {
        // Optional: set your own loading UI via state if you want
        setIsLoading(true);
        await authClient.signOut();
        // Ensure the cookie is gone before navigating to an auth route guarded by middleware
        router.replace("/sign-in");
        router.refresh();
        setIsLoading(false);
      }}
    >
      {isLoading ? <Loader className="animate-spin" /> : "Yes"}
    </Button>
  );
}
