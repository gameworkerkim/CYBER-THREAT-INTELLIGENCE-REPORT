# 同時進行する2つの脅威：ホスティング基盤の乗っ取りと自己増殖型サプライチェーンワーム

> **LiteSpeed cPanel プラグイン CVSS 10.0 RCE (CVE-2026-48172) · Mini Shai-Hulud npm ワームの新たな波 (TeamPCP)**
> *実環境での悪用が進行中 · 韓国のホスティング・開発エコシステムへの直接的な露出 · OSINT に基づく防御分析*

| 項目 | 値 |
| --- | --- |
| **レポート ID** | `CTI-2026-0524-DUALTHREAT` |
| **発行日** | 2026-05-24 (KST) |
| **分類 (TLP)** | 🟢 TLP:GREEN — コミュニティ内で自由に共有可能（出典明記が必須） |
| **深刻度** | 🔴 **CRITICAL** — 実環境での悪用＋自己増殖型ワーム（即時対応） |
| **対象の脅威** | ① CVE-2026-48172 (LiteSpeed User-End cPanel Plugin, CVSS 10.0)<br>② Mini Shai-Hulud npm ワーム 5月の新たな2つの波 (TeamPCP) |
| **脅威アクター** | TeamPCP（別名：DeadCatx3 · PCPcat · ShellForce · CipherForce）/ ②に限定 |
| **フレームワーク** | MITRE ATT&CK · NIST SP 800-61 · NIST SP 800-207 (Zero Trust) |
| **作成者** | Dennis Kim · 独立脅威インテリジェンスアナリスト · gameworker@gmail.com |

---

## 要約 (Executive Summary)

2026年5月、一見無関係に見えながら同一の構造的教訓を共有する2つの高リスク脅威が同時に活性化した。いずれの脅威も、攻撃者が**「信頼された既定の権限」**と**「信頼された自動化パイプライン」**を正規の手段で乗っ取って権限を昇格させる形態であり、韓国のWebホスティング産業と開発者エコシステムに直接的な露出を生じさせている。

- **脅威 ① — LiteSpeed cPanel プラグイン RCE (CVE-2026-48172, CVSS 10.0)：** 共有ホスティングにおいて、あらゆる cPanel ユーザー（攻撃者や乗っ取られたアカウントを含む）が `lsws.redisAble` JSON-API への1回の呼び出しだけで root 権限による任意スクリプト実行が可能である。認証バイパスやレースコンディションは不要であり、**すでに実環境で活発に悪用されている**。
- **脅威 ② — Mini Shai-Hulud npm ワームの新たな波 (TeamPCP)：** 5月の2つの新しい波のうち、一方は**認証情報を一切必要としない初期アクセス（credential-free）**手法を、もう一方は歴代 Shai-Hulud ワーム中**最高の1時間あたりパッケージ生成数**を記録した。4月の `@bitwarden/cli 2026.4.0` 偽装パッケージは、インストール直後にクラウド・CI/CD・開発者ワークステーションの認証情報を窃取し、被害者が公開可能なすべての npm パッケージへ自己増殖する。
- **共通の教訓：** 両事案とも「盗まれたパスワード」ではなく「正規に付与された権限・信頼」を悪用する。したがって認証情報のローテーションだけでは防御は不完全であり、最小権限の原則（Zero Trust）と信頼境界の再設計が中核的な対策となる。

---

## 主要判断 (Key Judgments)

| # | 判断 | 信頼度 |
| --- | --- | --- |
| **KJ-1** | CVE-2026-48172 は不適切な権限割り当て（Incorrect Privilege Assignment）に分類され、共有ホスティング環境では単一の悪意あるテナント、または乗っ取られたテナントがサーバー全体（root）の掌握へ直行しうる。実環境での悪用はベンダーにより確認済み。 | **High** |
| **KJ-2** | 韓国には cPanel/WHM + LiteSpeed の組み合わせを使用する中小Webホスティング・リセラーが多数存在し、単一サーバーに数百テナントが同居する共有ホスティングの構造的特性上、国内での露出可能性は高い。 | **Medium** |
| **KJ-3** | Mini Shai-Hulud の「credential-free 初期アクセス」は OIDC トークンをランナーのメモリから直接抽出・交換して npm 公開権限を取得するため、正規のリリースパイプラインが有効な SLSA 来歴証明（provenance）を付したまま悪意あるパッケージを公開する。来歴証明だけでは安全性を保証できない。 | **High** |
| **KJ-4** | トークン失効（revocation）に反応してユーザーのホームディレクトリを破壊する（`rm -rf ~/`）フェイルセーフが観測されたため、「ホスト隔離後に認証情報を失効」という通常対応がかえってデータ破壊を誘発しうる。 | **High** |
| **KJ-5** | 模倣（copycat）活動の増加により、今後の TeamPCP への帰属判断の精度が低下しているため、単一アクターを前提とするより「Shai-Hulud 系統の TTP」単位での防御がより堅牢である。 | **Medium** |

---

## 1. LiteSpeed cPanel プラグイン RCE — CVE-2026-48172

### 1.1 概要

| 項目 | 値 |
| --- | --- |
| **CVE** | `CVE-2026-48172` |
| **CVSS** | **10.0**（CRITICAL · 最高深刻度） |
| **脆弱性タイプ** | 不適切な権限割り当て（Incorrect Privilege Assignment）→ 権限昇格 / root RCE |
| **影響製品** | LiteSpeed User-End cPanel Plugin（ユーザー側プラグイン）。WHM プラグインは直接の影響なし |
| **影響バージョン** | v2.3 ～ v2.4.4（v2.4.5 未満すべて） |
| **修正バージョン** | **v2.4.5 で修正** / 推奨最小バージョン v2.4.7（WHM プラグイン v5.3.1.0 にバンドル） |
| **悪用状況** | **実環境での悪用を確認**（2026-05、0-day） |
| **発見者** | セキュリティ研究者 David Strydom |

### 1.2 技術分析

根本原因はプラグインの `lsws.redisAble` JSON-API エンドポイントに存在するロジック上の欠陥である。このエンドポイントは既定で**ログイン済みのすべての cPanel ユーザーに公開**されており、攻撃面が極めて広い。

- 認証バイパスやレースコンディションは不要である。有効な cPanel セッションを保持した状態で、特定のパラメータ値を含む単一の不正な API 呼び出しだけで root 権限への昇格が成立する。
- Redis の有効化/無効化機能の処理の不備（mishandling）が中核的な欠陥であり、ユーザー入力が昇格された権限コンテキストへそのまま渡される。
- 共有ホスティング環境では特に致命的である ── 単一サーバーに数百のテナントがすでに有効な cPanel セッションを保持しているため、1つの悪意あるテナント、または既に乗っ取られた1アカウントがサーバー全体の掌握（full server takeover）へ転回しうる。

### 1.3 影響評価

| 観点 | 影響 |
| --- | --- |
| **機密性** | 同一サーバー内の全テナントのファイル・DB・鍵情報の露出（root アクセス） |
| **完全性** | Webシェル・バックドア・クリプトマイナーの設置、コンテンツ改ざん、サプライチェーン型水飲み場攻撃が可能 |
| **可用性** | サーバー全体の停止・ランサム・ログ削除によるインシデント分析の妨害 |
| **拡散性** | リセラー・マルチテナントホスティングでは、1サーバーの侵害が多数の顧客へ連鎖的に拡大 |

### 1.4 検知 (Detection)

LiteSpeed が提供する侵害指標（IoC）点検コマンド。出力がなければ未悪用、出力があれば該当 IP を検証・遮断し、事後の侵害活動を調査する。

```bash
grep -rE "cpanel_jsonapi_func=redisAble" /var/cpanel/logs /usr/local/cpanel/logs/ 2>/dev/null
```

### 1.5 対応と緩和 (Remediation)

| 優先 | 対応 |
| --- | --- |
| **1** | 直ちに LiteSpeed WHM Plugin v5.3.1.0（cPanel プラグイン v2.4.7 をバンドル）へアップグレード。追加の攻撃ベクトルのハードニングを含む。 |
| **2** | 即時のパッチ適用が不可能な場合、ユーザー側プラグインを削除（緩和策）：<br>`/usr/local/lsws/admin/misc/lscmctl cpanelplugin --uninstall` |
| **3** | 1.4 の grep コマンドで悪用痕跡を点検 → 疑わしい IP を遮断し、システムログを精査。 |
| **4** | 侵害が疑われる場合、サーバーパスワード・API トークン・SSH 鍵を全面的にローテーションし、Webシェル・スケジュールタスク（cron）・新規ユーザーを点検。 |
| **5** | 同一サーバーの5月の勧告を累積的に点検：認証前バイパス CVE-2026-41940（CVSS 9.8）など、cPanel エコシステムで多発する勧告を併せて確認。 |

---

## 2. Mini Shai-Hulud npm ワームの新たな波 (TeamPCP)

### 2.1 概要

| 項目 | 値 |
| --- | --- |
| **キャンペーン** | Mini Shai-Hulud（Shai-Hulud 系統 第4世代の変種） |
| **脅威アクター** | TeamPCP（別名 DeadCatx3 · PCPcat · ShellForce · CipherForce）、金銭目的、2024年以降に活動 |
| **主要事案** | `@bitwarden/cli 2026.4.0` 偽装パッケージ（4月）<br>TanStack OIDC ハイジャックの波（5/11、CVE-2026-45321）<br>AntV ほか 5/19 に22分間で 300+ バージョンを自動公開した波 |
| **検知したセキュリティ企業** | Endor Labs · Wiz · SafeDep · Socket · StepSecurity · Snyk · Unit 42 · Akamai ほか |
| **関連 CVE** | CVE-2026-45321（TanStack の波に限定して割り当て） |

### 2.2 @bitwarden/cli 偽装パッケージの分析

正規の Bitwarden CLI パスワードマネージャー（月間25万+ ダウンロード）を騙る悪意ある npm パッケージ `@bitwarden/cli 2026.4.0` が公開された。インストール時に多段階ペイロードが実行され、クラウドプロバイダー・CI/CD システム・開発者ワークステーションの認証情報を窃取し、被害者が公開可能なすべての npm パッケージをバックドア化して自己増殖する。

- 実行パスの改ざん → 悪意あるローダーの実行 → GitHub から Bun アーカイブをダウンロード・展開 → JavaScript ペイロードの実行。
- C2 回避：github.com のトラフィックはセキュリティツールで通常ブロックされず、アクター所有のドメインへ逆追跡されない。窃取データは非対称暗号で秘匿される。

### 2.3 credential-free 初期アクセス — 新手法

これまでのすべての波は「盗まれた認証情報」から始まったが、今回の新しい波はそうではない。攻撃の流れは以下のとおり。

| 段階 | 行為 |
| --- | --- |
| **1** | TanStack の GitHub Actions CI における PR ワークフローの誤設定を悪用。フォークからの PR が、ベースリポジトリのキャッシュへの書き込み権限を持つワークフローをトリガー。 |
| **2** | 攻撃者のコードがキャッシュを汚染して潜伏（約8時間）。正規メンテナのマージが標準のリリースワークフローを起動し、汚染されたキャッシュを読み込む。 |
| **3** | ワームがランナーのメモリから OIDC トークンを直接スクレイピング → npm トークン交換エンドポイントで公開用認証情報を取得。 |
| **4** | npm トークンが「盗まれた」ことはなく、公開ワークフロー自体も損なわれていないため攻撃は不可視であり、有効な SLSA Build Level 3 来歴証明を取得。（5/11 19:20–19:26 UTC、@tanstack の42パッケージに84の悪意あるバージョンを公開） |

### 2.4 破壊的フェイルセーフ (Wiper)

5/11 のペイロードは、窃取した GitHub トークンを用いて `api.github.com/user` を60秒ごとにポーリングする永続的バックグラウンドデーモン（`gh-token-monitor`）を設置する。トークンが失効して **HTTP 40x** が返ると `rm -rf ~/` を実行し、ユーザーのホームディレクトリを破壊する。デーモンは24時間後に自動終了する。

> ⚠️ **対応上の警告：**「ホストを隔離してから直ちに認証情報を失効させる」という通常の一次対応がワイパーを発動させうる。ローカルに破壊的フェイルセーフが仕掛けられていないことを確認するまで、トークン失効・隔離は慎重に段階化すべきである。

### 2.5 MITRE ATT&CK マッピング

| 戦術 | 技術 (ID) | 本キャンペーンでの適用 |
| --- | --- | --- |
| Initial Access | Supply Chain Compromise (T1195.002) | 汚染された npm/PyPI パッケージの配布 |
| Execution | npm preinstall hook / `__init__.py` インジェクション | インストール時の自動ペイロード実行 |
| Credential Access | Steal Application Access Token (T1528) | ランナーメモリからの OIDC トークン抽出・交換 |
| Persistence | Scheduled Task/Daemon (T1543) | `gh-token-monitor`（LaunchAgent/systemd） |
| Exfiltration | Exfil over Web Service (T1567) | GitHub デッドドロップ · Session メッセンジャー · タイポスクワットドメイン |
| Impact | Data Destruction (T1485) | トークン失効時の `rm -rf ~/` ワイパー |
| Propagation | Lateral Tool Transfer（ワーム） | 被害者が公開権限を持つパッケージを全て再公開 |

### 2.6 侵害指標 (IoC) とハンティング

- 窃取チャネル / C2：`git-tanstack[.]com`（タイポスクワット）、`filev2.getsession.org`、`api.masscan.cloud`、`git-tanstack.com` でホストされる `transformers.pyz` ドロッパー。
- 露出ウィンドウ：`2026-05-11T19:20Z` 以降の CI 実行を監査。予期しない npm publish イベント、および上記ドメインへのアウトバウンド接続を点検。
- `npm token list` で未確認トークンを失効させる。ただし、**有効な SLSA 来歴証明は安全性の証拠ではない** ── ペイロードの SHA-256 ハッシュで照合すること。
- 下流への伝播を点検：露出ウィンドウ中に CI から公開された自社パッケージがあれば、当該バージョンも汚染されている可能性がある。組織の GitHub で疑わしいリポジトリ・ワークフロー変更をハンティング。

---

## 3. 韓国の観点と統合的な提言

### 3.1 韓国エコシステムの露出

| 対象 | 露出の様態 |
| --- | --- |
| **Webホスティング・リセラー** | cPanel/WHM + LiteSpeed の組み合わせを使用する国内の中小ホスティング・リセラーが多数。共有サーバー1台の侵害で入居顧客に連鎖被害（脅威 ①） |
| **開発会社・スタートアップ** | npm/PyPI 依存と GitHub Actions CI/CD を広範に使用。OIDC 信頼の誤設定で自己増殖型ワームに露出（脅威 ②） |
| **Web3・フィンテック** | フロントエンド・ウォレット SDK が npm サプライチェーンに依存。ビルドパイプラインの汚染がユーザー資産リスクへ直結 |
| **公共・金融** | 外注開発・パッケージ再利用の慣行上、間接的なサプライチェーン露出。KISA・金融保安院の勧告のモニタリングが必要 |

### 3.2 統合的な優先提言

| # | 対応 | 対象の脅威 |
| --- | --- | --- |
| **1** | **LiteSpeed cPanel プラグインを v2.4.7+ へ即時アップグレード、またはユーザー側プラグインを削除** | **① 即時** |
| **2** | redisAble ログの grep 点検と共有サーバー侵害のハンティング | ① 24h |
| **3** | GitHub Actions OIDC 信頼範囲を最小化（ワークフロー・ブランチに限定）、フォーク PR のキャッシュ書き込みを遮断 | ② Zero Trust |
| **4** | 依存関係のピン留め・ロックファイル検証、SHA-256 ハッシュ照合（SLSA 来歴証明を盲信しない） | ② サプライチェーン |
| **5** | ワイパーのリスクを認識：トークン失効・隔離を慎重に段階化し、バックアップを先に確保してから対応 | ② IR 手順 |
| **6** | CI/CD 認証情報を特権トークンとして扱う ── スコープ限定・定期ローテーション・公開イベントの監査ログ | ①② 共通 |

### 3.3 総括 — 「権限と信頼の悪用」という共通構造

2つの脅威は表面的には無関係だが、同一の構造を共有している。CVE-2026-48172 は「すべてのユーザーに既定で公開された権限」を、Mini Shai-Hulud は「自動化パイプラインに付与された信頼（OIDC）」を、それぞれ正規の手段で悪用する。いずれも従来の意味での「侵入」や「パスワード窃取」には依存していない。

したがって防御の核心は、認証情報のローテーションを超えた信頼境界の再設計にある。最小権限の原則（NIST SP 800-207 Zero Trust）、既定で公開される権限の縮小、自動化の信頼の明示的なスコーピング、そして来歴証明・署名だけで安全と断定しない検証態勢が、両方の脅威に対する根本的な対策となる。

---

## 付録 A. 参考資料 (References)

1. **The Hacker News.** *"LiteSpeed cPanel Plugin CVE-2026-48172 Exploited to Run Scripts as Root."* <https://thehackernews.com/2026/05/litespeed-cpanel-plugin-cve-2026-48172.html>
2. **GBHackers.** *"LiteSpeed cPanel Plugin 0-Day Exploited for Server Root Access."* <https://gbhackers.com/litespeed-cpanel-plugin-0-day-exploited/>
3. **Cyber Security News.** *"LiteSpeed cPanel Plugin 0-Day Exploited in the wild."* <https://cybersecuritynews.com/litespeed-cpanel-plugin-0-day-exploited/>
4. **Unit 42 (Palo Alto).** *"The npm Threat Landscape: Attack Surface and Mitigations (Updated May 21)."* <https://unit42.paloaltonetworks.com/monitoring-npm-supply-chain-attacks/>
5. **Akamai.** *"Mini Shai-Hulud: The Worm Returns and Goes Public."* <https://www.akamai.com/blog/security-research/mini-shai-hulud-worm-returns-goes-public>
6. **Wiz.** *"Mini Shai-Hulud Strikes Again: TanStack + more npm Packages Compromised."* <https://www.wiz.io/blog/mini-shai-hulud-strikes-again-tanstack-more-npm-packages-compromised>
7. **StepSecurity.** *"TeamPCP's Mini Shai-Hulud Is Back."* <https://www.stepsecurity.io/blog/mini-shai-hulud-is-back-a-self-spreading-supply-chain-attack-hits-the-npm-ecosystem>
8. **Snyk.** *"TanStack npm Packages Hit by Mini Shai-Hulud."* <https://snyk.io/blog/tanstack-npm-packages-compromised/>
9. **SecurityWeek.** *"Bitwarden NPM Package Hit in Supply Chain Attack."* <https://www.securityweek.com/bitwarden-npm-package-hit-in-supply-chain-attack/>
10. **Tenable.** *"Mini Shai-Hulud Supply Chain Attack CVE-2026-45321 FAQ."* <https://www.tenable.com/blog/mini-shai-hulud-frequently-asked-questions>

---

## 付録 B. 免責事項 (Disclaimer)

1. 本レポートは公開された OSINT 資料および報道・ベンダーのセキュリティ勧告に基づく独立した分析であり、関連する組織・機関・企業の公式見解を代表するものではない。
2. 内容は教育・防御・研究・政策立案の目的のみに使用されるべきであり、攻撃・侵害・違法行為への使用を厳に禁止する。
3. IoC・脆弱性情報は発行時点（2026-05-24）のものであり、実運用前に必ず最新の状態を再確認すること。
4. 著者は本資料の直接的・間接的な使用により生じたいかなる損害についても責任を負わない。

---

**© 2026 Dennis Kim** · Cyber Threat Intelligence Division
📧 gameworker@gmail.com · 🔗 <https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT>
