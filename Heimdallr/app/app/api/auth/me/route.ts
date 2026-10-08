import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/app/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ user: null });

  const [user] = await db.select().from(users).where(eq(users.id, session.sub));
  if (!user) return Response.json({ user: null });

  return Response.json({
    user: { id: user.id, email: user.email, emailDomain: user.emailDomain },
  });
}
