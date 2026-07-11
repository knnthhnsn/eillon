# AI Hard Review - EXP-043

**Date:** 2026-07-11
**Automation:** manual_visual_merchandising
**Branch:** main (dirty shared workspace; scoped EXP-043 diff)
**Bugbot runs:** 0 (Bugbot unavailable; manual hard review completed)
**Verdict:** pass_with_notes

## Summary

The scoped change adds a generated architectural store hero, six data-driven chapter hover scenes, approved transparent bottle variants, and 54 decorative note cutouts. It also corrects six-chapter metadata/schema and removes duplicate shader execution. Product facts, pricing, availability, checkout, forms, consent, and analytics payloads are unchanged.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| warn | `images/store/notes/**` | Generated note objects are visual interpretations, including textile or mineral metaphors for intangible notes such as musk, air, breeze, and skin. | Kept all imagery decorative with empty alt text; visible product note copy continues to come only from `data/products.js`. |
| warn | Lighthouse comparison | The local Python server does not mirror Vercel compression, which makes FCP/LCP and transfer totals noisy. | Used request/TBT trace evidence locally and requires the same live Lighthouse sample after deploy. |
| warn | review tooling | Bugbot is unavailable in the current environment. | Completed the full manual checklist, CI, growth QA, data-to-asset verification, browser QA, and 26-shot visual review. |
| praise | `scripts/shared-interactions.js` | Hover imagery is not part of the initial request waterfall. | Assets hydrate near the collection and remain disabled as a visual mode on coarse pointers. |
| praise | `scripts/site-nav.js`, `store.html` | A duplicate shader request and execution path was removed. | One idle-loaded shader request remains for the below-fold chapter color fields. |

## Checklist sign-off

- [x] Brand - quiet architectural hero, chapter-specific material worlds, no generic splash or DTC treatment
- [x] Claims/products - all 54 note names map to `data/products.js`; no stock, date, certification, review, testimonial, or formula claims added
- [x] Privacy/analytics - no PII, event payload, consent, form, or third-party changes
- [x] SEO/metadata - six-chapter social copy and CollectionPage ItemList are internally consistent; canonical/sitemap checks pass
- [x] Accessibility - decorative assets are hidden from the accessibility tree; focus reveals match hover; coarse-pointer view remains static
- [x] Motion - independent drift is disabled by `prefers-reduced-motion`
- [x] Performance - 84 hover images deferred at first paint; one shader request; responsive WebP sizes; explicit image dimensions
- [x] Security - no secret, credential, or external hotlink committed
- [x] Ledger and run log ready

## QA commands

- `npm.cmd run ci` - pass
- `npm.cmd run growth:qa` - pass
- `npm.cmd run test:visual` - pass, 26 screenshots
- `npm.cmd run verify:gsc` - pass
- Asset mapping check - pass, 54/54 notes and 12/12 bottles
- Browser desktop/mobile QA - pass, zero site errors
- `git diff --check` - pass

## Notes

- Zero block findings.
- Production deployment is explicitly human-authorized.
