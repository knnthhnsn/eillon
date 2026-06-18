# ChatGPT Live Review — EILLON

**Date/time:** 2026-06-18T09:01:45Z (cron automation)

## Review method

Browser access to ChatGPT Pro was not available in the cloud agent environment. The exact prompt below was **not** sent to ChatGPT. Instead, this review used:

1. Live fetches of https://eillon.maison/ and key routes
2. Full local codebase audit per the review-loop specification
3. Local dev server route verification on all required paths

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
- All chapters consistently framed as out of stock with restock-list signups (live site matches local repo)
- Future chapters (Asmara, Massawa) use restrained language; Ritual is explicitly a lab study
- Product-specific waitlist slugs and differentiated success messages in `script.js`
- No generic luxury clichés detected in copy
- Schema on asmara/massawa uses `OutOfStock`; Ritual has no purchase `offers` block
- Copenhagen studio navigation uses `#studio` anchor — no fake stockist implication

### Actionable suggestions extracted

1. **Broken HTML:** Stray `</a>` in homepage search overlay after Copenhagen studio item — breaks DOM structure
2. **Broken tooling:** `package.json` missing comma after `verify` script — invalid JSON
3. **Copy consistency:** Privacy policy still references "Beles waitlist" while site uses out-of-stock / restock-list language
4. **llms.txt completeness:** Journal article URLs missing from AI crawler index

### Prior-loop fixes verified (no re-implementation needed)

- Asmara/Massawa/Ritual schema corrections
- Beles store card out-of-stock overlay labels
- Journal oil-rich terminology
- Footer/search Copenhagen studio labels
- Hardcoded notify email removed from `lib/waitlist-notify.js`

### Suggestions not pursued (brand/rule conflicts)

- Add a Contact page
- Add discovery set / sample kit landing push
- Add stockist directory (no real stockists to list)
- Add customer reviews or press logos
- Heavier ecommerce (cart, checkout on-site)
- React migration or build system
