import { db } from "@/app/db";
import { domains, verificationTokens } from "@/app/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { getSession } from "@/app/lib/session";
import { randomHex } from "@/app/lib/hex";

const TOKEN_TTL_MS = 60 * 60 * 1000;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const [domain] = await db
    .select()
    .from(domains)
    .where(and(eq(domains.id, id), eq(domains.userId, session.sub)));

  if (!domain) {
    return Response.json({ error: "도메인을 찾을 수 없습니다." }, { status: 404 });
  }

  await db
    .update(verificationTokens)
    .set({ usedAt: new Date() })
    .where(and(eq(verificationTokens.domainId, domain.id), isNull(verificationTokens.usedAt)));

  const token = `heimdallr-${randomHex(32)}`;
  const path = `/.well-known/heimdallr/${token}`;

  await db.insert(verificationTokens).values({
    domainId: domain.id,
    token,
    expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
  });

  return Response.json({
    token,
    path,
    url: `https://${domain.domain}${path}`,
    instructions:
      "아래 토큰을 도메인 서브 디렉터리에 배치하세요. 파일명과 내용을 모두 토큰 값으로 설정합니다.",
    expiresInMinutes: 60,
  });
}
