import { afterEach, describe, expect, it, vi } from "vitest";
import { checkFinqApiHealth, fetchBackofficeUsers, fetchDashboardSource, FinqApiError } from "./api-client";

vi.mock("server-only", () => ({}));

const range = { from: "2026-09-01", to: "2026-09-02", days: 2 };

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function configureApi() {
  vi.stubEnv("FINQ_API_BASE_URL", "https://api.finq.example/");
  vi.stubEnv("BACKOFFICE_API_KEY", "test-backoffice-api-key-32-characters");
}

describe("fetchDashboardSource", () => {
  it("calls the internal Spring API and parses its data", async () => {
    configureApi();
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      status: "SUCCESS",
      data: {
        usersBeforeRange: 100,
        statistics: [{
          date: "2026-09-02",
          learnedUsers: 70,
          streak3Users: 20,
          streak7Users: 8,
          calculatedAt: "2026-09-03T00:05:00",
        }],
        signups: [{ date: "2026-09-01", count: 4 }],
      },
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const source = await fetchDashboardSource(range);

    expect(source.usersBeforeRange).toBe(100);
    expect(source.signups).toEqual([{ date: "2026-09-01", count: 4 }]);
    const [url, options] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.toString()).toBe(
      "https://api.finq.example/api/v1/internal/backoffice/statistics?from=2026-09-01&to=2026-09-02",
    );
    expect(options.headers).toEqual({
      "X-Backoffice-Api-Key": "test-backoffice-api-key-32-characters",
    });
  });

  it("rejects an invalid upstream response", async () => {
    configureApi();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: { statistics: [] } }), { status: 200 }),
    ));

    await expect(fetchDashboardSource(range)).rejects.toBeInstanceOf(FinqApiError);
  });

  it("rejects a short API key before sending a request", async () => {
    vi.stubEnv("FINQ_API_BASE_URL", "https://api.finq.example");
    vi.stubEnv("BACKOFFICE_API_KEY", "short-key");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchDashboardSource(range)).rejects.toThrow(
      "BACKOFFICE_API_KEY는 32자 이상이어야 합니다.",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("preserves the upstream status when authentication fails", async () => {
    configureApi();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 401 })));

    await expect(fetchDashboardSource(range)).rejects.toMatchObject({
      message: "FinQ API 인증에 실패했습니다.",
      status: 401,
    });
  });
});

describe("checkFinqApiHealth", () => {
  it("checks the Spring actuator endpoint", async () => {
    configureApi();
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await checkFinqApiHealth();

    expect((fetchMock.mock.calls[0]?.[0] as URL).toString()).toBe(
      "https://api.finq.example/api/v1/actuator/health",
    );
  });
});

describe("fetchBackofficeUsers", () => {
  it("calls the paged internal user API", async () => {
    configureApi();
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      status: "SUCCESS",
      data: {
        users: [{
          id: 12,
          nickname: "민지",
          email: "minji@example.com",
          onboardingStatus: "COMPLETED",
          totalXp: 120,
          currentStreak: 4,
          createdAt: "2026-10-01T10:00:00",
          lastLoginAt: null,
        }],
        totalElements: 1,
        page: 0,
        size: 20,
        totalPages: 1,
      },
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const users = await fetchBackofficeUsers({ page: 0, size: 20, query: "민지" });

    expect(users.users[0]?.nickname).toBe("민지");
    expect((fetchMock.mock.calls[0]?.[0] as URL).toString()).toBe(
      "https://api.finq.example/api/v1/internal/backoffice/users?page=0&size=20&query=%EB%AF%BC%EC%A7%80",
    );
  });
});
