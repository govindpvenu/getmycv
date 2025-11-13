import Link from "next/link";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { Lock, ShieldAlert, UserPlus } from "lucide-react";

export function PrivateResumeNotice() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-12 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl dark:bg-primary/25" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-linear-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-y-0 left-8 h-full w-px bg-linear-to-b from-transparent via-border/30 to-transparent" />
        <div className="absolute inset-y-0 right-8 h-full w-px bg-linear-to-b from-transparent via-border/20 to-transparent" />
      </div>

      <AnimatedGroup
        preset="blur"
        className="border-border/60 bg-card/85 backdrop-blur-2xl relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-8 rounded-3xl border px-8 py-14 text-center shadow-xl shadow-black/5"
      >
        <div
          key="badge"
          className="bg-primary/90 text-primary-foreground inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em]"
        >
          <Lock className="size-4" />
          Private
        </div>

        <TextEffect
          key="title"
          preset="fade-in-blur"
          as="h1"
          className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          You are not authorized to access this resource
        </TextEffect>

        <TextEffect
          key="description"
          per="line"
          preset="fade-in-blur"
          delay={0.2}
          as="p"
          className="text-pretty text-sm text-muted-foreground sm:text-base"
        >
          {`This resume is protected by its owner.\nAsk for access or sign in with the correct account to view the document.`}
        </TextEffect>

        <div
          key="tips"
          className="grid w-full gap-3 text-left sm:grid-cols-2 sm:gap-4"
        >
          <div className="border-border/60 bg-muted/50 flex items-start gap-3 rounded-2xl border p-4">
            <ShieldAlert className="size-5 text-primary" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Request permission
              </p>
              <p className="text-xs text-muted-foreground">
                Reach out to the owner and ask them to share an accessible link
                or update your permissions.
              </p>
            </div>
          </div>
          <div className="border-border/60 bg-muted/50 flex items-start gap-3 rounded-2xl border p-4">
            <UserPlus className="size-5 text-primary" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Sign in to continue
              </p>
              <p className="text-xs text-muted-foreground">
                Try logging in with the account that was granted access to this
                resume.
              </p>
            </div>
          </div>
        </div>

        <div key="actions" className="flex flex-col gap-2 sm:flex-row">
          <Button asChild size="lg" className="rounded-xl px-6">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-xl px-6"
          >
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </AnimatedGroup>
    </main>
  );
}
