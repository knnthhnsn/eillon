# Implementation Plan — 2026-06-18

## Accepted changes

| # | Change | Files | Why | Risk |
|---|--------|-------|-----|------|
| 1 | Asmara/Massawa schema `OutOfStock` | `asmara.html`, `massawa.html` | Schema must not claim preorder for non-purchasable chapters | Low |
| 2 | Remove Ritual `offers` block | `ritual.html` | Lab study is not for sale | Low |
| 3 | Beles boutique card overlay label | `script.js`, `styles.css`, `store.html` | Store cards must show name + status | Low |
| 4 | Journal oil-rich copy | `journal/fico-d-india.html` | Brand terminology consistency | None |
| 5 | Footer link rename | `index.html` | Avoid fake stockist implication | None |
| 6 | Search overlay studio label | `index.html` | Navigation clarity | None |
| 7 | Remove hardcoded notify email | `lib/waitlist-notify.js` | Secrets/privacy safety | Low |

## Rejected changes

See `suggestion-triage.md` rejected table.

## Test steps

1. `python3 scripts/dev-server.py` — verify all routes return 200
2. `/store` — confirm four product cards render; Beles shows “Waitlist open” + name overlay
3. Waitlist forms — confirm `data-product-slug` on beles/asmara/massawa/ritual/newsletter
4. View page source — verify schema on asmara/massawa/ritual
5. `/journal/fico-d-india` — confirm “oil-rich” in CTA
6. Homepage footer — “Copenhagen studio” link works
7. No JS console errors on key pages (manual/browser)

## Deployment

- Safe to deploy — static HTML/CSS/JS + serverless notify tweak
- **Env required for admin notifications:** `WAITLIST_NOTIFY_EMAIL` or `ADMIN_NOTIFY_EMAIL`, plus `RESEND_API_KEY`
- Manual check: store boutique grid on mobile after deploy
