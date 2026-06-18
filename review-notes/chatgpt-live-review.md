# ChatGPT Live Review — EILLON

**Date/time:** 2026-06-18T04:00 UTC (automation cron)

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

## External review status

**ChatGPT browser review was not available** in the cloud automation environment (no signed-in browser session). Review was completed via live site fetch (`https://eillon.maison/*`) plus full local codebase audit.

## Synthesized actionable suggestions (from live site + codebase audit)

1. **Future chapter forms show bottle size selectors** — Asmara, Massawa, and Ritual display "Preferred size / Discovery sample / 50 ml / 100 ml" despite copy stating not for sale. Confusing and implies purchase intent.
2. **JSON-LD claims PreOrder on non-purchasable chapters** — Asmara, Massawa, Ritual schema uses `PreOrder` availability; contradicts visible page copy.
3. **Homepage references stockists** — Footer link "Find a Stockist" and search item "Appointments / Copenhagen studio and stockists" conflict with brand rule: no fake stockists; studio is by appointment only.
4. **Journal article uses "Oil-based parfum"** — Inconsistent with site-wide "oil-rich parfum" language and INCI reality (alcohol denat. present).
5. **Boutique store cards lack readable captions** — Store grid hides card body in boutique mode; status/context only visible on hover overlays for non-Beles cards.
6. **Hardcoded personal email in waitlist notify fallback** — `lib/waitlist-notify.js` falls back to a personal Gmail if env vars missing.
7. **Homepage "wearing ritual" vs Ritual chapter** — No conflict found; homepage uses "wearing ritual" as application guidance, Ritual page is clearly labeled lab study.
8. **Beles waitlist path** — Clear and correct; size selector appropriate on Beles only.
9. **Legacy `/store#chapter` hashes** — Already handled via redirect in `script.js`.
10. **Generic luxury clichés** — Not found on live site; copy is on-brand.
11. **Sitemap / llms.txt** — Complete and accurate; minor lastmod refresh after fixes.
12. **Add contact page** — Rejected per brand rules (mailto care@eillon.maison is sufficient).
13. **Discovery set / sample kit push** — Rejected per brand rules.
14. **Heavy ecommerce features** — Rejected per brand rules.
