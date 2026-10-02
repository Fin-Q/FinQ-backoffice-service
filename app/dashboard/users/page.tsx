import Link from "next/link";
import { getBackofficeUsers } from "@/lib/users/service";
import { UserTable } from "../_components/user-table";
import { UserSearch } from "./_components/user-search";
import styles from "../dashboard.module.css";

type UsersPageProps = { searchParams: Promise<{ page?: string; query?: string }> };

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;
  const page = Math.max(0, Number.parseInt(params.page ?? "0", 10) || 0);
  const query = params.query?.trim() ?? "";
  const result = await getBackofficeUsers({ page, size: 20, query });
  const pageHref = (nextPage: number) => {
    const next = new URLSearchParams({ page: String(nextPage) });
    if (query) next.set("query", query);
    return `/dashboard/users?${next.toString()}`;
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div><p className={styles.eyebrow}>사용자 관리</p><h1>가입 사용자</h1><p className={styles.headerDescription}>가입 계정과 온보딩·학습 현황을 확인합니다.</p></div>
        <strong className={styles.userCount}>총 {result.totalElements.toLocaleString("ko-KR")}명</strong>
      </header>
      <section className={styles.usersCard}>
        <UserSearch defaultValue={query} />
        <UserTable users={result.users} />
        <nav className={styles.pagination} aria-label="사용자 목록 페이지">
          {page > 0 ? <Link href={pageHref(page - 1)}>이전</Link> : <span>이전</span>}
          <strong>{result.totalPages === 0 ? 0 : page + 1} / {result.totalPages}</strong>
          {page + 1 < result.totalPages ? <Link href={pageHref(page + 1)}>다음</Link> : <span>다음</span>}
        </nav>
      </section>
    </main>
  );
}
