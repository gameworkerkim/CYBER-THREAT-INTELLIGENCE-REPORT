| id             | CTI-2026-0528-KELPDAO                                                                                                                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title          | KelpDAO LayerZero 브리지 해킹 — 오프체인 검증 인프라의 단일 장애점에 대한 지능형 공격                                                                                                                                                          |
| subtitle       | 1-of-1 DVN, RPC 노드 포이즈닝, 그리고 DeFi 전반으로 번진 시스템 리스크                                                                                                                                                                 |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                                                                                                                  |
| email          | gameworker@gmail.com                                                                                                                                                                                            |
| github         | gameworkerkim                                                                                                                                                                                                   |
| date           | 2026-05-28                                                                                                                                                                                                      |
| classification | TLP:GREEN                                                                                                                                                                                                       |
| severity       | CRITICAL                                                                                                                                                                                                        |
| lang           | ko                                                                                                                                                                                                              |
| tags           | | Web3-Security | DeFi | Lazarus-Group | Cross-Chain | North-Korea | Bridge-Security | RPC-Compromise | | -------------- | --- | ------------- | ----------- | ------------ | --------------- | --------------- | |
| threat\_actors | | Lazarus Group (TraderTraitor · North Korea-nexus) | | -------------------------------------------------- |                                                                                                  |
| cve            | 해당 없음 (스마트 컨트랙트 결함이 아닌 오프체인 인프라 설계 취약점 공격)                                                                                                                                                                       |
| frameworks     | | MITRE ATT&CK (T1566, T1499, T1195, T1583) | NIST SP 800-207 (Zero Trust) | | ----------------------------------------- | ---------------------------- |                                                              |
| license        | CC BY-NC-SA 4.0                                                                                                                                                                                                 |


# KelpDAO LayerZero 브리지 해킹 — 오프체인 검증 인프라의 단일 장애점에 대한 지능형 공격

> **리포트 ID** `CTI-2026-0528-KELPDAO` · **발행일** 2026-05-28 · **분류** `TLP:GREEN` · **심각도** 🔴 CRITICAL **저자** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*1-of-1 DVN, RPC 노드 포이즈닝, 그리고 DeFi 전반으로 번진 시스템 리스크*

---


## 목차

1. [요약 (TL;DR)](#요약-tldr)
2. [사건 개요](#1-사건-개요)
3. [기술 분석 — 공격 벡터](#2-기술-분석--공격-벡터)
4. [영향 평가 — 국내·Web3 여파](#3-영향-평가--국내web3-여파)
5. [대응 및 완화 방안](#4-대응-및-완화-방안)
6. [결론과 권고](#5-결론과-권고)
7. [참고 문헌](#참고-문헌-references)

---


## 요약 (TL;DR)

2026년 4월 18일, 북한 연계 해커 조직 **라자루스 그룹(Lazarus Group)의 하위 조직 TraderTraitor**가 리퀴드 리스테이킹 프로토콜 **KelpDAO**의 LayerZero 브리지 인프라를 공격해 **116,500 rsETH(약 2억 9,200만 달러, 한화 약 4,000억 원)** 를 탈취했다. 이는 **2026년 최대 DeFi 해킹 사건**으로 기록됐다 [[1]](#ref-1)[[2]](#ref-2).

특히 주목할 점은 이번 공격이 스마트 컨트랙트 버그나 가격 오라클 조작 같은 알려진 취약점이 아닌, **오프체인 검증 인프라(off-chain infrastructure)** 의 설계 결함을 정밀하게 파고든 **신종 수법**이라는 사실이다. 온체인 트랜잭션 자체는 서명·메시지 형식·컨트랙트 호출이 모두 정상으로 보였기 때문에, 기존 온체인 보안 솔루션은 이 공격을 탐지하지 못했다 [[1]](#ref-1).

공격의 핵심은 다음과 같다.

1. **1-of-1 단일 검증자(DVN)** 설정으로 인한 단일 장애점(Single Point of Failure) [[3]](#ref-3)
2. **RPC 노드 장악**: LayerZero Labs DVN이 사용하는 RPC 노드 2곳을 침투·변조하고, 검증되지 않은 외부 RPC 노드에 DDoS 공격을 가해 오염된 노드로 페일오버(failover) 유도 [[6]](#ref-6)
3. **가짜 소각 데이터 주입**: 변조된 노드를 통해 소스 체인에서 rsETH가 '소각'된 것처럼 위조 데이터를 DVN에 전달
4. **브리지 컨트랙트의 무단 자금 방출**: 정상 검증을 거친 것처럼 위장해 116,500 rsETH를 탈취

### Key Judgments

| #    | 판단                                                                                                                                                  | 신뢰도             |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| KJ-1 | 이번 사건의 근본 원인은 스마트 컨트랙트 버그가 아닌 **1-of-1 DVN이라는 오프체인 검증 구조의 단일 장애점**이며, 이는 LayerZero의 기본 설정·퀵스타트가 1/1 구조를 제시해 온 점과 결합해 **생태계 전반의 구조적 리스크**로 정의해야 한다.   | **High**        |
| KJ-2 | 공격은 온체인 측면에서 완전히 정상으로 보였으므로 전통적 온체인 보안 솔루션으로는 탐지 불가능했다. **체인 간 불변식 모니터링(cross-chain invariant monitoring)** 만이 이 계열 공격을 사전 탐지할 수 있다.                     | **High**        |
| KJ-3 | 라자루스/TraderTraitor는 **Drift($285M)와 KelpDAO($292M) 단 두 건만으로 2026년 전 세계 암호화폐 해킹 피해의 76%(약 5.77억 달러)** 를 차지했다. 이는 북한 위협이 국내 Web3 생태계에 대한 실질적·임박한 위협임을 의미한다. | **High**        |
| KJ-4 | 탈취된 rsETH가 Aave 등에서 무담보 차입의 담보로 재사용되며 **단일 프로토콜 해킹이 DeFi 전반의 시스템 리스크**로 전이됐다. 자산 간 상호연결성이 전염(contagion)의 통로가 됐다.                                       | **Medium-High** |
| KJ-5 | Aave 주도의 민간 연합 구제(**DeFi United**)는 2008년 정부 주도 구제금융과 대비되는 새 이정표이나, 동일 사건의 재발을 막는 구조적 해법은 아니며 상장·담보 기준 개편이 병행돼야 한다.                                       | **Medium**      |

---


## 1. 사건 개요

### 1.1 기본 정보

| 항목 | 내용 |
|------|------|
| **피해 대상** | KelpDAO (이더리움 기반 리퀴드 리스테이킹 프로토콜, rsETH 발행) |
| **공격 일시** | 2026년 4월 18일 |
| **피해 규모** | 116,500 rsETH ≈ 2억 9,200만 달러 (rsETH 유통량의 상당 부분) [[1]](#ref-1)[[11]](#ref-11) |
| **공격 경로** | LayerZero 브리지 — 오프체인 검증 인프라(RPC 노드) |
| **배후** | 북한 정찰총국 연계 Lazarus Group, TraderTraitor 하위 조직 (LayerZero 공식 포스트모템·TRM Labs 귀속) [[3]](#ref-3)[[10]](#ref-10) |
| **2차 탈취 차단** | KelpDAO가 컨트랙트 일시정지(pause)로 추가 1억 달러 이상(2건의 위조 거래) 차단 [[11]](#ref-11) |
| **사후 대응** | KelpDAO rsETH 컨트랙트 동결, Arbitrum Security Council의 약 30,766 ETH(약 7,150만 달러) 동결 [[8]](#ref-8) |

> ⚠️ **수치 정정 메모**: 본 보고서는 1차 자료 교차검증 결과, 일부 2차 보도에서 혼동된 수치를 다음과 같이 확정한다. ① Aave가 입은 부실채무는 약 **1.237억~2.301억 달러** 수준이며(공격자가 Aave에서 차입한 금액 약 1.9억 달러), 일부 초기 보도의 "195억 달러"는 명백한 오류다. ② 주 자금 세탁 경로는 토네이도 캐시가 아니라 **THORChain을 통한 BTC 전환**이다(토네이도 캐시는 사전 자금 조달 단계에서만 소량 사용).

### 1.2 DeFi 생태계 연쇄 영향

이번 해킹은 단일 프로토콜 피해로 끝나지 않았다. 공격자는 무담보로 발행된(unbacked) rsETH를 Aave V3에 담보로 예치하고 합법 자산을 차입했으며, 이로 인해 발생한 영향은 다음과 같다 [[4]](#ref-4)[[7]](#ref-7)[[15]](#ref-15).

| 항목 | 내용 |
|------|------|
| **Aave 차입·부실채무** | 공격자가 Aave에서 약 1.9억 달러 차입, 부실채무 추정 약 1.237억~2.301억 달러 |
| **Aave 예치금 이탈** | 48시간 내 80억 달러 이상(일부 집계 100억 달러) 순유출 |
| **DeFi 총 예치자산(TVL)** | 약 130억 달러 급감 (집계에 따라 $99.5B → $83.7B 수준) |
| **연쇄 청산 위기** | rsETH 페그 훼손으로 eMode 등 고LTV 포지션이 동시 청산 임계점 진입, '루핑(looping)' 거래 동결 |

---


## 2. 기술 분석 — 공격 벡터

### 2.1 1-of-1 단일 DVN 설정: 근본 원인

KelpDAO의 rsETH 크로스체인 메시징은 **단 하나의 검증자**인 LayerZero Labs DVN만 거치도록 설정되어 있었다. LayerZero에서 모든 크로스체인 메시지는 목적지 체인이 실행하기 전 하나 이상의 탈중앙 검증자 네트워크(DVN)의 검증을 거쳐야 한다. rsETH는 두 번째 DVN의 동의가 필요 없는 1-of-1 구조였고, 이는 본질적으로 단일 장애점을 제공한다 [[1]](#ref-1)[[3]](#ref-3).

책임 소재는 논쟁적이다. LayerZero는 다중 DVN 권고를 무시한 KelpDAO의 선택이라고 주장한 반면, KelpDAO는 LayerZero의 공식 퀵스타트 가이드와 기본 GitHub 설정(`layerzero.config.ts`) 자체가 1/1 구조를 제시했으며 LayerZero 담당자가 직접 안전성을 확인해 줬다고 반박했다 [[5]](#ref-5)[[12]](#ref-12). 실제로 사건 당시 활성 LayerZero OApp 컨트랙트의 약 **40~47%가 동일한 1-of-1 DVN 구성**을 사용하고 있었다 [[11]](#ref-11)[[12]](#ref-12). 사건 이후 LayerZero는 단일 검증자 구성에 대한 메시지 서명을 중단하기로 했고, KelpDAO는 rsETH를 **Chainlink CCIP**로 이전했다 [[5]](#ref-5).

### 2.2 오프체인 RPC 노드 침투: 실행 메커니즘

| 단계 | 설명 |
|------|------|
| **① 내부 노드 침투** | 공격자가 LayerZero Labs DVN이 사용하는 RPC 목록에 접근해 RPC 노드 2곳을 침투, 노드에서 실행되는 바이너리를 교체 [[11]](#ref-11) |
| **② DDoS로 페일오버 유도** | 침해되지 않은(uncompromised) 외부 RPC 노드에 DDoS 공격을 가해, 시스템이 오염된 노드로 페일오버하도록 강제 [[6]](#ref-6)[[11]](#ref-11) |
| **③ 위조 데이터 주입** | 변조된 노드들이 소스 체인에서 rsETH가 '소각(burn)'된 것처럼 거짓 상태 데이터를 DVN에 전송 |
| **④ 브리지 컨트랙트 실행** | DVN이 가짜 소각 데이터를 정상으로 검증함에 따라 이더리움 브리지 컨트랙트가 116,500 rsETH를 공격자 주소로 방출 |

Chainalysis 분석에 따르면 LayerZero가 1-of-1 RPC 쿼럼을 기본값으로 두었기 때문에, 노드 하나만 오염돼도 DVN이 다른 노드와 교차검증 없이 위조 메시지에 서명했다 [[5]](#ref-5).

### 2.3 기존 보안 솔루션의 탐지 실패

모든 온체인 트랜잭션의 서명·메시지 형식·컨트랙트 호출은 완전히 정상으로 보였기 때문에 전통적인 스마트 컨트랙트 기반 보안 솔루션은 이 공격을 전혀 탐지하지 못했다 [[1]](#ref-1). 이를 탐지하려면 **체인 간 불변식 모니터링(cross-chain invariant monitoring)** — 즉 목적지 체인에서 해제된 토큰이 소스 체인에서 소각된 토큰과 수학적으로 일치하는지 지속 검증하는 방식 — 이 필요하다.

### 2.4 자금 세탁 및 동결

탈취 자금은 약 36시간 내 1.75억 달러 상당이 **THORChain**을 통해 BTC로 전환됐으며, 이후 세탁 단계는 북한이 아닌 중국계 중개인들이 주로 처리한 것으로 분석된다 [[10]](#ref-10)[[30]](#ref-30). 사전 자금 조달의 일부는 2018년 라자루스 자금 세탁으로 기소된 중국 브로커 우후이후이(Wu Huihui) 통제 지갑과 BTCTurk 해킹까지 추적됐다 [[26]](#ref-26). 그러나 **Arbitrum Security Council**이 법 집행 기관과 협력해 약 30,766 ETH(약 7,150만 달러)를 동결하는 데 성공했다 [[8]](#ref-8).

---


## 3. 영향 평가 — 국내·Web3 여파

### 3.1 국내 영향

**① Web3·가상자산 업계 신뢰 위기** — KelpDAO는 국내 투자자·개발자 커뮤니티에서도 관심받던 프로젝트였다. rsETH가 주요 레이어2 및 Aave 등에서 광범위하게 사용되던 점을 고려하면, 국내 이용자의 간접 피해 가능성도 배제할 수 없다.

**② 금융당국의 규제 감시 강화** — 가상자산 이용자 보호법 시행 이후 규제를 강화해 온 금융당국은 이번 사건을 계기로 DeFi 프로토콜의 크로스체인 리스크 관리 기준을 엄격히 검토할 가능성이 높다. 특히 '오프체인 인프라'의 보안 수준을 평가 지표에 포함시키는 방향이 예상된다.

**③ 북한 사이버 위협 인식 제고** — 2026년 초 Drift Protocol(약 2억 8,500만 달러)과 KelpDAO(약 2억 9,200만 달러) 단 두 건의 해킹만으로 북한이 전 세계 암호화폐 해킹 피해액의 약 **76%(약 5.77억 달러)** 를 차지했다 [[24]](#ref-24)[[26]](#ref-26). 북한의 점유율은 2022년 22%, 2023년 37%, 2024년 39%, 2025년 64%에서 2026년 76%로 사상 최고치를 기록했다 [[25]](#ref-25). 국내 보안 업계와 금융당국 간 정보 공유 체계 강화가 시급하다.

**④ 국내 거래소·DeFi 서비스 대응** — 국내 주요 거래소들은 rsETH 및 관련 파생상품에 대한 상장 재검토와 위험 평가 기준 강화에 나설 것으로 보이며, 단일 검증자 구조를 가진 크로스체인 자산에 대한 별도 심사 도입을 검토할 것으로 예상된다.

### 3.2 Web3 업계 영향

**① 크로스체인 브리지 신뢰 하락과 마이그레이션** — 핵심 취약점은 LayerZero 프로토콜 자체가 아닌 DVN 설정 방식에 있었지만, 크로스체인 브리지 보안 모델 전반의 재검토가 불가피해졌다. 실제로 KelpDAO(약 15억 달러), SolvProtocol(약 6억 달러) 등 합산 TVL 약 20억 달러 규모 프로토콜이 LayerZero에서 **Chainlink CCIP**(검증에 최소 16개 독립 노드 운영자 요구)로 이동하고 있다 [[9]](#ref-9).

**② 오프체인 보안 솔루션 시장 급성장** — 온체인 중심 보안의 한계가 드러나면서 오프체인 인프라 모니터링·RPC 엔드포인트 진단·크로스체인 상태 검증 솔루션 수요가 급증할 전망이다.

**③ 'DeFi United' — 업계 연합 구제의 새 이정표** — Aave 주도로 출범한 민간 연합 구제 이니셔티브다. **최대 기여자는 당초 알려진 LayerZero·EtherFi가 아니라 Mantle과 Aave DAO**다 [[15]](#ref-15)[[18]](#ref-18).

| 참여자 | 기여 내용 |
|--------|----------|
| Mantle Treasury | 최대 30,000 ETH (3년 신용공여, Lido 스테이킹 수익률 +1%) |
| Aave DAO | 25,000 ETH (거버넌스 투표 진행) — Mantle과 합산 55,000 ETH(약 1.27억 달러) |
| Consensys / Joseph Lubin | 최대 30,000 ETH |
| Stani Kulechov (Aave 창립자) | 개인 5,000 ETH |
| EtherFi | 5,000 ETH |
| Lido DAO | 최대 2,500 stETH (약 570만 달러) |
| 기타 | Golem Foundation 1,000 ETH, Aave VP 500 ETH, Ethena·LayerZero·Ink·Frax·Tydro 등 |

DeFi United는 4월 25일 기준 약 1.6억 달러를 모금했으며, 필요 금액 약 2억 달러의 약 80%를 채웠다 [[17]](#ref-17). 이러한 민간 주도 대응은 2008년 정부 주도 은행 구제금융과 대비되며 DeFi의 성숙도를 보여주는 사례로 평가받는다.

**④ Aave의 담보·상장 기준 전면 개편** — Aave는 담보 자산 평가 기준을 가격 변동성뿐 아니라 사이버 보안·상호운용성·기본 아키텍처까지 확대하고, 신규 자산 발행자를 위한 공식 플레이북과 풀 간 체계적 상호연결성 조사를 도입하기로 했다.

---


## 4. 대응 및 완화 방안

### 4.1 크로스체인 브리지 아키텍처 수준

| 구분 | 대응 방안 | 우선순위 |
|------|----------|----------|
| DVN 구성 | **단일 검증자(1-of-1) → 다중 검증자(≥2-of-N) 전환** 필수 | ★★★★★ |
| RPC 보안 | RPC 엔드포인트 접근 통제·지리적 분산·인증 노드 전용, RPC 쿼럼 다중화 | ★★★★★ |
| 상태 검증 | 경량 클라이언트(Light Client) 또는 ZKP 기반 암호학적 검증 도입 | ★★★★☆ |
| 모니터링 | **크로스체인 불변식 모니터링** — 소스 체인 소각량과 목적지 체인 해제량 실시간 대조 | ★★★★☆ |

### 4.2 DeFi 프로토콜 수준

| 구분 | 대응 방안 |
|------|----------|
| **상장 기준** | 자산 상장 시 단일 장애점·오프체인 인프라 보안 수준을 평가 지표에 포함 |
| **리스크 파라미터** | eMode 등 고LTV 설정 시 크로스체인 인프라 리스크를 가격 변동성과 동등 수준으로 반영 |
| **비상 대응** | KelpDAO의 신속한 컨트랙트 동결(추가 1억 달러+ 차단) 사례를 벤치마킹한 조기 경보·자동 동결 메커니즘 |
| **포스트모템 공유** | 해킹 발생 시 상세 기술 분석·교훈을 업계와 공유하는 문화 정착 |

### 4.3 규제·정책 수준 (한국)

| 구분 | 대응 방안 |
|------|----------|
| **규제 프레임워크** | 가상자산 이용자 보호법에 '크로스체인 리스크 평가' 항목 추가 검토 |
| **정보 공유 체계** | KISA·금융보안원·주요 거래소 간 DeFi 위협정보 공유 협의체 구성 |
| **국제 공조** | Chainalysis·TRM Labs 등 글로벌 온체인 인텔리전스 기업과 협력 확대 |
| **투자자 교육** | '단일 검증자 브리지' 등 고위험 DeFi 구성에 대한 투자자 경고 가이드라인 마련 |

### 4.4 보안 업계·개발자 수준

| 구분 | 대응 방안 |
|------|----------|
| **오프체인 보안 진단** | RPC 노드 인프라 대상 정기 침투 테스트·취약점 진단 의무화 |
| **시큐어 코딩** | 크로스체인 브리지 구현 시 '단일 장애점 금지' 원칙 포함 가이드라인 배포 |
| **AI 보안 활용** | '가짜 소각' 같은 오프체인 이상 징후 탐지에 AI/머신러닝 모델 활용 |

---


## 5. 결론과 권고

KelpDAO 사건은 단순한 한 건의 해킹이 아니라 **크로스체인 브리지의 오프체인 검증 계층**이라는 방어 사각지대를 명확히 드러낸 구조적 사건이다. 온체인은 완벽하게 정상으로 보였으나, 신뢰의 근원인 오프체인 RPC가 오염되는 순간 전체 시스템이 무너졌다.

생태계 참여자는 다음 전제 위에서 크로스체인 자산을 취급해야 한다.

1. **단일 검증자(1-of-1) 구성은 비신뢰(untrusted)로 간주한다.** 다중 DVN·다중 RPC 쿼럼 없이는 운영 자산을 올리지 않는다.
2. **온체인 정상성 ≠ 안전.** 체인 간 불변식 모니터링 없이는 이 계열 공격을 탐지할 수 없다.
3. **자산 간 상호연결성은 곧 전염 경로다.** 담보 자산의 인프라 리스크를 가격 리스크와 동등하게 다뤄야 한다.
4. **북한 위협은 임박한 국가 안보 사안이다.** 두 건의 해킹으로 전 세계 피해의 76%를 차지한 현실은 국내 거버넌스·정보 공유 체계의 즉각적 강화를 요구한다.

보안은 속도의 반대말이 아니라, 속도를 오래 유지하기 위한 설계다. 크로스체인 생태계가 폭발적으로 채택되는 지금, 오프체인 검증 계층의 구조적 결함을 방치하면 이후의 피해는 복리로 증가한다.

---


## 참고 문헌 (References)

<a id="ref-1"></a>[1] Chainalysis, "Inside the KelpDAO Bridge Exploit", 2026. <https://www.chainalysis.com/blog/kelpdao-bridge-exploit-april-2026/>

<a id="ref-2"></a>[2] Galaxy Research, "KelpDAO/LayerZero Exploit Drains $290m, Freezes DeFi Markets", 2026.

<a id="ref-3"></a>[3] LayerZero, "KelpDAO Incident Statement", 2026-04-19. <https://layerzero.network/blog/kelpdao-incident-statement>

<a id="ref-4"></a>[4] CoinDesk, "Aave rallies DeFi partners to contain fallout from $292 million KelpDAO hack", 2026-04-23. <https://www.coindesk.com/business/2026/04/23/aave-rallies-defi-partners-to-contain-fallout-from-usd292-million-kelpdao-hack>

<a id="ref-5"></a>[5] Bitcoin.com News, "KelpDAO Slams LayerZero After $300M Exploit, Shifts rsETH to Chainlink CCIP", 2026. <https://news.bitcoin.com/kelpdao-slams-layerzero-after-300m-exploit-shifts-rseth-to-chainlink-ccip/>

<a id="ref-6"></a>[6] MEXC News, "LayerZero Labs open letter attempts to explain failures around KelpDAO hack", 2026-05-08. <https://www.mexc.com/news/1080101>

<a id="ref-7"></a>[7] Decrypt, "Aave Leads 'DeFi United' Push to Contain $292M KelpDAO Fallout", 2026-04-24. <https://decrypt.co/365431/aave-leads-defi-united-push-to-contain-292m-kelpdao-fallout>

<a id="ref-8"></a>[8] incrypted, "KelpDAO Accused LayerZero of an Infrastructure Failure Following the Hack", 2026. <https://incrypted.com/en/kelpdao-accused-layerzero-of-an-infrastructure-failure-following-the-hack/>

<a id="ref-9"></a>[9] coinpaper, "LayerZero, Lazarus and KelpDAO: The Full Story Behind the $292M Bridge Exploit", 2026. <https://coinpaper.com/16938/layer-zero-lazarus-and-kelp-dao-the-full-story-behind-the-bridge-exploit>

<a id="ref-10"></a>[10] The Block, "North Korea accounts for 76% of 2026 crypto hack losses…: TRM Labs", 2026. <https://www.theblock.co/post/399569/>

<a id="ref-11"></a>[11] CoinDesk, "Kelp says LayerZero approved setup it blamed for $292 million bridge hack", 2026-05-05. <https://www.coindesk.com/web3/2026/05/05/kelp-claims-that-layerzero-approved-the-setup-it-blamed-for-usd292-million-bridge-hack>

<a id="ref-12"></a>[12] CoinDesk, "Kelp DAO claims LayerZero's default settings are what actually caused the $290 million disaster", 2026-04-20. <https://www.coindesk.com/tech/2026/04/20/kelp-dao-claims-layerzero-s-default-settings-are-what-actually-caused-the-usd290-million-disaster>

<a id="ref-15"></a>[15] Decrypt, "Aave Leads 'DeFi United' Push…", 2026-04-24 (부실채무 추정 $123.7M–$230.1M). <https://decrypt.co/365431/>

<a id="ref-17"></a>[17] CoinDesk, "Aave raises nearly 80% of the $200 million it needs to cover bad debt left by Kelp DAO exploit", 2026-04-26. <https://www.coindesk.com/business/2026/04/26/>

<a id="ref-18"></a>[18] KuCoin, "DeFi United Raises $160M to Cover Aave Bad Debt from KelpDAO Exploit", 2026. <https://www.kucoin.com/news/flash/defi-united-raises-160m-to-cover-aave-bad-debt-from-kelpdao-exploit>

<a id="ref-24"></a>[24] The Block, "North Korea accounts for 76% of 2026 crypto hack losses, with theft since 2017 topping $6 billion: TRM Labs", 2026.

<a id="ref-25"></a>[25] crypto.news, "TRM Labs: North Korea-linked hackers drive 76% of 2026 crypto thefts", 2026. <https://crypto.news/trm-labs-north-korea-linked-hackers-drive-76-of-2026-crypto-thefts/>

<a id="ref-26"></a>[26] TRM Labs, "North Korea Stole 76% of All Crypto Hack Value in 2026 — With Just Two Attacks", 2026. <https://www.trmlabs.com/resources/blog/north-korea-stole-76-of-all-crypto-hack-value-in-2026-with-just-two-attacks>

<a id="ref-30"></a>[30] spaziocrypto, "North Korea: 76% of Crypto Hack Losses in 4 Months, 2026", 2026. <https://en.spaziocrypto.com/defi/north-korea-76-percent-crypto-hack-losses-2026/>

---


© 2026 Dennis Kim (김호광) · 본 문서는 독립 CTI 아카이브(TLP:GREEN) 공개를 목적으로 작성됐다.
문의: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
