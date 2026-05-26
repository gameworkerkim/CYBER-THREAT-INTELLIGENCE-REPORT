# CTI-2026-0526-KIMSUKY-PEBBLEDASH

**Kimsuky（APT43）の新規 PebbleDash・AppleSeed ツールセット分析**

> Rust製バックドアの登場、VSCode・Cloudflareトンネリングの悪用、そしてLLM生成コードの痕跡

**🌐 Language:** [한국어](CTI-2026-0526-KIMSUKY-PEBBLEDASH.md) · [English](CTI-2026-0526-KIMSUKY-PEBBLEDASH_EN.md) · **日本語** · [中文](CTI-2026-0526-KIMSUKY-PEBBLEDASH_CN.md)

![TLP](https://img.shields.io/badge/TLP-CLEAR-brightgreen) ![Actor](https://img.shields.io/badge/Actor-Kimsuky%20(APT43)-red) ![Attribution](https://img.shields.io/badge/Attribution-DPRK-blue) ![Confidence](https://img.shields.io/badge/Confidence-Medium--High-orange)

---

| 項目 | 内容 |
| --- | --- |
| **文書分類** | TLP:CLEAR — 公開配布可 / 公開情報ベースの分析 |
| **脅威アクター** | Kimsuky（APT43, Ruby Sleet, Black Banshee, Sparkling Pisces, Velvet Chollima, Springtail） |
| **帰属国家** | 北朝鮮（DPRK）— 偵察総局（RGB）傘下と評価 |
| **主な標的** | 韓国の官民部門（政府・国防・医療・機械・エネルギー）、一部ブラジル・ドイツの国防 |
| **作成日** | 2026年5月26日 |
| **作成者** | Dennis Kim、Betalabs Inc. / 独立CTIアナリスト |
| **一次情報源** | Kaspersky GReAT（Securelist, 2026-05-14） |
| **信頼度** | 帰属：中〜高（Medium-High）/ 技術分析：高（High） |

---

## 1. エグゼクティブサマリー

2026年5月14日、Kaspersky GReATは北朝鮮系の脅威アクター **Kimsuky（APT43）** による最近のキャンペーン分析を公開した。本CTIはその一次分析を韓国の防御者視点で再構成し、**PebbleDash と AppleSeed** という二つのマルウェアクラスタの新変種と戦術変化を整理する。

要点は単なる新規マルウェアの出現ではなく、**攻撃ツールの質的進化**である。Kimsukyはこれまでほとんど使わなかった **Rust言語** で初のバックドア（HelloDoor）を作成し、正規ツールである **VSCodeリモートトンネリング** と **Cloudflare Quick Tunnel** をC2秘匿に悪用し、何より **マルウェアコード内部にLLMが生成したと見られる痕跡** が確認された。

### 主な発見事項

- 初期侵入は文書に偽装した添付ファイル（`.JSE`/`.PIF`/`.SCR`/`.EXE`）を伴う精巧な **スピアフィッシング** とメッセンジャー経由のアプローチで行われる。
- ドロッパーが配送するマルウェアは **PebbleDashクラスタ**（HelloDoor, httpMalice, MemLoad→httpTroy）と **AppleSeedクラスタ**（AppleSeed, HappyDoor）に二分される。
- **HelloDoor** はKimsuky初のRust製DLLバックドアで、開発初期段階と評価され、LLM生成コードの痕跡（絵文字デバッグログ）が確認された。
- AppleSeedクラスタは韓国政府の公的認証ディレクトリ `C:\GPKI` の窃取をシグネチャ機能として確立 — データ流出へ重心を移行。
- PebbleDashクラスタは **国防・軍部門** に集中し、韓国以外にブラジル・ドイツの国防機関まで標的を拡大。
- ポストエクスプロイトに正規ツール **VSCode** と **DWAgent** を悪用 — 従来型C2検知の回避が目的。

### 脅威スナップショット

| 新規性 | 標的適合性（韓国） | 検知難易度 |
| --- | --- | --- |
| 高 — Rust・LLM・トンネリング導入 | 非常に高 — EUC-KR・GPKI・韓国ホスティング | 高 — 正規ツール・トンネリングによるLotL |

---

## 2. 背景 — Kimsukyと二つのマルウェアクラスタ

Kimsukyは2013年にKasperskyが初めて特定した韓国語を話すAPTグループで、10年以上活動している。他の北朝鮮系グループに比べ技術的洗練度は相対的に低いと評価されるが、**標的に合わせたスピアフィッシングの作成能力** に優れる。

注目すべきは、**PebbleDashが本来Lazarus Groupのプラットフォーム** だった点であり、Kimsukyは少なくとも2021年からこれを流用し独自変種を派生させ続けている。

| 区分 | PebbleDashクラスタ | AppleSeedクラスタ |
| --- | --- | --- |
| **初確認** | Lazarus起源 → 2021年からKimsuky専用 | 2019年（現在v2.1） |
| **主な標的** | 国防・軍・医療（全世界、ブラジル・ドイツ含む） | 政府機関（主に韓国） |
| **中核能力** | 高度なリモート制御バックドア | 情報窃取（文書・スクショ・キーロギング・GPKI） |
| **配送形式** | JSE/EXE/SCR/PIFドロッパー | 主にJSEドロッパー |

両クラスタは配送方式が重複し標的も収束しつつあり、**同一の窃取証明書で署名され同一のミューテックスパターンを共有** する。Kasperskyは単一アクターが両クラスタを統制していると **中〜高（Medium-High）** の信頼度で評価する。

---

## 3. 脅威アクタープロファイル — Kimsuky

### 3.1 組織概要と別名

Kimsukyは北朝鮮の **偵察総局（RGB）傘下** と見られる国家支援のハッキング組織である。2012年頃に韓国・米国などへのサイバー攻撃を目的に組織されたとされ、大型単発事件で知られるLazarus（ソニー・ピクチャーズ）やBlueNoroff（バングラデシュ中央銀行）とは異なり、**毎日のように静かに継続する諜報型攻撃** が特徴である。

名前の由来も興味深い。2013年にKasperskyが北朝鮮ハッカーのメールアカウントから取った **「Kimsukyang」** という報告書を公開し、末尾の「ang」を取り除いて「Kimsuky」と略したのが現在の名称の起源である。簡単に言えばKimsukyは **「偵察総局が運営する国家サイバー諜報部隊」** であり、武器ではなくキーボードで情報を盗む軍隊である。

| ベンダー | 名称 |
| --- | --- |
| **Mandiant** | APT43 |
| **Microsoft** | Emerald Sleet（旧THALLIUM） |
| **CrowdStrike** | Velvet Chollima |
| **その他** | Black Banshee, Archipelago, Sparkling Pisces, Springtail, Ruby Sleet など |

### 3.2 標的と戦略的目的

Kimsukyの収集優先順位はRGBの任務、すなわち **北朝鮮の外交・安保・核戦略を支える情報の獲得** に沿っている。政府機関、外交・安保系シンクタンク、防衛産業、学術機関に加え、政治家・ジャーナリスト・人権活動家・脱北者などの個人も狙う。

- **2020年10月以前：** 朝鮮半島の外交・安保政策に関わる政府・外交機関・シンクタンクに集中。
- **2020.10〜2021.10：** COVID-19対応関連の医療・製薬分野へ一時的に転換。
- **資金調達：** 窃取した個人情報・計算資源で暗号資産のマイニング・洗浄にも関与。

中核兵器は **カスタム化されたソーシャルエンジニアリングと精巧なマルウェアフレームワークの組み合わせ** である。

### 3.3 主要インシデント沿革

| 時期 | インシデント | 内容・意味 |
| --- | --- | --- |
| 2013 | 大統領府・政府なりすまし悪性メール | HWP脆弱性悪用、以後の攻撃の原型 |
| **2014** | **韓国水力原子力（KHNP）ハッキング** | 原発図面流出・稼働停止脅迫、組織名を世間に刻む |
| 2016 | 大統領府・統一部・外交部なりすましメール | 第4回核実験・THAAD関連、KHNPと同一アカウント |
| 2021 | 原子力研究院・KAI・大宇造船・ソウル大病院 | 原子力・防衛・宇宙・医療の中核技術を標的 |
| **2021.04** | **中央選挙管理委員会PC侵害** | 部外秘文書流出、2023年の合同点検で後に判明 |
| 2022.12 | テ・ヨンホ議員室なりすましフィッシング | 国防・外交・統一専門家を標的、記者なりすまし |
| 2023 | 米韓合同演習連動攻撃 / stake.com | イーサリアム約4.1億ドル窃取 |
| 2024 | SBS記者・延世大教授・統一部なりすまし | 日本外務省・北朝鮮人権大使なりすまし等の多国籍 |
| 2025 | ソウル市民アカウント悪用 / KT・LG U+疑惑 | 健康診断書・銀行なりすましメール、通信社侵害関与 |
| 2026.01 | 悪性QRコードフィッシング（クイッシング） | FBI警報 — パスワード・指紋等を窃取 |

### 3.4 この組織はどれほど危険か？

Kimsukyが危険なのは単発の「大事件」ではなく、**国家レベルの諜報を10年以上止めずに遂行している** からである。銀行を襲って見出しを飾るLazarusとは異なり、静かに情報を盗む「影」型組織であるがゆえに一般にはほとんど知られていない。だがその標的と影響力は決して軽くない。

- **🛡️ 国家安全保障に直結：** 原発（KHNP）・原子力研究院・防衛（KAI）・宇宙技術を狙い、北朝鮮の兵器・衛星開発に直間接的に寄与。
- **🗳️ 民主主義基盤の侵害：** 2021年の中央選管PC感染、部外秘文書流出が2023年に初めて判明 — 隠密性と長期潜伏。
- **🎭 個人を狙う精密ソーシャルエンジニアリング：** 記者・教授・外交官のなりすまし、報道機関サイトの複製、メールアドレスを1文字だけ変える手口。専門家でも識別困難な新種マルウェアを使用。
- **🌍 国境を越える標的：** 韓国のみならず米・英・日の政府・研究機関・報道機関。自由アジア放送・日本外務省のなりすまし。
- **💰 資金調達型攻撃の並行：** 情報窃取に加えstake.com約4.1億ドルの暗号資産窃取など、制裁回避と政権の資金源。
- **🔄 絶え間ない進化：** COVID-19期はワクチン情報、2026年はQRコードフィッシングと、社会的話題と技術トレンドに即座に乗り換える。

> **⚠ 要点**
> Kimsukyの真の脅威は「派手さ」ではなく **持続性・隠密性・標的の精密さ** である。政府・研究機関・報道・専門家個人の誰もが標的となり得、たった一度の不注意なクリックが国家機密の流出につながり得る。本報告書のPebbleDash・AppleSeedキャンペーンは、この古い脅威が **Rust・AI・トンネリングでより精巧になった2026年の姿** である。

### 3.5 制裁と国際的対応の動向

- **2023.06：** 韓国政府が **世界で初めてKimsukyを対北独自制裁対象に指定**。米韓合同セキュリティ勧告を発令。
- **2024.05：** 米国政府がKimsuky勧告を追加発令。
- **2026.01：** FBIが悪性QRコードのスピアフィッシングについて緊急警報。
- **学界・業界：** Kaspersky、Genians、ESTsecurity、高麗大学情報保護大学院などが継続的に追跡。

> **▶ 本報告書との関連：** 上記沿革に表れる一貫したパターン（韓国の政府・国防・医療・学術を標的、韓国語ソーシャルエンジニアリング、HWP/文書偽装、韓国インフラの活用）は、本報告書の **PebbleDash・AppleSeedキャンペーン（2025〜2026）でそのまま再現** される。ツールは新しいが、作戦論理は10年以上続くKimsukyの延長線上にある。

---

## 4. 初期侵入（Initial Access）

Kimsukyは受信者が添付ファイルを開くよう精巧に作成したスピアフィッシングメールを送付し、時にメッセンジャーで直接接触する。添付は主に **ドロッパーを含む圧縮ファイル** で、見積書・求人・案内文・アンケート・政府文書などに偽装する。

| # | ファイル名（偽装テーマ） | 検知日 | 配送マルウェア |
| --- | --- | --- | --- |
| 1 | [別紙第8号書式] 個人情報要求書（個人情報保護法施行規則）.hwp.jse | 2025-08-28 | HelloDoor |
| 2 | 2026年上半期 国内大学院 修士夜間課程 委託教育生 選抜書類.hwpx.jse | 2025-12-14 | httpMalice |
| 3 | security_20260126.scr | 2026-01-26 | Reger Dropper → MemLoad → httpTroy |
| 4 | ノ・ヒョンジョン様.pdf.jse | 2026-01-28 | AppleSeed chain |
| 5 | 対国民サービス管理運営体系 現場点検 証跡（草案）.pif | 2026-02-05 | Pidoc Dropper → HappyDoor |

注目すべきは、おとりのファイル名が **実際の韓国の公共行政・教育・個人情報行政文書を精密に模倣** している点である。高度なハッキング技術よりも **韓国社会への理解に基づくソーシャルエンジニアリング侵入** が主な手法である。

### 4.1 ドロッパー実行メカニズム

- **JSEドロッパー：** Base64ブロブ（おとり＋ペイロード）をJScriptでデコードし、`C:\ProgramData` にランダム名で保存。`powershell.exe -windowstyle hidden certutil -decode` で二次デコード後、`regsvr32.exe /s` または `rundll32.exe` で実行。
- **Reger Dropper (.SCR)：** ハードコードXORキー `#RsfsetraW#@EsfesgsgAJOPj4eml;` を使用。
- **Pidoc Dropper (.PIF)：** 単一バイトXOR（`0xFF`）、ダミーデータ・暗号化文字列で完全難読化。

---

## 5. 新規マルウェア詳細分析

### 5.1 HelloDoor — Kimsuky初のRust製バックドア

2025年8月に初確認された **Rust製DLLバックドア** で、Kimsukyがほとんど使わない言語である点が最も注目される。機能が限定的で通信構造も単純なため **開発初期段階** と評価される。

| 項目 | 内容 |
| --- | --- |
| **永続化** | `HKCU\...\Run` キーに値名 `tdll` を登録 |
| **C2通信** | HTTP / TryCloudflare一時トンネル（追跡困難） |
| **トークン別ポート** | 権限昇格時 `5555`、非昇格時 `5554` |
| **暗号化** | Base64デコード後RC4（キー：`fwr3errsettwererfs`） |
| **クエリ形式** | `aaaaaaaaaa=2&bbbbbbbbbb=[UID]&cccccccccc=1` |

> **⚠ LLM生成コードの痕跡**
> 人間のプログラマーよりLLMが生成したと見られる絵文字デバッグログ（✅ ポートリスニング、❌ ポート使用中、🔍 regsvr32親プロセス検知）が発見された。同時に `result send fail`、`decrytion failed`、`autorum failed` といった誤字も残っており、AI生成後に人間が手動編集した痕跡と解釈される。KasperskyはBlueNoroffのPowerShellスティーラーでも類似の痕跡を観測している。

### 5.2 httpMalice — 最新PebbleDashバックドア変種

2025年12月頃に登場した最新のPebbleDash系バックドア。**v1.9はHTTP/HTTPS**、旧版 **v1.8はDropbox API** をC2に使用する。

- 権限別の永続化分岐：昇格時は `CacheDB` サービス（表示名Administrator）、非昇格時は `HKCU\...\Run` に `Everything 1.9a-[filesize]`。
- ホストプロファイリングに `chcp 949`（EUC-KR）を使用 → **韓国語ユーザーが標的であることを明確に示唆**。
- データは **ChaCha20** 暗号化後Base64。キー・ノンスをバッファポインタアドレスから導出。
- UID：`[volume serial]{8}_[elevation status]`。`m=` パラメータベースの13種モードを運用。

両クラスタの特性を併せ持つ（高完全性SID `S-1-12-12288` 実行＝PebbleDash、`m=` パラメータ・PowerShell収集＝AppleSeed）ことから、両クラスタが単一アクターに統制されていることが再確認される。

### 5.3 MemLoad → httpTroy チェーン

MemLoadは検知回避用ローダーで、アンチVMチェックと偵察で標的価値を評価した後にのみ最終バックドアを **メモリにリフレクティブロード** する。V2（2025.3）・V3（2025.9）が観測され、本年の変種はV3の小改修版。

- 永続化：昇格時 `ChromeCheck`、非昇格時 `EdgeCheck`（1分周期でregsvr32）。
- ID：`system32` 書き込み可否で `A-`（管理者）/`U-`（一般）を付与。
- RC4キー `#RsfsetraW#@EsfesgsgAJOPj4eml;`（Reger Dropperと同一）で復号後、`hello` エクスポートを呼び出し。

最終ペイロードは長期アクセス・データ流出用の **httpTroy**。ADS `[path]:HUI` にフラグファイルを作成し、C2は `file.bigcloud.n-e[.]kr`。

### 5.4 AppleSeedクラスタ — GPKI証明書窃取のシグネチャ化

AppleSeedは2019年登場、現在v2.1。Dropper型とSpy型に分かれる。2022年からの核心的変化は **`C:\GPKI` ディレクトリ収集** 機能で、この経路は韓国政府が公務員・政府システム認証に用いるデジタル証明書を含むため、国家行政侵入の観点で危険度が極めて高い。同機能はTroll Stealerにも実装されている。

**HappyDoor** はAhnLabが2024年に公開したAppleSeed系バックドアで、同一の文字列難読化・収集データ種別・RSA暗号化を共有する。AppleSeedから進化した高度変種として **中（Medium）** と評価される。

---

## 6. 分析の焦点 — なぜRustだったのか？

HelloDoorがKimsuky初のRustバックドアという事実よりも、**「なぜ今、あえてRustなのか」** という問いの方が脅威の方向性をよく表す。検知回避・開発の利便性・供給の現実が重なった結果と評価される。

### 6.1 検知回避 — 既存シグネチャの無力化

C/C++で長年蓄積されたPebbleDashのシグネチャ・YARAルールは、すでにAV・EDRに学習されている。Rustで書き直すと **コンパイル成果物の構造そのものが変わる** — 静的リンクによるバイナリ肥大化、異なる関数境界・文字列配置・制御フロー、固有のネームマングリング。同じバックドアに **「新しい服」を着せて検知曲線をリセット** する効果であり、Lazarus・BlueNoroffを含む多数のAPTで見られるRust・Go移行の流れと軌を一にする。

### 6.2 LLM支援開発 — 参入障壁を下げたAI

絵文字デバッグログと残存する誤字の共存は、開発者が **不慣れな言語をAI支援で初めて扱った可能性** を示唆する。Rustは所有権・borrow checkerで参入障壁が高いことで有名だが、LLMがその学習コストを大きく下げる。純粋な人間の専門家の成果物であればそうした稚拙な痕跡は残らなかっただろう。これは **開発生産性を高めつつ、まだ完全自動化には至っていない過渡期** を示している。

### 6.3 副次的動機 — Rust自体の利点（ただし現状は限定的）

- メモリ安全性によるクラッシュ減少 → バックドアの安定性・隠密性向上。
- クロスプラットフォームコンパイルと豊富なcratesで機能結合が容易。
- 静的リンクで外部依存を最小化。

ただしHelloDoorは **初期段階の成果物** であるため、現時点で安定性が主な動機とは考えにくい。核心は **検知回避＋AI支援開発** の組み合わせである。

> **▶ 防御者が注目すべきシグナル：** 「なぜRustか」より、**今後6〜12か月以内にPebbleDash中核バックドア（httpMaliceクラス）までRustで書き直されるか** を追跡することが重要。本格的な移行が確認されれば、シグネチャベース検知の相当部分を再設計する必要が生じ得る。

---

## 7. ポストエクスプロイト — 正規ツール（LotL）の悪用

### 7.1 VSCodeリモートトンネリングの悪用

正規のVisual Studio CodeのRemote Tunnelingを悪用して隠密なリモートアクセスを構築する。マルウェアを落とす代わりに正規VSCode CLIをダウンロードしてトンネルを生成するため **検知ポイントが著しく少ない**。認証は非対話コンテキストでデフォルトの **GitHubアカウント** が自動選択される。

- JSE方式：トンネル名 `bizeugene`、生成された `vscode.dev/tunnel` URL・デバイスコードを窃取済み韓国サイト（`yespp.co[.]kr`）にPOST。
- 新規Go製インストーラ（`vscode_payload`）：デバッグ・トンネルURLを **Slack WebHook** に送信。

結果として標的端末は **Microsoft所有サーバー** と通信することになり、利用者はそのトラフィックが攻撃者由来であることに気づかない。

### 7.2 DWAgentリモート管理ツールの悪用

正規RMMツールのDWAgentを悪用。httpMalice感染ホストに設置するか、別途インストーラを作成する。インストーラはReger Dropperと同一のRC4キー・構造を持ち、攻撃者アカウントの `config.json` で即座にリモートセッションを有効化する（正規リレー `node*.dwservice[.]net` 経由）。

---

## 8. インフラと被害状況

Kimsukyは韓国の無料ドメインホスティング **내도메인.한국（naedomain.hankook）**（`.p-e.kr`、`.o-r.kr`、`.n-e.kr`、`.r-e.kr`、`.kro.kr`）を正規サイト模倣に活用し、背後インフラの多くはInterServer VPSである。ただし多数のアクターが共用するため単独での帰属根拠にはならない。さらに窃取した韓国の正規サイトをC2とし、Cloudflare・VSCode・Ngrokトンネリングでインフラを秘匿する。

被害分析では、httpMaliceのDropbox C2にアップロードされた感染ログが発見され、各被害者フォルダの `user.txt` に標的情報が **韓国語で** 記録されていた（「장악／掌握」「http あり」「DWService あり」）。攻撃者が手動で被害者を管理していた痕跡を示している。

### 8.1 帰属（Attribution）

- 両クラスタの多数の検体が **同一の窃取証明書で署名** され、ミューテックスパターンを共有。
- PebbleDashは2021年以来、Kimsuky攻撃でのみ排他的に発見。
- Microsoft **Ruby Sleet**、Mandiant **Cerium → APT43** と技術的に関連。
- 総合評価：**中〜高（Medium-High）の信頼度でKimsuky関連クラスタの仕業**。

---

## 9. MITRE ATT&CK マッピング

| 戦術 | 技術 | 観測内容 |
| --- | --- | --- |
| Initial Access | T1566.001 Spearphishing Attachment | 文書偽装JSE/PIF/SCR添付 |
| Execution | T1059.001/.007 PowerShell/JScript | certutilデコード、JScriptドロッパー |
| Execution | T1218.010/.011 Regsvr32/Rundll32 | ペイロード実行（LOLBin） |
| Persistence | T1547.001 Run Keys | tdll、Everything 1.9a |
| Persistence | T1543.003 Windows Service | CacheDBサービス |
| Persistence | T1053.005 Scheduled Task | ChromeCheck / EdgeCheck |
| Defense Evasion | T1620 Reflective Loading | MemLoadメモリロード |
| Defense Evasion | T1553.002 Code Signing | 窃取した韓国機関の証明書 |
| Defense Evasion | T1564.004 ADS | httpTroy :HUIストリーム |
| C2 | T1572 Protocol Tunneling | VSCode・Cloudflare・Ngrok |
| C2 | T1102 Web Service | Dropbox・Slack WebHook |
| C2 | T1219 Remote Access Software | DWAgent |
| Collection | T1056.001 Keylogging | AppleSeed Spy |
| Exfiltration | T1041 Exfil over C2 | GPKI証明書・文書流出 |

---

## 10. 検知と対応の推奨

### 10.1 即時検知ポイント

- 二重拡張子の添付（`.hwp.jse`、`.pdf.jse`、`.scr`、`.pif`）をメールゲートウェイで遮断。
- `regsvr32.exe /s` および `rundll32.exe` が `C:\ProgramData` 内のランダム名ファイルを実行するパターンを検知。
- PowerShellの `certutil -decode` ＋ `-windowstyle hidden` の組み合わせを警報。
- スケジュールタスク `ChromeCheck`/`EdgeCheck` およびサービス `CacheDB` の有無を点検。
- `code.exe tunnel` の異常実行、`*.trycloudflare.com` / `vscode.dev/tunnel` / `*.dwservice.net` の通信を監視。
- `C:\GPKI` ディレクトリへの不正アクセス・圧縮・流出を検知 — 政府機関を優先。

### 10.2 組織レベルの対応

- naedomain.hankook系の無料ドメインへの非業務通信をプロキシ・DNSレベルで点検。
- VSCode・DWAgent等のRMM/開発ツールの許可リスト化、GitHubデバイス認証フローの監視。
- 国防・政府・医療部門は **PebbleDash優先標的** であると認識し、スピアフィッシング訓練・EDRルールを強化。
- 付録のIOCをSIEM/EDR/ファイアウォールに即時適用し、過去ログを遡及調査（retro-hunt）。

---

## 11. 韓国政府および関係当局の対策

Kimsukyは韓国政府が **世界で初めて対北独自制裁の対象に指定** したハッキング組織である。韓国特化型の脅威であるため、グローバルIOCの受信にとどまらず国内の通報・対応体制を積極的に活用すべきである。

### 11.1 侵害事故の通報窓口

政府は、北朝鮮による標的型スピアフィッシングの対象になったと判断される場合、**実際の侵害の有無にかかわらず** 通報するよう推奨している。

| 機関 | 通報番号 | 役割 |
| --- | --- | --- |
| **国家情報院（NIS）** | **111** | 国家背景のサイバー脅威統括、公共・重要インフラ対応 |
| **警察庁** | **182** | サイバー犯罪捜査および刑事対応 |
| **韓国インターネット振興院（KISA）** | **118** | 民間の侵害事故受付・原因分析・技術支援 |
| **保護ナラ / KrCERT/CC** | **boho.or.kr** | オンラインハッキング・ランサムウェア通報、中小企業支援 |

### 11.2 法的通報義務（情報通信網法）

- 情報通信サービス提供者は **第48条の3** に基づき、侵害事故を認知してから **24時間以内** に科学技術情報通信部長官またはKISAへ通報。
- 24時間経過後の通報・不通報の場合、第76条により **3千万ウォン以下の過料**。
- 第48条の4に基づき資料の保全・提出・現場調査への協力義務。
- 個人情報流出を伴う場合、個人情報保護法に基づく **流出通報を別途受付**。

### 11.3 政府の先制的・外交的対応

- **対北独自制裁：** Kimsukyを独自制裁対象に指定、北朝鮮IT人材への米韓共同制裁と連携。
- **米韓協調・国際協力：** 合同セキュリティ勧告の発令を継続。
- **官民脅威情報共有：** KISAの **C-TAS** を通じたインテリジェンス共有とリアルタイム状況伝達。
- **サイバー危機警報：** 正常–関心–注意–警戒–深刻の5段階体系を運用。

> **▶ 推奨：** 政府・国防・医療などPebbleDash優先標的部門は、IOCをC-TAS・自社EDRに即時反映し、GPKIアクセス挙動の専用監査ログを有効化すること。侵害が疑われる場合は24時間通報義務を遵守し、証跡保全のためメモリ・ディスクイメージの確保を優先する。

---

## 12. アナリスト評価

本キャンペーンの意義は、KimsukyがLLMを通じて **「洗練度の低いグループ」という通念を急速に塗り替えている** 点にある。Rustの採用、正規ツールのLotL悪用、トンネリングによるインフラ秘匿はいずれも検知・帰属を困難にする方向の進化である。

特に **LLM生成コードの痕跡** は、北朝鮮の脅威アクターがAIで **開発生産性を高めつつ、まだ完全自動化には至っていない過渡期** にあることを示唆する。Kasperskyも「AIは一部の攻撃を自動化し得るが、完全自動化された攻撃の構成は決して些細ではない」と評価する。つまり **AIは脅威を加速するが代替はせず**、マルウェア・初期ベクトル・標的・ポストエクスプロイト・最終目的を総合的に追跡する従来型アプローチの価値は依然として有効である。

韓国にとっての示唆は明確だ。EUC-KR標的化、韓国行政文書の精密模倣、GPKI窃取、韓国の無料ホスティングC2など、**この脅威は本質的に韓国特化型** である。グローバルベンダーのIOCを受動的に受信するにとどまらず、**韓国語のおとりパターンやGPKIアクセス挙動といった局所的な検知ロジックを自前で構築** することが核心的対策である。

---

## 付録A. 侵害指標（IOC）

### A.1 ファイルハッシュ（MD5）

| 分類 | MD5 | 備考 |
| --- | --- | --- |
| JSE Dropper | `995a0a49ae4b244928b3f67e2bfd7a6e` | →HelloDoor |
| JSE Dropper | `52f1ff082e981cbdfd1f045c6021c63f` | →httpMalice |
| JSE Dropper | `9fe43e08c8f446554340f972dac8a68c` | →httpMalice |
| JSE Dropper | `8e15c4d4f71bdd9dbc48cd2cabc87806` | →AppleSeed |
| Reger Dropper | `65fc9f06de5603e2c1af9b4f288bb22c` | security_*.scr |
| Reger Dropper | `c19aeaedbbfc4e029f7e9bdface495b9` | secu.scr |
| Pidoc Dropper | `8983ffa6da23e0b99ccc58c17b9788c7` | .pif |
| AppleSeed | `a7f0a18ac87e982d6f32f7a715e12532` | Dropper |
| AppleSeed | `f4465403f9693939fe9c439f0ab33610` | Dropper |
| AppleSeed | `5c373c2116ab4a615e622f577e22e9be` | Dropper |
| HappyDoor | `d1ec20144c83bba921243e72c517da5e` | |
| MemLoad | `58ac2f65e335922be3f60e57099dc8a3` | |
| MemLoad | `f73ba062116ea9f37d072aa41c7f5108` | jhsakqvv.dat |
| httpTroy | `7e0825019d0de0c1c4a1673f94043ddb` | config.db |
| httpMalice | `08160acf08fccecde7b34090db18b321` | |
| httpMalice | `94faed9af49c98a89c8acc55e97276c9` | |
| HelloDoor | `c42ae004badddd3017adadbdd1421e00` | |
| VSCodeインストーラ | `9ca5f93a732f404bbb2cee848f5bbda0` | xipbkmaw.exe |
| DWAgentインストーラ | `678fb1a87af525c33ba2492552d5c0e2` | |

### A.2 ドメインおよびC2

| 指標（Indicator） | 種別 | 関連マルウェア |
| --- | --- | --- |
| `opedromos1.r-e[.]kr` | Domain | AppleSeed C2 |
| `morames.r-e[.]kr` | Domain | AppleSeed C2 |
| `load.ssangyongcne.o-r[.]kr` | Domain | MemLoad C2 |
| `load.yju.o-r[.]kr` | Domain | MemLoad C2 |
| `attach.docucloud.o-r[.]kr` | Domain | MemLoad C2 |
| `load.supershop.o-r[.]kr` | Domain | MemLoad C2 |
| `load.erasecloud.n-e[.]kr` | Domain | MemLoad C2 |
| `cms.spaceyou.o-r[.]kr` | Domain | HappyDoor C2 |
| `erp.spaceme.p-e[.]kr` | Domain | HappyDoor C2 |
| `file.bigcloud.n-e[.]kr` | Domain | httpTroy C2 |
| `load.auraria[.]org` | Domain | httpTroy C2 |
| `female-disorder-beta-metropolitan.trycloudflare[.]com` | Tunnel | HelloDoor C2 |
| `www.pyrotech.co[.]kr/.../default.php` | 窃取サイト | httpMalice C2 |
| `newjo-imd[.]com/.../default.php` | 窃取サイト | httpMalice C2 |
| `www.yespp.co[.]kr/.../out.php` | 窃取サイト | VSCodeトンネル窃取 |

> ※ 上記指標はKaspersky GReATの公開分析（2026-05-14）に基づく。防御目的以外の使用を禁じ、適用前に自社環境での誤検知の可能性を検討することを推奨する。

---

## 付録B. 出典

1. Kaspersky GReAT (Sojun Ryu), ["Kimsuky targets organizations with PebbleDash-based tools"](https://securelist.com/kimsuky-appleseed-pebbledash-campaigns/119785/), Securelist, 2026-05-14.
2. Gen Digital Threat Labs, "DPRK's Playbook: Kimsuky's HttpTroy and Lazarus's New BLINDINGCAN Variant", 2025-10.
3. AhnLab ASEC, HappyDoor分析レポート, 2024.
4. Microsoft, "Latest intelligence on North Korean and Chinese threat actors" (Ruby Sleet), CyberWarCon, 2024-11.
5. Mandiant/Google Cloud, "APT43 / Mapping DPRK Groups to Government".

---

**作成：** Dennis Kim、Betalabs Inc. / 独立CTIアナリスト
**配布：** [github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)

*本文書は公開情報（OSINT）を総合・再構成した脅威インテリジェンス分析であり、防御目的の情報共有のために作成された。すべての一次技術分析の出典はKaspersky GReATであり、作成者の解釈・評価が付加されている。*

`TLP:CLEAR` · `CTI-2026-0526-KIMSUKY-PEBBLEDASH` · Dennis Kim CTI
