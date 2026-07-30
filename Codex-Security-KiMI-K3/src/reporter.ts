import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ScanResult } from "./types.js";

export async function saveReport(
  result: ScanResult,
  outputDir: string,
  format: "json" | "sarif" | "markdown"
): Promise<string[]> {
  await mkdir(outputDir, { recursive: true });
  const paths: string[] = [];

  if (format === "json" || format === "sarif") {
    const jsonPath = join(outputDir, "findings.json");
    await writeFile(jsonPath, JSON.stringify(result, null, 2));
    paths.push(jsonPath);
  }

  if (format === "sarif") {
    const sarifPath = join(outputDir, "findings.sarif");
    const sarif = toSarif(result);
    await writeFile(sarifPath, JSON.stringify(sarif, null, 2));
    paths.push(sarifPath);
  }

  if (format === "markdown") {
    const mdPath = join(outputDir, "report.md");
    const md = toMarkdown(result);
    await writeFile(mdPath, md);
    paths.push(mdPath);
  }

  return paths;
}

function toSarif(result: ScanResult): unknown {
  return {
    $schema: "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
    version: "2.1.0",
    runs: [{
      tool: {
        driver: {
          name: `Codex Open Security (${result.provider} / ${result.model})`,
          informationUri: "https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/tree/main/Codex-Security-KiMI-K3",
        },
      },
      results: result.findings.map((f) => ({
        ruleId: f.cwe || "SECURITY",
        level: toSarifLevel(f.severity),
        message: { text: f.title },
        locations: [{
          physicalLocation: {
            artifactLocation: { uri: f.file },
            region: f.line ? { startLine: f.line } : undefined,
          },
        }],
      })),
    }],
  };
}

function toSarifLevel(severity: string): string {
  switch (severity) {
    case "critical": return "error";
    case "high": return "error";
    case "medium": return "warning";
    case "low": return "note";
    default: return "none";
  }
}

function toMarkdown(result: ScanResult): string {
  const lines: string[] = [
    `# Security Scan Report`,
    ``,
    `**Provider:** ${result.provider} | **Model:** ${result.model}`,
    `**Date:** ${result.timestamp} | **Duration:** ${(result.duration / 1000).toFixed(1)}s`,
    ``,
    `## Summary`,
    ``,
    `| Severity | Count |`,
    `|----------|-------|`,
    `| Critical | ${result.summary.critical} |`,
    `| High     | ${result.summary.high} |`,
    `| Medium   | ${result.summary.medium} |`,
    `| Low      | ${result.summary.low} |`,
    `| Info     | ${result.summary.info} |`,
    `| **Total**| **${result.summary.total}** |`,
    ``,
  ];

  if (result.findings.length > 0) {
    lines.push(`## Findings`, ``);
    for (const f of result.findings) {
      lines.push(
        `### ${emojiForSeverity(f.severity)} [${f.severity.toUpperCase()}] ${f.title}`,
        ``,
        `- **File:** \`${f.file}\`${f.line ? `:${f.line}` : ""}`,
        f.cwe ? `- **CWE:** ${f.cwe}` : "",
        `- **Confidence:** ${(f.confidence * 100).toFixed(0)}%`,
        ``,
        f.description,
        ``,
        `**Recommendation:** ${f.recommendation}`,
        ``,
        `---`,
        ``,
      );
    }
  } else {
    lines.push(`## No findings`, ``, `No security vulnerabilities detected.`, ``);
  }

  return lines.join("\n");
}

function emojiForSeverity(severity: string): string {
  switch (severity) {
    case "critical": return "🔴";
    case "high": return "🟠";
    case "medium": return "🟡";
    case "low": return "🟢";
    default: return "⚪";
  }
}
