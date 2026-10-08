import { db } from "@/app/db";
import { domains, users } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/app/lib/session";
import { isFreeEmailDomain, isValidDomain, normalizeDomain } from "@/app/lib/email";
import { readBody } from "@/app/lib/http";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const list = await db
    .select()
    .from(domains)
    .where(eq(domains.userId, session.sub));

  return Response.json({ domains: list });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await readBody<{ domain?: string }>(request);
  const domain = normalizeDomain(body?.domain ?? "");

  if (!isValidDomain(domain)) {
    return Response.json({ error: "유효한 도메인이 아닙니다." }, { status: 400 });
  }

  if (isFreeEmailDomain(domain)) {
    return Response.json(
      {
        error:
          "무료 이메일 도메인(gmail·naver·daum·kakao 등)은 테스트 대상으로 사용할 수 없습니다.",
      },
      { status: 400 },
    );
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.sub));
  if (!user) {
    return Response.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  if (user.emailDomain !== domain) {
    return Response.json(
      {
        error: `대상 도메인(${domain})에 소속된 이메일이 필요합니다. 현재 이메일 도메인: ${user.emailDomain}`,
      },
      { status: 403 },
    );
  }

  const [created] = await db
    .insert(domains)
    .values({ userId: session.sub, domain, status: "pending" })
    .returning();

  return Response.json({ domain: created });
}
