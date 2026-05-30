| id             | CTI-2026-0530-CHATGPHISH                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| title          | ChatGPhish — A ChatGPT Renderer Trust Flaw That Turns AI Summaries Into a Phishing Surface                              |
| subtitle       | Implicit trust of Markdown links & images, indirect prompt injection, and the QR-code pivot                            |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                          |
| email          | gameworker@gmail.com                                                                                                   |
| github         | gameworkerkim                                                                                                          |
| date           | 2026-05-30                                                                                                             |
| classification | TLP:GREEN                                                                                                              |
| severity       | MEDIUM                                                                                                                  |
| lang           | en                                                                                                                     |
| tags           | AI-Security · Prompt-Injection · LLM-Phishing · Data-Exfiltration · Indirect-Injection · QR-Pivot                     |
| threat_actors  | N/A (research disclosure · Permiso Security)                                                                            |
| cve            | No CVE assigned (Bugcrowd report; vendor replied "could not reproduce")                                                 |
| frameworks     | MITRE ATLAS · OWASP LLM Top 10 (LLM01 Prompt Injection) · NIST AI RMF                                                   |
| license        | CC BY-NC-SA 4.0                                                                                                        |


# ChatGPhish — A ChatGPT Renderer Trust Flaw That Turns AI Summaries Into a Phishing Surface

> **Report ID** `CTI-2026-0530-CHATGPHISH` · **Published** 2026-05-30 · **Classification** `TLP:GREEN` · **Severity** 🟠 MEDIUM
> **Author** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*Implicit trust of Markdown links & images, indirect prompt injection, and the QR-code pivot*

---

## Table of Contents

1. Executive Summary (TL;DR)
2. Vulnerability Analysis — the renderer's implicit trust
3. Three attack primitives
4. Attack Scenario — when a normal web page becomes the payload
5. Disclosure timeline and vendor response
6. Enterprise/Individual Perspective — the attack surface that expanded "from email to the browser"
7. Detection & Mitigation
8. Conclusion
9. References

---

## Executive Summary (TL;DR)

On May 29, 2026, Permiso Security disclosed a vulnerability in OpenAI ChatGPT arising from the AI assistant's **implicit trust of Markdown links and images**. The technique is codenamed **ChatGPhish** (researcher Andi Ahmeti).

The core is that the `chatgpt.com` response renderer **trusts Markdown link and image URLs that originated from a third-party page the assistant has just summarized**. The renderer auto-fetches those images and surfaces the links as **live, clickable elements inside the trusted assistant UI**.

As a result, an attacker need only plant a small payload on any web page; the moment the victim asks ChatGPT to summarize it, (1) attacker-hosted images are auto-loaded, **leaking IP, User-Agent, and Referer**, and (2) phishing links, fake system alerts, and QR codes are rendered **cloaked in the visual trust of ChatGPT's own UI**. Because the attack shifts from email/attachments to **the browser/AI summary**, the attack surface widens significantly.

### Key Judgments

| #    | Judgment                                                                                                                  | Confidence      |
| ---- | ------------------------------------------------------------------------------------------------------------------------- | --------------- |
| KJ-1 | The flaw's root is **indirect prompt injection**: the model cannot distinguish its own generated content from Markdown pulled from external sources. | **High**        |
| KJ-2 | The assistant UI's **visual trust** is weaponized. Fake security alerts and phishing links render indistinguishably from ChatGPT's own output, with no source labeling. | **High**        |
| KJ-3 | The **QR-code pivot** bypasses desktop URL defenses (blocklists, hover previews, password-manager domain checks) entirely. The destination only becomes visible after scanning on a second device. | **Medium-High** |
| KJ-4 | IP/UA/Referer leakage from auto-fetched images is usable for target reconnaissance and tracking, but is not full-conversation theft. The impact concentrates on **information leakage + phishing delivery**. | **Medium**      |
| KJ-5 | With the vendor replying "could not reproduce / duplicate" and no confirmed fix at publication, defenders must assume **it is still vulnerable** (especially the mobile app may be unmitigated). | **Medium**      |

---

## 1. Vulnerability Analysis — the renderer's implicit trust

ChatGPhish stems not from a traditional flaw like memory corruption or authentication bypass, but from a **collapse of trust boundaries inherent to LLM systems**.

When a user asks ChatGPT to summarize a web page, the model fetches and processes that page (third-party, untrusted content). The problem is that when the result is rendered in the assistant response window, the `chatgpt.com` renderer **trusts the Markdown link and image URLs originating from that page as if they were the assistant's own output**. The renderer auto-fetches image URLs and displays links as live, clickable elements.

The browser's same-origin policy offers no protection here, because the AI assistant executes within the **user's authenticated context**, nullifying traditional web security boundaries. As the researcher put it, ChatGPT *"cannot tell its own generated content from attacker-controlled Markdown pulled from external sources."*

---

## 2. Three attack primitives

Permiso identified three attack primitives derived from this trust flaw.

| # | Primitive | Description |
| --- | --- | --- |
| ① | **UI redress / phishing** | Attacker-controlled Markdown links render as live clickable elements inside the ChatGPT UI with no source label. Users cannot distinguish attacker-injected URLs from ChatGPT-generated ones. |
| ② | **Spoofed system alerts** | The renderer displays attacker text styled as legitimate "account security" notifications, inheriting the visual trust of the assistant's own UI. |
| ③ | **QR-code pivot** | QR images auto-rendered from attacker S3 buckets bypass all desktop URL defenses. The destination only becomes visible after scanning on a second device, evading browser blocklists and domain checks. |

Beyond this, the auto-fetch of embedded images alone delivers the victim's **IP, User-Agent, and Referer** to the attacker's server (information leakage).

---

## 3. Attack Scenario — when a normal web page becomes the payload

A typical scenario:

1. The attacker hides ChatGPT-targeted instructions in an arbitrary web page (or e.g. a GitHub page). The research demonstrated injecting fake-security-alert instructions into a GitHub page.
2. The victim asks ChatGPT to summarize that page during work (a normal action).
3. When ChatGPT processes the page, the hidden instructions surface in the response — phishing links, fake account-security alerts, remote images, and QR codes render inside the trusted UI.
4. Simultaneously, attacker-hosted images auto-load, leaking the victim's IP/UA/Referer.
5. If the victim scans the QR on their phone from the desktop, they are taken to attacker S3-bucket content, fully bypassing desktop defenses.

Throughout this, the victim *need not open a malicious attachment or react to a suspicious message.* The everyday act of "asking a trusted AI to summarize a web page" is the trigger.

---

## 4. Disclosure timeline and vendor response

| Date | Event |
| --- | --- |
| 2026-04-29 | Permiso's initial report to OpenAI via Bugcrowd — *"Untrusted Markdown Rendering Leads to XSS, Phishing, and Data Exfiltration"* |
| (after) | OpenAI: replied "could not be reproduced"; treated as a duplicate |
| (after) | Permiso: explained differences between its report and the alleged "duplicate" and requested more info → no response |
| 2026-05-29 | Permiso discloses ChatGPhish. Researcher: "fix application unconfirmed — to be safe, assume it remains vulnerable" |

The researcher stated that **fix application was unconfirmed** at publication. This report treats it under the *conservative assumption that "it is still vulnerable."* A prior similar image-Markdown-based data leak (2023, Johann Rehberger; `url_safe` validation introduced) that was incompletely mitigated also supports this assumption.

---

## 5. Enterprise/Individual Perspective — the attack surface that expanded "from email to the browser"

As Permiso noted, this flaw **shifts the attack's center of gravity from email to the browser**. The more an organization adopts ChatGPT for research/summarization, the more any malicious web page an employee is asked to process can turn ChatGPT into a phishing surface.

- **Transfer of trust** — users are trained to trust assistant output. That trust is inherited directly by the attacker.
- **Detection gap** — existing security tools are tuned to monitor email/network traffic, leaving content rendered by AI inside the browser outside their visibility.
- **Mobile risk** — in past cases, mobile apps tended to receive client-side validation late. Even if desktop is mitigated, residual mobile risk can be large.

This is another case in the same family as MCP bias injection (`CTI-2026-0422-MCP` §6) — *"weaponizing AI output itself without code execution."*

---

## 6. Detection & Mitigation

1. **Boundary on summary output** — train users to treat links/alerts within AI-summarized/rendered content as "external, unverified content." Unconditionally distrust an "account security alert" inside the assistant.
2. **Control auto image loading** — where possible, restrict external image auto-fetch at the client/enterprise-policy level or route through a proxy to block IP/UA/Referer exposure.
3. **QR caution** — do not trust QR codes rendered on the desktop screen. Educate users to treat QR codes whose source cannot be verified before scanning as blocked.
4. **Tier the trust of summary targets** — recognize the risk of summarizing untrusted external pages with AI; restrict sensitive-work accounts to trusted sources.
5. **Track vendor patches** — follow OpenAI's official fix/mitigation announcements and separately confirm mobile-app coverage.
6. **Generalize indirect-injection defense** — per OWASP LLM Top 10 (LLM01), MITRE ATLAS, and NIST AI RMF, apply output sanitization, source labeling, and rendering boundaries as design principles to every AI workflow that processes external content.

---

## 7. Conclusion

By severity alone (information leakage + phishing delivery), ChatGPhish is not Critical. But the **nature** of the threat matters. It belongs to the structural-vulnerability family of the LLM era that converts the *trust* an AI assistant has built into an attack surface. With no memory corruption and no privilege escalation, the single fact that *"the model cannot tell its own output from external content"* is enough to enable phishing, reconnaissance, and a device pivot.

The starting point of defense is clear: **AI output must be the start of verification, not the end of trust.** When a user asks ChatGPT to summarize a page, every link, alert, and QR within the result may be unverified external content. The very cognitive habit of "trusting AI more than people" is the biggest asset this attack targets.

> *Before summarizing a sensitive page with AI, first adopt the premise: "every link in this response may have come from outside."*

---

## References

[1] Ravie Lakshmanan, "ChatGPhish Vulnerability Turns ChatGPT Web Summaries Into a Phishing Surface", The Hacker News, 2026-05-29. <https://thehackernews.com/2026/05/chatgphish-vulnerability-turns-chatgpt.html>

[2] "New ChatGPT Vulnerability Lets Attackers Turn Web Pages Into Phishing Payloads", Cyber Security News, 2026-05-29. <https://cybersecuritynews.com/chatgpt-vulnerability-chatgphish-attack/>

[3] Andi Ahmeti (Permiso Security) via The Register, "ChatGPT blindly trusts browser content, turning the page into a payload", The Register, 2026-05-29. <https://www.theregister.com/research/2026/05/29/chatgpt-prompt-injection-turns-web-pages-into-phishing-lures/>

[4] Tenable Research, "HackedGPT: Novel AI Vulnerabilities Open the Door for Private Data Leakage", 2025-11. <https://www.tenable.com/blog/hackedgpt-novel-ai-vulnerabilities-open-the-door-for-private-data-leakage>

[5] Johann Rehberger, "OpenAI Begins Tackling ChatGPT Data Leak Vulnerability", Embrace The Red, 2023-12. <https://embracethered.com/blog/posts/2023/openai-data-exfiltration-first-mitigations-implemented/>

---

© 2026 Dennis Kim (김호광) · This document is published as part of an independent CTI archive (TLP:GREEN).
Contact: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
