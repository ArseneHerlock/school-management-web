import { NextRequest } from "next/server";
import { forwardToBackend } from "@/lib/bff/forwardToBackend";

export async function GET(req: NextRequest) {
  return forwardToBackend(req, "parents", "/api/parents/me");
}

export async function PUT(req: NextRequest) {
  return forwardToBackend(req, "parents", "/api/parents/me");
}
