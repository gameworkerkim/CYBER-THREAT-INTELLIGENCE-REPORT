#!/usr/bin/env python3
"""CVE-2026-98432 (Linux TCP ip_options UAF) 사전 탐지용 수동 감지기.

IPv4 TCP SYN에 IP 옵션(RR/TS/LSRR/SSRR/RA/CIPSO 등)이 부착된 패킷과,
동일 4-tuple의 비정상 고빈도 SYN 재전송(레이스 유도 패턴)을 탐지한다.
Linux AF_PACKET raw socket 기반이며 표준 라이브러리만 사용한다.

필요 권한: root 또는 CAP_NET_RAW
"""

import argparse
import collections
import json
import socket
import struct
import sys
import time

ETH_P_IP = 0x0800
VLAN_TYPES = (0x8100, 0x88A8, 0x9100)

IPOPT_NAMES = {
    0: "EOL", 1: "NOP", 7: "RR", 68: "TS", 130: "SEC",
    131: "LSRR", 133: "ESEC", 134: "CIPSO", 137: "SSRR",
    145: "EXT", 148: "ROUTER_ALERT",
}

TCP_FLAG_SYN = 0x02
TCP_FLAG_ACK = 0x10
TCP_FLAG_RST = 0x04

ETH_HDR_LEN = 14


def parse_ip_options(opts):
    parsed = []
    i = 0
    n = len(opts)
    while i < n:
        t = opts[i]
        if t == 0:
            parsed.append((t, 1, b""))
            i += 1
        elif t == 1:
            parsed.append((t, 1, b""))
            i += 1
        else:
            if i + 1 >= n:
                parsed.append((t, n - i, opts[i + 1:n]))
                break
            ln = opts[i + 1]
            if ln < 2 or i + ln > n:
                parsed.append((t, n - i, opts[i + 1:n]))
                break
            parsed.append((t, ln, opts[i + 2:i + ln]))
            i += ln
    return parsed


def parse_frame(data):
    if len(data) < ETH_HDR_LEN + 20 + 20:
        return None
    eth_type = struct.unpack("!H", data[12:14])[0]
    off = ETH_HDR_LEN
    while eth_type in VLAN_TYPES and len(data) >= off + 4:
        eth_type = struct.unpack("!H", data[off + 2:off + 4])[0]
        off += 4
    if eth_type != ETH_P_IP:
        return None
    if len(data) < off + 20:
        return None
    ip = data[off:off + 20]
    ver_ihl = ip[0]
    if ver_ihl >> 4 != 4:
        return None
    ihl = (ver_ihl & 0x0F) * 4
    if ihl < 20 or len(data) < off + ihl:
        return None
    if ip[9] != 6:
        return None
    src_ip = socket.inet_ntoa(ip[12:16])
    dst_ip = socket.inet_ntoa(ip[16:20])
    ipopts = data[off + 20:off + ihl]
    tcp_off = off + ihl
    if len(data) < tcp_off + 20:
        return None
    tcp = data[tcp_off:]
    sport, dport = struct.unpack("!HH", tcp[0:4])
    seq = struct.unpack("!I", tcp[4:8])[0]
    doff = (tcp[12] >> 4) * 4
    flags = tcp[13]
    return {
        "src": src_ip,
        "dst": dst_ip,
        "sport": sport,
        "dport": dport,
        "seq": seq,
        "flags": flags,
        "doff": doff,
        "ipopts": ipopts,
    }


class Detector:
    def __init__(self, window=10.0, rto_min=0.2, threshold=3, emit_interval=5.0):
        self.window = window
        self.rto_min = rto_min
        self.threshold = threshold
        self.emit_interval = emit_interval
        self.src_syns = collections.defaultdict(collections.deque)
        self.tuple_last = {}
        self.tuple_retx = collections.defaultdict(collections.deque)
        self.last_emit = {}

    def _prune(self, dq, now):
        while dq and now - dq[0] > self.window:
            dq.popleft()

    def _should_emit(self, key, now, severity):
        last = self.last_emit.get(key)
        if last and now - last < self.emit_interval:
            return False
        if last and severity == "info":
            return False
        self.last_emit[key] = now
        return True

    def feed(self, pkt, now):
        alerts = []
        if not pkt:
            return alerts
        flags = pkt["flags"]
        if not (flags & TCP_FLAG_SYN) or (flags & TCP_FLAG_ACK):
            return alerts
        if not pkt["ipopts"]:
            return alerts

        opts = parse_ip_options(pkt["ipopts"])
        opt_types = sorted({t for t, _, _ in opts if t not in (0, 1)})
        opt_hex = pkt["ipopts"].hex()

        src = pkt["src"]
        dq = self.src_syns[src]
        self._prune(dq, now)
        dq.append(now)

        tuple_key = (src, pkt["sport"], pkt["dst"], pkt["dport"])
        retx = self.tuple_retx[tuple_key]
        self._prune(retx, now)
        retx.append(now)
        last = self.tuple_last.get(tuple_key)
        same_seq = last is not None and last[0] == pkt["seq"]
        delta = (now - last[1]) if last else None
        self.tuple_last[tuple_key] = (pkt["seq"], now)

        common = {
            "src_ip": src,
            "dst_ip": pkt["dst"],
            "sport": pkt["sport"],
            "dport": pkt["dport"],
            "opt_types": opt_types,
            "opt_hex": opt_hex,
        }

        if (same_seq and delta is not None and delta < self.rto_min
                and self._should_emit(("groom", tuple_key), now, "high")):
            alerts.append(dict(common, event="race_grooming",
                               severity="high",
                               retx_count=len(retx),
                               inter_arrival_ms=int(delta * 1000)))

        if len(dq) >= self.threshold and self._should_emit(("probe", src), now, "medium"):
            alerts.append(dict(common, event="syn_ipopt_probe",
                               severity="medium",
                               syn_count=len(dq),
                               window_s=self.window))

        if self._should_emit(("info", src), now, "info"):
            alerts.append(dict(common, event="syn_ipopt",
                               severity="info", syn_count=len(dq)))

        return alerts


def open_socket(iface, promisc, snaplen):
    sock = socket.socket(socket.AF_PACKET, socket.SOCK_RAW, socket.htons(0x0003))
    sock.bind((iface, 0))
    if promisc:
        sock.setsockopt(socket.SOL_PACKET, socket.PACKET_ADD_MEMBERSHIP,
                        struct.pack("!IHH8s", 0, 0, 0, b"\x00" * 8))
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 4 * 1024 * 1024)
    return sock


def format_alert(alert, fmt, now):
    ts = time.strftime("%Y-%m-%dT%H:%M:%S", time.localtime(now))
    alert = dict(alert, ts=ts)
    if fmt == "json":
        return json.dumps(alert, ensure_ascii=False)
    types = ",".join(IPOPT_NAMES.get(t, str(t)) for t in alert["opt_types"])
    extra = ""
    if alert["event"] == "race_grooming":
        extra = " retx=%d inter=%dms" % (alert["retx_count"], alert["inter_arrival_ms"])
    return ("%s [%s] %s src=%s:%d dst=%s:%d opts=[%s]%s" %
            (ts, alert["severity"].upper(), alert["event"],
             alert["src_ip"], alert["sport"], alert["dst_ip"], alert["dport"],
             types, extra))


def selftest():
    def ipv4(ihl_words, src, dst, opts=b""):
        return (struct.pack("!BBHHHBBH4s4s", (4 << 4) | ihl_words, 0,
                            20 + len(opts), 1, 0x4000, 64, 6, 0,
                            socket.inet_aton(src), socket.inet_aton(dst)) + opts)

    def tcp(sport, dport, seq, flags):
        return struct.pack("!HHIIBBHHH", sport, dport, seq, 0, 0x50,
                           flags, 65535, 0, 0)

    def eth(ip_part):
        return (b"\x02\x00\x00\x00\x00\x02" + b"\x02\x00\x00\x00\x00\x01" +
                struct.pack("!H", ETH_P_IP) + ip_part)

    det = Detector(window=10.0, rto_min=0.2, threshold=3)
    now = 1000.0
    results = []

    plain = eth(ipv4(5, "10.0.0.1", "192.168.0.1") + tcp(40000, 443, 1, TCP_FLAG_SYN))
    results.append(("SYN without options -> no alert",
                    det.feed(parse_frame(plain), now) == []))

    rr = bytes([7, 3, 4]) + bytes([0]) * 5
    syn_opt = eth(ipv4(7, "10.0.0.1", "192.168.0.1", rr) + tcp(40000, 443, 2, TCP_FLAG_SYN))
    out = det.feed(parse_frame(syn_opt), now)
    seen = list(out)
    results.append(("SYN with RR option -> syn_ipopt alert",
                    any(a["event"] == "syn_ipopt" and a["opt_types"] == [7] for a in out)))

    for i in range(3):
        now += 0.5
        seen.extend(det.feed(parse_frame(syn_opt), now))
    results.append(("3+ optioned SYNs from one src -> probe alert",
                    any(a["event"] == "syn_ipopt_probe" for a in seen)))

    for i in range(2):
        now += 0.05
        seen.extend(det.feed(parse_frame(syn_opt), now))
    results.append(("same-seq retransmit < 200ms -> race_grooming alert",
                    any(a["event"] == "race_grooming" for a in seen)))

    ts_opt = bytes([68, 8]) + b"\x01\x02\x03\x04\x05\x06"
    syn_ts = eth(ipv4(7, "10.0.0.2", "192.168.0.1", ts_opt) + tcp(41000, 443, 9, TCP_FLAG_SYN))
    out = det.feed(parse_frame(syn_ts), now)
    results.append(("SYN with TS option -> detected as [68]",
                    any(a["event"] == "syn_ipopt" and a["opt_types"] == [68] for a in out)))

    ok = True
    for name, passed in results:
        print("PASS" if passed else "FAIL", "-", name)
        ok = ok and passed
    return 0 if ok else 1


def main():
    ap = argparse.ArgumentParser(description="CVE-2026-98432 SYN/IP-option passive detector")
    ap.add_argument("--iface", default="eth0")
    ap.add_argument("--promisc", action="store_true")
    ap.add_argument("--snap-len", type=int, default=96)
    ap.add_argument("--window", type=float, default=10.0)
    ap.add_argument("--rto-min", type=float, default=0.2,
                    help="re-transmission interval below which grooming is flagged (s)")
    ap.add_argument("--threshold", type=int, default=3)
    ap.add_argument("--format", choices=["json", "text"], default="json")
    ap.add_argument("--log", help="append alerts to this file as well")
    ap.add_argument("--selftest", action="store_true")
    args = ap.parse_args()

    if args.selftest:
        sys.exit(selftest())

    det = Detector(window=args.window, rto_min=args.rto_min,
                   threshold=args.threshold)
    try:
        sock = open_socket(args.iface, args.promisc, args.snap_len)
    except PermissionError:
        print("permission denied: run as root or grant CAP_NET_RAW", file=sys.stderr)
        return 1
    except OSError as e:
        print("cannot open %s: %s" % (args.iface, e), file=sys.stderr)
        return 1

    logf = open(args.log, "a") if args.log else None
    print("listening on %s (syn/ip-options detector, window=%gs threshold=%d)"
          % (args.iface, args.window, args.threshold), file=sys.stderr)

    while True:
        data = sock.recv(65535)
        now = time.time()
        for alert in det.feed(parse_frame(data), now):
            line = format_alert(alert, args.format, now)
            print(line, flush=True)
            if logf:
                logf.write(line + "\n")
                logf.flush()


if __name__ == "__main__":
    sys.exit(main())
