# アーキテクチャ

**言語:** [English](../architecture.md)（基準） · [한국어](architecture.md) · 日本語（本ドキュメント） · [中文](architecture.md)

## 概要

Open AI Red Team ミドルウェアは **Claude Skills システム**（progressive disclosure + トリガーベースのオンデマンドロード）を
OpenAI 互換 API しか持たないモデル（DeepSeek、GLM、オープンウェイト）上に再現するレイヤーです。

## コンポーネント

```
┌─────────────────────────────────────────────────────────────┐
│                          CLI / Library                       │
│                    src/cli.ts  ·  src/index.ts               │
├─────────────────────────────────────────────────────────────┤
│  Skill Engine                      Provider Layer            │
│  ┌──────────────────────┐          ┌──────────────────┐     │
│  │ loader.ts            │          │ base.ts          │     │
│  │  - SKILL.md パース   │          │  - OpenAI互換     │     │
│  │  - frontmatter/body  │          │    リクエスト/    │     │
│  ├──────────────────────┤          │    ストリーミング │     │
│  │ trigger.ts           │          ├──────────────────┤     │
│  │  - キーワード/正規表現│          │ deepseek.ts      │     │
│  │  - スコアリング      │          │ glm.ts           │     │
│  ├──────────────────────┤          │ openweight.ts    │     │
│  │ inject.ts            │          │  (Ollama/vLLM/   │     │
│  │  - システムプロンプト│          │   LM Studio 等)   │     │
│  │    組み立て         │          └──────────────────┘     │
│  └──────────────────────┘                                   │
├─────────────────────────────────────────────────────────────┤
│                     skills/ (移植済み SKILL.md)              │
└─────────────────────────────────────────────────────────────┘
```

## データフロー（1ターン）

```
ユーザー入力
   │
   ▼
1. トリガーマッチング ────────► 一致スキル一覧（スコア順、maxSkills で制限）
   │
   ▼
2. システムプロンプト組み立て
   │  ┌─ ベースプロンプト（オペレータペルソナ、交戦規則）
   │  ├─ スキルインデックス（全スキル: name + description + トリガーヒント）
   │  └─ 選択スキル本文（SKILL.md 全文）
   ▼
3. プロバイダ呼び出し（OpenAI互換 chat.completions）
   │
   ▼
4. レスポンスストリーミング → ユーザー
```

## スキルフォーマット

移植済みスキルは元の `SKILL.md` 構造を維持しつつ、frontmatter を拡張します。

```markdown
---
name: offensive-sqli
description: "SQL injection testing skill ..."
triggers:
  - "sql injection"
  - "sqli"
  - "sqlmap"
  - "sql 인젝션"
category: web
model_note: "모델 비종속 — OpenAI 호환 API(DeepSeek/GLM/Ollama 등)에서 동작"
source: "https://github.com/SnailSploit/Claude-Red (MIT)"
---

# SQL Injection — Offensive Testing Methodology
...
```

### フィールド

| フィールド | 必須 | 説明 |
|-----------|------|------|
| `name` | 必須 | スキル識別子（ディレクトリ名と一致） |
| `description` | 必須 | インデックスに常時注入される要約（200字以内） |
| `triggers` | 必須 | 自動ロード用キーワード/正規表現（`/regex/` 形式）、英・韓 |
| `category` | 必須 | 移植カテゴリ（web, infrastructure, api, cloud, ai, wireless 等） |
| `model_note` | 任意 | モデル別注意事項 |
| `source` | 任意 | 原典（出典表示） |

## Progressive Disclosure の再現

Claude Skills の核心原理 — **スキル本文は必要なときだけコンテキストに入る**:

1. **インデックス（description）は常時注入** — 79スキル × 約150字 ≈ 3Kトークン。
2. **本文はトリガー一致時のみ注入** — デフォルト最大3件（`ORT_MAX_SKILLS`）。
3. **明示的ロード** — `/use offensive-sqli` または `--skills` フラグ。

## プロバイダ抽象化

全対象が OpenAI 互換 API を提供するため、単一の `BaseProvider`（openai SDK）を使用します。

| プロバイダ | baseURL | 認証 | 特記事項 |
|-----------|---------|------|---------|
| DeepSeek | `https://api.deepseek.com/v1` | Bearer API key | `deepseek-reasoner` は `reasoning_content` を別途返す |
| GLM | `https://open.bigmodel.cn/api/paas/v4` | Bearer API key | 一部モデルは `reasoning_content` フィールドを返す |
| Open-weight | Ollama `http://localhost:11434/v1`, vLLM 等 | any/dummy | コンテキスト長・フォーマットのばらつき大 |

## 共通の制約

| 項目 | Claude（元） | OpenAI互換モデル（本プロジェクト） |
|------|--------------|-----------------------------------|
| ネイティブスキルシステム | ○ | × → ミドルウェアが再現 |
| ツール実行（Bash等） | ○ | × — 本リリースは方法論の注入のみで、ホスト上でコマンドを実行しません |
| マルチターンエージェントループ | ○ | 限定的 → CLI/ダッシュボードセッション |

## コンテキスト予算管理

- スキル本文は平均 8–15K トークン → 全インデックス + 最大3本文 ≈ 50K トークン。
- DeepSeek 64K–128K、GLM-4 128K、Qwen2.5 32K+ → デフォルト設定で収容可能。
- 小型オープンウェイトモデルは `ORT_MAX_SKILLS=1`、`ORT_INCLUDE_INDEX=off` を推奨。
