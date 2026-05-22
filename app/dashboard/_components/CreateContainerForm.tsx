"use client";
import { useRef } from "react";
import * as z from "zod";
import { containerSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
import { UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { DialogClose } from "@/components/ui/dialog";

type Schema = z.infer<typeof containerSchema>;

const SLUG_TAKEN_MESSAGE =
  "This slug already exists. Please choose a different slug.";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function checkSlugAvailability(slug: string) {
  const response = await fetch("/api/containers/slug", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ slug }),
  });

  const result = (await response.json().catch(() => null)) as {
    available?: boolean;
    message?: string;
    error?: string;
  } | null;

  if (response.status === 409 || result?.available === false) {
    return {
      available: false,
      message: result?.message ?? SLUG_TAKEN_MESSAGE,
    };
  }

  if (!response.ok) {
    return {
      available: false,
      message: result?.error ?? "Unable to verify slug",
    };
  }

  return { available: true, message: null };
}

export function CreateContainerForm() {
  const router = useRouter();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
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
      const slugAvailability = await checkSlugAvailability(data.slug);

      if (!slugAvailability.available) {
        form.setError("slug", {
          type: "server",
          message: slugAvailability.message ?? SLUG_TAKEN_MESSAGE,
        });
        toast.error(slugAvailability.message ?? SLUG_TAKEN_MESSAGE);
        return;
      }

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
      const createResponse = await fetch("/api/resume/upload", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          type: "getmycv.container-create",
          payload: {
            title: data.title,
            slug: data.slug,
            is_private: data.is_private,
            resumeUrl: newBlob.url,
          },
        }),
      });

      const createResult = (await createResponse.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!createResponse.ok) {
        throw new Error(createResult?.error ?? "Failed to create container");
      }

      form.reset();
      toast.success("Container created");
      closeButtonRef.current?.click();
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create container";

      console.error("Failed to create container:", error);
      toast.error(message);
    }
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col  w-full  gap-2 ">
      <DialogClose asChild>
        <button
          ref={closeButtonRef}
          type="button"
          className="sr-only"
          tabIndex={-1}
        >
          Close
        </button>
      </DialogClose>
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
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel htmlFor="resume">Upload Resume *</FieldLabel>
              <FieldDescription id="resume-help" className="mb-4">
                Drop or upload your resume (max 5 MB)
              </FieldDescription>
              <Input
                id="resume"
                name={field.name}
                type="file"
                accept="application/pdf"
                className="sr-only "
                aria-invalid={fieldState.invalid}
                aria-describedby="resume-help"
                onBlur={field.onBlur}
                ref={field.ref}
                onChange={(event) =>
                  field.onChange(event.target.files?.[0] ?? null)
                }
              />
              <label
                htmlFor="resume"
                className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-muted-foreground/40 bg-muted/20 px-4 py-6 text-center transition hover:border-primary hover:bg-background"
              >
                <UploadCloud className="h-8 w-8 text-muted-foreground transition group-hover:text-primary" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {field.value?.name ?? "Select your latest resume"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {field.value
                      ? "Click to replace the current file"
                      : "PDF only · drag & drop supported"}
                  </p>
                </div>
              </label>
              {field.value && (
                <p className="text-xs text-muted-foreground">
                  Selected file:{" "}
                  <span className="font-medium text-foreground">
                    {field.value.name}
                  </span>
                </p>
              )}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Spinner /> : "Create Container"}
        </Button>
      </FieldGroup>
    </form>
  );
}
