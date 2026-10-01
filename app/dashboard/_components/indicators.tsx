import styles from "../dashboard.module.css";
import { CheckCircleIcon, MinusIcon, PendingIcon, TrendDownIcon, TrendUpIcon } from "./icons";

export function TrendIndicator({ value, suffix = "%" }: { value: number | null; suffix?: string }) {
  if (value === null) {
    return <span className={`${styles.inlineIndicator} ${styles.neutralIndicator}`}><MinusIcon />비교 전</span>;
  }

  const positive = value >= 0;
  const Icon = positive ? TrendUpIcon : TrendDownIcon;
  return (
    <span className={`${styles.inlineIndicator} ${positive ? styles.positiveIndicator : styles.negativeIndicator}`}>
      <Icon />
      {Math.abs(value).toFixed(1)}{suffix}
    </span>
  );
}

export function DataStatus({ complete }: { complete: boolean }) {
  return (
    <span className={`${styles.dataStatus} ${complete ? styles.completeStatus : styles.pendingStatus}`}>
      {complete ? <CheckCircleIcon /> : <PendingIcon />}
      {complete ? "집계 완료" : "집계 대기"}
    </span>
  );
}
