# CTI-2026-0602-MIRAI-ZERODAY_EN.md

# Analysis of a New Mirai Botnet Variant Exploiting Zero-Days

Expansion of IoT zombie networks via zero-day vulnerabilities in D-Link, Zyxel, and industrial routers

| Field | Value |
|------|-----|
| Report ID | CTI-2026-0602-MIRAI-ZERODAY |
| Published | 2026-06-02 |
| Severity | HIGH — Expansion of DDoS infrastructure and mass compromise of vulnerable IoT devices |
| Classification | TLP:GREEN |
| Threat Type | IoT botnet / Zero-day exploitation / DDoS attacks |
| Exploited Vulnerabilities | CVE-2025-29635, CVE-2024-12856, multiple undisclosed zero-days |
| Primary Targets | D-Link DIR-823X, Zyxel CPE, Four-Faith industrial routers, Vimar smart-home devices |
| Analysis Sources | Akamai SIRT, Qianxin XLab, GreyNoise, SecurityWeek |
| Domestic Pickup | No Korean media coverage |
| Confidence | High (consistent observations and technical analysis across multiple security vendors) |
| lang | en |

## 1. Executive Summary

Akamai SIRT (Security Intelligence Response Team) observed in March 2026 that a new Mirai-based botnet was massively exploiting a publicly disclosed vulnerability in D-Link DIR-823X routers. Separately, other cybersecurity researchers warn that more sophisticated Mirai variants are spreading by leveraging zero-day vulnerabilities in industrial routers and smart-home devices. In particular, a botnet named **gayfemboy** has been observed spreading via more than 20 vulnerabilities—including Four-Faith industrial routers (CVE-2024-12856), Neterbit routers, and Vimar smart-home devices—as well as weak Telnet passwords, securing approximately 15,000 active IPs.

## 2. Attack Details

### Primary Exploited Vulnerabilities

| Vulnerability ID | Target Device | Type | Status |
|-----------|-----------|------|------|
| CVE-2025-29635 | D-Link DIR-823X | Command injection (RCE) | Mass exploitation since March 2026 |
| CVE-2024-12856 | Four-Faith industrial routers | Zero-day (RCE) | Exploited by gayfemboy botnet |
| (Unassigned) | Neterbit routers | Zero-day | Exploited by gayfemboy botnet |
| (Unassigned) | Vimar smart-home devices | Zero-day | Exploited by gayfemboy botnet |

### CVE-2025-29635 (D-Link DIR-823X) Details

- **Vulnerability type**: Command Injection
- **Affected firmware**: DIR-823X series (firmware versions 240126, 24082)
- **Attack path**: Crafted POST request to the `/goform/set_prohibiting` endpoint
- **PoC publishers**: Researchers Wang Jinshuai (王金帅) and Zhao Jiangting — later withdrawn from GitHub
- **Product status**: Device discontinued (EoL) in November 2024 → D-Link provides no security patches

### Malware Download Chain

Attackers use CVE-2025-29635 to deliver follow-on malware:

1. Download and execute the `dlink.sh` shell script
2. Install the **tuxnokill** Mirai variant
3. Multi-architecture support → infection of diverse IoT devices
4. DDoS capabilities: TCP SYN/ACK/STOMP, UDP Flood, HTTP attacks

### Gayfemboy Botnet

- **First discovered**: February 2024, by China's Qi'anxin XLab research organization
- **Activity peak**: October–November 2024
- **Scale**: Approximately 15,000 active IPs secured (centered on China, Russia, the United States, Iran, and Türkiye)
- **Target regions**: China, United States, Germany, United Kingdom, Singapore, and others
- **Vulnerabilities used**: 20+ (n-day + zero-day)
- **Notable behavior**: When researchers preemptively registered C2 domains, botnet operators launched sustained DDoS attacks against those domains

## 3. Impact Analysis

### Scope and Scale

- D-Link DIR-823X is widely deployed as a home/SOHO router
- EoL products receive no vendor security patches, leaving them permanently vulnerable
- Based on gayfemboy observations, hundreds of targets are estimated to be attacked daily
- A single botnet can secure thousands to tens of thousands of zombie devices → usable as large-scale DDoS attack infrastructure

### Risk Factors

- **Weaponization for DDoS**: Large-scale distributed denial-of-service attacks using compromised zombie devices
- **Scalability**: Rapid expansion whenever new zero-days are discovered
- **Industrial infrastructure threat**: Attacks on Four-Faith industrial routers threaten OT environments in manufacturing, energy, and logistics facilities
- **Attacks on research environments**: Discovering researchers' preemptive C2 domain registration and then DDoSing the researchers demonstrates an aggressive operator posture

## 4. Defensive Recommendations

### Immediate Actions (Network Administrators and Users)

- **Replace EoL equipment**: Immediately replace unsupported routers such as D-Link DIR-823X
- **Firmware updates**: Update supported devices to the latest firmware
- **Change default admin passwords**: Mirai actively scans for weak Telnet/SSH passwords
- **Disable remote management**: Block WAN-side access to management interfaces
- **Monitor device logs**: Detect anomalous access to endpoints such as `/goform/set_prohibiting`

### Recommendations for Enterprises and Organizations

- Periodically inventory EoL status of IoT devices connected to the network
- Apply network segmentation to isolate IoT devices from general business networks
- Enforce blocking policies for C2 domains and IPs used in attacks
- Consider adopting DDoS mitigation services

## 5. Additional Notes

These analysis cases cover two distinct Mirai-based botnets:

- **tuxnokill observed by Akamai**: A traditional Mirai pattern concentrating on a single vulnerability (CVE-2025-29635)
- **gayfemboy observed by XLab**: Combines 20+ vulnerabilities and actively discovers and exploits zero-days

No link between the two botnets has been confirmed; however, given the accessibility of Mirai source code and the growth of IoT vulnerabilities, such activity is expected to expand further.

GreyNoise additionally reported observing Mirai-variant zero-day attacks targeting Zyxel CPE equipment.

## 6. References

- Akamai SIRT: New Mirai botnet exploiting D-Link router zero-day vulnerabilities
- BlackHat News Tokyo: New Mirai botnet abusing zero-days in routers and smart devices
- SecurityWeek: Mirai Botnet Targets Flaw in Discontinued D-Link Routers
- GreyNoise (via Bing News): Report on Zyxel CPE zero-day exploitation
