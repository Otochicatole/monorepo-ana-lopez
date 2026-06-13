import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/shared/infrastructure/prisma";
import { verifyPassword } from "./password";
import { checkLoginRateLimit, clearLoginRateLimit } from "./login-rate-limit";

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCESS_COOKIE = "admin_access";
const REFRESH_COOKIE = "admin_refresh";

/** Prefix embedded in every raw refresh token to allow basic format validation */
const REFRESH_PREFIX = "rt_";

/** Access token lives 15 minutes — short, rotates silently via refresh */
const ACCESS_TTL_SECONDS = 60 * 15;

/** Refresh token lives 7 days — stored hashed in Session table */
const REFRESH_TTL_SECONDS = 60 * 60 * 24 * 7;

// ─── Secret ──────────────────────────────────────────────────────────────────

function getAccessSecret(): string {
  const secret = process.env.ADMIN_AUTH_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_AUTH_SECRET must be set and at least 32 characters long"
    );
  }
  return secret;
}

// ─── Crypto helpers ───────────────────────────────────────────────────────────

function base64Url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function sign(input: string, secret: string): string {
  return base64Url(createHmac("sha256", secret).update(input).digest());
}

/** HMAC hash of an opaque token for safe DB storage */
function hashToken(token: string): string {
  return createHmac("sha256", getAccessSecret()).update(token).digest("hex");
}

function generateRefreshToken(): string {
  return REFRESH_PREFIX + randomBytes(48).toString("base64url");
}

// ─── JWT (access token) ───────────────────────────────────────────────────────

type AccessPayload = { sub: string; sid: string; exp: number };

function createAccessToken(payload: AccessPayload): string {
  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64Url(JSON.stringify(payload));
  const signature = sign(`${header}.${body}`, getAccessSecret());
  return `${header}.${body}.${signature}`;
}

function verifyAccessToken(token: string): AccessPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts as [string, string, string];

  const expected = sign(`${header}.${body}`, getAccessSecret());
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null;

  let payload: AccessPayload;
  try {
    payload = JSON.parse(
      Buffer.from(body.replaceAll("-", "+").replaceAll("_", "/"), "base64").toString("utf8")
    ) as AccessPayload;
  } catch {
    return null;
  }

  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "strict" as const, // upgraded from lax — admin panel doesn't need cross-site
    secure: process.env.NODE_ENV === "production",
    path: "/admin",             // scope cookies to /admin only
    maxAge,
  };
}

async function getRequestMeta() {
  const h = await headers();
  return {
    userAgent: h.get("user-agent") ?? undefined,
    ipAddress:
      (h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        h.get("x-real-ip") ||
        undefined) ?? undefined,
  };
}

// ─── Audit logging for auth events ───────────────────────────────────────────

async function auditAuth(
  action: "login.success" | "login.failed" | "logout" | "refresh.reuse",
  meta: { ip?: string; userAgent?: string; userId?: string; identifier?: string }
) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: meta.userId ?? null,
        action,
        resource: "auth",
        metadata: {
          ip: meta.ip ?? null,
          userAgent: meta.userAgent ?? null,
          ...(meta.identifier ? { identifier: meta.identifier } : {}),
        },
      },
    });
  } catch {
    // Audit must never break auth flow
  }
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginAdmin(identifier: string, password: string): Promise<boolean> {
  const meta = await getRequestMeta();
  const ip = meta.ipAddress ?? "unknown";

  // Rate limit check
  if (checkLoginRateLimit(ip, identifier)) {
    return false;
  }

  const user = await prisma.adminUser.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
      blocked: false,
      deletedAt: null,
    },
    include: { role: true },
  });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    await auditAuth("login.failed", { ip, userAgent: meta.userAgent, identifier });
    return false;
  }

  // Login successful — clear rate limit bucket for this user/IP
  clearLoginRateLimit(ip, identifier);

  // Revoke all existing sessions for this user (single-session policy)
  await prisma.session.updateMany({
    where: { userId: user.id, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  const rawRefresh = generateRefreshToken();
  const refreshHash = hashToken(rawRefresh);

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      refreshTokenHash: refreshHash,
      csrfTokenHash: hashToken(randomBytes(32).toString("base64url")),
      userAgent: meta.userAgent,
      ipAddress: ip,
      expiresAt: new Date(Date.now() + REFRESH_TTL_SECONDS * 1000),
    },
  });

  const now = Math.floor(Date.now() / 1000);
  const accessToken = createAccessToken({
    sub: user.id,
    sid: session.id,
    exp: now + ACCESS_TTL_SECONDS,
  });

  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, accessToken, cookieOptions(ACCESS_TTL_SECONDS));
  cookieStore.set(REFRESH_COOKIE, rawRefresh, cookieOptions(REFRESH_TTL_SECONDS));

  await auditAuth("login.success", { ip, userAgent: meta.userAgent, userId: user.id });

  return true;
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const rawRefresh = cookieStore.get(REFRESH_COOKIE)?.value;
  const meta = await getRequestMeta();

  if (rawRefresh) {
    const refreshHash = hashToken(rawRefresh);
    const session = await prisma.session.findUnique({
      where: { refreshTokenHash: refreshHash },
    }).catch(() => null);

    if (session) {
      await prisma.session.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      }).catch(() => {});
      await auditAuth("logout", { ip: meta.ipAddress, userId: session.userId });
    }
  }

  cookieStore.delete({ name: ACCESS_COOKIE, path: "/admin" });
  cookieStore.delete({ name: REFRESH_COOKIE, path: "/admin" });
}

// ─── Refresh token rotation ───────────────────────────────────────────────────

/**
 * Rotates refresh + access tokens in one atomic operation.
 * If the refresh token has already been used (reuse detection), revokes all
 * sessions for that user to contain a possible token theft.
 */
export async function refreshAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const rawRefresh = cookieStore.get(REFRESH_COOKIE)?.value;
  if (!rawRefresh) return null;

  // Basic format guard — rejects any cookie that wasn't issued by us
  if (!rawRefresh.startsWith(REFRESH_PREFIX)) {
    cookieStore.delete({ name: REFRESH_COOKIE, path: "/admin" });
    return null;
  }

  const refreshHash = hashToken(rawRefresh);
  const session = await prisma.session.findUnique({
    where: { refreshTokenHash: refreshHash },
    include: { user: { include: { role: true } } },
  });

  // Session not found: possible reuse of a rotated (already replaced) token
  if (!session) {
    cookieStore.delete({ name: ACCESS_COOKIE, path: "/admin" });
    cookieStore.delete({ name: REFRESH_COOKIE, path: "/admin" });
    return null;
  }

  if (session.revokedAt) {
    // Token was already revoked — potential theft; revoke all sessions for this user
    await prisma.session.updateMany({
      where: { userId: session.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await auditAuth("refresh.reuse", {
      userId: session.userId,
      ip: (await getRequestMeta()).ipAddress,
    });
    cookieStore.delete({ name: ACCESS_COOKIE, path: "/admin" });
    cookieStore.delete({ name: REFRESH_COOKIE, path: "/admin" });
    return null;
  }

  if (
    session.expiresAt < new Date() ||
    session.user.blocked ||
    session.user.deletedAt
  ) {
    cookieStore.delete({ name: ACCESS_COOKIE, path: "/admin" });
    cookieStore.delete({ name: REFRESH_COOKIE, path: "/admin" });
    return null;
  }

  // Rotate: revoke old session, create new one with a fresh refresh token
  const newRawRefresh = generateRefreshToken();
  const newRefreshHash = hashToken(newRawRefresh);
  const meta = await getRequestMeta();

  await prisma.$transaction([
    prisma.session.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    }),
    prisma.session.create({
      data: {
        userId: session.userId,
        refreshTokenHash: newRefreshHash,
        csrfTokenHash: hashToken(randomBytes(32).toString("base64url")),
        userAgent: meta.userAgent,
        ipAddress: meta.ipAddress,
        expiresAt: new Date(Date.now() + REFRESH_TTL_SECONDS * 1000),
      },
    }),
  ]);

  // Fetch the new session id
  const newSession = await prisma.session.findUnique({
    where: { refreshTokenHash: newRefreshHash },
  });
  if (!newSession) return null;

  const now = Math.floor(Date.now() / 1000);
  const newAccessToken = createAccessToken({
    sub: session.userId,
    sid: newSession.id,
    exp: now + ACCESS_TTL_SECONDS,
  });

  cookieStore.set(ACCESS_COOKIE, newAccessToken, cookieOptions(ACCESS_TTL_SECONDS));
  cookieStore.set(REFRESH_COOKIE, newRawRefresh, cookieOptions(REFRESH_TTL_SECONDS));

  return newAccessToken;
}

// ─── Session resolution ───────────────────────────────────────────────────────

async function resolveAdminFromAccessToken(token: string) {
  const payload = verifyAccessToken(token);
  if (!payload) return null;

  const session = await prisma.session.findFirst({
    where: {
      id: payload.sid,
      userId: payload.sub,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
  });
  if (!session) return null;

  return prisma.adminUser.findFirst({
    where: { id: payload.sub, blocked: false, deletedAt: null },
    include: {
      role: {
        include: { permissions: { include: { permission: true } } },
      },
    },
  });
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;

  if (accessToken) {
    const admin = await resolveAdminFromAccessToken(accessToken);
    if (admin) return admin;
  }

  // Access token missing or expired — try silent refresh (rotates tokens)
  const newAccessToken = await refreshAccessToken();
  if (!newAccessToken) return null;

  return resolveAdminFromAccessToken(newAccessToken);
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

// ─── Edge helper (middleware) ─────────────────────────────────────────────────

/**
 * Verifies access token signature + expiry without a DB call.
 * Used by the middleware for a fast edge-side check.
 */
export function verifyAccessTokenEdge(
  token: string,
  secret: string
): boolean {
  if (!secret || secret.length < 32) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [header, body, signature] = parts as [string, string, string];

  const { createHmac: hmac } = require("crypto") as typeof import("crypto");
  const expected = Buffer.from(hmac("sha256", secret).update(`${header}.${body}`).digest())
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;

  let diff = 0;
  for (let i = 0; i < sigBuf.length; i++) diff |= (sigBuf[i] ?? 0) ^ (expBuf[i] ?? 0);
  if (diff !== 0) return false;

  try {
    const payload = JSON.parse(
      Buffer.from(body.replaceAll("-", "+").replaceAll("_", "/"), "base64").toString("utf8")
    ) as { exp?: number };
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return false;
  } catch {
    return false;
  }

  return true;
}
