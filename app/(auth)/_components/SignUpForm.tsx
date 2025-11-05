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
import { authClient } from "@/lib/auth-client";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { OTPForm } from "./OTPForm";
import { Stage } from "@/types/authTypes";
import Link from "next/link";
import { GitHubAuth } from "./GitHubAuth";
import { GoogleAuth } from "./GoogleAuth";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z
  .object({
    first_name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters" }),
    last_name: z
      .string()
      .min(1, { message: "Name must be at least 1 character" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(50, { message: "Username must be at most 50 characters" })
      .regex(/^[a-zA-Z0-9_.]+$/, {
        message:
          "Username may only contain letters, numbers, underscores, and dots",
      }),
    email: z.email(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirm_password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"], // 👈 error will show up at confirm_password field
  });

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<Stage>({ stage: "sign-up", email: "" });
  const usernameCheckTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const lastMethod = authClient.getLastUsedLoginMethod();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "test",
      last_name: "user",
      username: "testuser",
      email: "test@test.com",
      password: "12345678",
      confirm_password: "12345678",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    const { email, password, first_name, last_name, username } = values;
    const { data, error } = await authClient.signUp.email(
      {
        email, // user email address
        password, // user password -> min 8 characters by default
        name: `${first_name} ${last_name}`,
        first_name,
        last_name,
        username,
        callbackURL: "/", // A URL to redirect to after the user verifies their email (optional)
      },
      {
        onRequest: (ctx) => {
          //show loading
          setIsLoading(true);
        },
        onSuccess: async (ctx) => {
          setStage({ stage: "email-verification", email: email });
          setIsLoading(false);
          await authClient.emailOtp.sendVerificationOtp({
            email: email,
            type: "sign-in",
          });
        },
        onError: (ctx) => {
          // display the error messagsendVerificationOtpe
          toast.error(ctx.error.message);
          setIsLoading(false);
        },
      },
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
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-muted-foreground text-sm text-balance">
              You need an account to get started
            </p>
          </div>

          <div className="grid gap-3">
            <div className="flex gap-3">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input
                        type={"text"}
                        value={field.value}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val);
                        }}
                        required
                        placeholder="Enter your First Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input
                        type={"text"}
                        value={field.value}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val);
                        }}
                        required
                        placeholder="Enter your Last Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Username *</FormLabel>
                  <FormControl>
                    <Input
                      type={"text"}
                      value={field.value}
                      required
                      placeholder="Enter your Username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Password *</FormLabel>
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
                name="confirm_password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Confirm Password *</FormLabel>
                    <FormControl>
                      <Password
                        {...field}
                        required
                        placeholder="Confirm Password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button disabled={isLoading} className="rounded-lg" size="sm">
              {isLoading ? <Spinner /> : "Sign Up"}
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
            Already have an account?{" "}
            <Link href="/sign-in" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
