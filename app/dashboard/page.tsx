import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await requireAdmin();

  return (
    <main style={{ padding: 40 }}>
      <h1>FinQ 운영 대시보드</h1>
      <p>통계 데이터 연결을 준비하고 있습니다.</p>
      <form action="/api/auth/logout" method="post"><button type="submit">로그아웃</button></form>
    </main>
  );
}
