import { describe, expect, it } from "vitest";
import { buildDashboardMetrics } from "./metrics";

describe("dashboard metrics", () => {
  it("fills missing dates and calculates signup and streak rates", () => {
    const result = buildDashboardMetrics(
      { from: "2026-09-29", to: "2026-10-01", days: 3 },
      {
        usersBeforeRange: 10,
        signups: [
          { date: "2026-09-29", count: 2 },
          { date: "2026-10-01", count: 3 },
        ],
        statistics: [
          {
            date: "2026-09-30",
            learnedUsers: 20,
            streak3Users: 8,
            streak7Users: 2,
            calculatedAt: "2026-10-01T00:05:00",
          },
        ],
      },
    );

    expect(result.daily.map((item) => item.signups)).toEqual([2, 0, 3]);
    expect(result.daily.map((item) => item.cumulativeUsers)).toEqual([12, 12, 15]);
    expect(result.daily[1]).toMatchObject({ hasStatistics: true, streak3Rate: 40, streak7Rate: 10 });
    expect(result.daily[2].signupGrowthRate).toBeNull();
    expect(result.summary).toMatchObject({
      totalUsers: 15,
      signupsInRange: 5,
      averageDailySignups: 1.7,
      latestLearnedUsers: 20,
      latestStreak7Rate: 10,
    });
  });
});
