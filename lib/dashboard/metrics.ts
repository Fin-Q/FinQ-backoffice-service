import { enumerateDates } from "./date-range";
import type { DashboardMetrics, DashboardSource, DateRange } from "./types";

function rate(part: number, total: number) {
  return total === 0 ? 0 : Number(((part / total) * 100).toFixed(1));
}

function growth(current: number, previous: number | null) {
  if (previous === null || previous === 0) return null;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export function buildDashboardMetrics(range: DateRange, source: DashboardSource): DashboardMetrics {
  const statisticsByDate = new Map(source.statistics.map((row) => [row.date, row]));
  const signupsByDate = new Map(source.signups.map((row) => [row.date, row.count]));
  let cumulativeUsers = source.usersBeforeRange;
  let previousSignups: number | null = null;

  const daily = enumerateDates(range.from, range.to).map((date) => {
    const signups = signupsByDate.get(date) ?? 0;
    const statistics = statisticsByDate.get(date);
    cumulativeUsers += signups;

    const metric = {
      date,
      signups,
      cumulativeUsers,
      signupGrowthRate: growth(signups, previousSignups),
      hasStatistics: Boolean(statistics),
      learnedUsers: statistics?.learnedUsers ?? 0,
      streak3Users: statistics?.streak3Users ?? 0,
      streak7Users: statistics?.streak7Users ?? 0,
      streak3Rate: rate(statistics?.streak3Users ?? 0, statistics?.learnedUsers ?? 0),
      streak7Rate: rate(statistics?.streak7Users ?? 0, statistics?.learnedUsers ?? 0),
    };
    previousSignups = signups;
    return metric;
  });

  const latestStatistic = [...source.statistics].sort((a, b) => b.date.localeCompare(a.date))[0];
  const signupsInRange = daily.reduce((sum, item) => sum + item.signups, 0);

  return {
    range,
    summary: {
      totalUsers: cumulativeUsers,
      signupsInRange,
      averageDailySignups: Number((signupsInRange / range.days).toFixed(1)),
      latestLearnedUsers: latestStatistic?.learnedUsers ?? 0,
      latestStreak3Users: latestStatistic?.streak3Users ?? 0,
      latestStreak7Users: latestStatistic?.streak7Users ?? 0,
      latestStreak3Rate: rate(latestStatistic?.streak3Users ?? 0, latestStatistic?.learnedUsers ?? 0),
      latestStreak7Rate: rate(latestStatistic?.streak7Users ?? 0, latestStatistic?.learnedUsers ?? 0),
    },
    latestStatisticsDate: latestStatistic?.date ?? null,
    calculatedAt: latestStatistic?.calculatedAt ?? null,
    daily,
  };
}
