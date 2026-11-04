import { beforeEach, describe, expect, it } from "vitest";
import {
  SCOPE_DENIED_REPLY,
  checkScope,
  loadScopeGuard,
  scopePromptBlock,
  scopeWarningLine,
} from "../src/safety.js";

const guard = { scope: "s", domains: ["bank.example.com"], operator: "a", mode: "enforce" as const };

describe("scope guard", () => {
  beforeEach(() => {
    delete process.env.ORT_SCOPE;
    delete process.env.ORT_SCOPE_DOMAINS;
    delete process.env.ORT_OPERATOR;
    delete process.env.ORT_SCOPE_MODE;
  });

  it("returns null when not configured", () => {
    expect(loadScopeGuard()).toBeNull();
  });

  it("loads scope, domains, operator and mode", () => {
    process.env.ORT_SCOPE = "Q4 pentest of bank.example.com";
    process.env.ORT_SCOPE_DOMAINS = "bank.example.com,portal.example.com";
    process.env.ORT_OPERATOR = "alice";
    const g = loadScopeGuard();
    expect(g?.domains).toEqual(["bank.example.com", "portal.example.com"]);
    expect(g?.operator).toBe("alice");
    expect(g?.mode).toBe("enforce");
    process.env.ORT_SCOPE_MODE = "open";
    expect(loadScopeGuard()?.mode).toBe("open");
  });

  it("allows in-scope hosts and subdomains", () => {
    expect(checkScope("scan https://bank.example.com/login", guard).decision).toBe("allow");
    expect(checkScope("scan https://sub.bank.example.com", guard).decision).toBe("allow");
  });

  it("denies out-of-scope hosts", () => {
    const bad = checkScope("attack https://evil.example.com", guard);
    expect(bad.decision).toBe("deny");
    expect(bad.flaggedTargets).toEqual(["evil.example.com"]);
  });

  it("does not flag filenames as hosts", () => {
    expect(checkScope("open report.pdf and read app.js", guard).decision).toBe("allow");
  });

  it("does not flag version strings as IPs", () => {
    expect(checkScope("upgrade version 1.2.3.4 and v2.0.1", guard).decision).toBe("allow");
  });

  it("flags real IPs outside scope", () => {
    const bad = checkScope("scan 203.0.113.10", guard);
    expect(bad.decision).toBe("deny");
    expect(bad.flaggedTargets).toContain("203.0.113.10");
  });

  it("does not flag octets above 255 as IPs", () => {
    expect(checkScope("value 999.999.999.999", guard).decision).toBe("allow");
  });

  it("skips domain checks when no domains configured", () => {
    const open = { scope: "s", domains: [], operator: "a", mode: "enforce" as const };
    expect(checkScope("anything", open).decision).toBe("allow");
  });

  it("open mode always allows", () => {
    const open = { scope: "s", domains: ["x.example.com"], operator: "a", mode: "open" as const };
    expect(checkScope("https://elsewhere.example.org", open).decision).toBe("allow");
  });

  it("builds a warning line for out-of-scope input", () => {
    const warn = scopeWarningLine({ decision: "deny", flaggedTargets: ["evil.example.com"], reason: "x" });
    expect(warn).toContain("scope guard");
    expect(warn).toContain("evil.example.com");
    expect(scopeWarningLine({ decision: "allow", flaggedTargets: [], reason: "x" })).toBe("");
  });

  it("embeds scope in the prompt block", () => {
    const block = scopePromptBlock(guard);
    expect(block).toContain("ENGAGEMENT SCOPE");
    expect(block).toContain("bank.example.com");
  });

  it("provides a fixed denial reply", () => {
    expect(SCOPE_DENIED_REPLY).toContain("scope guard");
  });
});
