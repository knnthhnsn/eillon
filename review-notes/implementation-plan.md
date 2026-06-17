# Implementation Plan — EILLON Review Loop 2026-06-17

## Accepted changes

| # | Change | Files | Risk |
|---|--------|-------|------|
| 1 | Fix JSON-LD availability on chapter pages | `asmara.html`, `massawa.html`, `ritual.html` | Low |
| 2 | oil-based → oil-rich in journal | `journal/fico-d-india.html` | Low |
| 3 | Remove hardcoded notify email | `lib/waitlist-notify.js` | Low |
| 4 | Privacy meta description accuracy | `privacy.html` | Low |
| 5 | CSS cache-bust sync | `journal.html`, `journal/*.html`, `privacy.html`, `terms.html`, `imprint.html`, `store.html` | Low |

## Rejected changes

See `suggestion-triage.md` — contact page, sample kit push, fake social proof, framework migration, Ritual commercialization.

## Why each edit matters

1. **Schema** — PreOrder on non-sale pages misleads crawlers and contradicts visible copy; OutOfStock matches "not yet available."
2. **oil-rich** — Brand vocabulary consistency across journal and product pages.
3. **Notify email** — Protects personal data; production should use `WAITLIST_NOTIFY_EMAIL` env.
4. **Privacy meta** — Accurate search snippet; no appointment form on site.
5. **CSS versions** — Ensures legal/journal pages pick up latest styles after deploy.

## Test steps

1. `npm run dev` — start local server
2. Curl each route — confirm 200
3. Grep JSON-LD on chapter pages — no PreOrder on asmara/massawa/ritual
4. Confirm waitlist forms retain correct `data-product-slug`
5. Confirm no console-required assets missing
6. Verify `lib/waitlist-notify.js` has no hardcoded email

## Routes to verify

`/`, `/store`, `/beles`, `/asmara`, `/massawa`, `/ritual`, `/journal`, `/journal/fico-d-india`, `/journal/the-bottle`, `/privacy`, `/terms`, `/imprint`

## Waitlist slug expectations

| Page | Slug | Status language |
|------|------|-----------------|
| `/beles` | `beles` | Waitlist open |
| `/asmara` | `asmara` | In production / updates |
| `/massawa` | `massawa` | Coming soon / notify |
| `/ritual` | `ritual` | Lab / not for sale |
| Store letter | `all` | Newsletter |
