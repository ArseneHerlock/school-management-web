import { NextRequest, NextResponse } from "next/server";

const parentServiceUrl = process.env.BACKEND_PARENTS_URL || "http://127.0.0.1:5051";

async function forward(request: NextRequest) {
  const headers = new Headers({ Accept: "application/json" });
  const authorization = request.headers.get("authorization");
  if (authorization) headers.set("Authorization", authorization);
  if (request.method !== "GET") headers.set("Content-Type", "application/json");

  const response = await fetch(`${parentServiceUrl}/api/parents/me`, {
    method: request.method,
    headers,
    body: request.method === "GET" ? undefined : await request.text(),
    cache: "no-store",
  });

  return new NextResponse(response.body, {
    status: response.status,
    headers: { "content-type": response.headers.get("content-type") || "application/json" },
  });
}

export const GET = forward;
export const PUT = forward;
