import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Icons } from "@/constants/icons";
import { authClient } from "@/lib/auth-client";
import { ErrorContext } from "better-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function GoogleAuth({ lastMethod }: { lastMethod: string | null }) {
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
      },
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
      {lastMethod === "google" && (
        <Badge className="absolute top-0 right-0 -mt-2 -mr-2 leading-none z-10">
          Last used
        </Badge>
      )}
      {pendingGoogle ? <Spinner /> : <Icons.google />}
      Continue with Google
    </Button>
  );
}
