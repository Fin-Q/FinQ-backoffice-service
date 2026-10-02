import { timingSafeEqual } from "node:crypto";
import { jwtVerify, SignJWT } from "jose";

const SESSION_LIFETIME_SECONDS = 12 * 60 * 60;
const JWT_ALGORITHM = "HS256";
const JWT_ISSUER = "finq-backoffice";
const JWT_AUDIENCE = "finq-backoffice-admin";

function getSigningKey(secret: string) {
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(username: string, secret: string, now = Date.now()) {
  if (secret.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters");

  const issuedAt = Math.floor(now / 1000);
  return new SignJWT({})
    .setProtectedHeader({ alg: JWT_ALGORITHM, typ: "JWT" })
    .setSubject(username)
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + SESSION_LIFETIME_SECONDS)
    .sign(getSigningKey(secret));
}

export async function verifySessionToken(token: string | undefined, secret: string, now = Date.now()) {
  if (!token || secret.length < 32) return false;

  try {
    const { payload } = await jwtVerify(token, getSigningKey(secret), {
      algorithms: [JWT_ALGORITHM],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      currentDate: new Date(now),
    });
    return Boolean(payload.sub);
  } catch {
    return false;
  }
}

export function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}
