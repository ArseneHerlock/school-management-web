import { NextRequest, NextResponse } from "next/server";
import { getServiceBaseUrl, CORS_HEADERS } from "@/lib/bff/gatewayConfig";

export async function GET(request: NextRequest) {
  const baseUrl = getServiceBaseUrl("development") || "http://127.0.0.1:5294";
  const url = `${baseUrl}/api/development/activities-with-criteria`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Không thể lấy danh sách hoạt động và tiêu chí." },
        { status: res.status, headers: CORS_HEADERS }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { headers: CORS_HEADERS });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Lỗi máy chủ kết nối hoạt động." },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
