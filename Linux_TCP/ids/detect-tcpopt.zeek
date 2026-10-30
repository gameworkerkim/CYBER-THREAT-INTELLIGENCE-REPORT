##! CVE-2026-98432 Linux TCP ip_options UAF - pre-exploit detection
##! Zeek 4/5/6 script.
##!
##! Detects IPv4 TCP SYN packets carrying IP options (attack precondition
##! for the request-socket UAF) and bursts of optioned SYNs from one source.
##! Emits NOTICE(CVE202698432::TcpOptSyn).

module CVE202698432;

export {
    redef enum Notice::Type += { TcpOptSyn };

    const syn_threshold: count = 3 &redef;
    const window_interval: interval = 10sec &redef;
    const retx_interval: interval = 1sec &redef;

    const ipopt_names: table<count> of string = {
        [0]   = "EOL",
        [1]   = "NOP",
        [7]   = "RR",
        [68]  = "TS",
        [130] = "SEC",
        [131] = "LSRR",
        [133] = "ESEC",
        [134] = "CIPSO",
        [137] = "SSRR",
        [145] = "EXT",
        [148] = "RouterAlert",
    };
}

global syn_opt_counts: table[addr] of count &create_expire=window_interval &default=0;
global last_syn_opt: table[addr] of time &default=network_time() &create_expire=window_interval;

function parse_ip_options(data: string, n: count): string {
    local types: vector of string;
    local i: count = 0;
    local t: count = 0;
    local ln: count = 0;
    while (i < n) {
        t = bytestring_to_count(data[i]);
        if (t == 0 || t == 1) {
            if (t != 1)
                types += (t == 0 ? "EOL" : "NOP");
            i += 1;
        } else {
            if (i + 1 >= n)
                break;
            ln = bytestring_to_count(data[i + 1]);
            if (ln < 2 || i + ln > n)
                break;
            types += ipopt_names[t] ? cat(ipopt_names[t]) : cat("UNK", t);
            i += ln;
        }
    }
    return join_string_vec(types, ",");
}

event new_packet(c: connection, p: pkt_hdr)
    {
    if (!p?$ip || !p?$tcp)
        return;
    if (p$ip$proto != 6 || p$ip$hl <= 5)
        return;
    if ((p$tcp$flags & 0x02) == 0 || (p$tcp$flags & 0x10) != 0)
        return;

    # Ethernet assumed (typical capture); VLAN tags handled.
    local off: count = 14;
    local etype: count = 0;
    local data = p$data;
    if (|data| < off + 2)
        return;
    etype = bytestring_to_count(data[12:14]);
    while ((etype == 0x8100 || etype == 0x88A8) && |data| >= off + 4) {
        etype = bytestring_to_count(data[off + 2:off + 4]);
        off += 4;
    }
    if (etype != 0x0800 || |data| < off + p$ip$hl * 4)
        return;

    local optlen = (p$ip$hl - 5) * 4;
    local opts = sub_bytes(data, off + 20, optlen);
    local optstr = parse_ip_options(opts, optlen);

    local src = p$ip$src;
    syn_opt_counts[src] += 1;
    local now = network_time();
    local delta = now - last_syn_opt[src];
    last_syn_opt[src] = now;

    NOTICE([$note=TcpOptSyn,
            $msg=fmt("CVE-2026-98432 precondition: IPv4 SYN with IP options [%s] (%s -> %s:%d)", optstr, src, p$ip$dst, p$tcp$dport),
            $sub=fmt("count=%d interval=%.3fs", syn_opt_counts[src], delta),
            $src=src,
            $id=c$id,
            $identifier=cat(src, optstr)]);

    if (syn_opt_counts[src] >= syn_threshold)
        NOTICE([$note=TcpOptSyn,
                $msg=fmt("CVE-2026-98432 probe pattern: %d optioned SYNs from %s within %s", syn_opt_counts[src], src, window_interval),
                $sub=fmt("last option set: %s", optstr),
                $src=src,
                $id=c$id,
                $identifier=cat(src, "burst")]);

    if (delta < 1.0)
        NOTICE([$note=TcpOptSyn,
                $msg=fmt("CVE-2026-98432 race grooming: optioned SYN retransmit %.3fs after previous from %s", delta, src),
                $src=src,
                $id=c$id,
                $identifier=cat(src, "groom")]);
    }
