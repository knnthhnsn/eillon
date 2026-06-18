# ChatGPT Live Review — EILLON

**Date/time:** 2026-06-18T11:00:24Z (cron automation trigger)

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
- All chapters consistently marked **out of stock** (code is source of truth; live site matches)
- Future chapters (Asmara, Massawa) use restrained “restock note only” language
- Ritual is explicitly a lab study, not for sale
- Product-specific waitlist slugs and differentiated success messages in `script.js`
- No generic luxury clichés detected in copy
- Schema fixes from prior loop hold: Asmara/Massawa `OutOfStock`, Ritual has no purchase offer
- Journal uses “oil-rich parfum” consistently
- Homepage footer correctly labels “Copenhagen studio” (no fake stockist implication)

### Actionable suggestions extracted

1. **Search overlay navigation (site-wide):** `scripts/site-nav.js` still labels search item “Appointments” with “Copenhagen studio and stockists” and links to `#stockists` — but homepage section is `#studio`. Broken anchor + misleading stockist implication on every page.
2. **Store boutique cards:** Caption overlays now show status + chapter name for all cards (prior loop) — verified in `script.js` / `styles.css`.
3. **Notification safety:** Hardcoded personal Gmail removed from `lib/waitlist-notify.js` (prior loop) — verified.
4. **Performance:** Beles showcase video uses `preload="none"` with poster — good. Homepage hero preloads remain intentional for LCP.

### Suggestions not pursued (brand/rule conflicts)

- Add a Contact page
- Add discovery set / sample kit landing push
- Add stockist directory (no real stockists to list)
- Add customer reviews or press logos
- Heavier ecommerce (cart, checkout on-site)
- React migration or build system
- Revert to “waitlist open” copy when codebase intentionally uses out-of-stock status
