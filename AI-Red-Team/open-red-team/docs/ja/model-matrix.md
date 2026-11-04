# モデル互換マトリクス

**言語:** [English](../model-matrix.md)（基準） · [한국어](model-matrix.md) · 日本語（本ドキュメント） · [中文](model-matrix.md)

## DeepSeek

| 項目 | 値 |
|------|-----|
| API | `https://api.deepseek.com/v1` — OpenAI互換 |
| モデル | `deepseek-chat`（V3, 64K）、`deepseek-reasoner`（R1） |
| コンテキスト | 64K（128Kベータ） |
| システムプロンプト | 対応 |
| ストリーミング | 対応 |
| 関数呼び出し | 対応（限定的） |

特記事項:
- `deepseek-reasoner` はシステムプロンプト注入に対応するが内部でCoT生成 → 大きなスキル本文で応答遅延が増加
- オフェンシブプロンプトの指示遵守率が高い
- reasoningモードで温度1.0付近ではスキル指示から逸脱しやすい — `deepseek-chat` を推奨

## GLM（Zhipu BigModel）

| 項目 | 値 |
|------|-----|
| API | `https://open.bigmodel.cn/api/paas/v4` — OpenAI互換 |
| モデル | `glm-4-plus`、`glm-4-air`、`glm-4-flash` |
| コンテキスト | 128K |
| システムプロンプト | 対応 |
| ストリーミング | 対応 |
| 関数呼び出し | 対応 |

特記事項:
- 一部モデルは `reasoning_content` フィールドを別途返す — ミドルウェアでマージ処理
- ツール使用時のメッセージ形式がOpenAIと微妙に異なる — テキストチャットでは無関係
- `glm-4-flash` は無料ティア — 大規模スキルインデックス注入に適する

## オープンウェイト（Ollama / vLLM / LM Studio）

| 項目 | 値 |
|------|-----|
| API | Ollama `http://localhost:11434/v1`、vLLM `.../v1` — OpenAI互換 |
| モデル | `qwen2.5:32b`、`deepseek-r1:32b`、`llama3.1:70b`、`mistral:7b` 等 |
| コンテキスト | モデル依存（4K–128K） |
| システムプロンプト | ほぼ対応 |
| ストリーミング | 対応 |

特記事項:
- 7B級モデルはスキル本文1件超の注入で指示遵守率が急落 → `ORT_MAX_SKILLS=1`
- GGUF量子化モデルは詳細ペイロード（SQLi/シェルコード）の再現性が低い — 32B以上を推奨
- Ollamaは `keep_alive`/`num_ctx` でコンテキスト拡張が可能
- **無検閲GGUFラボ（LM Studio）**: Webモデルの検閲・既定の安全アライメントが制約となる
  AIレッドチームテストには [無検閲オープンウェイトモデルガイド](uncensored-models.md) を参照 —
  LM Studio は `http://localhost:1234/v1` にOpenAI互換APIを公開し、`openweight` プロバイダへ
  直接接続できます。⚠️ 隔離・許可された環境のみで使用。

## 共通の制約

| 項目 | Claude（元） | OpenAI互換モデル（本プロジェクト） |
|------|--------------|-----------------------------------|
| ネイティブスキルシステム | ○ | × → ミドルウェアが再現 |
| ツール実行（Bash等） | ○ | × → ツールコマンドの提示のみ |
| マルチターンエージェントループ | ○ | 限定的 → CLIセッションで代替 |

## 推奨設定

| シナリオ | provider | model | ORT_MAX_SKILLS |
|----------|----------|-------|----------------|
| クラウド高性能 | deepseek | deepseek-chat | 3 |
| 中国リージョン | glm | glm-4-plus | 3 |
| 無料ティア | glm | glm-4-flash | 2 |
| ローカル32B+ | openweight | qwen2.5:32b | 2 |
| ローカル7B–14B | openweight | qwen2.5:14b | 1 |
