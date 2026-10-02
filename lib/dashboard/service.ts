import "server-only";

import { parseDateRange } from "./date-range";
import { buildDashboardMetrics } from "./metrics";
import { createDemoSource } from "./demo-source";
import { fetchDashboardSource } from "./api-client";

export async function getDashboardMetrics(input: { from?: string | null; to?: string | null }) {
  const range = parseDateRange(input);
  const source = process.env.DASHBOARD_DEMO_MODE === "true"
    ? createDemoSource(range)
    : await fetchDashboardSource(range);
  return buildDashboardMetrics(range, source);
}
