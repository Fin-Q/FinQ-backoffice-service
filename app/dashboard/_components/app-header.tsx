"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../dashboard.module.css";
import { CheckCircleIcon, LogoutIcon } from "../../_components/icons";

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className={styles.appHeader}>
      <div className={styles.appHeaderInner}>
        <Link className={styles.brand} href="/dashboard" aria-label="FinQ 운영 홈">
          <Image className={styles.brandMark} src="/brand/app-icon.png" alt="" width={34} height={34} priority />
          <span className={styles.brandName}>FinQ</span>
          <span className={styles.brandDivider} aria-hidden />
          <span className={styles.productName}>Operations</span>
        </Link>
        <nav className={styles.primaryNav} aria-label="관리자 메뉴">
          <Link href="/dashboard" aria-current={pathname === "/dashboard" ? "page" : undefined}>대시보드</Link>
          <Link href="/dashboard/users" aria-current={pathname.startsWith("/dashboard/users") ? "page" : undefined}>사용자</Link>
        </nav>
        <div className={styles.headerActions}>
          <span className={styles.systemState}><CheckCircleIcon />정상 운영 중</span>
          <form action="/api/auth/logout" method="post">
            <button type="submit"><LogoutIcon />로그아웃</button>
          </form>
        </div>
      </div>
    </header>
  );
}
