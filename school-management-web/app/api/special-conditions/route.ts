import { NextRequest } from "next/server";
import { forwardToBackend } from "@/lib/bff/forwardToBackend";

export const OPTIONS = (req: NextRequest) => forwardToBackend(req, "health", "/api/SucKhoe/special-conditions");
export const GET = (req: NextRequest) => forwardToBackend(req, "health", "/api/SucKhoe/special-conditions");
export const POST = (req: NextRequest) => forwardToBackend(req, "health", "/api/SucKhoe/special-conditions");
export const DELETE = (req: NextRequest) => forwardToBackend(req, "health", "/api/SucKhoe/special-conditions");
