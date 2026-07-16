---
report_id: CTI-2026-0715-OSTIUM
title: "Ostium OLP Vault 오라클 조작 익스플로잇 분석"
classification: TLP:GREEN
confidence: B2 (Admiralty Code)
date_published: 2026-07-16
author: "Dennis Kim (김호광)"
incident_date: 2026-07-15
incident_window: "14:18–14:23 UTC (약 5분)"
target: "Ostium Finance (Arbitrum L2 기반 RWA 무기한 선물 DEX)"
attack_type: "Oracle Manipulation / Price-Feed Infrastructure Abuse"
loss_estimate_usd: "$11.86M – $23.7M (기관별 추정 상이)"
loss_estimate_krw: "약 165억 ~ 330억 원"
status: "진행 중 (Ongoing) / 거래 전면 중단"
---

# CTI 리포트: Ostium OLP Vault 오라클 조작 익스플로잇

| 항목 | 내용 |
|------|------|
| 사건 ID | CTI-2026-0715-OSTIUM |
| TLP | GREEN |
| 신뢰도 (Admiralty Code) | B2 (일반적으로 신뢰할 수 있는 출처 / 개연성 높음) |
| 발생 일시 | 2026-07-15, 14:18–14:23 UTC |
| 대상 | Ostium Finance — Arbitrum 기반 RWA 무기한 선물 DEX |
| 공격 유형 | 오라클 조작 (Price-Feed Infrastructure Abuse) |
| 피해 규모 | USDC $11.86M–$23.7M (추정) / 약 165억~330억 원 |
| 현재 상태 | 거래 컨트랙트 전면 중단, 법 집행기관·SEAL 911 협력 대응 |
| 작성자 | Dennis Kim (김호광) |

---

## 1. 요약 (Executive Summary)

2026년 7월 15일 14:18–14:23 UTC 사이, Arbitrum L2 기반 실물자산(RWA) 무기한 선물 거래 프로토콜 **Ostium**의 유동성 볼트(OLP Vault)에서 오라클 가격 피드 조작을 통한 자금 유출 사고가 발생했다. 공격자는 프로토콜이 신뢰하도록 등록된 가격 피드 자동화 구성요소(PriceUpKeep forwarder)와 미래 시점으로 날짜가 조작된(future-dated) 오라클 리포트를 악용해, 실제로는 발생하지 않은 인위적 거래 수익을 만들어내고 이를 볼트 지급으로 전환시켰다.

블록체인 보안업체 **Blockaid**는 피해 규모를 약 $18M USDC로 추정했으며, CertiK는 약 $22M, 온체인 관측자 및 Decurity 분석은 단일 트랜잭션 기준 약 $11.86M을 제시하는 등 기관별 추정치가 상이하다. Ostium은 아직 자체 피해 회계를 공표하지 않았다.

이 사건은 KiloEx(2025.04, $7.5M), Summer.fi(2026.07.06, $6M), Bonzo Finance(2026.07, $9M)로 이어지는 **키퍼/오라클 인프라 악용 공격 패턴**의 연장선에 있으며, off-chain 데이터에 결제를 의존하는 하이브리드 DeFi 구조의 구조적 취약점을 다시 한 번 드러냈다.

> **핵심 판단**: 본 사건의 근본 원인은 스마트 컨트랙트 로직 자체의 결함이 아니라, **프로토콜이 "신뢰 경계 내부(trusted perimeter)"로 간주하던 오라클 서명·자동화 권한의 오용**이다. Ostium의 버그바운티 범위 문서는 PriceUpKeep을 포함한 등록 키퍼와 그 forwarder를 "신뢰되고 정상 작동한다고 가정"하며 명시적으로 범위에서 제외하고 있었다 — 즉, 공격 표면이 사전에 "안전"으로 선언된 영역이었다.

---

## 2. 피해 대상 개요 (Victim Profile)

| 항목 | 내용 |
|------|------|
| 프로토콜명 | Ostium Finance |
| 체인 | Arbitrum (Ethereum L2) |
| 서비스 | RWA(실물자산) 무기한 선물 DEX — 금·원유·주가지수·외환, 최대 200x 레버리지, USDC 결제 |
| 누적 거래량 | $50B+ (일부 자료 $33B 누적) |
| 사고 직전 TVL | 약 $63M (DeFiLlama 기준) |
| 조달 자금 | 약 $27.8M (2025년 말 $24M 시리즈 A 포함) |
| 주요 투자자 | General Catalyst, Jump Crypto, Coinbase Ventures, Wintermute, GSR |
| 유동성 구조 | OLP Vault — LP가 USDC 예치 후 OLP 토큰 수취, 모든 거래의 카운터파티 역할 |

OLP Vault는 프로토콜의 결제 계층(settlement layer)으로, 모든 거래의 상대방 역할을 한다. 조작된 가격 피드로 "합성 수익"이 발생하면 그 수익은 LP가 예치한 바로 그 풀에서 직접 지급된다 — 이 구조가 오라클 조작을 볼트 드레인으로 직결시킨 핵심 요인이다.

---

## 3. 공격 타임라인 (Attack Timeline)

| 시각 (UTC) | 이벤트 |
|-----------|--------|
| 14:18경 | 익스플로잇 트랜잭션 실행 시작 (OLP Vault 자금 유출 개시) |
| 14:18–14:23 | 약 5분간 반복적 open-close 루프를 통한 자금 인출 |
| 사고 후 수 분 내 | Blockaid 실시간 탐지 시스템이 익스플로잇 감지, X에 공개 경보 및 공격 트랜잭션·공격자 주소 공개 |
| +1시간 이내 | Ostium, 문제 인지 후 거래 컨트랙트 전면 중단 ("We are aware of the issue with the OLP vault. We have paused all trading.") |
| 이후 | 공격자, 탈취 USDC를 Kyber Network를 통해 ETH로 스왑, 다수 지갑으로 분산 (Arkham Intelligence 자금 추적 확인) |
| 대응 단계 | Ostium, 법 집행기관·SEAL 911·외부 보안 전문가와 협력 대응 개시, 사용자에게 컨트랙트 승인(approval) 취소 권고 |

---

## 4. 공격 기법 상세 분석 (TTP Analysis)

### 4.1 인프라 배경

Ostium은 실물자산 가격 추적을 위해 자체 가격 피드 시스템을 운용하며, 서드파티 자동화 네트워크 **Gelato**가 적시에 온체인으로 가격을 푸시하는 구조다. 이 과정의 중심에 **PriceUpKeep 컨트랙트**가 있으며, 거래 실행 시점에 최신 가격 데이터를 블록체인에 기록하는 트리거 역할을 한다.

### 4.2 공격 흐름

1. **권한 확보**: 공격자는 (a) 주문을 자기충족(self-fulfill)할 수 있는 등록된 PriceUpKeep forwarder와 (b) 미래 시점으로 날짜가 조작된 오라클 리포트를 생성할 수 있는 인가된 서명자(authorized signer) 권한을 보유·악용했다.
   - **주의**: Blockaid 원문은 "registered forwarder"와 "future-dated authorized oracle reports"를 명시했을 뿐, **개인키(private key) 유출을 직접 언급하지 않았다.** 다수 매체가 "오라클 서명 키 침해"로 성격 규정했으나, Ostium은 공격자가 리포트 제출 권한을 획득한 경위를 아직 확정 공표하지 않았다. (신뢰도 C3 — 미확정)

2. **합성 수익 생성**: 단일 원자적(atomic) `executeBatch` 트랜잭션 내에서 다음 루프를 반복:
   - MARKET 가격으로 포지션 오픈
   - 조작된 `performUpkeep` 호출로 인위적으로 유리한 오라클 가격(대규모 평가익) 주입
   - 즉시 포지션 청산 → 합성 수익 실현

3. **복리 증폭**: 이 사이클을 약 10~20회 반복하며 마진을 복리로 증폭(1K → 80K → 700K, 회당 최대 900% 수익). Decurity는 예시 트랜잭션에서 자기서명 유리 가격으로 즉시 개폐를 반복해 단일 트랜잭션에서 약 $11.86M USDC를 인출한 것으로 분석했다.

4. **자금 세탁**: 탈취 USDC를 Kyber Network를 통해 ETH로 스왑 후 다수 지갑으로 분산 (Arkham Intelligence 추적).

### 4.3 근본 원인 판단

| 구분 | 판단 |
|------|------|
| 컨트랙트 로직 결함 | 아니오 — 컨트랙트는 "유효한" 것으로 보이는 가격 피드를 거부할 이유가 없었음 |
| 신뢰 경계 오용 | 예 — 사전에 "신뢰됨"으로 선언된 키퍼/오라클 권한이 공격 벡터 |
| 검증 우회 | 예 — 미래 날짜 타임스탬프로 검증 체크를 통과 |

---

## 5. MITRE ATT&CK 매핑

> 참고: MITRE ATT&CK은 전통적 엔터프라이즈 환경 기준이므로, 블록체인/DeFi 오라클 공격에는 근사 매핑을 적용한다.

| Tactic | Technique | 적용 근거 |
|--------|-----------|-----------|
| Initial Access (TA0001) | Valid Accounts (T1078) | 인가된 오라클 서명자/등록 forwarder 권한 악용 |
| Execution (TA0002) | 원자적 배치 트랜잭션(`executeBatch`)을 통한 자동화 실행 | 단일 TX 내 다중 open-close 루프 |
| Defense Evasion (TA0005) | Impair Defenses (T1562) / Timestamp 조작 | 미래 날짜 오라클 리포트로 유효성 검증 우회 |
| Collection/Impact | Data Manipulation (T1565) | 가격 데이터 조작을 통한 합성 수익 생성 |
| Impact (TA0040) | Financial Theft (T1657) | OLP Vault USDC 유출 |
| Exfiltration | Kyber DEX 경유 ETH 스왑 후 다중 지갑 분산 | 자금 세탁/추적 회피 |

---

## 6. 침해 지표 (IOC)

| 유형 | 값 | 신뢰도 |
|------|-----|--------|
| 익스플로잇 TX (Arbitrum) | `0x359f8c05b86a4409d60cfba02084334313fd94b19f74a294fb7fc4ea7d4870e0` | B1 (CoinDesk가 인용한 Arbiscan 링크) |
| 공격자 주소 | Blockaid가 X 경보(status/2077405527428989363)에서 공개 — 원 게시물에서 직접 확인 권고 | B2 |
| 세탁 경로 | Kyber Network (USDC→ETH 스왑) → 다수 지갑 분산 | B2 |
| 조작 대상 컨트랙트 | PriceUpKeep forwarder (Gelato 자동화 연계) | B1 |

> **주의**: 공격자 주소 문자열은 Blockaid의 원 X 게시물 및 Arbiscan에서 직접 대조 후 차단 리스트에 반영할 것을 권고한다. 본 리포트는 익스플로잇 TX 해시만 원문(CoinDesk 인용 Arbiscan 링크)에서 직접 확보했다.

---

## 7. 피해 규모 추정치 대조 (Loss Estimate Reconciliation)

| 출처 | 추정 손실 | 비고 |
|------|-----------|------|
| Blockaid | ~$18M USDC | 최초 탐지·공개 경보 |
| CertiK | ~$22M | 독립 분석 |
| Decurity / 온체인 관측 | ~$11.86M | 단일 예시 트랜잭션 기준 |
| Cryptobriefing | 최대 $23.7M | 상한 추정 |
| Ostium 공식 | 미공표 | 자체 회계 미발표 |

TVL 대비 피해율은 약 28~35%로, 사고 직전 볼트의 1/3 가까운 유동성이 유출된 것으로 추정된다. **추정치 편차가 큰 이유**는 (1) Ostium의 자체 회계 미공표, (2) 다중 트랜잭션/다중 지갑 분산으로 인한 집계 기준 차이, (3) 실시간 진행 사건 특성 때문이다. 확정 수치는 프로토콜 사후분석(post-mortem) 공표 시까지 유보 판단(신뢰도 C3).

---

## 8. 유사 사건 및 위협 트렌드 (Threat Landscape)

본 사건은 2026년 DeFi를 강타한 **오라클/키퍼 인프라 악용 공격 파도**의 최신 사례다:

| 사건 | 시점 | 손실 | 벡터 |
|------|------|------|------|
| KiloEx | 2025.04 | ~$7.5M | 신뢰된 키퍼 사칭, 3개 체인 |
| Summer.fi | 2026.07.06 | ~$6M | 주가(share-price) 조작 |
| Bonzo Finance (Hedera) | 2026.07 | ~$9M | 노출된 가격 오라클 |
| **Ostium** | **2026.07.15** | **$11.86M–$23.7M** | **PriceUpKeep forwarder + 미래날짜 오라클 리포트** |

2026년 상반기 DeFi 부문은 87건의 사고로 $900M+ 손실을 기록했으며, 손실의 80% 이상이 개인키 유출 또는 브릿지 해킹에서 비롯됐다. 참고로 KelpDAO/LayerZero 사건에서는 Arbitrum Security Council이 개입해 $70M+ 탈취 자금을 동결한 전례가 있어, Ostium 건에서도 유사 개입 가능성이 주목된다.

---

## 9. 한국 특화 임팩트 (Korea-Specific Impact)

| 항목 | 분석 |
|------|------|
| 국내 직접 노출 | Ostium은 국내 원화 거래소 상장 자산이 아니며, 국내 리테일 직접 노출은 제한적. 다만 Arbitrum·RWA 무기한 선물에 참여한 국내 온체인 LP·트레이더의 간접 노출 가능성 존재. |
| OLP LP 리스크 | OLP 토큰 보유 국내 유저는 볼트 유동성 1/3 유출로 인한 NAV 손실 및 인출 지연 리스크에 직접 노출. 공식 채널의 인출 가이드 모니터링 필수. |
| USDC 결제 구조 | 유출 자산이 Circle 발행 USDC이며, 한국 스테이블코인 제도화 논의(가상자산 국가자산 분류 법 개정 추진 등) 국면에서 오라클·결제 인프라 리스크 사례로 정책적 참조 가치. |
| RWA 무기한 트렌드 | RWA 무기한 선물 거래량이 사상 최대($311B, 2026.06)를 기록하는 성장 국면에서 발생한 사고로, 국내 RWA/스테이블 프로젝트(예: K-POP Pass 등 스테이블 연동 사업)의 오라클 키 관리·자동화 권한 설계에 직접적 교훈. |
| 규제 시사점 | 국내 가상자산 사업자(VASP)가 오라클 의존 상품을 설계·중개할 경우, "신뢰 경계 내부"로 가정한 인프라 권한이 실질적 단일 실패지점(SPOF)이 될 수 있음을 보안 심사 기준에 반영 필요. |

---

## 10. 완화 및 대응 권고 (Mitigation & Recommendations)

**프로토콜 운영자용**
- 오라클 서명자·키퍼 forwarder 권한을 "신뢰됨"으로 가정하지 말고, **명시적 검증 계층**(타임스탬프 유효성, 가격 편차 상한, 리포트 신선도 검증)을 컨트랙트 레벨에서 강제.
- future-dated 타임스탬프 리포트 **거부 로직** 및 단일 트랜잭션 내 반복 open-close에 대한 **레이트 리밋/이상탐지** 도입.
- 버그바운티 범위에서 "신뢰된 키퍼" 예외 조항 재검토 — 사전 안전 선언 영역이 실제 최대 공격 표면이 될 수 있음.
- 오라클 서명 키에 대한 HSM/멀티시그·키 로테이션·최소권한 원칙 적용.

**LP / 트레이더용**
- Ostium 관련 컨트랙트 **승인(approval) 즉시 취소** (revoke) — 팀이 진행 중 위험을 배제하지 못한 상태.
- 공식 채널(X, Discord)의 인출 가이드·사후분석 공표 모니터링, 미확인 "복구 지원" 사칭 피싱 주의.

**국내 사업자·리서처용**
- 오라클 의존 상품 설계 시 본 사건을 케이스 스터디로 반영, 자동화 권한의 SPOF 여부 점검.
- Arbitrum Security Council 동결 개입 여부 및 SEAL 911 대응 경과 추적.

---

## 11. 신뢰도 및 한계 (Confidence & Limitations)

- 본 리포트의 종합 신뢰도는 **B2 (Admiralty Code)** 로, 복수의 신뢰 가능한 매체·보안업체 보도에 기반하나 Ostium의 공식 사후분석이 미공표된 진행 중 사건이다.
- 피해 규모($11.86M–$23.7M), 근본 원인의 "개인키 유출" 성격 규정, 공격자 주소 세부는 확정되지 않았으며 추가 검증이 필요하다(해당 항목 C3).
- 익스플로잇 TX 해시는 CoinDesk가 인용한 Arbiscan 링크에서 직접 확보했으나, 공격자 주소는 Blockaid 원 게시물에서 재확인 후 활용할 것을 권고한다.
- **LLM은 엑셀이지 오라클이 아니다** — 본 리포트의 수치·주소는 온체인 원본(Arbiscan)과 1차 출처(Blockaid/Ostium 공식 게시물)에서 반드시 재대조할 것.

---

## 출처 (References)

- Blockaid (X, 2026-07-15) — 최초 탐지·경보, 익스플로잇 TX·공격자 주소 공개
- CoinDesk (Oliver Knight, 2026-07-15) — 익스플로잇 TX 해시, Gelato/PriceUpKeep 인프라 분석
- The Defiant — 버그바운티 범위·손실 추정 편차·유사 사건 분석
- The Block — Kyber 경유 ETH 스왑·자금 분산(Arkham Intelligence)
- CertiK — $22M 추정 (독립 분석)
- Decurity — $11.86M 단일 TX 분석
- Cryptobriefing — $23.7M 상한 추정, TVL 72% 감소
- BeInCrypto / Decrypt / CryptoTimes / Protos / Cryptonomist — 공격 흐름·트렌드 보강

---

*본 리포트는 TLP:GREEN으로 분류되며, 커뮤니티 내 공유가 가능하나 공개 채널 게시 시 출처 대조를 권고한다.*

**Dennis Kim (김호광)**
