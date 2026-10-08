import { db } from "@/app/db";
import { llmKeys } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/app/lib/session";
import { decryptSecret, encryptSecret, maskSecret } from "@/app/lib/crypto";
import { readBody } from "@/app/lib/http";

interface KeyBody {
  apiKey?: string;
  provider?: string;
  model?: string | null;
  maxTokens?: number | null;
  baseUrl?: string | null;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const keys = await db.select().from(llmKeys).where(eq(llmKeys.userId, session.sub));

  const list = [];
  for (const k of keys) {
    const { iv, ciphertext } = JSON.parse(k.encryptedKey);
    const raw = await decryptSecret(iv, ciphertext);
    list.push({
      id: k.id,
      provider: k.provider,
      model: k.model,
      maxTokens: k.maxTokens,
      baseUrl: k.baseUrl,
      createdAt: k.createdAt,
      maskedKey: maskSecret(raw),
    });
  }

  return Response.json({ keys: list });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await readBody<KeyBody>(request);
  const apiKey = String(body?.apiKey ?? "").trim();
  const provider = String(body?.provider ?? "openai");
  const model = body?.model ? String(body.model) : null;
  const maxTokens = body?.maxTokens ? Number(body.maxTokens) : null;
  const baseUrl = body?.baseUrl ? String(body.baseUrl) : null;

  if (!apiKey) {
    return Response.json({ error: "API 키를 입력하세요." }, { status: 400 });
  }

  const { iv, ciphertext } = await encryptSecret(apiKey);

  const [created] = await db
    .insert(llmKeys)
    .values({
      userId: session.sub,
      provider,
      encryptedKey: JSON.stringify({ iv, ciphertext }),
      model,
      maxTokens,
      baseUrl,
    })
    .returning();

  return Response.json({
    key: {
      id: created.id,
      provider: created.provider,
      model: created.model,
      maxTokens: created.maxTokens,
      baseUrl: created.baseUrl,
      maskedKey: maskSecret(apiKey),
      createdAt: created.createdAt,
    },
  });
}
