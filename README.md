# FinQ Backoffice

FinQ 운영자가 사용자 성장과 학습 습관 지표를 매일 확인하는 Next.js 관리자 웹입니다. FinQ 운영 DB를 읽기 전용으로 조회하며 원본 스키마나 통계 데이터를 변경하지 않습니다.

## 제공 화면

- 총 사용자 수, 기간 신규 가입자 수와 일 평균 가입자 수
- 일별 신규 가입 추이와 전일 대비 증감률
- 최신 학습 경험 사용자 수
- 3일·7일 연속 학습 사용자 수와 전환율
- 날짜별 상세 지표 및 집계 완료/대기 상태
- 7일·30일·90일 빠른 필터와 최대 365일 직접 조회
- 데스크톱·모바일 반응형 레이아웃

## 기술 구성

- Next.js 16 App Router / React 19 / TypeScript
- React Server Components에서 MySQL 직접 조회
- `mysql2` 커넥션 풀
- 환경변수 관리자 계정 + HMAC 서명 HttpOnly 세션 쿠키
- Vitest, ESLint, standalone Docker 이미지

DB 모듈은 `server-only`로 보호되어 브라우저 번들에 연결 정보와 SQL이 포함되지 않습니다. 대시보드와 통계 API는 매 요청 동적으로 렌더링하며 응답을 캐시하지 않습니다.

## 지표 정의

| 지표 | 원본 | 계산 |
|---|---|---|
| 총 사용자 | `users.created_at` | 조회 종료일까지 존재하는 사용자 수 |
| 신규 가입 | `users.created_at` | 날짜별 생성 사용자 수 |
| 가입 증감률 | 신규 가입 | `(당일 - 전일) / 전일 × 100` |
| 학습 경험 사용자 | `streak_daily_statistics.learned_user_count` | 해당 마감일까지 학습 이력이 있는 사용자 수 |
| 3일 연속 학습률 | 동일 통계 테이블 | `3일 연속 사용자 / 학습 경험 사용자 × 100` |
| 7일 연속 학습률 | 동일 통계 테이블 | `7일 연속 사용자 / 학습 경험 사용자 × 100` |

현재 FinQ의 회원 탈퇴는 사용자 행을 삭제하므로, 과거 가입 수는 **조회 시점에 남아 있는 사용자 기준**입니다. 탈퇴자를 포함한 완전한 가입 퍼널이 필요하면 향후 별도 가입 이벤트 테이블이 필요합니다.

## 로컬 실행

Node.js 20.9 이상과 pnpm 11이 필요합니다.

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

`http://localhost:3000/login`에서 `ADMIN_USERNAME`, `ADMIN_PASSWORD`로 로그인합니다.

실제 DB 없이 UI를 확인하려면 `.env.local`에 아래 값을 지정합니다. 운영에서는 이 값을 사용하지 마세요.

```dotenv
DASHBOARD_DEMO_MODE=true
```

## 환경변수

| 이름 | 필수 | 설명 |
|---|---|---|
| `DB_HOST` | 예 | FinQ MySQL 호스트 |
| `DB_PORT` | 아니요 | 기본값 `3306` |
| `DB_NAME` | 예 | 기본 스키마명 |
| `DB_USER` | 예 | 읽기 전용 계정 권장 |
| `DB_PASSWORD` | 예 | DB 비밀번호 |
| `DB_SSL` | 아니요 | TLS 사용 시 `true` |
| `ADMIN_USERNAME` | 예 | 관리자 로그인 아이디 |
| `ADMIN_PASSWORD` | 예 | 관리자 로그인 비밀번호 |
| `SESSION_SECRET` | 예 | 32자 이상의 무작위 문자열 |
| `APP_TIMEZONE` | 아니요 | 기본값 `Asia/Seoul` |
| `DASHBOARD_DEMO_MODE` | 아니요 | 로컬 UI 데모 데이터 사용 |

운영에서는 백오피스를 VPN/IAP 또는 사내 네트워크 뒤에 두고, ingress에서 로그인 시도 횟수 제한을 함께 적용하는 것을 권장합니다.

## 읽기 전용 DB 계정

아래 SQL의 호스트와 비밀번호는 운영 환경에 맞게 바꿉니다.

```sql
CREATE USER 'finq_backoffice'@'%' IDENTIFIED BY 'replace-with-a-strong-password';
GRANT SELECT ON finq.users TO 'finq_backoffice'@'%';
GRANT SELECT ON finq.streak_daily_statistics TO 'finq_backoffice'@'%';
FLUSH PRIVILEGES;
```

`users.created_at`은 FinQ 애플리케이션과 동일하게 Asia/Seoul 기준의 MySQL `DATETIME`으로 해석합니다.

## 엔드포인트

| 경로 | 설명 | 인증 |
|---|---|---|
| `/login` | 관리자 로그인 | 없음 |
| `/dashboard` | 운영 대시보드 | 세션 쿠키 |
| `/api/metrics?from=YYYY-MM-DD&to=YYYY-MM-DD` | 대시보드 JSON | 세션 쿠키 |
| `/api/health` | 앱/DB 준비 상태 | 없음 |

## 검증

```bash
pnpm test
pnpm lint
pnpm build
```

## Docker

```bash
docker build -t finq-backoffice .
docker run --rm -p 3000:3000 --env-file .env.local finq-backoffice
```
