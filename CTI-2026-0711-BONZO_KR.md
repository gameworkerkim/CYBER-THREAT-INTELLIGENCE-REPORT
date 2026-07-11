
# Bonzo Finance 오라클 익스플로잇 — Hedera 대출 프로토콜 905만 달러 탈취 및 크로스체인 자금 이동 분석

서드파티 오라클 가격 조작으로 담보 가치를 12자리수 부풀려 과다 대출 실행 → LayerZero 경유 이더리움 브릿징 → 공격자 지갑 약 700만 달러 ETH 보유 확인

| 항목 | 내용 |
|------|------|
| 리포트 ID | CTI-2026-0711-BONZO |
| 발행일 | 2026-07-11 |
| 이슈 분류 | DeFi 오라클 익스플로잇 / 자금 탈취 및 크로스체인 이동 |
| 위협 등급 | HIGH |
| 영향 대상 | Bonzo Finance(Bonzo Lend) — Hedera 기반 대출 프로토콜 |
| 상태 | 프로토콜 일시 중단(Paused) / 조사 진행 중 |
| 작성자 | Dennis Kim |

## 1. 개요 (Executive Summary)

2026년 7월 11일 00:51 UTC경, Hedera 네트워크 기반 대출 프로토콜 **Bonzo Finance(Bonzo Lend)**가 오라클 검증 취약점을 악용한 공격을 받아 약 **905만 달러** 상당의 자산이 유출되었다. 공격자는 Bonzo가 연동한 **Supra 오라클**의 가격 피드 검증 결함을 이용해 SAUCE 토큰의 가격을 극단적으로 조작한 뒤, 담보 가치보다 훨씬 많은 자산을 대출받는 방식으로 자금을 탈취했다.

탈취된 자산 중 일부는 **LayerZero**를 통해 Hedera에서 이더리움 네트워크로 크로스체인 브릿징되었으며, 공격자 지갑(`0xaf20D792A19fD42dCf697ceBa6100291D96dD93e`)에는 약 **700만 달러** 상당의 ETH가 보관 중인 것으로 확인되었다. Bonzo 팀은 프로토콜과 포인트 프로그램을 일시 중단하고 피해 복구 및 대응 방안을 논의 중이다. Bonzo 측은 자체 대출 컨트랙트와 Hedera 합의 네트워크 자체는 손상되지 않았으며, 원인은 **서드파티 오라클의 취약점**이라고 밝혔다.

## 2. 공격 상세 (Attack Details)

### 타임라인

| 일시(UTC) | 이벤트 |
|------|--------|
| 2026-07-11 00:51경 | SAUCE 가격 조작 및 과다 대출 실행 — 익스플로잇 발생 |
| 2026-07-11 (직후) | 온체인 조사관 Specter, 자금이 Hedera에서 이더리움으로 이동하는 정황 최초 포착 |
| 2026-07-11 | 탈취 자산 중 370만 달러 이상이 LayerZero 경유 이더리움으로 브릿징, 일부 WBTC는 ETH로 스왑 |
| 2026-07-11 | Bonzo Finance, 프로토콜 및 포인트 프로그램 일시 중단(Paused) 공식화 |
| 2026-07-11 | 공격자 지갑 1시간 이내 920+ ETH 입금, 이후 77 ETH 추가 입금 확인 |

### 공격 메커니즘

Bonzo Lend는 Supra 오라클을 가격 피드로 사용해 왔다. 공개된 분석에 따르면 공격자는 다음 순서로 공격을 실행했다.

1. 가치가 사실상 몇 달러에 불과한 **SAUCE 토큰 약 250개**를 담보로 예치.
2. Supra 오라클 피드에 조작된 SAUCE 가격을 주입 — 실제 가치 대비 **약 12자리수(12 orders of magnitude)** 부풀림.
3. 수 초 만에 부풀려진 담보 가치를 근거로 **약 660만 USDC와 3,450만 WHBAR(Wrapped HBAR)** 상당을 과다 대출.
4. 탈취 자산 일부를 LayerZero를 통해 Hedera → 이더리움으로 브릿징하고, WBTC 일부를 ETH로 전환.

Bonzo 측은 대출 컨트랙트 로직 및 Hedera 합의 네트워크 자체에는 결함이 없으며, 원인은 서드파티 오라클의 서명·가격 검증 메커니즘 결함이라고 밝혔다.

## 3. 영향받은 자산 (Impacted Assets)

| 항목 | 금액 |
|------|------|
| 총 탈취 추정액 | 약 905만 달러 |
| 과다 대출 실행 규모 | 약 660만 USDC + 약 3,450만 WHBAR |
| 공격자 지갑 보유 ETH | 약 700만 달러 상당 |
| 브릿징된 자산 | 370만 달러 이상 (Hedera → Ethereum) |

## 4. 공격자 지갑 정보 (Attacker Wallet)

| 항목 | 내용 |
|------|------|
| 지갑 주소 | `0xaf20D792A19fD42dCf697ceBa6100291D96dD93e` |
| 보유 자산 | 약 700만 달러 상당의 ETH (ethereum:native) |
| 입금 내역 | 1시간 이내 920+ ETH 입금, 이후 77 ETH 추가 입금 |

해당 지갑의 소유주 신원은 현재까지 공개적으로 확인되지 않았으며, 해당 지갑이 공격자와 직접 연결되었다는 주장은 아직 독립적으로 검증되지 않았다.

## 5. 대응 조치 (Response & Mitigation)

| 조치 | 상태 |
|------|------|
| Bonzo 프로토콜 일시 중단 | 완료 |
| Bonzo Labs 및 Bonzo Finance Foundation 복구 작업 착수 | 진행 중 |
| 온체인 조사관(Specter) 자금 추적 | 진행 중 |

## 6. 2026년 DeFi 오라클·브릿지 사고 흐름 속 위치

본 사건은 오라클 가격 피드를 신뢰의 단일 실패점으로 삼는 대출 프로토콜의 구조적 취약성을 다시 드러낸다. 담보 가치를 검증하는 오라클이 조작되면, 대출 컨트랙트 자체의 로직이 정상이더라도 담보 한도를 초과한 대출이 그대로 승인된다는 점에서 앞서 보고된 여러 크로스체인·오라클 관련 사고(예: [CTI-2026-0622-TAIKOBRIDGE](CTI-2026-0622-TAIKOBRIDGE_KR.md), [CTI-2026-0528-KELPDAO](CTI-2026-0528-KELPDAO_KR.md))와 동일한 계열의 문제다.

2026년 2분기 기준 DeFi 부문에서만 83건의 보안 사고, 총 7억 5,500만 달러 규모의 피해가 보고된 바 있으며, 본 사건은 그 흐름의 연장선상에 있다. 공격자가 탈취 자금을 즉시 현금화하지 않고 ETH로 보유하고 있다는 점은 향후 자금 세탁(믹서, 추가 크로스체인 브릿지 등) 또는 프로토콜 측과의 협상을 통한 자금 회수 가능성을 동시에 시사한다.

## 7. 탐지·완화 권고

**프로토콜 운영자**

1. 서드파티 오라클 단일 의존 지양 — 복수 오라클 소스 교차검증 및 이상치(outlier) 필터링 도입.
2. 담보 가치 급변 시 자동 정지(circuit breaker) 및 대출 한도 상한 설정.
3. 오라클 피드 서명·갱신 주기에 대한 정기 감사 및 레드팀 검증.

**거래소·브릿지 운영자**

4. 공격자로 지목된 주소에 대한 입금 모니터링 및 동결 협조.

**사용자**

5. Bonzo 공식 채널을 통한 안내만 신뢰하고, 사고 직후 급증하는 보상·복구 사칭 피싱에 유의.

## 8. 참고 사항 (Remarks)

- 현재까지 공격자의 신원은 확인되지 않았으며, 온체인 증거와 오프체인 조사가 병행되어야 정확한 귀속이 가능할 것으로 보인다.
- 탈취 규모, 대출 세부 수치는 온체인 데이터 및 후속 포렌식 결과에 따라 변경될 수 있다.

## 9. 참고 출처 (Sources)

- Cointelegraph(@Cointelegraph) X 포스트, 2026-07-11
- BingX Flash News, "Bonzo flags $9M missing as alleged exploiter wallet holds about $7M in Ethereum"
- BingX Flash News, "Hedera lending protocol Bonzo Lend reports $9.05M loss after oracle exploit"
- Bitget News, "Bonzo 協議遭遇攻擊，損失達 900 萬美元"
- CoinMarketCap Community, "Bonzo Alleged Exploiter Holds $7 Million in ETH"
- CoinMarketCap Community, "Bonzo Lend Oracle Exploit Triggers Cross-Chain Fund Transfers on Hedera"
- Specter(@SpecterAnalyst) X 포스트, 2026-07-11
- Yahoo Finance, "Hedera-Based Bonzo Lend Loses $9 Million in Oracle Exploit"
- crypto.news, "Suspected Hedera exploit sends over $5.8M to Ethereum as HBAR slips"

---

본 리포트는 2026년 7월 11일 현재까지 확인된 공개 정보를 기반으로 작성되었으며, 추후 추가 정보 유입 시 업데이트될 수 있다. 투자 조언이나 법적 조언이 아니다.

문의: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
