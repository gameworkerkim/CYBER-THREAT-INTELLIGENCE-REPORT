import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/app/lib/password";
import { signSession } from "@/app/lib/jwt";
import { sessionCookieHeader } from "@/app/lib/session";
import { normalizeEmail } from "@/app/lib/email";
import { readBody } from "@/app/lib/http";

const WEEK = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  const body = await readBody<{ email?: string; password?: string }>(request);
  const email = normalizeEmail(body?.email ?? "");
  const password = body?.password ?? "";

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    return Response.json(
      { error: "이메일 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 },
    );
  }

  const ok = await verifyPassword(password, user.passwordSalt, user.passwordHash);
  if (!ok) {
    return Response.json(
      { error: "이메일 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 },
    );
  }

  const token = await signSession({ sub: user.id, email: user.email });
  const res = Response.json({
    id: user.id,
    email: user.email,
    emailDomain: user.emailDomain,
  });
  res.headers.set("Set-Cookie", sessionCookieHeader(token, WEEK));
  return res;
}
