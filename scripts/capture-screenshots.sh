#!/usr/bin/env bash
# Capture EILLON page screenshots at key viewports.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="${1:-$ROOT/design-review/before}"
BASE_URL="${2:-http://localhost:8080}"
CHROME="${CHROME:-google-chrome}"
CHROME_PROFILE="${CHROME_PROFILE:-/tmp/eillon-chrome-screenshots}"

mkdir -p "$CHROME_PROFILE" "$OUT_DIR"

PAGES=(
  "home:/"
  "store:/store"
  "beles:/beles"
  "asmara:/asmara"
  "massawa:/massawa"
  "ritual:/ritual"
  "journal:/journal"
  "journal-fico:/journal/fico-d-india"
  "journal-bottle:/journal/the-bottle"
  "privacy:/privacy"
  "terms:/terms"
  "imprint:/imprint"
)

VIEWPORTS=(
  "desktop-1440:1440,1000"
  "desktop-1920:1920,1080"
  "laptop-1280:1280,800"
  "tablet-1024:1024,1366"
  "tablet-768:768,1024"
  "mobile-430:430,932"
  "mobile-390:390,844"
  "mobile-360:360,800"
)

capture() {
  local name="$1" url="$2" size="$3" outfile="$4"
  "$CHROME" \
    --headless=new \
    --disable-gpu \
    --no-sandbox \
    --disable-dev-shm-usage \
    --user-data-dir="$CHROME_PROFILE" \
    --virtual-time-budget=8000 \
    --hide-scrollbars \
    --window-size="$size" \
    --screenshot="$outfile" \
    "$url" 2>/dev/null || true
  if [[ -f "$outfile" && -s "$outfile" ]]; then
    echo "  ✓ $name"
  else
    echo "  ✗ $name (failed)"
  fi
}

echo "Capturing to $OUT_DIR from $BASE_URL"

for vp in "${VIEWPORTS[@]}"; do
  vp_label="${vp%%:*}"
  vp_size="${vp##*:}"
  echo "Viewport: $vp_label ($vp_size)"
  for page in "${PAGES[@]}"; do
    page_name="${page%%:*}"
    page_path="${page##*:}"
    outfile="$OUT_DIR/${page_name}-${vp_label}.png"
    capture "${page_name}-${vp_label}" "${BASE_URL}${page_path}" "$vp_size" "$outfile"
  done
done

echo "Done. $(find "$OUT_DIR" -name '*.png' | wc -l) screenshots."
