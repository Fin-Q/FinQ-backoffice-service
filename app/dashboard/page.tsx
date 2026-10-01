import { requireAdmin } from "@/lib/auth";
import { addDays, DateRangeError, todayInTimeZone } from "@/lib/dashboard/date-range";
import { getDashboardMetrics } from "@/lib/dashboard/service";
import { DailyTable } from "./_components/daily-table";
import { AppHeader } from "./_components/app-header";
import { SignupChart, StreakChart } from "./_components/trend-charts";
import styles from "./dashboard.module.css";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams: Promise<{ from?: string; to?: string }>;
};

const numberFormatter = new Intl.NumberFormat("ko-KR");

function formatTimestamp(value: string | null) {
  if (!value) return "집계 데이터 없음";
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(`${value}+09:00`));
}

function TrendBadge({ value, suffix = "%" }: { value: number | null; suffix?: string }) {
  if (value === null) return <span className={styles.neutralBadge}>비교 전</span>;
  const positive = value >= 0;
  return (
    <span className={positive ? styles.positiveBadge : styles.negativeBadge}>
      {positive ? "↑" : "↓"} {Math.abs(value).toFixed(1)}{suffix}
    </span>
  );
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  await requireAdmin();
  const params = await searchParams;
  let rangeError: string | null = null;
  let metrics;

  try {
    metrics = await getDashboardMetrics(params);
  } catch (error) {
    if (!(error instanceof DateRangeError)) throw error;
    rangeError = error.message;
    metrics = await getDashboardMetrics({});
  }

  const latestSignupGrowth = metrics.daily.at(-1)?.signupGrowthRate ?? null;
  const today = todayInTimeZone();
  const presets = [7, 30, 90].map((days) => ({
    days,
    from: addDays(today, -(days - 1)),
    to: today,
  }));

  return (
    <div className={styles.shell}>
      <AppHeader />
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>운영 현황</p>
            <h1>대시보드</h1>
            <p className={styles.headerDescription}>사용자 성장과 학습 지속 지표를 확인합니다.</p>
          </div>
          <div className={styles.headerMeta}>
            <span className={styles.liveDot} />
            최근 집계 {formatTimestamp(metrics.calculatedAt)}
          </div>
        </header>

        <section className={styles.filterPanel} aria-labelledby="period-filter-title">
          <div>
            <p id="period-filter-title" className={styles.filterTitle}>조회 기간</p>
            <div className={styles.presets} aria-label="빠른 기간 선택">
              {presets.map((preset) => (
                <a
                  key={preset.days}
                  href={`?from=${preset.from}&to=${preset.to}`}
                  className={metrics.range.days === preset.days && metrics.range.to === today ? styles.activePreset : undefined}
                >
                  {preset.days}일
                </a>
              ))}
            </div>
          </div>
          <form className={styles.dateForm}>
            <label>시작일<input type="date" name="from" defaultValue={metrics.range.from} max={today} /></label>
            <span className={styles.dateSeparator}>—</span>
            <label>종료일<input type="date" name="to" defaultValue={metrics.range.to} max={today} /></label>
            <button type="submit">적용</button>
          </form>
        </section>
        {rangeError ? <p className={styles.rangeError} role="alert">{rangeError} 기본 30일 데이터로 표시합니다.</p> : null}

        <section className={styles.kpiStrip} aria-label="핵심 운영 지표">
          <article className={styles.kpiItem}>
            <p>전체 사용자</p>
            <strong>{numberFormatter.format(metrics.summary.totalUsers)}</strong>
            <span>{metrics.range.to} 기준</span>
          </article>
          <article className={styles.kpiItem}>
            <p>기간 신규 가입</p>
            <strong>{numberFormatter.format(metrics.summary.signupsInRange)}</strong>
            <span>일 평균 {metrics.summary.averageDailySignups.toFixed(1)}명 <TrendBadge value={latestSignupGrowth} /></span>
          </article>
          <article className={styles.kpiItem}>
            <p>학습 사용자</p>
            <strong>{numberFormatter.format(metrics.summary.latestLearnedUsers)}</strong>
            <span>{metrics.latestStatisticsDate ?? "집계 전"} 기준</span>
          </article>
          <article className={styles.kpiItem}>
            <p>7일 연속 학습률</p>
            <strong>{metrics.summary.latestStreak7Rate.toFixed(1)}%</strong>
            <span>{numberFormatter.format(metrics.summary.latestStreak7Users)}명 달성</span>
          </article>
        </section>

        <section className={styles.insightGrid}>
          <article className={styles.chartCard}>
            <div className={styles.cardHeading}>
              <div><p className={styles.cardEyebrow}>가입 흐름</p><h2>일별 신규 가입</h2></div>
              <div className={styles.chartMetric}><span>기간 합계</span><strong>{numberFormatter.format(metrics.summary.signupsInRange)}명</strong></div>
            </div>
            <SignupChart data={metrics.daily} />
          </article>
          <article className={styles.chartCard}>
            <div className={styles.cardHeading}>
              <div><p className={styles.cardEyebrow}>학습 지속</p><h2>연속 학습률</h2></div>
              <div className={styles.legend}><span><i className={styles.legend3} />3일</span><span><i className={styles.legend7} />7일</span></div>
            </div>
            <StreakChart data={metrics.daily} />
            <div className={styles.streakSummary}>
              <div><span>3일 연속</span><strong>{metrics.summary.latestStreak3Rate.toFixed(1)}%</strong><small>{numberFormatter.format(metrics.summary.latestStreak3Users)}명</small></div>
              <div><span>7일 연속</span><strong>{metrics.summary.latestStreak7Rate.toFixed(1)}%</strong><small>{numberFormatter.format(metrics.summary.latestStreak7Users)}명</small></div>
            </div>
          </article>
        </section>

        <section className={styles.tableCard}>
          <div className={styles.cardHeading}>
            <div><p className={styles.cardEyebrow}>일별 데이터</p><h2>상세 지표</h2></div>
            <span className={styles.rowCount}>{metrics.range.days}일</span>
          </div>
          <DailyTable data={metrics.daily} />
        </section>
      </main>
    </div>
  );
}
