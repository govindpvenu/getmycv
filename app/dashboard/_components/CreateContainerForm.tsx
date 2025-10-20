"use client";
import * as z from "zod";
import { formSchema } from "@/lib/schema";
import { createContainerAction } from "@/actions/create-container";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import {
  Field,
  FieldGroup,
  FieldContent,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

type Schema = z.infer<typeof formSchema>;

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CreateContainerForm() {
  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      is_private: true,
      resume: undefined,
    },
    mode: "onSubmit",
  });
  const formAction = useAction(createContainerAction, {
    onSuccess: () => {
      // TODO: show success message
      form.reset();
      toast.success("Container created successfully");
    },
    onError: (error) => {
      // TODO: show error message
      toast.error(error.error.serverError || "Something went wrong");
    },
  });

  const handleSubmit = form.handleSubmit(async (data: Schema) => {
    console.log("handleSubmit data:", data);
    formAction.execute(data);
  });

  const { isExecuting, hasSucceeded } = formAction;
  if (hasSucceeded) {
    return (
      <div className="p-2 sm:p-5 md:p-8 w-full rounded-md gap-2 border">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, stiffness: 300, damping: 25 }}
          className="h-full py-6 px-3"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 500,
              damping: 15,
            }}
            className="mb-4 flex justify-center border rounded-full w-fit mx-auto p-2"
          >
            <Check className="size-8" />
          </motion.div>
          <h2 className="text-center text-2xl text-pretty font-bold mb-2">
            Thank you
          </h2>
          <p className="text-center text-lg text-pretty text-muted-foreground">
            Form submitted successfully, we will get back to you soon
          </p>
        </motion.div>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col  w-full  gap-2 ">
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel htmlFor="title">Title *</FieldLabel>
              <Input
                {...field}
                id="title"
                type="text"
                onChange={(e) => {
                  field.onChange(e);
                  const nextSlug = slugify(e.target.value);
                  form.setValue("slug", nextSlug, {
                    shouldValidate: form.formState.isSubmitted,
                    shouldDirty: true,
                  });
                }}
                aria-invalid={fieldState.invalid}
                placeholder="Full Stack Developer"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel htmlFor="slug">Slug *</FieldLabel>
              <Input
                {...field}
                id="slug"
                type="text"
                aria-invalid={fieldState.invalid}
                placeholder="full-stack-developer"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="is_private"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="is_private">Private *</FieldLabel>
                <FieldDescription>
                  Anyone with the link can view your resume.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Switch
                id="is_private"
                name={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={fieldState.invalid}
              />
            </Field>
          )}
        />

        <Controller
          name="resume"
          control={form.control}
          render={({ field, fieldState }) => (
            <div>
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor="resume">Upload Resume *</FieldLabel>
                <FieldDescription>
                  Select a file to upload from your device
                </FieldDescription>
                <Input
                  name="resume"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            </div>
          )}
        />

        <Button type="submit" size="sm">
          {isExecuting ? <Spinner /> : "Create Container"}
        </Button>
      </FieldGroup>
    </form>
  );
}
