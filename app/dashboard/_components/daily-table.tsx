import type { DailyMetric } from "@/lib/dashboard/types";
import styles from "../dashboard.module.css";

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
              <td><strong>+{formatter.format(item.signups)}</strong>{item.signupGrowthRate !== null ? <small className={item.signupGrowthRate >= 0 ? styles.up : styles.down}>{item.signupGrowthRate >= 0 ? "↑" : "↓"} {Math.abs(item.signupGrowthRate).toFixed(1)}%</small> : null}</td>
              <td>{formatter.format(item.cumulativeUsers)}</td>
              <td>{item.hasStatistics ? formatter.format(item.learnedUsers) : "—"}</td>
              <td>{item.hasStatistics ? <>{formatter.format(item.streak3Users)} <small>{item.streak3Rate.toFixed(1)}%</small></> : "—"}</td>
              <td>{item.hasStatistics ? <>{formatter.format(item.streak7Users)} <small>{item.streak7Rate.toFixed(1)}%</small></> : "—"}</td>
              <td><span className={item.hasStatistics ? styles.completeStatus : styles.pendingStatus}>{item.hasStatistics ? "집계 완료" : "집계 대기"}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
