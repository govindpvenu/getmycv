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
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  email: z.email(),
});

export default function ForgotPasswordForm({ email }: { email: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email } = values;
    const { data, error } = await authClient.requestPasswordReset(
      {
        email: email,

        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: async (ctx) => {
          console.log("SUCCESSCTX:", ctx);
          setIsLoading(false);
          toast.success("Reset password email sent!");
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
          className="flex flex-col  gap-6"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Forgot Password</h1>
            <p className="text-muted-foreground text-sm text-center">
              Enter your email to receive a reset link.
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

            <Button
              disabled={isLoading}
              className="rounded-lg relative"
              size="sm"
            >
              {isLoading ? <Spinner /> : "Send Reset Email"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
