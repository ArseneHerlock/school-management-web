import { NextRequest, NextResponse } from "next/server";
import { getServiceBaseUrl, CORS_HEADERS } from "./gatewayConfig";
import { publishRealtimeMutation } from "@/lib/realtimeBroker";

/**
 * Chuyển tiếp hoàn toàn HTTP Request từ Frontend sang .NET 10 Backend Microservice tương ứng.
 * Frontend tuyệt đối không giữ kết nối CSDL và không thực thi câu lệnh SQL nào.
 */
export async function forwardToBackend(
  req: NextRequest,
  serviceName: string,
  targetPath: string
): Promise<NextResponse> {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
  }

  const baseUrl = getServiceBaseUrl(serviceName);
  if (!baseUrl) {
    return NextResponse.json(
      { error: `Dịch vụ backend '${serviceName}' chưa được cấu hình.` },
      { status: 502, headers: CORS_HEADERS }
    );
  }

  const search = req.nextUrl.search || "";
  const cleanPath = targetPath.startsWith("/") ? targetPath : `/${targetPath}`;
  const targetUrl = `${baseUrl}${cleanPath}${search}`;

  const headers = new Headers();
  for (const key of ["content-type", "authorization", "accept"]) {
    const val = req.headers.get(key);
    if (val) headers.set(key, val);
  }

  const bodyBytes = ["GET", "HEAD"].includes(req.method)
    ? undefined
    : new Uint8Array(await req.arrayBuffer());

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: bodyBytes ? new Uint8Array(bodyBytes) : undefined,
      cache: "no-store",
    });

    const responseHeaders = new Headers();
    const contentType = response.headers.get("content-type");
    if (contentType) responseHeaders.set("content-type", contentType);
    for (const [k, v] of Object.entries(CORS_HEADERS)) {
      responseHeaders.set(k, v);
    }

    if (
      ["POST", "PUT", "PATCH", "DELETE"].includes(req.method) &&
      response.status >= 200 &&
      response.status < 300
    ) {
      publishRealtimeMutation({
        type: "MUTATION",
        service: serviceName,
        method: req.method,
        endpoint: cleanPath,
        timestamp: new Date().toISOString(),
      });
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: `Không thể kết nối tới dịch vụ Backend '${serviceName}' (${targetUrl}). Chi tiết: ${err?.message || "Lỗi mạng"}`,
      },
      { status: 502, headers: CORS_HEADERS }
    );
  }
}
