import { describe, expect, it } from "vitest";
import { checkLoginRateLimit, clearAllLoginFailures, recordLoginFailure } from "../src/dashboard/ratelimit.js";

describe("login rate limiter", () => {
  it("locks after N failures and resets on success", () => {
    clearAllLoginFailures();
    const key = "127.0.0.1:admin";
    const now = Date.now();
    for (let i = 0; i < 4; i++) {
      expect(recordLoginFailure(key, now).allowed).toBe(true);
    }
    const locked = recordLoginFailure(key, now);
    expect(locked.allowed).toBe(false);
    expect(checkLoginRateLimit(key, now).allowed).toBe(false);
    expect(locked.retryAfterSeconds).toBeGreaterThan(0);

    const expired = checkLoginRateLimit(key, now + 300_000 + 1);
    expect(expired.allowed).toBe(true);
  });

  it("tracks failures per key", () => {
    clearAllLoginFailures();
    const now = Date.now();
    recordLoginFailure("a:b", now);
    expect(checkLoginRateLimit("c:d", now).allowed).toBe(true);
  });
});
