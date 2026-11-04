import { beforeEach, describe, expect, it } from "vitest";
import { checkScope, loadScopeGuard, scopePromptBlock, scopeWarningLine } from "../src/safety.js";

describe("scope guard", () => {
  beforeEach(() => {
    delete process.env.ORT_SCOPE;
    delete process.env.ORT_SCOPE_DOMAINS;
    delete process.env.ORT_OPERATOR;
  });

  it("returns null when not configured", () => {
    expect(loadScopeGuard()).toBeNull();
  });

  it("loads scope, domains and operator", () => {
    process.env.ORT_SCOPE = "Q4 pentest of bank.example.com";
    process.env.ORT_SCOPE_DOMAINS = "bank.example.com,portal.example.com";
    process.env.ORT_OPERATOR = "alice";
    const guard = loadScopeGuard();
    expect(guard?.domains).toEqual(["bank.example.com", "portal.example.com"]);
    expect(guard?.operator).toBe("alice");
  });

  it("flags out-of-scope hosts", () => {
    const guard = { scope: "s", domains: ["bank.example.com"], operator: "a" };
    expect(checkScope("scan https://bank.example.com/login", guard).inScope).toBe(true);
    expect(checkScope("scan https://sub.bank.example.com", guard).inScope).toBe(true);
    const bad = checkScope("attack https://evil.example.com", guard);
    expect(bad.inScope).toBe(false);
    expect(bad.flaggedTargets).toEqual(["evil.example.com"]);
  });

  it("skips domain checks when no domains configured", () => {
    const guard = { scope: "s", domains: [], operator: "a" };
    expect(checkScope("anything", guard).inScope).toBe(true);
  });

  it("builds a warning line for out-of-scope input", () => {
    const warn = scopeWarningLine({ inScope: false, flaggedTargets: ["evil.example.com"] });
    expect(warn).toContain("scope guard");
    expect(warn).toContain("evil.example.com");
    expect(scopeWarningLine({ inScope: true, flaggedTargets: [] })).toBe("");
  });

  it("embeds scope in the prompt block", () => {
    const block = scopePromptBlock({ scope: "pentest of X", domains: ["x.example.com"], operator: "a" });
    expect(block).toContain("ENGAGEMENT SCOPE");
    expect(block).toContain("x.example.com");
  });
});
