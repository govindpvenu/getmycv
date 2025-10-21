"use client";
import * as z from "zod";
import { containerSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
import { upload } from "@vercel/blob/client";

type Schema = z.infer<typeof containerSchema>;

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CreateContainerForm() {
  const form = useForm<Schema>({
    resolver: zodResolver(containerSchema),
    defaultValues: {
      title: "Full Stack Developer",
      slug: "full-stack-developer",
      is_private: true,
      resume: undefined,
    },
    mode: "onSubmit",
  });

  const handleSubmit = form.handleSubmit(async (data: Schema) => {
    console.log("handleSubmit data:", data);
    try {
      const newBlob = await upload(data.resume.name, data.resume, {
        access: "public",
        handleUploadUrl: "/api/resume/upload",
        clientPayload: JSON.stringify({
          title: data.title,
          slug: data.slug,
          is_private: data.is_private,
        }),
      });

      console.log("newBlob:", newBlob);
    } catch (error: any) {
      console.error("error:", error);
      console.log("error:", error?.message);
      toast.error("Failed to create container");
    } finally {
      form.reset();
    }
  });

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
          {form.formState.isSubmitting ? <Spinner /> : "Create Container"}
        </Button>
      </FieldGroup>
    </form>
  );
}
