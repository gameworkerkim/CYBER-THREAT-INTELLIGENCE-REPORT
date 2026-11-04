# デプロイ・運用 — エアギャップ / オンプレミス

**言語:** [English](../deployment.md)（基準） · [한국어](deployment.md) · 日本語（本ドキュメント） · [中文](deployment.md)

金融・公共機関・企業環境への Open AI Red Team のデプロイ方法を説明します。エアギャップ／オンプレミス
運用の特長を最大化しつつ、韓国の規制（ネットワーク分離・망분리、電子金融監督規定など）を満たす
階層型アーキテクチャの構成が要点です。

## 推奨アーキテクチャ — 5階層

```
① オフライン搬入層          ② コンテナセキュリティ/レジストリ層  ③ LLM サービング層
   （インターネット網）         （内部網）                          （内部網）
┌──────────────────┐   ┌──────────────────────────────┐   ┌───────────────────────┐
│ skopeo / crane   │   │ Harbor（プライベートレジストリ）│   │ vLLM（本番）           │
│ docker save/load │──►│ Trivy（CVE + SBOM）          │──►│ Ollama（PoC）          │
│ モデル重み        │   │ Cosign（署名/検証）           │   │ OpenAI互換 /v1         │
└──────────────────┘   └──────────────────────────────┘   └───────────┬───────────┘
                                                                       │
④ レッドチームアプリ層        ⑤ 認証・監査・監視層                     │
┌──────────────────────────────┐   ┌──────────────────────────────┐   │
│ ort（Open AI Red Team）      │◄──┤ Keycloak（OIDC, SSO, RBAC）  │◄──┘
│ 非root/読み取り専用/リソース制限│   │ LangFuse（LLM監査）          │
└──────────────────────────────┘   │ Prometheus + Grafana + Loki  │
                                   └──────────────────────────────┘
```

---

## 階層1 — オフライン搬入（ネットワーク分離）

망분리 環境では、必要な全資源（LLM重み、Dockerイメージ、パッケージ）をインターネット網で
特定・ダウンロードし、**マルウェア検査を経て**内部網へ搬入する必要があります。

### イメージ書き出し（インターネット網）

```bash
# skopeo（Dockerデーモン不要）または crane、docker save — scripts/offline/ 参照
./scripts/offline/export-images.sh
# カスタムリスト: IMAGES="harbor.example.com/repo/app:v1 ..." ./scripts/offline/export-images.sh
```

`artifacts/images/*.tar` と SHA-256 チェックサムが生成されます。搬入**前に**組織の
アンチウイルス／マルウェアソリューションで検査してください（金融保安院ガイド）。

### イメージ搬入（内部網）

```bash
./scripts/offline/import-images.sh
# 内部 Harbor へプッシュ:
HARBOR=harbor.internal.example.com/open-red-team ./scripts/offline/import-images.sh
```

### モデル重み

```bash
# vLLM 形式（Hugging Face）
MODEL_ID=Qwen/Qwen2.5-32B-Instruct ./scripts/offline/export-models.sh
# Ollama 形式（PoC）
MODE=ollama OLLAMA_MODEL=qwen2.5:32b ./scripts/offline/export-models.sh
```

### Harbor レプリケーション（tar の代替）

インターネット網 Harbor から内部網 Harbor への**レプリケーションルール**を構成します。
承認済みの区間転送経路とレプリケート物ごとの監査ログが必要です。

---

## 階層2 — コンテナセキュリティとプライベートレジストリ

金融・公共機関ではイメージ脆弱性スキャンとSBOM生成が事実上必須です。

| ツール | 役割 |
|--------|------|
| **Harbor** | オンプレミスプライベートレジストリのデファクト標準。Trivyスキャナアダプタ統合 — プッシュ時自動スキャン、ポリシー基盤のpullブロック |
| **Trivy** | OSパッケージ・言語依存・IaC設定・シークレットをスキャン。SBOM（SPDX/CycloneDX）生成でサプライチェーン要件を充足 |
| **Cosign** | イメージ署名・検証（Sigstore）。Harborと連携し未署名イメージのデプロイをブロック |

### スキャン + SBOM

```bash
# HIGH/CRITICAL 検出で失敗、SPDX + CycloneDX SBOM を出力
./scripts/sbom/scan.sh open-ai-red-team:latest artifacts/sbom
```

### 署名 + 検証

```bash
./scripts/sbom/sign.sh open-ai-red-team:latest          # cosign.key を生成し署名
./scripts/sbom/sign.sh open-ai-red-team:latest --verify # cosign.pub で検証
```

### Harbor 構成（概要）

1. 内部網に Harbor をインストール（オフラインインストーラ）。
2. プロジェクト → **設定**: 「脆弱なイメージの実行を防止」を有効化（Trivyアダプタ）。
3. デプロイノード用の pull 専用ロボットアカウントを作成。
4. （任意）Cosign 連携 — 署名済みイメージのみ許可するポリシー。

---

## 階層3 — LLM サービング

Open AI Red Team はすべての OpenAI 互換バックエンドをサポートします。要件に応じて選択します:

| バックエンド | 用途 | 備考 |
|--------------|------|------|
| **vLLM** | 本番（推奨） | PagedAttention + Continuous Batching — 同時リクエストで Ollama 比約5倍のスループット。OpenAI互換 `/v1`。金融機関オンプレミスの標準へ収束 |
| **Ollama** | PoC / 開発 / エッジ | ワンコマンド展開、ローカル重み管理が容易。本番規模の同時性には不向き |
| **NVIDIA NIM** | 任意 | NVIDIA AI Enterprise ライセンス保有時にサポート契約 + FIPS検証イメージを利用可能。NVIDIA GPU専用 |

```bash
# 本番: vLLM（servingプロファイル）→ アプリ
docker compose --profile serving up -d
docker compose up -d ort

# PoC: Ollama（pocプロファイル）
docker compose --profile poc up -d
```

アプリは OpenAI 互換 base URL で接続します（`docker-compose.yml` に設定済み）:

```
OPENWEIGHT_BASE_URL=http://vllm:8000/v1
```

クラウドAPI（DeepSeek/GLM）は `ORT_PROVIDER=deepseek`/`glm` とキーを設定します —
任務データの外部持ち出しが許可されている場合に限ります。

---

## 階層4 — レッドチームアプリケーション

`ort` はリポジトリの `Dockerfile` でコンテナ化され、Harbor 経由でデプロイされます。

適用済みの強化策:

- **非rootユーザー**（`ort`）ランタイムステージ
- **読み取り専用ルートファイルシステム**（`read_only: true` + `tmpfs /tmp`）
- **リソース制限**（CPU/メモリ上限）
- **capability 削除**（`cap_drop: ALL`）と `no-new-privileges`
- `skills/` をイメージに同梱 — デプロイ後は完全オフラインで動作

```bash
docker build -t open-ai-red-team:latest .
docker run --rm -it --read-only --tmpfs /tmp \
  -e ORT_PROVIDER=openweight \
  -e OPENWEIGHT_BASE_URL=http://vllm:8000/v1 \
  -e OPENWEIGHT_MODEL=qwen2.5-32b \
  --network redteam_redteam open-ai-red-team:latest chat
```

---

## 階層5 — 認証・監査・監視

### アクセス制御 — Keycloak

- 分離ネットワーク内の OIDC 互換 IdP → オペレータの SSO + RBAC
- 監査ロギングと規制要件（BAIT/VAIT 類似の監督体制）を充足
- Compose プロファイル `auth`；本番は `--import-realm` を推奨

```bash
docker compose --profile auth up -d   # http://localhost:8080
```

### LLM 可観測性・監査 — LangFuse

- プロンプト・応答・トークン・レイテンシを収集 → 運用品質と監査証跡を両立
- オンプレミス展開で任務データを完全に統制

```bash
docker compose --profile observability up -d   # http://localhost:3000
```

### インフラ監視 — Prometheus / Grafana（+ Loki 任意）

- vLLM `/metrics`・Ollama `/metrics` は `deploy/monitoring/prometheus/prometheus.yml` に設定済み
- Grafana データソースはプロビジョニング済み
- Loki（任意）: ログ集約と保存

```bash
docker compose --profile monitoring up -d   # Grafana http://localhost:3001
```

---

## ツール一覧

| 階層 | 推奨ツール | 役割 |
|------|-----------|------|
| レジストリ | **Harbor** | プライベートイメージ保存、Trivy統合スキャン、署名検証 |
| スキャン/SBOM | **Trivy** | CVEスキャン、SBOM（SPDX/CycloneDX）、IaC/シークレットスキャン |
| 署名 | **Cosign** | イメージ整合性、署名検証 |
| オーケストレーション | **Docker Compose**（小規模）/ **Kubernetes**（大規模） | コンテナオーケストレーション、ネットワークポリシー、シークレット |
| LLMサービング | **vLLM**（本番）/ **Ollama**（PoC） | OpenAI互換API、高スループット推論 |
| 認証 | **Keycloak** | OIDC IdP、SSO、RBAC、監査ログ |
| 可観測性 | **LangFuse**、**Prometheus/Grafana** | LLM可観測性、インフラ監視 |

## 優先順位

1. **最優先**: Harbor + Trivy — 全イメージの脆弱性スキャンとSBOMパイプラインを確保（基本セキュリティ要件）。
2. **本番**: LLMサービングは vLLM を選択し、アプリの OpenAI 互換プロバイダ設定で連携。
3. **ネットワーク分離対応**: インターネット網で skopeo/crane によりイメージを tar 保存 → セキュリティ検査 → 内部 Harbor へ搬入。
4. **監査・コンプライアンス**: Keycloak でアクセスを統制し、LangFuse で全LLM対話を記録。

このアーキテクチャは Open AI Red Team のモデル中立性とエアギャップ対応を最大化しつつ、韓国の
金融・公共機関が求めるサプライチェーンセキュリティ・ネットワーク分離・監査可能性を同時に満たします。
