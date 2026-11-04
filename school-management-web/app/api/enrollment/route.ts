import { NextRequest } from "next/server";
import { forwardToBackend } from "@/lib/bff/forwardToBackend";

export const OPTIONS = (req: NextRequest) => forwardToBackend(req, "students", "/api/students/enrollment");
export const GET = (req: NextRequest) => forwardToBackend(req, "students", "/api/students/enrollment");
export const POST = (req: NextRequest) => forwardToBackend(req, "students", "/api/students/enrollment");
export const PUT = (req: NextRequest) => forwardToBackend(req, "students", "/api/students/enrollment");
export const DELETE = (req: NextRequest) => forwardToBackend(req, "students", "/api/students/enrollment");
