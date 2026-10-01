import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import styles from "./login.module.css";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (await isAuthenticated()) redirect("/dashboard");
  const { error } = await searchParams;

  return (
    <main className={styles.page}>
      <section className={styles.panel} aria-labelledby="login-title">
        <div className={styles.brandMark}>FQ</div>
        <p className={styles.eyebrow}>FINQ OPERATIONS</p>
        <h1 id="login-title">관리자 로그인</h1>
        <p className={styles.description}>서비스 운영 지표를 확인하려면 관리자 계정으로 로그인하세요.</p>

        {error ? <p className={styles.error} role="alert">아이디 또는 비밀번호를 확인해 주세요.</p> : null}

        <form action="/api/auth/login" method="post" className={styles.form}>
          <label>
            관리자 아이디
            <input name="username" autoComplete="username" required autoFocus />
          </label>
          <label>
            비밀번호
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <button type="submit">대시보드 들어가기</button>
        </form>
      </section>
      <p className={styles.footer}>FinQ · Financial learning operations</p>
    </main>
  );
}
