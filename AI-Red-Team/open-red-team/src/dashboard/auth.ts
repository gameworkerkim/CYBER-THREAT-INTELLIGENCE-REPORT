import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { OrtDb } from "./db.js";

export interface AuthContext {
  username: string;
  role: "admin" | "operator";
  mustChangePassword: boolean;
}

interface TokenPayload {
  username: string;
  role: "admin" | "operator";
  exp: number;
}

const TOKEN_TTL_SECONDS = 12 * 60 * 60;

let cachedSecret: string | null = null;

function signingSecret(db: OrtDb): string {
  const env = process.env.ORT_AUTH_SECRET?.trim();
  if (env) return env;
  if (cachedSecret) return cachedSecret;
  const persisted = db.getSetting("auth_secret");
  if (persisted) {
    cachedSecret = persisted;
    return cachedSecret;
  }
  const generated = randomBytes(32).toString("hex");
  db.setSetting("auth_secret", generated);
  cachedSecret = generated;
  return cachedSecret;
}

function b64url(input: string): string {
  return Buffer.from(input, "utf-8").toString("base64url");
}

function sign(payload: TokenPayload, secret: string): string {
  const body = b64url(JSON.stringify(payload));
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function issueToken(db: OrtDb, ctx: AuthContext): string {
  const secret = signingSecret(db);
  return sign(
    { username: ctx.username, role: ctx.role, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS },
    secret,
  );
}

export function verifyToken(db: OrtDb, token: string): AuthContext | null {
  const secret = signingSecret(db);
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret).update(body).digest();
  const provided = Buffer.from(sig, "base64url");
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return null;

  let payload: TokenPayload;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8")) as TokenPayload;
  } catch {
    return null;
  }
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;

  const user = db.getUser(payload.username);
  if (!user || user.role !== payload.role) return null;
  return { username: user.username, role: user.role, mustChangePassword: user.must_change_password === 1 };
}
