import { runtimeEnv } from "./runtime.js";

export interface ScopeGuard {
  scope: string;
  domains: string[];
  operator: string;
  mode: "enforce" | "open";
}

export type ScopeDecision = "allow" | "deny";

export interface ScopeCheck {
  decision: ScopeDecision;
  flaggedTargets: string[];
  reason: string;
}

const HOST_RE = /(?:\b(?:https?:\/\/)?)((?=[a-z0-9-]*[a-z])[a-z0-9][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*)+)(?::\d+)?(?:\/[^\s]*)?/gi;
const OCTET = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)";
const IP_RE = new RegExp(`\\b${OCTET}\\.${OCTET}\\.${OCTET}\\.${OCTET}\\b`, "g");
const FILE_EXT_RE = /\.(?:js|ts|mjs|cjs|py|rb|go|rs|java|php|c|cpp|h|cs|sh|md|txt|json|yaml|yml|xml|html|css|sql|log|zip|tar|gz|pdf|png|jpg|jpeg|gif|svg|exe|dll|so|dylib|bin|pem|key|crt|cer|p12|conf|config|ini|toml|lock)$/i;

export function loadScopeGuard(): ScopeGuard | null {
  const scope = runtimeEnv("ORT_SCOPE")?.trim();
  if (!scope) return null;
  const domains = (runtimeEnv("ORT_SCOPE_DOMAINS") ?? "")
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
  const operator = runtimeEnv("ORT_OPERATOR")?.trim() || "unknown";
  const mode = (runtimeEnv("ORT_SCOPE_MODE") ?? "enforce").toLowerCase() === "open" ? "open" : "enforce";
  return { scope, domains, operator, mode };
}

export function scopePromptBlock(guard: ScopeGuard): string {
  return [
    `ENGAGEMENT SCOPE (declared and audited): ${guard.scope}`,
    guard.domains.length > 0
      ? `In-scope hosts/domains: ${guard.domains.join(", ")}. If the user mentions a target outside this list, decline to provide attack specifics and suggest scope confirmation.`
      : "Target specifics are permitted only within the declared engagement scope above.",
  ].join("\n");
}

export function checkScope(input: string, guard: ScopeGuard): ScopeCheck {
  if (guard.mode === "open" || guard.domains.length === 0) {
    return { decision: "allow", flaggedTargets: [], reason: "no domain restrictions" };
  }

  // strip version-string noise before scanning ("version 1.2.3.4", "v1.2.3")
  const scan = input.replace(/\bversion\s+\S+/gi, " ").replace(/\bv\d+(?:\.\d+){1,3}\b/gi, " ");

  const found = new Set<string>();
  for (const m of scan.toLowerCase().matchAll(HOST_RE)) {
    const host = m[1];
    if (FILE_EXT_RE.test(host)) continue; // filenames like report.pdf
    found.add(host);
  }
  for (const m of scan.matchAll(IP_RE)) found.add(m[0]);

  const flagged: string[] = [];
  for (const host of found) {
    const ok = guard.domains.some((d) => host === d || host.endsWith(`.${d}`));
    if (!ok) flagged.push(host);
  }

  if (flagged.length === 0) {
    return { decision: "allow", flaggedTargets: [], reason: "targets in scope" };
  }
  return {
    decision: "deny",
    flaggedTargets: flagged,
    reason: `out-of-scope targets: ${flagged.join(", ")}`,
  };
}

export function scopeWarningLine(check: ScopeCheck): string {
  if (check.decision === "allow") return "";
  return `[scope guard] The following targets are NOT in the declared engagement scope: ${check.flaggedTargets.join(", ")}. Provide defensive/generic guidance only and advise the operator to confirm scope.`;
}

export const SCOPE_DENIED_REPLY =
  "This request was refused by the scope guard: it references hosts or IPs that are outside the declared engagement scope. Confirm the target is authorized and update ORT_SCOPE_DOMAINS, or rephrase the request within scope.";
