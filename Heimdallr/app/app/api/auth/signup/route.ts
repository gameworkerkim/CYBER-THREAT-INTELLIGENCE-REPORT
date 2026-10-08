import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { hashPassword } from "@/app/lib/password";
import { signSession } from "@/app/lib/jwt";
import { sessionCookieHeader } from "@/app/lib/session";
import { emailDomain, normalizeEmail } from "@/app/lib/email";
import { readBody } from "@/app/lib/http";

const WEEK = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  const body = await readBody<{ email?: string; password?: string }>(request);
  const email = normalizeEmail(body?.email ?? "");
  const password = body?.password ?? "";

  if (!email.includes("@")) {
    return Response.json({ error: "유효한 이메일이 아닙니다." }, { status: 400 });
  }
  if (password.length < 8) {
    return Response.json(
      { error: "비밀번호는 8자 이상이어야 합니다." },
      { status: 400 },
    );
  }

  const domain = emailDomain(email);
  const { hash, salt } = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values({
      email,
      emailDomain: domain,
      passwordHash: hash,
      passwordSalt: salt,
    })
    .onConflictDoNothing()
    .returning();

  if (!user) {
    return Response.json({ error: "이미 가입된 이메일입니다." }, { status: 409 });
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
