import { db } from "@/app/db";
import { llmKeys } from "@/app/db/schema";
import { and, eq } from "drizzle-orm";
import { getSession } from "@/app/lib/session";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  await db
    .delete(llmKeys)
    .where(and(eq(llmKeys.id, id), eq(llmKeys.userId, session.sub)));

  return Response.json({ ok: true });
}
