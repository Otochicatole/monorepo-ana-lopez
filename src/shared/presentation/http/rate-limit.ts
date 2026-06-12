import { NextRequest, NextResponse } from "next/server";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function rateLimit(
  request: NextRequest,
  options: { keyPrefix: string; limit: number; windowMs: number }
): NextResponse | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  const key = `${options.keyPrefix}:${ip}`;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return null;
  }

  if (bucket.count >= options.limit) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((bucket.resetAt - now) / 1000).toString(),
        },
      }
    );
  }

  bucket.count += 1;
  return null;
}

