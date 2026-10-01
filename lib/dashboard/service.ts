import "server-only";

import { parseDateRange } from "./date-range";
import { buildDashboardMetrics } from "./metrics";
import { fetchDashboardSource } from "./repository";

export async function getDashboardMetrics(input: { from?: string | null; to?: string | null }) {
  const range = parseDateRange(input);
  const source = await fetchDashboardSource(range);
  return buildDashboardMetrics(range, source);
}
