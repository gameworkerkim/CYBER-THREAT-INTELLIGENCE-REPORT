# Cyber Verification Program (CVP) 신청 완벽 가이드

Claude-BugHunter를 실제 버그 바운티나 레드팀 작업에 활용하려면 CVP(Cyber Verification Program) 승인이 필수적이다. Anthropic은 2026년 4월부터 가장 강력한 Claude 모델(Opus 4.7/4.8 등)에 실시간 사이버 안전장치를 도입하여, 취약점 익스플로잇 분석이나 공격 도구 개발 등 "High-Risk Dual Use"로 분류되는 요청을 기본적으로 차단한다.

> 💡 **중요:** CVP 승인은 Organization ID에 묶인다. 즉, 개인 워크스페이스가 아닌 특정 조직 단위로 승인이 부여되며, "내 이메일에 승인이 붙는 것"이라는 오해는 금물이다.

## 1. CVP란 무엇인가?

| 구분 | 내용 |
|------|------|
| 정식 명칭 | Cyber Verification Program |
| 성격 | 무료 신청 기반 프로그램 |
| 대상 | 침투 테스터, 버그 헌터, 취약점 연구자, 보안 엔지니어 등 인증된 보안 전문가 |
| 목적 | 합법적 방어 목적의 Dual Use 작업(취약점 연구·모의해킹·레드팀 등)에서 발생하는 차단 해제 |
| 처리 기간 | 영업일 기준 2일(보통 3~5시간 내) |
| 제외 대상 | Zero Data Retention(ZDR) 조직, Amazon Bedrock, Google Vertex AI |

> CVP를 통해 해제되는 것은 "High-Risk Dual Use" 영역(취약점 익스플로잇 분석, 공격 도구 개발 등)뿐이다. 랜섬웨어 개발이나 대규모 데이터 유출과 같은 "Prohibited Use"는 승인 여부와 관계없이 영구 차단된다.

## 2. 신청 자격 및 필요 서류

### 대상자
- 침투 테스터(Penetration Tester)
- 버그 바운티 헌터(Bug Bounty Hunter)
- 취약점 연구자(Vulnerability Researcher)
- 보안 엔지니어(Security Engineer)
- 레드팀 운영자(Red Team Operator)

### 필요 증빙 자료 (택1 이상)

| 증빙 유형 | 예시 |
|-----------|------|
| 전문 자격증 | OSCP, OSWE, GPEN, CISSP 등 |
| 소속 증명 | 회사 이메일 도메인, 재직 증명서 |
| 공개 실적 | GitHub 보안 레포지토리, HackerOne/HITB 프로필, 보안 블로그, 학술 발표 |

> CVP 신청 절차는 비교적 가벼운 편이며, 공식적인 신원 확인 절차 없이 전문적 활동을 증명할 수 있는 링크 몇 개만으로도 제출 가능하다.

## 3. 접속 방식별 상세 신청 절차

### Anthropic 1st-Party (Claude.ai / Claude Code / Anthropic API)

1. **Organization ID 확인**: claude.ai 로그인 → Settings > Account 또는 Settings > Organization 메뉴로 이동 → 화면에 표시되는 Organization ID 복사
2. **접속**: [Cyber Use Case Form](https://claude.com/form/cyber-use-case)에 접속
3. **정보 입력**:
   - 전체 이름(Full name)
   - 소속 조직(Affiliated organization)
   - 업무용 이메일(Work email) — 개인 도메인보다는 회사/기관 이메일 권장
   - Organization ID
   - 적격 카테고리 선택(예: "Authorized Penetration Testing & Red Teaming")
   - 구체적인 사용 사례 상세 기술 — 현재 Claude가 차단하는 요청 유형을 구체적으로 명시
   - 증빙 자료 링크 첨부
4. **제출 및 승인 대기**: 제출 후 영업일 기준 2일 이내 승인/반려 메일 수신

> ⚠️ **주의:** 신청은 반드시 해당 조직의 인가된 관리자(authorized admin)가 제출해야 한다.

### Microsoft Foundry (Azure 이용 시)
- Azure Portal에서 Azure Tenant ID와 Subscription ID 확인
- Cyber Use Case Form의 "Surface" 필드에서 Azure 선택 후 입력

### 서드파티 플랫폼 (Claude 기반 코딩 도구 등)
- 해당 플랫폼에 직접 문의하여 Anthropic CVP 사용 가능 여부 확인
- 가능한 경우, 플랫폼을 통해 Cyber Use Case Form 접근 요청

> 현재 Amazon Bedrock과 Google Vertex AI에서는 CVP를 지원하지 않는다.

## 4. CVP 신청 시 팁 (승인 확률 높이기)

### 승인 가능성을 높이는 전략
- **구체적으로 기술할 것**: "자동화된 페이로드 생성을 통한 내부 레드팀 훈련"과 같이 모호하지 않은 설명이 효과적이다.
- **사전 차단 증거 확보**: 신청 전에 차단된 요청을 기록해두면 강력한 증거가 된다.
- **공개된 연구 실적**: 출판된 취약점 분석, CVE 할당 내역, 보안 컨퍼런스 발표 자료 등은 큰 도움이 된다.
- **프로페셔널 이메일 사용**: Gmail 등 개인 도메인보다 회사/연구소 이메일이 훨씬 유리하다.
- **조직 ID 확인 필수**: 개인 워크스페이스가 아닌 팀/조직 단위로 신청해야 하며, 승인 후 정확한 조직 ID에서 작업해야 한다.

### 반려 시 대처법
- **반려 사유 확인**: 이메일에 포함된 반려 사유를 꼼꼼히 분석
- **증빙 강화**: 불충분한 부분을 보완하여 재신청
- **이메일 교체**: 일부 커뮤니티에서는 특정 이메일 도메인이 차단될 가능성이 제기되기도 함
- **Anthropic 지원팀 문의**: 명확한 사유를 확인할 수 없는 경우 공식 경로로 문의

## 5. 승인 전/후 체크리스트

### 승인 전 확인사항
- Organization ID가 정확히 일치하는가?
- Zero Data Retention 계정이 아닌가? (해당 경우 불가)
- Amazon Bedrock/Google Vertex AI를 통해 접근하는 경우가 아닌가?
- "Prohibited Use"에 해당하는 작업은 아닌가? (이 경우 평생 불가)

### 승인 후 확인사항
- 승인 이메일에 명시된 Organization ID와 작업 중인 조직 ID가 일치하는가?
- 여전히 차단이 발생한다면 올바른 조직 계정으로 로그인했는지 확인
- CVP 승인은 API 키 권한을 조정하거나 전용 엔드포인트를 제공하는 방식으로 적용됨

## 6. 자주 묻는 질문 (FAQ)

**Q1. CVP 승인은 영원히 유효한가요?**  
공식 문서상 만료 기간이 명시되어 있지는 않으나, 정책 변경 시 재심사가 있을 수 있다.

**Q2. 개인 연구자도 신청할 수 있나요?**  
가능하다. 단, 회사/조직 소속이 없더라도 공개된 연구 실적(GitHub, HackerOne 프로필, 블로그 등)을 충분히 증명할 수 있어야 한다.

**Q3. CVP 승인 후에도 일부 요청이 차단될 수 있나요?**  
가능하다. 일부 사용자들은 Opus 4.8에서 여전히 확률적으로 차단이 발생한다고 보고한 사례도 있다.

**Q4. Windows 사용자는 불이익이 있나요?**  
일부 커뮤니티 보고에 따르면 macOS 환경에서 Opus 4.7의 차단율이 현저히 낮다는 경험담이 존재하나, Anthropic 공식 입장은 아니다.

## 7. Claude-BugHunter 사용자를 위한 CVP 활용 가이드

Claude-BugHunter 번들에 포함된 71개 스킬 중 상당수는 취약점 익스플로잇이나 공격 도구 개발과 관련되어 있어, CVP 미승인 상태에서는 정상 작동이 불가능할 가능성이 높다. 따라서 이 번들을 실제 워크플로에 통합하기 전에 반드시 CVP 승인을 먼저 받아야 한다.

승인 후 다음 작업이 원활해진다:
- `bb-methodology`와 `redteam-mindset` 스킬의 5단계 비선형 워크플로 실행
- 48개의 `hunt-*` 스킬에서 제공하는 체인 템플릿 및 페이로드 사용
- 엔터프라이즈 플랫폼(M365/Entra, Okta 등) 공격 행렬 시뮬레이션
- Red Team 산출물 및 증거 보고서 자동화 작성

## 8. 유용한 링크

| 링크 | 목적 |
|------|------|
| [Cyber Use Case Form](https://claude.com/form/cyber-use-case) | CVP 신청서 |
| [Platform CVP Interest Form](https://claude.com/form/platform-cvp-interest) | 플랫폼 소유자용 CVP 참여 의사 표시 |
| [Real-time cyber safeguards on Claude](https://support.claude.com/en/articles/14604842-real-time-cyber-safeguards-on-claude) | 공식 안내 문서 (실시간 사이버 안전장치) |
| [Usage Policy](https://www.anthropic.com/legal/aup) | Anthropic 사용 정책 |

## 최종 요약

Claude-BugHunter는 실전 버그 헌팅 경험을 AI에 체계적으로 이식한 강력한 드롭인 툴킷으로, 71개 스킬과 681건의 실제 제보 패턴을 기반으로 한다. 장점으로는 실전 검증된 정확성, 엔터프라이즈 공격 행렬 지원, 자동화와 인간 판단의 결합 등이 있으나, 내부망 공격 미지원, 런타임 거부 문제, 유지보수 비용 등의 한계가 있다. 보강점으로는 AD 브릿지 레이어, 바이패스 자동화, 로컬 오프라인 모드 이식 등을 제안한다. 특히 2026년 Anthropic의 신규 보안 정책으로 인해, 이 번들의 실제 활용을 위해서는 **CVP(Cyber Verification Program) 승인이 필수적**이며, 신청은 Organization ID 단위로 진행되어야 한다. CVP 승인 후에야 모의해킹·취약점 연구·레드팀 작업에서 Claude Code의 잠재력을 온전히 발휘할 수 있다.
