import "server-only";

import type { DashboardSource, DateRange, SignupRow, StatisticRow } from "./types";
import type { BackofficeUser, BackofficeUserPage } from "@/lib/users/types";

const API_PREFIX = "/api/v1";
const REQUEST_TIMEOUT_MS = 8_000;
const MINIMUM_API_KEY_LENGTH = 32;

export class FinqApiError extends Error {
  constructor(message: string, public readonly status?: number, options?: ErrorOptions) {
    super(message, options);
    this.name = "FinqApiError";
  }
}

function getApiConfig() {
  const baseUrl = process.env.FINQ_API_BASE_URL?.trim();
  const apiKey = process.env.BACKOFFICE_API_KEY?.trim();

  if (!baseUrl || !apiKey) {
    throw new FinqApiError(
      "FINQ_API_BASE_URL 또는 BACKOFFICE_API_KEY 환경변수가 없습니다.",
    );
  }

  if (apiKey.length < MINIMUM_API_KEY_LENGTH) {
    throw new FinqApiError("BACKOFFICE_API_KEY는 32자 이상이어야 합니다.");
  }

  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}

function buildApiUrl(baseUrl: string, path: string) {
  return new URL(`${API_PREFIX}${path}`, `${baseUrl}/`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStatisticRow(value: unknown): value is StatisticRow {
  return isRecord(value)
    && typeof value.date === "string"
    && typeof value.learnedUsers === "number"
    && typeof value.streak3Users === "number"
    && typeof value.streak7Users === "number"
    && typeof value.calculatedAt === "string";
}

function isSignupRow(value: unknown): value is SignupRow {
  return isRecord(value)
    && typeof value.date === "string"
    && typeof value.count === "number";
}

function isBackofficeUser(value: unknown): value is BackofficeUser {
  return isRecord(value)
    && typeof value.id === "number"
    && typeof value.nickname === "string"
    && (value.email === null || typeof value.email === "string")
    && typeof value.onboardingStatus === "string"
    && typeof value.totalXp === "number"
    && typeof value.currentStreak === "number"
    && typeof value.createdAt === "string"
    && (value.lastLoginAt === null || typeof value.lastLoginAt === "string");
}

function parseDashboardSource(payload: unknown): DashboardSource {
  if (!isRecord(payload) || !isRecord(payload.data)) {
    throw new FinqApiError("FinQ API 응답 형식이 올바르지 않습니다.");
  }

  const data = payload.data;
  if (
    typeof data.usersBeforeRange !== "number"
    || !Array.isArray(data.statistics)
    || !data.statistics.every(isStatisticRow)
    || !Array.isArray(data.signups)
    || !data.signups.every(isSignupRow)
  ) {
    throw new FinqApiError("FinQ API 통계 데이터 형식이 올바르지 않습니다.");
  }

  return {
    usersBeforeRange: data.usersBeforeRange,
    statistics: data.statistics,
    signups: data.signups,
  };
}

export async function fetchDashboardSource(range: DateRange): Promise<DashboardSource> {
  const { baseUrl, apiKey } = getApiConfig();
  const url = buildApiUrl(baseUrl, "/internal/backoffice/statistics");
  url.searchParams.set("from", range.from);
  url.searchParams.set("to", range.to);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { "X-Backoffice-Api-Key": apiKey },
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new FinqApiError("FinQ API에 연결할 수 없습니다.", undefined, { cause: error });
  }

  if (!response.ok) {
    const message = response.status === 401
      ? "FinQ API 인증에 실패했습니다."
      : "FinQ API가 통계 요청을 처리하지 못했습니다.";
    throw new FinqApiError(message, response.status);
  }

  return parseDashboardSource(await response.json());
}

export async function fetchBackofficeUsers(params: {
  page: number;
  size: number;
  query: string;
}): Promise<BackofficeUserPage> {
  const { baseUrl, apiKey } = getApiConfig();
  const url = buildApiUrl(baseUrl, "/internal/backoffice/users");
  url.searchParams.set("page", String(params.page));
  url.searchParams.set("size", String(params.size));
  if (params.query) url.searchParams.set("query", params.query);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { "X-Backoffice-Api-Key": apiKey },
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new FinqApiError("FinQ API에 연결할 수 없습니다.", undefined, { cause: error });
  }

  if (!response.ok) {
    throw new FinqApiError(
      response.status === 401 ? "FinQ API 인증에 실패했습니다." : "사용자 목록을 불러오지 못했습니다.",
      response.status,
    );
  }

  const payload: unknown = await response.json();
  if (!isRecord(payload) || !isRecord(payload.data)) {
    throw new FinqApiError("FinQ API 사용자 응답 형식이 올바르지 않습니다.");
  }
  const data = payload.data;
  if (!Array.isArray(data.users)
    || !data.users.every(isBackofficeUser)
    || typeof data.totalElements !== "number"
    || typeof data.page !== "number"
    || typeof data.size !== "number"
    || typeof data.totalPages !== "number") {
    throw new FinqApiError("FinQ API 사용자 데이터 형식이 올바르지 않습니다.");
  }

  return data as BackofficeUserPage;
}

export async function checkFinqApiHealth(): Promise<void> {
  const { baseUrl } = getApiConfig();
  const response = await fetch(buildApiUrl(baseUrl, "/actuator/health"), {
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new FinqApiError("FinQ API 상태 확인에 실패했습니다.", response.status);
  }
}
