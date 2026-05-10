# CTI-2026-0510-LAZARUS-GITHOOKS

## 北朝鮮 Lazarus Group の新たな隠蔽手法:`.git/hooks/` を 2 段階ローダーとして使用する Contagious Interview / TaskJacker キャンペーン
### 日本語版 — `TLP:GREEN`

---

| 項目 | 内容 |
|---|---|
| **レポート ID** | CTI-2026-0510-LAZARUS-GITHOOKS |
| **発行日** | 2026-05-10 |
| **TLP 等級** | TLP:GREEN |
| **深刻度** | 🔴 HIGH — 韓国の開発者・取引所・Web3 を直接の標的とする |
| **分類** | Threat Actor Campaign / Supply Chain via Social Engineering / Developer Targeting |
| **核心キーワード** | Lazarus Group, DPRK, Contagious Interview, TaskJacker, Famous Chollima, BeaverTail, InvisibleFerret, OtterCookie, git hooks, post-merge, post-checkout, MITRE G1052, fake recruiter |
| **原文出典** | OpenSourceMalware.com, "Lazarus Group Uses Git Hooks To Hide Malware" (2026-05) |
| **クロスチェック** | Microsoft Security Blog (2026-03)、Abstract Security (2026-03)、Cisco Talos (2025-10)、Socket (2025-06~10)、NVISO Labs (2025-11)、Malpedia G1052 |
| **関連レポート** | CTI-2026-0507-SCARCRUFT (APT37、別の DPRK クラスター) · CTI-2026-0422-MCP §3.3 (UNC1069/Sapphire Sleet サプライチェーン汚染) |
| **作成** | Dennis Kim, https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT |

---

## 1. エグゼクティブサマリー

OpenSourceMalware は 2026 年 5 月、北朝鮮 Lazarus Group(MITRE ATT&CK G1052 — Contagious Interview / Famous Chollima)が偽装求人キャンペーンの 2 段階ローダー(second-stage loader)を **`.git/hooks/` ディレクトリに隠蔽する**新たな亜種を公開した。

今回の分析の結果、北朝鮮は AI LLM を積極的に導入して検出を回避し、対象に最適な言語・プラットフォームへリアルタイムに切り替えていることが判明した。

### 主要判断 (Key Judgments)

| # | 判断 | 信頼度 |
|---|---|---|
| **KJ-1** | Lazarus は npm パッケージ → 偽 Web 会議ツール → VS Code Tasks → **git hooks** の順に配信メカニズムを進化させている。各進化は直前の亜種に対する防御側の遮断・緩和措置(2026-02 の Microsoft VS Code 1.109/1.110 パッチなど)に直接対応したものである。 | **High** |
| **KJ-2** | `.git/hooks/` は **git 自身が追跡しないため**、コードレビュー・PR diff から見えない盲点である。標的は `clone` 後に `pull`・`merge` するだけで、コードを 1 行も実行せずに侵害される。 | **High** |
| **KJ-3** | 1 次標的は**ブロックチェーン・フィンテック・防衛分野**の開発者であり、韓国は LinkedIn Korea の活動量、DAXA 加盟取引所・Web3 発行事業者の集中度、外貨決済フリーランサーの規模により、**グローバル平均より露出度が著しく高い**。 | **High** |
| **KJ-4** | 最終ペイロード(BeaverTail → InvisibleFerret)は**暗号通貨ウォレット(Solana, Exodus)、ブラウザ認証情報、macOS Keychain** の窃取に特化している。同じインフラから Bybit($14 億)、Stake($4,100 万)、CoinEx($2,700 万)などの事件が発生している。 | **High** |
| **KJ-5** | 本キャンペーンの真の脅威は単一手法ではなく、Lazarus が**開発者の警戒心が情緒的に最も下がる瞬間 — 求職過程 — を武器化している**点にある。技術的統制のみでは完全遮断は不可能であり、**開発者 OPSEC 教育と隔離環境の義務化が同等の比重を持つ統制手段**となる。 | **Medium-High** |

---

## 2. 事案の背景

### 2.1 Contagious Interview キャンペーンの進化軌跡

| 時期 | 配信メカニズム | 主要事例 | 防御側対応 |
|---|---|---|---|
| 2022 ~ 2024 | **npm パッケージ typosquatting** | `is-buffer-validator`、`yoojae-validator`、`event-handle-package`、`array-empty-validator`、`react-event-dependency`、`auth-validator` 等 | Socket・npm への通報により削除 |
| 2024 ~ 2025 H1 | **偽 Web 会議ツール** | "MiroTalk Studio" 等を装った macOS / Windows バイナリ | VirusTotal / EDR シグネチャ |
| 2025 H2 | **大規模 npm キャンペーン** | Socket: 67 パッケージ(2025-06)→ **338 パッケージ、5 万ダウンロード**(2025-10)。新型 XORIndex ローダー公開 | 自動パッケージスキャン強化 |
| 2026 Q1 | **VS Code / Cursor Tasks の悪用** | `.vscode/tasks.json` の自動実行属性悪用。C2: `hxxp://144.172.115[.]189:8080` | **Microsoft VS Code 1.109(2026-01)・1.110(2026-02)で自動 task 実行をデフォルト OFF に変更** |
| **2026 Q2(現在)** | **`.git/hooks/` への隠蔽** | OpenSourceMalware 2026-05 公開。`post-merge`、`post-checkout`、`pre-push` フックに BeaverTail ダウンローダーを挿入 | (現時点で遮断機構なし) |

各進化は直前の亜種に対する遮断措置直後に発生している。**防御側が一つの通路を塞ぐたびに、Lazarus は約 3~6 か月以内により深い場所へ移動する。**

### 2.2 脅威アクターの識別 (Attribution)

本キャンペーンは以下の名称で追跡されている:

| トラッカー | クラスター名 |
|---|---|
| **MITRE ATT&CK** | **G1052 — Contagious Interview** |
| **CrowdStrike** | Famous Chollima |
| **Microsoft** | Sapphire Sleet(関連、一部重複) |
| **Mandiant** | UNC4034 / DPRK CryptoCore(関連) |
| **Lazarus 上位グループ** | (伝統的意味の)Lazarus Group, APT38 |

⚠️ **注意**: Contagious Interview は Lazarus のすべての活動ではなく、**開発者を対象とした偽装求人作戦の専属サブクラスター**である。APT37(ScarCruft)、Kimsuky 等とは区別される。

---

## 3. 攻撃チェーン分析

### 3.1 5 段階感染フロー

```
[1] 偵察・接触  →  [2] 信頼構築  →  [3] コーディング課題配信  →  [4] git hook 発火  →  [5] 永続化バックドア
```

| 段階 | 行為 | 標的の認識 |
|---|---|---|
| **1. 偵察・接触** | LinkedIn / 求人プラットフォーム / フリーランスサイト(Upwork、Fiverr 等)で標的識別。AI 生成のプロフィール写真を使用した偽装リクルーターのペルソナで接触 | 「興味のある会社から連絡が来た」 |
| **2. 信頼構築** | 正常に見える会社ドメイン(WHOIS は通常数週間~数か月)、英文メール、多段階面接プロセスの案内 | 「正規の手続きだ」 |
| **3. コーディング課題配信** | GitHub / GitLab / Bitbucket の非公開または ZIP 形式のリポジトリ配信。表面上は平凡な React・Node・Python の課題 | 「コード自体は正常だ」 |
| **4. git hook 発火** | 標的が `git clone`、`git pull`、`git merge`、`git checkout` 等の**日常的命令**を実行した瞬間、`.git/hooks/post-merge` または `post-checkout` が silent 実行され BeaverTail がダウンロード | **無自覚** — 大半の開発者は `.git/hooks/` を覗かない |
| **5. 永続化バックドア** | BeaverTail が InvisibleFerret(Python バックドア)をインストール、認証情報・暗号通貨ウォレットを窃取 → C2 通信 → 永続的アクセス確保 | 遅延認識(数日~数週間後、資産損失で確認) |

### 3.2 なぜ `.git/hooks/` が新たな盲点なのか?

| 属性 | 説明 |
|---|---|
| **Git 追跡対象外** | `.git/hooks/` ディレクトリは `.git/` 自体と共に **git に追跡されない**。すなわち PR diff・コードレビュー・`git log` に絶対に現れない |
| **自動実行** | 標的がコードを 1 行も実行しなくても、単純な `git pull` 1 回で hook が自動発火 |
| **権限環境** | hook はユーザー権限で実行され、インターネットアクセス、ファイルシステムアクセス、子プロセス spawn がすべて可能 |
| **表面的正常性** | リポジトリ自体のコード(README、ソースファイル)は本当に正常な場合がある。SAST・静的解析を通過 |
| **開発者の盲点** | 新人~10 年以上の開発者でも `.git/hooks/` を覗く習慣がほとんどない。ツールチェーンに隠れている |

> **本質診断**: git hooks は「Git 自身が信頼境界の一部として扱われるが、ユーザーがその内部を見ない」という**信頼非対称(trust asymmetry)**を武器化した事例である。SolarWinds・XZ Utils がビルドシステムに対して行ったことを、本キャンペーンは**個人開発者のワークステーション**に対して実行する。

---

## 4. 主要マルウェア分析

### 4.1 BeaverTail(1 段階ペイロード)

| 項目 | 内容 |
|---|---|
| **言語 / プラットフォーム** | JavaScript(Node.js 環境) |
| **役割** | Infostealer + 2 段階ペイロード(InvisibleFerret)ダウンローダー |
| **標的データ** | • ブラウザ認証情報(Chrome、Brave、Firefox)<br>• 暗号通貨ウォレット(Solana CLI 鍵、Exodus、MetaMask)<br>• macOS Keychain<br>• SSH 鍵、AWS / GCP 認証情報 |
| **サンドボックス回避** | qemu・virtual・parallels・virtualbox・vmware キーワード検査 |
| **C2 通信** | 多数の IP ローテーション、HTTP POST ベースの外送 |
| **亜種** | OtterCookie(2025-10 Cisco Talos 分析、JavaScript モジュール追加) |

### 4.2 InvisibleFerret(2 段階ペイロード)

| 項目 | 内容 |
|---|---|
| **言語 / プラットフォーム** | Python(全 OS) |
| **役割** | 永続化バックドア、RAT 機能、追加ペイロード stager |
| **永続化** | • Linux: cron + systemd user unit<br>• macOS: LaunchAgent(`~/Library/LaunchAgents/`)<br>• Windows: Run キー + Scheduled Task |
| **亜種** | TsunamiKit(2025-04 HiSolutions)、GolangGhost(2025-04 Silent Push、Go 移植版) |

### 4.3 ツール系譜(2025–2026)

```
BeaverTail (JS)  ──→  InvisibleFerret (Python)  ──→  TsunamiKit (Python, 2025 Q2)
       │
       ├──→  OtterCookie (JS module, 2025-10)
       │
       └──→  GolangGhost (Go, 2025 Q2)        ──→  FrostyFerret (Go, macOS 特化)
                                                            │
                                                            └──→  XORIndex Loader (2025-10)
```

このソース分岐は Lazarus が**複数言語スタック(JS, Python, Go)に同一機能を移植**しながら EDR 検出を回避する標準運用パターンを示している。

**一行要約: AI LLM の発展により、北朝鮮も検出回避のためのリアルタイム移植が増加している。**

---

## 5. 韓国環境への影響評価

### 5.1 韓国の開発者がグローバル平均より露出度が高い理由

| 要因 | 説明 | リスク増幅 |
|---|---|---|
| **LinkedIn Korea 活動量** | 2025 年時点の韓国 LinkedIn ユーザー約 700 万人、開発者・ブロックチェーン分野が最も活発な利用グループの一つ | 1 次接触チャネルが豊富 |
| **DAXA 取引所・Web3 スタートアップ密集** | 5 大ウォン建て取引所(Upbit、Bithumb、Coinone、Korbit、Gopax)+ DAXA 加盟事業者 + 多数の Web3 発行事業者の本社がソウルに集中 | 標的価値が高い |
| **外貨決済フリーランサープール** | Upwork・Fiverr・Toptal で活動する韓国開発者人口の増加(特にフロントエンド、スマートコントラクト) | 偽装リクルーター接近が自然 |
| **AI コーディングツール導入加速** | Cursor、Claude Code、Copilot 導入企業の増加 → `.vscode/tasks.json` 亜種の露出度も同時に上昇 | 直前の亜種も依然有効 |
| **国防・防衛産業研究員の LinkedIn 活動** | KAI・LIG Nex1・Hanwha 等の協力企業開発者が LinkedIn で求人情報を公開検索 | 国家安全保障次元の脅威 |

### 5.2 シナリオ別脅威モデル

| シナリオ | 可能性 | 影響度 | 対応優先順位 |
|---|---|---|---|
| **S1.** 取引所バックオフィス開発者が偽装面接後に認証情報流出 → 取引所内部システムへの lateral movement | 非常に高 | 非常に高 | P0 |
| **S2.** Web3 発行事業者の Solidity 開発者が deploy 鍵・マルチシグシードを流出 → トークンコントラクト owner 奪取 | 非常に高 | 非常に高 | P0 |
| **S3.** フリーランス開発者が感染 → 多数のクライアントコードベースに backdoor 潜伏 | 高 | 高 | P1 |
| **S4.** 防衛協力企業の開発者感染 → 非公開兵器システムコードの一部流出 | 中~高 | 非常に高 | P0(国家安全保障) |
| **S5.** AI 企業の ML エンジニア感染 → モデル重み・学習データ流出 | 中 | 高 | P1 |

### 5.3 歴史的損失規模(Lazarus 関連)

| 事件 | 時点 | 損失規模 |
|---|---|---|
| Bybit hack | 2025 | **約 14 億ドル**(史上最大の単一取引所事件) |
| Stake.com hack | 2023 | 4,100 万ドル |
| CoinEx hack | 2023 | 2,700 万ドル |
| Atomic Wallet | 2023 | 1 億ドル+ |
| **累計推定** | 2017~2026 | **30 億ドル+**(Chainalysis) |

**Lazarus の主たる収益源が即ち北朝鮮政権の核・ミサイルプログラム資金源**であることは、米財務省・国連パネル報告書を通じて反復確認された事実である。したがって本キャンペーンの遮断は単純な保安事案ではなく、**国家安全保障・国際制裁履行事案**である。

---

## 6. IOC(Indicators of Compromise)

> ⚠️ 本 IOC は OpenSourceMalware、Microsoft、Cisco Talos、Abstract Security、Socket の公開資料からクロス抽出したものであり、リアルタイムに変化する。運用適用前に**必ず最新状態を再確認**のこと。

### 6.1 ネットワーク IOC(代表値、時点基準)

| 種別 | 値 | 出典 |
|---|---|---|
| C2 IP | `144.172.115[.]189:8080` | Abstract Security(2026-03) |
| ペイロードドメイン | `camdriver[.]pro`(macOS WebCam.zip ダウンロード) | Abstract Security(2026-03) |
| C2 パターン | HTTP POST に `excludeFolders`、`scanDir` キーワードを伴う | Microsoft(2026-03) |

### 6.2 ホスト IOC(行為ベース)

| インジケーター | 説明 |
|---|---|
| `.git/hooks/post-merge`、`post-checkout`、`pre-push` に base64 エンコードペイロードまたは `curl` / `wget` ダウンロード呼び出し | git hook 亜種 |
| `~/Library/LaunchAgents/` に新規 plist 作成 | macOS 永続化 |
| `~/.config/autostart/` に新規 `.desktop` ファイル | Linux 永続化 |
| Windows `HKCU\Software\Microsoft\Windows\CurrentVersion\Run` に新規エントリ | Windows 永続化 |
| `node` プロセスのコマンドラインに `qemu`、`vmware`、`parallels` キーワード含有 | BeaverTail サンドボックス回避 |
| `wscript.exe` が PowerShell・CMD・temp ディレクトリから `.vbs` を実行 | OtterCookie 亜種 |
| 疑わしいファイル名: `WebCam.zip`、`WebCam/`、`update.dmg`、`MiroTalk*.zip` | 偽装 Web 会議ツール亜種 |

### 6.3 行為 IOC(開発者ワークステーション ハンティング)

| パターン | 疑わしいシグナル |
|---|---|
| `git pull` または `git merge` 直後 1~10 秒以内に外部ドメインへの outbound | hook 発火の可能性 |
| Node.js プロセスが `clipboard` + `socket.io` + `axios` モジュールを同時インポート | BeaverTail ペイロードシグネチャ |
| Python が `requests` + `subprocess` + `base64` で外部呼び出し直後に子プロセス spawn | InvisibleFerret パターン |

---

## 7. 検出ルール / ハンティングクエリ

### 7.1 Microsoft Defender XDR(KQL — Microsoft 公開ルールベース、2026-03)

```kql
DeviceProcessEvents
| where (
    (InitiatingProcessCommandLine has_all ("axios", "const uid", "socket.io")
        and InitiatingProcessCommandLine contains "clipboard") or
    (InitiatingProcessCommandLine has_all ("excludeFolders", "scanDir", "curl ", "POST")) or
    (ProcessCommandLine has_all ("*bitcoin*", "credential", "*recovery*", "curl ")) or
    (ProcessCommandLine has_all ("node", "qemu", "virtual", "parallels", "virtualbox", "vmware", "makelog")) or
    (ProcessCommandLine has_all ("http", "execSync", "userInfo", "windowsHide")
        and ProcessCommandLine has_any ("socket", "platform", "release", "hostname", "scanDir", "upload"))
)
```

### 7.2 git hooks 専用ハンティング(カスタム)

#### 7.2.1 macOS / Linux(bash)
```bash
# ユーザー home 配下のすべての .git/hooks ディレクトリで疑わしいパターンを検索
find "$HOME" -type d -name "hooks" -path "*/.git/*" 2>/dev/null \
  | while read dir; do
      grep -lE "curl |wget |base64 -d|eval |\$\(.*http" "$dir"/* 2>/dev/null
    done
```

#### 7.2.2 osquery
```sql
SELECT path, sha256, mtime
FROM file
WHERE path LIKE '%/.git/hooks/%'
  AND filename IN ('post-merge', 'post-checkout', 'pre-push', 'post-rewrite', 'pre-commit')
  AND size > 100;
```

#### 7.2.3 Splunk
```spl
index=endpoint sourcetype=osquery
  path="*.git/hooks/*"
  filename IN ("post-merge","post-checkout","pre-push")
| search content="*curl *" OR content="*base64 *" OR content="*wget *"
| stats count by host, path
```

### 7.3 SIEM 相関ルール推奨

```
RULE: Contagious Interview Git Hook Trigger
WHEN:
  - process = git (clone|pull|merge|checkout)
  AND followed by within 30 seconds:
    - outbound HTTP/HTTPS to non-organization domain
    - by user-context process (not system)
THRESHOLD: 1 occurrence on developer workstation
ACTION: Alert + auto-quarantine cloned directory
```

---

## 8. 防御推奨事項

### 8.1 個人開発者(Individual)

| # | 措置 | コマンド / 設定 |
|---|---|---|
| 1 | **clone 直後の hooks 検査の習慣化** | `ls -la .git/hooks/` 後 `cat post-merge post-checkout pre-push 2>/dev/null` |
| 2 | **グローバル hook パスの無効化** | `mkdir -p ~/.config/git/hooks && git config --global core.hooksPath ~/.config/git/hooks` |
| 3 | **隔離環境でのみ評価コードを実行** | `docker run --rm -it --network none ubuntu:24.04 bash`(ネットワーク遮断コンテナ) |
| 4 | **npm 自動スクリプト遮断** | `npm config set ignore-scripts true`(グローバルデフォルト) |
| 5 | **pip 依存性隔離** | `pip install --no-deps <pkg>` または `pipx`・`venv` の強制 |
| 6 | **リクルーター・会社検証 5 分ルール** | WHOIS ドメイン登録日、LinkedIn 従業員履歴、求人広告と会社公式サイトの一致性 |
| 7 | **ハードウェアキー(YubiKey 等)依存** | 認証情報窃取されても 2FA バイパス不可 |
| 8 | **暗号通貨シードはワークステーションから永続的に分離** | コールドウォレット(Ledger、Trezor)のみ使用、hot key は一時取引用に限定 |

### 8.2 組織(Enterprise)

| # | 措置 | 担当部署 |
|---|---|---|
| 1 | 全社 Git クライアントポリシー: `core.hooksPath` のデフォルト値を会社管理ディレクトリに強制(MDM・ドメインポリシー) | IT / SecOps |
| 2 | 開発者ワークステーションを**単一用途 BYOD 分離** — 会社資産と個人 freelance 活動の分離を義務化 | HR + IT |
| 3 | EDR ポリシーに本レポート §7 の KQL・osquery ルールを配布 | SecOps |
| 4 | 新入開発者 OPSEC 教育モジュール義務化 — Contagious Interview・SCARCRUFT・MCP 亜種統合教育 | InfoSec / HR |
| 5 | DAXA 取引所・Web3 発行事業者: **deploy 鍵・マルチシグシード保管ワークステーションを一般開発環境と物理的・論理的に完全分離(HSM または air-gap)** | CISO / Treasury |
| 6 | 社内 GitLab / GitHub Enterprise: 外部から取得した ZIP・tarball の自動スキャン(`.git/hooks/` 内容検査ルール含む) | DevSecOps |

### 8.3 韓国の取引所・Web3 特化推奨事項

| 領域 | 推奨 |
|---|---|
| **DAXA レベル** | 加盟事業者のセキュリティ点検項目に「開発者ワークステーションの `.git/hooks/` 検査」義務項目追加検討 |
| **取引所ホットウォレット運用** | マルチシグ署名ワークステーションは**インターネット遮断**、USB 遮断、別途キーチェーン必須 |
| **Web3 発行事業者** | スマートコントラクト deploy 鍵は別途 air-gap マシンでのみ使用。一般開発用 LinkedIn 活動マシンと絶対に共有禁止 |
| **フリーランサー採用時** | 外部フリーランサーの身元検証プロセス強化。コード PR 受領前に隔離環境で 1 次実行・検証する段階を義務化 |
| **新入社員 / 面接段階** | 入社前のセキュリティブリーフィングに「あなたを狙う偽装リクルーターが LinkedIn にいるかもしれない」という警告を含める |

### 8.4 政策・制度推奨事項

1. **KISA・NIS・KoFIU 共同警報発令検討** — 取引所・Web3・金融分野開発者対象の定期キャンペーン。
2. **DAXA 自主規制ガイドラインの更新** — 取引所上場(listing)審査項目に「発行事業者の deploy 鍵管理環境分離の有無」を追加。
3. **国防・防衛産業協力企業 LinkedIn 活動ガイド** — セキュリティクリアランス保有開発者の外部求人プラットフォーム活用に関する明示的ポリシー。
4. **LinkedIn 韓国支社協力** — DPRK 推定の偽装リクルーターのプロフィール通報チャネル強化と先行的 takedown。

---

## 9. MITRE ATT&CK マッピング

| Tactic | Technique | ID | 本キャンペーンでの適用 |
|---|---|---|---|
| Reconnaissance | Gather Victim Identity Information | T1589 | LinkedIn プロフィールスクレイピング、求人情報収集 |
| Resource Development | Establish Accounts | T1585 | 偽装リクルーター・偽装会社 LinkedIn アカウント |
| Resource Development | Acquire Infrastructure: Domains | T1583.001 | 新規会社ドメイン登録(数週間~数か月) |
| Initial Access | Phishing: Spearphishing via Service | T1566.003 | LinkedIn DM・メール経由の求人偽装 |
| Initial Access | Trusted Relationship | T1199 | 求人プロセスの信頼関係悪用 |
| Execution | User Execution: Malicious File | T1204.002 | 標的が直接 `git clone` 後に日常コマンド実行 |
| Execution | **Event Triggered Execution: Component Object Model Hijacking → Git Hooks(変形)** | T1546(クラスター) | **本キャンペーンの核心新規手法** |
| Persistence | Boot or Logon Autostart Execution | T1547 | LaunchAgent / Run キー / cron |
| Defense Evasion | Hide Artifacts: Hidden Files and Directories | T1564.001 | `.git/hooks/` は通常の GUI で非表示 |
| Defense Evasion | Virtualization/Sandbox Evasion | T1497 | qemu・vmware キーワード検査 |
| Credential Access | Credentials from Password Stores: Credentials from Web Browsers | T1555.003 | Chrome・Brave・Firefox 認証情報 |
| Credential Access | Credentials from Password Stores: Keychain | T1555.001 | macOS Keychain |
| Collection | Data from Local System | T1005 | 暗号通貨ウォレット・SSH 鍵 |
| Command and Control | Application Layer Protocol: Web Protocols | T1071.001 | HTTP POST 外送 |
| Exfiltration | Exfiltration Over C2 Channel | T1041 | C2 IP またはドメイン |

**MITRE Group ID**: **G1052(Contagious Interview)** — `https://attack.mitre.org/groups/G1052`

---

## 10. 結論(Bottom Line)

### 10.1 一行要約

> **Lazarus は npm を塞がれたら Web 会議ツールへ、Web 会議を塞がれたら VS Code Tasks へ、VS Code Tasks が塞がれたら git hooks へ移った。次の進化は 6 か月以内に来る。**

### 10.2 本キャンペーンが韓国のセキュリティ環境に投げかける 3 つの問い

1. **開発者の警戒心が最も下がる瞬間は求職過程である。我々の組織はその瞬間を保護しているか?**
2. **`.git/hooks/` が盲点であったように、我々のワークステーションにはコードレビューが届かない他の盲点がどこにまだあるのか?**(次の標的は `.gitattributes` filter? `.npmrc` `prepare`? `.devcontainer/`? `Makefile`?)
3. **Lazarus が狙うのは単一開発者 1 名のマシンではなく、その人物を入口とした韓国の取引所・Web3 発行事業者・防衛協力企業の資産である。我々は 1 人の開発者を失った時の blast radius を測定したことがあるか?**

### 10.3 単一強力推奨(One Mandatory Action)

**今日からすべての開発者ワークステーションで以下の一行を実行せよ:**

```bash
mkdir -p ~/.config/git/hooks && git config --global core.hooksPath ~/.config/git/hooks
```

この一行が本キャンペーンの git hooks 亜種を**個人レベルで即座に無効化**する。コスト 0 円、時間 30 秒。組織レベルでは MDM・ドメインポリシーで強制配布が可能。

---

## 11. 参考資料

| # | 出典 | 発行 | 備考 |
|---|---|---|---|
| 1 | OpenSourceMalware.com, "Lazarus Group Uses Git Hooks To Hide Malware" | 2026-05 | 本レポートの 1 次分析対象 |
| 2 | Matteo Bisi, "Lazarus Group Hides Malware in Git Hooks to Target Developers"(msbiro.net) | 2026-05-06 | 2 次解説 |
| 3 | Microsoft Security Blog, "Contagious Interview: Malware delivered through fake developer job interviews" | 2026-03-11 | KQL ルール提供 |
| 4 | Abstract Security, "Contagious Interview: Evolution of VS Code and Cursor Tasks Infection Chains Part 2" | 2026-03 | C2 IP 公開 |
| 5 | OpenSourceMalware, "Contagious Interview campaign abuses Microsoft VSCode tasks" | 2025-11-28 | 直前の亜種 |
| 6 | NVISO Labs, "Contagious Interview Actors Now Utilize JSON Storage Services for Malware Delivery" | 2025-11-13 | ツール系譜 |
| 7 | Cisco Talos, "BeaverTail and OtterCookie evolve with a new Javascript module" | 2025-10-16 | ツール分析 |
| 8 | Socket, "North Korea's Contagious Interview Campaign Escalates: 338 Malicious npm Packages, 50,000 Downloads" | 2025-10-10 | 規模 |
| 9 | Socket, "Another Wave: 35 New Malicious npm Packages" | 2025-06-24 | npm 進化 |
| 10 | ANY.RUN, "OtterCookie: Analysis of Lazarus Group Malware Targeting Finance and Tech Professionals" | 2025-06-03 | 標的分析 |
| 11 | ESET Research, "ESET APT Activity Report Q4 2024–Q1 2025" | 2025-05-12 | グループ活動 |
| 12 | NTT Security, "Additional Features of OtterCookie Malware Used by WaterPlum" | 2025-05-07 | 亜種分析 |
| 13 | HiSolutions, "Rolling in the Deep(Web): Lazarus Tsunami" | 2025-04-25 | TsunamiKit |
| 14 | Silent Push, "Contagious Interview Launches a New Campaign Creating Three Front Companies" | 2025-04-24 | インフラ |
| 15 | MITRE ATT&CK, Group G1052 | 継続的に更新 | 標準トラッカー |
| 16 | Malpedia, py.invisibleferret | 継続的に更新 | ツールカタログ |

---

**End of Report — CTI-2026-0510-LAZARUS-GITHOOKS — TLP:GREEN**

*2026-05-10*
*© 2026 Dennis Kim (김호광) · gameworker@gmail.com · https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT*
