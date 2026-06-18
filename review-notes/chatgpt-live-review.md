# ChatGPT Live Review — EILLON

**Date/time:** 2026-06-18T01:02Z (automation cron)

**Method:** ChatGPT browser session was not available in the cloud agent environment. Review performed via live site fetch (`https://eillon.maison/*`) plus full local codebase audit, following the exact prompt intent below.

## Prompt sent (intended for ChatGPT)

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

## Live audit summary (substitute for ChatGPT response)

### Strongest observations

1. **Future/lab chapter forms show bottle size selectors** (Asmara, Massawa, Ritual) — implies purchasability; contradicts “not yet available” / “lab study” copy.
2. **JSON-LD uses `PreOrder` availability** on non-sale chapters — search engines may interpret these as buyable.
3. **Homepage footer/search uses “stockist” language** while only a Copenhagen studio appointment exists — risks fake-stockist perception.
4. **Journal article uses “oil-based”** while the rest of the site consistently says “oil-rich parfum”.
5. **Hardcoded personal email fallback** in `lib/waitlist-notify.js` — security/privacy risk if env var unset.
6. **Store boutique cards are image-only** — Beles (waitlist open) has no visible name/status on the card body in boutique grid mode.
7. **Cache-bust versions inconsistent** across pages (`store.html` on older CSS/JS).

### Weaker / rejected-style observations

- Add a dedicated Contact page — **rejected** (brand rule).
- Add discovery set / sample kit push — **rejected** (brand rule).
- Rewrite homepage as product landing — **rejected** (maison architecture is correct).
- Add fake press/reviews/stockists — **rejected**.
- React migration or build system — **rejected**.

### Actionable suggestions extracted

| # | Suggestion | Page/area |
|---|------------|-----------|
| 1 | Remove size selectors from non-purchasable chapter waitlist forms | Asmara, Massawa, Ritual |
| 2 | Fix Product schema `availability` for non-sale chapters | Asmara, Massawa, Ritual |
| 3 | Replace “Find a Stockist” / stockist search copy with Copenhagen studio language | Homepage |
| 4 | Align “oil-based” → “oil-rich parfum” | Journal fico-d-india |
| 5 | Remove hardcoded notify email fallback | API/lib |
| 6 | Add visible name + status captions on boutique store cards | Store grid |
| 7 | Sync CSS/JS cache versions on store and journal pages | Multiple HTML |
