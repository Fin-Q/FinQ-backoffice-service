import { NextResponse, type NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getDashboardMetrics } from "@/lib/dashboard/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const metrics = await getDashboardMetrics({
      from: request.nextUrl.searchParams.get("from"),
      to: request.nextUrl.searchParams.get("to"),
    });
    return NextResponse.json(metrics, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    if (error instanceof Error && /날짜|조회 기간|시작일|미래/.test(error.message)) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    console.error("Failed to load dashboard metrics", error);
    return NextResponse.json({ message: "통계 데이터를 불러오지 못했습니다." }, { status: 500 });
  }
}
