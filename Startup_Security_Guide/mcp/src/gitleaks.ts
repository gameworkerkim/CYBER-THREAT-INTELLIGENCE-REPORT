import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";
import { maskObjectDeep } from "./mask.js";

export interface GitleaksScanInput {
  path?: string;
  maskSecrets?: boolean;
  maxFindings?: number;
}

async function which(cmd: string): Promise<string | null> {
  return new Promise((resolvePath) => {
    const child = spawn(process.platform === "win32" ? "where" : "which", [cmd]);
    let out = "";
    child.stdout.on("data", (d: Buffer) => {
      out += d.toString();
    });
    child.on("close", (code) => {
      resolvePath(code === 0 ? out.trim().split("\n")[0] : null);
    });
    child.on("error", () => resolvePath(null));
  });
}

function run(cmd: string, args: string[], cwd: string): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolveResult) => {
    const child = spawn(cmd, args, { cwd });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d: Buffer) => {
      stdout += d.toString();
    });
    child.stderr.on("data", (d: Buffer) => {
      stderr += d.toString();
    });
    child.on("error", (err) => {
      resolveResult({ code: 127, stdout, stderr: err.message });
    });
    child.on("close", (code) => {
      resolveResult({ code: code ?? 1, stdout, stderr });
    });
  });
}

export async function gitleaksScan(input: GitleaksScanInput = {}) {
  const target = resolve(input.path || process.cwd());
  const maskSecrets = input.maskSecrets !== false;
  const maxFindings = input.maxFindings ?? 50;

  try {
    await access(target, constants.R_OK);
  } catch {
    return {
      ok: false as const,
      tool: "gitleaks",
      error: "path_not_readable",
      path: target,
    };
  }

  const bin = await which("gitleaks");
  if (!bin) {
    return {
      ok: false as const,
      tool: "gitleaks",
      error: "not_installed",
      message:
        "gitleaks binary not found on PATH. Install: brew install gitleaks  OR  https://github.com/gitleaks/gitleaks#installing",
      path: target,
      skilRefs: ["control:cicd-secrets-no-hardcode"],
    };
  }

  // Exit codes: 0 = clean, 1 = leaks found, other = error
  const result = await run(
    bin,
    ["detect", "--source", target, "--report-format", "json", "--no-banner", "--exit-code", "0"],
    target
  );

  // Some versions write JSON to stdout; --report-path is alternative.
  // Prefer stdout; if empty try parsing stderr.
  let findings: unknown[] = [];
  const raw = result.stdout.trim() || result.stderr.trim();
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      findings = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // gitleaks may print nothing when clean
      findings = [];
    }
  }

  // Fallback: run with report file via stdout-only mode failed — try --verbose no
  if (!raw && result.code !== 0 && result.code !== 1) {
    return {
      ok: false as const,
      tool: "gitleaks",
      error: "scan_failed",
      exitCode: result.code,
      stderr: result.stderr.slice(0, 2000),
      path: target,
    };
  }

  const truncated = findings.slice(0, maxFindings);
  const masked = maskObjectDeep(truncated, maskSecrets);

  return {
    ok: true as const,
    tool: "gitleaks",
    path: target,
    findingCount: findings.length,
    returnedCount: masked.length,
    truncated: findings.length > maxFindings,
    maskSecrets,
    findings: masked,
    skilRefs: ["control:cicd-secrets-no-hardcode"],
    summary:
      findings.length === 0
        ? "No secrets detected by Gitleaks."
        : `Gitleaks found ${findings.length} potential secret(s). Values are masked by default.`,
  };
}
