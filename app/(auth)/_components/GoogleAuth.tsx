import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Icons } from "@/constants/icons";
import { authClient } from "@/lib/auth-client";
import { ErrorContext } from "better-auth/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "sonner";
import { LastMethodBadgeSkeleton } from "./lastMethodBadge";
const LastMethodBadge = dynamic(() => import("./lastMethodBadge"), {
  ssr: false,
  loading: () => <LastMethodBadgeSkeleton />,
});

export function GoogleAuth() {
  const [pendingGoogle, setPendingGoogle] = useState(false);

  async function signInWithGoogle() {
    await authClient.signIn.social(
      {
        provider: "google",
      },
      {
        onRequest: () => {
          setPendingGoogle(true);
        },
        onSuccess: async (ctx) => {
          console.log("ctx:", ctx);
        },
        onError: (ctx: ErrorContext) => {
          console.log("ctx:", ctx);
          toast.error(ctx.error.message ?? "Something went wrong.");
        },
      }
    );
    setPendingGoogle(false);
  }
  return (
    <Button
      onClick={signInWithGoogle}
      disabled={pendingGoogle}
      variant="outline"
      className="w-full relative"
    >
      <LastMethodBadge method="google" />
      {pendingGoogle ? <Spinner /> : <Icons.google />}
      Continue with Google
    </Button>
  );
}
