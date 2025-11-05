"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Session, authClient } from "@/lib/auth-client";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  userName: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50, { message: "Username must be at most 50 characters" })
    .regex(/^[a-zA-Z0-9_.]+$/, {
      message:
        "Username may only contain letters, numbers, underscores, and dots",
    }),
});

export default function ProfileDetails({ user }: { user: Session["user"] }) {
  const [isLoading, setIsLoading] = useState(false);
  const usernameCheckTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  console.log("user:", user);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user.first_name,
      lastName: user.last_name,
      userName: user.username || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { firstName, lastName, userName } = values;

    const { data, error } = await authClient.updateUser(
      {
        name: `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
        username: userName,
        image: user.image,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsLoading(false);
          toast.success("Profile updated successfully");
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error(ctx.error.message || "Failed to update profile");
        },
      },
    );

    console.log("data:", data, "error:", error);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>First name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your first name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Last name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your last name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="userName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your username"
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val);
                      // clear any pending checks
                      if (usernameCheckTimeout.current) {
                        clearTimeout(usernameCheckTimeout.current);
                      }
                      // clear previous availability message while typing
                      form.clearErrors("userName");
                      // only check when input has minimal length
                      if (val === user.username || val === "") return;
                      if (!val || val.length < 3) return;
                      usernameCheckTimeout.current = setTimeout(async () => {
                        // ensure we check the latest value
                        const current = form.getValues("userName");
                        if (current !== val) return;
                        const { data: response } =
                          await authClient.isUsernameAvailable({
                            username: current,
                          });
                        if (!response?.available) {
                          form.setError("userName", {
                            type: "manual",
                            message: "Username is not available",
                          });
                        }
                      }, 300);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="space-y-2">
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                readOnly
                id="email"
                type="email"
                defaultValue={user.email}
                className="bg-muted"
              />
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <Button className="w-16" type="submit" disabled={isLoading}>
              {isLoading ? <Spinner /> : "Save "}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
