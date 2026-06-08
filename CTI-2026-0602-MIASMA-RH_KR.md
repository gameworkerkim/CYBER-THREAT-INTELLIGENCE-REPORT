# CTI-2026-0602-MIASMA-RH_KR.md

# 레드햇 npm 공급망 공격 (Miasma 캠페인) 분석

레드햇 개발자 계정 탈취 → 32개 npm 패키지에 자격 증명 탈취 웜 삽입 → 7주간 지속된 크리덴셜 유출 체인

| 항목 | 값 |
|------|-----|
| 리포트 ID | CTI-2026-0602-MIASMA-RH |
| 발행일 | 2026-06-02 |
| 심각도 | CRITICAL — 공급망 전체 오염·자격 증명 대량 유출 |
| 분류 | TLP:GREEN |
| 위협 유형 | 공급망 공격 / Credential-Stealing Worm |
| 영향받는 패키지 | @redhat-cloud-services 네임스페이스 내 32개 패키지 |
| 누적 다운로드 | 약 1,000만 회 |
| 분석 출처 | SecurityWeek, ReversingLabs, Aikido Security, Ox Security, Socket |
| 국내 픽업 | 국내 보도 없음 (발행 시점 기준) |
| 신뢰도 | High(여러 보안 업체 교차 분석·Red Hat 확인) |

## 1. 핵심 요약

2026년 6월 1일, 공격자가 Red Hat의 공식 npm 조직인 `@redhat-cloud-services`의 개발 환경에 침투하여 32개 패키지의 96개 악성 버전을 게시하는 대규모 공급망 공격이 발생했다. 이 악성 패키지들은 **Miasma**라는 이름의 크리덴셜 스틸링 웜을 포함하고 있으며, `npm install` 단계에서 프리인스톨(preinstall) 훅을 통해 실행되었다. 공격자는 민감한 자격 증명 수집 후 이를 공격자 통제 서버로 유출했으며, 일부 정보는 GitHub 공개 저장소에 공개적으로 업로드되기도 했다. 레드햇 개발자의 GitHub 계정이 4월 13일경 인포스틸러 로그에 노출된 것이 초기 침입 경로로 지목되고 있다.

## 2. 공격 상세 (Attack Details)

### 타임라인

| 일시 | 이벤트 |
|------|--------|
| 2026.04.13 경 | Red Hat 직원의 GitHub 자격 증명이 인포스틸러 로그에 노출됨 (Patient Zero) |
| 2026.05.29 경 | 공격자가 Red Hat 저장소에 악성 코드를 테스트용으로 삽입 |
| 2026.06.01 | 32개 패키지의 악성 버전 일제 게시 (72초 창에 자동화 배포) |
| 2026.06.01 | 보안 업체들에 의해 캠페인 탐지·공개 |
| 2026.06.01 | Red Hat 정상 버전 재배포 및 악성 버전 제거 조치 |

### 침투 경로

공격에 사용된 초기 접근 경로는 Red Hat 직원의 GitHub 계정 탈취로 추정된다. 사이버보안 업체 CybelAngel의 분석에 따르면, 해당 GitHub 자격 증명이 인포스틸러 로그에 노출된 것은 공격 발생 약 7주 전인 4월 13일경으로 파악되었다. 공격자는 이 계정을 통해 CI/CD 파이프라인 또는 GitHub Actions OIDC를 제어하여 NPM 게시 권한을 확보한 후 악성 버전을 자동화된 방식으로 배포했다.

### 악성 코드 (Miasma Worm)

Miasma는 **Mini Shai-Hulud** 웜의 변종으로 확인되었으며, 악성 페이로드에는 `Miasma: The Spreading Blight` 문자열이 포함되어 있다. 이 웜은 다음과 같은 자격 증명을 탈취한다:

- GitHub Actions secrets
- npm tokens
- 클라우드 자격 증명 (Cloud credentials)
- Kubernetes 및 Vault 자격 증명
- SSH keys
- Git credentials
- 기타 민감한 파일들

### 유출 메커니즘

수집된 정보는 다음과 같은 이중 채널로 유출된다:

1. 공격자 통제 서버로 직접 전송
2. GitHub 기반 폴백 메커니즘을 통해 새로 생성된 공개 저장소에 게시

## 3. 영향 분석

### 규모 및 범위

- 영향받는 패키지: **32개** (`@redhat-cloud-services/vulnerabilities-client` 등)
- 게시된 악성 버전: **96개** (패키지당 평균 3개 악성 버전)
- 누적 다운로드: **약 1,000만 회** (정상 버전 포함)
- 확인된 감염 저장소: **최소 210개** 저장소에서 탈취된 자격 증명 발견
- 추정 감염 개발자 수: **최소 210명 이상**

### 공급망 영향

Red Hat Cloud Services의 JavaScript 생태계 전체가 영향을 받았다. 공격 영향은 최종 사용자에게 직접적으로 나타나기보다 다음과 같은 간접 경로로 확산된다:

- **직접 의존성**: 이 패키지들을 직접 사용하는 애플리케이션
- **전이적 의존성**: 이러한 패키지들을 간접적으로 참조하는 프로젝트들

### 팀PCP 연계 가능성

이번 캠페인에 사용된 웜은 지난 수개월간 오픈소스 커뮤니티를 공격해온 **TeamPCP**의 Mini Shai-Hulud 웜과 동일한 계열로 확인되었다. TeamPCP는 지난달 해당 웜의 소스 코드를 공개적으로 릴리스하며 취약점을 악용하는 "챌린지"를 장려했다. 현재 이 캠페인의 공격자가 TeamPCP 자체인지, 소스 코드를 활용한 모방 공격자인지는 확인되지 않았다.

## 4. 대응 방안

### 즉시 조치 (개발자·보안팀 대상)

1. **패키지 업데이트**: Red Hat이 배포한 정상 버전으로 즉시 업데이트
   - 악성 버전은 NPM에서 제거됨

2. **자격 증명 전면 교체**:
   - GitHub 토큰, NPM 토큰
   - API 키 및 클라우드 자격 증명
   - SSH 키 및 Vault 토큰
   - Kubernetes 시크릿

3. **침해 의심 환경**: 악성 버전을 설치한 적이 있는 경우 해당 시스템 및 빌드 환경 전체를 손상된 것으로 간주

### 탐지 및 모니터링

- 전이적 의존성 점검: 악성 패키지들이 간접 의존성으로 포함되었는지 확인
- 이상 아웃바운드 네트워크 연결 모니터링 (알려진 공격자 C2 도메인 차단)
- GitHub 내 비정상적인 공개 저장소 생성 여부 감사
- CI/CD 파이프라인의 OIDC 및 게시 권한 사용 내역 검토

### 장기적 방어 전략

- **인포스틸러 로그에 대한 지속적 모니터링**: Red Hat의 경우 7주 전에 노출된 자격 증명을 조기에 탐지할 수 있었다면 공격을 사전 차단할 수 있었음
- 다크웹 및 크리덴셜 인텔리전스 모니터링 체계 구축
- 개발자 계정에 대해 **피싱 저항성 MFA** (예: 하드웨어 보안 키) 의무화
- 서드파티 패키지 변경 사항에 대한 자동화된 의존성 모니터링 시스템 도입

## 5. 추가 참고 사항

이번 사례는 공급망 보안의 세 가지 중요한 교훈을 제공한다:

1. **초기 침해 경로의 장기적 노출**: 핵심 개발자의 자격 증명이 7주 전에 이미 인포스틸러 로그에 노출되어 있었음에도 조기 대응이 이루어지지 않았다.
2. **공개된 악성코드의 무기화**: TeamPCP가 Mini Shai-Hulud의 소스 코드를 공개적으로 릴리스한 직후 대규모 공급망 공격이 발생했다.
3. **CI/CD 권한의 위험성**: GitHub Actions OIDC 권한을 통한 자동화 배포는 편의성을 제공하지만, 계정이 탈취될 경우 대규모 악성 배포의 경로가 된다.

레드햇은 사고 후 영향을 받은 32개 패키지의 정상 버전을 재배포했으며, 악성 버전은 NPM에서 제거되었다.

## 6. 참고 출처

- SecurityWeek: Supply Chain Attack Hits 32 Red Hat NPM Packages
- LinuxSecurity: Red Hat npm Package Compromise Highlights a Growing Supply Chain Problem
- InfoWorld: Infected Red Hat npm packages expose developer credentials
- InfoSecurity Magazine: Attackers Hijack Red Hat npm Scope to Steal Cloud Secrets