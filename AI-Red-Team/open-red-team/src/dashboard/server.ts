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
import { metricsText, trackChatEnd, trackChatStart, trackHttp } from "./metrics.js";
import { oidcConfigured, oidcMiddleware } from "./oidc.js";

export interface DashboardOptions {
  port?: number;
  token?: string;
  auditLog?: string;
  sessions?: SessionStore;
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
  const guard = loadScopeGuard();

  const oidcOn = oidcConfigured();
  if (!oidcOn && !token && !allowAnonymous) {
    throw new Error(
      "Refusing to start unauthenticated: set ORT_DASHBOARD_TOKEN or ORT_OIDC_ISSUER, " +
        "or explicitly allow local lab access with ORT_ALLOW_ANONYMOUS=1",
    );
  }
  if (!guard && process.env.ORT_SCOPE_MODE !== "open") {
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

  const apiAuth: express.RequestHandler =
    oidcOn ? oidcMiddleware : token ? staticTokenMiddleware(token) : (_req, _res, next) => next();

  const metricsAuth: express.RequestHandler = metricsToken
    ? staticTokenMiddleware(metricsToken)
    : apiAuth;

  app.use("/api", apiAuth);
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

    const operator = oidcOn ? res.locals.ortUser?.sub ?? "" : guard?.operator ?? process.env.ORT_OPERATOR ?? "dashboard";
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
      else if (token) console.log("[ort] auth: Bearer token required (ORT_DASHBOARD_TOKEN)");
      else console.log("[ort] auth: anonymous allowed (ORT_ALLOW_ANONYMOUS=1)");
      console.log(`[ort] scope: ${guard?.scope ?? "(open lab mode)"}`);
      console.log(`[ort] provider=${ort.config.provider} model=${ort.config.model} skills=${ort.listSkills().length}`);
      resolve(server);
    });
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
