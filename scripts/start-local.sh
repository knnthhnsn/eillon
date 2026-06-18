#!/usr/bin/env bash
# Pull latest main, verify out-of-stock copy, start dev server on :8080
set -euo pipefail
cd "$(dirname "$0")/.."

echo "→ Pulling main…"
git pull origin main

echo "→ Verifying out-of-stock marketing…"
node scripts/verify-out-of-stock.mjs

echo "→ Stopping any old server on :8080…"
pkill -f 'scripts/dev-server.py' 2>/dev/null || true
if command -v fuser >/dev/null 2>&1; then
  fuser -k 8080/tcp 2>/dev/null || true
fi
sleep 1

echo "→ Starting dev server…"
exec python3 scripts/dev-server.py
