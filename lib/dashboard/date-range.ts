const DAY_IN_MS = 24 * 60 * 60 * 1000;
export const MAX_RANGE_DAYS = 365;

function parseIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) return null;
  return date;
}

export function formatIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function addDays(value: string, days: number) {
  const date = parseIsoDate(value);
  if (!date) throw new Error("올바르지 않은 날짜입니다.");
  date.setUTCDate(date.getUTCDate() + days);
  return formatIsoDate(date);
}

export function todayInTimeZone(timeZone = process.env.APP_TIMEZONE ?? "Asia/Seoul") {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function parseDateRange(
  input: { from?: string | null; to?: string | null },
  today = todayInTimeZone(),
) {
  const to = input.to || today;
  const from = input.from || addDays(to, -29);
  const fromDate = parseIsoDate(from);
  const toDate = parseIsoDate(to);

  if (!fromDate || !toDate) throw new Error("날짜는 YYYY-MM-DD 형식이어야 합니다.");
  if (fromDate > toDate) throw new Error("시작일은 종료일보다 늦을 수 없습니다.");
  if (to > today) throw new Error("미래 날짜는 조회할 수 없습니다.");

  const days = Math.floor((toDate.getTime() - fromDate.getTime()) / DAY_IN_MS) + 1;
  if (days > MAX_RANGE_DAYS) throw new Error(`조회 기간은 최대 ${MAX_RANGE_DAYS}일입니다.`);

  return { from, to, days };
}

export function enumerateDates(from: string, to: string) {
  const dates: string[] = [];
  for (let current = from; current <= to; current = addDays(current, 1)) dates.push(current);
  return dates;
}
