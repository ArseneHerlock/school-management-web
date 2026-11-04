import { NextRequest } from "next/server";
import { forwardToBackend } from "@/lib/bff/forwardToBackend";

export const OPTIONS = (req: NextRequest) => forwardToBackend(req, "schedule", "/api/schedules/query");
export const GET = (req: NextRequest) => forwardToBackend(req, "schedule", "/api/schedules/query");
