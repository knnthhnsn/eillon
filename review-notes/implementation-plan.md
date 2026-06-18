# Implementation Plan — 2026-06-18 (11:00 UTC run)

## Accepted changes

| # | Change | Files | Why | Risk |
|---|--------|-------|-----|------|
| 1 | Fix search overlay studio link + label | `scripts/site-nav.js` | Global search still pointed to dead `#stockists` anchor and implied stockists | None |
| 2–7 | Prior loop items | various | Already deployed on branch — verified this run | Low |

## Rejected changes

See `suggestion-triage.md` rejected table.

## Test steps

1. `npm run dev` — verify all routes return 200
2. Open search overlay on `/store` — confirm “Copenhagen studio” item links to `/#studio`
3. Open search overlay on `/` — confirm same item scrolls to `#studio`
4. Waitlist forms — confirm `data-product-slug` on beles/asmara/massawa/ritual/newsletter
5. View page source — verify schema on asmara/massawa/ritual
6. `npm run verify` — out-of-stock marketing consistency

## Deployment

- Safe to deploy — one-line navigation fix in shared nav script
- **Env required for admin notifications:** `WAITLIST_NOTIFY_EMAIL` or `ADMIN_NOTIFY_EMAIL`, plus `RESEND_API_KEY`
- Manual check: search overlay studio link on mobile after deploy
