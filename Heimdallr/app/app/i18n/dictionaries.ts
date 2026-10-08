export const locales = ["ko", "en", "zh", "ja"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ko";

export interface Dictionary {
  brand: string;
  nav_dashboard: string;
  nav_keys: string;
  nav_domains: string;
  nav_login: string;
  nav_logout: string;

  landing_eyebrow: string;
  landing_title: string;
  landing_subtitle: string;
  landing_start: string;
  landing_login: string;

  login_title: string;
  login_email: string;
  login_password: string;
  login_submit: string;
  login_loading: string;
  login_no_account: string;
  login_signup: string;

  signup_title: string;
  signup_email: string;
  signup_password: string;
  signup_submit: string;
  signup_loading: string;
  signup_has_account: string;
  signup_login: string;

  dashboard_title: string;
  dashboard_loading: string;
  dashboard_email_domain: string;
  dashboard_llm_keys: string;
  dashboard_domains: string;
  dashboard_tasks: string;
  dashboard_registered: string;
  dashboard_phase2: string;

  keys_title: string;
  keys_subtitle: string;
  keys_provider: string;
  keys_api_key: string;
  keys_model: string;
  keys_max_tokens: string;
  keys_add: string;
  keys_loading: string;
  keys_empty: string;
  keys_delete: string;
  keys_save_fail: string;

  domains_title: string;
  domains_subtitle: string;
  domains_placeholder: string;
  domains_register: string;
  domains_loading: string;
  domains_empty: string;
  domains_status: string;
  domains_verified: string;
  domains_expired: string;
  domains_pending: string;
  domains_expires: string;
  domains_issue_token: string;
  domains_token_title: string;
  domains_token_instructions: string;
  domains_verify: string;
  domains_verifying: string;

  switch_language: string;
}

export const dictionaries: Record<Locale, Dictionary> = {
  ko: {
    brand: "Heimdallr",
    nav_dashboard: "대시보드",
    nav_keys: "LLM 키",
    nav_domains: "도메인",
    nav_login: "로그인",
    nav_logout: "로그아웃",

    landing_eyebrow: "Heimdallr",
    landing_title: "LLM 멀티 에이전트 자율 모의 침투 테스트",
    landing_subtitle:
      "ARTEX 컨셉을 계승한 방어 중심 · 권한 검증 기반 시스템. 자신의 LLM 키로 검증된 도메인에 대해 모의 테스트를 수행하고, 그 결과를 재사용 가능한 방어 지식으로 축적합니다.",
    landing_start: "시작하기",
    landing_login: "로그인",

    login_title: "로그인",
    login_email: "이메일",
    login_password: "비밀번호",
    login_submit: "로그인",
    login_loading: "로그인 중...",
    login_no_account: "계정이 없으신가요?",
    login_signup: "회원가입",

    signup_title: "회원가입",
    signup_email: "이메일",
    signup_password: "비밀번호 (8자 이상)",
    signup_submit: "회원가입",
    signup_loading: "가입 중...",
    signup_has_account: "이미 계정이 있으신가요?",
    signup_login: "로그인",

    dashboard_title: "대시보드",
    dashboard_loading: "로딩 중...",
    dashboard_email_domain: "이메일 도메인",
    dashboard_llm_keys: "LLM 키",
    dashboard_domains: "도메인",
    dashboard_tasks: "작업",
    dashboard_registered: "등록됨",
    dashboard_phase2: "Phase 2 예정",

    keys_title: "LLM 키 관리 (BYOK)",
    keys_subtitle: "키는 AES-256-GCM 으로 암호화 저장되며, 평문은 노출되지 않습니다.",
    keys_provider: "공급자",
    keys_api_key: "API 키",
    keys_model: "모델 (예: gpt-4o)",
    keys_max_tokens: "max_tokens",
    keys_add: "키 추가",
    keys_loading: "저장 중...",
    keys_empty: "등록된 키가 없습니다.",
    keys_delete: "삭제",
    keys_save_fail: "저장에 실패했습니다.",

    domains_title: "도메인 검증",
    domains_subtitle:
      "대상 도메인에 소속된 이메일로 가입하고, 난독화 토큰으로 소유권을 증명하면 24시간 한정 모의 테스트 권한이 부여됩니다.",
    domains_placeholder: "도메인 (예: mycompany.com)",
    domains_register: "도메인 등록",
    domains_loading: "등록 중...",
    domains_empty: "등록된 도메인이 없습니다.",
    domains_status: "상태",
    domains_verified: "검증됨",
    domains_expired: "만료",
    domains_pending: "대기",
    domains_expires: "만료",
    domains_issue_token: "토큰 발급",
    domains_token_title: "소유권 검증 토큰",
    domains_token_instructions:
      "아래 경로에 토큰을 배치하세요. 파일명과 내용을 모두 토큰 값으로 설정한 뒤 검증을 눌러주세요.",
    domains_verify: "검증하기",
    domains_verifying: "검증 중...",

    switch_language: "언어",
  },
  en: {
    brand: "Heimdallr",
    nav_dashboard: "Dashboard",
    nav_keys: "LLM Keys",
    nav_domains: "Domains",
    nav_login: "Login",
    nav_logout: "Log out",

    landing_eyebrow: "Heimdallr",
    landing_title: "LLM multi-agent autonomous penetration testing",
    landing_subtitle:
      "A defense-first, authorization-verified system that inherits the ARTEX concept. Run simulations against verified domains with your own LLM key, and turn results into reusable defensive knowledge.",
    landing_start: "Get started",
    landing_login: "Login",

    login_title: "Login",
    login_email: "Email",
    login_password: "Password",
    login_submit: "Login",
    login_loading: "Logging in...",
    login_no_account: "Don't have an account?",
    login_signup: "Sign up",

    signup_title: "Sign up",
    signup_email: "Email",
    signup_password: "Password (8+ characters)",
    signup_submit: "Sign up",
    signup_loading: "Signing up...",
    signup_has_account: "Already have an account?",
    signup_login: "Login",

    dashboard_title: "Dashboard",
    dashboard_loading: "Loading...",
    dashboard_email_domain: "Email domain",
    dashboard_llm_keys: "LLM Keys",
    dashboard_domains: "Domains",
    dashboard_tasks: "Tasks",
    dashboard_registered: "registered",
    dashboard_phase2: "Planned in Phase 2",

    keys_title: "LLM Key Management (BYOK)",
    keys_subtitle:
      "Keys are stored encrypted with AES-256-GCM and never exposed in plaintext.",
    keys_provider: "Provider",
    keys_api_key: "API key",
    keys_model: "Model (e.g. gpt-4o)",
    keys_max_tokens: "max_tokens",
    keys_add: "Add key",
    keys_loading: "Saving...",
    keys_empty: "No keys registered.",
    keys_delete: "Delete",
    keys_save_fail: "Failed to save.",

    domains_title: "Domain Verification",
    domains_subtitle:
      "Sign up with an email on the target domain and prove ownership with an obfuscated token to receive 24-hour limited test authorization.",
    domains_placeholder: "Domain (e.g. mycompany.com)",
    domains_register: "Register domain",
    domains_loading: "Registering...",
    domains_empty: "No domains registered.",
    domains_status: "Status",
    domains_verified: "Verified",
    domains_expired: "Expired",
    domains_pending: "Pending",
    domains_expires: "expires",
    domains_issue_token: "Issue token",
    domains_token_title: "Ownership Verification Token",
    domains_token_instructions:
      "Place the token at the path below. Set both the file name and content to the token value, then click Verify.",
    domains_verify: "Verify",
    domains_verifying: "Verifying...",

    switch_language: "Language",
  },
  zh: {
    brand: "Heimdallr",
    nav_dashboard: "仪表盘",
    nav_keys: "LLM 密钥",
    nav_domains: "域名",
    nav_login: "登录",
    nav_logout: "退出登录",

    landing_eyebrow: "Heimdallr",
    landing_title: "LLM 多智能体自主渗透测试",
    landing_subtitle:
      "继承 ARTEX 理念的防御优先、授权验证型系统。使用您自己的 LLM 密钥对已验证域名进行模拟测试，并将结果转化为可复用的防御知识。",
    landing_start: "开始使用",
    landing_login: "登录",

    login_title: "登录",
    login_email: "邮箱",
    login_password: "密码",
    login_submit: "登录",
    login_loading: "登录中...",
    login_no_account: "还没有账户？",
    login_signup: "注册",

    signup_title: "注册",
    signup_email: "邮箱",
    signup_password: "密码（至少 8 位）",
    signup_submit: "注册",
    signup_loading: "注册中...",
    signup_has_account: "已有账户？",
    signup_login: "登录",

    dashboard_title: "仪表盘",
    dashboard_loading: "加载中...",
    dashboard_email_domain: "邮箱域名",
    dashboard_llm_keys: "LLM 密钥",
    dashboard_domains: "域名",
    dashboard_tasks: "任务",
    dashboard_registered: "已注册",
    dashboard_phase2: "第二阶段规划",

    keys_title: "LLM 密钥管理（BYOK）",
    keys_subtitle: "密钥使用 AES-256-GCM 加密存储，绝不暴露明文。",
    keys_provider: "提供商",
    keys_api_key: "API 密钥",
    keys_model: "模型（如 gpt-4o）",
    keys_max_tokens: "max_tokens",
    keys_add: "添加密钥",
    keys_loading: "保存中...",
    keys_empty: "尚未注册密钥。",
    keys_delete: "删除",
    keys_save_fail: "保存失败。",

    domains_title: "域名验证",
    domains_subtitle:
      "使用目标域名所属邮箱注册，并通过混淆令牌证明所有权，即可获得 24 小时限时测试授权。",
    domains_placeholder: "域名（如 mycompany.com）",
    domains_register: "注册域名",
    domains_loading: "注册中...",
    domains_empty: "尚未注册域名。",
    domains_status: "状态",
    domains_verified: "已验证",
    domains_expired: "已过期",
    domains_pending: "待验证",
    domains_expires: "过期",
    domains_issue_token: "签发令牌",
    domains_token_title: "所有权验证令牌",
    domains_token_instructions:
      "请将令牌放置在下方路径。将文件名和内容都设置为令牌值，然后点击验证。",
    domains_verify: "验证",
    domains_verifying: "验证中...",

    switch_language: "语言",
  },
  ja: {
    brand: "Heimdallr",
    nav_dashboard: "ダッシュボード",
    nav_keys: "LLM キー",
    nav_domains: "ドメイン",
    nav_login: "ログイン",
    nav_logout: "ログアウト",

    landing_eyebrow: "Heimdallr",
    landing_title: "LLM マルチエージェント自律型ペネトレーションテスト",
    landing_subtitle:
      "ARTEX のコンセプトを継承した防御優先・権限検証型システム。ご自身の LLM キーで検証済みドメインに模擬テストを行い、結果を再利用可能な防御知識として蓄積します。",
    landing_start: "はじめる",
    landing_login: "ログイン",

    login_title: "ログイン",
    login_email: "メール",
    login_password: "パスワード",
    login_submit: "ログイン",
    login_loading: "ログイン中...",
    login_no_account: "アカウントをお持ちでないですか？",
    login_signup: "登録",

    signup_title: "登録",
    signup_email: "メール",
    signup_password: "パスワード（8文字以上）",
    signup_submit: "登録",
    signup_loading: "登録中...",
    signup_has_account: "すでにアカウントをお持ちですか？",
    signup_login: "ログイン",

    dashboard_title: "ダッシュボード",
    dashboard_loading: "読み込み中...",
    dashboard_email_domain: "メールドメイン",
    dashboard_llm_keys: "LLM キー",
    dashboard_domains: "ドメイン",
    dashboard_tasks: "タスク",
    dashboard_registered: "登録済み",
    dashboard_phase2: "Phase 2 で予定",

    keys_title: "LLM キー管理（BYOK）",
    keys_subtitle:
      "キーは AES-256-GCM で暗号化して保存され、平文は公開されません。",
    keys_provider: "プロバイダー",
    keys_api_key: "API キー",
    keys_model: "モデル（例: gpt-4o）",
    keys_max_tokens: "max_tokens",
    keys_add: "キーを追加",
    keys_loading: "保存中...",
    keys_empty: "登録されたキーはありません。",
    keys_delete: "削除",
    keys_save_fail: "保存に失敗しました。",

    domains_title: "ドメイン検証",
    domains_subtitle:
      "対象ドメインに属するメールで登録し、難読化トークンで所有権を証明すると、24時間限定のテスト権限が付与されます。",
    domains_placeholder: "ドメイン（例: mycompany.com）",
    domains_register: "ドメインを登録",
    domains_loading: "登録中...",
    domains_empty: "登録されたドメインはありません。",
    domains_status: "ステータス",
    domains_verified: "検証済み",
    domains_expired: "期限切れ",
    domains_pending: "待機中",
    domains_expires: "期限",
    domains_issue_token: "トークン発行",
    domains_token_title: "所有権検証トークン",
    domains_token_instructions:
      "以下のパスにトークンを配置してください。ファイル名と内容をトークン値に設定し、検証を押してください。",
    domains_verify: "検証する",
    domains_verifying: "検証中...",

    switch_language: "言語",
  },
};

export function getDictionary(locale: string): Dictionary {
  return dictionaries[(locale as Locale) in dictionaries ? (locale as Locale) : defaultLocale];
}
