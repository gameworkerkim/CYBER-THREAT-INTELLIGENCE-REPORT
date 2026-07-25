---
title: "Flowsint — OSINTグラフ探索ツールレビュー"
subtitle: "サイバーセキュリティアナリストとOSINT調査員のためのオープンソースMaltego代替"
description: "reconurgeによるオープンソースOSINTグラフ探索ツールFlowsintの包括的なレビュー。機能、アーキテクチャ、Enricher、競合状況、セキュリティ考慮事項、CTIワークフロー評価を網羅します。"
abstract: |
  FlowsintはApache 2.0ライセンスのオープンソースOSINTグラフ探索プラットフォームで、7,400以上のGitHubスターを急速に獲得しています。ローカルファーストのプライバシーアーキテクチャ、Dockerベースのデプロイ、ドメイン、IP、メール、暗号通貨ウォレット、ソーシャルメディアをカバーするモジュール式Enricherエコシステムを備え、Maltegoのオープンソース代替として位置付けられています。本レポートは、Flowsintの機能、セキュリティ態勢、CTIアナリストにとっての運用適合性について構造化されたレビューを提供します。
date: 2026-07-25
author: "Dennis Kim"
lang: ja
tags:
  - OSINT
  - Open-Source-Tool
  - Graph-Investigation
  - Tool-Review
  - Flowsint
  - Maltego-Alternative
  - Reconnaissance
keywords:
  - Flowsint
  - OSINT
  - グラフ調査
  - Maltego代替
  - オープンソースツール
  - サイバーセキュリティツール
  - Enricher
group: tool-review
featured: false
schema_type: TechArticle
tlp: GREEN
severity: INFO
draft: false
---

| id             | CTI-2026-0725-FLOWSINT                                                                 |
| -------------- | --------------------------------------------------------------------------------------- |
| タイトル        | Flowsint — OSINTグラフ探索ツールレビュー                                                  |
| サブタイトル    | サイバーセキュリティアナリストとOSINT調査員のためのオープンソースMaltego代替                |
| 著者            | Dennis Kim (HoKwang Kim)                                                                |
| メール          | <gameworker@gmail.com>                                                                  |
| github         | gameworkerkim                                                                            |
| 日付            | 2026-07-25                                                                               |
| 分類            | TLP:GREEN                                                                                |
| 重要度          | INFO                                                                                     |
| 言語            | ja                                                                                      |
| タグ            | OSINT · Open-Source-Tool · Graph-Investigation · Tool-Review · Flowsint                 |
| リポジトリ      | [reconurge/flowsint](https://github.com/reconurge/flowsint)                              |
| スター          | 7,400+                                                                                   |
| ライセンス      | Apache 2.0                                                                               |
| フレームワーク  | N/A (ツールレビュー)                                                                    |

# Flowsint — OSINTグラフ探索ツールレビュー

> **レポートID** `CTI-2026-0725-FLOWSINT` | **公開日** 2026-07-25 | **分類** `TLP:GREEN` | **重要度** INFO
> **著者** Dennis Kim (HoKwang Kim) | <gameworker@gmail.com> | [@gameworkerkim](https://github.com/gameworkerkim)

*サイバーセキュリティアナリストとOSINT調査員のためのオープンソースMaltego代替*

---

## 目次

1. プロジェクト概要
2. コア機能とアーキテクチャ
3. Enricherエコシステム
4. 競合比較
5. セキュリティに関する考慮事項
6. CTIワークフローにおける運用評価
7. 結論
8. 参考文献

---

## 1. プロジェクト概要

**Flowsint** (`reconurge/flowsint`)はApache 2.0ライセンスのオープンソースOSINTグラフ探索ツールで、ビジュアルグラフインターフェースを通じてエンティティ間の関係をマッピングする必要があるサイバーセキュリティアナリスト、ジャーナリスト、調査員向けに設計されています。

| 項目               | 詳細                                                                  |
| ------------------ | ---------------------------------------------------------------------- |
| リポジトリ         | [github.com/reconurge/flowsint](https://github.com/reconurge/flowsint) |
| ライセンス         | Apache 2.0                                                             |
| GitHubスター       | 7,400+                                                                 |
| フォーク           | 935                                                                    |
| コミット           | 871                                                                    |
| 主要言語           | Python (バックエンド), TypeScript (フロントエンド)                     |
| 開発段階           | 初期開発 (pre-1.0, 活発)                                               |
| ウェブサイト       | [flowsint.io](https://flowsint.io)                                     |

### コア原則

- **倫理的調査**: 合法的かつ倫理的なOSINTおよび脅威インテリジェンス調査に限定
- **透明性**: Apache 2.0ライセンスの完全なオープンソースコードベース
- **検証**: 複数のデータソースを相互参照する自動化Enricher
- **ローカルファーストのプライバシー**: すべてのデータはデフォルトでユーザーのマシンに保存

Flowsintは、`ETHICS.md`および`DISCLAIMER.md`に文書化されている通り、不正な監視、ドクシング、ハラスメント、または政治的操作の目的での使用を明示的に禁止しています。

---

## 2. コア機能とアーキテクチャ

### 2.1 ビジュアルグラフ探索

主要なインターフェースは、インタラクティブなノード・エッジグラフ可視化です。アナリストはエンティティ（ドメイン、IP、個人、組織、メールアドレス、暗号通貨ウォレット）を作成し、自動化されたEnrichmentと手動リンクを通じて関係を探索します。

### 2.2 システムアーキテクチャ

| コンポーネント      | 技術                | 役割                                    |
| ------------------- | ------------------- | --------------------------------------- |
| `flowsint-app`      | TypeScript (Vite)   | インタラクティブグラフのフロントエンドUI |
| `flowsint-api`      | FastAPI (Python)    | REST API、認証、イベントストリーム      |
| `flowsint-core`     | Python              | オーケストレーター、Celeryタスク、Vault |
| `flowsint-enrichers` | Python             | Enricherモジュールとスキャンロジック    |
| `flowsint-types`    | Pydantic             | データモデルと型定義                    |
| データベース (グラフ) | Neo4j              | エンティティ-関係グラフストレージ       |
| データベース (リレーショナル) | PostgreSQL    | ユーザーアカウント、設定、メタデータ    |
| キャッシュ / キュー | Redis + Celery      | タスクキューとキャッシング              |

### 2.3 デプロイモデル

Docker Composeによる完全コンテナ化。単一コマンドでのデプロイ:

```
git clone https://github.com/reconurge/flowsint.git
cd flowsint
make prod
```

Linux、macOS、Windowsをサポートします。チーム/サーバーデプロイは内部フロントエンドプロキシアーキテクチャにより標準対応しており、ポート5173のみが公開されます。PostgreSQL、Redis、Neo4j、APIはlocalhostにバインドされ、プロキシ経由でのみアクセス可能です。

### 2.4 主要な設計判断

| 判断                      | 影響                                                                     |
| ------------------------- | ------------------------------------------------------------------------ |
| ローカルファーストストレージ | クラウド依存なし; データ主権を保証                                      |
| Docker Compose専用        | ベアメタルインストールパスなし; Dockerの習熟が必要                       |
| Neo4jをグラフDBとして採用 | Cypherによる強力な関係クエリ、学習曲線あり                               |
| チーム向け内部プロキシ    | 単一ポート公開でネットワーキングを簡素化、本番環境ではHTTPSが必要       |
| モジュラーモノレポ        | 関心の明確な分離; Enricherの独立開発が可能                               |

---

## 3. Enricherエコシステム

Enricherは、エンティティを入力として受け取り、関連するエンティティまたはメタデータを生成する自動化モジュールです。Flowsintは幅広いセットを標準搭載しています。

### 3.1 ドメインEnricher

| Enricher              | 機能                                          |
| --------------------- | --------------------------------------------- |
| Reverse DNS           | IPを参照するドメインの検索                     |
| DNS Resolution        | ドメインをIPアドレスに解決                     |
| Subdomain Discovery   | サブドメインの列挙                             |
| WHOIS Lookup          | ドメイン登録データの取得                       |
| Domain to Website     | ドメインをウェブサイトエンティティに変換       |
| Domain to Root Domain | ルートドメインの抽出                           |
| Domain to ASN         | ドメインを自律システム番号(ASN)にマッピング    |
| Domain History        | 過去のドメインデータの取得                     |

### 3.2 IPおよびASN Enricher

| Enricher       | 機能                                  |
| -------------- | ------------------------------------- |
| IP Information | ジオロケーションとネットワーク詳細    |
| IP to ASN      | IPを自律システム(AS)にマッピング      |
| ASN to CIDRs   | ASNのIP範囲の取得                     |
| CIDR to IPs    | 範囲内の個別IPの列挙                  |

### 3.3 身元・連絡先Enricher

| Enricher                | 機能                                                  |
| ----------------------- | ----------------------------------------------------- |
| Maigret                 | 2,500以上のソーシャルプラットフォームでのユーザー名検索 |
| Email to Gravatar       | メールからGravatarプロフィールを検索                  |
| Email to Breaches       | 漏洩データベースとのメール相互参照                     |
| Email to Domains        | メールに関連付けられたドメインの検索                  |
| Phone to Breaches       | 漏洩データベースとの電話番号相互参照                  |
| Individual to Org       | 組織所属の検索                                        |
| Individual to Domains   | 個人に関連付けられたドメインの検索                    |

### 3.4 組織・インフラEnricher

| Enricher                 | 機能                                      |
| ------------------------ | ----------------------------------------- |
| Organization to ASN      | 組織が所有するASNの検索                    |
| Organization Information | 企業登録詳細の取得                        |
| Organization to Domains  | 組織が所有するドメインの検索              |

### 3.5 暗号通貨Enricher

| Enricher               | 機能                              |
| ---------------------- | --------------------------------- |
| Wallet to Transactions | 取引履歴の取得                    |
| Wallet to NFTs         | ウォレットが保有するNFTの識別     |

### 3.6 ウェブサイトEnricher

| Enricher              | 機能                                    |
| --------------------- | --------------------------------------- |
| Website Crawler       | ウェブサイト構造のクロールとマッピング  |
| Website to Links      | すべての外部リンクの抽出                |
| Website to Domain     | URLからドメインを抽出                   |
| Website to Webtrackers | 追跡/分析スクリプトの識別              |
| Website to Text       | プレーンテキストコンテンツの抽出        |

### 3.7 統合Enricher

| Enricher        | 機能                                            |
| --------------- | ----------------------------------------------- |
| N8n Connector   | FlowsintをN8n自動化ワークフローに接続           |

---

## 4. 競合比較

### 4.1 直接比較

| ツール            | ライセンス        | タイプ           | Flowsintとの主な差別化要因                                     |
| ----------------- | ----------------- | ---------------- | --------------------------------------------------------------- |
| **Maltego**       | 商用 (Freemium)   | グラフOSINT      | 業界標準、成熟したTransformライブラリ、有料ティア              |
| **SpiderFoot**    | GPL-3.0           | 自動スキャン     | 200以上のOSINTソース、CLIファースト、強力な自動化              |
| **Recon-ng**      | MIT               | CLIフレームワーク | Metasploitスタイルのモジュラー偵察、ターミナルのみ              |
| **SpectraGraph**  | オープンソース    | グラフスタジオ   | インタラクティブグラフワークスペース、類似のビジュアルアプローチ |
| **PANO**          | オープンソース    | グラフ + AI      | タイムラインビュー + Flowsintの範囲を超えるAI支援              |
| **Helix**         | オープンソース    | アイデンティティグラフ | D3.jsリアルタイム関係グラフ、アイデンティティマッピング重視 |
| **Flowintel**     | オープンソース    | ケース管理       | 探索ではなく調査ケース/コラボレーション管理                    |

### 4.2 Flowsintのポジショニング

Flowsintは独自のニッチを占めています:

- **Maltego代替**: MaltegoのグラフベースOSINTワークフローのオープンソース代替として最も頻繁に引用される
- **ビジュアルファースト**: SpiderFootやRecon-ng（CLI中心）とは異なり、Flowsintはインタラクティブなビジュアル探索を優先します
- **ローカルプライバシー**: ほとんどの競合ツールはクラウドアカウントを必要とするか、テレメトリを送信します
- **Reconurgeエコシステム**: 兄弟ツール（Recontrack、Reconcrawl）との緊密な統合
- **バランスの取れたアプローチ**: 自動化Enricherと手動グラフ操作を組み合わせ

---

## 5. セキュリティに関する考慮事項

### 5.1 報告された脆弱性

Flowsintは初期開発段階にあり、複数のCVEが報告されています。アナリストは、機密環境にデプロイする前にリスク許容度を評価する必要があります。

| CVE ID              | タイプ                      | 説明                                                                        | ステータス        |
| -------------------- | --------------------------- | ------------------------------------------------------------------------ | --------------- |
| CVE-2026-32311       | OSコマンドインジェクション  | `org_to_asn` Enricherが細工された入力を介したコマンドインジェクションに脆弱 | 報告済み        |
| CVE-2026-44352       | アクセス制御                | ユーザーが他のユーザーのスケッチログを閲覧可能だった (pre-v1.2.3)        | 1.2.3で修正済み |
| CVE-2026-42156       | Cypherクエリインジェクション | サニタイズされていないエンティティ入力を介したグラフクエリインジェクション | 報告済み        |

### 5.2 運用セキュリティの推奨事項

1. **ネットワーク分離**: 隔離されたVLANまたは専用分析VMにデプロイしてください
2. **公開インターネットに公開しない**: 内部プロキシアーキテクチャはLAN/信頼ネットワーク向けに設計されています。公開アクセスが必要な場合は、HTTPS終端を行うリバースプロキシを前方に配置してください
3. **デフォルトシークレットの変更**: `.env`ファイルには`AUTH_SECRET`、`MASTER_VAULT_KEY_V1`、`NEO4J_PASSWORD`のプレースホルダー値が含まれています。デプロイ前に一意の値を生成してください
4. **アップデートの監視**: パッチについては[CHANGELOG.md](https://github.com/reconurge/flowsint/blob/main/CHANGELOG.md)およびGitHub Security Advisoriesを追跡してください
5. **本番準備状況**: 現在の開発段階では、Flowsintは本番のアナリストワークフローよりも研究・テスト環境に最も適しています

### 5.3 サプライチェーンリスク

- 複数の貢献者による871コミット; 単一ベンダーロックインなし
- DockerイメージはGitHub Container Registry(`ghcr.io`)から取得されます。可能な場合はイメージ署名を検証してください
- Python依存関係チェーンは`uv`/`pyproject.toml`で管理されています。デプロイ前に`pip-audit`または類似ツールで監査してください

---

## 6. CTIワークフローにおける運用評価

### 6.1 Flowsintの適合領域

| CTIワークフローステージ    | Flowsintの有用性                                       | 評価        |
| ------------------------- | ------------------------------------------------------- | ----------- |
| 初期偵察                   | ドメイン/IP/ASN Enricherが迅速なマッピングを提供        | 高い        |
| エンティティ帰属           | Maigret、メール-漏洩マッチング、ウォレット追跡          | 中〜高      |
| インフラマッピング         | ASN-to-CIDRs、逆引きDNS、サブドメイン発見               | 高い        |
| 関係発見                   | Neo4j Cypherクエリによるグラフ可視化                     | 高い        |
| レポート生成               | スクリーンショット/グラフエクスポート; 組み込みレポートテンプレートなし | 低〜中      |
| チームコラボレーション     | サーバーデプロイでマルチユーザー対応; RBAC未実装        | 中          |
| 証拠保存                   | ローカルストレージ; 組み込みの証拠連続性機能なし         | 低い        |

### 6.2 推奨ユースケース

- 単一の指標から攻撃者インフラ（ドメイン、IP、ASN）のマッピング
- ランサムウェア/APT調査における暗号通貨ウォレット関係の追跡
- 漏洩データベースとソーシャルプラットフォーム全体でのメールアドレスとユーザー名の相互参照
- サプライチェーンリスク評価のための組織リンクチャートの構築

### 6.3 本番CTIにおける制限事項

- SIEM/SOARプラットフォームへのプログラムによるグラフエクスポート用APIなし
- 組み込みIoC共有形式なし（STIX/MISPエクスポート未対応）
- 初期段階の安定性 -- リリース間での破壊的変更の可能性あり
- ドキュメントが不完全; Discord経由のコミュニティサポートのみ

---

## 7. 結論

Flowsintは、Maltegoの代替としてコミュニティの注目（7,400以上のスター）を急速に集めている有望なオープンソースOSINTグラフ探索ツールです。ローカルファーストのプライバシーアーキテクチャ、幅広いEnricherエコシステム、Dockerベースのデプロイにより、個人アナリストや小規模チームにとってアクセスしやすいものとなっています。

**強み**: ビジュアルグラフ探索、モジュール式Enricherアーキテクチャ、クラウド依存ゼロ、Apache 2.0ライセンス、ドメイン/IP/メール/暗号通貨/ソーシャルメディアをカバーするEnricherエコシステム。

**弱み**: 初期開発段階（pre-1.0）、監視が必要な文書化されたCVE、STIX/MISPエクスポートなし、Docker専用デプロイ、不完全なドキュメント。

**評決**: CTI研究およびラボ環境に適しています。追加のセキュリティ強化と分離なしに本番アナリストパイプラインで使用することはまだ推奨されません。プロジェクトの軌跡（871コミット、活発なコミュニティ、急速なスター成長）は継続的な監視を正当化し、オープンソースOSINTツールキットの標準ツールになる可能性を秘めています。

> **免責事項**: Flowsintは、合法的かつ倫理的な調査および研究目的に限定して設計されています。不正な監視、ドクシング、ハラスメント、または違法な使用は、プロジェクトのETHICS.mdガイドラインに基づき禁止されています。

---

## 8. 参考文献

[1] reconurge/flowsint -- GitHubリポジトリ. <https://github.com/reconurge/flowsint>

[2] Flowsint公式サイト. <https://flowsint.io>

[3] Flowsint ETHICS.md. <https://github.com/reconurge/flowsint/blob/main/ETHICS.md>

[4] Flowsint DISCLAIMER.md. <https://github.com/reconurge/flowsint/blob/main/DISCLAIMER.md>

[5] Flowsint CHANGELOG.md. <https://github.com/reconurge/flowsint/blob/main/CHANGELOG.md>

[6] Maltego -- 商用OSINTグラフプラットフォーム. <https://www.maltego.com>

[7] SpiderFoot -- オープンソースOSINT自動化. <https://github.com/smicallef/spiderfoot>

[8] Recon-ng -- Web偵察フレームワーク. <https://github.com/lanmaster53/recon-ng>

---

(c) 2026 Dennis Kim (HoKwang Kim) | 独立CTIアーカイブ (TLP:GREEN)
連絡先: <gameworker@gmail.com> | GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
