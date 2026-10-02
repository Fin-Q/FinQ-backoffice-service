import styles from "../dashboard.module.css";

export default function UsersLoading() {
  return <main className={styles.main} aria-busy="true"><div className={styles.loadingStatus} role="status"><span className={styles.loadingSpinner} aria-hidden="true" />사용자 목록을 불러오고 있습니다</div><span className={`${styles.skeletonBlock} ${styles.loadingTableRows}`} /></main>;
}
