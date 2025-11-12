"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scrollspy } from "@/components/re-ui/scrollspy";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import Loading from "../loading";

export default function SettingsPage() {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const nav = [
    {
      id: "section-1",
      label: "Section 1",
    },
    {
      id: "section-2",
      label: "Section 2",
    },
    {
      id: "section-3",
      label: "Section 3",
    },
    {
      id: "section-4",
      label: "Section 4",
    },
    {
      id: "section-5",
      label: "Section 5",
    },
  ];

  const {
    data: session,
    isPending, //loading state
    error, //error object
  } = authClient.useSession();
  console.log("session:", session);
  if (isPending) {
    return <Loading />;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!session?.user) {
    redirect("/sign-in");
  }
  return (
    <div className="flex grow gap-5 rounded-tl-2xl border border-neutral-200 bg-white px-2 md:px-10 dark:border-neutral-700 dark:bg-neutral-900">
      <div className="grow">
        <ScrollArea
          className="min-h-full h-full  grow pe-5 -me-5"
          viewportRef={parentRef}
        >
          <div className="space-y-8">
            {nav.map((item) => (
              <div key={item.id} id={item.id} className="space-y-2.5">
                <h3 className="text-foreground text-base">{item.label}</h3>
                <div className="bg-muted rounded-lg h-[350px]"></div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="flex flex-col gap-2 w-[150px]  ml-2 md:ml-2.5">
        <Scrollspy
          offset={50}
          targetRef={parentRef}
          className="flex flex-col gap-2.5 "
        >
          {nav.map((item) => (
            <Button
              key={item.id}
              variant="outline"
              data-scrollspy-anchor={item.id}
              className={
                "data-[active=true]:bg-accent data-[active=true]:text-primary"
              }
            >
              {item.label}
            </Button>
          ))}
        </Scrollspy>
      </div>
    </div>
  );
}
