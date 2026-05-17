# The New Paradigm of AI Cyber Attacks — Big Tech's 'Agentic Defense' Response and Implications for South Korea's Cybersecurity

> **North Korea's APT45 AI Weaponization and Recommendations for South Korea's Defensive Posture**
> *Analysis of GTIG AI Threat Tracker (2026-05) and Policy Implications for the ROK*

| Field | Value |
|---|---|
| **Report ID** | `CTI-2026-0517-AICYBER` |
| **Publication Date** | 2026-05-17 |
| **Classification** | `TLP:GREEN` |
| **Severity** | **HIGH** — Acceleration of AI weaponization by nation-state actors |
| **Confidence** | HIGH (cross-validated against 6 primary sources) |
| **Threat Actors** | APT45 (DPRK-nexus), China-nexus threat actors |
| **Related ATT&CK Techniques** | T1588.005, T1588.006, T1059.006, T1195.002 |
| **References** | 6 primary sources (Google, Microsoft, Palo Alto Networks, YTN) |
| **Author** | Dennis Kim (HoKwang Kim) · Betalabs Inc. |

---

## Key Judgments

- **(HIGH)** The case blocked by Google Threat Intelligence Group (GTIG) represents the first publicly documented instance of a large language model (LLM) autonomously discovering and weaponizing a **semantic logic flaw**, which structurally exceeds the detection scope of existing fuzzers and static analysis tooling.
- **(HIGH)** North Korea's APT45 has moved beyond mere tool usage to the **automation of zero-day analysis and validation**, creating a high likelihood of asymmetric uplift in operational efficiency against South Korean targets.
- **(MEDIUM)** The Agentic Defense frameworks being deployed by Google, Microsoft, and Palo Alto Networks are projected to become the de facto industry standard for global SOC operations within 2026.
- **(MEDIUM)** South Korea's security governance bodies (NIS, KISA, DAXA, FSI) are structurally ill-equipped to respond at AI-era attack tempo (sub-30-minute execution); immediate policy pivots — including **mandatory SBOM and sovereign security-agent development** — are required.

---

## §1. Incident Overview — Google's Disruption of an AI-Generated Zero-Day

On May 12, YTN reported that the Google Threat Intelligence Group (GTIG) had preemptively blocked attempts by threat actors preparing large-scale cyber attacks using artificial intelligence (AI). According to Google's **AI Threat Tracker** report, a specific hacker group had developed functional zero-day exploit code by leveraging AI models — the first publicly documented case of a threat actor successfully using AI to develop a zero-day exploit.

Google promptly notified the affected vendor and completed patching, preventing what could have been large-scale damage. Yet this incident carries weight beyond a single hacking attempt: it demonstrates how the cyber attack landscape is being rapidly restructured around AI.

## §2. Hackers Armed with AI — TTP Analysis

The exploit code captured in this incident was written in Python and contained clear patterns suggesting the involvement of a large language model (LLM). The code included excessive educational docstrings, a hallucinated CVSS score unrelated to actual scoring conventions, and a textbook-clean format — all hallmarks of LLM-generated content.

What stands out is that this attack targeted not a traditional memory corruption or input-validation flaw, but a higher-order **semantic logic flaw**. The attacker used an AI model to contextually read code flow and developer intent, identifying vulnerabilities arising from hard-coded trust assumptions. This is the type of flaw that conventional fuzzers and vulnerability scanners are essentially incapable of detecting.

The weaponization of AI by state-sponsored groups was also captured. According to the report, the North Korean hacking group **APT45** (aliases: Andariel, Onyx Sleet) has been conducting research involving thousands of repeated prompts to AI models in order to analyze vulnerabilities and validate exploit executability. By automating analytical and validation work that previously took months, this constitutes a strategy to secure mass-scale viability for zero-day exploitation.

China-nexus threat actors were found to be using agent tools to autonomously and persistently probe Japanese technology companies for vulnerabilities. They demonstrated sophistication by employing **professional middleware (identity-laundering tools)** and **automated account-registration programs** to gain anonymous access to high-performance LLM services.

### §2.1 MITRE ATT&CK Mapping

| Technique ID | Name | Observation in This Campaign |
|---|---|---|
| `T1588.005` | Obtain Capabilities: Exploits | Acquisition of AI-generated zero-day exploit code |
| `T1588.006` | Obtain Capabilities: Vulnerabilities | LLM-driven discovery of semantic logic flaws |
| `T1059.006` | Command and Scripting Interpreter: Python | LLM-generated Python exploit scripts |
| `T1195.002` | Supply Chain Compromise: Software Dependencies | Targeting of AI supply chain (LiteLLM, Trivy, Checkmarx) |
| `T1583.008` | Acquire Infrastructure: Malvertising | Middleware and account-automation tools for anonymous LLM access |

## §3. Big Tech's Response — The Emergence of 'Agentic Defense'

Google is doing more than blocking attacks — it is deploying AI at the front line of defense. At Google Cloud Next 2026 in April, the company unveiled the **Agentic Defense Portfolio**, an AI cybersecurity framework that unifies threat intelligence, security operations, and proactive response activities.

Google also secured a $32 billion cybersecurity capability through its acquisition of Wiz, a strategic move interpreted as a response to nation-state-level cyber threats. We have entered an era in which AI hunts, detects, and remediates threats at speeds beyond human capability.

Google Cloud's Mandiant Consulting division analyzed that by the end of 2025, threat actors had entered a phase of directly integrating LLMs into malware to perform on-demand code generation. In response, Google is fundamentally redesigning its defense strategy — for example, by introducing AI-based agents such as **CodeMender**, which uses Gemini's reasoning capabilities to automatically remediate code vulnerabilities.

Microsoft has likewise placed AI at the core of its security architecture. At Ignite 2025, Microsoft declared a full transition to an AI-agent-centric Security Operations Center (SOC). Four **Security Copilot agents** automate work across the SOC lifecycle — phishing triage, threat hunting, dynamic threat detection, and threat intelligence briefing generation. The **Predictive Shielding** capability leverages threat intelligence and graph analysis to anticipate the attacker's next move and apply defensive measures preemptively. Microsoft also introduced **Microsoft Agent 365**, an integrated security posture management offering for AI agents that establishes detection and response coverage even for AI-specific threats such as prompt injection and data exposure.

## §4. The Threat to South Korea — A Response That Can No Longer Be Delayed

The AI weaponization activity by the North Korean hacking group APT45, identified in the GTIG report, is a signal South Korea cannot afford to take lightly. APT45 has long targeted South Korea's defense, nuclear, finance, and cryptocurrency exchange sectors. North Korea-linked threat actors — including the **Lazarus Group** — have already demonstrated world-class attack capabilities across SWIFT financial network intrusions, virtual-asset theft, and supply chain attacks. If these actors succeed in using AI to dramatically reduce the "time cost" of zero-day discovery and exploit generation, the frequency and sophistication of cyber attacks against South Korea are highly likely to surge in parallel.

South Korea is particularly exposed: it concentrates "high-value targets" — world-class broadband infrastructure, a fully digitized administrative system, and a top-5 global virtual asset market. Yet structural vulnerabilities remain, including the shortage of security personnel in SMEs and the legacy-system dependence of public institutions. In an era where AI-powered attacks execute within 30 minutes, a defense posture that relies on humans manually reviewing logs is bound to collapse.

### §4.1 Policy Recommendations — Four Imperatives for a Korean 'Agentic Defense' Transition

| # | Task | Responsible Agency | Urgency |
|---|---|---|---|
| **1** | AI-augment the threat intelligence sharing framework anchored by NIS, KISA, and the ROK Cyber Command | NIS, KISA, ROK Cyber Command | Immediate |
| **2** | Establish LLM security guidelines for virtual asset exchanges and fintech firms | FSI, DAXA, FSC | 24–72 hours |
| **3** | Mandate SBOM and continuous monitoring for the AI supply chain (open-source LLM packages, MCP connectors, agent orchestration layers) | KISA, MSIT | Within 7 days |
| **4** | Develop sovereign security agents and cultivate specialist talent through industry-academia collaboration | MSIT, MOTIE, Industry-Academia Consortium | Policy framework within 30 days |

For attackers, AI is already a weapon. For defenders, AI is no longer optional — it is essential. If South Korea is not to fall behind in the AI-era cybersecurity competition, the transition to Agentic Defense must accelerate, starting now.

## §5. The Future of Cybersecurity — The Era of Always-On Monitoring and Active Defense

According to Palo Alto Networks' latest forecast, 2026 is expected to be the **"year of the defender"** — a year in which autonomous AI-based security emerges as the central means of countering AI-driven identity attacks and data poisoning. Attack speed has already accelerated dramatically: by 2025, cases of attacks executing within just 30 minutes had emerged, meaning that traditional passive, reactive defense frameworks can no longer keep pace.

John Hultquist, GTIG's chief analyst at Google, warned that "the race to weaponize vulnerabilities using AI has already begun," adding that "threat actors are using AI across multiple fronts to increase the speed, scale, and sophistication of attacks, and the use of AI by both state-sponsored groups and cybercriminal organizations should not be underestimated."

The GTIG report also pointed out that the AI supply chain itself is becoming a new attack target. Supply chain attacks (`T1195.002`) targeting open-source code repositories such as **LiteLLM, Trivy, and Checkmarx** have been confirmed, with attackers intensively targeting peripheral components — API connectors, orchestration layers, and skill configuration files — rather than the AI models themselves.

What we are witnessing is not merely technological progress, but a full paradigm shift in cybersecurity. Hackers are forging weapons with AI; Big Tech is hardening shields with AI. The always-on monitoring and active defense systems being deployed by global security leaders such as Google, Microsoft, and Palo Alto Networks are no longer a story of the future. They are the new operational reality of cybersecurity in the AI era.

---

## References

### Primary Source
- **YTN**, "The New Paradigm of AI Cyber Attacks", 2026-05-12 — <https://science.ytn.co.kr/news/view.php?idx=4302>

### Threat Intelligence Reports
- **Google Threat Intelligence Group (GTIG)**, "AI Threat Tracker — Trends in AI Misuse by Threat Actors" — <https://blog.google/technology/safety-security/google-threat-intelligence-group-report-ai-threat-trends/>

### Vendor Security Strategy
- **Google Cloud**, "Next '26: Securing the AI Era — Wiz & Agentic Defense" — <https://cloud.google.com/blog/products/security/next-26-security-ai-era-google-cloud-wiz>
- **Microsoft (Japan Blog)**, "Agents Embedded into Workflows: Security Copilot with Microsoft 365 E5" (Ignite 2025) — <https://blogs.windows.com/japan/2025/11/28/agents-embedded-into-workflows-get-security-copilot-with-microsoft-365-e5/>
- **ZDNet**, "How Microsoft's New Security Agents Help Businesses Stay a Step Ahead of AI-Enabled Hackers" — <https://www.zdnet.com/article/how-microsofts-new-security-agents-help-businesses-stay-a-step-ahead-of-ai-enabled-hackers/>
- **Palo Alto Networks**, "Frontier AI: Impact on Cybersecurity (2026 Forecast)" — <https://www.paloaltonetworks.com/cyberpedia/frontier-ai-impact-on-cybersecurity>

### Frameworks Referenced
- MITRE ATT&CK Framework — <https://attack.mitre.org/>
- NIST SP 800-61 (Computer Security Incident Handling Guide)
- NIST SP 800-207 (Zero Trust Architecture)

---

## Cross-References — Related Reports in This Archive

- [`CTI-2026-0420-VERCEL`](./CTI-2026-0420-VERCEL_EN.md) §8 — Impact of AI SaaS supply chain attacks on the Korean Web3 ecosystem (cross-references §2.1 `T1195.002` in this report)
- [`CTI-2026-0320-CORUNA`](./CTI-2026-0320-CORUNA_KR.md) §6 — Structural vulnerabilities of South Korea's government cybersecurity architecture (cross-references §4.1 policy recommendations in this report)

---

## Document Versions

| Language | Markdown | Word |
|---|---|---|
| Korean (KR) | [`CTI-2026-0517-AICYBER_KR.md`](./CTI-2026-0517-AICYBER_KR.md) | [`CTI-2026-0517-AICYBER_KR.docx`](./CTI-2026-0517-AICYBER_KR.docx) |
| English (EN) | [`CTI-2026-0517-AICYBER_EN.md`](./CTI-2026-0517-AICYBER_EN.md) | — |

---

## Disclaimer

This report is an independent analysis based on publicly available OSINT materials and primary press reporting. It does not represent the official position of any referenced organization. The content is intended solely for educational, defensive, research, and policy purposes; use for offensive, intrusive, or illegal activities is strictly prohibited.

---

**© 2026 Dennis Kim (HoKwang Kim)** · Cyber Threat Intelligence Division · Betalabs Inc.
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
