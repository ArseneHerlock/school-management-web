import { NextRequest } from "next/server";
import { forwardToBackend } from "@/lib/bff/forwardToBackend";

export const OPTIONS = (req: NextRequest) => forwardToBackend(req, "billing", "/api/billing/meal-deduction");
export const GET = (req: NextRequest) => forwardToBackend(req, "billing", "/api/billing/meal-deduction");
export const POST = (req: NextRequest) => forwardToBackend(req, "billing", "/api/billing/meal-deduction");
