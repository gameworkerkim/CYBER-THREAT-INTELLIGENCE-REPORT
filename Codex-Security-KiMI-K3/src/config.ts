import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";

export interface ScanConfig {
  provider?: string;
  model?: string;
  output?: string;
  format?: string;
  severity?: string;
  concurrency?: number;
  maxCost?: number;
}

const CONFIG_PATH = join(homedir(), ".codex-open-security", "config.json");

export async function loadConfig(): Promise<ScanConfig> {
  try {
    const raw = await readFile(CONFIG_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) {
      return {
        provider: typeof parsed.provider === "string" ? parsed.provider : undefined,
        model: typeof parsed.model === "string" ? parsed.model : undefined,
        output: typeof parsed.output === "string" ? parsed.output : undefined,
        format: typeof parsed.format === "string" ? parsed.format : undefined,
        severity: typeof parsed.severity === "string" ? parsed.severity : undefined,
        concurrency: typeof parsed.concurrency === "number" ? parsed.concurrency : undefined,
        maxCost: typeof parsed.maxCost === "number" ? parsed.maxCost : undefined,
      };
    }
  } catch {
    /* config file not found or invalid — silently ignore */
  }
  return {};
}
