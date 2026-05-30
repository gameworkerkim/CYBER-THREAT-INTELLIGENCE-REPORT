| id             | CTI-2026-0530-CHATGPHISH                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| title          | ChatGPhish — AI要約をフィッシング表面に変えるChatGPTレンダラの信頼欠陥                                                                         |
| subtitle       | マークダウンのリンク・画像への暗黙的信頼、間接プロンプトインジェクション、そしてQRコードピボット                                                                       |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                          |
| email          | gameworker@gmail.com                                                                                                   |
| github         | gameworkerkim                                                                                                          |
| date           | 2026-05-30                                                                                                             |
| classification | TLP:GREEN                                                                                                              |
| severity       | MEDIUM                                                                                                                  |
| lang           | ja                                                                                                                     |
| tags           | AI-Security · Prompt-Injection · LLM-Phishing · Data-Exfiltration · Indirect-Injection · QR-Pivot                     |
| threat_actors  | N/A（研究公開 · Permiso Security）                                                                                            |
| cve            | CVE未付与（Bugcrowd報告、ベンダーは「再現不可」と回答）                                                                                       |
| frameworks     | MITRE ATLAS · OWASP LLM Top 10 (LLM01 Prompt Injection) · NIST AI RMF                                                   |
| license        | CC BY-NC-SA 4.0                                                                                                        |


# ChatGPhish — AI要約をフィッシング表面に変えるChatGPTレンダラの信頼欠陥

> **レポートID** `CTI-2026-0530-CHATGPHISH` · **発行日** 2026-05-30 · **分類** `TLP:GREEN` · **深刻度** 🟠 MEDIUM
> **著者** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*マークダウンのリンク・画像への暗黙的信頼、間接プロンプトインジェクション、そしてQRコードピボット*

---

## 目次

1. 要約 (TL;DR)
2. 脆弱性分析 — レンダラの暗黙的信頼
3. 3つの攻撃プリミティブ
4. 攻撃シナリオ — 正常なWebページがペイロードになる瞬間
5. 公開タイムラインとベンダー対応
6. 企業・個人の視点 — 「メールからブラウザへ」拡大した攻撃面
7. 検知・緩和の推奨
8. 結論
9. 参考文献

---

## 要約 (TL;DR)

2026年5月29日、Permiso SecurityはOpenAI ChatGPTにおいて、AIアシスタントが**マークダウンのリンク・画像を暗黙的に信頼する**ことに起因する脆弱性を公開した。手法名は**ChatGPhish**（研究者Andi Ahmeti）。

核心は、`chatgpt.com`の応答レンダラが、アシスタントがちょうど要約した**第三者ページに由来するマークダウンのリンク・画像URLを信頼する**点にある。レンダラはこれらの画像を自動取得（auto-fetch）し、リンクを信頼されるアシスタントUI内に**アクティブでクリック可能な要素として表示**する。

その結果、攻撃者は任意のWebページに小さなペイロードを仕込むだけで、被害者がそのページをChatGPTで要約した瞬間に、(1) 攻撃者ホストの画像が自動ロードされ**IP・User-Agent・Refererが漏えい**し、(2) フィッシングリンク・偽のシステム警告・QRコードが**ChatGPT自身のUIの視覚的信頼をまとったまま**表示される。攻撃がメール・添付からブラウザ・AI要約へ移ることで、攻撃面が大きく広がる。

### Key Judgments

| #    | 判断                                                                                                                       | 信頼度            |
| ---- | ------------------------------------------------------------------------------------------------------------------------ | -------------- |
| KJ-1 | 本欠陥の根は**間接プロンプトインジェクション**だ。モデルが自身の生成コンテンツと外部から取り込んだマークダウンを区別できない。                                                          | **High**       |
| KJ-2 | アシスタントUIの**視覚的信頼**が武器になる。偽のセキュリティ警告・フィッシングリンクがChatGPT自身の出力と区別不能に表示され、出典ラベルがない。                                              | **High**       |
| KJ-3 | **QRコードピボット**はデスクトップのURL防御（ブロックリスト・ホバープレビュー・パスワードマネージャのドメインチェック）を完全に回避する。宛先は2台目の端末でスキャンした後にのみ判明する。                            | **Medium-High**|
| KJ-4 | 画像自動取得によるIP・UA・Referer漏えいは標的偵察・追跡に利用可能だが、会話全体の窃取レベルではない。影響は**情報漏えい + フィッシング配信**に集中する。                                       | **Medium**     |
| KJ-5 | ベンダーが「再現不可/重複」と回答し、発行時点で修正確認が取れていない以上、**現在も脆弱だという前提**で対応すべきだ。（モバイルアプリは特に未適用の可能性）                                              | **Medium**     |

---

## 1. 脆弱性分析 — レンダラの暗黙的信頼

ChatGPhishはメモリ破壊や認証バイパスのような従来型の欠陥ではなく、**LLMシステム固有の信頼境界の崩壊**に起因する。

ユーザがChatGPTにWebページの要約を依頼すると、モデルは当該ページ（第三者、未信頼コンテンツ）を取得して処理する。問題は、処理結果がアシスタントの応答ウィンドウにレンダリングされる際、`chatgpt.com`レンダラが**そのページに由来するマークダウンのリンク・画像URLをアシスタント自身の出力のように信頼する**点だ。レンダラは画像URLを自動取得し、リンクをアクティブでクリック可能な要素として表示する。

ブラウザの同一オリジンポリシーはここで保護を提供しない。AIアシスタントが**ユーザの認証済みコンテキスト**で実行されるため、従来のWebセキュリティ境界が無効化されるからだ。研究者の言葉を借りれば、ChatGPTは*「自身の生成コンテンツと外部から取り込んだ攻撃者制御のマークダウンを区別できない。」*

---

## 2. 3つの攻撃プリミティブ

Permisoはこの信頼欠陥から派生する3つの攻撃原型を提示した。

| # | プリミティブ | 説明 |
| --- | --- | --- |
| ① | **UIリドレス / フィッシング** | 攻撃者制御のマークダウンリンクがChatGPT UI内に出典ラベルなしでアクティブなクリック要素としてレンダリングされる。ユーザは攻撃者注入のURLとChatGPT生成のURLを区別できない。 |
| ② | **偽のシステム警告（スプーフィング）** | レンダラが攻撃者テキストを正常な「アカウントセキュリティ警告」のようにスタイリングして表示する。アシスタントUIの視覚的信頼をそのまま継承する。 |
| ③ | **QRコードピボット** | 攻撃者のS3バケットから自動レンダリングされたQR画像が全てのデスクトップURL防御を回避する。宛先は2台目の端末でスキャンした後にのみ判明し、ブラウザのブロックリスト・ドメインチェックを回避する。 |

これに加え、埋め込み画像の自動取得だけで被害者の**IP・User-Agent・Referer**が攻撃者サーバに送られる（情報漏えい）。

---

## 3. 攻撃シナリオ — 正常なWebページがペイロードになる瞬間

典型的なシナリオは次の通り。

1. 攻撃者が任意のWebページ（またはGitHubのページ等）にChatGPT向けの指示を隠して仕込む。研究ではGitHubのページに偽のセキュリティ警告用の指示を注入する方式が実証された。
2. 被害者が業務中に当該ページをChatGPTで要約するよう依頼する（正常な行為）。
3. ChatGPTがページを処理すると、隠された指示が応答に反映される — フィッシングリンク、偽のアカウントセキュリティ警告、リモート画像、QRコードが信頼されるUI内にレンダリングされる。
4. 同時に攻撃者ホストの画像が自動ロードされ、被害者のIP・UA・Refererが漏えいする。
5. 被害者がデスクトップからQRをスマートフォンでスキャンすると、攻撃者のS3バケットコンテンツへ移動し、デスクトップの防御を完全に回避する。

この過程で被害者は*悪性の添付を開いたり、不審なメッセージに反応する必要がない*。「信頼するAIにWebページの要約を頼む」という日常的な行為こそがトリガーだ。

---

## 4. 公開タイムラインとベンダー対応

| 日付 | 事象 |
| --- | --- |
| 2026-04-29 | PermisoがBugcrowdを通じてOpenAIに最初の報告 — *「Untrusted Markdown Rendering Leads to XSS, Phishing, and Data Exfiltration」* |
| （以降） | OpenAI：再現不可（could not be reproduced）と回答、重複（duplicate）処理の形跡 |
| （以降） | Permiso：報告した件と「重複」とされた件の相違を説明し追加情報を要請 → 回答なし |
| 2026-05-29 | Permiso、ChatGPhishを公開。研究者「修正適用の有無は未確認 — 安全のため依然脆弱と想定せよ」 |

研究者は発行時点で**修正適用の確認が取れていない**と述べた。本レポートはこれを*「現在も脆弱」という保守的な前提*で扱う。過去の類似する画像マークダウンベースのデータ漏えい（2023年、Johann Rehberger；`url_safe`検証の導入）が不完全に緩和された前例も、この前提を裏付ける。

---

## 5. 企業・個人の視点 — 「メールからブラウザへ」拡大した攻撃面

Permisoが指摘した通り、この欠陥は**攻撃の重心をメールからブラウザへ移す**。組織がChatGPTをリサーチ・要約に広く導入するほど、従業員が処理を依頼する任意の悪性Webページが、ChatGPTをフィッシング表面に転換し得る。

- **信頼の転移** — ユーザはアシスタント出力を信頼するよう学習している。その信頼がそのまま攻撃者に継承される。
- **検知の空白** — 既存のセキュリティツールはメール・ネットワークトラフィックの監視に合わせられており、ブラウザ内でAIがレンダリングしたコンテンツは可視性の外にある。
- **モバイルリスク** — 過去の事例では、モバイルアプリはクライアント側検証が遅れて適用される傾向があった。デスクトップが緩和されてもモバイルの残存リスクは大きくなり得る。

これは本アーカイブが扱ったMCPバイアス注入（`CTI-2026-0422-MCP` §6）と同系列の脅威 — *「コード実行なしにAI出力自体を武器化」* — の別の事例だ。

---

## 6. 検知・緩和の推奨

1. **要約出力の境界** — AIが要約・レンダリングしたコンテンツ内のリンク・警告を「外部の未検証コンテンツ」として扱うようユーザを教育する。アシスタント内の「アカウントセキュリティ警告」は無条件に疑う。
2. **画像自動ロードの制御** — 可能な場合、クライアント・企業ポリシーのレベルで外部画像の自動取得を制限するかプロキシ経由とし、IP・UA・Refererの露出を遮断する。
3. **QRの警戒** — デスクトップ画面にレンダリングされたQRコードを信頼しない。スキャン前に出所を確認できないQRは遮断対象として教育する。
4. **要約対象の信頼の階層化** — 未信頼の外部ページをAIで要約する際のリスクを認識し、機微業務アカウントでは信頼できる出所に限定する。
5. **ベンダーパッチの追跡** — OpenAIの公式修正・緩和の発表を追跡し、モバイルアプリの適用有無を別途確認する。
6. **間接インジェクション防御の一般化** — OWASP LLM Top 10（LLM01）・MITRE ATLAS・NIST AI RMFに基づき、外部コンテンツを処理する全てのAIワークフローに出力サニタイズ・出典ラベリング・レンダリング境界を設計原則として適用する。

---

## 7. 結論

深刻度そのもの（情報漏えい + フィッシング配信）で見れば、ChatGPhishはCriticalではない。しかし**脅威の性格**が重要だ。これはAIアシスタントが築き上げた*信頼*を攻撃表面に転換する、LLM時代の構造的脆弱性の系列に属する。メモリ破壊も権限昇格もなく、*「モデルが自身の出力と外部コンテンツを区別できない」*という一つの事実だけで、フィッシング・偵察・端末ピボットが成立する。

防御の出発点は明確だ。**AI出力は信頼の終着点ではなく検証の出発点**でなければならない。ユーザがChatGPTにページの要約を頼むとき、その結果物の中のリンク・警告・QRは全て外部の未検証コンテンツであり得る。AIを「人より信じる」という認知的習慣そのものが、この攻撃が狙う最大の資産だ。

> *機微なページをAIで要約する前に、「この応答内の全てのリンクは外部から来たものかもしれない」という前提をまず立てること。*

---

## 参考文献 (References)

[1] Ravie Lakshmanan, "ChatGPhish Vulnerability Turns ChatGPT Web Summaries Into a Phishing Surface", The Hacker News, 2026-05-29. <https://thehackernews.com/2026/05/chatgphish-vulnerability-turns-chatgpt.html>

[2] "New ChatGPT Vulnerability Lets Attackers Turn Web Pages Into Phishing Payloads", Cyber Security News, 2026-05-29. <https://cybersecuritynews.com/chatgpt-vulnerability-chatgphish-attack/>

[3] Andi Ahmeti (Permiso Security) via The Register, "ChatGPT blindly trusts browser content, turning the page into a payload", The Register, 2026-05-29. <https://www.theregister.com/research/2026/05/29/chatgpt-prompt-injection-turns-web-pages-into-phishing-lures/>

[4] Tenable Research, "HackedGPT: Novel AI Vulnerabilities Open the Door for Private Data Leakage", 2025-11. <https://www.tenable.com/blog/hackedgpt-novel-ai-vulnerabilities-open-the-door-for-private-data-leakage>

[5] Johann Rehberger, "OpenAI Begins Tackling ChatGPT Data Leak Vulnerability", Embrace The Red, 2023-12. <https://embracethered.com/blog/posts/2023/openai-data-exfiltration-first-mitigations-implemented/>

---

© 2026 Dennis Kim (김호광) · 本文書は独立CTIアーカイブ（TLP:GREEN）の公開を目的として作成された。
連絡先: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
