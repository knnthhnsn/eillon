# Implementation Plan — 2026-06-18 (10:01 UTC cron)

## Accepted changes

| # | Change | Files | Why | Risk |
|---|--------|-------|-----|------|
| 1 | Remove stray `</a>` in search overlay | `index.html` | Invalid HTML breaks search panel DOM | None |
| 2 | Fix package.json comma | `package.json` | Restores `npm run dev` / `npm run verify` | None |

## Rejected changes

See `suggestion-triage.md` rejected table.

## Prior loop (verified, no re-edit)

- Asmara/Massawa `OutOfStock` schema
- Ritual offers removed from JSON-LD
- Store boutique card out-of-stock overlays
- Journal oil-rich copy
- Copenhagen studio footer/search labels
- Hardcoded notify email removed from `waitlist-notify.js`
- Out-of-stock marketing sitewide

## Test steps

1. `node -e "JSON.parse(require('fs').readFileSync('package.json'))"` — valid JSON
2. `npm run verify` — out-of-stock marketing OK
3. `python3 scripts/dev-server.py` — all routes return 200
4. `/` — search overlay HTML valid (no stray `</a>`)
5. Waitlist forms — `data-product-slug` on beles/asmara/massawa/ritual/newsletter
6. Schema — asmara/massawa `OutOfStock`; ritual no offers

## Deployment

- Safe to deploy — two-line fixes
- No new environment variables
