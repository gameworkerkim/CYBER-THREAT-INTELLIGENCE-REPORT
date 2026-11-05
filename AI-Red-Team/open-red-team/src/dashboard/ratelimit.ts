interface Bucket {
  count: number;
  firstAt: number;
  lockedUntil: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function checkLoginRateLimit(key: string, now = Date.now()): RateLimitResult {
  const maxAttempts = Number(process.env.ORT_LOGIN_MAX_ATTEMPTS ?? 5);
  const lockMs = Number(process.env.ORT_LOGIN_LOCK_MS ?? 300_000);

  const bucket = buckets.get(key);
  if (bucket) {
    if (bucket.lockedUntil > now) {
      return { allowed: false, retryAfterSeconds: Math.ceil((bucket.lockedUntil - now) / 1000) };
    }
    if (now - bucket.firstAt > lockMs) {
      buckets.delete(key);
    }
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

export function recordLoginFailure(key: string, now = Date.now()): RateLimitResult {
  const maxAttempts = Number(process.env.ORT_LOGIN_MAX_ATTEMPTS ?? 5);
  const lockMs = Number(process.env.ORT_LOGIN_LOCK_MS ?? 300_000);

  const bucket = buckets.get(key) ?? { count: 0, firstAt: now, lockedUntil: 0 };
  bucket.count += 1;
  if (bucket.count >= maxAttempts) {
    bucket.lockedUntil = now + lockMs;
  }
  buckets.set(key, bucket);
  return {
    allowed: bucket.lockedUntil <= now,
    retryAfterSeconds: Math.max(0, Math.ceil((bucket.lockedUntil - now) / 1000)),
  };
}

export function clearLoginFailures(key: string): void {
  buckets.delete(key);
}

export function clearAllLoginFailures(): void {
  buckets.clear();
}
