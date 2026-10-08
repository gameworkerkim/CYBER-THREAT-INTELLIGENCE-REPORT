import { SignJWT, jwtVerify } from "jose";

export interface SessionPayload {
  sub: string;
  email: string;
}

const encoder = new TextEncoder();

function secret(): Uint8Array {
  return encoder.encode(
    process.env.JWT_SECRET ?? "heimdallr-dev-insecure-secret-change-me",
  );
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifySession(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    return { sub: payload.sub, email: (payload.email as string) ?? "" };
  } catch {
    return null;
  }
}
