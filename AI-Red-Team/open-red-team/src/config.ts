import "dotenv/config";
import type { OrtConfig, ProviderName } from "./types.js";

const ENV_DEFAULTS: Record<ProviderName, { baseUrl: string; model: string; apiKeyEnv: string }> = {
  deepseek: {
    baseUrl: "https://api.deepseek.com/v1",
    model: "deepseek-chat",
    apiKeyEnv: "DEEPSEEK_API_KEY",
  },
  glm: {
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    model: "glm-4-plus",
    apiKeyEnv: "GLM_API_KEY",
  },
  openweight: {
    baseUrl: "http://localhost:11434/v1",
    model: "qwen2.5:32b",
    apiKeyEnv: "OPENWEIGHT_API_KEY",
  },
};

export function resolveProvider(provider?: string): ProviderName {
  const p = (provider ?? process.env.ORT_PROVIDER ?? "deepseek").toLowerCase();
  if (p === "deepseek" || p === "glm" || p === "openweight") return p;
  throw new Error(`Unknown provider: ${p}. Use one of: deepseek, glm, openweight`);
}

export function loadConfig(overrides?: Partial<OrtConfig>): OrtConfig {
  const provider = resolveProvider(overrides?.provider);
  const defaults = ENV_DEFAULTS[provider];

  return {
    provider,
    model: overrides?.model ?? process.env[`${provider.toUpperCase()}_MODEL`] ?? defaults.model,
    apiKey: overrides?.apiKey ?? process.env[defaults.apiKeyEnv] ?? process.env.ORT_API_KEY,
    baseUrl: overrides?.baseUrl ?? process.env[`${provider.toUpperCase()}_BASE_URL`] ?? defaults.baseUrl,
    skillsDir: overrides?.skillsDir ?? process.env.ORT_SKILLS_DIR ?? "./skills",
    autoLoad: overrides?.autoLoad ?? (process.env.ORT_AUTO_LOAD ?? "on") !== "off",
    maxSkills: overrides?.maxSkills ?? Number(process.env.ORT_MAX_SKILLS ?? 3),
    includeIndex: overrides?.includeIndex ?? (process.env.ORT_INCLUDE_INDEX ?? "on") !== "off",
  };
}
