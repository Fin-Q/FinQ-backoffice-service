import styles from "../dashboard.module.css";

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandMark}>FQ</div>
        <div><strong>FinQ</strong><span>Backoffice</span></div>
      </div>
      <nav aria-label="관리자 메뉴">
        <a href="/dashboard" className={styles.activeNav}><span aria-hidden>⌁</span>대시보드</a>
      </nav>
      <div className={styles.sidebarBottom}>
        <div className={styles.systemState}><span /><div><strong>시스템 정상</strong><small>데이터베이스 연결</small></div></div>
        <form action="/api/auth/logout" method="post"><button type="submit">로그아웃</button></form>
      </div>
    </aside>
  );
}
