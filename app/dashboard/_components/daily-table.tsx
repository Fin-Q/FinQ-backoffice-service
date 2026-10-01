import type { DailyMetric } from "@/lib/dashboard/types";
import styles from "../dashboard.module.css";
import { TrendIndicator, DataStatus } from "./indicators";

const formatter = new Intl.NumberFormat("ko-KR");

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric", weekday: "short", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export function DailyTable({ data }: { data: DailyMetric[] }) {
  return (
    <div className={styles.tableWrap}>
      <table>
        <thead><tr><th>날짜</th><th>신규 가입</th><th>누적 사용자</th><th>학습 사용자</th><th>3일 연속</th><th>7일 연속</th><th>집계 상태</th></tr></thead>
        <tbody>
          {[...data].reverse().map((item) => (
            <tr key={item.date}>
              <th scope="row">{formatDate(item.date)}</th>
              <td><strong>+{formatter.format(item.signups)}</strong>{item.signupGrowthRate !== null ? <TrendIndicator value={item.signupGrowthRate} /> : null}</td>
              <td>{formatter.format(item.cumulativeUsers)}</td>
              <td>{item.hasStatistics ? formatter.format(item.learnedUsers) : "—"}</td>
              <td>{item.hasStatistics ? <>{formatter.format(item.streak3Users)} <small>{item.streak3Rate.toFixed(1)}%</small></> : "—"}</td>
              <td>{item.hasStatistics ? <>{formatter.format(item.streak7Users)} <small>{item.streak7Rate.toFixed(1)}%</small></> : "—"}</td>
              <td><DataStatus complete={item.hasStatistics} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
