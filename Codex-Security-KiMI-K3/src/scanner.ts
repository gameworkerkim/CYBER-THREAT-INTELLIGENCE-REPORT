import OpenAI from "openai";
import { readFile } from "node:fs/promises";
import { join, extname, resolve } from "node:path";
import fg from "fast-glob";
import type { SecurityFinding, ScanOptions, ScanResult } from "./types.js";
import { getModelConfig } from "./providers.js";

const DEFAULT_SYSTEM_PROMPT = `You are a world-class application security expert. Analyze the provided code for security vulnerabilities.

For each vulnerability found, output a JSON object with these fields:
- severity: "critical" | "high" | "medium" | "low" | "info"
- title: short description
- description: detailed explanation of the vulnerability
- file: file path
- line: line number (approximate)
- cwe: CWE ID if applicable (e.g. "CWE-798")
- recommendation: how to fix
- confidence: 0.0 to 1.0

Focus on:
1. Hardcoded credentials, tokens, API keys (CWE-798)
2. SQL injection (CWE-89)
3. XSS (CWE-79)
4. Path traversal (CWE-22)
5. Insecure deserialization (CWE-502)
6. Missing authentication/authorization (CWE-306, CWE-862)
7. Command injection (CWE-78)
8. Sensitive data exposure (CWE-200)
9. Insecure cryptography (CWE-327)
10. Dependency vulnerabilities

Respond with a single JSON object of the form {"findings":[...]} where each finding has the fields above.
Do not include markdown fences or any text outside the JSON object.`;

const FILE_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".py", ".go", ".rs", ".java",
  ".c", ".cpp", ".h", ".rb", ".php", ".swift", ".kt", ".cs",
  ".yaml", ".yml", ".toml", ".json", ".tf", ".sh", ".bash",
  ".sql", ".dockerfile",
]);

const MAX_FILE_SIZE = 100_000;
const MAX_FILES = 200;
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 1000;
const DEFAULT_CONCURRENCY = 3;
const EXCLUDE_DIRS = ["node_modules", ".git", "dist", "build", "__pycache__", ".venv"];

function resolveApiKey(provider: string): string {
  const key = provider.toLowerCase();
  if (key === "deepseek") {
    return process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || "";
  }
  if (key === "kimi") {
    return process.env.MOONSHOT_API_KEY || process.env.KIMI_API_KEY || process.env.OPENAI_API_KEY || "";
  }
  if (key === "qwen") {
    return process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY || process.env.OPENAI_API_KEY || "";
  }
  return process.env.OPENAI_API_KEY || "";
}

async function listFiles(targetDir: string, paths?: string[]): Promise<string[]> {
  const absDir = resolve(targetDir);

  if (paths && paths.length > 0) {
    const files: string[] = [];
    for (const p of paths) {
      const pattern = join(absDir, p);
      const entries = await fg([pattern], { onlyFiles: true, dot: true, absolute: true });
      for (const filePath of entries) {
        if (FILE_EXTENSIONS.has(extname(filePath).toLowerCase())) {
          files.push(filePath);
        }
      }
    }
    return files;
  }

  const extGlobs = [...FILE_EXTENSIONS].map((ext) => `**/*${ext}`);
  const ignoreGlobs = EXCLUDE_DIRS.map((d) => `**/${d}/**`);

  const entries = await fg(extGlobs, {
    cwd: absDir,
    onlyFiles: true,
    dot: true,
    ignore: ignoreGlobs,
    absolute: true,
  });

  return entries.slice(0, MAX_FILES);
}

function buildFileContext(files: string[], targetDir: string): string {
  const absDir = resolve(targetDir);
  const parts: string[] = ["## Repository Structure\n```"];
  for (const f of files.slice(0, 80)) {
    parts.push(`  ${f.slice(absDir.length + 1)}`);
  }
  parts.push("```\n");
  return parts.join("\n");
}

async function readFileContent(filePath: string): Promise<string | null> {
  try {
    const content = await readFile(filePath, "utf-8");
    if (content.length > MAX_FILE_SIZE) {
      return content.slice(0, MAX_FILE_SIZE) + "\n... (truncated)";
    }
    return content;
  } catch {
    return null;
  }
}

async function withRetry<T>(
  fn: () => Promise<T>,
  label: string,
  maxRetries: number = MAX_RETRIES,
  baseDelay: number = RETRY_BASE_DELAY_MS,
): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        console.error(
          `[codex-open-security] ${label} attempt ${attempt + 1}/${maxRetries + 1} failed, retrying in ${(delay / 1000).toFixed(1)}s: ${lastError.message.slice(0, 200)}`,
        );
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  throw lastError!;
}

function computeCost(
  inputTokens: number,
  outputTokens: number,
  pricing: { input: number; output: number },
): number {
  return (inputTokens / 1_000_000) * pricing.input + (outputTokens / 1_000_000) * pricing.output;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export class SecurityScanner {
  private client: OpenAI | null = null;
  private provider: string;
  private model: string;
  private providerKey: string;
  private apiKey: string;
  private baseURL: string;
  private pricing: { input: number; output: number };

  constructor(provider: string, modelId?: string, apiKey?: string) {
    const { provider: providerConfig, model: modelConfig } = getModelConfig(provider, modelId);
    this.providerKey = provider.toLowerCase();
    this.apiKey = apiKey || resolveApiKey(provider);
    this.baseURL = providerConfig.baseURL;
    this.provider = providerConfig.name;
    this.model = modelConfig.id;
    this.pricing = modelConfig.pricing;
  }

  private ensureClient(): OpenAI {
    if (this.client) return this.client;
    if (!this.apiKey) {
      const hint =
        this.providerKey === "kimi"
          ? "MOONSHOT_API_KEY"
          : this.providerKey === "qwen"
            ? "DASHSCOPE_API_KEY"
            : "DEEPSEEK_API_KEY";
      throw new Error(
        `Missing API key for provider "${this.providerKey}". Pass --api-key or set ${hint}.`,
      );
    }
    this.client = new OpenAI({
      apiKey: this.apiKey,
      baseURL: this.baseURL,
    });
    return this.client;
  }

  private resolvePrompt(options: ScanOptions): string {
    if (options.prompt) return options.prompt;
    if (process.env.CODEX_OPEN_SECURITY_PROMPT) {
      return process.env.CODEX_OPEN_SECURITY_PROMPT;
    }
    return DEFAULT_SYSTEM_PROMPT;
  }

  async scan(options: ScanOptions): Promise<ScanResult> {
    const startTime = Date.now();
    const targetDir = resolve(options.target);

    const files = await listFiles(targetDir, options.paths);

    if (options.dryRun) {
      console.log(`\n[codex-open-security] Dry-run mode — listing files only\n`);
      console.log(`Target: ${targetDir}`);
      console.log(`Files found: ${files.length} (max ${MAX_FILES})`);
      console.log(``);
      for (const f of files) {
        console.log(`  ${f.slice(targetDir.length + 1)}`);
      }
      console.log(``);

      const batches = this.createBatches(files, 5);
      console.log(`Batches: ${batches.length} (5 files/batch, concurrency: ${options.concurrency || DEFAULT_CONCURRENCY})`);
      console.log(``);

      return {
        findings: [],
        summary: { total: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0 },
        duration: Date.now() - startTime,
        model: this.model,
        provider: this.provider,
        timestamp: new Date().toISOString(),
        cost: { inputTokens: 0, outputTokens: 0, totalCost: 0 },
        files: files.slice(0, MAX_FILES).map((f) => f.slice(targetDir.length + 1)),
      };
    }

    if (files.length === 0) {
      return {
        findings: [],
        summary: { total: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0 },
        duration: Date.now() - startTime,
        model: this.model,
        provider: this.provider,
        timestamp: new Date().toISOString(),
        cost: { inputTokens: 0, outputTokens: 0, totalCost: 0 },
      };
    }

    const systemPrompt = this.resolvePrompt(options);
    const client = this.ensureClient();
    const structure = buildFileContext(files, targetDir);
    const batches = this.createBatches(files, 5);
    const maxCost = options.maxCost;
    const concurrency = options.concurrency || DEFAULT_CONCURRENCY;

    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let budgetExceeded = false;
    const allFindings: SecurityFinding[] = [];
    const errors: string[] = [];

    const batchChunks = chunkArray(batches, concurrency);

    for (let chunkIdx = 0; chunkIdx < batchChunks.length; chunkIdx++) {
      if (budgetExceeded) break;

      const chunk = batchChunks[chunkIdx];

      const results = await Promise.allSettled(
        chunk.map((batch) =>
          this.processBatch(client, batch, targetDir, structure, systemPrompt),
        ),
      );

      for (const result of results) {
        if (result.status === "fulfilled") {
          allFindings.push(...result.value.findings);
          totalInputTokens += result.value.inputTokens;
          totalOutputTokens += result.value.outputTokens;
        } else {
          errors.push(result.reason instanceof Error ? result.reason.message : String(result.reason));
        }
      }

      if (maxCost) {
        const currentCost = computeCost(totalInputTokens, totalOutputTokens, this.pricing);
        if (currentCost >= maxCost) {
          budgetExceeded = true;
          const msg = `Budget exceeded ($${currentCost.toFixed(4)} >= $${maxCost}). Stopping scan.`;
          console.error(`[codex-open-security] ${msg}`);
          errors.push(msg);
          break;
        }
      }

      const completed = Math.min((chunkIdx + 1) * concurrency, batches.length);
      console.error(
        `[codex-open-security] Progress: ${completed}/${batches.length} batches | Cost: $${computeCost(totalInputTokens, totalOutputTokens, this.pricing).toFixed(4)}`,
      );
    }

    const deduped = this.deduplicate(allFindings);
    const filtered = this.filterBySeverity(deduped, options.severity);
    const totalCost = computeCost(totalInputTokens, totalOutputTokens, this.pricing);

    return {
      findings: filtered,
      summary: this.computeSummary(filtered),
      duration: Date.now() - startTime,
      model: this.model,
      provider: this.provider,
      timestamp: new Date().toISOString(),
      cost: {
        inputTokens: totalInputTokens,
        outputTokens: totalOutputTokens,
        totalCost: parseFloat(totalCost.toFixed(6)),
      },
      errors: errors.length > 0 ? errors : undefined,
      truncated: budgetExceeded || undefined,
    };
  }

  private async processBatch(
    client: OpenAI,
    batch: string[],
    targetDir: string,
    structure: string,
    systemPrompt: string,
  ): Promise<{ findings: SecurityFinding[]; inputTokens: number; outputTokens: number }> {
    const fileContents: string[] = [];
    for (const file of batch) {
      const content = await readFileContent(file);
      if (content) {
        fileContents.push(
          `### File: ${file.slice(targetDir.length + 1)}\n\`\`\`${extname(file).slice(1)}\n${content}\n\`\`\``,
        );
      }
    }

    if (fileContents.length === 0) {
      return { findings: [], inputTokens: 0, outputTokens: 0 };
    }

    const prompt = `${structure}\n\n## Source Code to Analyze\n\n${fileContents.join("\n\n")}`;

    let response: OpenAI.Chat.Completions.ChatCompletion;

    try {
      response = await withRetry(
        () =>
          client.chat.completions.create({
            model: this.model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt },
            ],
            temperature: 0.1,
            response_format: { type: "json_object" },
          }),
        "batch (json_object)",
      );
    } catch {
      console.error(
        "[codex-open-security] json_object request failed, retrying without structured output...",
      );
      response = await withRetry(
        () =>
          client.chat.completions.create({
            model: this.model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt },
            ],
            temperature: 0.1,
          }),
        "batch (plain text fallback)",
      );
    }

    const text = response.choices[0]?.message?.content || "";

    return {
      findings: this.parseFindings(text, targetDir),
      inputTokens: response.usage?.prompt_tokens || 0,
      outputTokens: response.usage?.completion_tokens || 0,
    };
  }

  private createBatches(files: string[], maxPerBatch: number): string[][] {
    const batches: string[][] = [];
    for (let i = 0; i < files.length; i += maxPerBatch) {
      batches.push(files.slice(i, i + maxPerBatch));
    }
    return batches;
  }

  private parseFindings(text: string, targetDir: string): SecurityFinding[] {
    try {
      let clean = text.trim();
      clean = clean
        .replace(/^```(?:json)?\s*\n?/i, "")
        .replace(/\n?\s*```\s*$/i, "")
        .trim();

      try {
        const obj = JSON.parse(clean);
        if (obj.findings && Array.isArray(obj.findings)) {
          return this.normalizeFindings(obj.findings, targetDir);
        }
        if (Array.isArray(obj)) {
          return this.normalizeFindings(obj, targetDir);
        }
      } catch {
        /* fall through to extraction */
      }

      const objMatch = clean.match(/\{[^{}]*"findings"\s*:\s*\[[\s\S]*?\][^{}]*\}/);
      if (objMatch) {
        try {
          const obj = JSON.parse(objMatch[0]);
          if (obj.findings && Array.isArray(obj.findings)) {
            return this.normalizeFindings(obj.findings, targetDir);
          }
        } catch {
          /* fall through */
        }
      }

      const arrStart = clean.indexOf("[");
      const arrEnd = clean.lastIndexOf("]");
      if (arrStart !== -1 && arrEnd !== -1 && arrEnd > arrStart) {
        try {
          const arr = JSON.parse(clean.slice(arrStart, arrEnd + 1));
          return this.normalizeFindings(arr, targetDir);
        } catch {
          /* fall through */
        }
      }

      if (clean.length > 0) {
        console.error(
          `[codex-open-security] Failed to parse findings. Raw text (first 500 chars): ${clean.slice(0, 500)}`,
        );
      }
      return [];
    } catch {
      console.error(
        `[codex-open-security] Unexpected parse error (first 500 chars): ${text.slice(0, 500)}`,
      );
      return [];
    }
  }

  private normalizeFindings(arr: unknown[], targetDir: string): SecurityFinding[] {
    const validSeverities = new Set(["critical", "high", "medium", "low", "info"]);
    return arr
      .filter((f): f is Record<string, unknown> => typeof f === "object" && f !== null)
      .map((f, i) => ({
        id: `CS-${i.toString().padStart(4, "0")}`,
        severity: validSeverities.has(String(f.severity))
          ? (String(f.severity) as SecurityFinding["severity"])
          : "info",
        title: String(f.title || "Untitled finding"),
        description: String(f.description || ""),
        file: String(f.file || "unknown").replace(targetDir + "/", ""),
        line: typeof f.line === "number" ? f.line : undefined,
        cwe: typeof f.cwe === "string" ? f.cwe : undefined,
        recommendation: String(f.recommendation || ""),
        confidence: Math.min(1, Math.max(0, Number(f.confidence) || 0.5)),
      }));
  }

  private deduplicate(findings: SecurityFinding[]): SecurityFinding[] {
    const seen = new Set<string>();
    return findings.filter((f) => {
      const key = `${f.file}:${f.title}:${f.severity}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private filterBySeverity(
    findings: SecurityFinding[],
    minimum?: string,
  ): SecurityFinding[] {
    if (!minimum) return findings;
    const order = ["critical", "high", "medium", "low", "info"];
    const minIdx = order.indexOf(minimum);
    return findings.filter((f) => order.indexOf(f.severity) <= minIdx);
  }

  private computeSummary(findings: SecurityFinding[]): ScanResult["summary"] {
    const counts: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    for (const f of findings) {
      counts[f.severity] = (counts[f.severity] || 0) + 1;
    }
    return {
      total: findings.length,
      critical: counts.critical,
      high: counts.high,
      medium: counts.medium,
      low: counts.low,
      info: counts.info,
    };
  }
}
