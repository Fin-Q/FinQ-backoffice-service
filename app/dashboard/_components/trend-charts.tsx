import type { DailyMetric } from "@/lib/dashboard/types";
import styles from "../dashboard.module.css";

const WIDTH = 760;
const HEIGHT = 248;
const PAD_X = 36;
const PAD_TOP = 20;
const PAD_BOTTOM = 36;

function labelIndexes(length: number) {
  if (length <= 1) return [0];
  return [...new Set([0, Math.floor((length - 1) / 2), length - 1])];
}

function shortDate(date: string) {
  const [, month, day] = date.split("-");
  return `${Number(month)}/${Number(day)}`;
}

export function SignupChart({ data }: { data: DailyMetric[] }) {
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const plotWidth = WIDTH - PAD_X * 2;
  const max = Math.max(...data.map((item) => item.signups), 1);
  const step = plotWidth / Math.max(data.length, 1);
  const barWidth = Math.max(2, Math.min(22, step * 0.6));

  return (
    <div className={styles.chartWrap}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="일별 신규 가입자 막대 차트">
        {[0, 0.5, 1].map((ratio) => {
          const y = PAD_TOP + plotHeight * ratio;
          return <line key={ratio} x1={PAD_X} x2={WIDTH - PAD_X} y1={y} y2={y} className={styles.gridLine} />;
        })}
        {data.map((item, index) => {
          const height = (item.signups / max) * plotHeight;
          const x = PAD_X + index * step + (step - barWidth) / 2;
          return <rect key={item.date} x={x} y={PAD_TOP + plotHeight - height} width={barWidth} height={height} rx={barWidth / 2} className={styles.signupBar}><title>{`${item.date}: ${item.signups}명 가입`}</title></rect>;
        })}
        {labelIndexes(data.length).map((index) => (
          <text key={index} x={PAD_X + index * step + step / 2} y={HEIGHT - 8} textAnchor="middle" className={styles.axisLabel}>{shortDate(data[index].date)}</text>
        ))}
      </svg>
    </div>
  );
}

export function StreakChart({ data }: { data: DailyMetric[] }) {
  const available = data.filter((item) => item.hasStatistics);
  if (available.length === 0) return <div className={styles.emptyChart}>조회 기간에 마감된 스트릭 통계가 없습니다.</div>;

  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const plotWidth = WIDTH - PAD_X * 2;
  const max = Math.max(...available.flatMap((item) => [item.streak3Rate, item.streak7Rate]), 10);
  const point = (value: number, index: number) => {
    const x = PAD_X + (index / Math.max(available.length - 1, 1)) * plotWidth;
    const y = PAD_TOP + plotHeight - (value / max) * plotHeight;
    return { x, y };
  };
  const points3 = available.map((item, index) => point(item.streak3Rate, index));
  const points7 = available.map((item, index) => point(item.streak7Rate, index));

  return (
    <div className={styles.chartWrap}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="3일 및 7일 연속 학습률 선 차트">
        {[0, 0.5, 1].map((ratio) => <line key={ratio} x1={PAD_X} x2={WIDTH - PAD_X} y1={PAD_TOP + plotHeight * ratio} y2={PAD_TOP + plotHeight * ratio} className={styles.gridLine} />)}
        <polyline points={points3.map(({ x, y }) => `${x},${y}`).join(" ")} className={styles.line3} />
        <polyline points={points7.map(({ x, y }) => `${x},${y}`).join(" ")} className={styles.line7} />
        {points3.map(({ x, y }, index) => <circle key={`3-${available[index].date}`} cx={x} cy={y} r="3" className={styles.point3}><title>{`${available[index].date}: 3일 ${available[index].streak3Rate}%`}</title></circle>)}
        {points7.map(({ x, y }, index) => <circle key={`7-${available[index].date}`} cx={x} cy={y} r="3" className={styles.point7}><title>{`${available[index].date}: 7일 ${available[index].streak7Rate}%`}</title></circle>)}
        {labelIndexes(available.length).map((index) => <text key={index} x={point(0, index).x} y={HEIGHT - 8} textAnchor="middle" className={styles.axisLabel}>{shortDate(available[index].date)}</text>)}
      </svg>
    </div>
  );
}
