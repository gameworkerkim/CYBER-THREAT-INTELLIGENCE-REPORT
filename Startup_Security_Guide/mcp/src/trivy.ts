import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";
import { maskObjectDeep } from "./mask.js";

export interface TrivyScanInput {
  path?: string;
  /** filesystem | config (IaC) — default filesystem */
  scanType?: "filesystem" | "config";
  maskSecrets?: boolean;
  maxFindings?: number;
  severity?: string;
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

function flattenTrivy(report: Record<string, unknown>): unknown[] {
  const results = (report.Results as Array<Record<string, unknown>>) || [];
  const out: unknown[] = [];
  for (const r of results) {
    const target = r.Target;
    const vulns = (r.Vulnerabilities as unknown[]) || [];
    const misconfigs = (r.Misconfigurations as unknown[]) || [];
    const secrets = (r.Secrets as unknown[]) || [];
    for (const v of vulns) out.push({ target, type: "vulnerability", ...(v as object) });
    for (const m of misconfigs) out.push({ target, type: "misconfiguration", ...(m as object) });
    for (const s of secrets) out.push({ target, type: "secret", ...(s as object) });
  }
  return out;
}

export async function trivyScan(input: TrivyScanInput = {}) {
  const target = resolve(input.path || process.cwd());
  const scanType = input.scanType || "filesystem";
  const maskSecrets = input.maskSecrets !== false;
  const maxFindings = input.maxFindings ?? 50;
  const severity = input.severity || "CRITICAL,HIGH,MEDIUM";

  try {
    await access(target, constants.R_OK);
  } catch {
    return {
      ok: false as const,
      tool: "trivy",
      error: "path_not_readable",
      path: target,
    };
  }

  const bin = await which("trivy");
  if (!bin) {
    return {
      ok: false as const,
      tool: "trivy",
      error: "not_installed",
      message:
        "trivy binary not found on PATH. Install: brew install trivy  OR  https://aquasecurity.trivy.dev/latest/getting-started/installation/",
      path: target,
      skilRefs: ["control:cicd-secrets-no-hardcode", "control:drm-source-protect"],
    };
  }

  const args =
    scanType === "config"
      ? ["config", "--format", "json", "--quiet", target]
      : ["fs", "--format", "json", "--quiet", "--severity", severity, "--scanners", "vuln,secret,misconfig", target];

  const result = await run(bin, args, target);
  if (result.code !== 0 && !result.stdout.trim()) {
    return {
      ok: false as const,
      tool: "trivy",
      error: "scan_failed",
      exitCode: result.code,
      stderr: result.stderr.slice(0, 2000),
      path: target,
    };
  }

  let findings: unknown[] = [];
  try {
    const report = JSON.parse(result.stdout || "{}") as Record<string, unknown>;
    findings = flattenTrivy(report);
  } catch {
    return {
      ok: false as const,
      tool: "trivy",
      error: "parse_failed",
      stderr: result.stderr.slice(0, 1000),
      path: target,
    };
  }

  const truncated = findings.slice(0, maxFindings);
  const masked = maskObjectDeep(truncated, maskSecrets);

  return {
    ok: true as const,
    tool: "trivy",
    scanType,
    path: target,
    findingCount: findings.length,
    returnedCount: masked.length,
    truncated: findings.length > maxFindings,
    maskSecrets,
    findings: masked,
    skilRefs: ["control:drm-source-protect", "control:cicd-secrets-no-hardcode"],
    summary:
      findings.length === 0
        ? "Trivy found no issues at the selected severity."
        : `Trivy found ${findings.length} issue(s). Secret fields are masked by default.`,
  };
}
