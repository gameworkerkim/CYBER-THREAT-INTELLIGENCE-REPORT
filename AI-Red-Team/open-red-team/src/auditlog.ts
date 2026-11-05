import { appendFile, mkdir, rename, stat } from "node:fs/promises";
import { dirname } from "node:path";

export interface AuditRecord {
  ts: string;
  event: "chat" | "auth";
  [key: string]: unknown;
}

export async function appendAudit(path: string | undefined, entry: AuditRecord): Promise<void> {
  if (!path) return;
  try {
    await mkdir(dirname(path), { recursive: true });
    const maxBytes = Number(process.env.ORT_AUDIT_MAX_BYTES ?? 10_485_760);
    const info = await stat(path).catch(() => null);
    if (info && info.size >= maxBytes) {
      await rename(path, `${path}.1`).catch(() => {});
    }
    await appendFile(path, `${JSON.stringify(entry)}\n`, "utf-8");
  } catch (err) {
    throw err;
  }
}
