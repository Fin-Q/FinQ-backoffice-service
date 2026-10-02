import { NextResponse, type NextRequest } from "next/server";
import { createSessionToken, safeEqual } from "@/lib/auth-token";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const expectedUsername = process.env.ADMIN_USERNAME ?? "";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
  const sessionSecret = process.env.SESSION_SECRET ?? "";

  if (
    !expectedUsername ||
    !expectedPassword ||
    sessionSecret.length < 32 ||
    !safeEqual(username, expectedUsername) ||
    !safeEqual(password, expectedPassword)
  ) {
    return NextResponse.redirect(new URL("/login?error=invalid", request.url), 303);
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url), 303);
  response.cookies.set(SESSION_COOKIE_NAME, await createSessionToken(username, sessionSecret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 12 * 60 * 60,
  });
  return response;
}
