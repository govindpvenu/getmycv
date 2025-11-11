import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { db } from "@/db/drizzle";
import { containerEvent } from "@/db/schemas";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ containerId: string }> },
) {
  const { containerId } = await params;

  const cookieStore = await cookies();
  const viewKey = `viewed_${containerId}`;
  const alreadyViewed = cookieStore.get(viewKey)?.value === "1";

  if (alreadyViewed) {
    return NextResponse.json({ ok: true, alreadyViewed: true });
  }

  await db.insert(containerEvent).values({
    containerId,
    eventType: "view",
  });

  const response = NextResponse.json({ ok: true, alreadyViewed: false });

  response.cookies.set(viewKey, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ONE_YEAR_IN_SECONDS,
    path: "/",
  });

  return response;
}
