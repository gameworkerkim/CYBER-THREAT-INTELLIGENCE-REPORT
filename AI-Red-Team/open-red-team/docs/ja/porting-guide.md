# 移植ガイド

**言語:** [English](../porting-guide.md)（基準） · [한국어](porting-guide.md) · 日本語（本ドキュメント） · [中文](porting-guide.md)

claude-red スキル（SKILL.md）をモデル非依存スキルへ移植する際の規則と手順。

## 移植順序

```
Web Application → Infrastructure & Red Team → API Security → Cloud → AI Security
       ↓ （全ライブラリ拡張）
Active Directory → Auth & Identity → Wireless → Mobile → IoT & Embedded →
Exploit Development → Fuzzing & Vuln Research → Reconnaissance →
Container & Kubernetes → CI/CD & Pipeline → Cryptography →
Privilege Escalation → Post-Exploitation → Forensics & C2 →
Supply Chain → Social Engineering → Network Attacks → Utility
```

23カテゴリ（79スキル）すべて完了。

## 変換規則

### 1. Frontmatter の拡張

元の frontmatter（`name`、`description`）を維持し、以下のフィールドを追加します。

| 追加フィールド | 規則 |
|----------------|------|
| `triggers` | スキルを起動するキーワード 6〜14個。小文字、類義語・ツール名・攻撃名を含む（英・韓）。正規表現は `/.../` 形式 |
| `category` | 移植カテゴリ（元ディレクトリと一致） |
| `model_note` | （任意）モデル別注意事項 |
| `source` | `https://github.com/SnailSploit/Claude-Red (MIT)` |

### 2. Claude 依存の除去

- "Claude Code"、"Claude.ai"、"claude-skills.json"、"Claude Skills システム" → モデル中立な表現へ
- 例: `cat SKILL.md | claude --system-file -` → ミドルウェアの `--skills` フラグの使い方
- Anthropic API/モデル名への言及 → OpenAI互換プロバイダ基準に一般化

### 3. 本文（マークダウン）の維持

- 攻撃手法の本文はそのまま維持（技術内容はモデル非依存）
- ツールコマンドはそのまま（Kali/セキュリティツールはプラットフォーム非依存）
- プロンプトペイロード節は維持（攻撃対象は*テスト対象システム*であり、運用モデルではない）

### 4. レガシーフォーマットの処理

一部のアップストリームスキルには YAML frontmatter がなく、`# SKILL:`、`## Metadata`、
`## Description`、`## Trigger Phrases`、`## Instructions for Claude` セクションを使用します。
`scripts/fetch-skills.ts` は両フォーマットを検出して変換します:

- `## Description` → frontmatter の `description`
- `## Metadata` / `## Trigger Phrases` → 削除（生成された frontmatter で代替）
- `## Instructions for Claude` → `## Instructions`

### 5. 検証チェックリスト

- [ ] 有効な YAML frontmatter（name/description/triggers/category）
- [ ] スキルごとにトリガーキーワード 6個以上
- [ ] 本文に Claude 固有表現がない（`grep -ri claude` — `source` フィールドのみ許容）
- [ ] `description` 200字以内（インデックス注入コスト）

## 自動化

```bash
# アップストリーム claude-red から79スキルを全件取得・変換
npm run fetch:skills
```

`scripts/fetch-skills.ts` の処理:

1. GitHub raw から各 SKILL.md をダウンロード
2. frontmatter をパース → `triggers`/`category`/`source` を自動生成
3. 本文の Claude 固有表現を置換（正規表現ルールテーブル）
4. `skills/<category>/<name>/SKILL.md` に保存
