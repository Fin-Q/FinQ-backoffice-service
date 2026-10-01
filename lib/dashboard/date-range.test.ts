import { describe, expect, it } from "vitest";
import { enumerateDates, parseDateRange } from "./date-range";

describe("dashboard date range", () => {
  it("defaults to the latest 30 days", () => {
    expect(parseDateRange({}, "2026-10-01")).toEqual({
      from: "2026-09-02",
      to: "2026-10-01",
      days: 30,
    });
  });

  it("rejects invalid, future, reversed, and oversized ranges", () => {
    expect(() => parseDateRange({ from: "2026-09-31", to: "2026-10-01" }, "2026-10-01")).toThrow();
    expect(() => parseDateRange({ from: "2026-10-01", to: "2026-09-01" }, "2026-10-01")).toThrow();
    expect(() => parseDateRange({ from: "2026-10-01", to: "2026-10-02" }, "2026-10-01")).toThrow();
    expect(() => parseDateRange({ from: "2025-01-01", to: "2026-10-01" }, "2026-10-01")).toThrow();
  });

  it("enumerates every calendar date inclusively", () => {
    expect(enumerateDates("2026-09-29", "2026-10-01")).toEqual([
      "2026-09-29",
      "2026-09-30",
      "2026-10-01",
    ]);
  });
});
