import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { existsSync } from "node:fs";
import puppeteer from "puppeteer-core";
import type { Page } from "puppeteer-core";
import { OpenRedTeam } from "../src/index.js";
import { startDashboard } from "../src/dashboard/server.js";
import { openDb } from "../src/dashboard/db.js";
import type { Server } from "node:http";

const OUT = join(process.cwd(), "assets", "screenshots");

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter((p): p is string => typeof p === "string");

const DEMO_AUDIT = `{"ts":"2026-11-04T09:12:03.000Z","event":"chat","sessionId":"s_demo1","operator":"kim.operator","decision":"allow","flaggedTargets":[],"matchedSkills":["offensive-sqli","offensive-waf-bypass"],"promptSha256":"8f14e45fceea167a5a36dedd4bea2543","responseChars":1824,"provider":"openweight","model":"qwen2.5:32b"}
{"ts":"2026-11-04T09:31:47.000Z","event":"chat","sessionId":"s_demo1","operator":"kim.operator","decision":"allow","flaggedTargets":[],"matchedSkills":["offensive-ai-security"],"promptSha256":"0b918943df0962bc7a1824c0555a3893","responseChars":1102,"provider":"openweight","model":"qwen2.5:32b"}
{"ts":"2026-11-04T10:05:22.000Z","event":"chat","sessionId":"s_demo2","operator":"park.analyst","decision":"allow","flaggedTargets":[],"matchedSkills":["offensive-cloud"],"promptSha256":"4c90af51f299efeb1d0b58bcfd2e5c1a","responseChars":2210,"provider":"glm","model":"glm-4-plus"}
{"ts":"2026-11-04T10:48:09.000Z","event":"chat","sessionId":"s_demo2","operator":"park.analyst","decision":"deny","flaggedTargets":["evil.example.org"],"matchedSkills":[],"promptSha256":"9d989e8d27dc9e0ec3389fc4af142c33","responseChars":218,"provider":"openweight","model":"qwen2.5:32b"}
{"ts":"2026-11-04T11:02:41.000Z","event":"auth","action":"login","username":"admin","outcome":"success","ip":"127.0.0.1"}
`;

async function listen(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
}

async function shot(page: Page, name: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: join(OUT, name), type: "png" });
  console.log(`captured ${name}`);
}

async function main(): Promise<void> {
  const chromePath = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!chromePath) throw new Error("Chrome not found — set CHROME_PATH");

  await mkdir(OUT, { recursive: true });
  const tmp = await mkdtemp(join(tmpdir(), "ort-shots-"));

  // ---- anonymous demo server (chat/skills/audit/settings/config) ----
  const auditPath = join(tmp, "audit.jsonl");
  await writeFile(auditPath, DEMO_AUDIT, "utf-8");
  const anonEnv = { ORT_ALLOW_ANONYMOUS: "1", ORT_SCOPE_MODE: "open", ORT_AUDIT_LOG: auditPath };
  Object.assign(process.env, anonEnv);
  const anonOrt = new OpenRedTeam({ provider: "openweight", model: "qwen2.5:32b" });
  await anonOrt.init();
  const anonServer = await startDashboard(anonOrt, { port: 0 });
  const anonPort = (anonServer.address() as { port: number }).port;

  // ---- auth server (login + settings with users) ----
  const dbPath = join(tmp, "auth.db");
  const seedDb = openDb(dbPath);
  seedDb.createUser("operator1", "operator-pass-123", "operator", false);
  seedDb.close();
  Object.assign(process.env, {
    ORT_ALLOW_ANONYMOUS: undefined,
    ORT_SCOPE_MODE: "open",
    ORT_DB_PATH: dbPath,
  });
  const authOrt = new OpenRedTeam({ provider: "openweight", model: "qwen2.5:32b" });
  await authOrt.init();
  const authServer = await startDashboard(authOrt, { port: 0, dbPath });
  const authPort = (authServer.address() as { port: number }).port;

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
    defaultViewport: { width: 1440, height: 900 },
  });

  try {
    const anon = await browser.newPage();
    await anon.goto(`http://127.0.0.1:${anonPort}/#demo`, { waitUntil: "networkidle0" });
    await shot(anon, "dashboard-chat.png");
    await anon.goto(`http://127.0.0.1:${anonPort}/#skills`, { waitUntil: "networkidle0" });
    await shot(anon, "dashboard-skills.png");
    await anon.goto(`http://127.0.0.1:${anonPort}/#audit`, { waitUntil: "networkidle0" });
    await shot(anon, "dashboard-audit.png");
    await anon.goto(`http://127.0.0.1:${anonPort}/#config`, { waitUntil: "networkidle0" });
    await shot(anon, "dashboard-config.png");

    // login screen (before authentication)
    const auth = await browser.newPage();
    await auth.goto(`http://127.0.0.1:${authPort}/`, { waitUntil: "networkidle0" });
    await auth.waitForSelector("#login-overlay:not(.hidden)", { timeout: 10000 });
    await shot(auth, "dashboard-login.png");

    // sign in as admin/admin → forced password change → settings tab
    await auth.type("#login-username", "admin");
    await auth.type("#login-password", "admin");
    await auth.click("#btn-login");
    await auth.waitForSelector("#pw-modal:not(.hidden)", { timeout: 10000 });
    await auth.type("#pwm-new", "new-password-123");
    await auth.click("#btn-pwm-save");
    await auth.waitForSelector("#pw-modal.hidden", { timeout: 10000 });

    await auth.goto(`http://127.0.0.1:${authPort}/#settings`, { waitUntil: "networkidle0" });
    await auth.waitForSelector("#users-table tbody tr", { timeout: 10000 });
    await shot(auth, "dashboard-settings.png");
  } finally {
    await browser.close();
    await new Promise<void>((r) => anonServer.close(() => r()));
    await new Promise<void>((r) => authServer.close(() => r()));
    await rm(tmp, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
