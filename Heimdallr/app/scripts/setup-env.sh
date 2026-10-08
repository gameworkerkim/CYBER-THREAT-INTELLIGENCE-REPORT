#!/usr/bin/env bash
set -euo pipefail

echo "=============================================="
echo "  Heimdallr 환경 설정 (.env 생성)"
echo "=============================================="
echo ""

# 32바이트 랜덤 시크릿 생성 (openssl 우선, 없으면 /dev/urandom)
gen_secret() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex 32
  else
    od -An -N32 -tx1 /dev/urandom | tr -d ' \n'
  fi
}

JWT_SECRET="$(gen_secret)"
MASTER_KEY="$(gen_secret)"

# DATABASE_URL (환경 변수 우선, 없으면 입력 프롬프트)
if [[ -n "${DATABASE_URL:-}" ]]; then
  DB_URL="$DATABASE_URL"
  echo "DATABASE_URL: 환경 변수에서 가져왔습니다."
else
  read -r -p "Neon DATABASE_URL 입력: " DB_URL
fi

if [[ -z "$DB_URL" ]]; then
  echo "오류: DATABASE_URL 이 필요합니다." >&2
  exit 1
fi

cat > .env <<EOF
# Neon PostgreSQL (serverless)
DATABASE_URL=${DB_URL}

# JWT 서명 비밀 (자동 생성)
JWT_SECRET=${JWT_SECRET}

# LLM API 키 암호화용 마스터 키 (자동 생성)
MASTER_KEY=${MASTER_KEY}
EOF

echo ""
echo "✅ .env 파일을 생성했습니다."
echo "   JWT_SECRET / MASTER_KEY 는 32바이트 랜덤으로 자동 생성되었습니다."
echo ""

read -r -p "지금 DB 마이그레이션을 실행할까요? (npx drizzle-kit push) [y/N] " MIGRATE
if [[ "$MIGRATE" =~ ^[Yy]$ ]]; then
  npx drizzle-kit push
fi

echo ""
echo "완료. 아래 명령으로 시작할 수 있습니다:"
echo "  npm run dev     # 로컬 개발 서버 (vinext)"
echo "  npm run build   # 프로덕션 빌드"
echo "  npm run deploy  # Cloudflare Workers 배포"
echo ""
echo "⚠️  배포 시 JWT_SECRET / MASTER_KEY 는 Cloudflare 대시보드 또는"
echo "    cf CLI 로 Worker 시크릿으로 별도 등록해야 합니다 (README 참조)."
