# ChatGPT Live Review — EILLON

**Date/time:** 2026-06-17T23:01 UTC  
**Reviewer:** Independent audit (ChatGPT browser unavailable in cloud agent environment)

## Prompt sent

```txt
i updated the website review https://eillon.maison/ and all its pages and suggest improvements

Important context:
EILLON is an Afro-Mediterranean memory perfumery, not a generic perfume shop. The homepage should explain the maison; the store should show fragrance chapters; individual perfume pages should own composition details. Beles is the first waitlist-open release. Asmara and Massawa are future chapters. Ritual is a lab study.

Please review all accessible pages:
- /
- /store
- /beles
- /asmara
- /massawa
- /ritual
- /journal
- /journal/fico-d-india
- /journal/the-bottle
- /privacy
- /terms
- /imprint

Suggest improvements, but do not suggest adding a generic contact/appointments page or discovery/sample kit. Focus on clarity, navigation, brand consistency, SEO, accessibility, conversion, performance, and emotional storytelling.
```

## Review method

ChatGPT Pro browser session was not available in the automation environment. Review was performed by fetching https://eillon.maison/ pages and auditing the local codebase against EILLON brand rules.

## Summary of findings (live site + codebase audit)

### Strongest suggestions

1. **Fix incorrect Product schema on future chapters** — Asmara, Massawa, and Ritual JSON-LD use `PreOrder` availability while visible copy says "not yet available to purchase" / "not for sale". Should use `OutOfStock`.
2. **Remove hardcoded personal notification email** — `lib/waitlist-notify.js` falls back to a private Gmail address if env vars are unset.
3. **Align cache-busting versions** — Legal and journal pages load `styles.css?v=70` and `script.js?v=47` while product pages use `v=104`/`v=65`; store uses `v=95`/`v=59`. Stale caches may show outdated styles or waitlist behavior.
4. **Clarify footer "Find a Stockist"** — Links to Copenhagen studio appointments, not third-party stockists. Misleading label.
5. **Homepage search "Appointments" label** — Same issue; should say "Copenhagen studio" to match footer content.

### Moderate suggestions

6. **Store product cards depend on JS** — Cards render via `data-product-grid`; ensure script version is current on `/store`.
7. **Chapter waitlist forms offer "Discovery sample"** — On non-Beles chapters this reads like a sample-kit push; prefer neutral size language.
8. **Legacy `/store#chapter` redirects** — Already handled in `script.js`; no action needed.

### Weakest / rejected directions

- Add a dedicated Contact or Appointments page (violates brand rules)
- Push discovery sets or sample kits (violates brand rules)
- Add fake press, reviews, or stockists
- React migration or build system
- Heavy ecommerce checkout before Beles release

## Actionable suggestions extracted

| # | Suggestion | Page/area |
|---|------------|-----------|
| 1 | Change chapter JSON-LD `PreOrder` → `OutOfStock` | asmara, massawa, ritual |
| 2 | Remove hardcoded notify email fallback | lib/waitlist-notify.js |
| 3 | Bump CSS/JS cache versions on stale pages | privacy, terms, imprint, journal, store |
| 4 | Rename "Find a Stockist" → "Copenhagen studio" | index.html footer |
| 5 | Rename search "Appointments" → "Copenhagen studio" | index.html search overlay |
| 6 | Change "Discovery sample" → "2 ml sample" on chapter forms | asmara, massawa, ritual |
| 7 | Keep Beles `PreOrder` schema (waitlist with stated prices) | beles.html — no change |
