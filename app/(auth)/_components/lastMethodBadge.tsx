"use client";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

export default function LastMethodBadge({ method }: { method: string }) {
  return authClient.isLastUsedLoginMethod(method) ? (
    <Badge
      variant="secondary"
      className="absolute top-0 right-0 -mt-2 -mr-2 leading-none z-10"
    >
      Last used
    </Badge>
  ) : null;
}

export function LastMethodBadgeSkeleton() {
  return (
    <Badge
      variant="secondary"
      className="absolute top-0 right-0 -mt-2 -mr-2 leading-none z-10"
    >
      <Spinner className="size-2 " />
    </Badge>
  );
}
