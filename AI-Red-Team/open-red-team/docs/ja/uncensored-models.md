# 無検閲オープンウェイトモデル — ローカル AI レッドチームラボガイド

**言語:** [English](../uncensored-models.md)（基準） · [한국어](uncensored-models.md) · 日本語（本ドキュメント） · [中文](uncensored-models.md)

> ## ⚠️ 警告 — 使用前に必読
>
> WebベースのLLMは強い検閲を受け、ローカルLLM（Gemma、Qwen 等）も既定の安全アライメントを
> 備えているため、AIレッドチームテストは制約を受けがちです。本ガイドは **LM Studio** と
> Hugging Face の **無検閲（uncensored）GGUF 量子化モデル**を組み合わせ、**ローカル環境**で
> 制限なくモデルをテストする手順を説明します。
>
> - 無検閲モデルは**諸刃の剣**です。レッドチームには有用ですが、悪意ある利用者にも攻撃ツールを
>   与え得ます。テストは必ず**隔離されたオフラインのローカル環境**で行い、生成物を外部へ
>   漏らさないよう管理してください。
> - **許可された範囲内のみ**。すべてのテストは事前に許可されたエンゲージメント範囲内で行い、
>   関連法令と組織のセキュリティポリシーを遵守してください。
> - **極端な量子化は精度を犠牲にします**。Q2_K は高速ですが損失が大きく、精密な脆弱性分析・
>   コード生成には Q4_K_M 以上を推奨します。

---

## 1. LM Studio のインストール

1. **ダウンロードとインストール**
   - 公式サイト（<https://lmstudio.ai/>）からOSに合ったインストーラを入手。

2. **モデル保存先の変更（重要）**
   - LM Studio は既定でシステムドライブにモデルを保存し、容量不足を起こし得ます。
     大きな GGUF をダウンロードする**前**に保存先を変更してください。
   - **GUI**: LM Studio 起動 → 左下 **⚙️ Settings** → **Models Directory** →
     **Change / Browse** → 容量に余裕のあるドライブに新フォルダを作成・指定 → **再起動**。
   - **注**: 既にモデルを取得済みの場合は、先に新フォルダへファイルをコピーしてから
     パスを変更してください。

## 2. 無検閲 GGUF モデルのダウンロード

1. **Hugging Face モデルページ**
   - Qwen ベースの**無検閲（Heretic/Uncensored）**量子化モデル集、16GB以下のVRAMに最適化:
   - **URL**: `https://huggingface.co/mradermacher/Qwen3.8-9B-Distill-uncensored-heretic-GGUF/tree/main`

2. **VRAMに応じた量子化の選択**（Files and versions タブ）

   | 量子化 | サイズ | VRAM | 備考 |
   |--------|--------|------|------|
   | **Q2_K**（2bit） | 約3GB | 4〜8GB（RTX 3050/4050等） | 最速、品質〜80–85%、コード・数学で誤りがち |
   | **Q4_K_M**（4bit） | 約5GB | 8GB | **最良のバランス**（〜95–97%）、大半のレッドチーム作業に推奨 |
   | **Q8_0**（8bit） | 約8GB | 12GB以上 | ほぼ無損失（99%+） |

3. **モデルファイルの配置**
   - 取得した `.gguf` を手順1のフォルダへ LM Studio が認識する構造で配置:
     `モデル保存先/パブリッシャ/モデル名/ファイル.gguf`
   - **例**:
     `aaa/mradermacher/Qwen3.8-9B-Distill-uncensored-heretic-GGUF/Qwen3.8-9B-Distill-uncensored-heretic.Q2_K.gguf`

## 3. モデルのロードとテスト

1. LM Studio を再起動 → **Chat** タブ → 入力欄上部のドロップダウンでモデルを選択。
2. VRAMへ自動ロードされ、完了後チャット可能（RTX 4090 で Q2_K は約300トークン/秒）。
3. レッドチームプロンプトを適用 — 無検閲モデルは安全拒否なしで指示に従うため、
   **許可されたラボ範囲内に限り**ポリシー・セキュリティシナリオ分析、脆弱性分析、
   攻撃シナリオ生成を行います。

## 4. ビジョン（VLM）使用時の追加設定

画像入力を行うビジョン言語モデルには `mmproj` ファイルが必要です:

1. モデルページから `Qwen3.8-9B-Distill-uncensored-heretic.mmproj-Q8_0.gguf`（約624MB）を取得。
2. ファイル名の先頭に `mmproj-` を付与（例: `mmproj-Qwen3.8-…mmproj-Q8_0.gguf`）。
3. メインの `.gguf` モデルファイルと同じフォルダに配置。

## 5. Open AI Red Team との連携

LM Studio は `http://localhost:1234/v1` に **OpenAI互換API** を公開します —
ミドルウェアの `openweight` プロバイダへそのまま接続できます:

```bash
OPENWEIGHT_BASE_URL=http://localhost:1234/v1 \
OPENWEIGHT_MODEL=mradermacher/Qwen3.8-9B-Distill-uncensored-heretic-GGUF \
OPENWEIGHT_API_KEY=lm-studio \
node dist/src/cli.js chat --provider openweight
```

`.env` 形式:

```dotenv
ORT_PROVIDER=openweight
OPENWEIGHT_BASE_URL=http://localhost:1234/v1
OPENWEIGHT_MODEL=mradermacher/Qwen3.8-9B-Distill-uncensored-heretic-GGUF
OPENWEIGHT_API_KEY=lm-studio
# 小型モデル → 予算を縮小
ORT_MAX_CONTEXT=32768
ORT_SKILL_BUDGET=6000
```

> 注: 量子化モデルは詳細ペイロードの再現性が低いため、14B以下のモデルでは
> `ORT_MAX_SKILLS=1`・`ORT_INCLUDE_INDEX=off` を推奨（[モデルマトリクス](../model-matrix.md)）。

## 6. 注意事項 — 再掲 ⚠️

- **隔離**: テストは隔離されたオフラインのローカル環境で行い、生成物を外部へ漏らさないこと。
- **量子化のトレードオフ**: Q2_K は速度・VRAM効率優先で精度損失が大きい。精密な分析・
  コード生成は VRAM が許す範囲で Q4_K_M 以上を使用。
- **法的・倫理的責任**: 無検閲モデルによるすべてのテストは**事前に許可された範囲**内で、
  関連法令と組織のセキュリティポリシーを遵守すること。

## まとめ

| 手順 | 作業 | 備考 |
|:-----|:-----|:-----|
| **1. インストール** | LM Studio を導入し、モデル保存先を大容量ドライブへ変更 | `Settings → Models Directory` |
| **2. ダウンロード** | VRAMに合う無検閲 GGUF（Q2_K / Q4_K_M 等）を Hugging Face から取得 | Q2_K: 4〜8GB VRAM、Q4_K_M: 8GB推奨 |
| **3. 配置** | `モデル保存先/パブリッシャ/モデル名/ファイル.gguf` 構造 | LM Studio の認識要件 |
| **4. 実行** | Chat タブでモデルを選択しレッドチームプロンプトをテスト | ビジョンは `mmproj` を追加 |
| **5. 連携** | `openweight` プロバイダを `http://localhost:1234/v1` に設定 | OpenAI互換、アダプタ不要 |
