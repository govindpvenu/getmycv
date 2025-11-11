"use server";

import { actionClient } from "@/actions/safe-action";
import { db } from "@/db/drizzle";
import { container } from "@/db/schemas";
import { containerSchema } from "@/lib/schema";
import { eq } from "drizzle-orm";
import z from "zod";
import { del } from "@vercel/blob";

export const createContainerAction = actionClient
  .inputSchema(containerSchema)
  .action(async ({ parsedInput }) => {
    // do something with the data
    console.log("parsedInput From createContainerAction:", parsedInput);
    return {
      success: true,
      message: "Form submitted successfully",
    };
  });

const inputSchema = z.object({
  containerId: z.string().min(1),
});

export const deleteContainerAction = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { containerId } }) => {
    const deletedRows = await db
      .delete(container)
      .where(eq(container.id, containerId))
      .returning({ resumeUrl: container.resumeUrl });
    console.log("deletedRows:", deletedRows);

    await del(deletedRows[0].resumeUrl, {
      token: process.env.GETMYCV_BLOB_READ_WRITE_TOKEN,
    });
    return {
      success: true,
      message: `Container deleted successfully`,
    };
  });
