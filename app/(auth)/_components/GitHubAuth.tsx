import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { ErrorContext } from "better-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Icons } from "@/constants/icons";

export function GitHubAuth({ lastMethod }: { lastMethod: string | null }) {
  const [pendingGithub, setPendingGithub] = useState(false);

  async function signInWithGithub() {
    await authClient.signIn.social(
      {
        provider: "github",
      },
      {
        onRequest: () => {
          setPendingGithub(true);
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
    setPendingGithub(false);
  }
  return (
    <Button
      onClick={signInWithGithub}
      disabled={pendingGithub}
      variant="outline"
      className="w-full relative"
    >
      {lastMethod === "github" && (
        <Badge className="absolute top-0 right-0 -mt-2 -mr-2 leading-none z-10">
          Last used
        </Badge>
      )}
      {pendingGithub ? <Spinner /> : <Icons.github />}
      Continue with GitHub
    </Button>
  );
}
