#!/usr/bin/env node
/**
 * LLM CISO MCP server (stdio)
 * Tools: skil_lookup, gitleaks_scan, trivy_scan
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { skilLookup } from "./skil.js";
import { gitleaksScan } from "./gitleaks.js";
import { trivyScan } from "./trivy.js";

function jsonResult(data: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

const server = new McpServer({
  name: "llm-ciso-mcp",
  version: "0.1.0",
});

server.tool(
  "skil_lookup",
  "Look up SKIL security knowledge (controls, policies, playbooks) by id, domain, tag, or kind. Example id: control:aws-iam-mfa",
  {
    id: z
      .string()
      .optional()
      .describe("Exact SKIL id, e.g. control:aws-iam-mfa or policy:pipa-29"),
    domain: z
      .string()
      .optional()
      .describe("Domain filter: cloud | workspace | drm | compliance | incident"),
    tag: z.string().optional().describe("Tag filter, e.g. mfa, aws, pipa"),
    kind: z
      .enum(["control", "policy", "playbook"])
      .optional()
      .describe("Item kind filter"),
    list: z
      .boolean()
      .optional()
      .describe("If true, return compact ID list only"),
  },
  async (args) => jsonResult(skilLookup(args))
);

server.tool(
  "gitleaks_scan",
  "Scan a path for hardcoded secrets with Gitleaks. Secret values are masked by default. Returns not_installed if binary missing.",
  {
    path: z
      .string()
      .optional()
      .describe("Directory or repo path to scan (default: cwd)"),
    maskSecrets: z
      .boolean()
      .optional()
      .describe("Mask secret values in output (default true)"),
    maxFindings: z
      .number()
      .int()
      .positive()
      .max(200)
      .optional()
      .describe("Max findings to return (default 50)"),
  },
  async (args) => jsonResult(await gitleaksScan(args))
);

server.tool(
  "trivy_scan",
  "Scan filesystem or IaC with Trivy (vuln/secret/misconfig). Secret fields masked by default. Returns not_installed if binary missing.",
  {
    path: z.string().optional().describe("Path to scan (default: cwd)"),
    scanType: z
      .enum(["filesystem", "config"])
      .optional()
      .describe("filesystem (default) or config for IaC"),
    severity: z
      .string()
      .optional()
      .describe("Comma-separated severities, default CRITICAL,HIGH,MEDIUM"),
    maskSecrets: z
      .boolean()
      .optional()
      .describe("Mask secret-like fields (default true)"),
    maxFindings: z
      .number()
      .int()
      .positive()
      .max(200)
      .optional()
      .describe("Max findings to return (default 50)"),
  },
  async (args) => jsonResult(await trivyScan(args))
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("llm-ciso-mcp listening on stdio");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
