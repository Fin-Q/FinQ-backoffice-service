import "server-only";

import type { RowDataPacket } from "mysql2";
import { getDb } from "@/lib/db";
import type { DashboardSource, DateRange, SignupRow, StatisticRow } from "./types";

type StatisticDbRow = RowDataPacket & {
  date: string;
  learnedUsers: number;
  streak3Users: number;
  streak7Users: number;
  calculatedAt: string;
};

type SignupDbRow = RowDataPacket & { date: string; count: number };
type CountDbRow = RowDataPacket & { count: number };

export async function fetchDashboardSource(range: DateRange): Promise<DashboardSource> {
  const db = getDb();
  const [statisticsResult, signupsResult, usersBeforeResult] = await Promise.all([
    db.query<StatisticDbRow[]>(
      `SELECT DATE_FORMAT(statistics_date, '%Y-%m-%d') AS date,
              learned_user_count AS learnedUsers,
              streak_3_days_user_count AS streak3Users,
              streak_7_days_user_count AS streak7Users,
              DATE_FORMAT(calculated_at, '%Y-%m-%dT%H:%i:%s') AS calculatedAt
       FROM streak_daily_statistics
       WHERE statistics_date BETWEEN ? AND ?
       ORDER BY statistics_date ASC`,
      [range.from, range.to],
    ),
    db.query<SignupDbRow[]>(
      `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS date, COUNT(*) AS count
       FROM users
       WHERE created_at >= ? AND created_at < DATE_ADD(?, INTERVAL 1 DAY)
       GROUP BY DATE(created_at)
       ORDER BY DATE(created_at) ASC`,
      [range.from, range.to],
    ),
    db.query<CountDbRow[]>(
      "SELECT COUNT(*) AS count FROM users WHERE created_at < ?",
      [range.from],
    ),
  ]);

  return {
    statistics: statisticsResult[0].map((row): StatisticRow => ({
      date: row.date,
      learnedUsers: Number(row.learnedUsers),
      streak3Users: Number(row.streak3Users),
      streak7Users: Number(row.streak7Users),
      calculatedAt: row.calculatedAt,
    })),
    signups: signupsResult[0].map((row): SignupRow => ({
      date: row.date,
      count: Number(row.count),
    })),
    usersBeforeRange: Number(usersBeforeResult[0][0]?.count ?? 0),
  };
}
