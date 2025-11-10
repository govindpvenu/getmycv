import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const authRoutes = new Set([
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/",
]);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isAuthRoute = authRoutes.has(pathname);
  const session = await auth.api.getSession({ headers: await headers() });

  if (isAuthRoute) {
    if (session)
      return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.next();
  }

  //NOTE: only the dashboard routes are protected
  if (!session && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
