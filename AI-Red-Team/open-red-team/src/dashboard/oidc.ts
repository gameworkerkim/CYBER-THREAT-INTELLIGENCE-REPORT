import { createPublicKey, createVerify } from "node:crypto";
import type { JsonWebKey } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

type Jwk = JsonWebKey & { kty: string; n: string; e: string };

interface OidcConfig {
  issuer: string;
  jwksUri: string;
  audience?: string;
}

let cachedConfig: OidcConfig | null = null;
let cachedJwks: Jwk[] = [];
let cacheTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000;

export function oidcConfigured(): boolean {
  return Boolean(process.env.ORT_OIDC_ISSUER);
}

async function discover(issuer: string): Promise<OidcConfig> {
  const res = await fetch(`${issuer.replace(/\/$/, "")}/.well-known/openid-configuration`, {
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`OIDC discovery failed: HTTP ${res.status}`);
  const doc = (await res.json()) as { jwks_uri: string };
  return { issuer, jwksUri: doc.jwks_uri, audience: process.env.ORT_OIDC_AUDIENCE };
}

async function jwks(config: OidcConfig): Promise<Jwk[]> {
  if (Date.now() - cacheTime < CACHE_TTL_MS && cachedJwks.length > 0) return cachedJwks;
  const res = await fetch(config.jwksUri, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`JWKS fetch failed: HTTP ${res.status}`);
  const doc = (await res.json()) as { keys: Jwk[] };
  cachedJwks = doc.keys;
  cacheTime = Date.now();
  return cachedJwks;
}

export function verifyJwt(token: string, config: OidcConfig, keys: Jwk[]): boolean {
  const [headerB64, payloadB64, sigB64] = token.split(".");
  if (!headerB64 || !payloadB64 || !sigB64) return false;

  let header: { kid?: string; alg?: string };
  let payload: { iss?: string; aud?: string | string[]; exp?: number };
  try {
    header = JSON.parse(Buffer.from(headerB64, "base64url").toString("utf-8"));
    payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));
  } catch {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) return false;
  if (payload.iss !== config.issuer) return false;
  if (config.audience) {
    const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!auds.includes(config.audience)) return false;
  }

  const jwk = keys.find((k) => k.kid === header.kid) ?? keys[0];
  if (!jwk || jwk.kty !== "RSA") return false;

  try {
    const key = createPublicKey({ key: jwk, format: "jwk" });
    const verify = createVerify("RSA-SHA256");
    verify.update(`${headerB64}.${payloadB64}`);
    return verify.verify(key, Buffer.from(sigB64, "base64url"));
  } catch {
    return false;
  }
}

export async function oidcMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const issuer = process.env.ORT_OIDC_ISSUER;
  if (!issuer) {
    next();
    return;
  }
  const auth = req.headers.authorization ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  try {
    const config = cachedConfig ?? (cachedConfig = await discover(issuer));
    const keys = await jwks(config);
    if (!token || !verifyJwt(token, config, keys)) {
      res.status(401).json({ error: "unauthorized (valid OIDC access token required)" });
      return;
    }
    const payload = jwtPayload(token);
    res.locals.ortUser = { sub: payload.sub ?? "" };
    next();
  } catch {
    res.status(502).json({ error: "OIDC verification unavailable" });
  }
}

function jwtPayload(token: string): { sub?: string } {
  const parts = token.split(".");
  if (parts.length !== 3) return {};
  try {
    return JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
  } catch {
    return {};
  }
}
