import type { DailyMetric } from "@/lib/dashboard/types";
import styles from "../dashboard.module.css";

const WIDTH = 760;
const HEIGHT = 254;
const PAD_LEFT = 44;
const PAD_RIGHT = 18;
const PAD_TOP = 20;
const PAD_BOTTOM = 34;

type Point = { x: number; y: number };

function labelIndexes(length: number) {
  if (length === 0) return [];
  if (length <= 1) return [0];
  return [...new Set([0, Math.floor((length - 1) / 2), length - 1])];
}

function shortDate(date: string) {
  const [, month, day] = date.split("-");
  return `${Number(month)}/${Number(day)}`;
}

function roundedMax(value: number, minimum: number) {
  const safe = Math.max(value, minimum);
  const magnitude = 10 ** Math.floor(Math.log10(safe));
  const step = magnitude / 2;
  return Math.ceil(safe / step) * step;
}

function smoothPath(points: Point[]) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = points[index - 1];
    const beforePrevious = points[index - 2] ?? previous;
    const next = points[index + 1] ?? point;
    const firstControlX = previous.x + (point.x - beforePrevious.x) / 6;
    const firstControlY = previous.y + (point.y - beforePrevious.y) / 6;
    const secondControlX = point.x - (next.x - previous.x) / 6;
    const secondControlY = point.y - (next.y - previous.y) / 6;
    return `${path} C ${firstControlX} ${firstControlY}, ${secondControlX} ${secondControlY}, ${point.x} ${point.y}`;
  }, "");
}

function ChartGrid({ max }: { max: number }) {
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  return (
    <>
      {[1, 0.5, 0].map((ratio) => {
        const y = PAD_TOP + plotHeight * (1 - ratio);
        return (
          <g key={ratio}>
            <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={y} y2={y} className={styles.gridLine} />
            <text x={PAD_LEFT - 9} y={y + 3} textAnchor="end" className={styles.yAxisLabel}>
              {Math.round(max * ratio)}
            </text>
          </g>
        );
      })}
    </>
  );
}

export function SignupChart({ data }: { data: DailyMetric[] }) {
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const plotWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
  const max = roundedMax(Math.max(...data.map((item) => item.signups), 1), 5);
  const points = data.map((item, index) => ({
    x: PAD_LEFT + (index / Math.max(data.length - 1, 1)) * plotWidth,
    y: PAD_TOP + plotHeight - (item.signups / max) * plotHeight,
  }));
  const linePath = smoothPath(points);
  const areaPath = `${linePath} L ${points.at(-1)?.x ?? PAD_LEFT} ${PAD_TOP + plotHeight} L ${points[0]?.x ?? PAD_LEFT} ${PAD_TOP + plotHeight} Z`;
  const latest = points.at(-1);

  return (
    <div className={styles.chartWrap}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="일별 신규 가입자 영역 차트">
        <defs>
          <linearGradient id="signup-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#287fde" stopOpacity=".22" />
            <stop offset="100%" stopColor="#287fde" stopOpacity="0" />
          </linearGradient>
        </defs>
        <ChartGrid max={max} />
        <path d={areaPath} className={styles.signupArea} />
        <path d={linePath} pathLength={1} className={styles.signupLine} />
        {latest ? (
          <>
            <circle cx={latest.x} cy={latest.y} r="7" className={styles.latestHalo} />
            <circle cx={latest.x} cy={latest.y} r="3.5" className={styles.latestPoint}>
              <title>{`${data.at(-1)?.date}: ${data.at(-1)?.signups}명 가입`}</title>
            </circle>
          </>
        ) : null}
        {labelIndexes(data.length).map((index) => (
          <text key={index} x={points[index].x} y={HEIGHT - 8} textAnchor="middle" className={styles.axisLabel}>
            {shortDate(data[index].date)}
          </text>
        ))}
      </svg>
    </div>
  );
}

export function StreakChart({ data }: { data: DailyMetric[] }) {
  const available = data.filter((item) => item.hasStatistics);
  if (available.length === 0) return <div className={styles.emptyChart}>조회 기간에 마감된 스트릭 통계가 없습니다.</div>;

  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const plotWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
  const max = roundedMax(Math.max(...available.flatMap((item) => [item.streak3Rate, item.streak7Rate])), 10);
  const point = (value: number, index: number) => ({
    x: PAD_LEFT + (index / Math.max(available.length - 1, 1)) * plotWidth,
    y: PAD_TOP + plotHeight - (value / max) * plotHeight,
  });
  const points3 = available.map((item, index) => point(item.streak3Rate, index));
  const points7 = available.map((item, index) => point(item.streak7Rate, index));
  const latest3 = points3.at(-1);
  const latest7 = points7.at(-1);

  return (
    <div className={styles.chartWrap}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="3일 및 7일 연속 학습률 선 차트">
        <ChartGrid max={max} />
        <path d={smoothPath(points3)} pathLength={1} className={styles.line3} />
        <path d={smoothPath(points7)} pathLength={1} className={styles.line7} />
        {latest3 ? <circle cx={latest3.x} cy={latest3.y} r="3.5" className={styles.point3}><title>{`${available.at(-1)?.date}: 3일 ${available.at(-1)?.streak3Rate}%`}</title></circle> : null}
        {latest7 ? <circle cx={latest7.x} cy={latest7.y} r="3.5" className={styles.point7}><title>{`${available.at(-1)?.date}: 7일 ${available.at(-1)?.streak7Rate}%`}</title></circle> : null}
        {labelIndexes(available.length).map((index) => (
          <text key={index} x={points3[index].x} y={HEIGHT - 8} textAnchor="middle" className={styles.axisLabel}>
            {shortDate(available[index].date)}
          </text>
        ))}
      </svg>
    </div>
  );
}
