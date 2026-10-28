import { NextRequest, NextResponse } from "next/server";
import { publishRealtimeMutation } from "@/lib/realtimeBroker";
import {
  ALLOWED_METHODS,
  CORS_HEADERS,
  getServiceBaseUrl,
  normalizeEndpointPath,
  normalizeQueryParams,
} from "@/lib/bff/gatewayConfig";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

async function handler(
  request: NextRequest,
  context: { params: Promise<{ service: string; path: string[] }> }
) {
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
  }

  if (!ALLOWED_METHODS.has(request.method)) {
    return NextResponse.json(
      { message: "Phương thức không được hỗ trợ." },
      { status: 405, headers: CORS_HEADERS }
    );
  }

  const { service, path } = await context.params;
  const baseUrl = getServiceBaseUrl(service);
  if (!baseUrl) {
    return NextResponse.json(
      { message: "Service không được cấu hình." },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  const normalizedEndpoint = normalizeEndpointPath(service, path);
  const queryString = normalizeQueryParams(service, request.nextUrl.search);
  const targetUrl = `${baseUrl}${normalizedEndpoint}${queryString ? `?${queryString}` : ""}`;

  const headers = new Headers();
  for (const key of ["content-type", "authorization", "accept"]) {
    const value = request.headers.get(key);
    if (value) headers.set(key, value);
  }

  const bodyBytes = ["GET", "HEAD"].includes(request.method)
    ? undefined
    : new Uint8Array(await request.arrayBuffer());

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
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

    // Phát sự kiện thời gian thực (SSE Pub/Sub) khi ghi dữ liệu thành công
    if (
      ["POST", "PUT", "PATCH", "DELETE"].includes(request.method) &&
      response.status >= 200 &&
      response.status < 300
    ) {
      publishRealtimeMutation({
        type: "MUTATION",
        service,
        method: request.method,
        endpoint: normalizedEndpoint,
        timestamp: new Date().toISOString(),
      });
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json(
      {
        message:
          "Không thể kết nối đến dịch vụ. Vui lòng kiểm tra Docker containers.",
      },
      { status: 502, headers: CORS_HEADERS }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
