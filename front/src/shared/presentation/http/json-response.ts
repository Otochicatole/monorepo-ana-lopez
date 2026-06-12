import { NextResponse } from "next/server";
import { withSecurityHeaders } from "./security-headers";

export function jsonResponse<T>(body: T, init?: ResponseInit): NextResponse {
  return withSecurityHeaders(NextResponse.json(body, init));
}

