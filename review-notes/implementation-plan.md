# Implementation Plan — 2026-06-18

## Accepted changes

| # | Change | Files | Risk |
|---|---|---|---|
| 1 | Remove size selectors from future/lab chapter forms | asmara.html, massawa.html, ritual.html | Low |
| 2 | Fix JSON-LD `OutOfStock` on non-purchasable chapters | asmara.html, massawa.html, ritual.html | Low |
| 3 | Fix oil-based → oil-rich parfum | journal/fico-d-india.html | Low |
| 4 | Remove hardcoded personal email fallback | lib/waitlist-notify.js | Low |
| 5 | Fix stockist/appointments nav labels; rename anchor to #studio | index.html | Low |

## Rejected changes

See `suggestion-triage.md`.

## Test steps

1. `python3 scripts/dev-server.py` on port 8080
2. Verify routes: /, /store, /beles, /asmara, /massawa, /ritual, /journal, /journal/fico-d-india, /journal/the-bottle, /privacy, /terms, /imprint
3. Confirm waitlist slugs: beles, asmara, massawa, ritual, all
4. Confirm no size `<select>` on asmara/massawa/ritual
5. Confirm index footer/search studio links work (`#studio`)
6. Check console for JS errors

## Deployment notes

- Safe to deploy static HTML/CSS/JS changes immediately.
- Ensure `WAITLIST_NOTIFY_EMAIL` or `ADMIN_NOTIFY_EMAIL` is set in Vercel (required after notify fallback removal).
