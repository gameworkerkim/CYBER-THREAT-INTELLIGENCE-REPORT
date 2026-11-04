# コンプライアンス統制

**言語:** [English](../compliance.md)（基準） · [한국어](compliance.md) · 日本語（本ドキュメント） · [中文](compliance.md)

この表は**本システムがコードで強制するもの**と**運用者・組織が自ら行うべきもの**を分離します。
Open AI Red Team は許可された任務のための方法論注入ミドルウェアであり、それ自体で ISMS-P・
金融セキュリティ規制・PCI-DSS・NIST を満たす認証ではありません。

## コードで強制される統制

| 統制ID | 機能 | 強制箇所 |
|--------|------|----------|
| SCOPE-1 | 範囲外ホスト/IPは**モデル呼び出し前に**拒否 | `src/safety.ts` + `src/index.ts`（`decision: deny`、呼び出し0回） |
| SCOPE-2 | 申告済みエンゲージメント範囲をシステムプロンプトへ注入し監査・トレースに記録 | `ORT_SCOPE` / `ORT_SCOPE_DOMAINS` |
| SCOPE-3 | 範囲宣言なしのダッシュボード起動を拒否 | ラボモードは `ORT_SCOPE_MODE=open` が必要 |
| AUTH-1 | ダッシュボードAPIは既定で施錠: 静的トークンまたはOIDC必須 | 認証なしはexit 1（`ORT_ALLOW_ANONYMOUS=1` 例外） |
| AUTH-2 | OIDC（Keycloak）RS256/JWKS検証、セッションはトークン `sub` に帰属 | `src/dashboard/oidc.ts`、`X-Ort-Session` |
| AUTH-3 | `/metrics` は認証必須（`ORT_METRICS_TOKEN` またはダッシュボード認証） | `src/dashboard/server.ts` |
| SESS-1 | 運用者別の会話分離（インメモリセッション、LRU上限、アイドル追い出し） | `src/sessions.ts` |
| AUDIT-1 | JSONL監査: ts, sessionId, operator, decision, flaggedTargets, matchedSkills, プロンプトSHA-256（原文なし） | `ORT_AUDIT_LOG` |
| AUDIT-2 | `ORT_AUDIT_REQUIRED=1` なら監査書込失敗時にリクエスト失敗 | `src/dashboard/server.ts` |
| BUDGET-1 | コンテキスト予算: スキル本文切詰め、履歴トリミング、巨大スキル `index_only` | `src/skills/inject.ts`、`src/index.ts` |
| OBS-1 | Prometheusメトリクス（リクエスト、遅延、トークン、RSS） | `/metrics` |
| OBS-2 | LangFuseトレーシング — **既定オフ**; 有効化するとプロンプト・応答全文がLangFuseへ送信 | `LANGFUSE_*` |

## 運用者・組織の責任（コードにはない）

| 統制ID | 責任 | 対象 |
|--------|------|------|
| ORG-1 | ネットワーク分離（망분리）、転送区間マルウェア検査、オフラインメディア管理 | 組織 |
| ORG-2 | Keycloakアカウント発行・RBACポリシー、運用者ID管理 | 組織 |
| ORG-3 | シークレット保管: APIキー、Keycloak/DBパスワード、署名鍵（Cosign）、キーローテーション | 組織 |
| ORG-4 | 監査ログの保存期間・保護ストレージ・レビュー手順 | 組織 |
| ORG-5 | Harborのイメージスキャン/署名ゲート（Trivyアダプタ、Cosignポリシー） | 組織 |
| ORG-6 | 任務承認記録（交戦規則、スコープ署名） | 運用者 |
| ORG-7 | 搬入GGUF/HFモデルの出自・ライセンスレビュー | 組織 |

## マッピング参考（情報提供）

- **ISMS-P / 金融セキュリティ規制**: AUDIT-*、AUTH-*、ORG-1..5がアクセス制御・ログ義務を技術的に
  支えますが、認証取得には組織自身の手続きが必要です。
- **PCI-DSS**: カードデータは処理せず、関連する試験方法論はスキルに存在します（例: V5.3.4参照）。
- **NIST**: スキル内のMITRE ATT&CK技法マッピングが参照であり、製品自体は最初の表の統制のみ実装します。

最初の表に**ない統制はすべて運用者の責任**とみなしてください。本製品が満たすとは主張しないでください。
