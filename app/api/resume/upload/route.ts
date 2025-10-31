import { db } from "@/db/drizzle";
import { container } from "@/db/schemas";
import { auth } from "@/lib/auth";
import { containerSchema } from "@/lib/schema";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const containerApiSchema = containerSchema.omit({ resume: true });

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      token: process.env.GETMYCV_BLOB_READ_WRITE_TOKEN,
      body,
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

        //⚠️ Check if slug is already in exist
        const slug = await db
          .select()
          .from(container)
          .where(eq(container.slug, payload.slug));
        console.log("slug:", slug);
        if (slug.length > 0) {
          throw new Error("Slug already exists");
        }

        return {
          allowedContentTypes: ["application/pdf"],
          addRandomSuffix: false,
          allowOverwrite: true,
          tokenPayload: JSON.stringify({
            // optional, sent to your server on upload completion
            // you could pass a user id from auth, or a value from clientPayload
            userId: session.user.id,
            ...payload,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Called by Vercel API on client upload completion
        // Use tools like ngrok if you want this to work locally

        console.log("blob upload completed", blob, tokenPayload);

        try {
          // Run any logic after the file upload completed

          if (!tokenPayload) {
            throw new Error("No token payload");
          }
          console.log("tokenPayload:", tokenPayload);
          const { userId, title, slug, is_private } = JSON.parse(tokenPayload);

          const data = await db.insert(container).values({
            id: crypto.randomUUID(),
            userId: userId,
            title: title,
            slug: slug,
            isPrivate: is_private,
            resumeUrl: blob.url,
          });

          console.log("data inserted:", data);
        } catch (error) {
          console.error("error:", error);
          throw new Error("Could not update user");
        }
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
