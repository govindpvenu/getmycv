"use client";
import { Button } from "@/components/ui/button";
import { AtSign, SendHorizonal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CallToAction() {
  const [email, setEmail] = useState("");
  return (
    <section className="py-8 md:py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-semibold lg:text-4xl">
            Sign up for free
          </h2>
          <p className="mt-4 max-w-md mx-auto">
            Create your account and start managing your CVs today.
          </p>

          <form action="" className="mx-auto mt-10 max-w-sm lg:mt-12">
            <div className="bg-background has-[input:focus]:ring-muted relative grid grid-cols-[1fr_auto] items-center rounded-[calc(var(--radius)+0.75rem)] border pr-3 shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
              <AtSign className="text-caption pointer-events-none absolute inset-y-0 left-5 my-auto size-5" />

              <input
                placeholder="Your mail address"
                className="h-14 w-full bg-transparent pl-12 focus:outline-none"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="md:pr-1.5 lg:pr-0">
                <Link href={`/sign-up?email=${email}`}>
                  <Button aria-label="submit" className="rounded-(--radius)">
                    <span className="hidden md:block">Sign up</span>
                    <SendHorizonal
                      className="relative mx-auto size-5 md:hidden"
                      strokeWidth={2}
                    />
                  </Button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
