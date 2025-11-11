import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db/drizzle";
import { container, containerEvent } from "@/db/schemas";
import { eq } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ containerId: string }> },
) {
  const { containerId } = await params;

  const [row] = await db
    .select({ url: container.resumeUrl })
    .from(container)
    .where(eq(container.id, containerId))
    .limit(1);

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const cookieStore = await cookies();
  const dlKey = `downloaded_${containerId}`;
  const alreadyDownloaded = cookieStore.get(dlKey)?.value === "1";

  if (!alreadyDownloaded) {
    await db.insert(containerEvent).values({
      containerId,
      eventType: "download",
    });

    cookieStore.set(dlKey, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  // Redirect to the actual Blob URL (303 to preserve GET semantics)
  return NextResponse.redirect(`${row.url}?download=1`, { status: 303 });
}
