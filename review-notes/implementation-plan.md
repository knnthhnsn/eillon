# Implementation Plan — EILLON Review Loop 2026-06-17

## Accepted changes

| # | Change | Files | Risk |
|---|--------|-------|------|
| 1 | Chapter JSON-LD `OutOfStock` | asmara.html, massawa.html, ritual.html | Low |
| 2 | Remove hardcoded notify email | lib/waitlist-notify.js | Low |
| 3 | CSS v=105, script v=66 | privacy, terms, imprint, journal.html, journal/*, store.html, index.html, beles, asmara, massawa, ritual, about, craftsmanship, shipping | Low |
| 4 | Footer link label | index.html | Low |
| 5 | Search label | index.html | Low |
| 6 | Sample option wording | asmara.html, massawa.html, ritual.html | Low |

## Rejected changes

See `suggestion-triage.md` — generic contact page, sample kit push, fake stockists, framework migration, purchasable future chapters.

## Why each edit matters

1. **Schema** — Prevents Google from interpreting unreleased chapters as preorder products.
2. **Email** — Protects personal data; env vars are the single source of truth.
3. **Cache versions** — Ensures legal/journal/store pages get current CSS and waitlist JS.
4. **Labels** — Removes misleading "stockist" and generic "appointments" language.
5. **Sample wording** — Keeps editorial tone on future chapter signups.

## Test steps

1. `python3 scripts/dev-server.py` on port 8080
2. Curl or fetch each route — confirm 200
3. Verify waitlist forms: `data-product-slug` on beles, asmara, massawa, ritual, newsletter `all`
4. Check JSON-LD in chapter pages for `OutOfStock`
5. Confirm no console errors on homepage and store (product grid renders)
6. Verify `lib/waitlist-notify.js` has no hardcoded personal email

## Routes to verify

`/`, `/store`, `/beles`, `/asmara`, `/massawa`, `/ritual`, `/journal`, `/journal/fico-d-india`, `/journal/the-bottle`, `/privacy`, `/terms`, `/imprint`
