import { createHash } from "node:crypto";
import express from "express";
import type { Server } from "node:http";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { OpenRedTeam } from "../index.js";
import { SessionStore } from "../sessions.js";
import type { OrtConfig, ScopeDecision } from "../types.js";
import { loadScopeGuard } from "../safety.js";
import { attachRuntimeStore, runtimeEnv } from "../runtime.js";
import { metricsText, trackChatEnd, trackChatStart, trackHttp } from "./metrics.js";
import { oidcConfigured, oidcMiddleware } from "./oidc.js";
import { openDb } from "./db.js";
import { issueToken, verifyToken } from "./auth.js";
import type { AuthContext } from "./auth.js";

export interface DashboardOptions {
  port?: number;
  token?: string;
  auditLog?: string;
  sessions?: SessionStore;
  dbPath?: string;
}

interface AuditEntry {
  ts: string;
  sessionId: string;
  operator: string;
  decision: ScopeDecision;
  flaggedTargets: string[];
  matchedSkills: string[];
  promptSha256: string;
  responseChars: number;
  provider: string;
  model: string;
}

const MUTABLE_SETTINGS = [
  "ORT_SCOPE",
  "ORT_SCOPE_DOMAINS",
  "ORT_SCOPE_MODE",
  "ORT_OPERATOR",
  "ORT_MAX_CONTEXT",
  "ORT_SKILL_BUDGET",
  "ORT_RESERVE_TOKENS",
  "ORT_MAX_SKILLS",
  "ORT_INCLUDE_INDEX",
  "ORT_AUTO_LOAD",
] as const;

const AUTH_WHITELIST = ["/auth/login", "/auth/me", "/auth/change-password"];

function maskKey(value?: string): string {
  if (!value) return "";
  if (value.length <= 8) return "••••";
  return `${value.slice(0, 3)}••••${value.slice(-3)}`;
}

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf-8").digest("hex");
}

async function checkBackend(config: OrtConfig): Promise<string> {
  try {
    const res = await fetch(`${config.baseUrl}/models`, {
      headers: { Authorization: `Bearer ${config.apiKey ?? "none"}` },
      signal: AbortSignal.timeout(3000),
    });
    return res.ok ? "ok" : `http ${res.status}`;
  } catch {
    return "unreachable";
  }
}

export async function startDashboard(
  ort: OpenRedTeam,
  opts: DashboardOptions = {},
): Promise<Server> {
  await ort.init();

  const port = opts.port ?? Number(process.env.ORT_DASHBOARD_PORT ?? 8081);
  const token = opts.token ?? process.env.ORT_DASHBOARD_TOKEN ?? "";
  const auditLog = opts.auditLog ?? process.env.ORT_AUDIT_LOG ?? "";
  const auditRequired = process.env.ORT_AUDIT_REQUIRED === "1";
  const allowAnonymous = process.env.ORT_ALLOW_ANONYMOUS === "1";
  const metricsToken = process.env.ORT_METRICS_TOKEN ?? "";
  const localAuthEnabled = process.env.ORT_DISABLE_LOCAL_AUTH !== "1";

  const oidcOn = oidcConfigured();
  if (!oidcOn && !localAuthEnabled && !token && !allowAnonymous) {
    throw new Error(
      "Refusing to start unauthenticated: set ORT_DASHBOARD_TOKEN or ORT_OIDC_ISSUER, " +
        "or explicitly allow local lab access with ORT_ALLOW_ANONYMOUS=1",
    );
  }

  const db = localAuthEnabled ? openDb(opts?.dbPath ?? process.env.ORT_DB_PATH) : null;
  const runtimeStore = db
    ? {
        get: (key: string): string | undefined => {
          try {
            return db.getSetting(key);
          } catch {
            return undefined;
          }
        },
        set: (key: string, value: string): void => {
          db.setSetting(key, value);
        },
        keys: (): string[] => MUTABLE_SETTINGS as unknown as string[],
      }
    : null;
  attachRuntimeStore(runtimeStore);

  const guard = loadScopeGuard();
  if (!guard && runtimeEnv("ORT_SCOPE_MODE") !== "open") {
    throw new Error(
      "Refusing to start without an engagement scope: set ORT_SCOPE (and ORT_SCOPE_DOMAINS), " +
        "or explicitly allow a local lab with ORT_SCOPE_MODE=open",
    );
  }

  const sessions = opts.sessions ?? new SessionStore();

  const app = express();
  app.use(express.json({ limit: "1mb" }));

  app.use((req, _res, next) => {
    trackHttp(req.method, req.path);
    next();
  });

  const requireAuth: express.RequestHandler = (req, res, next) => {
    const bearer = (req.headers.authorization ?? "").startsWith("Bearer ")
      ? req.headers.authorization!.slice(7)
      : "";

    if (db && bearer) {
      const ctx = verifyToken(db, bearer);
      if (ctx) {
        res.locals.ortUser = ctx;
        next();
        return;
      }
    }
    if (token && bearer === token) {
      res.locals.ortUser = { username: "(static)", role: "admin", mustChangePassword: false } satisfies AuthContext;
      next();
      return;
    }
    if (!bearer && allowAnonymous) {
      res.locals.ortUser = { username: "(anonymous)", role: "operator", mustChangePassword: false } satisfies AuthContext;
      next();
      return;
    }
    res.status(401).json({ error: "unauthorized" });
  };

  const apiAuth: express.RequestHandler = oidcOn ? oidcMiddleware : requireAuth;
  const metricsAuth: express.RequestHandler = metricsToken ? staticTokenMiddleware(metricsToken) : apiAuth;

  app.use("/api", (req, res, next) => {
    if (req.path === "/auth/login") {
      next();
      return;
    }
    apiAuth(req, res, next);
  });
  app.use("/api", (req, res, next) => {
    if (AUTH_WHITELIST.includes(req.path)) {
      next();
      return;
    }
    const user = res.locals.ortUser as AuthContext | undefined;
    if (user?.mustChangePassword) {
      res.status(403).json({ error: "password change required" });
      return;
    }
    next();
  });
  app.use("/metrics", metricsAuth);

  const staticDir = join(dirname(fileURLToPath(import.meta.url)), "static");
  app.use(express.static(staticDir));

  const audit = async (entry: AuditEntry): Promise<void> => {
    if (!auditLog) return;
    try {
      await mkdir(dirname(auditLog), { recursive: true });
      await appendFile(auditLog, `${JSON.stringify(entry)}\n`, "utf-8");
    } catch (err) {
      if (auditRequired) {
        throw new Error(`audit write failed (ORT_AUDIT_REQUIRED=1): ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  };

  // ---------- local auth ----------
  app.post("/api/auth/login", (req, res) => {
    if (!db) {
      res.status(404).json({ error: "local auth disabled" });
      return;
    }
    const { username, password } = (req.body ?? {}) as { username?: unknown; password?: unknown };
    if (typeof username !== "string" || typeof password !== "string") {
      res.status(400).json({ error: "username and password required" });
      return;
    }
    if (!db.verifyPassword(username, password)) {
      res.status(401).json({ error: "invalid credentials" });
      return;
    }
    const user = db.getUser(username)!;
    const tokenValue = issueToken(db, {
      username: user.username,
      role: user.role as AuthContext["role"],
      mustChangePassword: user.must_change_password === 1,
    });
    res.json({
      token: tokenValue,
      username: user.username,
      role: user.role,
      mustChangePassword: user.must_change_password === 1,
    });
  });

  app.get("/api/auth/me", (_req, res) => {
    const user = res.locals.ortUser as AuthContext | undefined;
    res.json({ username: user?.username ?? "", role: user?.role ?? "operator", mustChangePassword: user?.mustChangePassword ?? false });
  });

  app.post("/api/auth/change-password", (req, res) => {
    if (!db) {
      res.status(404).json({ error: "local auth disabled" });
      return;
    }
    const user = res.locals.ortUser as AuthContext | undefined;
    if (!user || user.username.startsWith("(")) {
      res.status(403).json({ error: "local password change requires local user login" });
      return;
    }
    const { currentPassword, newPassword } = (req.body ?? {}) as { currentPassword?: unknown; newPassword?: unknown };
    if (typeof currentPassword !== "string" || typeof newPassword !== "string" || newPassword.length < 8) {
      res.status(400).json({ error: "newPassword must be at least 8 characters" });
      return;
    }
    if (!db.verifyPassword(user.username, currentPassword)) {
      res.status(401).json({ error: "current password is incorrect" });
      return;
    }
    db.setPassword(user.username, newPassword, false);
    res.json({ ok: true });
  });

  // ---------- runtime settings ----------
  app.get("/api/settings", (_req, res) => {
    const user = res.locals.ortUser as AuthContext | undefined;
    const values: Record<string, string> = {};
    for (const key of MUTABLE_SETTINGS) {
      values[key] = runtimeEnv(key) ?? "";
    }
    res.json({
      values,
      editable: user?.role === "admin",
      note: "Provider/model/API-key changes require a restart. DB values override environment variables; empty value falls back to env.",
    });
  });

  app.put("/api/settings", (req, res) => {
    const user = res.locals.ortUser as AuthContext | undefined;
    if (user?.role !== "admin") {
      res.status(403).json({ error: "admin role required" });
      return;
    }
    const { key, value } = (req.body ?? {}) as { key?: unknown; value?: unknown };
    if (typeof key !== "string" || typeof value !== "string") {
      res.status(400).json({ error: "key and value required" });
      return;
    }
    if (!(MUTABLE_SETTINGS as readonly string[]).includes(key)) {
      res.status(400).json({ error: `not a mutable setting (allowed: ${MUTABLE_SETTINGS.join(", ")})` });
      return;
    }
    if (!db) {
      res.status(404).json({ error: "local settings require the SQLite backend" });
      return;
    }
    db.setSetting(key, value);
    res.json({ ok: true, key, value });
  });

  // ---------- health / config ----------
  app.get("/metrics", (_req, res) => {
    res.setHeader("Content-Type", "text/plain; version=0.0.4");
    res.send(metricsText());
  });

  app.get("/api/health", async (_req, res) => {
    const backend = await checkBackend(ort.config);
    res.json({
      status: "ok",
      provider: ort.config.provider,
      model: ort.config.model,
      baseUrl: ort.config.baseUrl,
      backend,
      skills: ort.listSkills().length,
      categories: [...new Set(ort.listSkills().map((s) => s.frontmatter.category))].length,
      sessions: sessions.size(),
    });
  });

  app.get("/api/config", (_req, res) => {
    res.json({
      provider: ort.config.provider,
      model: ort.config.model,
      baseUrl: ort.config.baseUrl,
      apiKey: maskKey(ort.config.apiKey),
      skillsDir: ort.config.skillsDir,
      autoLoad: ort.config.autoLoad,
      maxSkills: ort.config.maxSkills,
      includeIndex: ort.config.includeIndex,
      auditLog: auditLog || null,
      auditRequired,
      dashboardTokenSet: Boolean(token),
      metricsTokenSet: Boolean(metricsToken),
      oidcEnabled: oidcOn,
      localAuthEnabled: Boolean(db),
      scope: guard?.scope ?? null,
      scopeMode: guard?.mode ?? "open",
      scopeDomains: guard?.domains ?? [],
      operator: guard?.operator ?? null,
      langfuseEnabled: Boolean(process.env.LANGFUSE_PUBLIC_KEY && process.env.LANGFUSE_SECRET_KEY),
      langfuseNotice: process.env.LANGFUSE_PUBLIC_KEY && process.env.LANGFUSE_SECRET_KEY
        ? "LangFuse is enabled: full prompt and response text is exported to the LangFuse service."
        : null,
    });
  });

  app.get("/api/skills", (_req, res) => {
    res.json(
      ort.listSkills().map((s) => ({
        name: s.frontmatter.name,
        category: s.frontmatter.category,
        description: s.frontmatter.description,
        triggers: s.frontmatter.triggers,
        modelNote: s.frontmatter.model_note,
        source: s.frontmatter.source,
        indexOnly: s.frontmatter.index_only ?? false,
      })),
    );
  });

  app.get("/api/skills/:name", (req, res) => {
    const skill = ort.getSkill(req.params.name);
    if (!skill) {
      res.status(404).json({ error: "skill not found" });
      return;
    }
    res.json({
      frontmatter: skill.frontmatter,
      body: skill.body,
    });
  });

  app.get("/api/session", (req, res) => {
    const sessionId = req.header("X-Ort-Session");
    if (!sessionId) {
      res.status(400).json({ error: "X-Ort-Session header required" });
      return;
    }
    const session = sessions.get(sessionId);
    if (!session) {
      res.status(404).json({ error: "session not found" });
      return;
    }
    if (oidcOn && session.operator !== res.locals.ortUser?.sub) {
      res.status(404).json({ error: "session not found" });
      return;
    }
    res.json({ sessionId: session.id, operator: session.operator, messages: session.history.length });
  });

  app.post("/api/reset", (req, res) => {
    const sessionId = req.header("X-Ort-Session");
    if (!sessionId) {
      res.status(400).json({ error: "X-Ort-Session header required" });
      return;
    }
    const session = sessions.get(sessionId);
    if (!session) {
      res.status(404).json({ error: "session not found" });
      return;
    }
    if (oidcOn && session.operator !== res.locals.ortUser?.sub) {
      res.status(404).json({ error: "session not found" });
      return;
    }
    sessions.reset(sessionId);
    res.json({ ok: true });
  });

  app.post("/api/chat", async (req, res) => {
    const { message, skills } = (req.body ?? {}) as { message?: unknown; skills?: unknown };
    if (typeof message !== "string" || message.trim() === "") {
      res.status(400).json({ error: "message is required" });
      return;
    }
    const forced = Array.isArray(skills) ? skills.filter((s): s is string => typeof s === "string") : undefined;

    const authUser = res.locals.ortUser as AuthContext | undefined;
    const operator = oidcOn
      ? res.locals.ortUser?.sub ?? ""
      : authUser && !authUser.username.startsWith("(")
        ? authUser.username
        : guard?.operator ?? process.env.ORT_OPERATOR ?? "dashboard";
    const sessionIdHeader = req.header("X-Ort-Session") ?? "";
    let session = sessionIdHeader ? sessions.get(sessionIdHeader) : undefined;
    if (sessionIdHeader && !session) {
      res.status(404).json({ error: "session not found" });
      return;
    }
    if (session && oidcOn && session.operator !== operator) {
      res.status(404).json({ error: "session not found" });
      return;
    }
    if (!session) session = sessions.create(operator);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const send = (event: string, data: unknown): void => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };
    send("session", { sessionId: session.id });

    trackChatStart();
    const started = Date.now();
    let failed = false;
    try {
      const result = await ort.chat(message, {
        skills: forced,
        session,
        onDelta: (d) => send("delta", { text: d }),
      });

      if (result.decision === "deny") {
        send("denied", {
          sessionId: session.id,
          flaggedTargets: result.flaggedTargets,
          content: result.content,
        });
      } else {
        send("done", {
          sessionId: session.id,
          matchedSkills: result.matchedSkills,
          promptTokens: result.promptTokens,
          maxContextTokens: result.maxContextTokens,
          reasoningTokens: result.reasoningTokens,
          droppedTurns: result.droppedTurns,
        });
      }

      try {
        await audit({
          ts: new Date().toISOString(),
          sessionId: session.id,
          operator,
          decision: result.decision,
          flaggedTargets: result.flaggedTargets,
          matchedSkills: result.matchedSkills,
          promptSha256: sha256(message),
          responseChars: result.content.length,
          provider: result.provider,
          model: result.model,
        });
      } catch (err) {
        failed = true;
        send("error", { message: err instanceof Error ? err.message : String(err) });
      }
    } catch (err) {
      failed = true;
      send("error", { message: err instanceof Error ? err.message : String(err) });
    } finally {
      trackChatEnd(Date.now() - started, 0, failed);
      res.end();
    }
  });

  app.get("/api/audit", async (_req, res) => {
    if (!auditLog) {
      res.json({ entries: [], note: "ORT_AUDIT_LOG not configured" });
      return;
    }
    try {
      const raw = await readFile(auditLog, "utf-8");
      const entries = raw
        .split("\n")
        .filter(Boolean)
        .map((l) => JSON.parse(l))
        .slice(-100)
        .reverse();
      res.json({ entries, file: auditLog });
    } catch {
      res.json({ entries: [], file: auditLog });
    }
  });

  return new Promise<Server>((resolve) => {
    const server = app.listen(port, () => {
      console.log(`[ort] dashboard listening on http://0.0.0.0:${port}`);
      if (oidcOn) console.log("[ort] auth: OIDC (Keycloak) enabled");
      else if (db) console.log("[ort] auth: local accounts (SQLite) — default admin/admin, forced password change on first login");
      else if (token) console.log("[ort] auth: Bearer token required (ORT_DASHBOARD_TOKEN)");
      else console.log("[ort] auth: anonymous allowed (ORT_ALLOW_ANONYMOUS=1)");
      console.log(`[ort] scope: ${guard?.scope ?? "(open lab mode)"}`);
      console.log(`[ort] provider=${ort.config.provider} model=${ort.config.model} skills=${ort.listSkills().length}`);
      resolve(server);
    });
    server.on("close", () => attachRuntimeStore(null));
  });
}

function staticTokenMiddleware(token: string): express.RequestHandler {
  return (req, res, next) => {
    const auth = req.headers.authorization ?? "";
    if (auth !== `Bearer ${token}`) {
      res.status(401).json({ error: "unauthorized" });
      return;
    }
    next();
  };
}
