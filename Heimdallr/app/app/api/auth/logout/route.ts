import { clearSessionCookieHeader } from "@/app/lib/session";

export async function POST() {
  const res = Response.json({ ok: true });
  res.headers.set("Set-Cookie", clearSessionCookieHeader());
  return res;
}
