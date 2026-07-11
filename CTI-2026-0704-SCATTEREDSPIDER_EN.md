| id             | CTI-2026-0704-SCATTEREDSPIDER                                                                       |
| -------------- | --------------------------------------------------------------------------------------------------- |
| title          | Scattered Spider — Teenage Suspect Peter Stokes Extradited from Finland to the U.S. and Charged Over $8M Crypto Ransom |
| subtitle       | Help desk social engineering, MFA reset abuse, DragonForce ransomware, and the trajectory of multinational law enforcement action |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                      |
| email          | <gameworker@gmail.com>                                                                              |
| github         | gameworkerkim                                                                                       |
| date           | 2026-07-04                                                                                          |
| classification | TLP:GREEN                                                                                           |
| severity       | HIGH                                                                                                |
| lang           | en                                                                                                  |
| tags           | Scattered-Spider · Social-Engineering · Help-Desk-Vishing · MFA-Reset · Crypto-Extortion · Extradition · Law-Enforcement |
| threat_actors  | Scattered Spider (aka UNC3944 · Octo Tempest · 0ktapus · Scatter Swine · Muddled Libra)             |
| cve            | N/A (threat actor campaign · social engineering and help desk compromise)                            |
| frameworks     | MITRE ATT&CK · NIST SP 800-61 · STIX/TAXII · Mandiant/Microsoft cluster naming                      |
| license        | CC BY-NC-SA 4.0                                                                                     |

# Scattered Spider — Teenage Suspect Peter Stokes Extradited from Finland to the U.S. and Charged Over $8M Crypto Ransom

> **Report ID** `CTI-2026-0704-SCATTEREDSPIDER` · **Publication date** 2026-07-04 · **Classification** `TLP:GREEN` · **Severity** 🔴 HIGH
> **Author** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*Help desk social engineering, MFA reset abuse, DragonForce ransomware, and the trajectory of multinational law enforcement action*

---

## Table of Contents

1. Summary (TL;DR)
2. Suspect Profile — Peter Stokes
3. Charges — Criminal Record and Allegation Structure
4. Scattered Spider Group Profile
5. Attack Chain — From Help Desk to Crypto Ransom
6. Criminal Procedure Timeline and Next Steps
7. Status of Co-conspirators and Associated Suspects
8. Korea Perspective — Threat Assessment for Exchanges and Enterprise Help Desks
9. Detection and Mitigation Recommendations
10. Conclusion
11. References

---

## Summary (TL;DR)

In early July 2026, the U.S. Department of Justice (DOJ) announced that 19-year-old **Peter Stokes**, alleged to be a member of the cybercriminal group **Scattered Spider**, had been extradited from Finland to the United States and charged in federal court in Chicago, in the Northern District of Illinois.

Stokes is a dual U.S.-Estonian citizen who is reported to have used the online handles **"Bouquet"·"Spencer"·"Jordan"**. On April 10, 2026, he was arrested by Finnish police at Helsinki Airport under an Interpol Red Notice while attempting to board a flight to Japan. He was extradited to the United States in the last week of June and made his initial appearance in federal court in Chicago on Tuesday. The judge ordered him detained pending trial.

The central allegation concerns the **compromise of an unidentified "luxury jewelry retailer" in or around May 2025, identified in court documents as Company F**. The attackers allegedly called the help desk while impersonating employees, requested and obtained resets of multi-factor authentication (MFA) credentials, stole data, and demanded an **approximately $8 million cryptocurrency ransom**. The company refused to pay, but incurred at least $2 million in losses from business disruption, investigation, and recovery.

The DOJ estimates that Scattered Spider has been involved in **more than 100 network intrusions** that generated **over $100 million in total ransom demands**. This arrest is part of the FBI's long-running **Operation Riptide** and demonstrates the intensifying pace of multinational investigative cooperation.

### Key Judgments

| #    | Judgment                                                                                                          | Confidence        |
| ---- | ----------------------------------------------------------------------------------------------------------- | --------------- |
| KJ-1 | The Stokes case is not an isolated prosecution, but part of a broader **multinational effort involving the United States, the United Kingdom, Finland, and Interpol** to dismantle the Scattered Spider network. The prosecution proceeded despite the attempted ransom being unsuccessful. | **High**        |
| KJ-2 | The group's core weapon is not malware vulnerability exploitation, but **social engineering against help desks and MFA reset abuse**. Process and human controls are the critical defensive pressure points, more so than purely technical safeguards. | **High**        |
| KJ-3 | Ransom non-payment is gaining traction. Company F's refusal aligns with the trend reported by TRM Labs of "increasing victim refusal to pay," while total ransomware-related cryptocurrency inflows have declined compared with 2024. | **Medium-High** |
| KJ-4 | Stokes allegedly participated in at least four intrusions from as early as March 2023, when he is believed to have been 16 years old. This indicates a structure in which the group **recruits mid-teenagers from gaming and cybercriminal communities**. | **High**        |
| KJ-5 | The next procedural path is likely to include the possibility of plea negotiations. Given that several previously arrested co-conspirators, including Urban and Buchanan, have pleaded guilty, a **cooperation and sentence-reduction negotiation path** is a plausible scenario. | **Medium**      |

---

## 1. Suspect Profile — Peter Stokes

| Field      | Value                                             |
| ------- | --------------------------------------------- |
| Name      | Peter Stokes                                  |
| Age      | 19                                           |
| Nationality      | Dual U.S.-Estonian citizen                                 |
| Online handles  | "Bouquet", "Spencer", "Jordan"                |
| Affiliation (alleged)  | Scattered Spider                              |
| Arrest      | 2026-04-10, Helsinki-Vantaa Airport, while attempting to board a flight to Japan           |
| Basis for arrest   | Interpol Red Notice                         |
| Extradition      | Last week of June 2026, Finland → United States                       |
| Jurisdiction      | U.S. District Court for the Northern District of Illinois, Chicago                         |
| Custody status      | Detained pending trial                                   |
| Seized items     | Approximately 2TB of data seized from hard drives in his possession at the time of arrest              |

Stokes was observed on Snapchat and other social media platforms allegedly displaying wealth and international travel that appeared disproportionate for his age group, while also sharing media related to other Scattered Spider members who had already been arrested. Investigative records reportedly include an image he shared in March 2025 that assigned Scattered Spider member aliases to mafia characters from the television series "The Sopranos." The image included multiple suspected co-conspirator handles, including "Peter," believed to refer to Stokes himself, as well as "auth," "domr," and "guts."

---

## 2. Charges — Criminal Record and Allegation Structure

U.S. prosecutors charged Stokes through an unsealed **six-count superseding criminal complaint**. The allegation categories are as follows.

| Charge category                     | Description                                            |
| ------------------------- | --------------------------------------------- |
| Conspiracy           | Conspiracy to participate in Scattered Spider activity                      |
| Cyber intrusion / Computer fraud | Unauthorized network access                            |
| Wire fraud         | Fraud through electronic means                                  |
| Coercion / Extortion         | Ransom demand                                          |
| Ransomware extortion                    | Attempted $8 million cryptocurrency ransom involving Company F                    |

### Identified Criminal Record (Alleged Facts)

- Stokes is alleged to have participated in **at least four Scattered Spider intrusions**.
- The earliest intrusion was in **March 2023, when he is believed to have been 16 years old** — unauthorized access to an "online communications platform," identified in court documents as **Company H**.
- **On or around May 12, 2025, compromise of a luxury jewelry retailer (Company F)** — the central incident in the charges.
  - The attackers impersonated Company F employees and asked the help desk to reset authentication information, including passwords and MFA mobile devices.
  - They called the help desk using a Google Voice number.
  - They then used the legitimate internet tunneling tool **ngrok** to maintain persistent unauthorized access to the company's data center.
  - After stealing data, they demanded **approximately $8 million in cryptocurrency ransom**.
  - Investigators linked traces of ngrok use from a VPN proxy IP to a Microsoft device used by Stokes.

### Impact

- Company F **did not pay the ransom**, and its security team expelled the intruders.
- However, the company suffered **at least $2 million in losses** from business interruption, investigation, and mitigation costs.
- Across Scattered Spider as a whole, the DOJ estimates **100+ intrusions and $100M+ in ransom demands**.

---

## 3. Scattered Spider Group Profile

| Field       | Value                                                          |
| -------- | ---------------------------------------------------------- |
| Name       | Scattered Spider                                           |
| Aliases / tracking names  | UNC3944 · Octo Tempest · 0ktapus · Scatter Swine · Muddled Libra |
| First observed    | 2022                                                      |
| Composition       | A loose collective of English-speaking teenagers and young adults from the United States, the United Kingdom, Canada, and Europe         |
| Recruitment channels    | Online gaming communities and cybercrime forums, primarily among mid-teenagers                          |
| Motivation       | Financial gain through cryptocurrency extortion                                                |
| Core techniques    | Social engineering, help desk vishing, MFA fatigue attacks / MFA bombing, SMS phishing, SIM swapping |
| Additional tools    | Genymobile Android emulator for MFA attacks, DragonForce ransomware encryptor    |
| Notable victims   | Caesars, MGM Resorts, Riot Games, DoorDash, Reddit, MailChimp, Twilio, LastPass, Allianz Life, TfL, Co-op, M&S, Harrods, WestJet, Jaguar Land Rover |

A defining characteristic of Scattered Spider is that it **does not primarily target software vulnerabilities first**. Its operators are skilled at "deceiving people": they call IT help desks, impersonate employees, reset passwords and 2FA, and then enter the network. They subsequently partner with separate ransomware groups to lock systems and demand cryptocurrency payment. The FBI, Microsoft, Google Cloud, and others have repeatedly identified this group as a top-tier cybercriminal threat.

---

## 4. Attack Chain — From Help Desk to Crypto Ransom

| Phase    | Activity                        | Details (Company F case)                                       |
| ----- | ------------------------- | ------------------------------------------------------- |
| ① Reconnaissance  | Collect target company employee information            | Prepare impersonation scenarios using social media and leaked data                              |
| ② Access  | Help desk vishing                  | Call the help desk from a Google Voice number and impersonate an employee                       |
| ③ Credential capture  | Induce MFA and password resets            | "Request reset of authentication information, including password and MFA mobile device" → obtain administrative access             |
| ④ Persistence  | Maintain continuous access using a tunneling tool          | Use the legitimate tool **ngrok** → maintain persistent unauthorized access to the data center                   |
| ⑤ Theft  | Exfiltrate corporate data                 | Obtain confidential business data, with system encryption observed in some cases                          |
| ⑥ Extortion  | Demand cryptocurrency ransom                 | Threaten data locking and leakage → demand approximately $8 million in cryptocurrency payment → **victim company refuses**       |

The critical pressure points in this chain are phases ② and ③. Instead of bypassing technical defenses such as firewalls and EDR, Scattered Spider directly targets the **human and process vulnerability represented by the help desk**. Even MFA can be neutralized through the normal operational procedure of a "reset."

---

## 5. Criminal Procedure Timeline and Next Steps

### Timeline to Date

| Time            | Event                                                   |
| ------------- | ---------------------------------------------------- |
| 2023-03       | Compromise of Company H, an online communications platform — Stokes believed to have been 16 years old        |
| Around 2025-05-12   | Compromise of Company F, a luxury jewelry retailer; $8 million cryptocurrency ransom demanded → refused       |
| 2026-04-10    | Arrested at Helsinki Airport under an Interpol Red Notice while attempting to travel to Japan                     |
| Late 2026-06    | Extradited from Finland to the United States                                          |
| Around 2026-07-01   | DOJ public announcement, initial appearance in federal court in Chicago, detention pending trial ordered, six-count complaint unsealed |

### Expected Next Steps (General U.S. Federal Criminal Procedure)

1. **Initial appearance and detention hearing completed** — This has already occurred. The judge ordered detention pending trial. A future request for reconsideration of bail is possible, but the likelihood of release is low given flight-risk concerns, including the history of attempted foreign travel.
2. **Grand jury indictment** — The case is currently at the criminal complaint stage. Prosecutors are expected to proceed through a grand jury to file a formal indictment.
3. **Arraignment** — After formal indictment, Stokes would enter a guilty or not-guilty plea. At this stage, counsel appointment and the discovery schedule would be established.
4. **Discovery and pretrial motions** — Digital evidence disputes are expected over the 2TB of seized data, ngrok, VPN, Microsoft device forensics, social media, and messaging records. Challenges may involve alleged unlawful collection and evidentiary admissibility.
5. **Possibility of plea bargaining** — Because several previously arrested co-conspirators, discussed in §6 below, have pleaded guilty and pursued cooperation and sentence reduction, a negotiated resolution is a realistic scenario.
6. **Trial or guilty plea** → **Sentencing** — Conspiracy, wire fraud, computer fraud, and extortion each carry serious statutory penalties, and cumulative exposure could result in a lengthy custodial sentence.
7. **Asset forfeiture and restitution** — Cryptocurrency asset tracing and freezing may occur, and a restitution order may be issued for victim companies, including at least $2 million in losses attributed to Company F.

> ⚠️ **Note**: The above summarizes the general trajectory of U.S. federal criminal procedure. The actual course of an individual case depends on prosecutorial discretion, defense strategy, and the evidentiary record. Stokes is currently a suspect/defendant protected by the **presumption of innocence**, and the allegations described above are prosecutorial claims that have not yet been proven in court.

---

## 6. Status of Co-conspirators and Associated Suspects

Multinational judicial action against Scattered Spider is continuing, and Stokes' arrest is the latest example.

| Individual                     | Nationality / status        | Status                                                      |
| ---------------------- | ------------ | ------------------------------------------------------- |
| Noah Michael Urban     | U.S., age 20      | Pleaded guilty in California and Florida in 2025 to conspiracy, wire fraud, and identity theft; sentenced to 10 years; admitted stealing at least $800,000 in cryptocurrency during 2022-2023 |
| Tyler Robert Buchanan  | Scotland, age 24   | Arrested in Spain in 2024 and extradited to the United States; pleaded guilty in April 2026 to wire fraud and aggravated identity theft         |
| Thalha Jubair          | U.K., age 19-20   | Proceedings at Southwark Crown Court in the United Kingdom in November 2025 related to Computer Misuse Act violations and alleged involvement in the TfL attack — later reports indicated a guilty plea |
| Owen Flowers           | U.K., age 18      | Proceedings related to Southwark Crown Court in November 2025 and alleged involvement in the TfL attack                     |
| Minor suspect (Las Vegas)       | U.S.          | Arrested in September 2024 in connection with casino attacks                                    |
| Five individuals charged in 2024            | U.S. / Texas, Florida, and North Carolina | Charged in connection with at least $27 million in cryptocurrency ransom activity, including Urban                    |

As shown above, Scattered Spider is facing **cumulative pressure from individual arrests and prosecutions that may degrade the wider network**. Aliases appearing in the Stokes complaint, such as "auth" — a U.S.-based suspected co-conspirator A believed to have offended while a minor — may lead to additional charges.

---

## 7. Korea Perspective — Threat Assessment for Exchanges and Enterprise Help Desks

The implications of Scattered Spider-style threats for the Korean environment are as follows.

- **The help desk is the pressure point** — Korean exchanges, fintech companies, and large enterprises rely heavily on outsourced call centers and help desks. The "employee impersonation → password/MFA reset" scenario could be reproduced directly once the language barrier is lowered through insider information and leaked data.
- **The MFA trust trap** — It is dangerous to assume that deploying MFA alone is sufficient. This group abuses a **normal procedure, the MFA reset**, rather than a software vulnerability.
- **Crypto ransom payment pressure** — Korean companies face reputational and regulatory risks under frameworks such as the Personal Information Protection Act and Electronic Financial Transactions Act, which can create pressure to pay. However, as the Company F case shows, **non-payment is becoming an international norm**, and payment invites further targeting.
- **Implications of multinational cooperation** — The sequence of Interpol Red Notice, Finnish arrest, and U.S. extradition shows that, even when Korean victims are involved, **international cooperation through KoFIU (Korea Financial Intelligence Unit), the Korean National Police Agency's Cyber Bureau, and Interpol channels** can be an effective response path.

---

## 8. Detection and Mitigation Recommendations

1. **Strengthen help desk verification** — Require callbacks, multi-step identity verification, and administrative approval for password and MFA reset requests. Classify "urgent reset requests" as high-risk events.
2. **Monitor MFA reset events** — Generate SIEM alerts for multiple MFA re-enrollments within a short period, new device registrations, and resets during anomalous hours.
3. **Detect tunneling tools** — Block and alert on unauthorized execution of, and outbound connections from, legitimate tunneling tools such as **ngrok** inside the enterprise network.
4. **Vishing awareness training** — Conduct recurring training for employees and help desk staff on patterns involving IT or recruiter impersonation calls from temporary numbers such as Google Voice.
5. **Least privilege and segmentation** — Separate help desk accounts from administrator accounts and minimize reset privileges. Limit lateral movement if compromise occurs.
6. **Pre-establish a ransom response policy** — Make refusal to pay the default principle while documenting backup, recovery, legal, and cooperation contacts, including police and KoFIU, in advance.
7. **Share IOCs and TTPs** — Continuously update threat intelligence feeds with Scattered Spider TTPs, including MFA fatigue, SIM swapping, and help desk vishing.

---

## 9. Conclusion

The Peter Stokes case illustrates the intersection of "teenagers, cryptocurrency, and social engineering" in the 2026 cybercrime landscape. The case carries three implications.

First, **the critical defensive weakness is process, not technology**. This group enters organizations not through zero-days, but through a help desk phone call and an MFA reset. Defenders must control *"who can reset what, through which procedure, and under what authority"* more than simply asking "what should be patched."

Second, **ransom non-payment is solidifying as a winning strategy**. Company F refused to pay $8 million and absorbed $2 million in recovery costs. This is not only less expensive than paying, but also a decision that reduces follow-on targeting.

Third, **borders are no longer safe havens**. From the arrest at Helsinki Airport to extradition to the United States, cooperation among Interpol, Finland, and the United States shows that international judicial cooperation against crypto-enabled cybercrime has entered an operational phase. At the same time, it must not be forgotten that, under the presumption of innocence, the allegations against Stokes remain prosecutorial claims that have yet to be contested and proven in court.

---

## References

[1] U.S. Attorney's Office, Northern District of Illinois / DOJ Criminal Division, "Alleged Member of Criminal Cyber Hacking Group 'Scattered Spider' Arrested in Finland and Extradited to United States", 2026-07-01.

[2] Sergiu Gatlan, "Alleged Scattered Spider hacker extradited to the United States", BleepingComputer, 2026-07. <https://www.bleepingcomputer.com/news/security/alleged-scattered-spider-hacker-extradited-to-the-united-states/>

[3] "Scattered Spider Suspect Extradited to US Over $8M Crypto Ransom Demand", Decrypt, 2026-07. <https://decrypt.co/372665/scattered-spider-suspect-extradited-to-us-over-8m-crypto-ransom-demand>

[4] Mathew J. Schwartz, "Scattered Spider Suspect Extradited From Finland to US", BankInfoSecurity, 2026-07. <https://www.bankinfosecurity.com/scattered-spider-suspect-extradited-from-finland-to-us-a-32140>

[5] "Teen suspect in Scattered Spider hacks is extradited to US", The Record (Recorded Future News), 2026-07. <https://therecord.media/teen-suspect-in-scattered-spider-hacks-extradited-to-us>

[6] Pierluigi Paganini, "Alleged Scattered Spider Hacker Extradited to U.S. to Face Cybercrime Charges", Security Affairs, 2026-07. <https://securityaffairs.com/194613/security/alleged-scattered-spider-hacker-extradited-to-u-s-to-face-cybercrime-charges.html>

[7] "Peter Stokes extradited to US over $8M crypto ransom scheme tied to Scattered Spider", Crypto Briefing, 2026-07. <https://cryptobriefing.com/peter-stokes-extradited-scattered-spider-crypto-ransom/>

[8] TRM Labs, "2025 Ransomware Trends" (cited by Decrypt) — approximately $850 million in ransomware cryptocurrency extortion in 2025; total ransomware-related inflows declined from $1.9 billion in 2024 to $1.3 billion.

---

© 2026 Dennis Kim (김호광) · This document was prepared for publication in an independent CTI archive (TLP:GREEN).
Contact: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)

> **Disclaimer**: The alleged facts described in this report are based on a U.S. prosecutorial criminal complaint and media reporting. Peter Stokes has not been convicted and is entitled to the presumption of innocence. This document is a threat intelligence and defensive analysis summary and does not constitute legal advice.
