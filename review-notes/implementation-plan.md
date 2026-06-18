# Implementation Plan — 2026-06-18

## Accepted changes

| # | Change | Files | Risk |
|---|--------|-------|------|
| 1 | Remove size `<select>` from future/lab forms | `asmara.html`, `massawa.html`, `ritual.html` | Low |
| 2 | JSON-LD `OutOfStock` for non-sale chapters | `asmara.html`, `massawa.html`, `ritual.html` | Low |
| 3 | Copenhagen studio copy (not stockists) | `index.html` | Low |
| 4 | Oil-rich parfum consistency | `journal/fico-d-india.html` | Low |
| 5 | Remove hardcoded notify email | `lib/waitlist-notify.js` | Low |
| 6 | Boutique card captions | `script.js`, `styles.css` | Low |
| 7 | Cache version sync | `store.html`, `index.html`, journal/legal pages, chapter pages | Low |

## Rejected (no code changes)

- Generic contact/appointments page
- Discovery set push
- Fake stockists / press / reviews
- Framework migration

## Test steps

1. `python3 scripts/dev-server.py` on port 8080
2. Load all routes; confirm no console errors
3. Verify waitlist forms: Beles keeps size via buttons; Asmara/Massawa/Ritual have no size field
4. Inspect JSON-LD on chapter pages
5. Confirm store grid shows name + status under each card
6. Submit test waitlist POST (optional without DB)
