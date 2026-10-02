"use client";

import { FormEvent, useTransition } from "react";
import { useRouter } from "next/navigation";
import styles from "../../dashboard.module.css";

export function UserSearch({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = String(new FormData(event.currentTarget).get("query") ?? "").trim();
    startTransition(() => router.push(query ? `/dashboard/users?query=${encodeURIComponent(query)}` : "/dashboard/users"));
  }

  return (
    <form className={styles.userSearch} onSubmit={submit} aria-busy={isPending}>
      <label htmlFor="user-query">사용자 검색</label>
      <input id="user-query" name="query" defaultValue={defaultValue} placeholder="사용자명 또는 이메일" />
      <button type="submit" disabled={isPending}>{isPending ? "검색 중" : "검색"}</button>
    </form>
  );
}
