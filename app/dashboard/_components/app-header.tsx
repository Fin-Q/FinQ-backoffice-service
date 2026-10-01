import Image from "next/image";
import styles from "../dashboard.module.css";

export function AppHeader() {
  return (
    <header className={styles.appHeader}>
      <div className={styles.appHeaderInner}>
        <a className={styles.brand} href="/dashboard" aria-label="FinQ 운영 홈">
          <Image className={styles.brandMark} src="/brand/app-icon.png" alt="" width={34} height={34} priority />
          <span className={styles.brandName}>FinQ</span>
          <span className={styles.brandDivider} aria-hidden />
          <span className={styles.productName}>Operations</span>
        </a>
        <nav className={styles.primaryNav} aria-label="관리자 메뉴">
          <a href="/dashboard" aria-current="page">대시보드</a>
        </nav>
        <div className={styles.headerActions}>
          <span className={styles.systemState}><i aria-hidden />정상 운영 중</span>
          <form action="/api/auth/logout" method="post">
            <button type="submit">로그아웃</button>
          </form>
        </div>
      </div>
    </header>
  );
}
