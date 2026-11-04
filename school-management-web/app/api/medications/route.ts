import { NextRequest } from "next/server";
import { forwardToBackend } from "@/lib/bff/forwardToBackend";

export const OPTIONS = (req: NextRequest) => forwardToBackend(req, "health", "/api/SucKhoe/medications");
export const GET = (req: NextRequest) => forwardToBackend(req, "health", "/api/SucKhoe/medications");
export const POST = (req: NextRequest) => forwardToBackend(req, "health", "/api/SucKhoe/medications");
export const PATCH = (req: NextRequest) => forwardToBackend(req, "health", "/api/SucKhoe/medications");
