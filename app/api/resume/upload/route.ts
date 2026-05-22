import { db } from "@/db/drizzle";
import { container } from "@/db/schemas/container-schema";
import { auth } from "@/lib/auth";
import { containerSchema } from "@/lib/schema";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import * as z from "zod";

const containerApiSchema = containerSchema.omit({ resume: true });
const createContainerBodySchema = z.object({
  type: z.literal("getmycv.container-create"),
  payload: containerApiSchema.extend({
    resumeUrl: z.url(),
  }),
});

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as unknown;

  try {
    const createContainerBody = createContainerBodySchema.safeParse(body);

    if (createContainerBody.success) {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { title, slug, is_private, resumeUrl } =
        createContainerBody.data.payload;

      const existingSlugForUser = await db
        .select({ id: container.id })
        .from(container)
        .where(
          and(eq(container.slug, slug), eq(container.userId, session.user.id)),
        );

      if (existingSlugForUser.length > 0) {
        return NextResponse.json(
          { error: "Slug already exists for this user" },
          { status: 409 },
        );
      }

      const [createdContainer] = await db
        .insert(container)
        .values({
          id: crypto.randomUUID(),
          userId: session.user.id,
          title,
          slug,
          isPrivate: is_private,
          resumeUrl,
        })
        .returning({ id: container.id });

      return NextResponse.json({
        success: true,
        containerId: createdContainer.id,
      });
    }

    const jsonResponse = await handleUpload({
      token: process.env.GETMYCV_BLOB_READ_WRITE_TOKEN,
      body: body as HandleUploadBody,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Generate a client token for the browser to upload the file

        // ⚠️ Authenticate and authorize users before generating the token.
        // Otherwise, you're allowing anonymous uploads
        if (!clientPayload) {
          throw new Error("No client payload");
        }
        const session = await auth.api.getSession({
          headers: await headers(),
        });
        if (!session) {
          throw new Error("Unauthorized");
        }
        console.log("user is authenticated:", session.user.id);

        // ⚠️ When using the clientPayload feature, make sure to validate it
        // otherwise this could introduce security issues for your app
        // like allowing users to modify other users' posts
        const payload = JSON.parse(clientPayload);
        console.log("payload:", payload);
        const data = containerApiSchema.safeParse(payload);
        console.log("data:", data);
        if (!data.success) {
          throw new Error("Invalid payload");
        }

        // ⚠️ Check if slug already exists for this user
        const existingSlugForUser = await db
          .select()
          .from(container)
          .where(
            and(
              eq(container.slug, payload.slug),
              eq(container.userId, session.user.id),
            ),
          );

        console.log("existingSlugForUser:", existingSlugForUser);
        if (existingSlugForUser.length > 0) {
          throw new Error("Slug already exists for this user");
        }

        return {
          allowedContentTypes: ["application/pdf"],
          maximumSizeInBytes: 10485760,
          addRandomSuffix: false,
          allowOverwrite: true,
          tokenPayload: clientPayload,
        };
      },
    });

    console.log("jsonResponse:", jsonResponse);
    return NextResponse.json(jsonResponse);
  } catch (error: unknown) {
    console.error("error:", error);
    console.log(
      "error:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }, // The webhook will retry 5 times waiting for a 200
    );
  }
}
