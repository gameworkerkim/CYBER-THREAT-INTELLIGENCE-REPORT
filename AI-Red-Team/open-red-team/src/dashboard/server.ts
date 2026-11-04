import express from "express";
import type { Server } from "node:http";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { OpenRedTeam } from "../index.js";
import type { OrtConfig } from "../types.js";

export interface DashboardOptions {
  port?: number;
  token?: string;
  auditLog?: string;
}

interface AuditEntry {
  ts: string;
  provider: string;
  model: string;
  matchedSkills: string[];
  promptChars: number;
  responseChars: number;
}

function maskKey(value?: string): string {
  if (!value) return "";
  if (value.length <= 8) return "••••";
  return `${value.slice(0, 3)}••••${value.slice(-3)}`;
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

  const app = express();
  app.use(express.json({ limit: "1mb" }));

  if (token) {
    app.use("/api", (req, res, next) => {
      const auth = req.headers.authorization ?? "";
      if (auth !== `Bearer ${token}`) {
        res.status(401).json({ error: "unauthorized" });
        return;
      }
      next();
    });
  }

  const staticDir = join(dirname(fileURLToPath(import.meta.url)), "static");
  app.use(express.static(staticDir));

  const audit = async (entry: AuditEntry): Promise<void> => {
    if (!auditLog) return;
    try {
      await mkdir(dirname(auditLog), { recursive: true });
      await appendFile(auditLog, `${JSON.stringify(entry)}\n`, "utf-8");
    } catch {
      /* audit failure must not break the request */
    }
  };

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
      dashboardTokenSet: Boolean(token),
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

  app.post("/api/reset", (_req, res) => {
    ort.reset();
    res.json({ ok: true });
  });

  app.post("/api/chat", async (req, res) => {
    const { message, skills } = (req.body ?? {}) as { message?: unknown; skills?: unknown };
    if (typeof message !== "string" || message.trim() === "") {
      res.status(400).json({ error: "message is required" });
      return;
    }
    const forced = Array.isArray(skills) ? skills.filter((s): s is string => typeof s === "string") : undefined;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const send = (event: string, data: unknown): void => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    try {
      const result = await ort.chat(message, {
        skills: forced,
        onDelta: (d) => send("delta", { text: d }),
      });
      send("done", { matchedSkills: result.matchedSkills });
      await audit({
        ts: new Date().toISOString(),
        provider: result.provider,
        model: result.model,
        matchedSkills: result.matchedSkills,
        promptChars: message.length,
        responseChars: result.content.length,
      });
    } catch (err) {
      send("error", { message: err instanceof Error ? err.message : String(err) });
    } finally {
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
      if (token) console.log("[ort] auth: Bearer token required (ORT_DASHBOARD_TOKEN)");
      else console.warn("[ort] WARNING: no ORT_DASHBOARD_TOKEN set — API is unauthenticated");
      console.log(`[ort] provider=${ort.config.provider} model=${ort.config.model} skills=${ort.listSkills().length}`);
      resolve(server);
    });
  });
}
