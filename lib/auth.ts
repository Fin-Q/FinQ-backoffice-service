import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/lib/auth-token";

export const SESSION_COOKIE_NAME = "finq_backoffice_session";

function getSessionSecret() {
  return process.env.SESSION_SECRET ?? "";
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value, getSessionSecret());
}

export async function requireAdmin() {
  if (!(await isAuthenticated())) redirect("/login");
}
