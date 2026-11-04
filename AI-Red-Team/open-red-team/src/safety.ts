export interface ScopeGuard {
  scope: string;
  domains: string[];
  operator: string;
}

export interface ScopeCheck {
  inScope: boolean;
  flaggedTargets: string[];
}

const HOST_RE = /(?:\b(?:https?:\/\/)?)([a-z0-9][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*)+)(?::\d+)?(?:\/[^\s]*)?/gi;
const IP_RE = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;

export function loadScopeGuard(): ScopeGuard | null {
  const scope = process.env.ORT_SCOPE?.trim();
  if (!scope) return null;
  const domains = (process.env.ORT_SCOPE_DOMAINS ?? "")
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
  const operator = process.env.ORT_OPERATOR?.trim() || "unknown";
  return { scope, domains, operator };
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
  if (guard.domains.length === 0) return { inScope: true, flaggedTargets: [] };

  const found = new Set<string>();
  for (const m of input.toLowerCase().matchAll(HOST_RE)) found.add(m[1]);
  for (const m of input.matchAll(IP_RE)) found.add(m[0]);

  const flagged: string[] = [];
  for (const host of found) {
    const ok = guard.domains.some((d) => host === d || host.endsWith(`.${d}`));
    if (!ok) flagged.push(host);
  }
  return { inScope: flagged.length === 0, flaggedTargets: flagged };
}

export function scopeWarningLine(check: ScopeCheck): string {
  if (check.inScope) return "";
  return `[scope guard] The following targets are NOT in the declared engagement scope: ${check.flaggedTargets.join(", ")}. Provide defensive/generic guidance only and advise the operator to confirm scope.`;
}
