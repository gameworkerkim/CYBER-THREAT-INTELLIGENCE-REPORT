export interface SecurityFinding {
  id: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  file: string;
  line?: number;
  cwe?: string;
  recommendation: string;
  confidence: number;
}

export interface ScanCost {
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
}

export interface ScanResult {
  findings: SecurityFinding[];
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  duration: number;
  model: string;
  provider: string;
  timestamp: string;
  cost: ScanCost;
  errors?: string[];
  truncated?: boolean;
  files?: string[];
}

export interface ScanOptions {
  target: string;
  model?: string;
  provider?: string;
  apiKey?: string;
  output?: "json" | "sarif" | "markdown";
  severity?: "critical" | "high" | "medium" | "low";
  paths?: string[];
  maxCost?: number;
  prompt?: string;
  concurrency?: number;
  dryRun?: boolean;
}

export interface ProviderConfig {
  name: string;
  baseURL: string;
  models: Record<string, ModelConfig>;
  defaultModel: string;
}

export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  contextWindow: number;
  pricing: {
    input: number;
    output: number;
  };
}

export interface SecurityScanPrompt {
  system: string;
  user: string;
}

export type ProviderName = "deepseek" | "kimi" | "qwen";
