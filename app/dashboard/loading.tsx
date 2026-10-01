import styles from "./dashboard.module.css";

export default function DashboardLoading() {
  return (
    <main className={styles.main} aria-busy="true">
      <p className={styles.eyebrow}>FINQ OPERATIONS</p>
      <h1>지표를 불러오는 중입니다…</h1>
    </main>
  );
}
