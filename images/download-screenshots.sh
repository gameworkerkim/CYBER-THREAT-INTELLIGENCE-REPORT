#!/usr/bin/env bash
# CyberStrike 공식 스크린샷/GIF 다운로드 스크립트
# 사용법: 완전가이드.md 가 있는 폴더에서  ->  bash images/download-screenshots.sh
cd "$(dirname "$0")" || exit 1
BASE="https://docs.cyberstrike.io/docs/images"
dl() {
  code=$(curl -fsSL -o "$2" -w "%{http_code}" "$1" 2>/dev/null || echo "ERR")
  if [ "$code" = "200" ]; then echo "[OK]  $2"; else echo "[실패:$code] $2  (URL 확인: $1)"; rm -f "$2"; fi
}
echo "공식 스크린샷 다운로드 중..."
dl "$BASE/gifs/g01-first-run.gif"           "g01-first-run.gif"
dl "$BASE/screenshots/s01-installation.png" "s01-installation.png"
dl "$BASE/gifs/g02-auth-login.gif"          "g02-auth-login.gif"
dl "$BASE/screenshots/s02-auth.jpg"         "s02-auth.jpg"
dl "$BASE/screenshots/s03-tui-main.png"     "s03-tui-main.png"
echo "완료. images/ 폴더를 확인하세요. 실패 항목은 docs.cyberstrike.io/ko/docs/getting-started 에서 직접 저장하세요."
