# nginx2root 취약점 분석 및 대응 가이드

- 작성 기준일: 2026-11-19 (KST)
- 공개일: 2026-11-18
- 대상: nginx Open Source, NGINX Plus, 그리고 nginx가 동작하는 Linux 호스트/컨테이너
- 근거 자료: Xint 원문 블로그, Rapid7 공개 분석, Wiz 분석, F5 보안 권고 (문서 끝 "출처" 참조)

> 이 문서는 첨부된 1차 요약본을 원문 출처와 대조해 보강한 것입니다. 원 요약본과 달라진 부분은 9장 "원 요약본 대비 정정 사항"에 따로 정리했습니다.

---

## 1. 한눈에 보는 요약

| 항목 | 내용 |
| :--- | :--- |
| 명칭 | nginx2root |
| 구성 | nginx 취약점 5건 + Linux 커널 SCTP 취약점 1건 (총 6건) |
| 발견자 | Xint (5건 전체 + 커널). CVE-2026-123007은 Rapid7(Stephen Fewer)과 Wiz도 독립적으로 분석/공개 |
| 심각도 | nginx 5건 모두 CVSS 4.0 기준 9.2 (Critical) |
| 공격 전제 | 인증 불필요, 네트워크로 도달 가능한 nginx 포트 |
| 최종 영향 | nginx worker 권한 RCE -> (커널 SCTP 연계 시) 호스트 root, Docker 컨테이너 탈출 |
| 수정 버전 (Open Source) | 1.31.9 (mainline), 1.30.7 (stable) |
| 수정 버전 (NGINX Plus) | 37.3.0.1, 37.0.8.1 |
| 커널 SCTP 취약점 | 공개 시점 기준 CVE 미부여, 커널 패치 없음 |
| 공개 PoC | Rapid7이 CVE-2026-123007 PoC 공개. Xint/Wiz는 재현에 필요한 최종 단계 비공개 |
| 실제 악용 | 공개 시점 기준 in-the-wild 악용 보고 없음 |

핵심 한 줄: HTTP/2를 켠 nginx는 거의 전부 CVE-2026-123007의 영향 범위(1.9.5 ~ 1.31.8)에 들어가므로, 패치가 최우선이고 패치 전까지는 HTTP/2 비활성화 + SCTP 모듈 차단이 현실적인 임시 방어선입니다.

---

## 2. 공격 체인 구조

```
[외부 공격자, 인증 없음]
        |
        |  (1) nginx 취약점 5건 중 하나 (각각 독립된 공격 경로)
        v
[nginx worker 프로세스 권한으로 코드 실행]   <- 보통 www-data / nginx 계정
        |
        |  (2) Linux 커널 SCTP use-after-free / double free
        v
[호스트 root 권한]  ---->  컨테이너 환경이면 컨테이너 탈출, 같은 호스트의 전 컨테이너 노출
```

- 1단계의 5개 CVE는 서로 의존하지 않습니다. 설정에 따라 그중 하나만 해당돼도 공격 경로가 성립합니다.
- 2단계는 nginx와 무관한 커널 결함입니다. nginx를 패치해도 커널 결함은 남고, 반대로 SCTP를 막아도 nginx worker 권한 RCE는 남습니다. 두 계층을 따로 조치해야 합니다.
- 컨테이너는 호스트 커널을 공유하므로, 커널 단계가 성립하면 격리 경계가 무너집니다.

---

## 3. 취약점별 상세

### 3.1 요약 표

| CVE | 유형 | 필요 설정 | 최초 영향 버전 | HTTP/2 끄면 차단 | 영향 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| CVE-2026-123007 | HTTP/2 흐름 제어 정수 언더플로우 -> 힙 OOB 읽기/쓰기 | HTTP/2 활성화 | 1.9.5 (2015) | 예 | 비인증 RCE |
| CVE-2026-123634 | DNS resolver use-after-free | `resolver` + 요청에서 유도된 `proxy_pass` 대상 + `mirror` (`mirror_request_body off`) | 1.13.4 | 아니오 | 비인증 RCE |
| CVE-2026-123633 | HTTP/2 연결 use-after-free | HTTP/2 + upstream 프록시 | 1.19.7 | 예 | 비인증 RCE |
| CVE-2026-121810 | HTTP/3(QUIC) use-after-free | HTTP/3 + upstream 프록시 | 1.25.0 | 아니오 (HTTP/3를 꺼야 함) | 비인증 RCE |
| CVE-2026-113425 | 메일 프록시 `auth_http` 경로 use-after-free | 메일 프록시 (`proxy on` + `auth_http`) | 0.5.15 | 아니오 | 비인증 RCE |

### 3.2 CVE-2026-123007 — HTTP/2 흐름 제어 정수 언더플로우

**분류**: CWE-191 (Integer Underflow). CVSS 4.0 벡터 `AV:N/AC:H/AT:P/PR:N/UI:N/VC:H/VI:H/VA:H`.

**무엇이 잘못됐나**

HTTP/2는 수신 측이 "얼마만큼 보내도 된다"는 크레딧(윈도우)을 송신 측에 알려주는 흐름 제어를 씁니다. nginx가 이 크레딧을 계산하는 과정에 네 단계의 결함이 연달아 있습니다.

1. 요청이 닫힐 때 아직 보내지 않은 DATA 프레임의 크레딧을 연결 카운터로 되돌리는데, 결과가 HTTP/2 최대 윈도우(2^31-1)를 넘는지 검사하지 않습니다.
2. 스트림 초기 윈도우를 키워 크레딧이 한도를 넘으면 nginx는 해당 스트림만 리셋합니다. RFC 9113은 연결 전체를 끊으라고 요구하는데, 이를 따르지 않아 공격자가 초과 크레딧을 가진 연결을 계속 쥐게 됩니다.
3. 이후 연결 단위 WINDOW_UPDATE 검사에서 부호 없는 뺄셈이 쓰이면서 값이 랩어라운드합니다.
4. 64비트 빌드에서 이 값이 음수 길이로 해석되어 잘못된 버퍼가 만들어지고, 결국 `memcpy`에 비정상적으로 큰 크기가 전달되어 힙 영역 밖 메모리를 읽고 씁니다.

**영향 범위**

- nginx가 HTTP/2를 처음 도입한 1.9.5부터 1.31.8까지의 모든 공식 릴리스.
- 백엔드 애플리케이션이나 서드파티 모듈 없이 정적 파일만 서비스하는 nginx에서도 코드 실행이 시연됐습니다.
- 주의: nginx는 HTTP/2가 기본으로 켜져 있지 않습니다. `listen ... http2` 또는 `http2 on;`이 있어야 해당됩니다. 다만 TLS를 쓰는 운영 환경 대부분이 HTTP/2를 켜 두기 때문에 실질적 노출이 넓습니다.

**실제 악용 난이도 (Rapid7 PoC 기준)**

| 조건 | 내용 |
| :--- | :--- |
| 빌드 | 64비트 |
| CPU/glibc | x86-64 glibc의 EVEX/YMM `memcpy`가 선택되는 환경 (`avx512f`, `avx512vl` 지원 CPU) |
| 트래픽량 | 평문 기준 약 119 GiB의 HTTP/2 트래픽 |
| 소요 시간 | 10 Gbit/s에서 약 2분, 1 Gbit/s에서 약 17분 |
| 연결 수명 | nginx 기본 1시간 제한 때문에 약 300 Mbit/s 미만 회선에서는 완료 불가 |
| ASLR | 힙/라이브러리 포인터를 먼저 유출해 우회 |
| 기타 | 적절한 힙 배치 필요, 앞단에 프록시가 있으면 프레임이 그대로 전달되지 않아 성립이 어려움 |

난이도가 높다는 것이지 불가능하다는 뜻이 아닙니다. 조건이 대역폭과 CPU 기능이라 클라우드 인스턴스 간 공격에서는 충족되기 쉽습니다. Rapid7은 다른 RCE 전략이 있을 수 있다고 덧붙였습니다.

### 3.3 CVE-2026-123634 — DNS resolver use-after-free

**필요 설정**: 다음 세 가지가 함께 있을 때.

- `resolver` 지시어 사용
- `proxy_pass` 대상이 요청에서 유도된 변수 (요청 시점에 DNS 해석이 일어남)
- `mirror` 지시어 + `mirror_request_body off`

**특징**

- HTTP/2와 무관합니다. HTTP/2를 꺼도 막히지 않습니다.
- Xint는 `mirror` 구성만 검증했지만, SSI 등 다른 하위 요청(subrequest) 기능으로도 같은 코드 경로에 도달할 수 있다고 봅니다. 그래서 `mirror`만 끄는 것으로는 충분하지 않을 수 있습니다.
- `mirror_request_body on`으로 바꾸면 검증된 익스플로잇은 멈추지만 버그 자체가 고쳐지는 것은 아닙니다.

### 3.4 CVE-2026-123633 — HTTP/2 연결 use-after-free

**필요 설정**: HTTP/2 + upstream(백엔드)으로 요청 전달.

**원인**: 아직 요청을 처리 중인 활성 HTTP/2 연결이 "드레이닝(정리) 대상"으로 남아 있다가, 가용 연결 슬롯(`worker_connections`)이 부족해질 때 해제됩니다. 이후 진행 중이던 요청이 해제된 메모리를 참조합니다.

**특징**: 리버스 프록시 구성에서 위험합니다. HTTP/2를 끄면 차단됩니다.

### 3.5 CVE-2026-121810 — HTTP/3 use-after-free

**필요 설정**: HTTP/3(QUIC) + upstream으로 요청 전달.

**원인**: HTTP/3 요청이 실행 중인데 QUIC 연결이 먼저 닫히면서 발생합니다.

**특징**: HTTP/2 비활성화로는 막을 수 없고 HTTP/3를 꺼야 합니다. 최초 영향 버전은 HTTP/3가 들어온 1.25.0.

### 3.6 CVE-2026-113425 — 메일 프록시 use-after-free

**필요 설정**: 메일 프록시(IMAP/POP3/SMTP)에서 `proxy on` + `auth_http`.

**특징**: 0.5.15부터 존재한 매우 오래된 결함입니다. 메일 프록시를 쓰는 환경은 상대적으로 적지만, 쓰고 있다면 외부 노출 여부를 반드시 확인해야 합니다.

### 3.7 Linux 커널 SCTP 취약점 (권한 상승 단계)

| 항목 | 내용 |
| :--- | :--- |
| 유형 | SCTP 송신 경로의 use-after-free 또는 double free |
| 원인 | association을 기다리던 send 동작 중에 그 association이 다른 소켓으로 이전되고, 대기 중이던 동작이 이를 해제 |
| 도입 시점 | Linux v4.15 (2018) |
| CVE | 공개 시점 기준 미기재 |
| 패치 | 공개 시점 기준 없음 |
| 영향 | nginx worker 권한 -> root. Docker 컨테이너 탈출 시연 |

많은 배포판에서 SCTP 모듈이 기본 설치되어 있고, 프로그램이 SCTP 소켓을 열면 자동으로 로드됩니다. 즉 SCTP를 "쓰지 않는" 서버도 공격자가 소켓을 여는 순간 모듈이 올라올 수 있습니다. 컨테이너에서 SCTP에 도달 가능한지는 커널, 모듈, 컨테이너 제한(seccomp 등)에 따라 달라집니다.

---

## 4. 영향 버전과 수정 버전

### 4.1 NGINX Open Source

| 브랜치 | 취약 | 수정 |
| :--- | :--- | :--- |
| mainline 1.31.x | 1.31.0 ~ 1.31.8 | 1.31.9 |
| stable 1.30.x 이하 | 1.9.5 ~ 1.30.6 (CVE-2026-123007 기준) | 1.30.7 |

1.28 이하 구버전 브랜치는 nginx.org에서 별도 릴리스가 나오지 않으므로 1.30.7 이상으로 올리거나 배포판 백포트를 써야 합니다.

### 4.2 NGINX Plus

| 취약 | 수정 |
| :--- | :--- |
| 37.1.0 ~ 37.2.0.1 | 37.3.0.1 |
| 37.0.0 ~ 37.0.7.1 | 37.0.8.1 |
| R34 ~ R36 | 수정 버전 미기재 (F5 권고 확인 필요) |

Wiz에 따르면 CVE-2026-123633은 37.0.7.1 / 37.2.0.1에서 이미 수정됐고, CVE-2026-123007까지 포함한 수정은 37.0.8.1 / 37.3.0.1입니다. 5건 전체를 덮으려면 후자로 가야 합니다.

### 4.3 배포판 패키지 주의점

배포판은 보안 패치를 백포트하므로 `nginx -v` 출력이 그대로일 수 있습니다. 예를 들어 Ubuntu 22.04는 패치가 들어가도 `1.18.0`으로 표시됩니다. 반드시 전체 패키지 버전을 배포판 보안 공지와 대조하십시오.

```bash
# Debian / Ubuntu
dpkg -l | grep -i nginx
apt changelog nginx | head -40

# RHEL / Rocky / Alma / Amazon Linux
rpm -q nginx
rpm -q --changelog nginx | head -40
```

참고 기본 버전: Ubuntu 24.04 (1.24.0), Ubuntu 22.04 (1.18.0), Debian 12 (1.22.1). 셋 다 CVE-2026-123007의 원본 영향 범위 안입니다.

### 4.4 릴리스 가용성 확인

Xint 타임라인상 패치 릴리스 예정일은 2026-11-19(KST)입니다. 이 문서 작성 시점에 nginx.org 보안 권고 페이지에는 5개 CVE가 아직 올라와 있지 않았습니다. 업그레이드 전에 nginx.org 다운로드 페이지와 사용하는 배포판 저장소에서 1.31.9 / 1.30.7 패키지가 실제로 제공되는지 먼저 확인하고, 아직 없다면 5장의 임시 완화 조치를 즉시 적용하십시오.

---

## 5. 대응 절차

### 5.1 0단계: 내 서버가 해당되는지 판별

```bash
# 버전과 빌드 옵션
nginx -V 2>&1

# 실제 적용 중인 전체 설정에서 관련 지시어 검색
nginx -T 2>/dev/null | grep -nE 'http2|quic|http3|mirror|resolver|proxy_pass|auth_http|mail[[:space:]]*\{'
```

| 확인 결과 | 해당 CVE |
| :--- | :--- |
| `listen ... http2` 또는 `http2 on;` | CVE-2026-123007 |
| 위 조건 + `proxy_pass` / `grpc_pass` 등 upstream 전달 | CVE-2026-123633 |
| `listen ... quic` 또는 `http3 on;` + upstream 전달 | CVE-2026-121810 |
| `resolver` + 변수가 들어간 `proxy_pass` + `mirror` | CVE-2026-123634 |
| `mail { }` 블록에 `proxy on` + `auth_http` | CVE-2026-113425 |

외부에서 HTTP/2 협상 여부 확인:

```bash
openssl s_client -connect example.com:443 -alpn h2 </dev/null 2>/dev/null | grep -i 'ALPN'
# "ALPN protocol: h2" 가 나오면 HTTP/2 활성 상태
```

### 5.2 1단계: 업그레이드 (근본 해결)

```bash
# 설정 백업
cp -a /etc/nginx /etc/nginx.bak.$(date +%F)

# nginx.org 공식 저장소 사용 시
# Debian / Ubuntu
apt update && apt install --only-upgrade nginx
# RHEL 계열
dnf upgrade nginx

# 검증 후 재시작
nginx -t && systemctl restart nginx
nginx -v
```

- `reload`가 아니라 `restart`를 권장합니다. reload는 새 연결에만 새 바이너리/설정이 적용되고, 기존 연결을 물고 있는 구 worker는 한동안 살아 있습니다.
- Docker 이미지는 태그만 바꾸지 말고 이미지 다이제스트를 다시 받아 재배포하십시오. 베이스 이미지에 nginx가 포함된 사내 이미지도 전부 재빌드 대상입니다.
- nginx를 내장한 제품(인그레스 컨트롤러, API 게이트웨이, OpenResty 계열, 어플라이언스 등)은 nginx 코어 버전이 따로 고정되어 있으므로 각 벤더 공지를 별도로 확인해야 합니다. 이 부분은 참고한 출처들이 직접 다루지 않아, 영향 여부는 벤더 확인이 필요합니다.

### 5.3 2단계: 즉시 업그레이드가 불가능할 때의 임시 완화

임시 조치는 패치를 대체하지 못합니다. 적용 후에도 업그레이드 일정을 잡아야 합니다.

**(a) HTTP/2 비활성화 — CVE-2026-123007, CVE-2026-123633 차단**

```nginx
# nginx 1.25.1 이상
server {
    listen 443 ssl;        # listen 줄에서 http2 파라미터 제거
    http2 off;
    ...
}

# nginx 1.9.5 ~ 1.25.0
server {
    listen 443 ssl;        # "http2" 파라미터만 제거
    ...
}
```

부작용: 네이티브 gRPC 등 HTTP/2 전용 서비스가 중단됩니다. 적용 후 5.1의 `openssl s_client` 명령으로 `h2`가 협상되지 않는지 확인하십시오.

**(b) HTTP/3 비활성화 — CVE-2026-121810 차단**

```nginx
server {
    # listen 443 quic reuseport;   <- 제거
    http3 off;
    add_header Alt-Svc 'clear';
    ...
}
```

```bash
ss -lunp | grep nginx     # UDP 443 리스너가 사라졌는지 확인
```

필요하면 방화벽에서 UDP 443을 추가로 차단합니다.

**(c) 요청 시점 DNS 해석 제거 — CVE-2026-123634 완화**

```nginx
# 취약한 패턴
location / {
    resolver 10.0.0.2;
    mirror /mirror;
    mirror_request_body off;
    proxy_pass http://$backend_host;
}

# 완화: 고정 upstream 그룹 사용, 불필요한 mirror 제거
upstream backend_pool { server 10.0.1.10:8080; }

location / {
    mirror off;
    proxy_pass http://backend_pool;
}
```

미러링이 꼭 필요하면 본 요청과 미러 양쪽 모두 고정 upstream 그룹을 쓰십시오. SSI 등 다른 하위 요청 기능을 변수형 `proxy_pass`와 함께 쓰는 구성도 같이 점검해야 합니다.

**(d) 메일 프록시 노출 축소 — CVE-2026-113425 완화**

IMAP/POP3/SMTP 리스너를 루프백에 바인딩하거나, 방화벽으로 신뢰 대역만 허용합니다. 쓰지 않는 `mail { }` 블록은 제거합니다.

**(e) 커널 SCTP 모듈 로드 차단 — root 권한 상승 단계 차단**

SCTP를 쓰지 않는 호스트에 한해 적용합니다.

```bash
echo 'install sctp /bin/false' > /etc/modprobe.d/disable-sctp.conf

# 이미 로드되어 있는지 확인
lsmod | grep sctp
# 로드되어 있고 사용처가 없다면 언로드
modprobe -r sctp
```

한계: 이 방법은 `modprobe`를 통한 로드만 막습니다. 이미 로드된 모듈을 내리지 않고, 커널에 내장(built-in)된 SCTP는 끄지 못합니다. 커널 패치가 나오면 별도로 적용해야 합니다.

**(f) 적용 후 반드시 재시작**

```bash
nginx -t && systemctl restart nginx
```

**(g) 추가 방어 심화**

- HTTP/2를 종단하는 CDN/WAF가 앞단에 있으면 익스플로잇이 부분적으로 완화될 수 있습니다(구현에 따라 다름). 오리진 직접 접근을 방화벽으로 막아 두는 것이 전제입니다.
- 컨테이너: 기본 seccomp 프로파일 유지, 불필요한 capability 제거, `--privileged` 금지, nginx worker를 비특권 사용자로 실행.
- nginx worker 계정이 접근할 수 있는 비밀값(TLS 개인키, upstream 자격증명) 범위를 점검합니다. worker 권한 RCE만으로도 이 범위는 노출됩니다.

### 5.4 조치 우선순위

| 순위 | 조치 | 대상 |
| :--- | :--- | :--- |
| 1 | 인터넷 노출 + HTTP/2 활성 nginx 식별 및 업그레이드 | 전 환경 |
| 2 | 업그레이드 불가 서버에 HTTP/2 off + restart | 패치 대기 서버 |
| 3 | SCTP 모듈 로드 차단 | SCTP 미사용 전 호스트 (컨테이너 호스트 우선) |
| 4 | HTTP/3, mirror/resolver, 메일 프록시 구성 점검 | 해당 구성 서버 |
| 5 | 탐지 룰/감사 로그 배치, 과거 로그 소급 점검 | 전 환경 |
| 6 | nginx 내장 제품 벤더 공지 추적, 커널 패치 추적 | 지속 |

---

## 6. 탐지와 침해 지표

가장 신뢰도 높은 신호는 "nginx worker가 다른 프로세스를 실행했다"는 사실입니다. 나머지는 약한 신호이므로 서로 교차 확인해야 합니다.

### 6.1 worker의 프로세스 실행 감시 (강한 신호)

```bash
# nginx worker 계정의 UID 확인 (www-data, nginx 등)
id -u www-data

# auditd 규칙: worker UID의 execve / execveat 기록
auditctl -a always,exit -F arch=b64 -S execve -S execveat -F uid=<WORKER_UID> -k nginx_worker_exec

# 조회
ausearch -k nginx_worker_exec
```

worker가 셸이나 임의 프로그램을 띄웠다면 침해로 간주하고 대응합니다. 규칙 설치 이후의 이벤트만 기록된다는 점에 유의하십시오.

### 6.2 worker 비정상 종료 (약한 신호)

```bash
grep -E 'signal 11|segfault|exited on signal' /var/log/nginx/error.log
journalctl -k | grep -i 'nginx.*segfault'
coredumpctl list nginx
```

익스플로잇 시도 실패는 대개 worker 크래시로 나타납니다. 다만 크래시는 정상적 원인으로도 생깁니다.

### 6.3 CVE-2026-123007 트래픽 패턴 (약한 신호)

공격 특성: 하나의 HTTP/2 연결이 오래 유지되면서 수신 바이트가 매우 크고(수십~백여 GiB), 연결 단위 WINDOW_UPDATE 프레임이 대량으로 들어옵니다.

```bash
# 수신량은 계속 늘고 송신량은 작은 장기 연결 찾기
ss -tinp state established '( sport = :443 )'
```

로그 보강 예시(연결 ID, 연결당 요청 수, 요청 길이, 처리 시간 기록):

```nginx
log_format h2_hunt '$remote_addr $connection $connection_requests '
                   '$request_length $request_time $server_protocol "$request"';
access_log /var/log/nginx/h2_hunt.log h2_hunt;
```

연결별 `request_length` 합계와 실제 수신 바이트 사이에 큰 차이가 나면 제어 프레임 플러딩을 의심할 수 있습니다. WINDOW_UPDATE, RST_STREAM 프레임은 요청으로 로깅되지 않기 때문에 이 차이가 단서가 됩니다. 같은 IP에서 짧은 TLS 연결이 다수 동반되는지도 함께 봅니다.

### 6.4 권한 상승 흔적

```bash
lsmod | grep sctp                       # 쓰지 않는데 로드되어 있는가
journalctl -k | grep -iE 'sctp|KASAN|general protection|BUG:'
```

SCTP를 쓰지 않는 호스트에서 모듈이 올라와 있거나, 커널 oops가 SCTP 관련으로 남아 있으면 조사 대상입니다.

### 6.5 침해가 의심될 때

1. 해당 호스트를 네트워크에서 격리 (컨테이너라면 호스트 단위로).
2. 메모리/디스크 증거 보존 후 조사.
3. nginx가 접근 가능했던 TLS 개인키, upstream 자격증명, 세션 티켓 키를 전부 교체.
4. 커널 단계까지 성립했을 가능성이 있으면 호스트를 신뢰할 수 없는 것으로 보고 재구축.

---

## 7. 노출 규모

Xint의 2026-11-10 기준 Shodan 조사:

| 항목 | 수치 |
| :--- | :--- |
| `product:nginx` 호스트 | 5,670만 |
| 버전 식별 가능 호스트 | 1,194만 (21.1%) |
| 그중 1.9.5 ~ 1.31.8 범위 | 98.9% |

이 수치는 버전 문자열 기준이며 실제 취약 여부를 확정하지 않습니다. HTTP/2가 켜져 있어야 하고, 배포판 백포트가 적용됐을 수 있습니다.

---

## 8. 공개 타임라인

| 일자 | 사건 |
| :--- | :--- |
| 2026-10-11 | Xint, 취약점 발견 |
| 2026-10-16 | HackerOne을 통해 F5에 보고 |
| 2026-10-20 | HackerOne 검증 완료 |
| 2026-10-27 | F5 nginx 개발팀에 보고서 전달 |
| 2026-11-10 | nginx 팀 패치 검증 요청, Xint 검증 완료 |
| 2026-11-11 | Rapid7, CVE-2026-123007을 독립적으로 F5에 연락 |
| 2026-11-16 | F5, Rapid7 건 검증 및 CVE 부여, 공개일 확정 |
| 2026-11-18 | 공개 (Xint, Rapid7, Wiz, F5) |
| 2026-11-19 | 패치 릴리스 예정일 (Xint 기준, KST) |

여러 연구 조직이 같은 시기에 CVE-2026-123007을 독립적으로 찾아냈다는 점은, 공격자 측에서도 재발견이 어렵지 않다는 의미로 읽어야 합니다.

---

## 9. 원 요약본 대비 정정 사항

| 원 요약본 내용 | 원문 출처 기준 |
| :--- | :--- |
| CVE-2026-123007이 "기본 설정에서도 동작" | nginx는 HTTP/2가 기본 활성화가 아님. "HTTP/2만 켜져 있으면, 그 외 특수 구성 없이 정적 파일 서비스만으로도 성립"이 정확한 표현 |
| CVE-2026-123634는 `proxy_pass` 변수 + `mirror` 문제 | 본질은 DNS resolver의 use-after-free. `resolver` 지시어가 조건에 포함됨. 최초 영향 1.13.4 |
| CVE-2026-121810은 "주로 DoS" | Xint는 5건 모두 worker 권한 비인증 RCE로 분류 |
| RCE는 "ASLR이 비활성화되거나 우회될 경우"에 한정 | F5 권고의 통상 문구. 실제로는 결함 자체로 메모리 주소를 유출할 수 있어 ASLR이 방어가 되지 못함 (Rapid7 PoC, Wiz 분석) |
| 커널 취약점은 간략 언급 | SCTP 송신 경로 UAF/double free, v4.15부터 존재, 공개 시점 CVE 및 패치 없음. `modprobe` 차단이 유일한 임시책 |
| NGINX Plus 수정 버전 37.3.0.1 / 37.0.8.1 | 맞음. 단 R34 ~ R36은 수정 버전 미기재, CVE-2026-123633은 37.0.7.1 / 37.2.0.1에서 선수정 |
| 임시 조치 후 절차 언급 없음 | reload로는 부족하고 restart 필요 |
| 공개 PoC 언급 없음 | Rapid7이 CVE-2026-123007 PoC를 공개함. 약 119 GiB 트래픽, AVX-512 계열 CPU 등 구체적 전제 조건 있음 |
| 메일 프록시 "비활성화" | 원문 권고는 루프백 바인딩 또는 방화벽 제한 |

용어 참고: CVE-2026-123007을 Xint는 "정수 오버플로우", F5/Rapid7은 "정수 언더플로우(CWE-191)"로 표기합니다. 같은 결함을 가리킵니다.

---

## 10. 점검 체크리스트

- [ ] 전 nginx 인스턴스 목록화 (호스트, 컨테이너 이미지, nginx 내장 제품 포함)
- [ ] 각 인스턴스의 버전과 HTTP/2, HTTP/3, mirror/resolver, 메일 프록시 사용 여부 확인
- [ ] 1.31.9 / 1.30.7 (Plus: 37.3.0.1 / 37.0.8.1) 또는 배포판 패치 패키지 가용성 확인
- [ ] 인터넷 노출 + HTTP/2 활성 서버부터 업그레이드
- [ ] 업그레이드 대기 서버에 HTTP/2 off 적용 후 restart, ALPN으로 검증
- [ ] SCTP 미사용 호스트에 모듈 로드 차단 적용
- [ ] HTTP/3, mirror/resolver, 메일 프록시 구성 완화
- [ ] worker UID 대상 auditd 규칙 배치
- [ ] error.log / 커널 로그에서 공개일 전후 segfault 소급 점검
- [ ] 오리진 직접 접근 차단 여부 확인 (CDN/WAF 사용 시)
- [ ] 컨테이너 베이스 이미지 재빌드 및 재배포
- [ ] 커널 SCTP 패치 및 nginx 내장 제품 벤더 공지 추적 등록

---

## 출처

- Xint, "NGINX2Root: New Remote Code Execution Vulnerabilities in nginx Require Urgent Patching" — https://xint.io/blog/nginx2root-remote-code-execution
- Rapid7, "CVE-2026-123007: Critical NGINX HTTP/2 Integer Underflow Leads to RCE (FIXED)" — https://www.rapid7.com/blog/post/ve-cve-2026-123007-critical-nginx-http-2-integer-underflow-leads-to-rce-fixed/
- Wiz, "Unauthenticated Remote Code Execution in NGINX: CVE-2026-123633 and CVE-2026-123007" — https://www.wiz.io/blog/nginx-http2-rce-vulnerabilities
- F5 보안 권고 K000163926, K000164058 — https://my.f5.com
- nginx security advisories — https://nginx.org/en/security_advisories.html
