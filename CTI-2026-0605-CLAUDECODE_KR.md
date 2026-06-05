# Claude Code GitHub Action 권한 우회 및 프롬프트 인젝션 공급망 취약점 분석

> **AI 코딩 에이전트의 CI/CD 통합이 만든 신규 공급망 공격면**
> *Indirect Prompt Injection × OIDC 토큰 탈취 × Self-Propagating Action 침해*

| 항목 | 값 |
| --- | --- |
| **리포트 ID** | `CTI-2026-0605-CLAUDECODE` |
| **발행일** | 2026-06-05 |
| **심각도** | 🔴 HIGH — CI/CD 공급망·시크릿 탈취 직결 |
| **분류** | `TLP:GREEN` |
| **CVE / 식별** | 미부여(벤더 자체 평가) · CVSS v4.0 7.8 |
| **영향 제품** | `anthropics/claude-code-action` < v1.0.94 |
| **위협 유형** | 권한 검증 우회 + Indirect Prompt Injection → RCE / Secret Exfiltration |
| **발견자** | RyotaK (GMO Flatt Security) |
| **공개 시점** | 2026-06-02 ~ 06-04 (해외 보도) |
| **국내 픽업** | KISA·보안뉴스 미게재 (발행 시점 기준) |
| **신뢰도** | High (벤더 패치·연구자 기술 공개로 교차 검증) |

---

## 1. 핵심 요약 (Executive Summary)

Anthropic의 Claude Code GitHub Action에서, **단 하나의 악성 GitHub 이슈만으로** 해당 액션을 사용하는 공개 리포지토리를 탈취할 수 있는 취약점이 공개되었다. 핵심은 두 가지 결함의 결합이다.

첫째, 권한 검증 함수 `checkWritePermissions`가 액터 이름이 `[bot]`으로 끝나는 모든 계정을 실제 권한 확인 없이 무조건 신뢰했다. GitHub App은 공개 리포지토리에 암묵적 읽기 권한을 가지며 설치 토큰만으로 이슈·PR을 생성할 수 있으므로, 공격자는 자신의 악성 GitHub App을 만들어 표적 공개 리포에 이슈를 열기만 하면 권한 검증을 통과할 수 있었다.

둘째, 우회 이후 공격자는 오류 메시지를 가장한 악성 이슈 본문으로 **간접 프롬프트 인젝션(Indirect Prompt Injection)** 을 수행했다. Claude Code는 `cat`·`head` 등 일부 Bash 명령을 사용자 승인 없이 실행하므로, 공격자는 리눅스 의사파일 `/proc/self/environ`을 읽어 워크플로 프로세스의 환경변수—특히 `ACTIONS_ID_TOKEN_REQUEST_TOKEN`·`ACTIONS_ID_TOKEN_REQUEST_URL`—를 탈취하고, 이를 통해 OIDC 토큰을 발급받아 클라우드 자격증명과 시크릿을 유출할 수 있었다.

가장 심각한 지점은 **Anthropic 자체 액션 레포(`anthropics/claude-code-action`)도 동일한 취약 에이전트 모드 워크플로를 사용**했다는 사실이다. 공격이 성공했다면 액션 소스 자체에 악성 코드를 주입하고, 이를 가져다 쓰는 모든 다운스트림 리포지토리로 전파되는 전형적 공급망 공격이 가능했다.

RyotaK가 2026년 1월 핵심 우회를 보고했고, Anthropic은 4일 만에 수정한 뒤 봄까지 추가 하드닝을 진행했다. 수정은 **v1.0.94**에 반영되었으며, Anthropic은 CVSS v4.0 기준 **7.8**로 평가하고 버그바운티를 지급했다. 별도로 Anthropic 공식 이슈 트리아지 예제 워크플로의 `allowed_non_write_users: "*"` 설정이 외부 사용자 누구나 워크플로를 트리거할 수 있게 한 위험한 오설정으로 함께 지적되었다.

---

## 2. Key Judgments

- **KJ-1 (High):** 이 사건의 본질은 "AI 에이전트에 부여된 기본 쓰기 권한 + 외부 입력의 무비판 수용"이며, 단일 취약점이 아니라 **에이전트형 CI/CD 통합 전반의 구조적 공격면**을 드러낸 사례다. 패치 여부와 무관하게 동일 패턴(봇 신뢰, 미승인 명령 실행, 환경변수 노출)은 타 AI 코딩 에이전트에도 재현될 수 있다.
- **KJ-2 (High):** 실제 악용 정황은 발행 시점 공개 보고에 없으나, 기법이 완전 공개되어 **PoC 재현 난이도가 낮다**. 패치 미적용 공개 리포지토리는 즉시 위험 노출 상태로 간주해야 한다.
- **KJ-3 (Medium):** 유출 1순위는 OIDC 토큰을 통한 **클라우드(AWS·GCP·Azure) 단기 자격증명**과 리포지토리 시크릿이다. 침해 시 코드 무결성 자체가 깨질 수 있어, 단순 토큰 회전을 넘어 빌드 산출물 신뢰성 재검증이 필요하다.
- **KJ-4 (Medium):** Tenable 등 후속 분석은 PR 헤드 브랜치 체크아웃 + 공격자 제어 `.mcp.json`을 통한 MCP 서버 기동 → 임의 명령 실행 경로도 지적했다. 즉 권한 우회 외에 **신뢰 경계(trusted boundary) 설정 자체**가 함께 검토되어야 한다.

---

## 3. 공격 체인 (Attack Chain)

1. **초기 접근** — 공격자가 악성 GitHub App을 생성·자가 설치하고 설치 토큰을 확보.
2. **권한 우회** — 설치 토큰으로 표적 공개 리포에 이슈/PR 생성. 액터가 `[bot]`으로 끝나 `checkWritePermissions`가 `true` 반환. (에이전트 모드에는 태그 모드에 있던 `checkHumanActor` 같은 추가 안전장치가 부재)
3. **프롬프트 인젝션** — 오류 메시지로 위장한 이슈 본문에 명령 실행을 유도하는 페이로드 삽입.
4. **시크릿 추출** — Claude Code가 미승인 명령(`cat`/`head`)으로 `/proc/self/environ` 판독 → `ACTIONS_ID_TOKEN_REQUEST_TOKEN`·`URL` 취득.
5. **권한 상승·유출** — OIDC 토큰 발급 → 클라우드 자격증명/시크릿 유출, 코드 푸시.
6. **공급망 전파(잠재)** — 액션 레포 자체 오염 시 다운스트림 전 리포지토리로 확산.

---

## 4. MITRE ATT&CK 매핑

| 전술 | 기법 | ID |
| --- | --- | --- |
| Initial Access | Trusted Relationship (GitHub App 신뢰 악용) | T1199 |
| Execution | Command and Scripting Interpreter (Bash) | T1059.004 |
| Defense Evasion | Abuse Elevation Control / 권한검증 우회 | T1548 |
| Credential Access | Unsecured Credentials: CI/CD Secrets | T1552.007 |
| Credential Access | Steal Application Access Token (OIDC) | T1528 |
| Supply Chain | Compromise Software Dependencies and Tools | T1195.002 |

---

## 5. 한국 여파와 대응 (Korea Impact & Response)

### 5.1 국내 노출 평가

- **스타트업·SI·게임사 중심 채택 확산.** 국내 개발 조직은 2025년 하반기 이후 Claude Code를 이슈 트리아지·코드리뷰·자동화에 빠르게 도입했다. 특히 인력이 제한된 솔로·소규모 팀일수록 기본 설정을 그대로 쓰는 경향이 강해 권한·트리거 범위 점검이 누락되기 쉽다.
- **클라우드 자격증명 연쇄 침해 위험.** 유출 핵심이 OIDC 기반 클라우드 단기 자격증명인 만큼, GitHub Actions와 Azure·AWS·GCP를 OIDC 연동한 국내 환경은 **Action 한 건의 침해가 클라우드 리소스 전체로 번지는** 구조다.
- **공개 OSS 메인테이너 직접 노출.** 공개 리포에 이 액션을 적용한 국내 오픈소스 메인테이너(개인 연구·핀테크·Web3 SDK 포함)는 별도 인증 없이 외부 이슈만으로 표적이 될 수 있었다.

### 5.2 한국 정부·기관 대응 관점

- **KISA / KrCERT(보호나라):** 현 시점 국내 권고가 부재하다. 본 사안은 "AI 코딩 에이전트의 CI/CD 통합 보안" 신규 카테고리로, **SW 공급망 보안 가이드(KISA)** 의 부속 권고 또는 별도 보안공지로 다룰 필요가 있다. 권장 골자: (1) `claude-code-action` v1.0.94 이상 강제, (2) `allowed_non_write_users` 와일드카드 금지, (3) OIDC 신뢰정책 최소권한화.
- **과학기술정보통신부:** "AI 활용 SW 개발 보안" 관점에서 정보보호 관리체계(ISMS-P) 점검 항목에 **에이전트 권한·외부입력 신뢰 경계**를 반영하는 것이 타당하다.
- **금융보안원(FSI)·금융권:** OIDC→클라우드 자격증명 탈취는 금융권 CI/CD에 직접적 위협이다. 전자금융감독규정상 클라우드 이용 보안 통제(권한 분리·토큰 수명 단축·산출물 무결성 검증) 재점검을 권고.
- **소프트웨어 공급망 보안(SBOM) 정책 연계:** 정부가 추진 중인 SBOM·SW 공급망 보안 의무화 흐름에서, **CI/CD 액션·AI 에이전트도 공급망 구성요소**로 명시 관리해야 함을 시사한다.

### 5.3 국내 조직 즉시 조치 체크리스트

1. `anthropics/claude-code-action`을 **v1.0.94 이상으로 고정**(SHA 핀 권장).
2. 워크플로의 `allowed_non_write_users` 와일드카드(`"*"`) 제거, 외부 트리거 차단.
3. 에이전트에 부여된 **기본 쓰기 권한 최소화**, 이슈·PR 처리 권한 분리.
4. OIDC 연동 클라우드 역할의 **신뢰 조건(audience·subject) 엄격화** 및 토큰 수명 단축.
5. 패치 이전 기간 공개 리포 사용 이력이 있으면 **CI 시크릿·클라우드 키·npm 토큰을 침해 가정하에 회전**.
6. `.mcp.json` 등 리포 내 에이전트 설정 파일의 **무결성 검토** 및 신뢰 경계 재정의.

---

## 6. 시사점 (Analytic Outlook)

본 사건은 "AI 에이전트에게 사람과 동일한 신뢰를 주되 사람보다 빠르고 무비판적으로 외부 입력을 처리한다"는 구조적 모순을 드러낸다. 2026년 들어 npm 공급망 웜(Shai-Hulud 계열·Miasma·IronWorm)이 GitHub Actions 신뢰 경계를 공격면으로 삼는 흐름과 정확히 맞닿아 있으며, 향후 **"AI 에이전트 ↔ CI/CD ↔ 패키지 레지스트리"를 잇는 복합 공급망 공격**이 표준 시나리오가 될 것으로 평가한다. 방어는 단일 패치가 아니라 (1) 외부입력 신뢰 경계, (2) 에이전트 명령 화이트리스트, (3) 토큰 최소권한·단수명, (4) 산출물 무결성 검증의 4축 통제로 이동해야 한다.

---

## 7. 참고 자료 (References)

- The Hacker News — "Claude Code GitHub Action Flaw Let One Malicious Issue Hijack Repositories" (2026-06-04)
- GBHackers — "Claude Code GitHub Actions Flaw Exposes Repositories to Full Compromise" (2026-06-02)
- Cyber Security News — "Claude Code's GitHub Actions Vulnerability Lets Attackers Compromise Any Repository"
- Cyberpress — "Claude Code GitHub Actions Flaw Enables Repository Compromise"
- Tenable Advisory (PR head checkout / `.mcp.json` MCP 경로)
- 제보자: RyotaK, GMO Flatt Security

---

## ⚖️ 면책 조항

본 리포트는 공개 OSINT 자료와 언론 보도를 기반으로 한 독립적 방어·연구 목적 분석이며, Anthropic을 포함한 어떤 조직의 공식 입장도 대변하지 않는다. IoC·버전 정보는 발행 시점 기준이며 운영 적용 전 최신 상태를 재확인해야 한다. 본 자료의 직·간접 사용으로 발생하는 손해에 대해 저자는 책임지지 않는다.

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
gameworker@gmail.com · github.com/gameworkerkim
