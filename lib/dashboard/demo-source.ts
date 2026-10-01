import { addDays, enumerateDates } from "./date-range";
import type { DashboardSource, DateRange } from "./types";

export function createDemoSource(range: DateRange): DashboardSource {
  const dates = enumerateDates(range.from, range.to);
  const statisticsDates = dates.slice(0, -1);

  return {
    usersBeforeRange: 1_184,
    signups: dates.map((date, index) => ({
      date,
      count: Math.max(0, Math.round(8 + Math.sin(index * 0.72) * 5 + (index % 5 === 0 ? 5 : 0))),
    })),
    statistics: statisticsDates.map((date, index) => {
      const learnedUsers = 410 + index * 4 + Math.round(Math.sin(index * 0.4) * 18);
      const streak3Users = Math.round(learnedUsers * (0.31 + Math.sin(index * 0.25) * 0.035));
      const streak7Users = Math.round(learnedUsers * (0.13 + Math.sin(index * 0.2) * 0.02));
      return {
        date,
        learnedUsers,
        streak3Users,
        streak7Users,
        calculatedAt: `${addDays(date, 1)}T00:05:00`,
      };
    }),
  };
}
