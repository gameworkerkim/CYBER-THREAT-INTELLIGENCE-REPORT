# 🛡️ YellowKey — Windows BitLocker 우회 제로데이

> **사이버 위협 인텔리전스(CTI) 1차 리포트**
> *CVE-2026-45585 · Security Feature Bypass · CVSS 6.8 (Important)*

`TLP:CLEAR` · `CTI-2026-0521-YELLOWKEY`

| 항목 | 값 |
| --- | --- |
| **리포트 ID** | `CTI-2026-0521-YELLOWKEY` |
| **작성일** | 2026-05-21 (KST) |
| **분류** | Endpoint / Full-Disk Encryption Bypass |
| **CVE** | CVE-2026-45585 |
| **CVSS** | 6.8 (Medium) / MS 심각도: Important |
| **악용 가능성** | Exploitation More Likely (MS 평가) |
| **현재 상태** | 정식 패치 미출시 · 임시 완화 조치만 제공 |
| **PoC 공개** | 공개됨 (GitHub) — CVD 위반 |
| **물리적 접근** | 필수 (원격 악용 불가) |
| **TLP** | `TLP:CLEAR` |

---

## 1. 핵심 요약

마이크로소프트는 2026년 5월 20일, Windows의 전체 디스크 암호화 기능인 BitLocker를 무력화하는 제로데이 취약점 **'YellowKey'(CVE-2026-45585)** 에 대한 임시 완화 조치를 발표했다. 이 취약점은 BitLocker의 암호화 알고리즘 자체가 아니라, 이를 둘러싼 Windows 복구 환경(WinRE)의 신뢰 처리 방식을 악용한다.

취약점은 **'Chaotic Eclipse'(별칭 Nightmare-Eclipse)** 로 알려진 익명 연구원이 정식 책임공개 절차(CVD)를 거치지 않고 PoC를 GitHub에 선공개하면서 폭로됐다. 마이크로소프트는 공식 권고문에서 이 PoC 공개가 책임공개 모범관행을 위반한 것이라고 명시했다.

공격은 물리적 접근을 전제로 하지만, 소프트웨어 설치·기존 자격증명·네트워크 접근이 전혀 필요 없다는 점에서 분실/도난 단말 및 무인 단말에 대한 실질적 위협이 크다. 정식 보안 업데이트는 아직 제공되지 않으며, 조직은 수동 완화 조치에 의존해야 한다.

---

## 2. 영향받는 시스템

- Windows 11 버전 26H1 (x64)
- Windows 11 버전 25H2 (x64)
- Windows 11 버전 24H2 (x64)
- Windows Server 2025
- Windows Server 2025 (Server Core 설치)

특히 **TPM 단독(TPM-only) 보호 모드**로 BitLocker가 구성된 단말이 최대 노출 위험에 해당한다. 다수 기업이 PIN 입력 없는 무음 부팅의 편의성 때문에 TPM-only를 기본값으로 사용하고 있어 위협 표면이 넓다.

---

## 3. 기술 분석

### 3.1 공격 체인

1. 공격자가 특수 제작된 `FsTx` 파일을 USB 드라이브 또는 EFI 파티션에 배치한다.
2. BitLocker가 활성화된 대상 단말에 해당 USB를 연결한다.
3. 단말을 Windows 복구 환경(WinRE)으로 부팅한다.
4. 부팅 과정에서 `Ctrl` 키를 누르고 있으면, 암호화된 볼륨에 대한 무제한 접근 권한을 가진 셸(shell)이 생성된다.

### 3.2 근본 원인

핵심은 BitLocker 암호화가 아니라 **복구 환경의 신뢰 가정**에 있다. WinRE 부팅 시 FsTx 자동 복구 유틸리티(`autofstx.exe`)가 자동 실행되며, 이 과정에서 트랜잭션 NTFS(TxF) 리플레이가 발생한다. 이 리플레이는 한 볼륨의 `\System Volume Information\FsTx` 디렉터리가 다른 볼륨의 콘텐츠를 수정할 수 있게 하며, 결과적으로 핵심 보안 설정 파일(`winpeshl.ini`)이 삭제되어 사전 부팅 복구 시퀀스에서 무제한 셸이 생성되는 우회 경로가 열린다.

보안 연구원 Will Dormann은 PoC가 실제로 작동함을 확인했으며, TPM-only 우회보다 **'한 볼륨의 FsTx 디렉터리가 다른 볼륨을 수정할 수 있다'** 는 점 자체가 더 근본적인 결함이라고 지적했다.

---

## 4. 완화 조치 (MS 권고)

### 4.1 옵션 A — WinRE 이미지 수정

1. 각 단말에서 WinRE 이미지를 마운트한다.
2. 마운트된 WinRE 이미지의 시스템 레지스트리 하이브를 마운트한다.
3. Session Manager의 `BootExecute`(REG_MULTI_SZ) 값에서 `autofstx.exe` 항목을 제거한다.
4. 레지스트리 하이브를 저장 후 언로드한다.
5. 업데이트된 WinRE 이미지를 언마운트하고 커밋한다.
6. WinRE에 대한 BitLocker 신뢰를 재설정한다.

### 4.2 옵션 B — TPM+PIN 전환 (권장)

이미 암호화된 단말은 PowerShell, 명령줄 또는 제어판을 통해 TPM-only 보호 모드에서 **TPM+PIN 모드**로 전환한다. 부팅 시 PIN 입력이 요구되어 YellowKey 공격을 실질적으로 차단한다.

미암호화 단말은 Microsoft Intune 또는 그룹 정책(GPO)에서 '시작 시 추가 인증 요구'를 활성화하고, 'TPM 시작 PIN 구성'을 'TPM과 함께 시작 PIN 요구'로 설정한다.

> ⚠️ **주의**: Nightmare-Eclipse는 TPM+PIN 보호를 우회하는 별도의 PoC를 보유하고 있다고 주장한 바 있어, 옵션 B는 현재 시점의 차단책일 뿐 완전한 해결로 단정하기 어렵다.

---

## 5. 위협 행위자 맥락

YellowKey를 공개한 **'Chaotic Eclipse'(별칭 Nightmare-Eclipse)** 는 MSRC의 취약점 제보 처리 방식에 대한 항의 표시로 일련의 제로데이를 무단 공개해 온 행위자다. 과거 공개 이력에는 로컬 권한 상승 취약점 **'BlueHammer'**, **'RedSun'** 등이 포함되며, 이는 단발성 사고가 아닌 의도적·연속적 폭로 캠페인의 성격을 띤다.

이러한 항의성 풀공개(full-disclosure) 패턴은 향후 추가 미공개 취약점의 무단 공개 가능성을 시사하므로, 동일 행위자의 활동을 지속 모니터링할 필요가 있다.

---

## 6. 대응 권고

| 우선순위 | 권고 사항 |
| --- | --- |
| **자산 식별** | 영향받는 Windows 11 / Server 2025 빌드 단말을 즉시 인벤토리하고, TPM-only BitLocker 사용 단말을 우선 분류 |
| **우선순위 적용** | 임원·외근·출장 인력 등 민감 데이터를 휴대하고 물리적 도난 위험이 높은 단말부터 TPM+PIN 적용 |
| **정책 강제** | GPO 또는 Intune으로 전사 단말에 다중 인증(TPM+PIN)을 정책적으로 강제 |
| **완화 검증** | WinRE 이미지 수정 조치는 일반 패치가 아닌 복구 이미지 변경이므로, 배포 전 충분한 테스트 수행 |
| **물리 보안** | 분실/도난 단말 대응 절차와 물리적 접근 통제 재점검 |
| **모니터링** | 정식 패치 출시 여부와 동일 행위자의 추가 공개를 지속 추적 |

---

## 7. 출처

- **Microsoft Security Response Center (MSRC)** — CVE-2026-45585 Advisory — <https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-45585>
- **The Hacker News** — Microsoft Releases Mitigation for YellowKey — <https://thehackernews.com/2026/05/microsoft-releases-mitigation-for.html>
- **SecurityWeek** — Microsoft Rolls Out Mitigations for YellowKey — <https://www.securityweek.com/microsoft-rolls-out-mitigations-for-yellowkey-bitlocker-bypass/>
- **Help Net Security** — YellowKey BitLocker bypass mitigation — <https://www.helpnetsecurity.com/2026/05/20/yellowkey-bitlocker-mitigation-cve-2026-45585/>

> **검증 메모**: 본 리포트는 MSRC 공식 권고 및 4개 독립 보안 매체의 교차검증을 통해 사실관계를 확인하였다. 다음(Daum) 한국어 기사에서 행위자 별칭은 'Nightmare Eclipse'로만 표기되었으나, 영문 1차 출처 및 MSRC 기준 공식 별칭은 'Chaotic Eclipse'(=Nightmare-Eclipse)이며, 'UnDefend' 등 일부 도구 언급은 1차 출처에서 직접 확인되지 않아 본문에서 제외하였다.

---

## ⚖️ 면책 조항

1. 본 리포트는 **공개된 OSINT 자료와 언론 보도**를 기반으로 한 독립적 분석이며, 관련 조직·기관·기업의 공식 입장을 대변하지 않습니다.
2. 내용은 **교육·방어·연구·정책 수립 목적**으로만 사용되어야 하며, 공격·침해·불법 활동에 사용하는 것을 엄격히 금지합니다.
3. 취약점 정보는 발행 시점 기준이며, 실제 적용 전 반드시 최신 상태를 재확인해야 합니다.
4. 저자는 본 자료의 직접적·간접적 사용으로 발생하는 어떠한 손해에 대해서도 책임지지 않습니다.

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*CVE-2026-45585 (YellowKey) 1차 리포트*
