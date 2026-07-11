# [Security Report] Analysis of the Spread of 'Qshing' — A New QR-Code Phishing Technique
 - A sophisticated threat that hides malicious codes over shared-mobility, parking, and public-health QR codes

| Field | Detail |
|---|---|
| Report ID | CTI-2026-0612-QSHING |
| Published | 2026-06-12 |
| Classification | TLP:GREEN |
| Severity | MEDIUM — High public exposure, but attack scenarios require user interaction |
| Confidence | HIGH (based on multiple Korean media outlets and security-vendor trend materials) |
| Threat Actors | Unspecified phishing criminal organizations |
| Related ATT&CK Techniques | T1566 (Phishing), T1204 (User Execution) |
| References | DailySecu, Trend Micro, KISA |
| Author | Dennis Kim |
| lang | en |

## Key Judgments

- (HIGH) **Qshing** is a portmanteau of QR code and phishing. It is a new technique in which attackers **affix a transparent film sticker containing a malicious URL over a legitimate QR code**. Originating in China, it spread through Taiwan and Southeast Asia before arriving in Korea.
- (MEDIUM) In Korea, Qshing attacks have been observed across everyday contexts, including **shared-mobility (e-scooters, Seoul Bike) QR codes, parking tickets, and public-health pass verification QR codes**.
- (HIGH) Scanning the QR code can redirect victims to a **fake website that steals personal or financial information, or automatically install a malicious app (APK)**. Given shared-mobility billing systems, authentication credentials are also at risk.
- (MEDIUM) KISA operates a dedicated page for "smishing and Qshing response" and continuously promotes prevention guidance. Security practitioners emphasize that "installing a mobile security app and a smishing-detection app, then keeping them up to date, is the most effective preventive measure."

In practice, individuals have few reliable ways to avoid this entirely. Qshing often serves as a gateway to other forms of compromise.

## §1. Incident Overview — QR-Code Impersonation Attacks in Everyday Life

Qshing is a new cyberattack technique that abuses the convenience of QR codes. Attackers carefully overlay a very thin transparent film sticker on the legitimate QR code of a shared-mobility device. When a user scans the code, they are redirected to a phishing site configured by the attacker, or a malicious app is automatically downloaded and installed. Unlike traditional URL-tampering methods, **forging the physical QR code itself makes detection extremely difficult**. Because shared-mobility billing is tied to user accounts, compromise can also lead directly to financial loss.

## §2. Attack Scenario Analysis

#### ① Shared-Mobility Impersonation Qshing

- **Target**: Shared services rented via QR code, including e-scooters, shared bikes (Seoul Bike), and car-sharing.
- **Attack method**: Affix a transparent film sticker containing a malicious URL over the legitimate rental QR code. When the user scans the device QR code, they are redirected to a phishing site that requests login and payment information or forces installation of a malicious app.
- **Risk**: Shared-mobility billing is directly linked to user accounts, so stolen login credentials can immediately expose payment information and enable proxy payments or account takeover.

#### ② Parking-Ticket Impersonation Qshing

- **Target**: Ticket-style QR codes affixed during vehicle parking.
- **Attack method**: Affix a QR-code sticker mimicking official forms such as parking-violation tickets on the vehicle windshield, inducing the driver to scan out of curiosity or anxiety.
- **Risk**: Scanning leads to a phishing site that requests financial information; less security-aware users are especially vulnerable.

## §3. Defensive Recommendations and Prevention Guidance

#### User Guidance

**Before scanning**
1. Inspect the physical condition of the QR code: overlapping stickers, texture differences from the original QR code, or abnormal foreign material
2. Question whether the QR code is original: follow the official shared-mobility app rental flow (avoid third-party QR scanner apps)
3. Do not scan QR codes of unclear origin: exercise special caution with parking tickets, flyers, and SNS-linked QR codes

**After scanning**
1. Scrutinize the destination URL: verify it matches an official domain (e.g., `.go.kr` or the company's official domain)
2. Immediately stop if personal or financial information is requested: government agencies and shared-mobility operators do not request payment solely via a QR scan
3. Immediately cancel unexpected app (APK) download prompts
4. Install a mobile security app and a smishing-detection app, and keep them updated

#### Recommendations for Organizations and Operators

1. Regular field inspections: frequently check QR codes in shared-mobility deployment areas for overlay or tampering
2. Strengthen physical security: replace stickers with laser engraving, protective films, or other measures that block physical tampering
3. User education: regularly notify users of Qshing techniques and precautions via in-app push notifications
