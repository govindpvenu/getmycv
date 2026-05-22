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

export function CreateContainerForm({ username }: { username: string }) {
  const router = useRouter();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://rxresu.me";
  const linkPrefix = `${baseUrl.replace(/\/$/, "")}/${username}/`;
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
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
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

      <FieldGroup className="gap-3">
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel htmlFor="title">Title</FieldLabel>
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
              <FieldLabel htmlFor="slug">Link slug</FieldLabel>
              <div
                className="flex min-h-10 items-center rounded-md border border-input bg-background px-3 text-sm shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50"
                aria-invalid={fieldState.invalid}
              >
                <span className="shrink-0 text-muted-foreground">
                  {linkPrefix}
                </span>
                <Input
                  {...field}
                  id="slug"
                  type="text"
                  className="h-auto min-w-0 flex-1 border-0 bg-transparent px-0 py-0 shadow-none focus-visible:ring-0"
                  aria-invalid={fieldState.invalid}
                  placeholder="full-stack-developer"
                />
              </div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="is_private"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              orientation="horizontal"
              data-invalid={fieldState.invalid}
              className="rounded-lg border bg-muted/20 p-3"
            >
              <FieldContent>
                <FieldLabel htmlFor="is_private">Private</FieldLabel>
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
              <FieldLabel htmlFor="resume">Resume PDF</FieldLabel>
              <Input
                id="resume"
                name={field.name}
                type="file"
                accept="application/pdf"
                className="sr-only "
                aria-invalid={fieldState.invalid}
                onBlur={field.onBlur}
                ref={field.ref}
                onChange={(event) =>
                  field.onChange(event.target.files?.[0] ?? null)
                }
              />
              <label
                htmlFor="resume"
                className="group flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-muted-foreground/40 bg-muted/20 px-4 py-4 text-center transition hover:border-primary hover:bg-background"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-background text-muted-foreground shadow-xs transition group-hover:text-primary">
                  <UploadCloud className="size-5" />
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {field.value?.name ?? "Choose PDF"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {field.value ? "Click to replace" : "Max 10 MB"}
                  </p>
                </div>
              </label>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          type="submit"
          size="sm"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Spinner />
              Creating container
            </>
          ) : (
            "Create container"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
