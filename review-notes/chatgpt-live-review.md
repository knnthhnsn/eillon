# ChatGPT Live Review — EILLON

**Date/time:** 2026-06-18T00:01Z (UTC)

## Method note

ChatGPT Pro browser review was **not available** in the cloud agent environment (no signed-in browser session). This review synthesizes:

1. Live site fetch of all primary routes at https://eillon.maison/
2. Full local codebase audit per the review-loop specification

## Exact prompt (not sent — browser unavailable)

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

## Synthesized review (live site + codebase)

### Strongest suggestions (actionable)

1. **Fix JSON-LD on future/lab chapters** — Asmara, Massawa, and Ritual use `PreOrder` availability while page copy says not purchasable. Should use `OutOfStock` or omit purchase offers.
2. **Remove purchase-implying size selectors** on Asmara, Massawa, and Ritual forms — "Discovery sample / 50 ml / 100 ml" contradicts "not yet available" and "lab study, not for sale."
3. **Remove hardcoded personal notify email** fallback in `lib/waitlist-notify.js` — security/privacy risk; env vars should be required.
4. **Fix misleading "Find a Stockist" footer link** — anchors to Copenhagen studio appointments, not stockists. Violates brand rule against fake stockists.
5. **Unify cache-busting versions** — `store.html`, journal, and legal pages load stale `styles.css?v=70` / `script.js?v=47` while main pages use v=104/v=65.
6. **Clarify homepage search entry** — "Appointments / Copenhagen studio and stockists" overpromises stockist network.

### Moderate suggestions (partially accepted or deferred)

7. Homepage maison/boutique separation is generally good; collection preview cards work.
8. Beles waitlist path is clear; PreOrder schema is appropriate for Beles only.
9. Legacy `/store#asmara` redirects are already handled in `script.js`.
10. Wear section (`#wear`) vs Ritual chapter naming is distinct enough — no change needed.

### Weaker / rejected suggestions

11. Add a dedicated Contact page — **rejected** (brand rules).
12. Add discovery set / sample kit push — **rejected** (brand rules).
13. Add fake press, reviews, or stockists — **rejected**.
14. React conversion or build system — **rejected**.
15. Full homepage rewrite — **rejected** (site is editorial and on-brand).

## Extracted actionable suggestions

| # | Suggestion | Source |
|---|------------|--------|
| 1 | Fix chapter Product schema availability | Audit |
| 2 | Remove size dropdowns on non-purchasable chapter forms | Audit + live |
| 3 | Remove hardcoded notify email fallback | Audit |
| 4 | Rename "Find a Stockist" → studio-appropriate label | Audit |
| 5 | Fix search overlay stockist/appointment copy | Audit |
| 6 | Bump CSS/JS cache versions sitewide | Audit |
| 7 | Update sitemap lastmod after changes | Audit |
