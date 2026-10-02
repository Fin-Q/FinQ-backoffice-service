"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardIcon, LogoutIcon, UsersIcon } from "../../_components/icons";
import styles from "../dashboard.module.css";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <Link className={styles.brand} href="/dashboard" aria-label="FinQ 관리자 홈">
        <Image className={styles.brandMark} src="/brand/app-icon.png" alt="" width={36} height={36} priority />
        <span className={styles.brandName}>FinQ</span>
      </Link>

      <nav className={styles.sidebarNav} aria-label="관리자 메뉴">
        <Link href="/dashboard" aria-current={pathname === "/dashboard" ? "page" : undefined}>
          <DashboardIcon />
          <span>대시보드</span>
        </Link>
        <Link href="/dashboard/users" aria-current={pathname.startsWith("/dashboard/users") ? "page" : undefined}>
          <UsersIcon />
          <span>사용자</span>
        </Link>
      </nav>

      <div className={styles.sidebarFooter}>
        <form action="/api/auth/logout" method="post">
          <button type="submit"><LogoutIcon /><span>로그아웃</span></button>
        </form>
      </div>
    </aside>
  );
}
