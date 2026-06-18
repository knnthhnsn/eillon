# ChatGPT Live Review — EILLON

**Date/time:** 2026-06-18T03:02:34Z (automation trigger)

## Review method

Browser access to ChatGPT Pro was not available in the cloud agent environment. The exact prompt below was **not** sent to ChatGPT. Instead, this review used:

1. Live fetches of https://eillon.maison/ and key routes
2. Full local codebase audit per the review-loop specification

Findings below are synthesized from that independent audit in the same spirit as an external reviewer.

## Exact prompt (not delivered to ChatGPT)

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

## Simulated external review summary

### Strengths

- Clear maison vs boutique architecture: homepage reads editorial; `/store` is chapter-focused
- Beles is correctly positioned as the only waitlist-open release with pricing and size selection
- Future chapters (Asmara, Massawa) use restrained “not yet available to purchase” language
- Ritual is explicitly a lab study, not for sale
- Product-specific waitlist slugs and differentiated success messages in `script.js`
- No generic luxury clichés detected in copy
- `data/products.js` is a coherent source of truth for chapter status

### Actionable suggestions extracted

1. **Schema accuracy:** Asmara, Massawa, and Ritual use `PreOrder` in JSON-LD but pages state they are not purchasable — misleading for SEO/rich results
2. **Ritual schema:** Lab study should not imply a purchase offer at all
3. **Store boutique cards:** Beles card on `/store` shows mood imagery only — no visible name/status unlike other chapter cards (body hidden by boutique CSS)
4. **Copy consistency:** Journal article uses “oil-based parfum” while site standard is “oil-rich parfum”
5. **Misleading navigation:** Footer link “Find a Stockist” points to Copenhagen studio appointments — no stockists are listed (implies fake availability)
6. **Homepage search:** “Appointments” label suggests a dedicated page; section is studio mailto only
7. **Notification safety:** `lib/waitlist-notify.js` falls back to a hardcoded personal Gmail if env vars unset

### Suggestions not pursued (brand/rule conflicts)

- Add a Contact page
- Add discovery set / sample kit landing push
- Add stockist directory (no real stockists to list)
- Add customer reviews or press logos
- Heavier ecommerce (cart, checkout on-site)
- React migration or build system
