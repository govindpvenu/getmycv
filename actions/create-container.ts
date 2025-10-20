"use server";

import { actionClient } from "@/actions/safe-action";
import { formSchema } from "@/lib/schema";

export const createContainerAction = actionClient
  .inputSchema(formSchema)
  .action(async ({ parsedInput }) => {
    // do something with the data
    console.log("parsedInput From createContainerAction:", parsedInput);
    return {
      success: true,
      message: "Form submitted successfully",
    };
  });
