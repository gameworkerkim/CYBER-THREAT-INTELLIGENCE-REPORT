import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { openDb } from "../src/dashboard/db.js";
import { issueToken, verifyToken } from "../src/dashboard/auth.js";

describe("local auth tokens", () => {
  it("issues and verifies tokens", () => {
    const ort = openDb(":memory:");
    try {
      const token = issueToken(ort, { username: "admin", role: "admin", mustChangePassword: true });
      const ctx = verifyToken(ort, token);
      expect(ctx?.username).toBe("admin");
      expect(ctx?.role).toBe("admin");
      expect(ctx?.mustChangePassword).toBe(true);
    } finally {
      ort.close();
    }
  });

  it("rejects tampered tokens", () => {
    const ort = openDb(":memory:");
    try {
      const token = issueToken(ort, { username: "admin", role: "admin", mustChangePassword: true });
      const [body, sig] = token.split(".");
      expect(verifyToken(ort, `${body}.${sig}x`)).toBeNull();
      expect(verifyToken(ort, "garbage")).toBeNull();
    } finally {
      ort.close();
    }
  });

  it("reflects the password-change flag from the DB", () => {
    const ort = openDb(":memory:");
    try {
      const token = issueToken(ort, { username: "admin", role: "admin", mustChangePassword: true });
      expect(verifyToken(ort, token)?.mustChangePassword).toBe(true);
      ort.setPassword("admin", "new-password-123", false);
      expect(verifyToken(ort, token)?.mustChangePassword).toBe(false);
    } finally {
      ort.close();
    }
  });

  it("expires tokens", () => {
    process.env.ORT_AUTH_SECRET = "test-secret";
    try {
      const ort = openDb(":memory:");
      try {
        const body = Buffer.from(
          JSON.stringify({ username: "admin", role: "admin", exp: Math.floor(Date.now() / 1000) - 10 }),
        ).toString("base64url");
        const sig = createHmac("sha256", "test-secret").update(body).digest("base64url");
        expect(verifyToken(ort, `${body}.${sig}`)).toBeNull();
      } finally {
        ort.close();
      }
    } finally {
      delete process.env.ORT_AUTH_SECRET;
    }
  });
});
