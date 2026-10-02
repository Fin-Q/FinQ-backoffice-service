import { NextResponse } from "next/server";
import { checkFinqApiHealth } from "@/lib/dashboard/api-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (process.env.DASHBOARD_DEMO_MODE !== "true") {
      await checkFinqApiHealth();
    }
    return NextResponse.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ status: "unavailable" }, { status: 503 });
  }
}
