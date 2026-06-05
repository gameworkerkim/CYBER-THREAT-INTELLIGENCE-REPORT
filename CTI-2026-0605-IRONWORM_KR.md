# IronWorm — Rust/eBPF 기반 자가복제 npm 공급망 웜 분석

> **Web3·암호화폐 개발자를 표적한 자가전파형 인포스틸러**
> *Rust ELF Payload × eBPF Rootkit × npm preinstall 자가복제*

| 항목 | 값 |
| --- | --- |
| **리포트 ID** | `CTI-2026-0605-IRONWORM` |
| **발행일** | 2026-06-05 |
| **심각도** | 🔴 HIGH — 공급망 자가전파·개발자 자격증명 탈취 |
| **분류** | `TLP:GREEN` |
| **위협 유형** | Self-Propagating Supply Chain Worm / Credential & Crypto Stealer |
| **표적** | 소프트웨어 개발자(특히 암호화폐·Web3 섹터) |
| **최초 관측** | 2026-06-04 (Arweave/WeaveDB 생태계 패키지 이상 재게시) |
| **귀속(Attribution)** | 미확정 — DPRK TTP와 부분 중첩 가설(Low) |
| **국내 픽업** | KISA·보안뉴스 미게재 (발행 시점 기준) |
| **신뢰도** | High(기법) / Low(귀속) |

---

## 1. 핵심 요약 (Executive Summary)

"IronWorm"으로 명명된 신종 자가복제 공급망 공격이 야생(in the wild)에서 확인되었다. **Rust로 작성**되고 **eBPF 루트킷** 뒤에 은닉하는 고중량 인포스틸러로, 소프트웨어 개발자—특히 노출된 시크릿이 즉각 금전화되는 **암호화폐·Web3 생태계**—를 표적한다. 동작 방식은 2025년 9월 등장해 2026년 npm 위협 지형을 바꾼 Shai-Hulud 계열과 동일하다. 탈취한 자격증명을 무기화해 피해자의 GitHub 리포지토리에 스스로를 주입하고, 트로이목마화된 패키지를 npm 레지스트리에 직접 게시함으로써 **사람 개입 없이 전파**된다.

최초 탐지는 Arweave/WeaveDB 생태계의 npm 패키지 여러 개가 짧은 시간 안에 의심스럽게 재게시된 정황에서 비롯됐다. 침해 계정 `asteroiddao`가 게시한 패키지들은 표면상 정상으로 보였으나, `tools/` 디렉터리 안에 약 **976KB 리눅스 ELF 바이너리**가 숨겨져 있었고, 이는 **npm `preinstall` 훅**을 통해 설치 과정에서 조용히 실행되도록 설계되었다.

본 사건은 2026년 6월 1일 Red Hat npm 스코프를 침해한 Miasma 웜, 6월 3일 @vapi-ai/server-sdk 등 57개 패키지를 강타한 Phantom Gyp 캠페인과 **같은 주에 연쇄적으로** 발생했다. 즉 npm 생태계가 단일 사건이 아니라 **다발적 자가전파 웜의 상시 위협 국면**에 진입했음을 보여준다.

---

## 2. Key Judgments

- **KJ-1 (High):** IronWorm은 "신뢰된 메인테이너 권한 탈취 → 자동 재게시"라는 Shai-Hulud 공식을 계승하되, **Rust 네이티브 바이너리 + eBPF 루트킷**으로 탐지·분석 난이도를 크게 높였다. 스크립트 기반 선행 웜 대비 EDR 회피·지속성이 강하다.
- **KJ-2 (High):** **`preinstall` 훅 실행** 모델이므로, `npm install` 시점에 애플리케이션 코드 실행 이전·경고 없이 페이로드가 작동한다. CI/CD 파이프라인과 개발자 워크스테이션 모두가 1차 감염면이다.
- **KJ-3 (Medium):** 표적이 암호화폐·Web3에 집중되고 자격증명·API 키·지갑을 노린다는 점에서, 침해 시 **즉각적 자금 탈취 + 2차 공급망 확산**이 동시에 발생할 수 있다.
- **KJ-4 (Low):** 크립토·Web3 개발자 집중 표적은 북한(DPRK) 연계 행위자의 전형적 동기와 중첩되나, 현 시점 공개 증거만으로 **귀속을 단정할 수 없다**. 공개된 웜 소스 재활용으로 인한 모방 행위자 가능성도 배제 불가.

---

## 3. 기술 분석 (Technical Analysis)

- **언어/형태:** Rust 컴파일 ELF(약 976KB), `tools/` 디렉터리 은닉.
- **실행 트리거:** npm `preinstall` 라이프사이클 훅(설치 즉시 실행, import 불필요).
- **은닉:** eBPF 루트킷 기반 — 프로세스·네트워크 가시성 차단으로 사용자/EDR 관측 회피.
- **수집 대상:** 개발자·CI 자격증명, API 키, 암호화폐 지갑/키.
- **전파:** 탈취 자격증명으로 피해자 GitHub 리포 주입 → 트로이목마 패키지 npm 게시(자가복제).
- **관측 진입점:** Arweave/WeaveDB 관련 패키지 군집 재게시, 게시 계정 `asteroiddao`.

> 비교: Miasma(Phantom Gyp)는 `preinstall`/`postinstall`을 피하는 `binding.gyp` 기반 우회를 썼고, IronWorm은 정반대로 `preinstall`을 정공법으로 활용하되 **네이티브 바이너리+루트킷**으로 사후 은닉을 강화한 점이 차별점이다.

---

## 4. MITRE ATT&CK 매핑

| 전술 | 기법 | ID |
| --- | --- | --- |
| Initial Access | Supply Chain Compromise: SW Dependencies | T1195.002 |
| Execution | User Execution: Malicious Package (preinstall) | T1204.003 |
| Persistence / Evasion | Rootkit (eBPF) | T1014 |
| Credential Access | Unsecured Credentials / Cloud & npm Tokens | T1552 |
| Collection | Data from Local System (wallet/keys) | T1005 |
| Lateral / Propagation | Compromise Software Supply Chain (self-replication) | T1195 |

---

## 5. 한국 여파와 대응 (Korea Impact & Response)

### 5.1 국내 노출 평가

- **국내 Web3·블록체인 개발 직격.** Kaia(구 Klaytn)·DeSci·NFT·DeFi·게임 토큰 프로젝트 등 국내 Web3 개발 조직은 npm 의존도가 높고, 다수가 암호화폐 지갑·거래소 API 키를 개발 환경에 보관한다. IronWorm의 표적 프로파일과 정확히 일치한다.
- **거래소·핀테크 CI/CD 위험.** DAXA 회원 거래소 및 핀테크의 빌드 파이프라인이 감염 npm 패키지를 끌어오면, 단순 정보유출을 넘어 **운영 자격증명·서명키 탈취 → 자금/스마트컨트랙트 위협**으로 확대될 수 있다.
- **솔로·소규모 개발자 표적성.** 인력이 제한된 1인 개발사·연구자는 토큰 회전·격리 빌드 체계가 약해 자가전파 웜의 교두보가 되기 쉽다.

### 5.2 한국 정부·기관 대응 관점

- **KISA / KrCERT(보호나라):** npm 공급망 웜(Shai-Hulud → Miasma → IronWorm) 연쇄에 대한 **통합 보안공지 및 IoC 배포**가 필요하다. KISA의 SW 공급망 보안 가이드 부속서로 "오픈소스 레지스트리 설치 훅 위협" 항목 신설을 권고.
- **과학기술정보통신부:** SBOM·SW 공급망 보안 의무화 정책에 **레지스트리 설치단계(install-time) 위협**을 명시. 공공·민간 개발 표준에 "신규 패키지 쿨다운(cooldown) 차단" 권고 반영.
- **금융보안원(FSI)·금융권:** 전자금융 환경의 빌드 파이프라인에서 외부 npm 패키지 직접 설치 통제(사설 레지스트리 미러·승인된 버전 핀), CI 시크릿 단수명화 권고.
- **국가정보원(NIS)·국가사이버안보센터(NCSC):** 암호화폐·Web3 표적이라는 점에서 DPRK 연계 가능성을 **귀속 미확정 전제로** 모니터링하되, 가상자산 사업자(VASP) 대상 위협 인텔리전스 공유 강화.
- **DAXA / KoFIU:** 특정금융정보법(특금법) 체계상 VASP의 개발·운영 보안 점검 항목에 "공급망 설치단계 침해" 시나리오 추가 검토.

### 5.3 국내 조직 즉시 조치 체크리스트

1. **사설 npm 레지스트리/프록시 미러** 도입, 외부 직접 설치 차단 및 버전 핀(pin).
2. 신규/최근 게시 패키지에 대한 **쿨다운 차단 정책**(예: 게시 후 N시간 설치 보류) 적용.
3. `preinstall`/`postinstall` 등 **라이프사이클 스크립트 실행 비활성화**(`--ignore-scripts`) 및 예외 화이트리스트 운영.
4. 개발/CI 환경의 **암호화폐 지갑·거래소 API 키 격리**(로컬 미보관, 단수명 토큰).
5. 의심 설치 이력 시 **GitHub PAT·npm 토큰·클라우드 키 전수 회전** 및 GitHub Actions 시크릿 점검.
6. eBPF 기반 은닉 대응을 위한 **커널/런타임 가시성 도구**(eBPF 모니터링·런타임 EDR) 적용 검토.
7. `asteroiddao` 게시 패키지 및 Arweave/WeaveDB 관련 패키지 설치 이력 소급 점검.

---

## 6. 시사점 (Analytic Outlook)

IronWorm은 npm 공급망 웜이 (1) 스크립트 → 네이티브 바이너리, (2) 노출형 → 루트킷 은닉, (3) 광범위 → 산업 특화(Web3/크립토) 로 **진화·세분화**하고 있음을 보여준다. 같은 주에 Miasma·Phantom Gyp와 병행 발생한 점은 공개된 웜 프레임워크가 다수 행위자에게 복제·개량되고 있다는 방증이다. 방어 초점은 "악성 패키지 탐지"에서 **"설치단계 신뢰 통제 + 자격증명 단수명화 + 자가전파 차단"** 으로 이동해야 한다. 특히 국내 Web3·게임토큰 생태계는 표적 적합성이 높아 선제적 통제가 시급하다.

---

## 7. 참고 자료 (References)

- Cyberpress — "IronWorm Campaign Targets Developers Through Malicious npm Packages" (2026-06-04)
- GBHackers — "IronWorm npm Attack Steals Developer Secrets" (2026-06-04)
- StepSecurity — "Miasma npm Supply Chain Attack: Self-Spreading Worm via Phantom Gyp"
- Unit 42 (Palo Alto Networks) — "The npm Threat Landscape" (Updated 2026-06-02)
- The CyberSec Guru — "Red Hat npm Packages Compromised: Technical Analysis of Miasma Worm"

---

## ⚖️ 면책 조항

본 리포트는 공개 OSINT 자료와 언론 보도를 기반으로 한 독립적 방어·연구 목적 분석이며, 어떤 조직의 공식 입장도 대변하지 않는다. 귀속(attribution)은 미확정이며 추정에 신뢰도(Low)를 명시했다. IoC는 발행 시점 기준이며 운영 적용 전 최신 상태를 재확인해야 한다. 본 자료의 직·간접 사용으로 발생하는 손해에 대해 저자는 책임지지 않는다.

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
gameworker@gmail.com · github.com/gameworkerkim
