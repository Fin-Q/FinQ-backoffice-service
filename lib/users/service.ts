import "server-only";

import { fetchBackofficeUsers } from "@/lib/dashboard/api-client";
import type { BackofficeUserPage } from "./types";

type UserQuery = { page: number; size: number; query: string };

function demoUsers(page: number, size: number, query: string): BackofficeUserPage {
  const allUsers = Array.from({ length: 37 }, (_, index) => ({
    id: 1464 - index,
    nickname: ["민지", "재무꿈나무", "핀큐러버", "경제초보", "꾸준한곰"][index % 5] + (index + 1),
    email: `finq-user-${index + 1}@example.com`,
    onboardingStatus: index % 6 === 0 ? "CHARACTER_GUIDE" : "COMPLETED",
    totalXp: Math.max(0, 940 - index * 23),
    currentStreak: index % 9,
    createdAt: `2026-10-${String(Math.max(1, 2 - Math.floor(index / 12))).padStart(2, "0")}T${String(23 - (index % 12)).padStart(2, "0")}:20:00`,
    lastLoginAt: index % 4 === 0 ? null : "2026-10-02T09:30:00",
  }));
  const normalized = query.trim().toLowerCase();
  const filtered = allUsers.filter((user) => !normalized
    || user.nickname.toLowerCase().includes(normalized)
    || user.email.toLowerCase().includes(normalized));
  const start = page * size;
  return {
    users: filtered.slice(start, start + size),
    totalElements: filtered.length,
    page,
    size,
    totalPages: Math.ceil(filtered.length / size),
  };
}

export async function getBackofficeUsers(params: UserQuery) {
  if (process.env.DASHBOARD_DEMO_MODE === "true") {
    return demoUsers(params.page, params.size, params.query);
  }
  return fetchBackofficeUsers(params);
}
