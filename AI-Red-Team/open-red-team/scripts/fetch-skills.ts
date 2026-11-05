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
  // ---- Phase 6: Active Directory ----
  { dir: "active-directory", name: "offensive-active-directory", category: "active-directory", triggers: ["active directory", "kerberoast", "asreproast", "adcs", "esc1", "esc8", "acl abuse", "bloodhound", "golden ticket", "delegation", "hybrid aad", "액티브 디렉토리", "ad 공격", "도메인 컨트롤러"] },
  { dir: "active-directory", name: "offensive-netexec", category: "active-directory", triggers: ["netexec", "crackmapexec", "nxc", "smb exec", "winrm exec", "ldap enum", "네트엑섹"] },
  // ---- Phase 7: Auth & Identity ----
  { dir: "auth", name: "offensive-jwt", category: "auth", triggers: ["jwt", "json web token", "alg none", "key confusion", "jwt cracking", "claim tampering", "jku", "kid injection", "jwt 공격"] },
  { dir: "auth", name: "offensive-oauth", category: "auth", triggers: ["oauth", "oidc", "openid connect", "redirect uri", "pkce bypass", "token leakage", "authorization code", "oauth 공격"] },
  // ---- Phase 8: Wireless ----
  { dir: "wireless", name: "offensive-wifi", category: "wireless", triggers: ["802.11", "wifi", "wireless assessment", "와이파이", "무선랜"] },
  { dir: "wireless", name: "offensive-wifi-recon", category: "wireless", triggers: ["wifi recon", "monitor mode", "aircrack-ng", "airodump", "wireless survey", "무선 정찰", "모니터 모드"] },
  { dir: "wireless", name: "offensive-wpa2-psk", category: "wireless", triggers: ["wpa2", "psk", "handshake capture", "pmkid", "hashcat wpa", "4-way handshake", "wpa2 크래킹", "핸드셰이크", "와이파이 해킹", "와이파이 크래킹"] },
  { dir: "wireless", name: "offensive-wpa3-sae", category: "wireless", triggers: ["wpa3", "sae", "dragonblood", "transition mode", "wpa3 downgrade", "side-channel", "사이드 채널", "드래곤블러드"] },
  { dir: "wireless", name: "offensive-wpa-enterprise", category: "wireless", triggers: ["802.1x", "eap", "wpa enterprise", "radius", "evil twin radius", "certificate abuse", "eap-tls"] },
  { dir: "wireless", name: "offensive-wps", category: "wireless", triggers: ["wps", "pixie dust", "pin brute force", "reaver", "wps 공격"] },
  { dir: "wireless", name: "offensive-evil-twin", category: "wireless", triggers: ["evil twin", "karma", "mana", "captive portal", "rogue ap", "가짜 ap", "이블 트윈"] },
  { dir: "wireless", name: "offensive-krack-fragattacks", category: "wireless", triggers: ["krack", "fragattacks", "supplicant", "frame injection", "패킷 재전송"] },
  { dir: "wireless", name: "offensive-deauth-disassoc", category: "wireless", triggers: ["deauthentication", "deauth", "disassoc", "pmf", "mdk4", "aireplay", "디오스", "와이파이 재밍"] },
  { dir: "wireless", name: "offensive-bluetooth-ble", category: "wireless", triggers: ["bluetooth", "ble", "gatt", "pairing downgrade", "btlejack", "bluetooth low energy", "블루투스", "저전력 블루투스"] },
  { dir: "wireless", name: "offensive-bluetooth-classic", category: "wireless", triggers: ["bluetooth classic", "br/edr", "sdp", "knob attack", "blueborne", "hid spoofing", "클래식 블루투스"] },
  { dir: "wireless", name: "offensive-zigbee-thread-matter", category: "wireless", triggers: ["zigbee", "thread", "matter", "killerbee", "touchlink", "zcl", "802.15.4", "지그비"] },
  { dir: "wireless", name: "offensive-z-wave", category: "wireless", triggers: ["z-wave", "s0 key", "s2 commissioning", "hub pivot", "zwave", "지웨이브"] },
  { dir: "wireless", name: "offensive-lorawan-sub-ghz", category: "wireless", triggers: ["lorawan", "sub-ghz", "abp", "otaa", "keeloq", "fixed-code", "tpms", "lora", "로라완"] },
  // ---- Phase 9: Mobile ----
  { dir: "mobile", name: "offensive-mobile", category: "mobile", triggers: ["mobile pentest", "android", "ios", "frida", "certificate pinning", "biometric", "모바일 보안", "안드로이드", "ios 테스트"] },
  // ---- Phase 10: IoT & Embedded ----
  { dir: "iot", name: "offensive-iot", category: "iot", triggers: ["iot", "firmware", "uart", "jtag", "rtos", "ics", "mqtt", "coap", "embedded", "펌웨어", "iot 보안", "임베디드"] },
  // ---- Phase 11: Exploit Development ----
  { dir: "exploit-dev", name: "offensive-exploit-development", category: "exploit-dev", triggers: ["exploit development", "stack overflow", "heap corruption", "rop chain", "mitigation bypass", "익스플로잇 개발", "버퍼 오버플로우"] },
  { dir: "exploit-dev", name: "offensive-exploit-dev-course", category: "exploit-dev", triggers: ["exploit dev course", "exploit curriculum", "pwntools course", "바이너리 공격 학습"] },
  { dir: "exploit-dev", name: "offensive-basic-exploitation", category: "exploit-dev", triggers: ["linux binary exploitation", "buffer overflow", "ret2libc", "shellcode basics", "리눅스 바이너리", "bof"] },
  { dir: "exploit-dev", name: "offensive-crash-analysis", category: "exploit-dev", triggers: ["crash triage", "exploitability", "root-cause analysis", "segfault", "크래시 분석", "코어 덤프"] },
  { dir: "exploit-dev", name: "offensive-mitigations", category: "exploit-dev", triggers: ["aslr", "cfg", "cet", "pac", "mitigation bypass", "stack canary", "보호기법 우회"] },
  { dir: "exploit-dev", name: "offensive-toctou", category: "exploit-dev", triggers: ["toctou", "time-of-check", "symlink race", "file race", "경쟁조건"] },
  // ---- Phase 12: Fuzzing & Vulnerability Research ----
  { dir: "fuzzing", name: "offensive-fuzzing", category: "fuzzing", triggers: ["fuzzing", "libfuzzer", "afl++", "coverage-guided", "mutation engine", "퍼징", "afl"] },
  { dir: "fuzzing", name: "offensive-fuzzing-course", category: "fuzzing", triggers: ["fuzzing course", "fuzz curriculum", "퍼징 학습"] },
  { dir: "fuzzing", name: "offensive-bug-identification", category: "fuzzing", triggers: ["bug identification", "code review", "static analysis", "bug hunting", "코드 리뷰", "취약점 탐색"] },
  { dir: "fuzzing", name: "offensive-vuln-classes", category: "fuzzing", triggers: ["vulnerability taxonomy", "vuln classes", "cwe", "classification", "취약점 분류"] },
  // ---- Phase 13: Reconnaissance ----
  { dir: "recon", name: "offensive-osint", category: "recon", triggers: ["osint", "recon-ng", "theharvester", "maltego", "spiderfoot", "오신트", "정보 수집"] },
  { dir: "recon", name: "offensive-osint-methodology", category: "recon", triggers: ["osint methodology", "intelligence collection", "intel analysis", "정찰 방법론"] },
  // ---- Phase 14: Container & Kubernetes ----
  { dir: "container", name: "offensive-container-escape", category: "container", triggers: ["container escape", "docker", "privileged mode", "docker socket", "capabilities", "runc", "컨테이너 탈출", "도커"] },
  { dir: "container", name: "offensive-k8s-attacks", category: "container", triggers: ["kubernetes", "k8s", "rbac abuse", "etcd", "kubelet", "pod escape", "crd", "쿠버네티스", "k8s 공격"] },
  // ---- Phase 15: CI/CD & Pipeline ----
  { dir: "cicd", name: "offensive-cicd-pipeline", category: "cicd", triggers: ["cicd", "github actions", "jenkins", "gitlab ci", "pipeline injection", "ci/cd", "파이프라인 공격"] },
  { dir: "cicd", name: "offensive-cicd-secrets", category: "cicd", triggers: ["ci secrets", "environment variable", "vault", "runner token", "secret extraction", "ci/cd 시크릿"] },
  // ---- Phase 16: Cryptography ----
  { dir: "crypto", name: "offensive-crypto-attacks", category: "crypto", triggers: ["padding oracle", "ecb manipulation", "hash extension", "weak prng", "crypto attack", "암호 공격", "패딩 오라클"] },
  { dir: "crypto", name: "offensive-tls-attacks", category: "crypto", triggers: ["tls", "ssl", "poodle", "drown", "heartbleed", "pinning bypass", "0-rtt", "tls 공격", "ssl 취약점"] },
  // ---- Phase 17: Privilege Escalation ----
  { dir: "privesc", name: "offensive-linux-privesc", category: "privesc", triggers: ["linux privilege escalation", "suid", "capabilities", "sudo", "cron", "kernel exploit", "리눅스 권한 상승"] },
  { dir: "privesc", name: "offensive-windows-privesc", category: "privesc", triggers: ["windows privilege escalation", "potato", "service misconfiguration", "dll hijacking", "uac bypass", "윈도우 권한 상승"] },
  // ---- Phase 18: Post-Exploitation ----
  { dir: "post-exploitation", name: "offensive-lateral-movement", category: "post-exploitation", triggers: ["lateral movement", "pass the hash", "pass the ticket", "ntlm relay", "wmi", "winrm", "dcom", "측면 이동"] },
  { dir: "post-exploitation", name: "offensive-persistence", category: "post-exploitation", triggers: ["persistence", "registry", "scheduled task", "wmi subscription", "ticket forgery", "pam backdoor", "영속성", "지속성"] },
  { dir: "post-exploitation", name: "offensive-data-exfiltration", category: "post-exploitation", triggers: ["data exfiltration", "dns tunneling", "https tunneling", "icmp tunneling", "steganography", "데이터 유출", "터널링"] },
  // ---- Phase 19: Forensics & C2 ----
  { dir: "forensics", name: "offensive-anti-forensics", category: "forensics", triggers: ["anti-forensics", "log manipulation", "timestomping", "ads", "memory cleanup", "안티 포렌식", "로그 조작"] },
  { dir: "forensics", name: "offensive-c2-frameworks", category: "forensics", triggers: ["c2", "cobalt strike", "sliver", "mythic", "havoc", "redirector", "domain fronting", "c2 프레임워크", "커맨드 앤 컨트롤"] },
  // ---- Phase 20: Supply Chain ----
  { dir: "supply-chain", name: "offensive-supply-chain", category: "supply-chain", triggers: ["supply chain attack", "dependency confusion", "typosquatting", "build system compromise", "서플라이 체인", "공급망 공격"] },
  { dir: "supply-chain", name: "offensive-dependency-confusion", category: "supply-chain", triggers: ["dependency confusion", "npm", "pypi", "nuget", "maven", "namespace attack", "디펜던시 컨퓨전"] },
  // ---- Phase 21: Social Engineering ----
  { dir: "social-engineering", name: "offensive-phishing", category: "social-engineering", triggers: ["phishing", "gophish", "evilginx", "email spoofing", "dmarc bypass", "피싱", "이메일 스푸핑"] },
  { dir: "social-engineering", name: "offensive-social-engineering", category: "social-engineering", triggers: ["social engineering", "pretexting", "vishing", "smishing", "usb drop", "소셜 엔지니어링", "보이스피싱"] },
  // ---- Phase 22: Network Attacks ----
  { dir: "network", name: "offensive-network-attacks", category: "network", triggers: ["arp spoofing", "llmnr", "nbt-ns", "vlan hopping", "mitm", "network attack", "네트워크 공격", "중간자 공격", "arp 스푸핑", "스푸핑"] },
  // ---- Phase 23: Utility ----
  { dir: "utility", name: "offensive-fast-checking", category: "utility", triggers: ["fast triage", "quick win", "checklist", "빠른 진단", "체크리스트"] },
  { dir: "utility", name: "offensive-reporting", category: "utility", triggers: ["reporting", "cvss", "evidence standard", "executive summary", "보고서 작성", "리포팅"] },
];

const CLAUDE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bClaude Code\b/gi, "the operator agent tool"],
  [/\bClaude\.ai\b/gi, "the web chat UI"],
  [/\bclaude --system-file[^\n]*/gi, "ort --skills <name> (or /use <name> in chat)"],
  [/\bClaude Skills? (system|format)\b/gi, "skill middleware"],
  [/\bClaude Skills\b/gi, "skill middleware"],
  [/\bClaude\b/g, "the model"],
];

const EMOJI_RE = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]|\uFE0F|\u200D/gu;

function sanitize(value: string): string {
  let out = "";
  let inFence = false;
  for (const line of value.split("\n")) {
    const isFence = /^\s*```/.test(line);
    let processed = line.replace(EMOJI_RE, "");
    if (!inFence) {
      for (const [re, repl] of CLAUDE_REPLACEMENTS) {
        processed = processed.replace(re, repl);
      }
      processed = processed
        .replace(/\u26A0/g, "WARNING:")
        .replace(/\u2713/g, "Yes")
        .replace(/\u2717/g, "No");
    }
    out += `${processed}\n`;
    if (isFence) inFence = !inFence;
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

const INDEX_ONLY_BODY_CHARS = 80_000;

function shouldBeIndexOnly(body: string): boolean {
  return body.length > INDEX_ONLY_BODY_CHARS;
}

function buildFrontmatter(name: string, category: string, description: string, triggers: string[], indexOnly: boolean): string {
  const triggerYaml = triggers.map((t) => `  - "${t}"`).join("\n");
  const lines = [
    "---",
    `name: ${name}`,
    `description: "${description.replace(/"/g, '\\"')}"`,
    "triggers:",
    triggerYaml,
    `category: ${category}`,
  ];
  if (indexOnly) lines.push("index_only: true");
  lines.push('model_note: "모델 비종속 — OpenAI 호환 API(DeepSeek/GLM/Ollama 등)에서 동작"');
  lines.push('source: "https://github.com/SnailSploit/Claude-Red (MIT)"');
  lines.push("---", "");
  return lines.join("\n");
}

async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  let lastError: unknown;
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "open-red-team-sync" } });
      if (res.ok) return res;
      if (res.status === 404) return res;
      lastError = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastError = err;
    }
    if (i < attempts) await sleep(1000 * i);
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchSkill(spec: SkillSpec): Promise<{ ok: boolean; error?: string }> {
  const url = `${RAW_BASE}/${spec.dir}/${spec.name}/SKILL.md`;
  const targetDir = join(OUT_DIR, spec.category, spec.name);
  const target = join(targetDir, "SKILL.md");

  try {
    const res = await fetchWithRetry(url);
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status} for ${spec.name}` };
    }
    const raw = await res.text();
    const desc = extractDescription(raw);
    const body = extractBody(raw);
    const indexOnly = shouldBeIndexOnly(body);
    const finalDesc =
      desc || truncateAtWord(body.split("\n").find((l) => l.trim() !== "" && !l.trim().startsWith("#"))?.trim() ?? "");
    const frontmatter = buildFrontmatter(spec.name, spec.category, finalDesc, spec.triggers, indexOnly);

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
    await sleep(150);
  }

  console.log(`\nDone: ${ok} fetched, ${failed} failed`);
  if (errors.length > 0) {
    console.log("Errors:");
    for (const e of errors) console.log(`  - ${e}`);
    process.exit(1);
  }
}

main();
