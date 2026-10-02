import type { BackofficeUser } from "@/lib/users/types";
import styles from "../dashboard.module.css";

const numberFormatter = new Intl.NumberFormat("ko-KR");

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  }).format(new Date(`${value}+09:00`));
}

function statusLabel(status: string) {
  if (status === "COMPLETED") return "온보딩 완료";
  if (status === "CHARACTER_GUIDE") return "캐릭터 안내";
  return "관심사 선택";
}

export function UserTable({ users }: { users: BackofficeUser[] }) {
  if (users.length === 0) {
    return <div className={styles.emptyUsers}>조건에 맞는 사용자가 없습니다.</div>;
  }

  return (
    <div className={styles.userTableWrap}>
      <table>
        <thead><tr><th>사용자</th><th>이메일</th><th>상태</th><th>XP</th><th>연속 학습</th><th>가입일</th><th>최근 로그인</th></tr></thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <th scope="row"><span className={styles.userAvatar}>{user.nickname.slice(0, 1)}</span><span>{user.nickname}<small>#{user.id}</small></span></th>
              <td>{user.email}</td>
              <td><span className={user.onboardingStatus === "COMPLETED" ? styles.userStatusComplete : styles.userStatusPending}>{statusLabel(user.onboardingStatus)}</span></td>
              <td>{numberFormatter.format(user.totalXp)}</td>
              <td>{user.currentStreak}일</td>
              <td>{formatDate(user.createdAt)}</td>
              <td>{formatDate(user.lastLoginAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
