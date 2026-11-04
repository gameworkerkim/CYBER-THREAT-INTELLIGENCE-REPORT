import { beforeEach, describe, expect, it, vi } from "vitest";
import { BaseProvider } from "../src/providers/base.js";
import type { ChatMessage } from "../src/types.js";
import { OpenRedTeam, trimHistory } from "../src/index.js";

class MockProvider extends BaseProvider {
  calls = 0;
  lastMessages: ChatMessage[] = [];
  constructor() {
    super({ model: "mock", apiKey: "x", baseUrl: "http://mock" });
  }
  get name() {
    return "deepseek" as const;
  }
  override async chat(messages: ChatMessage[]): Promise<{ content: string; reasoningLength: number }> {
    this.calls += 1;
    this.lastMessages = messages;
    return { content: `echo(${messages.filter((m) => m.role === "user").length} turns)`, reasoningLength: 0 };
  }
}

describe("OpenRedTeam scope enforcement", () => {
  beforeEach(() => {
    delete process.env.ORT_SCOPE;
    delete process.env.ORT_SCOPE_DOMAINS;
    delete process.env.ORT_SCOPE_MODE;
  });

  it("refuses out-of-scope input without calling the provider", async () => {
    process.env.ORT_SCOPE = "pentest of demo.example.com";
    process.env.ORT_SCOPE_DOMAINS = "demo.example.com";
    const mock = new MockProvider();
    const ort = new OpenRedTeam({ provider: "deepseek", providerOverride: mock as never });
    await ort.init();

    const result = await ort.chat("scan https://attacker.example.org now");
    expect(result.decision).toBe("deny");
    expect(result.flaggedTargets).toContain("attacker.example.org");
    expect(result.matchedSkills).toEqual([]);
    expect(mock.calls).toBe(0);
  });

  it("calls the provider for in-scope input", async () => {
    process.env.ORT_SCOPE = "pentest of demo.example.com";
    process.env.ORT_SCOPE_DOMAINS = "demo.example.com";
    const mock = new MockProvider();
    const ort = new OpenRedTeam({ provider: "deepseek", providerOverride: mock as never });
    await ort.init();

    const result = await ort.chat("scan https://demo.example.com/login");
    expect(result.decision).toBe("allow");
    expect(mock.calls).toBe(1);
  });
});

describe("trimHistory", () => {
  const msg = (role: "user" | "assistant" | "system", content: string): ChatMessage => ({ role, content });

  it("keeps everything when under budget", () => {
    const h = [msg("user", "a"), msg("assistant", "b")];
    const { trimmed, droppedTurns } = trimHistory(h, 10_000);
    expect(trimmed).toEqual(h);
    expect(droppedTurns).toBe(0);
  });

  it("drops oldest turns and keeps the latest user message", () => {
    const h = [
      msg("user", "turn one ".repeat(100)),
      msg("assistant", "reply one ".repeat(100)),
      msg("user", "turn two ".repeat(100)),
      msg("assistant", "reply two ".repeat(100)),
      msg("user", "final question"),
    ];
    const { trimmed, droppedTurns } = trimHistory(h, 200);
    expect(trimmed[trimmed.length - 1]).toEqual(msg("user", "final question"));
    expect(droppedTurns).toBe(2);
    expect(trimmed.length).toBeLessThan(h.length);
  });

  it("counts dropped user turns", () => {
    const h = [msg("user", "x".repeat(400)), msg("assistant", "y".repeat(400)), msg("user", "z")];
    const { droppedTurns } = trimHistory(h, 30);
    expect(droppedTurns).toBe(1);
  });
});
