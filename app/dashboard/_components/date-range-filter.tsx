"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useTransition } from "react";
import styles from "../dashboard.module.css";

type Preset = {
  days: number;
  from: string;
  to: string;
};

type DateRangeFilterProps = {
  presets: Preset[];
  activeDays: number;
  activeTo: string;
  from: string;
  to: string;
  today: string;
};

export function DateRangeFilter({
  presets,
  activeDays,
  activeTo,
  from,
  to,
  today,
}: DateRangeFilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function moveToRange(nextFrom: string, nextTo: string) {
    const query = new URLSearchParams({ from: nextFrom, to: nextTo });
    startTransition(() => router.push(`/dashboard?${query.toString()}`));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    moveToRange(String(formData.get("from")), String(formData.get("to")));
  }

  return (
    <section
      className={`${styles.filterPanel} ${isPending ? styles.filterPanelPending : ""}`}
      aria-labelledby="period-filter-title"
      aria-busy={isPending}
    >
      <div>
        <div className={styles.filterTitleRow}>
          <p id="period-filter-title" className={styles.filterTitle}>조회 기간</p>
          {isPending ? (
            <span className={styles.filterPendingLabel} role="status">
              <span className={styles.spinner} aria-hidden="true" />
              지표 갱신 중
            </span>
          ) : null}
        </div>
        <div className={styles.presets} aria-label="빠른 기간 선택">
          {presets.map((preset) => (
            <button
              key={preset.days}
              type="button"
              className={activeDays === preset.days && activeTo === today ? styles.activePreset : undefined}
              disabled={isPending}
              onClick={() => moveToRange(preset.from, preset.to)}
            >
              {preset.days}일
            </button>
          ))}
        </div>
      </div>
      <form className={styles.dateForm} onSubmit={handleSubmit}>
        <label>시작일<input type="date" name="from" defaultValue={from} max={today} disabled={isPending} /></label>
        <span className={styles.dateSeparator}>—</span>
        <label>종료일<input type="date" name="to" defaultValue={to} max={today} disabled={isPending} /></label>
        <button type="submit" disabled={isPending}>
          {isPending ? <span className={styles.buttonSpinner} aria-hidden="true" /> : null}
          {isPending ? "불러오는 중" : "적용"}
        </button>
      </form>
      {isPending ? <span className={styles.filterProgress} aria-hidden="true" /> : null}
    </section>
  );
}
