import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const RAW_BASE = "https://raw.githubusercontent.com/SnailSploit/Claude-Red/main/Skills";
const OUT_DIR = join(process.cwd(), "skills");

interface SkillSpec {
  dir: string;
  name: string;
  category: string;
  triggers: string[];
}

const SPECS: SkillSpec[] = [
  // ---- Phase 1: Web Application ----
  { dir: "web", name: "offensive-sqli", category: "web", triggers: ["sql injection", "sqli", "sqlmap", "union select", "blind sql", "out-of-band sql", "nosql injection", "ghauri", "sql syntax error", "sql 인젝션", "sql 삽입", "sql인젝션"] },
  { dir: "web", name: "offensive-xss", category: "web", triggers: ["cross-site scripting", "xss", "reflected xss", "stored xss", "dom xss", "mutation xss", "csp bypass", "cookie theft", "javascript injection", "크로스사이트 스크립팅", "저장형 xss", "반사형 xss"] },
  { dir: "web", name: "offensive-ssrf", category: "web", triggers: ["server-side request forgery", "ssrf", "metadata endpoint", "169.254.169.254", "internal port scan", "filter bypass", "서버측 요청 위조"] },
  { dir: "web", name: "offensive-ssti", category: "web", triggers: ["server-side template injection", "ssti", "jinja2", "freemarker", "velocity", "twig", "{{7*7}}", "rce template", "템플릿 인젝션", "서버측 템플릿"] },
  { dir: "web", name: "offensive-xxe", category: "web", triggers: ["xml external entity", "xxe", "doctype", "blind xxe", "oob exfiltration", "file read xml", "billion laughs", "xml 외부 엔티티"] },
  { dir: "web", name: "offensive-idor", category: "web", triggers: ["insecure direct object reference", "idor", "authorization bypass", "object id enumeration", "uuid enumeration", "access control flaw", "객체 참조 취약점"] },
  { dir: "web", name: "offensive-file-upload", category: "web", triggers: ["file upload", "webshell", "polyglot file", "extension bypass", "magic bytes", "content-type bypass", "multipart upload", "파일 업로드", "웹쉘"] },
  { dir: "web", name: "offensive-rce", category: "web", triggers: ["remote code execution", "rce", "command injection", "os command injection", "deserialization rce", "eval injection", "원격 코드 실행", "명령어 인젝션", "커맨드 인젝션"] },
  { dir: "web", name: "offensive-deserialization", category: "web", triggers: ["deserialization", "java deserialization", "ysoserial", "gadget chain", "php unserialize", "pickle", ".net serialization", "역직렬화"] },
  { dir: "web", name: "offensive-race-condition", category: "web", triggers: ["race condition", "toctou", "turbo intruder", "single-packet attack", "limit bypass race", "double spend", "경쟁 조건", "레이스 컨디션"] },
  { dir: "web", name: "offensive-request-smuggling", category: "web", triggers: ["request smuggling", "cl.te", "te.cl", "h2 desync", "http desync", "transfer-encoding", "리퀘스트 스머글링"] },
  { dir: "web", name: "offensive-open-redirect", category: "web", triggers: ["open redirect", "redirect url", "oauth token theft", "redirect parameter", "오픈 리다이렉트", "리다이렉션 취약점"] },
  { dir: "web", name: "offensive-parameter-pollution", category: "web", triggers: ["parameter pollution", "hpp", "duplicate parameter", "waf bypass pollution", "logic confusion", "파라미터 폴루션"] },
  { dir: "web", name: "offensive-graphql", category: "web", triggers: ["graphql", "introspection query", "graphql batching", "alias idor", "graphql mutation", "그래프큐엘"] },
  { dir: "web", name: "offensive-waf-bypass", category: "web", triggers: ["waf bypass", "web application firewall", "encoding tricks", "chunked transfer", "case mutation", "tamper scripts", "modsecurity", "waf 우회", "웹방화벽"] },
  { dir: "web", name: "offensive-business-logic", category: "web", triggers: ["business logic", "workflow bypass", "pricing abuse", "logic flaw", "multi-step chain", "payment bypass", "비즈니스 로직", "업무 로직 취약점"] },
  // ---- Phase 2: Infrastructure & Red Team ----
  { dir: "infrastructure", name: "offensive-initial-access", category: "infrastructure", triggers: ["initial access", "phishing payload", "drive-by download", "supply chain vector", "ta0001", "macro payload", "초기 침투", "초기 접근"] },
  { dir: "infrastructure", name: "offensive-advanced-redteam", category: "infrastructure", triggers: ["kill chain", "c2 infrastructure", "opsec", "lateral movement", "persistence", "red team operation", "domain fronting", "레드팀", "킬체인", "내부 확산"] },
  { dir: "infrastructure", name: "offensive-edr-evasion", category: "infrastructure", triggers: ["edr evasion", "unhooking", "indirect syscalls", "ppid spoofing", "amtibypass", "ntdll", "crowdstrike", "defender evasion", "edr 우회", "백신 우회"] },
  { dir: "infrastructure", name: "offensive-shellcode", category: "infrastructure", triggers: ["shellcode", "position-independent code", "shellcode injection", "encoder", "pic assembly", "stageless payload", "쉘코드"] },
  { dir: "infrastructure", name: "offensive-keylogger-arch", category: "infrastructure", triggers: ["keylogger", "input capture", "keyboard hook", "setwindowshookex", "raw input", "키로거", "키보드 후킹"] },
  { dir: "infrastructure", name: "offensive-windows-mitigations", category: "infrastructure", triggers: ["windows mitigations", "acg", "cig", "cfg", "cet bypass", "arbitrary code guard", "code integrity guard", "윈도우 보호기법"] },
  { dir: "infrastructure", name: "offensive-windows-boundaries", category: "infrastructure", triggers: ["sandbox escape", "integrity level", "appcontainer", "boundary defeat", "windows sandbox", "샌드박스 탈출"] },
  // ---- Phase 3: API Security ----
  { dir: "api", name: "offensive-api-security", category: "api", triggers: ["api security", "owasp api", "bola", "bfla", "mass assignment", "rate limiting", "rest api testing", "api top 10", "api 보안", "api 취약점"] },
  { dir: "api", name: "offensive-api-abuse", category: "api", triggers: ["api business logic", "endpoint chaining", "batching abuse", "webhook hijacking", "api abuse", "graphql api", "api 로직 악용", "api 오남용"] },
  // ---- Phase 4: Cloud ----
  { dir: "cloud", name: "offensive-cloud", category: "cloud", triggers: ["aws pentest", "azure attack", "gcp security", "cloud privilege escalation", "privilege escalation", "imds", "cross-account pivot", "cloudspm", "s3 bucket", "iam abuse", "aws", "azure", "gcp", "iam", "클라우드 보안", "aws 해킹", "클라우드 침투", "권한 상승"] },
  // ---- Phase 5: AI Security ----
  { dir: "ai", name: "offensive-ai-security", category: "ai", triggers: ["prompt injection", "jailbreak", "rag poisoning", "model extraction", "llm security", "ai red team", "prompt leaking", "gpt vulnerability", "프롬프트 인젝션", "프롬프트 주입", "llm 보안", "ai 보안", "탈옥"] },
];

const CLAUDE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bClaude Code\b/gi, "the operator agent tool"],
  [/\bClaude\.ai\b/gi, "the web chat UI"],
  [/\bclaude --system-file[^\n]*/gi, "ort --skills <name> (or /use <name> in chat)"],
  [/\bClaude Skills? (system|format)\b/gi, "skill middleware"],
  [/\bClaude Skills\b/gi, "skill middleware"],
  [/\bClaude\b/g, "the model"],
];

function sanitize(value: string): string {
  let out = value;
  for (const [re, repl] of CLAUDE_REPLACEMENTS) {
    out = out.replace(re, repl);
  }
  return out;
}

function truncateAtWord(value: string, max = 200): string {
  if (value.length <= max) return value;
  const cut = value.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut) + "…";
}

function extractDescription(raw: string): string {
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (fmMatch) {
    const desc = fmMatch[1].match(/^description:\s*(.+)$/m);
    if (desc) {
      const value = desc[1].trim().replace(/^["']|["']$/g, "");
      return truncateAtWord(value);
    }
  }
  const legacyDesc = raw.match(/## Description\s*\n([\s\S]*?)(?=\n## )/);
  if (legacyDesc) {
    const value = legacyDesc[1].trim().replace(/\s+/g, " ");
    return truncateAtWord(value);
  }
  return "";
}

function extractBody(raw: string): string {
  const fmMatch = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  if (fmMatch) {
    return sanitize(raw.slice(fmMatch[0].length).trim());
  }

  let body = raw;
  body = body.replace(/^# SKILL:.*\r?\n+/, "");
  body = body.replace(/## Metadata\s*\n[\s\S]*?(?=\n## )/, "");
  body = body.replace(/## Description\s*\n[\s\S]*?(?=\n## )/, "");
  body = body.replace(/## Trigger Phrases\s*\n[\s\S]*?(?=\n## )/, "");
  body = body.replace(/## Instructions for Claude/gi, "## Instructions");
  return sanitize(body.trim());
}

function buildFrontmatter(name: string, category: string, description: string, triggers: string[]): string {
  const triggerYaml = triggers.map((t) => `  - "${t}"`).join("\n");
  return [
    "---",
    `name: ${name}`,
    `description: "${description.replace(/"/g, '\\"')}"`,
    "triggers:",
    triggerYaml,
    `category: ${category}`,
    'model_note: "모델 비종속 — OpenAI 호환 API(DeepSeek/GLM/Ollama 등)에서 동작"',
    'source: "https://github.com/SnailSploit/Claude-Red (MIT)"',
    "---",
    "",
  ].join("\n");
}

async function fetchSkill(spec: SkillSpec): Promise<{ ok: boolean; error?: string }> {
  const url = `${RAW_BASE}/${spec.dir}/${spec.name}/SKILL.md`;
  const targetDir = join(OUT_DIR, spec.category, spec.name);
  const target = join(targetDir, "SKILL.md");

  try {
    const res = await fetch(url, { headers: { "User-Agent": "open-red-team-sync" } });
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status} for ${spec.name}` };
    }
    const raw = await res.text();
    const desc = extractDescription(raw);
    const body = extractBody(raw);
    const frontmatter = buildFrontmatter(spec.name, spec.category, desc, spec.triggers);

    await mkdir(targetDir, { recursive: true });
    await writeFile(target, `${frontmatter}${body}\n`, "utf-8");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

async function main() {
  let ok = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const spec of SPECS) {
    const result = await fetchSkill(spec);
    if (result.ok) {
      ok++;
      console.log(`  ok  ${spec.category}/${spec.name}`);
    } else {
      failed++;
      errors.push(`${spec.name}: ${result.error}`);
      console.log(`FAIL  ${spec.category}/${spec.name} — ${result.error}`);
    }
  }

  console.log(`\nDone: ${ok} fetched, ${failed} failed`);
  if (errors.length > 0) {
    console.log("Errors:");
    for (const e of errors) console.log(`  - ${e}`);
    process.exit(1);
  }
}

main();
