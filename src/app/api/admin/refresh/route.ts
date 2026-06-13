import { NextResponse } from "next/server";
import { refreshAccessToken } from "@/features/admin/infrastructure/admin-auth";

/**
 * POST /api/admin/refresh
 * Silently renews the access token using the refresh token cookie.
 * Called by client-side code when a server action returns 401 or session expires.
 */
export async function POST() {
  const newToken = await refreshAccessToken();

  if (!newToken) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
