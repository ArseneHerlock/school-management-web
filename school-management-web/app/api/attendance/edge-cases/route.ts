import { NextRequest } from "next/server";
import { forwardToBackend } from "@/lib/bff/forwardToBackend";

export const OPTIONS = (req: NextRequest) => forwardToBackend(req, "attendance", "/api/DiemDanh/edge-cases");
export const GET = (req: NextRequest) => forwardToBackend(req, "attendance", "/api/DiemDanh/edge-cases");
export const POST = (req: NextRequest) => forwardToBackend(req, "attendance", "/api/DiemDanh/edge-cases");
