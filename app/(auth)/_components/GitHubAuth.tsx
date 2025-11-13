import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { ErrorContext } from "better-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Icons } from "@/constants/icons";
import dynamic from "next/dynamic";
import { LastMethodBadgeSkeleton } from "./lastMethodBadge";
const LastMethodBadge = dynamic(() => import("./lastMethodBadge"), {
  ssr: false,
  loading: () => <LastMethodBadgeSkeleton />,
});

export function GitHubAuth() {
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
      <LastMethodBadge method="github" />
      {pendingGithub ? <Spinner /> : <Icons.github />}
      Continue with GitHub
    </Button>
  );
}
