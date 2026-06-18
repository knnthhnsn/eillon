# ChatGPT Live Review — EILLON

**Date:** 2026-06-18T05:02 UTC  
**Reviewer:** Automated audit (ChatGPT browser unavailable in cloud agent environment)

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

## Method

ChatGPT Pro browser session was not available. Review synthesized from live fetches of https://eillon.maison/ plus full local codebase audit.

## Actionable suggestions extracted

1. **Remove size selectors on Asmara, Massawa, and Ritual** — future/lab pages show bottle-size options that imply purchase intent.
2. **Fix JSON-LD availability on non-purchasable chapters** — Asmara, Massawa, and Ritual use `PreOrder` schema while page copy says not for sale / in production / lab study.
3. **Fix "oil-based" copy on journal/fico-d-india** — site standard is "oil-rich parfum"; Beles INCI includes alcohol denat.
4. **Remove hardcoded personal email fallback in waitlist-notify.js** — `kennethchristoffer@gmail.com` should not be committed fallback.
5. **Rename misleading "Find a Stockist" footer link** — no stockists exist; section is Copenhagen studio visits only.
6. **Rename homepage search "Appointments" entry** — reads like a generic appointments page; should point to studio section with accurate label.
7. **Rename `#stockists` anchor to `#studio`** — ID implies retail stockists; content is private studio visits.
8. **Beles waitlist path is clear** — no change needed; primary CTA works.
9. **Store boutique cards show status overlays** — working; no change needed.
10. **Homepage maison/product separation** — good; composition details correctly on product pages.
11. **Ritual lab positioning** — copy is clear; schema fix needed only.
12. **Legacy `/store#chapter` redirects** — already handled in script.js; no change needed.

## Strongest suggestions

- Size selectors on non-purchasable chapters confuse product status (high brand risk).
- Incorrect `PreOrder` schema on Ritual contradicts "not for sale" copy.
- "Find a Stockist" implies retail distribution that does not exist.

## Weakest / rejected-style suggestions

- Adding a dedicated Contact page (violates brand rules).
- Discovery set / sample kit push (violates brand rules).
- Heavy ecommerce features or React migration (out of scope).
- Rewriting homepage hero or full redesign (unnecessary; brand voice is strong).
