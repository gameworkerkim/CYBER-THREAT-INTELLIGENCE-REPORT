| id             | CTI-2026-0530-GOGS                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| title          | 未パッチのCritical RCE — Gogs git rebase 引数インジェクション脆弱性                                                                       |
| subtitle       | 認証された一般ユーザがセルフホスト型Gitサーバを掌握する9.4点の欠陥、そしてクロステナント侵害                                                                       |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                          |
| email          | gameworker@gmail.com                                                                                                   |
| github         | gameworkerkim                                                                                                          |
| date           | 2026-05-30                                                                                                             |
| classification | TLP:GREEN                                                                                                              |
| severity       | HIGH                                                                                                                   |
| lang           | ja                                                                                                                     |
| tags           | Argument-Injection · RCE · Self-Hosted-Git · Supply-Chain · Cross-Tenant · Unpatched                                  |
| threat_actors  | 該当なし（PoC・Metasploitモジュール公開）                                                                                            |
| cve            | CVE未付与（Rapid7算定 CVSS 9.4）                                                                                               |
| frameworks     | MITRE ATT&CK · NIST SP 800-61（インシデント対応） · STIX/TAXII                                                                    |
| license        | CC BY-NC-SA 4.0                                                                                                        |


# 未パッチのCritical RCE — Gogs git rebase 引数インジェクション脆弱性

> **レポートID** `CTI-2026-0530-GOGS` · **発行日** 2026-05-30 · **分類** `TLP:GREEN` · **深刻度** 🔴 HIGH
> **著者** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*認証された一般ユーザがセルフホスト型Gitサーバを掌握する9.4点の欠陥、そしてクロステナント侵害*

---

## 目次

1. 要約 (TL;DR)
2. 脆弱性分析 — `--exec` 引数インジェクション
3. 攻撃シナリオ — 無権限アカウントからサーバ掌握まで
4. 影響範囲と露出規模
5. フォレンジック痕跡と検知
6. 緩和の推奨（パッチ不在の状況）
7. 韓国の視点 — セルフホスト型Gitの死角
8. 結論
9. 参考文献

---

## 要約 (TL;DR)

2026年5月28日、Rapid7は人気のセルフホスト型Gitサービス**Gogs**において、**認証された一般ユーザがサーバ上で任意コードを実行**できるCritical脆弱性を公開した。CVE識別子は未付与だが、Rapid7はCVSS 9.4と算定した。

核心はGogsの*「Rebase before merging」*マージ動作で発生する。攻撃者が**悪性ブランチ名**でプルリクエストを作成すると、そのブランチ名が`git rebase`コマンドの`--exec`フラグに注入され、各コミットの再生後に任意のシェルコマンドが実行される。管理者権限も、他ユーザとの相互作用も不要である。

さらに深刻なのは、本脆弱性が**2026年3月17日にメンテナへ報告されたにもかかわらず発行時点で未パッチ**であり、Rapid7がLinux・Windows両方を自動攻撃する**Metasploitモジュールまで公開**したことだ。つまり、武器は公開され、パッチはない。

### Key Judgments

| #    | 判断                                                                                                                | 信頼度            |
| ---- | ----------------------------------------------------------------------------------------------------------------- | -------------- |
| KJ-1 | 本欠陥はユーザ入力（ブランチ名）がシェルコマンド引数にそのまま渡される**典型的な引数インジェクション（argument injection）**であり、認証以外の前提条件が事実上ない。                       | **High**       |
| KJ-2 | **未パッチ + 公開Metasploitモジュール**の組み合わせは、実戦的悪用の障壁をほぼ取り除く。露出インスタンスは即座にリスクに晒される。                                          | **High**       |
| KJ-3 | 単一サーバを共有する環境で**クロステナント（cross-tenant）侵害**が可能だ — あるユーザが他人の非公開リポジトリを読める。                                             | **High**       |
| KJ-4 | デフォルト設定（登録・リポジトリ作成許可）のインスタンスが最も危険だ。緩和は可能だが根本パッチを代替しない。                                                            | **Medium-High**|
| KJ-5 | セルフホスト型Gitはソースコード・認証情報・CIパイプラインの単一信頼点であるため、本欠陥は**サプライチェーン侵害の橋頭堡**になり得る。                                          | **Medium-High**|

---

## 1. 脆弱性分析 — `--exec` 引数インジェクション

GogsはGoで書かれた軽量なセルフホスト型Gitサービスで、GitHubの自己ホスト代替として広く使われる。本脆弱性はPRをマージする際に`git rebase`を使う*「Rebase before merging」*オプションで発生する。

`git rebase`はあるブランチのコミット列を別のベースブランチ上に再生して線形履歴を作る動作だ。この際`git rebase`は**各コミット再生後にシェルコマンドを実行する`--exec`フラグ**を引数として受け取れる。Gogsはマージ時にユーザが制御する**ブランチ名**を十分なサニタイズなしに`git rebase`呼び出しに渡す。よって攻撃者がブランチ名に`--exec`形式のペイロードを挿入すると、マージ過程でそのコマンドがサーバホスト上で実行される。

> 研究者Jonah Burgess（Rapid7）：「任意の認証ユーザが悪性ブランチ名でPRを作成し、『Rebase before merging』時に`--exec`フラグを`git rebase`に注入することでサーバ上のRCEを達成できる。」

影響プラットフォームはWindows・Linux・macOS等**サポートされる全プラットフォーム**である。

---

## 2. 攻撃シナリオ — 無権限アカウントからサーバ掌握まで

本脆弱性の危険性は**前提条件がほぼない**点にある。

| シナリオ | 前提 | 攻撃経路 |
| --- | --- | --- |
| ① デフォルト設定インスタンス | 登録・リポジトリ作成許可（デフォルト） | アカウント作成 → リポジトリ作成（自動オーナー） → 設定でrebaseマージをトグル → エクスプロイトチェーンを単独実行 |
| ② 書き込み権限保持者 | rebaseマージが既に有効なリポジトリにwrite権限 | 直接エクスプロイト |
| ③ リポジトリ作成制限環境 | rebaseマージが有効な任意のリポジトリにwrite権限 | 当該リポジトリ経由で実行 |

特に①は*「登録ユーザがリポジトリを作ると自動でオーナーになり、rebaseマージの有効化は設定のトグル一つ」*という点で、**他ユーザとの相互作用なしに全エクスプロイトチェーンを単独運用**できる。

成功時、攻撃者はサーバ侵害、インスタンス内の全リポジトリへのアクセス、認証情報のダンプ、ネットワーク内の他システムへの移動、ホストされたリポジトリコードの改ざんが可能となる。とりわけ、**同一共有サーバにホストされた他ユーザの非公開リポジトリを読むクロステナントデータ侵害**につながる。

---

## 3. 影響範囲と露出規模

- **推定露出インスタンス**：インターネットに直接露出したGogsインスタンスは約1,141台と推定される。ただし大半の配備がVPN・内部網の背後にあるため、**実際の規模はより大きい**と評価される。
- **武器化レベル**：Rapid7はLinux・Windows標的に対し全エクスプロイトチェーンを自動化するMetasploitモジュールを公開した。モジュールは2モードを支援する — (a) 攻撃者アカウントに一時リポジトリを作成・実行・削除するデフォルトモード、(b) 既にwrite・merge権限を持つリポジトリを標的とするモード。
- **パッチ状態**：2026-03-17のメンテナ報告にもかかわらず発行時点で**未パッチ**。

---

## 4. フォレンジック痕跡と検知

Rapid7によれば、攻撃痕跡はモードによって異なる。

- **自己リポジトリ作成・削除モード**：サーバログに残る痕跡は事実上**HTTP 500エラー1件**のみ。事後分析でも正常エラーと区別が困難。
- **既存リポジトリ悪用モード**：追加のアーティファクトが残り、相対的に検知可能性が高い。

検知の推奨：

1. PRマージイベントに連動した異常なHTTP 500パターンの監視
2. 異常なブランチ名（特殊文字・`--exec`類似トークンを含む）作成イベントへの警報
3. Gogsプロセスから派生した予期せぬシェル・子プロセスの行為検知
4. 新規アカウント → リポジトリ作成 → rebaseトグル → マージへと続く短時間連鎖行為の追跡

---

## 5. 緩和の推奨（パッチ不在の状況）

根本パッチがない状況でRapid7が推奨した暫定緩和は次の通り。

1. **登録制限** — `app.ini`で`DISABLE_REGISTRATION = true`に設定し、未信頼ユーザのアカウント作成を遮断する。
2. **リポジトリ作成制限** — `app.ini`で`MAX_CREATION_LIMIT = 0`に設定し、ユーザの自己リポジトリ作成を防ぐ。
3. **rebaseマージ設定の監査** — rebaseマージが有効なリポジトリを全数点検し、不要な有効化を解除する。
4. **ネットワーク隔離** — インターネット直接露出を除去し、VPN・内部網・アクセス制御の背後へ移す。
5. **代替の検討** — パッチ提供が不確実な場合、保守が活発なForgejo・Gitea等への移行を中長期課題として検討する（ただしGitea系も別途脆弱性履歴があるためバージョン点検必須）。

---

## 6. 韓国の視点 — セルフホスト型Gitの死角

韓国のスタートアップ・研究室・中小SI環境でGogs・Gitea系のセルフホスト型Gitは*「軽量で無料だから」*広く使われるが、次の死角が存在する。

- **資産インベントリの欠落** — 「内部用Git」という認識ゆえ、セキュリティ資産リスト・脆弱性スキャン対象から漏れる場合が多い。
- **CI/CDの信頼連鎖** — Gitサーバはソースコードだけでなくデプロイキー・Webhook・CIランナートークンの信頼起点だ。サーバ掌握はビルドパイプライン汚染へ波及し得る。
- **クロステナントリスク** — 一つのサーバに複数チーム・プロジェクトが共存する共用インスタンスで、本欠陥は一チームが他チームの非公開コードを窃取する経路となる。

推奨：韓国の運用主体はインターネット露出の有無に関わらず自社Gogsインスタンスを**直ちにインベントリに含め**、§5の緩和策を適用したうえでパッチ動向を追跡すること。

---

## 7. 結論

本脆弱性は新しい攻撃手法ではなく、**ユーザ入力をシェル引数で信頼した**古典的なミスだ。しかし(1)認証以外の前提条件がなく、(2)公開Metasploitモジュールが存在し、(3)根本パッチがないという三重条件が重なり、実戦的危険度は非常に高い。

セルフホスト型Gitは組織の最も機微な資産 — ソースコード、認証情報、デプロイパイプライン — の単一信頼点だ。こうしたシステムを「内部用だから大丈夫」という前提で放置することが最大のリスクである。パッチが出るまで、露出の除去と設定強化は選択ではなく必須だ。

---

## 参考文献 (References)

[1] Ravie Lakshmanan, "Critical Gogs RCE Vulnerability Lets Any Authenticated User Execute Arbitrary Code", The Hacker News, 2026-05-28. <https://thehackernews.com/2026/05/critical-gogs-rce-vulnerability-lets.html>

[2] Jonah Burgess, "Authenticated RCE via Argument Injection in Gogs (Unfixed)", Rapid7, 2026-05. <https://www.rapid7.com/blog/post/ve-authenticated-rce-via-argument-injection-gogs-unfixed/>

[3] Rapid7, "Metasploit module — Gogs git rebase argument injection RCE", GitHub PR #21515. <https://github.com/rapid7/metasploit-framework/pull/21515>

[4] Atlassian, "Merging vs. Rebasing", Git Tutorials. <https://www.atlassian.com/git/tutorials/merging-vs-rebasing>

[5] Git Documentation, "git-rebase — `--exec` option". <https://git-scm.com/docs/git-rebase#Documentation/git-rebase.txt---execltcmdgt>

---

© 2026 Dennis Kim (김호광) · 本文書は独立CTIアーカイブ（TLP:GREEN）の公開を目的として作成された。
連絡先: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
