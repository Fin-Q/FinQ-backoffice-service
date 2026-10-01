import { describe, expect, it } from "vitest";
import { createSessionToken, safeEqual, verifySessionToken } from "./auth-token";

const secret = "a-secure-session-secret-with-32-chars";

describe("admin session token", () => {
  it("accepts a valid token before expiration", () => {
    const token = createSessionToken("admin", secret, 1_000);
    expect(verifySessionToken(token, secret, 2_000)).toBe(true);
  });

  it("rejects expired and tampered tokens", () => {
    const token = createSessionToken("admin", secret, 1_000);
    expect(verifySessionToken(token, secret, 12 * 60 * 60 * 1000 + 1_001)).toBe(false);
    expect(verifySessionToken(`${token}x`, secret, 2_000)).toBe(false);
  });

  it("compares credentials without leaking prefix matches", () => {
    expect(safeEqual("admin", "admin")).toBe(true);
    expect(safeEqual("admin", "admin2")).toBe(false);
  });
});
