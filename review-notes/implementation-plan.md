# Implementation Plan — EILLON Review Loop 2026-06-18

## Accepted changes

| # | Change | Files | Risk |
|---|--------|-------|------|
| 1 | Remove size selectors from asmara/massawa/ritual forms | `asmara.html`, `massawa.html`, `ritual.html` | Low |
| 2 | JSON-LD `OutOfStock` for non-purchasable chapters | `asmara.html`, `massawa.html`, `ritual.html` | Low |
| 3 | `#studio` anchor, remove stockist language | `index.html` | Low |
| 4 | Oil-rich copy fix | `journal/fico-d-india.html` | Low |
| 5 | Boutique store card captions | `script.js`, `styles.css`, `store.html` | Low |
| 6 | Remove hardcoded notify email | `lib/waitlist-notify.js` | Low |

## Rejected changes

See `suggestion-triage.md` rejected table.

## Test steps

1. `python3 scripts/dev-server.py` on port 8080
2. Verify routes: `/`, `/store`, `/beles`, `/asmara`, `/massawa`, `/ritual`, `/journal/*`, legal pages
3. Confirm waitlist slugs: beles, asmara, massawa, ritual, all
4. Confirm asmara/massawa/ritual forms have no size field
5. Confirm store cards show name + status captions
6. Confirm `#studio` anchor works on homepage
7. Check console for JS errors on store page (product grid render)
