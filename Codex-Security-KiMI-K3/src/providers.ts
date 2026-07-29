import type { ProviderConfig, ProviderName } from "./types.js";

export const PROVIDERS: Record<ProviderName, ProviderConfig> = {
  deepseek: {
    name: "DeepSeek",
    baseURL: "https://api.deepseek.com",
    defaultModel: "deepseek-chat",
    models: {
      "deepseek-chat": {
        id: "deepseek-chat",
        name: "DeepSeek V4",
        description: "General-purpose. 1.6T total params, 49B active (MoE). Balanced reasoning.",
        contextWindow: 1_000_000,
        pricing: { input: 0.27, output: 1.10 },
      },
      "deepseek-reasoner": {
        id: "deepseek-reasoner",
        name: "DeepSeek V4-Pro (Reasoner)",
        description: "Advanced reasoning with chain-of-thought. Best for deep analysis. 1.6T/49B active.",
        contextWindow: 1_000_000,
        pricing: { input: 0.55, output: 2.19 },
      },
    },
  },
  kimi: {
    name: "Kimi K3 (Moonshot AI)",
    baseURL: "https://api.moonshot.cn/v1",
    defaultModel: "kimi-k3",
    models: {
      "kimi-k3": {
        id: "kimi-k3",
        name: "Kimi K3",
        description: "2.8T total params, 104B active (MoE). Frontend code analysis specialist.",
        contextWindow: 1_000_000,
        pricing: { input: 3.00, output: 15.00 },
      },
    },
  },
  qwen: {
    name: "Qwen (Alibaba)",
    baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    defaultModel: "qwen-max",
    models: {
      "qwen-max": {
        id: "qwen-max",
        name: "Qwen3-Max",
        description: "Alibaba's flagship. Strong multilingual security analysis.",
        contextWindow: 1_000_000,
        pricing: { input: 2.40, output: 9.60 },
      },
      "qwen-plus": {
        id: "qwen-plus",
        name: "Qwen3-Plus",
        description: "Cost-effective. Good for bulk scanning.",
        contextWindow: 1_000_000,
        pricing: { input: 0.80, output: 3.20 },
      },
    },
  },
};

export function getProvider(name: ProviderName | string): ProviderConfig {
  const key = name.toLowerCase() as ProviderName;
  const config = PROVIDERS[key];
  if (!config) {
    throw new Error(
      `Unknown provider: ${name}. Supported: ${Object.keys(PROVIDERS).join(", ")}`
    );
  }
  return config;
}

export function getModelConfig(
  provider: ProviderName | string,
  modelId?: string
) {
  const config = getProvider(provider);
  const model = modelId || config.defaultModel;
  const modelConfig = config.models[model];
  if (!modelConfig) {
    throw new Error(
      `Unknown model "${model}" for provider "${config.name}". ` +
      `Available: ${Object.keys(config.models).join(", ")}`
    );
  }
  return { provider: config, model: modelConfig };
}
