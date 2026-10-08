import { db } from "@/app/db";
import { domains, verificationTokens } from "@/app/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { getSession } from "@/app/lib/session";

const VERIFY_WINDOW_MS = 24 * 60 * 60 * 1000;

export async function POST(
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

  const tokens = await db
    .select()
    .from(verificationTokens)
    .where(
      and(
        eq(verificationTokens.domainId, domain.id),
        isNull(verificationTokens.usedAt),
      ),
    );

  const active = tokens.find((t) => t.expiresAt.getTime() > Date.now());
  if (!active) {
    return Response.json(
      { error: "유효한 토큰이 없습니다. 토큰을 다시 발급하세요." },
      { status: 400 },
    );
  }

  const url = `https://${domain.domain}/.well-known/heimdallr/${active.token}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  let verified = false;
  try {
    const res = await fetch(url, { signal: controller.signal, redirect: "follow" });
    const body = await res.text();
    verified = res.ok && body.includes(active.token);
  } catch {
    verified = false;
  } finally {
    clearTimeout(timeout);
  }

  if (!verified) {
    return Response.json(
      {
        error: `검증 실패: ${url} 에 토큰이 확인되지 않았습니다.`,
      },
      { status: 400 },
    );
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + VERIFY_WINDOW_MS);

  await db
    .update(verificationTokens)
    .set({ usedAt: now })
    .where(eq(verificationTokens.id, active.id));

  const [updated] = await db
    .update(domains)
    .set({ status: "verified", verifiedAt: now, expiresAt })
    .where(eq(domains.id, domain.id))
    .returning();

  return Response.json({
    domain: updated,
    authorization: {
      scope: domain.domain,
      validUntil: expiresAt,
      windowHours: 24,
    },
  });
}
