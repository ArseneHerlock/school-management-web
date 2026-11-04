import { NextRequest } from "next/server";
import { forwardToBackend } from "@/lib/bff/forwardToBackend";

export const OPTIONS = (req: NextRequest) => forwardToBackend(req, "attendance", "/api/DiemDanh/pickup");
export const GET = (req: NextRequest) => forwardToBackend(req, "attendance", "/api/DiemDanh/pickup");
export const POST = (req: NextRequest) => forwardToBackend(req, "attendance", "/api/DiemDanh/pickup");
export const DELETE = (req: NextRequest) => forwardToBackend(req, "attendance", "/api/DiemDanh/pickup");
