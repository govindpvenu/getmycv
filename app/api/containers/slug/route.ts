import { db } from "@/db/drizzle";
import { container } from "@/db/schemas/container-schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import * as z from "zod";

const slugCheckSchema = z.object({
  slug: z.string().min(1),
});

const SLUG_TAKEN_MESSAGE =
  "This slug already exists. Please choose a different slug.";

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const payload = slugCheckSchema.safeParse(body);

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const existingContainer = await db
    .select({ id: container.id })
    .from(container)
    .where(
      and(
        eq(container.slug, payload.data.slug),
        eq(container.userId, session.user.id),
      ),
    )
    .limit(1);

  if (existingContainer.length > 0) {
    return NextResponse.json(
      { available: false, message: SLUG_TAKEN_MESSAGE },
      { status: 409 },
    );
  }

  return NextResponse.json({ available: true });
}
