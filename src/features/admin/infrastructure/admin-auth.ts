import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/shared/infrastructure/prisma";
import { verifyPassword } from "./password";

const COOKIE_NAME = "admin_session";
const TOKEN_TTL_SECONDS = 60 * 60 * 8;

type AdminTokenPayload = {
  sub: string;
  exp: number;
};

function getSecret() {
  const secret =
    process.env.ADMIN_AUTH_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.DATABASE_URL;

  if (!secret) {
    throw new Error("ADMIN_AUTH_SECRET or DATABASE_URL is required");
  }

  return secret;
}

function base64Url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function sign(input: string) {
  return base64Url(createHmac("sha256", getSecret()).update(input).digest());
}

function createToken(payload: AdminTokenPayload) {
  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64Url(JSON.stringify(payload));
  const signature = sign(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
}

function verifyToken(token: string): AdminTokenPayload | null {
  const [header, body, signature] = token.split(".");
  if (!header || !body || !signature) return null;

  const expected = sign(`${header}.${body}`);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  const payload = JSON.parse(
    Buffer.from(body.replaceAll("-", "+").replaceAll("_", "/"), "base64").toString(
      "utf8"
    )
  ) as AdminTokenPayload;

  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

export async function loginAdmin(identifier: string, password: string) {
  const user = await prisma.adminUser.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
      blocked: false,
      deletedAt: null,
    },
    include: { role: true },
  });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return false;
  }

  const token = createToken({
    sub: user.id,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TOKEN_TTL_SECONDS,
  });

  return true;
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  return prisma.adminUser.findFirst({
    where: {
      id: payload.sub,
      blocked: false,
      deletedAt: null,
    },
    include: {
      role: {
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      },
    },
  });
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

