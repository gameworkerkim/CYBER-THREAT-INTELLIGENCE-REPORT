# LLM CISO MCP Server (M1)

stdio MCP 서버. LLM(Cursor·Claude 등)이 **SKIL 조회**와 **Gitleaks / Trivy 스캔**을 도구로 호출한다.

## Tools

| Tool | 설명 |
|------|------|
| `skil_lookup` | `control:aws-iam-mfa` 등 ID·domain·tag·kind·list 조회 |
| `gitleaks_scan` | 경로 시크릿 스캔 (미설치 시 `not_installed` JSON) |
| `trivy_scan` | FS/IaC 취약점·시크릿·미스컨픽 스캔 |

시크릿 값은 기본 **마스킹** (`maskSecrets: true`).

## Quick start

```bash
cd Startup_Security_Guide/mcp
npm install
npm run build
npm run test:skil
npm run test:tools   # gitleaks/trivy 없으면 not_installed 로 soft pass
```

### 바이너리 (선택, 스캔용)

```bash
brew install gitleaks trivy
```

## Cursor 연동

Cursor MCP 설정에 추가 (`~/.cursor/mcp.json` 또는 프로젝트 `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "llm-ciso": {
      "command": "node",
      "args": ["/ABS/PATH/TO/CYBER-THREAT-INTELLIGENCE-REPORT/Startup_Security_Guide/mcp/dist/index.js"],
      "env": {
        "SKIL_ROOT": "/ABS/PATH/TO/CYBER-THREAT-INTELLIGENCE-REPORT/Startup_Security_Guide/skil"
      }
    }
  }
}
```

예제 파일: [`cursor-mcp.example.json`](./cursor-mcp.example.json)

개발 중(tsx):

```json
{
  "command": "npx",
  "args": ["tsx", "/ABS/PATH/.../mcp/src/index.ts"],
  "env": { "SKIL_ROOT": "/ABS/PATH/.../skil" }
}
```

## Claude Desktop / Claude Code

동일하게 stdio command로 `node …/dist/index.js` 등록.

## 수동 호출 예 (개념)

Agent에게:

- `skil_lookup` with `{ "id": "control:aws-iam-mfa" }`
- `gitleaks_scan` with `{ "path": "/path/to/repo", "maskSecrets": true }`
- `trivy_scan` with `{ "path": "/path/to/repo", "scanType": "filesystem" }`

## 환경 변수

| Var | 의미 |
|-----|------|
| `SKIL_ROOT` | SKIL 디렉터리 (기본: `../skil` relative to package) |

## 레이아웃

```
mcp/
├── src/
│   ├── index.ts      # MCP stdio entry
│   ├── skil.ts
│   ├── gitleaks.ts
│   ├── trivy.ts
│   └── mask.ts
├── fixtures/         # demo secrets for scanners
├── package.json
└── README.md
```

## M1 완료 기준

- [x] `skil_lookup` / `gitleaks_scan` / `trivy_scan`
- [x] JSON 입출력 + 시크릿 마스킹
- [x] stdio 실행 가이드
- [ ] Cursor/Claude에서 실제 MCP 세션 1회 성공 (로컬 설정 후 확인)

관련: [../ROADMAP.md](../ROADMAP.md) · [../skil/](../skil/) · [../skills/](../skills/)
