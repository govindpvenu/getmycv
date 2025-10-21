"use server";

import { actionClient } from "@/actions/safe-action";
import { containerSchema } from "@/lib/schema";

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
