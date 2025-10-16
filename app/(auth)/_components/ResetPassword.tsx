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
import { Password } from "@/components/ui/password";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z
  .object({
    new_password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirm_password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"], // 👈 error will show up at confirm_password field
  });

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      new_password: "12345678",
      confirm_password: "12345678",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    console.log("token:", token);

    const { new_password } = values;

    const { data, error } = await authClient.resetPassword(
      {
        newPassword: new_password,
        token,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: async (ctx) => {
          console.log("SUCCESSCTX:", ctx);
          setIsLoading(false);
          toast.success("Password reset successfully!");
          router.push("/sign-in");
        },

        onError: async (ctx) => {
          console.log("ERROR:CTX:", ctx);
          setIsLoading(false);
          toast.error(ctx.error.message);
        },
      }
    );

    console.log("data:", data, "error:", error);
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Reset your password</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Enter your new password below.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>New Password *</FormLabel>
                    <FormControl>
                      <Password
                        {...field}
                        required
                        placeholder="New Password"
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
              {isLoading ? <Spinner /> : "Reset Password"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
