/**
 * In-memory login rate limiter.
 *
 * Two independent buckets:
 *   - Per IP:         5 attempts / 10 min  (catch distributed credential stuffing)
 *   - Per identifier: 10 attempts / 10 min (catch single-user brute force from multiple IPs)
 *
 * Resets automatically when the window expires. Runs server-side only (Node.js).
 */

type Bucket = { count: number; resetAt: number };

const IP_LIMIT = 5;
const ID_LIMIT = 10;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

const byIp = new Map<string, Bucket>();
const byIdentifier = new Map<string, Bucket>();

function hit(map: Map<string, Bucket>, key: string, limit: number): boolean {
  const now = Date.now();
  const existing = map.get(key);

  if (!existing || existing.resetAt <= now) {
    map.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false; // not blocked
  }

  if (existing.count >= limit) return true; // blocked

  existing.count += 1;
  return false;
}

function clear(map: Map<string, Bucket>, key: string) {
  map.delete(key);
}

export function checkLoginRateLimit(ip: string, identifier: string): boolean {
  const blockedByIp = hit(byIp, ip, IP_LIMIT);
  const blockedById = hit(byIdentifier, identifier.toLowerCase(), ID_LIMIT);
  return blockedByIp || blockedById;
}

export function clearLoginRateLimit(ip: string, identifier: string) {
  clear(byIp, ip);
  clear(byIdentifier, identifier.toLowerCase());
}
