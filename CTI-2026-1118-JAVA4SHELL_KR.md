# Java4Shell (CVE-2026-114938) 취약점 분석

작성 기준일: 2026-11-18

## 요약

Java4Shell(CVE-2026-114938)은 OpenJDK HotSpot JVM의 x86-64 Base64 디코딩 인트린식에서 발생하는 힙 기반 버퍼 오버플로이며, 2026년 11월 17일 Oracle 패치와 함께 공개됐다. 조작된 Base64 입력이 `java.util.Base64` 디코더에 도달하면 자바 힙 배열 끝을 62~63바이트 넘겨 쓰고, 조건이 맞으면 힙 메모리 유출과 인증 전 원격 코드 실행(RCE)으로 이어진다.

| 항목 | 내용 |
| --- | --- |
| CVE | [CVE-2026-114938](https://www.cve.org/CVERecord?id=CVE-2026-114938) |
| 유형 | 힙 기반 버퍼 오버플로 (CWE-122), 길이 계산 정수 언더플로에서 기인 |
| 위치 | HotSpot x86-64 Base64 decode 인트린식의 AVX-512 경로 (Oracle 분류: Compiler) |
| 심각도 | CVSS 4.0 9.2 Critical (Calif) / CVSS 3.1 8.1 High (Oracle, `AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H`) |
| 영향 버전 | OpenJDK 17.0.6 이후의 17, 21, 25, 27 계열 미패치 빌드, Oracle Java 8 Performance Pack 8u511b33-perf |
| 하드웨어 조건 | AVX-512 VBMI 지원 x86-64 CPU (Intel Ice Lake 이후 Xeon, AMD Zen 4 이후). ARM64는 비해당 |
| Oracle 수정 빌드 | 17.0.21.1, 21.0.13.1, 25.0.5.1, 27.0.1.1, 8u513-perf |
| 임시 완화 | `-XX:-UseBASE64Intrinsics` (우선), x86-64 한정 `-XX:UseAVX=2` |
| 실제 악용 | 11월 18일 기준 보고 없음, CISA KEV 미등재 |
| 발견자 | Calif의 Quang Luong, Albert Yang (Oracle 크레딧) |

출처: [Horizon3.ai](https://horizon3.ai/attack-research/vulnerabilities/cve-2026-114938/), [Upwind](https://www.upwind.io/blog/java4shell-what-we-know-now-and-what-comes-next), [Qualys](https://blog.qualys.com/vulnerabilities-threat-research/2026/11/17/how-to-find-mitigate-and-patch-the-critical-java4shell-flaw-cve-2026-114938-now), [BleepingComputer](https://www.bleepingcomputer.com/news/security/critical-java4shell-flaw-allows-rce-attacks-on-major-java-applications/)

## 기술 분석

결함은 Java 코드가 아니라 JIT가 끼워 넣는 수작업 어셈블리에 있다. 호출 메서드가 충분히 뜨거워지면 HotSpot은 `java.util.Base64`의 디코딩 루프를 AVX-512 VBMI 기반 인트린식 루틴으로 대체한다 ([Horizon3.ai](https://horizon3.ai/attack-research/vulnerabilities/cve-2026-114938/), [Qualys](https://blog.qualys.com/vulnerabilities-threat-research/2026/11/17/how-to-find-mitigate-and-patch-the-critical-java4shell-flaw-cve-2026-114938-now)).

오버플로가 일어나는 순서는 다음과 같다.

1. 디코딩 결과 버퍼 길이는 `ceil(입력 길이 / 4) * 3 - 패딩 수`로 계산된다 ([Calif 공개문 요약](https://calif.io/java4shell/)).
2. 인트린식은 마지막 1~3바이트짜리 부분 블록을 처리할 때, 블록 크기에서 뒤따르는 `=` 하나당 1바이트를 뺀 값을 출력 길이로 쓴다.
3. 패딩이 예상과 다르게 붙은 입력에서는 이 값이 음수가 된다. 정수 언더플로다.
4. 이 길이로 만든 저장 마스크가 전체 폭으로 해석되면서, 루틴이 목적지 배열 끝을 넘어 쓴다.
5. 초과 쓰기 크기는 꼬리가 `=`이면 62바이트, `==`이면 63바이트다 ([Endor Labs](https://www.endorlabs.com/learn/java4shell-unauthenticated-rce-reported-in-openjdk-17-cve-2026-114938) 재현 결과).
6. Java가 입력을 잘못된 Base64로 거부하는 시점은 이 쓰기가 끝난 뒤다.

넘쳐 쓴 바이트는 힙에서 바로 뒤에 놓인 객체로 들어간다. 인접 객체의 메타데이터가 덮이면 JVM 충돌(DoS)에 그치지 않고, 힙 메모리 판독과 코드 실행까지 이어질 수 있다 ([Wiz](https://www.wiz.io/blog/cve-2026-114938-rce-java4shell-openjdk), [Core Defences](https://coredefences.com/blogs/java4shell-openjdk-base64-rce-cve-2026-114938/)).

공개된 재현 입력은 65바이트 문자열이다. `A` 64개 뒤에 `=` 1개를 붙인 형태이며, 구형 17 빌드에서는 `A` 128개가 필요하다 ([Orca](https://orca.security/resources/research/java4shell-critical-openjdk-base64-decoder-flaw-could-allow-unauthenticated-remote-code-execution/), [BleepingComputer](https://www.bleepingcomputer.com/news/security/critical-java4shell-flaw-allows-rce-attacks-on-major-java-applications/)).

같은 디코더에는 JDK-8321599라는 별개의 과거 버그가 있었다. 이번 건과는 다른 결함이다 ([Upwind](https://www.upwind.io/blog/java4shell-what-we-know-now-and-what-comes-next)). 이번 결함을 들여온 커밋과 수정 커밋 ID는 열람한 자료에서 확인하지 못했다.

## 영향 범위

세 조건이 모두 맞아야 노출된다: 영향 받는 JVM 빌드, AVX-512 VBMI를 가진 x86-64 CPU, 그리고 신뢰할 수 없는 Base64 입력이 `Base64.getDecoder()` 또는 `getUrlDecoder()`에 도달하는 경로 ([Upwind](https://www.upwind.io/blog/java4shell-what-we-know-now-and-what-comes-next)).

### 버전

| 계열 | 영향 범위 | Oracle 수정 빌드 |
| --- | --- | --- |
| Java 27 | 27.0.1까지 | 27.0.1.1 |
| Java 25 | 25.0.5까지 | 25.0.5.1 |
| Java 21 | 21.0.13까지 | 21.0.13.1 |
| Java 17 | 17.0.6 ~ 17.0.21 | 17.0.21.1 |
| Java 11 | 영향 없음 | 해당 없음 |
| Java 8 (표준) | 영향 없음 | 해당 없음 |
| Java 8 Enterprise Performance Pack | 8u511b33-perf | 8u513-perf |

17.0.0 ~ 17.0.5는 영향을 받지 않는다. Oracle 권고문은 Oracle GraalVM for JDK 17.0.21.0.3, 21.0.13.0.3과 GraalVM Enterprise Edition 21.3.20.0.3도 영향 제품으로 적었다 ([Upwind](https://www.upwind.io/blog/java4shell-what-we-know-now-and-what-comes-next), [Qualys](https://blog.qualys.com/vulnerabilities-threat-research/2026/11/17/how-to-find-mitigate-and-patch-the-critical-java4shell-flaw-cve-2026-114938-now), [Horizon3.ai](https://horizon3.ai/attack-research/vulnerabilities/cve-2026-114938/)).

### 벤더 배포판

Amazon Corretto, Eclipse Temurin, Microsoft Build of OpenJDK, Azul Zulu, BellSoft Liberica, SapMachine, Red Hat OpenJDK는 같은 코드를 공유하므로 함께 영향을 받는다. 수정 버전 번호는 벤더마다 다르므로 Oracle 번호로 추정하면 안 된다.

- Amazon Corretto 17 수정 빌드: 17.0.21.1.2 ([Qualys](https://blog.qualys.com/vulnerabilities-threat-research/2026/11/17/how-to-find-mitigate-and-patch-the-critical-java4shell-flaw-cve-2026-114938-now))
- Temurin 17.0.21, 21.0.13, 25.0.5는 Upwind 실험에서 취약한 것으로 확인됐다. 수정 빌드 번호는 열람 자료에 없었다.
- 제품과 컨테이너 이미지, 어플라이언스 펌웨어에 번들된 JDK는 OS 업데이트로 패치되지 않는다.

### 하드웨어

취약 경로는 AVX-512 VBMI를 지원하는 x86-64에서만 실행된다.

- 해당: Intel Xeon Ice Lake, Sapphire Rapids, Emerald Rapids, Granite Rapids. AMD EPYC와 Ryzen Zen 4 이후.
- 비해당: ARM64 전체. Skylake-SP, Cascade Lake, Zen 4 이전 AMD처럼 VBMI가 없는 x86-64. AVX-512가 마스킹된 가상 CPU.

출처: [Qualys](https://blog.qualys.com/vulnerabilities-threat-research/2026/11/17/how-to-find-mitigate-and-patch-the-critical-java4shell-flaw-cve-2026-114938-now), [Endor Labs](https://www.endorlabs.com/learn/java4shell-unauthenticated-rce-reported-in-openjdk-17-cve-2026-114938), [NoLimitCloud](https://nolimitcloud.eu/blogs/security/java4shell-cve-2026-114938)

## 익스플로잇 가능성

범용 익스플로잇은 없으며, 제품마다 조작된 Base64를 디코더까지 실어 보낼 고유한 경로가 필요하다. Oracle이 공격 복잡도를 High로 매긴 이유다 ([BleepingComputer](https://www.bleepingcomputer.com/news/security/critical-java4shell-flaw-allows-rce-attacks-on-major-java-applications/)).

Calif가 기본 설정에서 시연했다고 밝힌 대상은 다음과 같다.

| 구분 | 제품 |
| --- | --- |
| 인증 전 RCE | Keycloak, Atlassian Jira, Atlassian Confluence, JFrog Artifactory, Jenkins, PingFederate |
| 인증 후 RCE | Apache Kafka Broker, Apache Solr, Elasticsearch, Gerrit, Spinnaker |
| 샘플 앱 | Apache Struts, Spring Boot 기반 예제 애플리케이션 |

그 밖에 확인된 사실은 다음과 같다.

- **힙 유출**: 코드 실행 이전 단계에서 자바 힙을 읽을 수 있다. 힙에는 개인키, 토큰, 개인정보가 들어 있을 수 있다 ([Qualys](https://blog.qualys.com/vulnerabilities-threat-research/2026/11/17/how-to-find-mitigate-and-patch-the-critical-java4shell-flaw-cve-2026-114938-now)).
- **클라이언트 측 공격**: 연구진은 Java 프로그램이 악성 서버에 TLS로 접속하는 것만으로 침해되는 시나리오도 기술했다 ([Qualys](https://blog.qualys.com/vulnerabilities-threat-research/2026/11/17/how-to-find-mitigate-and-patch-the-critical-java4shell-flaw-cve-2026-114938-now)).
- **제3자 재현**: Wiz는 전체 공개 전에 2시간 안에 PoC를 만들었고 Jenkins, Confluence, Apache Tomcat에 대한 원격 악용을 증명했다고 밝혔다 ([Wiz](https://www.wiz.io/blog/cve-2026-114938-rce-java4shell-openjdk)). Upwind는 AWS c6i 인스턴스에서 재현했다 ([Upwind](https://www.upwind.io/blog/java4shell-what-we-know-now-and-what-comes-next)).
- **공개 범위**: Calif는 메모리 손상을 보여주는 안전한 재현 코드만 공개했고, 제품별 익스플로잇은 보류 중이다.
- **실제 악용**: 11월 18일 기준 야생 악용 보고는 없고 CISA KEV에도 올라 있지 않다 ([ThreatDefence](https://threatdefence.com/article/java4shell-cve-2026-114938-openjdk-rce-patching-hunting)). Calif가 Oracle에 제보한 건이지만 패치 전에 세부 정보가 유출됐고, 근본 원인과 기법이 공개됐으므로 이 상태가 유지된다고 가정하면 안 된다.
- **발견 경위**: Calif의 Quang Luong이 OpenAI Codex로 약 1시간 만에 결함을 찾고, 추가 2시간가량에 초기 익스플로잇을 만들었으며 AI 비용은 200달러 미만이었다고 보도됐다 ([BleepingComputer](https://www.bleepingcomputer.com/news/security/critical-java4shell-flaw-allows-rce-attacks-on-major-java-applications/)).

## 대응

완전한 해결책은 런타임 패치뿐이며, JVM 플래그는 패치 전까지의 임시 조치다. Oracle은 공식 우회책을 내지 않았고, 아래 플래그는 Calif와 보안 벤더가 권고한 것이다 ([Horizon3.ai](https://horizon3.ai/attack-research/vulnerabilities/cve-2026-114938/)).

### 1. 노출 여부 점검

CPU 조건은 네 플래그가 모두 보일 때만 충족된다 ([Qualys](https://blog.qualys.com/vulnerabilities-threat-research/2026/11/17/how-to-find-mitigate-and-patch-the-critical-java4shell-flaw-cve-2026-114938-now)).

```bash
grep -m1 '^flags' /proc/cpuinfo | tr ' ' '\n' | grep -E '^(avx512f|avx512bw|avx512vbmi|bmi2)$'
```

런타임은 설치된 패키지가 아니라 실행 중인 프로세스 기준으로 확인한다. `java -version`은 셸 PATH의 바이너리를 보여줄 뿐이다 ([Endor Labs](https://www.endorlabs.com/learn/java4shell-unauthenticated-rce-reported-in-openjdk-17-cve-2026-114938)).

```bash
ps -eo pid,args | grep '[j]ava'
readlink -f /proc/<PID>/exe
jcmd <PID> VM.version
jcmd <PID> VM.flags -all
```

### 2. 패치

- Oracle Java SE: 17.0.21.1, 21.0.13.1, 25.0.5.1, 27.0.1.1, 8u513-perf로 올린다.
- 다른 배포판: 각 벤더 권고문의 수정 빌드를 따른다. Corretto 17은 17.0.21.1.2다.
- 우선순위: 인터넷에 노출된 AVX-512 VBMI 호스트 위의 Keycloak, Jira, Confluence, Artifactory, Jenkins, PingFederate부터 처리한다.
- 패치 후 모든 Java 프로세스를 재시작하고, 컨테이너 이미지는 다시 빌드해 배포한다.

### 3. 임시 완화 (패치가 지연될 때)

| 플래그 | 효과 | 주의점 |
| --- | --- | --- |
| `-XX:-UseBASE64Intrinsics` | 취약한 인트린식을 끈다. 모든 아키텍처에서 동작하며 Upwind가 시험한 모든 영향 버전에서 오버플로를 막았다. | 대용량 Base64 처리가 느려질 수 있다. 먼저 시험한다. |
| `-XX:UseAVX=2` | AVX-512 경로 전체를 피한다. | x86-64 전용이다. ARM JVM은 이 플래그로 기동되지 않는다. 다른 최적화도 함께 꺼진다. |
| `-XX:DisableIntrinsic=_base64_decodeBlock` | 사용 금지 | 단독으로 주면 JVM이 기동되지 않는다. `JAVA_TOOL_OPTIONS`로 뿌리면 전사 장애가 난다. |

플래그는 재시작 후에야 적용된다. 컨테이너는 재생성해야 실행 프로세스에 반영된다 ([Upwind](https://www.upwind.io/blog/java4shell-what-we-know-now-and-what-comes-next)).

### 4. 보조 통제

- 패치 전까지 외부 노출 Java 서비스와 관리 인터페이스 접근을 제한한다.
- WAF 규칙은 일부 경로만 막는다. 자체 개발 앱의 코드 경로는 다 덮지 못한다 ([Wiz](https://www.wiz.io/blog/cve-2026-114938-rce-java4shell-openjdk)).
- 리버스 프록시의 요청 버퍼링은 일부 익스플로잇 체인만 끊는다 ([Qualys](https://blog.qualys.com/vulnerabilities-threat-research/2026/11/17/how-to-find-mitigate-and-patch-the-critical-java4shell-flaw-cve-2026-114938-now)).
- JVM 비정상 종료와 의심스러운 Java 자식 프로세스를 모니터링한다. 실패한 시도는 충돌로 드러날 가능성이 높다.

CISA는 11월 17일 경보에서 즉시 패치를 강력히 권고했다 ([CISA](https://www.cisa.gov/news-events/alerts/2026/11/17/critical-java-vulnerability-requires-immediate-patching)). 경보의 세부 권고 문구는 원문에서 직접 확인하기를 권한다.

## 타임라인

취약 코드는 2023년 1월부터 배포돼 있었고, 공개와 패치는 2026년 11월 17일 하루에 몰렸다.

| 시점 | 사건 | 출처 |
| --- | --- | --- |
| 2026-11-18 | 야생 악용 보고 없음, KEV 미등재 상태 유지. 타 벤더 수정 빌드 순차 배포 중 | [ThreatDefence](https://threatdefence.com/article/java4shell-cve-2026-114938-openjdk-rce-patching-hunting), [Upwind](https://www.upwind.io/blog/java4shell-what-we-know-now-and-what-comes-next) |
| 2026-11-17 | CISA가 즉시 패치를 권고하는 경보 발표 | [CISA](https://www.cisa.gov/news-events/alerts/2026/11/17/critical-java-vulnerability-requires-immediate-patching), [Sophos](https://www.sophos.com/en-us/blog/java4shell-could-allow-remote-code-execution) |
| 2026-11-17 22:18 UTC | NVD 레코드 게시, Oracle의 CVSS 3.1 8.1 반영 | [FourWeekMBA](https://fourweekmba.com/ai-cisa-urges-immediate-java4shell-patch-not-on-its-kev-list/) |
| 2026-11-17 21:00 UTC (한국시간 18일 06:00) | Oracle 11월 CSPU 배포, OpenJDK 취약점 그룹 수정 배포. 이후 Calif 기술 분석문 공개 | [HeroDevs](https://www.herodevs.com/blog-posts/java4shell-cve-2026-114938-spring-boot-tomcat-jetty), [Endor Labs](https://www.endorlabs.com/learn/java4shell-unauthenticated-rce-reported-in-openjdk-17-cve-2026-114938) |
| 2026-11-17 (패치 전) | Calif가 X에 "취약점이 유출됐으므로"라며 발견과 제보 사실을 먼저 공개 | [HeroDevs](https://www.herodevs.com/blog-posts/java4shell-cve-2026-114938-spring-boot-tomcat-jetty) |
| 2026-11-16 ~ 17 | 한국 국가사이버안보센터(NCSC)가 공공기관에 인증 없는 Java RCE 주의를 통보한 것으로 보도됨. 날짜는 보도마다 다름 | [Endor Labs](https://www.endorlabs.com/learn/java4shell-unauthenticated-rce-reported-in-openjdk-17-cve-2026-114938) |
| 2026-10-22 | CVE-2026-114938 예약 | [Horizon3.ai](https://horizon3.ai/attack-research/vulnerabilities/cve-2026-114938/) |
| 2023-01 | 영향 범위의 첫 빌드인 OpenJDK 17.0.6 출시 | [Endor Labs](https://www.endorlabs.com/learn/java4shell-unauthenticated-rce-reported-in-openjdk-17-cve-2026-114938) |

일부 벤더 페이지(watchTowr, Endor Labs 초기판 등)는 패치 전 시점에 작성돼 "수정 미확인"으로 적혀 있다. 패치 이후 자료와 어긋나는 부분은 작성 시점 차이다.

## Log4Shell과의 비교

이름은 닮았지만 결함의 종류와 악용 난이도가 다르다. Log4Shell은 로깅 라이브러리의 기능 오용이었고, Java4Shell은 런타임 자체의 메모리 손상이다.

| 항목 | Log4Shell (CVE-2021-44228) | Java4Shell (CVE-2026-114938) |
| --- | --- | --- |
| 위치 | Log4j 2 로깅 라이브러리 | HotSpot JVM의 Base64 인트린식 |
| 결함 종류 | JNDI 조회 기능 악용 (논리 결함) | 힙 버퍼 오버플로 (메모리 손상) |
| 트리거 | 로그에 남는 문자열 | 디코더에 도달하는 Base64 입력 |
| 공격 복잡도 | 낮음. 단일 문자열로 범용 악용 | 높음. 제품별 체인과 힙 레이아웃 조건 필요 |
| 하드웨어 조건 | 없음 | AVX-512 VBMI x86-64 한정 |
| 수정 방법 | 라이브러리 교체 (앱별 재빌드) | JDK 교체 후 재시작 (앱 코드 변경 불필요) |
| 앱 책임 | 취약 라이브러리를 포함한 앱 | 앱이나 라이브러리에 결함이 없어도 노출 |

Java4Shell 쪽 내용의 출처는 [Qualys](https://blog.qualys.com/vulnerabilities-threat-research/2026/11/17/how-to-find-mitigate-and-patch-the-critical-java4shell-flaw-cve-2026-114938-now), [Cyber Kendra](https://www.cyberkendra.com/2026/11/cve-2026-114938-pre-auth-rce-flaw-in-java-17-puts-servers-at-risk.html), [BleepingComputer](https://www.bleepingcomputer.com/news/security/critical-java4shell-flaw-allows-rce-attacks-on-major-java-applications/)다. Log4Shell 쪽은 널리 알려진 사실을 정리한 것이다.

실무상 함의는 두 가지다. 대량 자동화 공격의 가능성은 Log4Shell보다 낮다. 반면 SBOM이나 의존성 스캐너로는 잡히지 않고, 실행 중인 JDK 빌드와 CPU를 직접 확인해야 한다.

## 레퍼런스

### 1차 출처

작성 시점에 원문을 직접 열지 못한 페이지다. 내용은 아래 2차 분석과 검색 결과 요약을 통해 간접 확인했으므로, 인용 전에 직접 열어 보기를 권한다.

- Calif 공개문 "Java4Shell: Write once, RCE everywhere": https://calif.io/java4shell/
- Oracle Critical Security Patch Update Advisory, November 2026: https://www.oracle.com/security-alerts/cspunov2026.html
- OpenJDK Vulnerability Group 권고문 2026-11-17: https://openjdk.org/groups/vulnerability/advisories/2026-11-17
- CISA 경보 "Critical Java Vulnerability Requires Immediate Patching": https://www.cisa.gov/news-events/alerts/2026/11/17/critical-java-vulnerability-requires-immediate-patching
- CVE 레코드: https://www.cve.org/CVERecord?id=CVE-2026-114938
- Oracle Java SE 17.0.21.1 릴리스 노트: https://www.oracle.com/java/technologies/javase/17-0-21-1-relnotes.html

### 열람한 분석 자료

- Horizon3.ai, CVE-2026-114938 기술 개요와 CVSS 벡터: https://horizon3.ai/attack-research/vulnerabilities/cve-2026-114938/
- Upwind, 버전별 영향과 플래그 주의점: https://www.upwind.io/blog/java4shell-what-we-know-now-and-what-comes-next
- Qualys, 점검 명령과 수정 빌드: https://blog.qualys.com/vulnerabilities-threat-research/2026/11/17/how-to-find-mitigate-and-patch-the-critical-java4shell-flaw-cve-2026-114938-now
- Wiz, 근본 원인과 자체 PoC: https://www.wiz.io/blog/cve-2026-114938-rce-java4shell-openjdk
- BleepingComputer, 영향 제품 목록과 발견 경위: https://www.bleepingcomputer.com/news/security/critical-java4shell-flaw-allows-rce-attacks-on-major-java-applications/
- Endor Labs, 프로세스 점검 절차와 초기 타임라인: https://www.endorlabs.com/learn/java4shell-unauthenticated-rce-reported-in-openjdk-17-cve-2026-114938

### 검색 결과 요약만 확인한 자료

- SentinelOne: https://www.sentinelone.com/blog/java4shell-vulnerability-in-openjdk-enables-rce-on-avx-512-cpus/
- Orca Security: https://orca.security/resources/research/java4shell-critical-openjdk-base64-decoder-flaw-could-allow-unauthenticated-remote-code-execution/
- Sophos: https://www.sophos.com/en-us/blog/java4shell-could-allow-remote-code-execution
- HeroDevs (Spring Boot, Tomcat, Jetty 노출): https://www.herodevs.com/blog-posts/java4shell-cve-2026-114938-spring-boot-tomcat-jetty
- Core Defences: https://coredefences.com/blogs/java4shell-openjdk-base64-rce-cve-2026-114938/
- ThreatDefence: https://threatdefence.com/article/java4shell-cve-2026-114938-openjdk-rce-patching-hunting
- CyberScoop: https://cyberscoop.com/java4shell-critical-java-flaw-openjdk/
- Cyber Kendra: https://www.cyberkendra.com/2026/11/cve-2026-114938-pre-auth-rce-flaw-in-java-17-puts-servers-at-risk.html
- Field Effect: https://fieldeffect.com/blog/java4shell-exposure-concerns
- Aikido: https://www.aikido.dev/blog/java-17-rce-vulnerability-cve-2026-114938
- Equixly: https://equixly.com/blog/2026/11/17/cve-2026-114938-pre-auth-heap-overflow-in-java-17-21-and-25/
- watchTowr FAQ: https://watchtowr.com/intelligence/java4shell-cve-2026-114938-faq/
- NoLimitCloud: https://nolimitcloud.eu/blogs/security/java4shell-cve-2026-114938
- FourWeekMBA (KEV 미등재 시각 정리): https://fourweekmba.com/ai-cisa-urges-immediate-java4shell-patch-not-on-its-kev-list/
