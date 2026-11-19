<!--
---
id: CTI-2026-1120-DPRK-AI-TSUNAMI
title: "North Korea's AI Tsunami - The Latest Traits of North Korean Hacking and a Proposal for a New Paradigm"
title_ko: "북한의 AI 쓰나미 - 북한 해킹의 최신 특징과 새로운 패러다임 제안"
subtitle: "Lazarus and PHP2Shell, Kimsuky and NodeLinkRAT, and attacks that arrive at machine speed"
description: "A narrative report and policy proposal on the latest traits of North Korean hacking, built on the Lazarus PHP2Shell targeting and the Kimsuky attack on a National Assembly seminar attendee."
abstract: |
  This report examines two cases from October and November 2026: PHP2Shell targeting by Lazarus-linked operators (including 30 servers and domains in South Korea) and a suspected Kimsuky campaign that singled out a National Assembly seminar attendee and delivered NodeLinkRAT.
  North Korean hacking uses the supply chain as a foothold and chooses its targets with precision, and AI is shortening the time needed for weaponization and preparation. Monthly patching and human-approval workflows cannot keep up.
  The report proposes a new paradigm (manage exposure time, control dependencies and write access, machine-speed first response under human control) and 16 policy proposals for government, financial regulators, companies and individuals. TLP:CLEAR. Not legal or investment advice.
date: 2026-11-20
updated: 2026-11-20
author: "Dennis Kim (HoKwang Kim)"
github: "gameworkerkim"
lang: en
tags:
  - DPRK
  - Lazarus
  - Kimsuky
  - AI-Hacking
  - Supply-Chain
  - Policy
keywords:
  - "North Korean hacking"
  - "AI tsunami"
  - "PHP2Shell"
  - "Lazarus"
  - "Kimsuky"
  - "NodeLinkRAT"
  - "policy proposal"
group: dprk
featured: false
featured_rank: 99
schema_type: TechArticle
classification: "TLP:CLEAR"
severity: HIGH
confidence: "B2"
license: "CC BY-NC-SA 4.0"
draft: false
robots: index,follow
---
-->

# North Korea's AI Tsunami - The Latest Traits of North Korean Hacking and a Proposal for a New Paradigm

Nov 20, 2026 · Dennis Kim · Former CEO of Cyworld · Cyber Threat Intelligence Report and Policy Proposal · TLP:CLEAR

---

## Summary

North Korean hacking has converged on a two-stage structure: build a foothold through the supply chain, then choose targets with precision and collect. AI has compressed that work to within 72 hours of a vulnerability being announced, and the operators have begun to use smarter, more socially engineered attacks. In October 2026, the day after the patch for a critical flaw in the PHP core (PHP2Shell) was released, operators assessed to belong to the Lazarus ecosystem were observed discussing targets. Their list of 216 targets in 10 countries included 30 servers and domains in South Korea.

In the same period, a group believed to be Kimsuky picked a person who had actually attended a National Assembly seminar on September 9 and impersonated a senior aide in a lawmaker's office. The first email deliberately left out the attachment to draw a reply, and only then was the malicious file sent. Using a public notepad service as a command channel, the operators swapped tools over four months and finally deployed a new remote-access trojan, NodeLinkRAT. One case is an attempt to step into many industries at once through the common base of a runtime. The other shows how precisely a single person can be chosen, and how carefully the weak links that connect to South Korea's legislature are being worked.

North Korean hacking does not go after the points where security is strong. It concentrates on the weak links around the National Assembly and senior government posts, starting with aides and secretaries.

This report makes three arguments.

First, the unit of time for defense has changed. Microsoft reports that the median time for a vulnerability to become a hacking weapon has fallen below 24 hours, and on November 16 Google said it had observed, for the first time, an automated framework that reads patches, writes attack code and runs it. Human involvement is being minimized: vulnerabilities are triaged automatically, and even hacking tools and malware are now being automated through AI and LLMs.

Second, North Korean groups are adopting this trend quickly. Several organizations have reported signs that they triage public proof-of-concept code with local AI models, mass-produce lure documents with AI, and use agentic tools in post-intrusion work. Third, against this speed, a response built on monthly patching, waiting for human approval and blocking lists of malicious addresses is too slow, and that is where South Korea's response stands today. The AI revolution has made the speed of attack a threat exactly to the degree that policy has failed to keep up.

A new paradigm is therefore needed. We have to manage exposure time instead of patch cycles, control dependencies and write access instead of perimeters, and move to a system in which machines take the first response and people hold final control. This document proposes tasks along those lines for the government and National Assembly, financial regulators, companies and individuals.

One point should be stated in advance. The Optimizely supply-chain attack, the NHN Dooray breach and the breach of Coinone's customer-support vendor, all reported in mid-November, have not been confirmed as North Korean operations. This document treats them only as background that shows how wide open the roads North Korea likes to use are.

## 1. The Landscape in Mid-November 2026

Over five days, from November 12 to 16, five incidents of different kinds were disclosed one after another. Before dawn on the 12th, the server of MetaM, the vendor handling Coinone's customer support, was intruded. From that night into the early hours of the 13th, accounts at some customers of the collaboration tool NHN Dooray were taken over. On the 15th, South Korean media reported that 30 Korean servers were on the target list of a Lazarus-linked group, and on the 16th Genians disclosed a suspected Kimsuky campaign aimed at a National Assembly seminar attendee. Also on the 16th, malicious scripts were delivered to the websites of 178 organizations through the web experimentation tool Optimizely.

If all five are bundled together as North Korea's work, the analysis collapses into a "North Korea did everything" theory and loses credibility.

At present, two of them are assessed as North Korea-linked: Lazarus and Kimsuky. The Optimizely case is classified as the work of an unidentified, financially motivated actor after cryptocurrency address swapping and card data, and no one has been named behind the Dooray and Coinone cases. No direct link has been confirmed between the domestic leaks and the Lazarus targeting.

Even so, the five cases are worth reading together as one hacking trend and one shared frame of understanding. In none of the recent breaches was the core system broken head-on. For Optimizely the entry point was a settings field that customers can edit themselves. For PHP2Shell it was the runtime beneath the application. For Dooray it was the password-reset procedure and the open API. For Coinone it was not the trading system but an outsourced customer-support database. For the National Assembly seminar case it was one person's mailbox.

This structure, which starts at a periphery the defender does not directly control and works inward, overlaps with the way North Korean groups achieved their largest results in 2025 and 2026.

Another announcement from the same week forms the backdrop of this report. In a report dated November 16, Google Threat Intelligence Group said it had observed for the first time a framework that compares code before and after each security patch, finds the flaw, writes an exploit and runs it with no human involved. The tool carried comments in Russian and is not connected to North Korea. But an environment in which the release of a patch is the starting gun for attacks has already arrived, and North Korea is one of the most organized actors moving in that environment. That is the starting point of this document.

## 2. Case 1 — Lazarus and the PHP2Shell Attack: Targeting That Began the Day After the Patch

PHP2Shell is the name given to two unauthenticated remote code execution flaws found in the PHP core (CVE-2026-109618 and CVE-2026-109619). Because the flaw sits in the engine that runs a website's code and not in the code itself, sites that kept WordPress or their shopping platform fully up to date are still exposed if the runtime was not fixed. The fixed versions were released on October 21. Details, however, had already spread a day earlier at the advance-notice stage (security people really do not keep embargoes), and CYFIRMA places the earliest exploitation on October 17, four days before the patch. In effect the attacks started before the patch existed.

What CYFIRMA observed was the movement right after that. On October 22, the day after the patch, operators dividing up tasks in Korean on a closed I2P channel were discussing how to target PHP servers worldwide. They took public proof-of-concept code, ranked it with a local AI model and validated it in a lab, then touched targets at low frequency while rotating scan nodes to avoid detection. On the 24th a target list of 216 hosts and 21 previously compromised scan nodes were identified. On the 28th the operators remarked that some IP ranges in South Korea, Japan, the United States, Thailand, Indonesia and India looked promising. On the 29th a claim appeared on the channel that the target set had grown to 581.

In the captured list of 216, South Korea accounts for 30, fourth after the United States (49), Japan (47) and India (31). The priority sectors named were government, banking and finance, telecommunications, critical infrastructure, logistics and aviation, manufacturing, and online trading platforms. Reported post-intrusion actions include installing web shells, collecting server configuration files and database credentials, and moving through internal networks. It stands out that the operators looked separately for financial, trading and wallet material. This is the basis for the assessment that they carry a dual mandate of money and espionage.

It is important to separate what is confirmed from what is not. Being on the list means being targeted, not being breached. Whether the 30 Korean sites were actually attacked, and whether any attack succeeded, has not been confirmed, and both the figure of 581 and the talk of opened web shells are only the attackers' own claims. Security vendors have not yet concluded that the actor is North Korea. CYFIRMA put its confidence in the Lazarus link at moderate on October 22 and raised it to high on the 29th, while itself noting that language alone does not establish that the actor is North Korean and that a Korean-speaking criminal group remains possible. Still, when the hacking pattern, the language and the sites targeted are analyzed together, the likelihood of North Korea is moderate or higher and is hard to rule out.

There is one more report around the same vulnerability. The security firm Aviatrix wrote that in October a government entity in Europe was breached through this flaw, and that within two hours of initial intrusion the attacker had obtained password hashes and multi-factor secrets and attempted to reach the highest privilege in the internal directory. Because command output was structured for machine parsing, Aviatrix inferred that agentic AI was used, and it assessed the link to the Lazarus ecosystem with moderate confidence. The limits are clear: the victim is unnamed, the AI use is inferred from traces, and this is one vendor's analysis. Even so, a timetable of two hours from intrusion to an attempt at full control shows how far the baseline that defenders must assume has fallen. This is why breaking a zero-day embargo crosses a line and inevitably causes enormous damage.

The case leaves two lessons. One concerns the scope of the supply chain. A supply-chain attack usually brings a specific vendor's product to mind, but a language runtime is a far wider common base. A single flaw gives entry to government, finance, telecommunications and manufacturing at once. The other concerns the basics of remediation. This flaw is closed only when the PHP core is fixed and the worker processes that handle web requests are fully restarted. If the configuration is merely reloaded and old workers remain, a server believed to be patched stays open.

Vulnerabilities in PHP, the Java JVM and NGINX have landed one after another, and the fatigue and workload of the engineers who run infrastructure and apply security patches is emerging as a problem in its own right.

## 3. Case 2 — Kimsuky and NodeLinkRAT: How an Attendee of the September 9 National Assembly Seminar Was Chosen

The suspected Kimsuky campaign used as bait not a fake event but a real one, and a real fact of attendance. A seminar was held at the National Assembly on September 9. Three days later, on the 12th, one of the people who had attended received an email in the name of a senior aide in a lawmaker's office. The subject was a request for documents related to the seminar honorarium, and the message asked the recipient to fill in an application form and send it back so the honorarium could be paid. The form, however, was not attached.

The omission was not a mistake. It was an attack method designed with social-engineering precision. When the recipient replied the next day that there was no attachment, the attacker then sent a compressed file through a webmail large-attachment link. Once the malicious file becomes a document the victim asked for, suspicion drops, and the first email carries no attachment for a scanner to catch. Inside the archive was a shortcut file made to look like a Hangul (HWP) document. Opening it ran a hidden command that downloaded a script from an external server while the genuine honorarium application form appeared on screen. The victim believes a normal document was opened.

The question to ask here is how the attacker knew who had come to that seminar. This has not been disclosed. Public information alone would be enough, such as event notices and booklets, photos from the venue and attendees' social media posts, and it cannot be ruled out that an account belonging to the organizer or another attendee had been compromised first. Either way the conclusion is the same. The schedules and personal networks of the National Assembly and the policy community are already raw material for the attacker's social engineering, and an outside expert who attends a single event becomes a target alone, outside the security perimeter of any institution.

The way the campaign was run after infection is its second characteristic. Every 38 minutes, the script planted on the victim's PC connected to a page on a public cloud-based online notepad service, fetched what was written there and executed it in memory. The attacker could change tools just by editing the note, without touching the infected PC. North Korea now prefers, over a dedicated C2 server issuing hacking commands, cloud services that the public knows well and that security analysts skim past when reading logs.

On that note, a XenoRAT remote-access variant appeared in June. In mid-September came code that surveyed antivirus products, Telegram folders and recent file lists and sent the results to Dropbox and MEGA. On September 28 came code that exfiltrated Office, PDF and Hangul documents and images to a free domestic hosting server. On October 16 came code that installed the new NodeLinkRAT.

NodeLinkRAT quietly installs Node.js, a legitimate program widely used by developers, and runs on top of it. It can execute commands on the infected PC, steal files and watch the screen in real time, and because it runs inside a signed, legitimate executable, antivirus that judges a file by its appearance has difficulty catching it. Commands come from a public notepad, exfiltration goes to legitimate cloud services, and execution happens in a legitimate runtime. It is a setup that leaves almost nothing for defenses built on blocking malicious addresses and malicious files to hold on to.

Genians assessed the activity as Kimsuky's but put its confidence at moderate. The grounds offered are that the account used for exfiltration ties back to 2025 phishing against North Korea experts, and that the composition of the phishing pages and the address range of the command server partly overlap with past Kimsuky activity. Genians left open the possibility that another group imitated the technique, and did not disclose the actual scale of damage.

The weight of this case lies less in the technology than in the target. What the Kimsuky cluster wants is information, not money. It collects content such as policy drafts and meeting materials, relationships (who works with whom, and whose request gets opened), and the next foothold: stolen accounts and conversation context with which to impersonate someone and reach a higher target. The infection of one person turns that person's entire network into material for the next attack.

## 4. Recent Traits of North Korean Hacking

Set beside the other incidents of 2025 and 2026, the two cases bring out four traits.

**First, the supply chain is the foothold.** North Korea's largest operations did not strike the target's core head-on. To take about USD 1.5 billion from Bybit in February 2025, the attackers first compromised the machine of a developer at the multi-signature platform the exchange used and altered the signing screen. In March 2026 they hijacked the maintainer account of Axios, a JavaScript library downloaded about 100 million times a week, and published malicious versions. The October incident in which about USD 6.3 billion left Binance was prepared for five months, through tampered developer tools, fake hiring assignments and abuse of an internal AI tool, and was over in 20 minutes. In South Korea as well, the National Intelligence Service has said that North Korean groups used vulnerabilities in three document-management solutions to create administrator accounts and take data from the institutions that had deployed them. The PHP2Shell targeting shows this trend moving down from individual products to the wider base of a runtime.

**Second, targets are chosen with precision.** After entering wide, they choose narrow. The National Assembly seminar campaign picked one person on the basis of a real schedule and a real fact of attendance. In the Drift Protocol incident of April 2026, the attackers set up a front investment firm, put in real money, built trust over several months and then obtained the signatures of key insiders. The loss was about USD 285 million. In its November 12 alert, the FBI said North Korean actors had stolen more than USD 400 million over 18 months through fake video meetings, and had reused some 900 secretly recorded webcam videos of victims in later impersonations. The Lazarus-side scanning was not indiscriminate spraying either. The operators fixed their sectors in advance, dropped paths that responded poorly, and moved quietly at low frequency.

**Third, they hide behind legitimate services.** Legitimate infrastructure that is hard to block becomes a component of the attack: public notepads, cloud storage, code repositories, free hosting, signed runtimes. Fake recruitment and fake meetings belong in the same context, as do disguised IT workers who take remote jobs under stolen identities and walk away with both a salary and access. All of them come in wearing the shape of normal business process. That is exactly why they are easy to miss in the monitoring run by corporate and public-sector security teams.

**Fourth, they pursue money and espionage together.** The blockchain analytics firm TRM Labs estimates that crypto theft attributed to North Korea reached about USD 7.4 billion through October 29, 2026, and that North Korea accounts for 85% of the value of all crypto hacks worldwide. Chainalysis puts the share at about 89%. The figures differ by firm and all are estimates, but they agree that most of the proceeds come from a small number of very large incidents. Meanwhile the Kimsuky cluster keeps going after the National Assembly, political parties, foreign-affairs and security ministries and North Korea policy researchers, and Lazarus has been reported using fake recruitment to go after technology in Europe's drone industry. The same access can serve money, intelligence and, if needed, disruption.

Social infrastructure calls for restraint in how it is described. Within the scope of this research, no destructive attack on South Korean critical infrastructure in 2026 was found to have been publicly attributed to North Korea. What has surfaced is a list that names telecommunications, critical infrastructure, logistics and aviation as priority targets, and attempts to secure access. But services that many institutions share, such as collaboration tools, document-management solutions, groupware and outsourced customer support, are in practice social infrastructure. They are where one breach spreads to many institutions, and the domestic incidents of mid-November showed how fragile they are.

## 5. What AI Changed Is Speed

None of the four traits above is new. What is new is the speed at which all of it happens.

To begin with, the clock of the whole attack ecosystem has sped up. In its 2026 Digital Defense Report, published in October, Microsoft said the median time from a vulnerability being discovered to its becoming a working attack tool has fallen below 24 hours, while enterprises take 30 to 60 days to fix critical vulnerabilities. The Zero Day Clock project, which tracks the gap between disclosure and first exploitation, put the mean at minus eight hours as of July. In other words, exploitation comes before disclosure. The margin of nearly two months that existed in 2024 is gone.

AI is named as the biggest cause of this change. In May 2026 Google reported the first case of a criminal group using, in a real attack, a zero-day believed to have been developed with AI, and on November 16 it published an observation that goes a step further. A framework found on an exposed attacker server kept comparing the code of widely used web applications before and after each patch, and when it found the flaw that had been fixed it wrote an exploit and ran it without human approval. A patch is the start of homework for the defender and a blueprint for the attacker, and that situation has begun to run at machine speed.

Signs that North Korean groups are adopting this trend have come separately from several organizations. CYFIRMA wrote that the PHP2Shell operators triaged public proof-of-concept code with a local AI model, and Aviatrix inferred that agentic AI was used in post-intrusion work. In its August and September reports, Genians documented traces of Kimsuky producing lure documents with local language models and AI coding agents. Google reported that a group suspected of North Korean links approached crypto firms in North America and Europe through fake recruiter profiles and, after intrusion, changed the configuration files of the AI coding tools that employees use in order to spread malware. According to South Korean media, Microsoft and Google also found that North Korean groups mass-produced lure documents for Korean targets in minutes and used a public agentic penetration-testing tool to hunt for vulnerabilities.

A line needs to be drawn here. There is no public confirmation yet that North Korea has built and used a zero-day of its own with AI. The autonomous attack framework Google observed carried Russian comments, and the AI-developed zero-day of May belonged to a criminal group. What is confirmed about the Lazarus-linked operators is a target discussion the day after a patch was published, that is, the ability to turn an already known flaw into a weapon quickly. What can be said about North Korea today is not that it has invented a new kind of attack. It is that North Korea imports attack methods proven quickly in Russia and China, such as ClickFix, and inserts AI into almost every stage of its existing work to cut time.

That distinction is no comfort to defenders. The difference between a zero-day and a vulnerability with a patch was the preparation time it gave the defender. In an environment where target lists circulate the day after a patch and the median time to weaponization is under a day, the two become practically the same thing for an organization that patches once a month. And when the labor-heavy stages shrink (target research, lure production, vulnerability triage, post-intrusion work), a group that used to spend five months preparing can prepare more targets at once with the same people. What AI changed is not the kind of attack. It is the economics of attack.

One more point deserves attention: the limits of control. Commercial AI services can detect abuse and shut down accounts, but local models that attackers run on their own hardware are beyond the reach of such safeguards. The use of local, open-weight models with their guardrails removed has been reported for both the Lazarus-linked operators and Kimsuky. Supply-side controls alone cannot slow this acceleration, and the choice that remains is to raise the speed of defense.

## 6. Why the Existing Response No Longer Works

Today's defenses are built on the premise that attackers need time. As that premise collapses, four security assumptions and practices are being shaken together.

The first to shake is the patch cycle. Many organizations patch in step with monthly maintenance windows and change-approval procedures. In an environment where weaponization is finished within a day, that cycle means exposure of up to nearly a month. On top of that, asset inventories are often kept application by application, so an organization cannot say right away which runtime and library versions are running on which servers. As PHP2Shell showed, having kept a website up to date says nothing about the runtime. The National Security Office made the same diagnosis at its November 13 meeting: the system diagrams of individual institutions differ from the assets actually in operation, which makes a fast response difficult.

The second is faith in the perimeter. Firewalls and network separation protect a company's own systems, but the data and privileges entrusted to script vendors, collaboration tools and customer-support vendors sit outside them. Coinone protected its trading and wallet systems, but the resident registration numbers, bank account numbers and wallet addresses that customers left during support conversations were on the vendor's server. In the Optimizely case the malicious code came down from a trusted vendor's domain with a valid certificate. If the security perimeter is narrower than the scope of the contracts, the gap is an open door.

The third is detection that leans on blocking indicators. Collecting and blocking malicious IPs, domains and file hashes works when attackers use their own infrastructure. When commands come from a public notepad, exfiltration goes out to Dropbox and the malicious activity happens inside a signed, legitimate program, there is no address or file worth blocking. The 21 scan nodes the Lazarus side used were third-party servers that had already been compromised, so blocking an address only means the attack resumes from another one the next day.

The fourth is procedure paced to human speed. An analyst checks the alert, reports to a manager and gets approval to block. That flow assumes an attack that unfolds over days. If the highest privilege is attempted within two hours of intrusion, waiting for approval at night or on a weekend translates directly into damage. Notification is the same. In the Coinone incident the company became aware on the morning of the 12th and told customers on the 15th. It takes less time than that to turn leaked data into an impersonation call.

One problem runs through all four. Defense still moves by the calendar, while attack moves by the clock.

## 7. A New Paradigm

What is needed is not to work harder at existing controls but to change the standard. Five shifts are proposed.

**From patch cycles to exposure time.** The management metric should change from patch coverage to exposure time: how many hours a vulnerability with confirmed exploitation stayed open on an internet-facing asset. If a patch cannot be applied immediately, mitigation should be the default action, whether that means turning a feature off, restricting access or taking the asset off the network. The goal is to eliminate the state of doing nothing while waiting for a patch.

**From perimeters to dependencies and write access.** The scope to be defended has to be redrawn as everything the organization depends on, not just its own network. Runtimes and open source, external services that can put code on its web pages, collaboration tools and vendors holding personal data all belong on the asset list. The question widens from "who can connect to our systems" to "who can change the code our customers run and the data we have entrusted to others."

**From indicators to behavior and context.** Defense has to move from blocking where something came from to watching what it does. A web server process launching a shell, an office PC connecting to a public notepad at fixed intervals, a shortcut with a document icon spawning commands: these behaviors show up whatever address is used. Attacks aimed at people need context added. What is required is detection that can read a flow, such as a large-file link arriving after an email with a missing attachment, or a request for paperwork in the name of an honorarium.

**From human speed to machine first response under human control.** First-response actions such as isolation, account lockout, token revocation and suspension of withdrawals should execute automatically under pre-approved procedures. People then verify the judgment and decide whether to roll back or escalate. Using AI for defense should follow the same principle. Leave the speed of detection, triage and first response to machines, but treat their output as something to verify, not as a conclusion. LLMs are Excel, not oracles.

**From response that waits on attribution to systemic response that does not depend on who the attacker is.** Working out who did it is necessary for diplomacy, sanctions and investigation, but it cannot be a precondition for defense. Attribution takes weeks and attacks take hours. State-backed groups reuse the roads that criminal groups open, and the reverse happens too. That the Optimizely case was not North Korea's does not mean that road is closed to North Korea. In addition, a data leak should be handled not as the end of an incident but as the start of the next targeted attack. The few weeks right after organization charts, contact details and identity data get out are when impersonation works best.

## 8. Policy Proposals

Institutions are already moving. The amended Information and Communications Network Act, in force since October 1, raised the chief information security officer to executive rank, introduced enhanced certification for large operators, and created ex officio government investigations and fines for repeated breaches. The government issued a private-sector information security plan for AI-driven threats in May and a software supply-chain security roadmap in June. On November 12 the Financial Services Commission announced emergency response guidelines for virtual asset service providers and said it would allow pre-emptive suspension of deposits and withdrawals when a hack is suspected. On the 13th the National Security Office decided to overhaul the management of information assets across the civilian, government and military sectors and to bring forward the adoption of the software bill of materials (SBOM).

The direction is right. The proposals below try to fill two blanks in that direction: speed and scope. The deadlines given are proposed values, offered as a starting point for discussion.

### Government and the National Assembly

1. **Set remediation deadlines for exploited vulnerabilities in hours.** Keep a list of vulnerabilities with confirmed exploitation in the national vulnerability database now being built, and require public institutions, critical information infrastructure and organizations subject to mandatory security-management certification to patch or mitigate internet-facing assets within 72 hours. If that cannot be done in time, the asset is isolated and the fact is reported.
2. **Turn the SBOM from a delivery document into an operational asset register.** Extend its scope to language runtimes, web servers, open-source components and the third-party scripts that web pages load, and link it to assets actually in operation. The target state, which should be demonstrable and maintained, is that when a new vulnerability is published the affected assets can be looked up within an hour.
3. **Manage separately the services that many institutions depend on.** Enhanced certification currently applies on the basis of revenue and incident history. Add a dependency criterion, and bring in, regardless of revenue, the collaboration tools, groupware, document-management solutions and customer-support vendors that hold many institutions' work data or can write code and data into other institutions' services.
4. **Build a target-notification system.** When domestic or foreign threat intelligence shows that South Korean institutions are on a target list, set a procedure under which the responsible agencies obtain the raw data and notify those institutions within 24 hours. The 30 targets in this case were published with part of each address masked, and an institution should not have to learn from the news whether it is one of them. Shared intelligence should come both as documents people read and in a format security equipment can ingest directly.
5. **Run a protection program for the National Assembly and the policy community.** Enforce sender authentication on email sent in the name of lawmakers' offices and the Secretariat so that spoofed mail is rejected on receipt. Unify administrative procedures such as honoraria and advisory fees in one official channel, and tell outside experts who attend events about that channel together with a warning about impersonation. Researchers, aides and journalists who are frequent targets should be given security keys, and a reporting desk should be operated to which suspicious mail can be forwarded immediately.
6. **Set liability standards for pre-emptive action.** The Financial Services Commission's allowance of pre-emptive suspension of deposits and withdrawals in the virtual asset sector is a good precedent. Extend it to telecommunications, cloud and public services, and make clear the scope of an operator's liability for isolation and blocking carried out automatically under conditions and procedures set in advance. Where liability is unclear, people on the ground wait for approval.
7. **State confidence levels when attributing an attack to an actor.** When the government and public bodies announce who is behind an attack, they should state the confidence level and the kind of evidence. Separating "targeted" from "breached", and assessment from confirmation, reduces both exaggeration and complacency.
8. **Supply defensive AI as a public good.** Let small and medium-sized enterprises, local governments and research institutes that have no security staff be the first to use the cybersecurity-specialized AI model and vulnerability-scanning infrastructure the government is building. Attackers' local models cannot be stopped, so the weight of policy should fall on raising the speed of defense, not on curbing misuse. Standards for verifying false positives and malfunctions in automated response should be prepared at the same time.

### Financial Regulators and the Virtual Asset Sector

9. **Speed up the legislation and widen its scope to the periphery.** If the Digital Asset Act is to carry safety standards and liability at the level of financial companies, it should explicitly cover not only trading systems but also customer-support vendors, groupware and workplace collaboration tools. The recent incidents at Coinone and Bithumb occurred on that periphery.
10. **Ban the collection of sensitive data in support channels.** Stop resident registration numbers, passwords and ID card details from being taken during support, and require records already accumulated to be masked or deleted. Set a deadline for notifying customers of a vendor breach, to narrow the gap between awareness and notice.
11. **Require that every path reaching signing authority be managed at the same grade as the keys.** People, devices, sessions, deployment pipelines and internal AI tools should all fall under the inspection criteria. Large transfers should require multi-party approval, time delays and automatic blocking of anomalous transactions.

### Companies

12. **Build a dependency inventory and audit write access.** Register runtimes, third-party scripts, collaboration tools and vendors as assets, and check every quarter who can change deployed code and data in each service. Take external marketing scripts off payment, login and withdrawal screens.
13. **Decide in advance what to do before the patch.** For each internet-facing service, document the mitigation and isolation steps to apply before a patch is available, and have management pre-approve the scope of first-response actions that can be carried out without approval on nights and weekends.
14. **Protect separately the people who will be targeted.** Designate as high-risk the staff with heavy outside exposure, developers with signing and deployment rights, and finance staff, and give them security keys and hardened endpoint protection. When a leak occurs, assume your own staff will be impersonated and tell partners and customers first.

### Individuals

15. **Verify requests through another channel.** Even when a message mentions an event you really attended or a transaction you really made, if it asks for documents, a transfer or a program installation, check again through the institution's main number or a contact you already had. Do not open an archive received after replying to an email with a missing attachment, or a shortcut file wearing a document icon.
16. **Keep the basics for devices and accounts.** Keep phones and PCs up to date, turn on multi-factor authentication for important accounts, and when sending cryptocurrency compare the entire pasted address with the original. If you are notified that your data has leaked, change your passwords and sign up for an identity-theft prevention service.

## 9. Conclusion

Mid-November 2026 showed an attack surface that had expanded beyond individual companies into the supply chain and national infrastructure. A Lazarus-linked group put government, finance, telecommunications and critical infrastructure on a single list through the common base of a language runtime, and a suspected Kimsuky group picked one person who attended a National Assembly seminar and knocked on the door to the policy community. The Optimizely case in particular, although it has not been attributed to North Korea, is the point that shows how much the security of third-party software and services, which a company cannot directly control, matters.

The recent trait of North Korean hacking lies in the combination. It comes in wide through the supply chain and chooses targets narrowly, hides behind legitimate services, prepares for a long time and executes quickly. With AI added, the time for a vulnerability to become a weapon, the time to produce a lure and the time to widen privileges after intrusion are all shrinking together. The preparation time that used to separate a zero-day from a patched vulnerability is disappearing, and a response that relies on monthly patching and human approval cannot keep pace. That is why a new response and a new paradigm are needed: a system that manages exposure in hours, treats dependencies and write access as assets, and has machines take the first response while people hold final control.

To respond to these threats, companies and individuals should keep the following in mind.

**Companies.** Keep security patches current for all software and third-party services in use, and strengthen supply-chain security checks. Apply the principle of least privilege and monitor internal networks thoroughly. Here "current" has to reach down to the runtime beneath the application, and the checks have to cover not only the company's own systems but every external service entrusted with its code and data.

**Individuals.** Do not open messages or files from unclear sources, and make a habit of checking the address when visiting a website. Take particular care when handling financial information or cryptocurrency. As these cases show, however, even a message whose source looks clear and an address that is legitimate do not guarantee safety. An email that mentions an event you really attended can be an impersonation, and a website you trusted can deliver malicious code. The habit of confirming a request once more through another channel and the habit of keeping devices up to date fill that gap.

The time defenders have has shrunk, but it has not vanished. That a target list circulated the day after the patch also means that an organization that acted on the day of the patch meant nothing on that list. The task is to secure that one day through institutions and automation, not through each organization's willpower.

## 10. Limitations and Verification Notes

This report is an independent analysis that brings together security vendor reports, media coverage and government announcements published up to November 20, 2026. Five limitations are stated here.

First, attribution of who is behind the hacking is an assessment, not a finding. The Lazarus link rests heavily on the assessment of a single firm, CYFIRMA, and the grounds for raising its confidence from moderate to high could not be confirmed from the public text. The Kimsuky link was put forward by Genians at moderate confidence.

Second, observations of PHP2Shell exploitation before the patch differ by organization. CYFIRMA places the earliest exploitation on October 17, but other security firms said they had not confirmed real exploitation until just before the patch. Whose exploitation it was in that window has not been disclosed either. What is clear is that, as of the early hours of November 20, 2026, the PHP patch rate remains extremely low. Since the PHP remote code execution flaws were disclosed in October 2026, South Korea's patch rate has been far below the world average. The global rate varies by measuring organization and date but was generally around 20%, while South Korea stayed at around 4%. Among hosts running old versions whose official support has ended (PHP 5.4 to 7.3), the patch rate was under 1%, a sharp split between versions.

Several structural factors are thought to lie behind South Korea's unusually low patch rate.

- **Dependence on old versions:** Many servers in the country remain on PHP 8.1 or earlier, for which official support has ended, so security patches are either not provided or complicated to apply.
- **Complexity of patching:** Updating a CMS or plugins is not enough. In many cases PHP itself in the server runtime has to be patched, which raises the technical barrier.
- **A chain of further vulnerabilities:** After the first emergency patch, additional flaws kept being found in session handling, compression libraries and elsewhere, so that applying a complete patch in a short time remained difficult.

As a result, hacking damage at the small and medium-sized businesses and web-hosting companies that run PHP is expected to continue for a long time.

Third, the strength of the evidence on AI use is uneven. Google's observation of an autonomous attack framework is a primary report, but the framework is not North Korea's. The AI use in the European government case is inferred from traces and rests on one vendor's account. There is no public confirmation that North Korea has developed a zero-day with AI, and the claims in this report are limited to the acceleration of weaponization and preparatory work.

Fourth, the figures are estimates. Crypto theft totals and shares differ by analytics firm, and statistics on time to weaponization vary with the measurement method. The figures from the Microsoft report and the Zero Day Clock, and part of the domestic policy picture, were confirmed through media coverage and not from the original documents. The source list in the appendix separates material read in full from material confirmed only through search summaries.

Fifth, the policy proposals are the author's views. The 72-hour and 24-hour deadlines are not validated standards but values proposed for discussion, and the cost, the burden on small operators and the risk of malfunction in automated blocking need separate review. Many of the matters covered are still under investigation, and the facts may change. This document is material for education, defense, research and policy discussion, and is not legal or investment advice.

## Appendix A. Timeline

| Date (2026) | Event |
| --- | --- |
| June 18 | XenoRAT variant posted to the notepad command channel of the suspected Kimsuky campaign |
| September 9 | Seminar held at the National Assembly |
| September 12 | Email impersonating a senior aide in a lawmaker's office sent to an attendee. Application form left unattached |
| September 13 | Malicious archive delivered after the victim's reply |
| September 18, 27 | Reconnaissance code posted to the notepad. Collected data sent to Dropbox and MEGA |
| September 28 | Replaced with code that steals documents and images |
| October 1 | Amended Information and Communications Network Act takes effect |
| October 16 | NodeLinkRAT installer code posted to the notepad |
| October 17 | Earliest PHP2Shell exploitation according to CYFIRMA |
| October 21 | PHP2Shell patches released |
| October 22 | First CYFIRMA advisory. Korean-speaking operators observed discussing targets |
| October 24 | Target list of 216 hosts and 21 scan nodes identified |
| October 28 | Attackers' channel names IP ranges in six countries, including South Korea, as promising targets |
| October 29 | Attackers claim the target set has grown to 581. About USD 6.3 billion stolen from Binance |
| November 12 | FBI alert on North Korean fake video-meeting scheme. Financial Services Commission security meeting for the virtual asset sector. Coinone's vendor and NHN Dooray breached |
| November 13 | National Security Office joint civilian, government and military cyber response meeting |
| November 15 | South Korean media report the 30 Korean targets |
| November 16 | Genians publishes its NodeLinkRAT report. Google announces its observation of an autonomous attack framework. Optimizely supply-chain attack |

## Appendix B. Reference Incidents and Sources

### Material read in full

- Lazarus PHP2Shell targeting: [CYFIRMA, Suspected DPRK Campaign staging PHP2Shell](https://www.cyfirma.com/research/cyfirma-threat-advisory-suspected-dprk-campaign-staging-php2shell-targeting-against-global-php-infrastructure/)
- European government breach and inferred AI use: [Aviatrix, PHP2Shell Exploit Hits Government Entity](https://aviatrix.ai/threat-research-center/php2shell-exploitation-government-cve-2026-109618-lazarus-ai-assisted-hacking/)
- Kimsuky NodeLinkRAT campaign: [SecurityOnline, summary of the Genians report](https://securityonline.info/kimsuky-nodelinkrat-malware-spearphishing)
- Optimizely supply-chain attack: [Report URI](https://blog.report-uri.com/worlds-largest-brands-infected-with-malware-via-optimizely/), [Deepwatch CA-26-048](https://www.deepwatch.com/labs/ca-26-048-optimjack-optimizely-web-experimentation-supply-chain-attack/)
- Overview of North Korean attack trends (Binance, Drift, Axios, AI use): [Datanet (Korean)](https://www.datanet.co.kr/news/articleView.html?idxno=300260)
- PHP2Shell vulnerability analysis: [CTI-2026-10-22-PHP_KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-10-22-PHP_KR.md)
- Binance incident analysis: [CTI-2026-1101-NORTHKOREA-BINANCE-REPORT_EN](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-1101-NORTHKOREA-BINANCE-REPORT_EN.md)
- North Korean threat trends, first half of 2026: [CTI-2026-0521-DPRK-TRENDS_EN](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0521-DPRK-TRENDS_EN.md)

### Material confirmed through search summaries

**Lazarus and PHP2Shell**

- Reports on the 30 Korean targets: [Yonhap News (via Nate)](https://m.news.nate.com/view/20261115n01924), [Segye Ilbo](https://www.segye.com/newsView/20261115501757), [Seoul Economic Daily](https://m.sedaily.com/article/20114478)
- No confirmed link to the domestic leaks: [Asia Times Korea](https://www.asiatime.co.kr/article/20261115500058)
- Fixed versions and technical analysis: [Datadog Security Labs](https://securitylabs.datadoghq.com/articles/php2shell-critical-vulnerabilities-in-php/), [Sansec](https://sansec.io/research/php2shell)
- US cybersecurity agency warning on exploitation: [BankInfoSecurity](https://www.bankinfosecurity.com/php2shell-actively-exploited-us-cybersecurity-agency-warns-a-33219)
- PHP2Shell patch rates (as of late October 2026): [Aju Business Daily](https://www.ajunews.com/view/20261027145039226), [Boan News](https://www.boannews.com/news/articleView.html?idxno=146873), [TechTarget](https://www.techtarget.com/news/php2shell-explained-timeline-of-the-global-vulnerability-crisis/872935/)

**Kimsuky and the targeting of a National Assembly seminar attendee**

- [Seoul Economic Daily](https://m.sedaily.com/article/20114701), [VOA Korean](https://www.voakorea.com/a/korea-kimsuky-hacking/8224252.html), [Aju Business Daily](https://www.ajunews.com/view/20261116102157622), [Korea JoongAng Daily](https://www.koreajoongangdaily.com/korea/north-korealinked-hackers-suspected-of-targeting-national-assembly-seminar-attendee/12974662)
- Kimsuky's use of local language models and AI coding agents: [Genians, August 2026](https://genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm), [Genians, September 2026](https://genians.co.kr/en/blog/threat_intelligence/ai-agent-opencode)

**AI and the speed of weaponization**

- Google's observation of an autonomous attack framework: [SiliconANGLE](https://siliconangle.com/2026/11/16/google-says-an-ai-framework-turned-security-patches-into-exploits-with-no-human-in-the-loop/), [CoinDesk](https://www.coindesk.com/tech/2026/11/18/google-finds-self-running-ai-hacking-tool-with-russian-comments-in-its-files), [Hackread](https://hackread.com/google-ai-agent-turning-security-patches-exploits/)
- Time to weaponization in the Microsoft 2026 Digital Defense Report: [CyberBrief](https://getcyberbrief.com/story/microsoft-ai-attackers-24-hour-weaponization)
- Zero Day Clock figures: [SecurityBrief](https://securitybrief.news/story/ai-closes-vulnerability-window-as-zero-day-exploits-surge), [The Hacker News](https://thehackernews.com/2026/06/ai-broke-vulnerability-management-thats.html)
- Tampering with AI coding tool configuration by a North Korea-linked group: [VOA Korean, North Korea cyber threats](https://www.voakorea.com/z/8426)
- Google's May 2026 report of an AI-developed zero-day, and weaponization statistics: [Axis Intelligence](https://axis-intelligence.com/ai-cyberattack-statistics/)

**North Korean crypto theft and social engineering**

- FBI alert (November 12, 2026): [FBI FLASH AC-111226-MS](https://www.ic3.gov/CSA/2026/261112.pdf), [The Hacker News](https://thehackernews.com/2026/11/fbi-says-north-korean-hackers-stole.html)
- 2026 theft totals and share: [TRM Labs](https://www.trmlabs.com/resources/blog/north-korea-has-stolen-usd-128-billion-in-crypto-usd-74-billion-of-it-in-2026)
- Binance preliminary investigation report: [Hankook Ilbo](https://www.hankookilbo.com/news/article/A2026110408480003526)
- National Intelligence Service 2025 annual report and 2026 outlook: [Korea Economic Daily](https://www.hankyung.com/article/2026051062717), [Boan News](https://m.boannews.com/html/detail.html?tab_type=1&idx=141394)
- Overview of North Korean hacking groups: [Electronic Times](https://www.etnews.com/20261102000370)

**Other incidents of the same week (not attributed to North Korea)**

- Optimizely's notice and attribution assessments: [Security Today](https://securitytoday.com/articles/2026/11/18/optimizely-patches-signup-flaw-after-attackers-inject-malicious-code.aspx), [StepSecurity](https://www.stepsecurity.io/blog/optimjack-optimizely-hosted-scripts-crypto-clipper-card-skimmer), [Straiker](https://www.straiker.ai/blog/optimizely-attack-coruna-darksword-ios-exploits)
- NHN Dooray breach: [Boan News](https://www.boannews.com/news/articleView.html?idxno=147282), [Pen and Mike](https://www.pennmike.com/news/articleView.html?idxno=131956)
- Breach of Coinone's customer-support vendor: [Korea Economic Daily](https://www.hankyung.com/article/2026111570777), [Digital Today](https://www.digitaltoday.co.kr/news/articleView.html?idxno=715823), [Dealsite](https://dealsite.co.kr/articles/172859)

**South Korean policy status**

- Amended Information and Communications Network Act in force (October 1): [Information and Communication Newspaper](https://www.koit.co.kr/news/articleView.html?idxno=209276), [Electronic Times](https://www.etnews.com/20260930000210)
- First ex officio investigation (November 11): [Financial News](https://www.fnnews.com/news/202611111739528555)
- Private-sector information security plan for AI-driven threats (May): [ZDNet Korea](https://zdnet.co.kr/view/?no=20260529102246)
- National Intelligence Service cybersecurity policies and supply-chain security roadmap: [ZDNet Korea](https://zdnet.co.kr/view/?no=20260926113121)
- National Security Office joint response meeting (November 13): [Seoul Economic Daily](https://m.sedaily.com/article/20114431)
- Financial Services Commission security meeting for the virtual asset sector (November 12): [Bizwatch](https://news.bizwatch.co.kr/article/finance/2026/11/12/0009), [Jaekyung Ilbo](https://news.jkn.co.kr/post/1092425)

---

© 2026 Dennis Kim (HoKwang Kim) · [github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
