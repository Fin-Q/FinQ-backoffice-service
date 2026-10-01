import { redirect } from "next/navigation";
import Image from "next/image";
import { isAuthenticated } from "@/lib/auth";
import { ActivityIcon, AlertCircleIcon, ArrowRightIcon } from "../_components/icons";
import styles from "./login.module.css";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (await isAuthenticated()) redirect("/dashboard");
  const { error } = await searchParams;

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.visual} aria-label="FinQ 브랜드 소개">
          <div className={styles.visualCopy}>
            <span className={styles.visualLabel}><ActivityIcon />FinQ 운영 도구</span>
            <h2>매일의 숫자에서<br />FinQ의 성장을 발견해요.</h2>
            <p>사용자 가입과 학습 습관을 한눈에 확인하는 운영 공간입니다.</p>
          </div>
          <Image className={styles.mascot} src="/characters/character-04.png" alt="서류 가방을 든 FinQ 캐릭터" width={430} height={310} priority />
        </section>
        <section className={styles.panel} aria-labelledby="login-title">
          <div className={styles.brand}>
            <Image src="/brand/app-icon.png" alt="FinQ" width={54} height={54} priority />
            <div><strong>FinQ</strong><span>Operations Center</span></div>
          </div>
          <p className={styles.eyebrow}>관리자 전용</p>
          <h1 id="login-title">관리자 로그인</h1>
          <p className={styles.description}>서비스 운영 지표를 확인하려면 관리자 계정으로 로그인하세요.</p>

          {error ? <p className={styles.error} role="alert"><AlertCircleIcon />아이디 또는 비밀번호를 확인해 주세요.</p> : null}

          <form action="/api/auth/login" method="post" className={styles.form}>
            <label>
              관리자 아이디
              <input name="username" autoComplete="username" required autoFocus placeholder="아이디를 입력하세요" />
            </label>
            <label>
              비밀번호
              <input name="password" type="password" autoComplete="current-password" required placeholder="비밀번호를 입력하세요" />
            </label>
            <button type="submit">대시보드 들어가기 <ArrowRightIcon /></button>
          </form>
        </section>
      </div>
      <p className={styles.footer}>FinQ · Financial learning operations</p>
    </main>
  );
}
