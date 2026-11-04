import { NextRequest } from "next/server";
import { forwardToBackend } from "@/lib/bff/forwardToBackend";

export const OPTIONS = (req: NextRequest) => forwardToBackend(req, "development", "/api/development/friday-awards");
export const GET = (req: NextRequest) => forwardToBackend(req, "development", "/api/development/friday-awards");
export const POST = (req: NextRequest) => forwardToBackend(req, "development", "/api/development/friday-awards");
