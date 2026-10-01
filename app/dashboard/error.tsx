"use client";

import styles from "./dashboard.module.css";

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <main className={styles.main}>
      <p className={styles.eyebrow}>DATA CONNECTION ERROR</p>
      <h1>통계 데이터를 불러오지 못했습니다.</h1>
      <p className={styles.headerDescription}>DB 연결 정보와 읽기 권한을 확인한 뒤 다시 시도해 주세요.</p>
      <button className={styles.retryButton} onClick={() => reset()}>다시 시도</button>
    </main>
  );
}
