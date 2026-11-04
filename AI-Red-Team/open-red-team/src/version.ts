import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

let cached: string | null = null;

export function getVersion(): string {
  if (cached !== null) return cached;
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 6; i++) {
    const candidate = join(dir, "package.json");
    if (existsSync(candidate)) {
      cached = (JSON.parse(readFileSync(candidate, "utf-8")) as { version: string }).version;
      return cached;
    }
    dir = join(dir, "..");
  }
  return "0.0.0";
}
