import { describe, expect, it } from "vitest";
import { createSessionToken, safeEqual, verifySessionToken } from "./auth-token";

const secret = "a-secure-session-secret-with-32-chars";

describe("admin session token", () => {
  it("creates a standard JWT and accepts it before expiration", async () => {
    const token = await createSessionToken("admin", secret, 1_000);
    expect(token.split(".")).toHaveLength(3);
    await expect(verifySessionToken(token, secret, 2_000)).resolves.toBe(true);
  });

  it("rejects expired, tampered, and incorrectly signed tokens", async () => {
    const token = await createSessionToken("admin", secret, 1_000);
    await expect(verifySessionToken(token, secret, 12 * 60 * 60 * 1000 + 1_001)).resolves.toBe(false);
    await expect(verifySessionToken(`${token}x`, secret, 2_000)).resolves.toBe(false);
    await expect(verifySessionToken(token, "another-secure-session-secret-32-chars", 2_000)).resolves.toBe(false);
  });

  it("compares credentials without leaking prefix matches", () => {
    expect(safeEqual("admin", "admin")).toBe(true);
    expect(safeEqual("admin", "admin2")).toBe(false);
  });
});
