import { describe, expect, it } from "vitest";
import { loadConfig, resolveProvider } from "../src/config.js";

describe("resolveProvider", () => {
  it("accepts valid providers", () => {
    expect(resolveProvider("deepseek")).toBe("deepseek");
    expect(resolveProvider("GLM")).toBe("glm");
    expect(resolveProvider("openweight")).toBe("openweight");
  });

  it("throws on unknown providers", () => {
    expect(() => resolveProvider("anthropic")).toThrow(/unknown provider/i);
  });

  it("falls back to ORT_PROVIDER env", () => {
    process.env.ORT_PROVIDER = "glm";
    expect(resolveProvider(undefined)).toBe("glm");
    delete process.env.ORT_PROVIDER;
  });
});

describe("loadConfig", () => {
  it("applies provider defaults", () => {
    const cfg = loadConfig({ provider: "deepseek" });
    expect(cfg.baseUrl).toBe("https://api.deepseek.com/v1");
    expect(cfg.model).toBe("deepseek-chat");
    expect(cfg.maxSkills).toBeGreaterThan(0);
  });

  it("uses GLM defaults", () => {
    const cfg = loadConfig({ provider: "glm" });
    expect(cfg.baseUrl).toBe("https://open.bigmodel.cn/api/paas/v4");
  });
});
