export type DateRange = {
  from: string;
  to: string;
  days: number;
};

export type StatisticRow = {
  date: string;
  learnedUsers: number;
  streak3Users: number;
  streak7Users: number;
  calculatedAt: string;
};

export type SignupRow = {
  date: string;
  count: number;
};

export type DashboardSource = {
  usersBeforeRange: number;
  statistics: StatisticRow[];
  signups: SignupRow[];
};

export type DailyMetric = {
  date: string;
  signups: number;
  cumulativeUsers: number;
  signupGrowthRate: number | null;
  hasStatistics: boolean;
  learnedUsers: number;
  streak3Users: number;
  streak7Users: number;
  streak3Rate: number;
  streak7Rate: number;
};

export type DashboardMetrics = {
  range: DateRange;
  summary: {
    totalUsers: number;
    signupsInRange: number;
    averageDailySignups: number;
    latestLearnedUsers: number;
    latestStreak3Users: number;
    latestStreak7Users: number;
    latestStreak3Rate: number;
    latestStreak7Rate: number;
  };
  latestStatisticsDate: string | null;
  calculatedAt: string | null;
  daily: DailyMetric[];
};
