# CVE-2026-98432 수정 커밋 분석

> 커밋 `e3f33b0a1d89d738e2b913dab519226eaf76e15b` ("ipv4: free inet_opt and ireq_opt after an RCU grace period")
> 작성자: Eric Dumazet / Reported-by: Xinyang Ge (Anthropic)
> 분석 기준: 부모 커밋 `fe4114221364` (수정 전) vs 수정 후 코드
> 목적: 방어 관점의 취약점 메커니즘 정리, 탐지 시그널 도출. 익스플로잇 코드는 포함하지 않음.

---

## 1. 요약

리눅스 IPv4 TCP 핸드셰이크 경로에서 `struct ip_options_rcu`(IP 옵션 저장 구조)의
소유권이 **복사 없이** child 소켓으로 이전되고, 해제자(destructor)가 RCU 대기 없이
`kfree()`로 메모리를 즉시 반환한다. 반면 옵션을 읽는 SYNACK 전송 경로는
`rcu_read_lock()` 하에서 참조만 하므로, 두 CPU가 "해제"와 "읽기"를 동시에 수행하면
Use-After-Free가 발생한다.

수정은 두 해제자에서 `kfree()` → `kfree_rcu()`로 바꾸는 2줄 변경이다.
(`struct ip_options_rcu`에는 이미 `rcu_head rcu`가 첫 멤버로 존재하므로 구조 변경이 불필요했다.)

| 항목 | 내용 |
|---|---|
| 취약 함수 (해제) | `inet_sock_destruct()` (net/ipv4/af_inet.c), `tcp_v4_reqsk_destructor()` (net/ipv4/tcp_ipv4.c) |
| 취약 함수 (읽기) | `tcp_v4_send_synack()` → `inet_csk_route_req()`, `ip_build_and_send_pkt()` → `ip_options_build()` |
| 레이스 상대 | 재전송 SYN 처리(`tcp_check_req()`), request socket migration(`reqsk_timer_handler()`) |
| 도입 커밋 | `079096f103fa` (tcp/dccp: install syn_recv requests into ehash table), `c905dee62232` (tcp_migrate_req) |
| 영향 버전 | Linux 4.4 이후 (기능 도입 시점부터) |

---

## 2. 수정 diff

```diff
--- a/net/ipv4/af_inet.c
+++ b/net/ipv4/af_inet.c
@@ -161,7 +161,7 @@ void inet_sock_destruct(struct sock *sk)
 	WARN_ON_ONCE(sk->sk_wmem_queued);
 	WARN_ON_ONCE(sk->sk_forward_alloc);
 
-	kfree(rcu_dereference_protected(inet->inet_opt, 1));
+	kfree_rcu(rcu_dereference_protected(inet->inet_opt, 1), rcu);
 	dst_release(rcu_dereference_protected(sk->sk_dst_cache, 1));
 	dst_release(rcu_dereference_protected(sk->sk_rx_dst, 1));
 	psp_sk_assoc_free(sk);

--- a/net/ipv4/tcp_ipv4.c
+++ b/net/ipv4/tcp_ipv4.c
@@ -1209,7 +1209,7 @@ static int tcp_v4_send_synack(const struct sock *sk, struct dst_entry *dst,
  */
 static void tcp_v4_reqsk_destructor(struct request_sock *req)
 {
-	kfree(rcu_dereference_protected(inet_rsk(req)->ireq_opt, 1));
+	kfree_rcu(rcu_dereference_protected(inet_rsk(req)->ireq_opt, 1), rcu);
 }
```

`kfree_rcu(ptr, rcu)`는 "현재 진행 중인 RCU read-side critical section이 모두
끝난 뒤" 실제 해제를 수행한다. 기존에 `inet_opt`를 교체하던 다른 경로
(`do_ip_setsockopt()`, `cipso_v4_sock_setattr()` 등)는 이미 `kfree_rcu()`를
쓰고 있어서, 이 두 경로만 `kfree()`를 쓰고 있던 것이 비일관성이자 취약점이었다.

---

## 3. 관련 자료구조 (수정 전, include/net/inet_sock.h)

```c
struct ip_options_rcu {
	struct rcu_head rcu;            /* kfree_rcu가 사용할 RCU 헤드 (이미 존재) */
	struct ip_options opt;          /* 실제 옵션 데이터 */
};

struct ip_options {
	__be32 faddr;                   /* SSRR/LSRR 첫 홉 */
	__be32 nexthop;
	unsigned char optlen;
	unsigned char srr;              /* source route offset */
	unsigned char rr;               /* record route offset */
	unsigned char ts;               /* timestamp offset */
	unsigned char is_strictroute:1, ...;
	unsigned char __data[];         /* 가변 길이: 최대 40바이트 옵션 데이터 */
};

struct inet_request_sock {
	...
	union {
		struct ip_options_rcu __rcu *ireq_opt;   /* __rcu 주석 = RCU 읽기 경로 존재 */
#if IS_ENABLED(CONFIG_IPV6)
		struct { struct ipv6_txoptions *ipv6_opt; struct sk_buff *pktopts; };
#endif
	};
};
```

핵심 단서: `ireq_opt`가 `__rcu`로 선언되어 있다 = 커널 내부적으로 이미
"이 포인터는 RCU 규약 하에서 읽힌다"고 선언된 필드인데, 해제만 RCU 규약을
따르지 않았다.

---

## 4. 옵션 수명 주기 (수정 전 코드 경로)

### 4.1 생성 — SYN 수신

공격자/클라이언트가 IPv4 옵션(Record Route, Timestamp 등)을 담은 SYN을 보내면
`ip_options_rcu` 객체가 할당되어 request socket에 저장된다. (`ireq->ireq_opt`)

### 4.2 소유권 이전 — `tcp_v4_syn_recv_sock()` (tcp_ipv4.c:1702, 수정 전)

```c
	inet_opt = rcu_dereference(ireq->ireq_opt);
	RCU_INIT_POINTER(newinet->inet_opt, inet_opt);   /* 복사 아님, 포인터 전달 */
	...
	if (inet_opt)
		inet_csk(newsk)->icsk_ext_hdr_len = inet_opt->opt.optlen;
	...
	if (likely(*own_req)) {
		tcp_move_syn(newtp, req);
		ireq->ireq_opt = NULL;                      /* req 쪽 참조만 제거 */
	}
```

- IPv4 경로는 옵션을 **복사하지 않고 참조만 옮긴다.** (IPv6의
  `tcp_v6_syn_recv_sock()`은 옵션을 복제하므로 첫 번째 이슈의 영향을 받지 않는다.)
- 이제 이 옵션 메모리의 유일한 소유자는 child 소켓이다.

### 4.3 해제 1 — `inet_sock_destruct()` (af_inet.c:164, 수정 전)

```c
	kfree(rcu_dereference_protected(inet->inet_opt, 1));
```

child 소켓(3-way handshake 완료 후 곧바로 RST/close된 소켓 포함)이 파괴되면
옵션 메모리가 **즉시** 해제된다. TCP child 소켓은 `SOCK_RCU_FREE`가 아니므로
`sk_destruct`가 지연 없이 호출된다.

### 4.4 해제 2 — `tcp_v4_reqsk_destructor()` (tcp_ipv4.c:1213, 수정 전)

```c
static void tcp_v4_reqsk_destructor(struct request_sock *req)
{
	kfree(rcu_dereference_protected(inet_rsk(req)->ireq_opt, 1));
}
```

request socket 자체가 파괴될 때 `ireq_opt`를 즉시 해제한다.

### 4.5 읽기 — `tcp_v4_send_synack()` → `ip_build_and_send_pkt()` → `ip_options_build()`

```c
/* tcp_v4_send_synack() (tcp_ipv4.c:1196, 수정 전) */
	rcu_read_lock();
	err = ip_build_and_send_pkt(skb, sk, ireq->ir_loc_addr,
				    ireq->ir_rmt_addr,
				    rcu_dereference(ireq->ireq_opt),   /* RCU 읽기 */
				    tos);
	rcu_read_unlock();
```

```c
/* ip_build_and_send_pkt() (ip_output.c:160, 수정 전) */
	skb_push(skb, sizeof(struct iphdr) + (opt ? opt->opt.optlen : 0));  /* 읽기 #1 */
	...
	iph->daddr = (opt && opt->opt.srr ? opt->opt.faddr : daddr);       /* 읽기 #2 */
	...
	if (opt && opt->opt.optlen) {                                      /* 읽기 #3 */
		iph->ihl += opt->opt.optlen >> 2;                            /* 읽기 #4 */
		ip_options_build(skb, &opt->opt, daddr, rt);                 /* 읽기 #5..N */
	}
```

```c
/* ip_options_build() (ip_options.c:50, 수정 전) */
	memcpy(&(IPCB(skb)->opt), opt, sizeof(struct ip_options));         /* 구조체 전체 복사 */
	memcpy(iph + sizeof(struct iphdr), opt->__data, opt->optlen);      /* optlen만큼 데이터 복사 */
```

`opt->optlen`이 여러 번 반복해서 읽힌다. 첫 읽기(`skb_push` 크기 계산)와
`memcpy` 사이에 메모리가 해제되면:

1. `skb_push`는 작은 크기로 헤더 공간을 만들고,
2. `memcpy`는 해제된/재할당된 메모리에서 `optlen`만큼 복사한다.

해제된 slab 페이지가 재사용되거나 옵션이 공격자 데이터로 대체되면
"응답(SYNACK)에 커널 메모리 내용이 실려 나가는" 정보 유출과,
`opt->__data`의 용량 검증 실패로 인한 오버플로 파생 효과가 가능하다.
(CTI 리포트에 기술된 KASLR 유출 → 콜백 덮어쓰기 체인은 이 읽기 경로를 이용한다.)

---

## 5. 레이스 시나리오

### 시나리오 A — 재전송 SYN vs child 소켓 파괴 (핵심)

전제: 커밋 `079096f103fa` 이후 request socket 처리가 리스너 락 없이 수행된다.

```
CPU 0 (SYNACK 재전송)                        CPU 1 (핸드셰이크 완료 처리)
─────────────────────────────                ─────────────────────────────
tcp_check_req():                             tcp_v4_syn_recv_sock():
  재전송 SYN 감지                              ireq->ireq_opt → child로 이전
  → tcp_rtx_synack()                           (복사 없음)
  → tcp_v4_send_synack():                    ican see handshake ACK →
    rcu_read_lock()                            child 소켓 곧바로 RST/close
    inet_csk_route_req():                    → inet_sock_destruct():
      opt = rcu_dereference(ireq->ireq_opt)     kfree(inet_opt)   ← 즉시 해제
      opt->opt.faddr / is_strictroute 읽기
    ip_build_and_send_pkt():
      skb_push(... opt->opt.optlen ...)       ▲ 해제된 메모리
      ip_options_build():                       │
        memcpy(... opt->__data, opt->optlen)  ──┘ UAF 읽기
```

- **SYNACK 타이머 자체는 안전**: 타이머가 request socket에 참조를 걸고 있고,
  `inet_csk_reqsk_queue_drop()`이 `timer_delete_sync()`를 먼저 호출하므로
  타이머 경로는 child 해제와 겹치지 않는다.
- **재전송 SYN 경로는 안전장치가 없음**: `tcp_check_req()`는 ehash 조회 후
  리스너 락 없이 `req`를 사용한다. 079096f103fa 도입 이전에는 리스너 락이
  이 경로를 직렬화했으므로 레이스가 불가능했다.

### 시나리오 B — request socket migration (`net.ipv4.tcp_migrate_req=1` 또는 BPF `BPF_SK_REUSEPORT_SELECT_OR_MIGRATE`)

```
reqsk_timer_handler():
  nreq = inet_reqsk_clone(req, nsk);   /* memcpy = ireq_opt 공유 */
  ...
  reqsk_migrate_reset(oreq);           /* 옛 req의 포인터를 NULL 처리 */
  ...
  __reqsk_free(nreq) 또는 reqsk_put(oreq)
  → tcp_v4_reqsk_destructor(): kfree(ireq_opt)
```

클론과 원본이 같은 `ireq_opt`를 공유하는 동안, 원본 request socket을
아직 참조 중인 다른 CPU가 SYNACK 전송이나 `tcp_v4_syn_recv_sock()`으로
옵션을 읽고 있으면 클론이 파괴될 때 UAF가 된다.

> 관찰: `reqsk_migrate_reset()`은 `CONFIG_IPV6=y` 빌드에서 `ipv6_opt`/`pktopts`
> (유니온 멤버)만 NULL 처리하고 `ireq_opt`는 그대로 둔다. 즉 대부분의 배포 커널
> (IPv6 포함 빌드)에서는 옛 req의 destructor와 클론의 destructor가 같은 포인터를
> 각각 해제하는 **double-free 파생 시나리오**까지 배제하기 어렵다.
> 커밋 메시지가 "IPv6는 첫 번째 이슈에 비영향, 단 CALIPSO 관련 ipv6_opt 마이그레이션
> 이슈는 별도 패치"라고 한 것도 이 지점과 관련 있다.

### 레이스의 운영상 특성 (탐지 설계에 중요)

- 레이스에서 지면 해당 연결 시도만 실패하고 시스템은 죽지 않음 → 공격자는 무제한 재시도.
- 성공/실패가 조용함: oops 없이 유출만 일어날 수 있어 SIEM의 충돌 로그만으로는 탐지 불가.
- 필수 전제: **IPv4 옵션이 붙은 SYN**. 정상 트래픽에서 거의 소멸한 패턴
  (RFC 7126 기준 사실상 퇴출)이라 통계적 특이도가 매우 높음.

---

## 6. 수정 후 동작

- `inet_sock_destruct()` / `tcp_v4_reqsk_destructor()`가 `kfree_rcu()`로 해제를
  RCU grace period 이후로 연기.
- 읽기 경로(`rcu_read_lock()` 구간)가 끝나기 전에는 해제되지 않으므로
  시나리오 A/B 모두 레이스 윈도우가 구조적으로 제거됨.
- 성능 영향: RCU 콜백 1회 추가. 옵션 객체는 연결당 1개, 요청당 1개뿐이므로 무시 가능.

### 패치 상태 판정 방법 (운영)

수정 커널: 5.10.272, 5.15.223, 6.1.190, 6.6.159, 6.12.113, 6.18.56, 7.2.10, 7.3
(업스트림/stable 기준. 배포판별 매핑은 `cve-2026-98432-host-check.sh`에 내장)

---

## 7. 탐지 시그널 (이 분석에서 도출)

| # | 시그널 | 근거 | 특이도 |
|---|---|---|---|
| S1 | IPv4 SYN에 IP 옵션 (RR=7, TS=68, LSRR=131, SSRR=137, RA=148, CIPSO=134 등) | 시나리오 A/B 공격 전제. 정상 트래픽에서 희귀 | 매우 높음 |
| S2 | 동일 4-tuple SYN의 비정상적 고빈도 재전송 (RTO 1초보다 훨씬 짧은 간격) | 레이스 유도를 위해 `tcp_check_req()` 재전송 경로를 반복 호출 | 높음 |
| S3 | 옵션 부착 SYN 이후 연결 미수립(빈번한 RST/폐기) + 반복 시도 | "레이스에서 지면 연결만 실패" 특성의 직접적 흔적 | 중간 |
| S4 | SYNACK의 IP 옵션 페이로드가 수신 SYN 옵션과 비일치(비정형 바이트) | UAF 유출 성공 시 커널 메모리가 옵션으로 echo됨 | 높음 (단, SYNACK 관찰 필요) |
| S5 | 호스트 측: MPTCP 리스너 존재 + 미패치 커널 | 실증 익스플로잇의 대상 조건 | - |

---

## 8. 참고 자료

- 수정 커밋: `e3f33b0a1d89d738e2b913dab519226eaf76e15b` (torvalds/linux)
- CVE 기록: kernel CVE team `CVE-2026-98432.mbox`
- 도입 커밋: `079096f103fa`, `c905dee62232`
- CTI 리포트: gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT `CTI-2026-1030-TCP_KR.md`
- Anthropic: "Discovering vulnerabilities with Claude"
