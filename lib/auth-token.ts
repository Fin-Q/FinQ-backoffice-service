import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_LIFETIME_MS = 12 * 60 * 60 * 1000;

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createSessionToken(username: string, secret: string, now = Date.now()) {
  const payload = Buffer.from(
    JSON.stringify({ username, expiresAt: now + SESSION_LIFETIME_MS }),
  ).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionToken(token: string | undefined, secret: string, now = Date.now()) {
  if (!token || secret.length < 32) return false;

  const [payload, providedSignature] = token.split(".");
  if (!payload || !providedSignature) return false;

  const expectedSignature = sign(payload, secret);
  const expected = Buffer.from(expectedSignature);
  const provided = Buffer.from(providedSignature);
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return false;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      username?: string;
      expiresAt?: number;
    };
    return Boolean(parsed.username && parsed.expiresAt && parsed.expiresAt > now);
  } catch {
    return false;
  }
}

export function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}
