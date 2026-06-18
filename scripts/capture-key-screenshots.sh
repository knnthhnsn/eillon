#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="${1:-/workspace/design-review/before}"
BASE_URL="${2:-http://localhost:8080}"
CHROME="${CHROME:-google-chrome}"

mkdir -p "$OUT_DIR"

capture() {
  local name="$1" path="$2" size="$3"
  local profile="/tmp/eillon-shot-$$-$RANDOM"
  local outfile="$OUT_DIR/${name}.png"
  mkdir -p "$profile"
  timeout 25 "$CHROME" --headless=new --no-sandbox --disable-dev-shm-usage \
    --user-data-dir="$profile" --virtual-time-budget=6000 \
    --hide-scrollbars --window-size="$size" \
    --screenshot="$outfile" "${BASE_URL}${path}" 2>/dev/null || true
  rm -rf "$profile"
  [[ -s "$outfile" ]] && echo "✓ $name" || echo "✗ $name"
}

capture "home-desktop-1440" "/" "1440,1000"
capture "home-mobile-390" "/" "390,844"
capture "store-desktop-1440" "/store" "1440,1000"
capture "store-mobile-390" "/store" "390,844"
capture "beles-desktop-1440" "/beles" "1440,1000"
capture "beles-mobile-390" "/beles" "390,844"
capture "asmara-desktop-1440" "/asmara" "1440,1000"
capture "ritual-desktop-1440" "/ritual" "1440,1000"
capture "journal-desktop-1440" "/journal" "1440,1000"
capture "privacy-mobile-390" "/privacy" "390,844"

echo "Done: $(find "$OUT_DIR" -maxdepth 1 -name '*.png' ! -name 'test-*' | wc -l) screenshots"
