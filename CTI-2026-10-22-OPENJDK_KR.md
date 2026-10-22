# eMudhra 중간 CA 개인 키 유출 사건과 CVE-2026-91403

작성일: 2026-10-22
대상: Java/JVM 운영자, 백엔드 개발자, 보안 담당자

---

## 1. 사건 개요

인도의 인증 기관(CA) eMudhra가 운영하는 중간(intermediate) CA 인증서 8개의 개인 키가 공개 인증서만으로 복구 가능한 상태였던 것으로 드러났다. 이 키를 가진 사람은 누구든 전 세계 어떤 도메인에 대해서도 "신뢰되는" TLS 인증서를 위조할 수 있다.

이 사건은 소프트웨어 코드 결함이 아니라 웹 PKI 신뢰 체인 자체가 손상된 사고다. OpenJDK는 2026년 10월 21일 정기 분기 일정과 별개로 대역 외(out-of-band) 권고를 내고 이를 CVE-2026-91403(CVSS v3.1 9.1, Critical)으로 지정했다.

### 1.1 근본 원인

- 2025년 4월 30일 eMudhra는 키 생성 의식(key ceremony)에서 중간 CA 24개를 생성했고, 이 중 8개가 문제가 되었다.
- P-384 타원곡선 개인 키는 약 384비트의 무작위성을 가져야 하지만, 해당 8개 키는 3~8비트 수준의 엔트로피만 가졌다. 사실상 마지막 1바이트를 제외하면 전부 0인 값이다.
- 실제 개인 키 값은 4, 56, 66, 115, 155, 156, 230, 237이다. 즉 "EM OV TLS CA - G3C"의 개인 키는 숫자 4였다.
- eMudhra 설명에 따르면, 키 생성 스크립트의 결함으로 두 번째(약한) 키 쌍이 만들어졌고, 레이블이 원래 키와 비슷해 실수로 이 약한 키로 CSR이 생성되었다. 회사는 여러 단계의 인적 오류를 인정했다.
- 외부 침해(해킹)의 증거는 없다. 공격 없이도 공개 키로부터 개인 키를 1초 미만에 역산할 수 있었다는 점이 핵심이다.

### 1.2 영향받은 중간 CA

| 중간 CA | 용도 | 발급 주체 | 개인 키 값 |
|---|---|---|---|
| EM DV TLS CA - G3B | TLS (DV) | eMudhra BV | 156 |
| EM OV TLS CA - G3B | TLS (OV) | eMudhra BV | 155 |
| EM EV TLS CA - G3B | TLS (EV) | eMudhra BV | 115 |
| EM DV TLS CA - G3C | TLS (DV) | eMudhra Inc | 230 |
| EM OV TLS CA - G3C | TLS (OV) | eMudhra Inc | 4 |
| EM EV TLS CA - G3C | TLS (EV) | eMudhra Inc | 56 |
| EM OV CS CA - G3B | 코드 서명 | eMudhra BV | 66 |
| EM OV CS CA - G3C | 코드 서명 | eMudhra Inc | 237 |

각 중간 CA는 두 경로로 존재한다. eMudhra emSign 루트가 서명한 인증서와 Sectigo의 AAA Certificate Services가 교차 서명(cross-sign)한 인증서다. 그래서 차단 대상 인증서는 8개가 아니라 16개가 된다.

### 1.3 타임라인

| 일시 | 내용 |
|---|---|
| 2025-04-30 | eMudhra 키 생성 의식에서 약한 키로 중간 CA 생성 |
| 2026-10-17 | 연구자 Wayne이 CCADB 점검 중 발견. 8개 키 각각으로 "We have a problem here" 메시지에 서명해 Apple, Google, Microsoft, Mozilla, eMudhra에 보고. Chrome, Firefox 수 시간 내 차단 |
| 2026-10-18 | eMudhra, 8개 중간 CA를 CA_COMPROMISE 사유로 폐기(revoke) |
| 2026-10-19 | Apple 차단. 하위 신뢰 저장소에 책임 있는 공개 |
| 2026-10-20 | Microsoft 차단. 사건 공개(emudhra.we-have-a-problem.com). Mozilla가 emSign ECC Root CA - G3를 NSS에서 제거 |
| 2026-10-21 | OpenJDK 대역 외 권고(CVE-2026-91403), Oracle 보안 경보, Azul 대역 외 릴리스 |
| 2026-10-27 (예정) | Chrome Root Store에서 emSign ECC Root CA - G3 제거 |

---

## 2. 위협 요소

### 2.1 무엇이 가능한가?

- 임의 웹사이트 사칭: 은행, 클라우드 API, 사내 SSO 등 어떤 도메인이든 유효한 HTTPS 인증서를 위조할 수 있다.
- 중간자 공격(MITM): 네트워크 경로에 있는 공격자가 TLS 트래픽을 복호화하고 변조할 수 있다.
- 코드 서명 위조: 8개 중 2개는 코드 서명용 CA이므로, 악성 바이너리에 "정상 서명"을 붙일 수 있다.

### 2.2 왜 Java가 특히 위험한가?

브라우저는 CRLSet, OneCRL 같은 자체 차단 목록으로 중간 CA를 원격 차단할 수 있어 이미 보호받고 있다. Chrome은 SPKI 해시 단위로 차단해 업데이트나 재시작 없이 즉시 보호가 적용됐다.

반면 Java는 다르다.

- Java는 기본 설정에서 인증서 해지(revocation)를 확인하지 않는다. eMudhra가 인증서를 폐기했어도 패치되지 않은 JVM은 그대로 신뢰한다.
- 실제 테스트에서 OpenJDK 27.0.1(패치 전 빌드), Liberica JDK 21.0.10 등이 기본 설정으로 손상된 체인을 통한 TLS 연결을 성공시켰다.
- 브라우저와 달리 서버 측 Java 애플리케이션(결제 연동, 외부 API 호출, 웹훅, 크롤러 등)은 사용자가 인증서 경고를 볼 기회조차 없다.
- CI 러너, 컨테이너 이미지, 임베디드 JRE 등 업데이트가 늦는 런타임이 많다.

### 2.3 실제 악용 여부

- 2026-10-21 기준 악의적 사용은 확인되지 않았다.
- eMudhra는 8개 중 1개만 운영 환경에 배포됐고, 8개 모두 최종 사용자(end-entity) 인증서를 발급한 적이 없다고 밝혔다.
- 다만 SafeDep는 10월 19일부터 위조 인증서가 CT 로그에 나타났다고 보고했다. 키 값이 공개된 이상 누구나 서명 가능하므로, 10월 17일 이후에도 패치되지 않은 클라이언트를 가장 높은 위험군으로 봐야 한다.
- Google은 CT 로그가 이 CA로 체인되는 인증서를 거부하도록 조치했다.

---

## 3. 파급력

### 3.1 생태계 전반의 대응

| 구분 | 조치 |
|---|---|
| Google Chrome / Android | 10-17 CRLSet으로 SPKI 차단, 10-27 루트 제거 예정 |
| Mozilla Firefox | 10-17 차단, 10-20 emSign ECC Root CA - G3를 NSS에서 제거 |
| Apple | 10-19 차단 |
| Microsoft | 10-20 차단(코드 서명 CA 포함) |
| Go | crypto/x509 관련 CVE-2026-111943 |
| Firefox OneCRL | CVE-2026-113470 |
| Python certifi | 2026.10.19에서 emSign ECC Root CA - G3 제거 |
| Rust webpki-roots | 1.0.10에서 제거 |
| curl CA bundle | 2026-10-20 |
| Composer ca-bundle | 1.4.16, 1.6.0 |
| Alpine ca-certificates | 20261020-r0 |
| Arch ca-certificates-mozilla | 3.131.1-1 |
| Debian ca-certificates, FreeBSD ca_root_nss | 작성 시점 대기(Pending) |
| RHEL / UBI ca-certificates | 10-22 기준 패키지 없음, RHSB-2026-012 우회책 사용 |

eMudhra는 G3 루트 아래 신규 인증서 발급을 중단했다. eMudhra는 6천만 건 이상의 디지털 인증서를 발급했다고 밝혀온 CA여서, 신뢰 저장소 정리 작업의 범위가 크다.

### 3.2 교훈

- 하드웨어 보안 모듈이나 정형화된 의식이 있어도, 스크립트 하나와 레이블 혼동으로 전체 신뢰 체인이 무너질 수 있다.
- 브라우저 외 소프트웨어 대부분은 중간 CA를 필터링하는 메커니즘이 없다. 그래서 많은 프로젝트가 중간 CA 차단 대신 루트 자체를 제거하는 방식을 택했다.
- "인증서 해지가 기본 비활성"인 런타임은 CA 사고에 구조적으로 취약하다.

---

## 4. 업데이트 및 대응 방법

### 4.1 영향 여부 확인

```bash
# Java 버전 확인
java -version

# OS 신뢰 저장소를 쓰는지 확인 (Debian/Ubuntu)
readlink -f "$JAVA_HOME/lib/security/cacerts"
# /etc/ssl/certs/java/cacerts 가 출력되면 OS 저장소 사용
```

### 4.2 1순위: JDK 업그레이드

OpenJDK 권고 기준 패치 버전은 다음과 같다(또는 그 이후).

| 라인 | 패치 버전 |
|---|---|
| JDK 27 | 27.0.1 (패치 빌드) |
| JDK 25 | 25.0.5 |
| JDK 21 | 21.0.13 |
| JDK 17 | 17.0.21 |
| JDK 11 | 11.0.33 |
| JDK 8 | 8u511 / 8u512 |

주의: JDK 8 패치 번호는 출처마다 다르게 표기된다(사건 요약 사이트는 8u511, 일부 정리 자료는 8u512). JDK 27도 27.0.1 초기 빌드는 취약했고 패치 빌드(27.0.1.0.2)가 별도로 나왔다. 반드시 벤더 릴리스 노트에서 "eMudhra 차단 포함" 여부를 확인할 것.

벤더별 상황(10-22 기준):

- Azul Zulu: 10-21 대역 외 릴리스로 JDK 27/25/21/17/11/8/7/6 전부 blocked.certs에 추가. 업그레이드 후 수동 조치 불필요.
- Oracle JDK: 패치 준비 중. 그 전까지 blocked.certs 교체 또는 해지 확인 활성화 권고.
- Eclipse Temurin: 10-22 기준 수정 버전 없음. blocked.certs 추가 후 재시작.
- BellSoft Liberica: keytool 기반 임시 완화책 안내.

### 4.3 2순위: blocked.certs 교체 (업그레이드 불가 시)

JVM은 체인의 각 인증서 SHA-256 지문을 `$JAVA_HOME/lib/security/blocked.certs`와 대조한다.

1. OpenJDK/Oracle이 배포하는 새 blocked.certs를 OS에 맞게 받는다(Windows용과 그 외 OS용이 따로 있음).
2. 기존 파일을 백업한다. 이미 직접 추가한 항목이 있으면 새 파일에 다시 넣는다.
3. `$JDK_HOME/lib/security/blocked.certs`를 교체한다. JDK 8은 `blacklisted.certs`.
4. JVM을 재시작한다.

```bash
jdk="$JAVA_HOME"
blocked="$jdk/lib/security/blocked.certs"
cp "$blocked" "$blocked.bak"
# 배포된 blocked.certs로 교체하거나, 16개 SHA-256 지문을 append
```

주의 사항

- blocked.certs와 해지 설정은 Java 설치본마다 따로 적용된다. 서버에 JDK가 여러 개면 전부 처리해야 한다.
- cacerts에서 emSign 루트만 삭제하는 것은 불충분하다. 교차 서명 경로(Sectigo AAA Certificate Services)로 여전히 체인이 성립할 수 있다. 정밀 차단은 16개 지문을 blocked.certs에 넣는 방식이다.
- 컨테이너는 Dockerfile에서 파일을 덮어쓴 뒤 이미지를 재빌드해야 한다.

### 4.4 보조: 인증서 해지 확인 활성화

```bash
java -Dcom.sun.net.ssl.checkRevocation=true \
     -Dcom.sun.security.enableCRLDP=true \
     -jar app.jar
```

eMudhra가 이미 인증서를 폐기했으므로 해지 확인을 켜면 `CertificateRevokedException (reason: CA_COMPROMISE)`로 연결이 거부된다. 다만 OCSP/CRL 서버 응답 지연, 오프라인 환경, soft-fail 동작에 따라 신뢰성이 떨어지므로 단독 대책이 아니라 보조 수단으로 쓴다.

### 4.5 OS 패키지 OpenJDK 사용자

- Debian, Ubuntu, Fedora, Arch 등 OS 패키지 OpenJDK는 OS 신뢰 저장소에서 cacerts를 만든다. `ca-certificates`를 업데이트하고 JVM을 재시작하면 된다(Debian은 작성 시점 대기 상태이므로 확인 필요).
- RHEL/UBI는 10-22 기준 패키지가 없어 Red Hat의 RHSB-2026-012 우회책을 따른다.
- FreeBSD, Homebrew는 OpenJDK 자체를 업데이트하거나 blocked.certs를 직접 처리해야 한다.

### 4.6 체크리스트

- [ ] 모든 서버, CI 러너, 컨테이너 베이스 이미지의 Java 버전 목록화
- [ ] 패치 JDK로 업그레이드 또는 blocked.certs 교체
- [ ] JDK가 여러 개 설치된 호스트는 각각 처리
- [ ] Docker 이미지 재빌드 및 재배포
- [ ] OS ca-certificates 업데이트
- [ ] JVM 재시작 확인
- [ ] 10-17 이후 외부 TLS 통신 로그 중 eMudhra 체인 사용 흔적 점검
- [ ] 코드 서명 검증 파이프라인에서 eMudhra CS CA 서명 바이너리 재검토

---

## 5. 레퍼런스

공식 및 1차 출처

- OpenJDK Vulnerability Advisories (2026/10/21 대역 외 권고 포함): https://openjdk.org/groups/vulnerability/advisories
- Oracle, Distrusting eMudhra Intermediate Certificates in Oracle JDK: https://ops.java/emudhra
- Google Security Blog, Protecting Chrome and Android Users from Compromised eMudhra Intermediate CA Certificates: https://blog.google/security/protecting-chrome-and-android-users-from-compromised-emudhra-intermediate-ca-certificates/
- eMudhra Intermediate CA Compromise 요약 사이트(Dennis Jackson): https://emudhra.we-have-a-problem.com/
- Azul Zulu Release Notes (Out-of-Cycle October 21, 2026): https://docs.azul.com/core/release-notes

기술 분석 및 대응 가이드

- SafeDep, eMudhra CA Key Compromise: Response Guide for Developers: https://safedep.io/emudhra-ca-key-compromise/
- Guillaume Laforge, The eMudhra CA Compromise: Why Your JVM Is Vulnerable: https://glaforge.dev/posts/2026/10/21/the-emudhra-ca-compromise-why-your-jvm-is-vulnerable-and-how-to-fix-it/
- BellSoft, Distrusting compromised eMudhra intermediates in Java: https://bell-sw.com/blog/distrusting-compromised-emudhra-intermediates-in-java
- Testing CVE-2026-91403 on OpenJDK and Temurin: https://lilting.ch/en/articles/openjdk-cve-2026-91403-emudhra-cacerts
- SOCRadar, eMudhra CA Key Compromise: Weak Keys, Risks and Fixes: https://socradar.io/blog/emudhra-ca-key-compromise-weak-keys-risks-and-fixes/

보도

- SecurityWeek: https://www.securityweek.com/browsers-block-emudhra-intermediate-cas-over-recoverable-private-keys/
- BleepingComputer: https://www.bleepingcomputer.com/news/security/mozilla-google-apple-block-compromised-emudhra-ca-certificates/
- The Hacker News: https://thehackernews.com/2026/10/eight-emudhra-ca-keys-compromised.html
- Help Net Security: https://www.helpnetsecurity.com/2026/10/21/emudhra-certificates-private-keys-compromised/
- The Register: https://www.theregister.com/security/2026/10/20/indian-certification-authority-emudhras-private-keys-compromised-one-of-them-was-the-number-4/5304312
- InfoQ: https://www.infoq.com/news/2026/10/emudhra-ca-compromise/
- Wikipedia, eMudhra: https://en.wikipedia.org/wiki/EMudhra

---

이 문서는 2026-10-22 시점 공개 자료를 기준으로 작성되었다. 벤더 패치 상태는 빠르게 바뀌므로 적용 전 각 벤더의 최신 공지를 확인할 것.
