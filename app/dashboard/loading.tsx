import styles from "./dashboard.module.css";

export default function DashboardLoading() {
  return (
      <main className={styles.main} aria-busy="true" aria-label="대시보드 지표를 불러오는 중">
        <div className={styles.loadingStatus} role="status">
          <span className={styles.loadingSpinner} aria-hidden="true" />
          최신 운영 지표를 불러오고 있습니다
        </div>
        <header className={styles.loadingPageHeader} aria-hidden="true">
          <div>
            <span className={`${styles.skeletonBlock} ${styles.loadingEyebrow}`} />
            <span className={`${styles.skeletonBlock} ${styles.loadingTitle}`} />
            <span className={`${styles.skeletonBlock} ${styles.loadingDescription}`} />
          </div>
          <span className={`${styles.skeletonBlock} ${styles.loadingTimestamp}`} />
        </header>
        <span className={`${styles.skeletonBlock} ${styles.loadingFilter}`} aria-hidden="true" />
        <section className={styles.loadingKpis} aria-hidden="true">
          {[0, 1, 2, 3].map((item) => (
            <div key={item}>
              <span className={`${styles.skeletonBlock} ${styles.loadingKpiLabel}`} />
              <span className={`${styles.skeletonBlock} ${styles.loadingKpiValue}`} />
              <span className={`${styles.skeletonBlock} ${styles.loadingKpiMeta}`} />
            </div>
          ))}
        </section>
        <section className={styles.loadingCharts} aria-hidden="true">
          {[0, 1].map((item) => (
            <div key={item} className={styles.loadingCard}>
              <span className={`${styles.skeletonBlock} ${styles.loadingCardTitle}`} />
              <span className={`${styles.skeletonBlock} ${styles.loadingChart}`} />
            </div>
          ))}
        </section>
        <section className={styles.loadingTable} aria-hidden="true">
          <span className={`${styles.skeletonBlock} ${styles.loadingCardTitle}`} />
          <span className={`${styles.skeletonBlock} ${styles.loadingTableRows}`} />
        </section>
      </main>
  );
}
