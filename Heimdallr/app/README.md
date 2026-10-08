# Heimdallr — 앱 (vinext + Cloudflare Workers + Neon)

> ARTEX 컨셉을 계승한 방어 중심 자율 모의 침투 테스트 시스템의 프런트엔드/API.
> 프로젝트 개요·차별화·설계는 상위 폴더 `../` 의 문서를 참고하세요.

---

## 🚨 보안·오남용 경고

이 도구는 LLM 이 스스로 정찰·침투·자료 반출까지 수행할 수 있는 강력한 자율 공격 도구입니다. **자신이 소유하거나 서면으로 명시적 허가를 받은 대상에 대해서만, 방어·탐지 역량을 기르는 목적으로** 사용하십시오. 허가 없는 사용은 정보통신망법·개인정보보호법 위반 등 범죄가 됩니다. **모든 법적 책임과 결과는 사용자 본인이 부담합니다.**

---

## 요구 사항

- Node.js 24+
- **Neon** PostgreSQL 계정 (무료 티어 가능) → `DATABASE_URL`
- (배포 시) Cloudflare 계정

## 기술 스택

- **vinext** (Next.js 16 API on Vite 8) + `@cloudflare/vite-plugin` → Cloudflare Workers
- **Neon** (serverless PostgreSQL) + **Drizzle ORM**
- React 19 + Tailwind CSS v4 · `jose`(JWT) · Web Crypto(AES-GCM/PBKDF2) · Vercel AI SDK(예정)
- i18n: 커스텀 다국어(ko/en/zh/ja)

---

## 1. 환경 설정 (프라이빗 키 입력)

터미널 스크립트로 `.env` 를 생성합니다. `JWT_SECRET`·`MASTER_KEY` 는 자동으로 랜덤 생성되고, `DATABASE_URL`(Neon)만 입력하면 됩니다.

```bash
./scripts/setup-env.sh
```

스크립트가 하는 일:

1. `JWT_SECRET` / `MASTER_KEY` 를 32바이트 랜덤으로 생성
2. Neon `DATABASE_URL` 입력(또는 `DATABASE_URL` 환경 변수 사용)
3. `.env` 파일 생성
4. (선택) `npx drizzle-kit push` 로 DB 마이그레이션 실행

수동으로 하려면 `.env.example` 을 복사해 채우세요:

```bash
cp .env.example .env
# DATABASE_URL / JWT_SECRET / MASTER_KEY 입력
```

> 환경 변수: `DATABASE_URL`(Neon DSN), `JWT_SECRET`(JWT 서명), `MASTER_KEY`(LLM 키 암호화).

## 2. DB 마이그레이션

```bash
npx drizzle-kit push       # 스키마를 DB 에 즉시 반영
# 또는 마이그레이션 파일 생성: npx drizzle-kit generate
```

마이그레이션 SQL 은 `app/db/migrations/` 에 있습니다.

## 3. 실행

```bash
npm install        # 의존성 설치 (최초 1회)
npm run dev        # 로컬 개발 서버 (vinext)
npm run build      # 프로덕션 빌드
npm run start      # 빌드된 Worker 로컬 프리뷰
npm run deploy     # Cloudflare Workers 배포
```

## 4. 배포 시 Cloudflare 시크릿 등록

로컬 `.env` 의 `JWT_SECRET` / `MASTER_KEY` 는 배포 시 Worker 시크릿으로 등록해야 합니다.
Cloudflare 대시보드(Workers → Settings → Variables & Secrets)에서 등록하거나, `cf` CLI 를 사용합니다.

`DATABASE_URL` 역시 Worker 환경 변수/시크릿으로 등록해야 합니다.

---

## 디렉터리 구조

```
app/
  app/                  # Next.js App Router 루트
    api/auth/           # 회원가입·로그인·로그아웃·세션
    api/keys/           # LLM 키 관리 (AES-256-GCM 암호화)
    api/domains/        # 도메인 검증 (토큰 + 24h)
    db/                 # Drizzle 스키마·마이그레이션
    lib/                # jwt, password, crypto, email, session, http
    i18n/               # 다국어 사전·훅
    components/         # 공용 컴포넌트 (SiteHeader 등)
    login/ signup/ dashboard/ keys/ domains/  # 페이지
  scripts/setup-env.sh  # 프라이빗 키 환경 설정 스크립트
  drizzle.config.ts     # Drizzle 설정
  cloudflare.config.ts  # Cloudflare Worker 설정
```

## 현재 구현 상태 (Phase 1)

| 항목 | 상태 |
|---|---|
| 1.1 스캐폴드 | ✅ |
| 1.2 인증 (JWT + PBKDF2) | ✅ |
| 1.3 LLM 키 관리 (AES-GCM) | ✅ |
| 1.4 도메인 검증 (토큰 + 24h) | ✅ |
| 1.5 i18n (ko/en/zh/ja) | ✅ |
| Phase 2 (멀티 에이전트) | 진행 전 |
