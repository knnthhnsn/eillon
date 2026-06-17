# ChatGPT Live Review — EILLON

**Date/time:** 2026-06-17T21:53:17Z (automation trigger)  
**Reviewer:** External review cycle (ChatGPT browser unavailable in cloud agent — substituted with live site fetch at https://eillon.maison/ plus independent codebase audit)

## Prompt sent (exact)

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

Suggest improvements, but do not suggest adding a a generic contact/appointments page or discovery/sample kit. Focus on clarity, navigation, brand consistency, SEO, accessibility, conversion, performance, and emotional storytelling.
```

## Review method note

ChatGPT Pro browser session was not available in the cloud automation environment. The review below synthesizes:

1. Live HTML/text fetch of https://eillon.maison/ (homepage, store, beles, ritual confirmed)
2. Full local codebase audit against EILLON brand rules
3. Standard luxury/SEO/accessibility review patterns appropriate to this site

## Summary of findings (actionable suggestions)

### Strong / high-confidence

1. **Incorrect Product schema on non-purchasable chapters** — Asmara, Massawa, and Ritual JSON-LD use `PreOrder` availability while page copy states they are not available to purchase; Ritual is explicitly a lab study not for sale.
2. **Copy inconsistency: "oil-based" vs "oil-rich"** — Journal article `/journal/fico-d-india` CTA uses "Oil-based parfum" while the rest of the site uses "oil-rich parfum."
3. **Hardcoded personal notification email fallback** — `lib/waitlist-notify.js` falls back to a personal Gmail address when env vars are unset; should rely on env configuration only.
4. **Privacy meta description mentions "appointment data"** — No appointment form exists on site; meta should reflect waitlist/newsletter/contact email only.
5. **Stale CSS cache-bust versions** — Legal and journal pages load `styles.css?v=70` while main product pages use `v=104`; risks stale styling after updates.

### Moderate (reviewed, mostly rejected or deferred)

6. Homepage maison palette lists note families (Desert Fruit, Rain on Stone, etc.) — acceptable as scent-world language, not Beles-specific pyramid; no change needed.
7. Homepage "Composition" eyebrow on model row — refers to oil-rich parfum philosophy, not product notes; acceptable.
8. Store product cards are JS-rendered — cards present in DOM after script load; no broken layout found in code.
9. Legacy `/store#asmara` hashes — already redirected in `script.js`; no fix needed.
10. Imprint lists appointment hours "by request" — legal disclosure, not a booking page; acceptable.

### Weak / rejected patterns (would violate brand rules)

11. Add a Contact or Appointments page — **reject** (brand rule)
12. Push discovery set / sample kit as standalone product — **reject** (brand rule)
13. Add fake press, reviews, stockists — **reject**
14. Make Ritual or future chapters feel purchasable — **reject**
15. React conversion or build system — **reject**

## Pages reviewed (live fetch + local)

| Route | Status |
|-------|--------|
| `/` | Live fetch OK — maison tone, Beles CTA clear |
| `/store` | Live fetch OK — status guide, letter form; cards JS-rendered |
| `/beles` | Live fetch OK — waitlist, composition, FAQ |
| `/ritual` | Live fetch OK — lab study, not for sale copy clear |
| `/asmara`, `/massawa` | Local + products.js — in production / coming soon |
| `/journal/*` | Local — oil-based inconsistency found |
| `/privacy`, `/terms`, `/imprint` | Local — minor meta/copy notes |
