"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Stage } from "@/types/authTypes";
import { Spinner } from "@/components/ui/spinner";

const FormSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export function OTPForm({ stage }: { stage: Stage }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });

  // if (stage.stage === "email-verification") {
  // }

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log("otp submited:", values);

    const { data, error } = await authClient.signIn.emailOtp(
      {
        email: stage.email,
        otp: values.otp,
      },
      {
        onRequest: (ctx) => {
          //show loading
          setLoading(true);
        },
        onSuccess: async (ctx) => {
          router.push("/");
        },
        onError: (ctx) => {
          setLoading(false);
          toast.error(ctx.error.message);
        },
      },
    );
  }

  async function resendOtp() {
    await authClient.emailOtp.sendVerificationOtp(
      {
        email: stage.email,
        type: "sign-in",
      },
      {
        onRequest: (ctx) => {
          //show loading
          setLoading(true);
        },
        onSuccess: async (ctx) => {
          setLoading(false);
          toast.success("Verification code resent!");
        },
        onError: (ctx) => {
          setLoading(false);
          toast.error("Failed to resend code. Please try again.");
        },
      },
    );
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Verify your email</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Check {stage.email} for the verification code
            </p>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <div className="flex flex-col items-center gap-4 justify-center">
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription className="text-center">
                        Please enter the 6-digit code.
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="rounded-lg"
              size="sm"
            >
              {loading ? <Spinner /> : "Verify Email"}
            </Button>

            <div className="text-center text-sm">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                className="underline underline-offset-4 hover:text-primary"
                onClick={resendOtp}
              >
                Resend code
              </button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
