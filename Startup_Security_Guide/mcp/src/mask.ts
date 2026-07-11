/** Mask secret-like values in scanner output before returning to the LLM. */

const SECRETISH =
  /(api[_-]?key|secret|token|password|passwd|authorization|private[_-]?key|aws_access|aws_secret)/i;

export function maskSecretValue(value: string, enabled = true): string {
  if (!enabled) return value;
  if (!value) return value;
  if (value.length <= 8) return "***";
  return `${value.slice(0, 4)}…***…${value.slice(-2)}`;
}

export function maskObjectDeep<T>(input: T, enabled = true): T {
  if (!enabled) return input;
  return walk(input) as T;
}

function walk(node: unknown): unknown {
  if (node == null) return node;
  if (typeof node === "string") {
    // Long high-entropy-looking strings
    if (node.length >= 20 && /[A-Za-z0-9+/=_-]{20,}/.test(node) && !/\s/.test(node)) {
      return maskSecretValue(node, true);
    }
    return node;
  }
  if (Array.isArray(node)) return node.map(walk);
  if (typeof node === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      if (SECRETISH.test(k) && typeof v === "string") {
        out[k] = maskSecretValue(v, true);
      } else if (k === "Secret" || k === "Match" || k === "Fingerprint" || k === "RuleID") {
        out[k] = typeof v === "string" ? maskSecretValue(v, true) : walk(v);
      } else {
        out[k] = walk(v);
      }
    }
    return out;
  }
  return node;
}
