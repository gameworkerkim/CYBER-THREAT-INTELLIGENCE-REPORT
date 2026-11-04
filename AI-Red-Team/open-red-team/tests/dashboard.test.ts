import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { BaseProvider } from "../src/providers/base.js";
import { OpenRedTeam } from "../src/index.js";
import { startDashboard } from "../src/dashboard/server.js";

class MockProvider extends BaseProvider {
  constructor() {
    super({ model: "mock", apiKey: "x", baseUrl: "http://mock" });
  }
  get name() {
    return "deepseek" as const;
  }
  override async chat(): Promise<{ content: string; reasoningLength: number }> {
    return { content: "pong", reasoningLength: 0 };
  }
}

const SAVED_ENV: Record<string, string | undefined> = {};
function setEnv(k: string, v: string | undefined) {
  if (v === undefined) delete process.env[k];
  else process.env[k] = v;
}
function clearEnv() {
  for (const k of [
    "ORT_DASHBOARD_TOKEN", "ORT_METRICS_TOKEN", "ORT_ALLOW_ANONYMOUS", "ORT_OIDC_ISSUER",
    "ORT_OIDC_AUDIENCE", "ORT_SCOPE", "ORT_SCOPE_DOMAINS", "ORT_SCOPE_MODE", "ORT_OPERATOR",
    "ORT_AUDIT_LOG", "ORT_AUDIT_REQUIRED", "LANGFUSE_PUBLIC_KEY", "LANGFUSE_SECRET_KEY",
    "ORT_DB_PATH", "ORT_DISABLE_LOCAL_AUTH", "ORT_AUTH_SECRET",
  ]) setEnv(k, undefined);
}

async function startTestServer(extra: Record<string, string> = {}, anonymous = true) {
  clearEnv();
  setEnv("ORT_DB_PATH", ":memory:");
  if (anonymous) setEnv("ORT_ALLOW_ANONYMOUS", "1");
  setEnv("ORT_SCOPE", "test engagement");
  setEnv("ORT_SCOPE_DOMAINS", "demo.example.com");
  for (const [k, v] of Object.entries(extra)) setEnv(k, v);
  const mock = new MockProvider();
  const ort = new OpenRedTeam({ provider: "deepseek", providerOverride: mock as never });
  await ort.init();
  const server = await startDashboard(ort, { port: 0, dbPath: ":memory:" });
  const port = (server.address() as { port: number }).port;
  return { server, port, base: `http://127.0.0.1:${port}` };
}

async function sseEvents(base: string, path: string, opts: { body?: unknown; headers?: Record<string, string> } = {}) {
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...opts.headers },
    body: JSON.stringify(opts.body ?? {}),
  });
  const text = await res.text();
  const events: Array<{ event: string; data: Record<string, unknown> }> = [];
  for (const block of text.split("\n\n")) {
    if (!block.trim()) continue;
    let event = "message";
    let data: Record<string, unknown> = {};
    for (const line of block.split("\n")) {
      if (line.startsWith("event:")) event = line.slice(6).trim();
      else if (line.startsWith("data:")) {
        try { data = JSON.parse(line.slice(5).trim()); } catch { data = {}; }
      }
    }
    events.push({ event, data });
  }
  return events;
}

describe("dashboard fail-closed startup", () => {
  it("refuses to start without authentication when local auth is disabled", async () => {
    clearEnv();
    setEnv("ORT_SCOPE", "x");
    setEnv("ORT_DISABLE_LOCAL_AUTH", "1");
    const ort = new OpenRedTeam({ provider: "deepseek" });
    await ort.init();
    await expect(startDashboard(ort, { port: 0 })).rejects.toThrow(/unauthenticated/);
  });

  it("refuses to start without an engagement scope", async () => {
    clearEnv();
    setEnv("ORT_ALLOW_ANONYMOUS", "1");
    const ort = new OpenRedTeam({ provider: "deepseek" });
    await ort.init();
    await expect(startDashboard(ort, { port: 0 })).rejects.toThrow(/engagement scope/);
  });
});

describe("dashboard HTTP", () => {
  let ctx: { server: ReturnType<typeof startDashboard> extends Promise<infer T> ? T : never; base: string };
  let tmp: string;

  beforeAll(async () => {
    tmp = await mkdtemp(join(tmpdir(), "ort-test-"));
    ctx = (await startTestServer()) as typeof ctx;
  });

  afterAll(async () => {
    await new Promise<void>((r) => ctx.server.close(() => r()));
    await rm(tmp, { recursive: true, force: true });
    clearEnv();
  });

  afterEach(() => {});

  it("enforces the bearer token when configured", async () => {
    const { server, base } = await startTestServer({ ORT_DASHBOARD_TOKEN: "secret" }, false);
    try {
      const noAuth = await fetch(`${base}/api/skills`);
      expect(noAuth.status).toBe(401);
      const withAuth = await fetch(`${base}/api/skills`, { headers: { Authorization: "Bearer secret" } });
      expect(withAuth.status).toBe(200);
    } finally {
      await new Promise<void>((r) => server.close(() => r()));
    }
  });

  it("logs in with admin/admin and forces a password change", async () => {
    const { server, base } = await startTestServer({}, false);
    try {
      const login = await fetch(`${base}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", password: "admin" }),
      });
      expect(login.status).toBe(200);
      const data = (await login.json()) as { token: string; mustChangePassword: boolean };
      expect(data.mustChangePassword).toBe(true);
      const auth = { Authorization: `Bearer ${data.token}` };

      const blocked = await fetch(`${base}/api/skills`, { headers: auth });
      expect(blocked.status).toBe(403);

      const wrongLogin = await fetch(`${base}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", password: "nope" }),
      });
      expect(wrongLogin.status).toBe(401);

      const change = await fetch(`${base}/api/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify({ currentPassword: "admin", newPassword: "new-password-123" }),
      });
      expect(change.status).toBe(200);

      const allowed = await fetch(`${base}/api/skills`, { headers: auth });
      expect(allowed.status).toBe(200);

      const relogin = await fetch(`${base}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", password: "admin" }),
      });
      expect(relogin.status).toBe(401);
    } finally {
      await new Promise<void>((r) => server.close(() => r()));
    }
  });

  it("updates runtime settings as admin and applies them to the scope guard", async () => {
    const { server, base } = await startTestServer({}, false);
    try {
      const login = await fetch(`${base}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", password: "admin" }),
      });
      const { token } = (await login.json()) as { token: string };
      const auth = { Authorization: `Bearer ${token}` };

      await fetch(`${base}/api/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify({ currentPassword: "admin", newPassword: "new-password-123" }),
      });

      const put = await fetch(`${base}/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify({ key: "ORT_SCOPE_DOMAINS", value: "other.example.com" }),
      });
      expect(put.status).toBe(200);

      const settings = (await (await fetch(`${base}/api/settings`, { headers: auth })).json()) as {
        values: Record<string, string>;
        editable: boolean;
      };
      expect(settings.editable).toBe(true);
      expect(settings.values["ORT_SCOPE_DOMAINS"]).toBe("other.example.com");

      const events = await sseEvents(base, "/api/chat", {
        headers: auth,
        body: { message: "scan https://demo.example.com" },
      });
      expect(events.some((e) => e.event === "denied")).toBe(true);
    } finally {
      await new Promise<void>((r) => server.close(() => r()));
    }
  });

  it("keeps conversations isolated per session", async () => {
    const first = await sseEvents(ctx.base, "/api/chat", { body: { message: "hello one" } });
    const second = await sseEvents(ctx.base, "/api/chat", { body: { message: "hello two" } });
    const id1 = first.find((e) => e.event === "session")?.data.sessionId as string;
    const id2 = second.find((e) => e.event === "session")?.data.sessionId as string;
    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1).not.toBe(id2);

    const s1 = await fetch(`${ctx.base}/api/session`, { headers: { "X-Ort-Session": id1 } });
    const s2 = await fetch(`${ctx.base}/api/session`, { headers: { "X-Ort-Session": id2 } });
    expect(((await s1.json()) as { messages: number }).messages).toBe(2);
    expect(((await s2.json()) as { messages: number }).messages).toBe(2);

    await fetch(`${ctx.base}/api/reset`, { method: "POST", headers: { "X-Ort-Session": id1 } });
    const s1After = (await (await fetch(`${ctx.base}/api/session`, { headers: { "X-Ort-Session": id1 } })).json()) as { messages: number };
    const s2After = (await (await fetch(`${ctx.base}/api/session`, { headers: { "X-Ort-Session": id2 } })).json()) as { messages: number };
    expect(s1After.messages).toBe(0);
    expect(s2After.messages).toBe(2);
  });

  it("emits a denied event for out-of-scope targets", async () => {
    const events = await sseEvents(ctx.base, "/api/chat", { body: { message: "scan https://evil.example.org" } });
    const denied = events.find((e) => e.event === "denied");
    expect(denied).toBeTruthy();
    expect((denied?.data.flaggedTargets as string[])).toContain("evil.example.org");
    expect(events.some((e) => e.event === "done")).toBe(false);
  });

  it("fails the chat when audit is required but unwritable", async () => {
    const auditPath = join(tmp, "audit.jsonl");
    await mkdir(auditPath); // the log path itself is a directory -> appendFile fails EISDIR
    const { server, base } = await startTestServer({
      ORT_AUDIT_REQUIRED: "1",
      ORT_AUDIT_LOG: auditPath,
    });
    try {
      const events = await sseEvents(base, "/api/chat", { body: { message: "hello" } });
      expect(events.some((e) => e.event === "error")).toBe(true);
    } finally {
      await new Promise<void>((r) => server.close(() => r()));
    }
  });
});
