#!/usr/bin/env node

import { Command } from "commander";
import { SecurityScanner } from "./scanner.js";
import { saveReport } from "./reporter.js";
import { PROVIDERS } from "./providers.js";
import type { ScanOptions } from "./types.js";

const program = new Command();

program
  .name("codex-open-security")
  .description("Open-weight security scanner — DeepSeek, Kimi K3, Qwen")
  .version("0.1.0");

const providerNames = Object.keys(PROVIDERS).join(" | ");

program
  .command("scan [target]")
  .description("Scan a repository or directory for security vulnerabilities")
  .option("-p, --provider <provider>", `Model provider: ${providerNames}`, "deepseek")
  .option("-m, --model <model>", "Model ID override")
  .option("-k, --api-key <key>", "API key (or set env var)")
  .option("-o, --output <dir>", "Output directory for reports", "./security-reports")
  .option("-f, --format <format>", "Report format: json | sarif | markdown", "markdown")
  .option("-s, --severity <level>", "Minimum severity: critical | high | medium | low", "low")
  .option("--paths <paths...>", "Specific file paths to scan")
  .option("--prompt <prompt>", "Custom system prompt (or set CODEX_OPEN_SECURITY_PROMPT env var)")
  .option("--max-cost <dollars>", "Maximum budget in USD before stopping scan", parseFloat)
  .option("--concurrency <n>", "Number of batches to process in parallel", parseInt, 3)
  .action(async (target: string | undefined, options: Record<string, unknown>) => {
    const scanTarget = target || ".";
    const provider = String(options.provider || "deepseek");
    const model = options.model ? String(options.model) : undefined;
    const apiKey = options.apiKey ? String(options.apiKey) : undefined;
    const output = String(options.output || "./security-reports");
    const format = String(options.format || "markdown") as ScanOptions["output"];
    const severity = String(options.severity || "low") as ScanOptions["severity"];
    const paths = options.paths ? (options.paths as string[]) : undefined;
    const prompt = options.prompt ? String(options.prompt) : undefined;
    const maxCost = typeof options.maxCost === "number" ? options.maxCost : undefined;
    const concurrency = typeof options.concurrency === "number" ? options.concurrency : 3;

    console.log(`\n[codex-open-security] Provider: ${provider} | Model: ${model || "default"}`);
    console.log(`[codex-open-security] Scanning: ${scanTarget}\n`);

    try {
      const scanner = new SecurityScanner(provider, model, apiKey);
      const result = await scanner.scan({
        target: scanTarget,
        provider,
        model,
        apiKey,
        output: format,
        severity,
        paths,
        prompt,
        maxCost,
        concurrency,
      });

      const reportPaths = await saveReport(result, output, format || "markdown");

      console.log(`\n=== Scan Complete ===`);
      console.log(
        `Critical: ${result.summary.critical}  High: ${result.summary.high}  Medium: ${result.summary.medium}  Low: ${result.summary.low}  Info: ${result.summary.info}`,
      );
      console.log(
        `Duration: ${(result.duration / 1000).toFixed(1)}s | Model: ${result.model} | Cost: $${result.cost.totalCost.toFixed(4)}`,
      );
      if (result.truncated) {
        console.log(`[WARNING] Scan was truncated (budget exceeded or error).`);
      }
      if (result.errors && result.errors.length > 0) {
        console.log(`\nErrors (${result.errors.length}):`);
        for (const e of result.errors) {
          console.log(`  - ${e}`);
        }
      }
      console.log(`\nReports saved to:`);
      for (const p of reportPaths) {
        console.log(`  ${p}`);
      }

      if (result.summary.critical > 0 || result.summary.high > 0) {
        process.exitCode = 1;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`\nScan failed: ${message}`);
      process.exitCode = 2;
    }
  });

program
  .command("providers")
  .description("List available providers and models")
  .action(() => {
    for (const [key, config] of Object.entries(PROVIDERS)) {
      console.log(`\n${config.name} (${key})`);
      console.log(`  Base URL: ${config.baseURL}`);
      console.log(`  Default: ${config.defaultModel}`);
      for (const [mid, m] of Object.entries(config.models)) {
        console.log(
          `  - ${mid}: ${m.description}  [$${m.pricing.input}/$1M input, $${m.pricing.output}/$1M output]`,
        );
      }
    }
  });

program.parse();
