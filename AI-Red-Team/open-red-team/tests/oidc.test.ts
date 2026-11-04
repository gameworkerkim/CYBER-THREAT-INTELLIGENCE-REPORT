import { generateKeyPairSync, createSign } from "node:crypto";
import type { KeyObject } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyJwt } from "../src/dashboard/oidc.js";

const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const other = generateKeyPairSync("rsa", { modulusLength: 2048 });

function b64url(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj)).toString("base64url");
}

function sign(payload: Record<string, unknown>, key: KeyObject = privateKey): string {
  const header = { alg: "RS256", typ: "JWT", kid: "test-key" };
  const data = `${b64url(header)}.${b64url(payload)}`;
  const sig = createSign("RSA-SHA256").update(data).sign(key, "base64url");
  return `${data}.${sig}`;
}

const config = { issuer: "https://keycloak/realms/ort", jwksUri: "https://keycloak/jwks" };
const keys = [{ kty: "RSA", n: (publicKey.export({ format: "jwk" }) as { n: string }).n, e: (publicKey.export({ format: "jwk" }) as { e: string }).e, kid: "test-key" }];

describe("verifyJwt", () => {
  const base = () => ({ iss: config.issuer, sub: "alice", exp: Math.floor(Date.now() / 1000) + 300, aud: "ort-dashboard" });

  it("accepts a valid token", () => {
    expect(verifyJwt(sign(base()), config, keys)).toBe(true);
  });

  it("rejects expired tokens", () => {
    expect(verifyJwt(sign({ ...base(), exp: Math.floor(Date.now() / 1000) - 10 }), config, keys)).toBe(false);
  });

  it("rejects wrong audience", () => {
    expect(verifyJwt(sign({ ...base(), aud: "other-client" }), { ...config, audience: "ort-dashboard" }, keys)).toBe(false);
  });

  it("rejects wrong issuer", () => {
    expect(verifyJwt(sign({ ...base(), iss: "https://evil/realms/x" }), config, keys)).toBe(false);
  });

  it("rejects tokens signed by another key", () => {
    expect(verifyJwt(sign(base(), other.privateKey), config, keys)).toBe(false);
  });

  it("rejects malformed tokens", () => {
    expect(verifyJwt("not.a.jwt", config, keys)).toBe(false);
  });
});
