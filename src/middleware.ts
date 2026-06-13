import { NextRequest, NextResponse } from "next/server";

const ACCESS_COOKIE = "admin_access";
const REFRESH_COOKIE = "admin_refresh";
const REFRESH_PREFIX = "rt_";

const MIN_SECRET_LENGTH = 32;

function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i] ?? 0);
  }
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlDecodeToString(input: string): string {
  const base64 = input.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function verifyAccessTokenEdge(token: string, secret: string): Promise<boolean> {
  if (!secret || secret.length < MIN_SECRET_LENGTH) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [header, body, signature] = parts as [string, string, string];

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${header}.${body}`)
  );

  const expected = base64UrlEncode(mac);
  if (!timingSafeEqual(signature, expected)) return false;

  try {
    const payload = JSON.parse(base64UrlDecodeToString(body)) as { exp?: number };
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return false;
  } catch {
    return false;
  }

  return true;
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: res.cloudinary.com",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; ")
  );
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    return addSecurityHeaders(NextResponse.next());
  }

  const secret = (process.env.ADMIN_AUTH_SECRET ?? "").trim();

  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    console.error(
      "[admin-middleware] ADMIN_AUTH_SECRET is missing or too short. All admin access denied."
    );
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  const hasValidAccess = accessToken
    ? await verifyAccessTokenEdge(accessToken, secret)
    : false;

  if (hasValidAccess) {
    return addSecurityHeaders(NextResponse.next());
  }

  if (refreshToken && refreshToken.startsWith(REFRESH_PREFIX)) {
    return addSecurityHeaders(NextResponse.next());
  }

  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};
