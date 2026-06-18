# Implementation Plan — 2026-06-18 (09:01 UTC cron)

## Accepted changes (this run)

| # | Change | Files | Why | Risk |
|---|--------|-------|-----|------|
| 1 | Remove stray `</a>` in search overlay | `index.html` | Broken HTML in search panel | None |
| 2 | Fix package.json comma | `package.json` | Invalid JSON breaks npm scripts | None |
| 3 | Privacy restock-list copy | `privacy.html` | Legal text must match out-of-stock status | None |
| 4 | Journal URLs in llms.txt | `llms.txt` | AI crawler discoverability | None |

## Prior-loop changes (verified, unchanged this run)

See `final-report.md` prior sections for schema, store cards, notify safety, etc.

## Rejected changes

See `suggestion-triage.md` rejected table.

## Test steps

1. `python3 scripts/dev-server.py` — verify all routes return 200
2. `node scripts/verify-out-of-stock.mjs` — confirm out-of-stock marketing
3. `node -e "JSON.parse(require('fs').readFileSync('package.json'))"` — valid JSON
4. Homepage — anchor tag open/close balance; search overlay items render
5. `/privacy` — restock-list language, no "Beles waitlist"
6. Waitlist forms — `data-product-slug` on beles/asmara/massawa/ritual/newsletter
7. Schema — asmara/massawa `OutOfStock`; ritual no `PreOrder`

## Deployment

- Safe to deploy — small HTML/legal/JSON fixes
- **Env for admin notifications:** `WAITLIST_NOTIFY_EMAIL` or `ADMIN_NOTIFY_EMAIL`, plus `RESEND_API_KEY`
- Manual check: homepage search overlay on mobile
