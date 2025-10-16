"use client";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Password } from "@/components/ui/password";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {} from "lucide-react";
import { Stage } from "@/types/authTypes";
import { OTPForm } from "./OTPForm";
import Link from "next/link";
import { GitHubAuth } from "./GitHubAuth";
import { GoogleAuth } from "./GoogleAuth";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  remember_me: z.boolean().optional(),
});

export function SignInForm() {
  const [stage, setStage] = useState<Stage>({ stage: "sign-in", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lastMethod, setLastMethod] = useState<string | null>(null);
  useEffect(() => {
    // runs only on client, after hydration
    try {
      setLastMethod(authClient.getLastUsedLoginMethod());
    } catch {}
    setMounted(true);
  }, []);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "test@test.com",
      password: "12345678",
      remember_me: true,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    const { email, password, remember_me } = values;

    const { data, error } = await authClient.signIn.email(
      {
        email, // user email address
        password, // user password -> min 8 characters by default
        callbackURL: "/", // A URL to redirect to after the user verifies their email (optional)
        rememberMe: remember_me || false, //Remember me
      },
      {
        onRequest: (ctx) => {
          //show loading
          setIsLoading(true);
        },
        onSuccess: async (ctx) => {
          //redirect to the dashboard or sign in page
        },

        onError: async (ctx) => {
          setIsLoading(false);
          console.log("CTX:", ctx);
          if (ctx.error.code === "EMAIL_NOT_VERIFIED") {
            console.log("EMAIL_NOT_VERIFIED");
            await authClient.emailOtp.sendVerificationOtp({
              email: email,
              type: "sign-in",
            });
            setStage({ stage: "email-verification", email: email });
          } else {
            toast.error(ctx.error.message);
          }
        },
      }
    );

    console.log("data:", data, "error:", error);
  }

  if (stage.stage === "email-verification") {
    return <OTPForm stage={stage} />;
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Enter your email to sign-in to your account
            </p>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type={"email"}
                        value={field.value}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val);
                        }}
                        required
                        placeholder="Enter your Email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <div className="flex items-center">
                      <FormLabel>Password *</FormLabel>
                      <Link
                        href={`/forgot-password?email=${form.watch("email")}`}
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <Password {...field} required placeholder="Password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="remember_me"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center ">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <Button
              disabled={isLoading}
              className="rounded-lg relative"
              size="sm"
            >
              {mounted && lastMethod === "email" && (
                <Badge
                  variant="secondary"
                  className="absolute top-0 right-0 -mt-2 -mr-2 leading-none z-10"
                >
                  Last used
                </Badge>
              )}
              {isLoading ? <Spinner /> : "Sign In"}
            </Button>

            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-background text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>

            <GitHubAuth lastMethod={lastMethod} />

            <GoogleAuth lastMethod={lastMethod} />
          </div>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
