import * as z from "zod";

export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof T]?: string[];
  };
  inputs?: T;
}

export const formSchema = z.object({
  title: z.string().min(1, "This field is required"),
  slug: z.string().min(1, "This field is required"),
  is_private: z.literal(true, { error: "This field is required" }),
  resume: z.file().mime("application/pdf").max(10485760),
});
