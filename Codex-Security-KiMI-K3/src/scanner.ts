import OpenAI from "openai";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { glob } from "node:fs/promises";
import type { SecurityFinding, ScanOptions, ScanResult } from "./types.js";
import { getModelConfig } from "./providers.js";

const SYSTEM_PROMPT = `You are a world-class application security expert. Analyze the provided code for security vulnerabilities.

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

Output ONLY a JSON array of findings. Do not include markdown formatting or explanations outside the JSON.`;

const FILE_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".py", ".go", ".rs", ".java",
  ".c", ".cpp", ".h", ".rb", ".php", ".swift", ".kt", ".cs",
  ".yaml", ".yml", ".toml", ".json", ".tf", ".sh", ".bash",
  ".sql", ".dockerfile",
]);

const MAX_FILE_SIZE = 100_000;
const MAX_FILES = 200;

async function listFiles(targetDir: string, paths?: string[]): Promise<string[]> {
  if (paths && paths.length > 0) {
    const files: string[] = [];
    for (const p of paths) {
      const full = join(targetDir, p);
      for await (const entry of glob(full)) {
        if (FILE_EXTENSIONS.has(extname(entry).toLowerCase())) {
          files.push(entry);
        }
      }
    }
    return files;
  }

  const files: string[] = [];
  const exclude = new Set(["node_modules", ".git", "dist", "build", "__pycache__", ".venv"]);
  for await (const entry of glob(join(targetDir, "**/*"), { nodir: true })) {
    const rel = entry.slice(targetDir.length + 1);
    if (exclude.has(rel.split("/")[0])) continue;
    if (!FILE_EXTENSIONS.has(extname(entry).toLowerCase())) continue;
    files.push(entry);
    if (files.length >= MAX_FILES) break;
  }
  return files;
}

function buildFileContext(files: string[], targetDir: string): string {
  const parts: string[] = ["## Repository Structure\n```"];
  for (const f of files.slice(0, 80)) {
    parts.push(`  ${f.slice(targetDir.length + 1)}`);
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

export class SecurityScanner {
  private client: OpenAI;
  private provider: string;
  private model: string;

  constructor(
    provider: string,
    modelId?: string,
    apiKey?: string
  ) {
    const { provider: providerConfig, model: modelConfig } = getModelConfig(provider, modelId);
    
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY || process.env.MOONSHOT_API_KEY || process.env.DASHSCOPE_API_KEY || "",
      baseURL: providerConfig.baseURL,
    });
    
    this.provider = providerConfig.name;
    this.model = modelConfig.id;
  }

  async scan(options: ScanOptions): Promise<ScanResult> {
    const startTime = Date.now();
    const targetDir = options.target;

    const files = await listFiles(targetDir, options.paths);
    
    if (files.length === 0) {
      return {
        findings: [],
        summary: { total: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0 },
        duration: Date.now() - startTime,
        model: this.model,
        provider: this.provider,
        timestamp: new Date().toISOString(),
      };
    }

    const structure = buildFileContext(files, targetDir);

    const batches = this.createBatches(files, 5);
    const allFindings: SecurityFinding[] = [];

    for (const batch of batches) {
      const fileContents: string[] = [];
      for (const file of batch) {
        const content = await readFileContent(file);
        if (content) {
          fileContents.push(
            `### File: ${file.slice(targetDir.length + 1)}\n\`\`\`${extname(file).slice(1)}\n${content}\n\`\`\``
          );
        }
      }

      const prompt = `${structure}\n\n## Source Code to Analyze\n\n${fileContents.join("\n\n")}`;

      try {
        const response = await this.client.chat.completions.create({
          model: this.model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt },
          ],
          temperature: 0.1,
          response_format: { type: "json_object" },
        });

        const text = response.choices[0]?.message?.content;
        if (text) {
          const parsed = this.parseFindings(text, targetDir);
          allFindings.push(...parsed);
        }
      } catch (err) {
        console.error(`Scan error for batch: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    const deduped = this.deduplicate(allFindings);
    const filtered = this.filterBySeverity(deduped, options.severity);

    return {
      findings: filtered,
      summary: this.computeSummary(filtered),
      duration: Date.now() - startTime,
      model: this.model,
      provider: this.provider,
      timestamp: new Date().toISOString(),
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
      const clean = text.replace(/^```json\s*/, "").replace(/\s*```$/, "").trim();
      
      const jsonStart = clean.indexOf("[");
      const jsonEnd = clean.lastIndexOf("]");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const arr = JSON.parse(clean.slice(jsonStart, jsonEnd + 1));
        return this.normalizeFindings(arr, targetDir);
      }

      const obj = JSON.parse(clean);
      if (Array.isArray(obj)) return this.normalizeFindings(obj, targetDir);
      if (obj.findings && Array.isArray(obj.findings)) {
        return this.normalizeFindings(obj.findings, targetDir);
      }
      return [];
    } catch {
      return [];
    }
  }

  private normalizeFindings(arr: unknown[], targetDir: string): SecurityFinding[] {
    const validSeverities = new Set(["critical", "high", "medium", "low", "info"]);
    return arr
      .filter((f): f is Record<string, unknown> => typeof f === "object" && f !== null)
      .map((f, i) => ({
        id: `CS-${i.toString().padStart(4, "0")}`,
        severity: validSeverities.has(String(f.severity)) ? String(f.severity) as SecurityFinding["severity"] : "info",
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
    minimum?: string
  ): SecurityFinding[] {
    if (!minimum) return findings;
    const order = ["critical", "high", "medium", "low", "info"];
    const minIdx = order.indexOf(minimum);
    return findings.filter((f) => order.indexOf(f.severity) <= minIdx);
  }

  private computeSummary(findings: SecurityFinding[]): ScanResult["summary"] {
    const counts = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    for (const f of findings) {
      counts[f.severity]++;
    }
    return { total: findings.length, ...counts };
  }
}
