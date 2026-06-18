# Suggestion Triage — EILLON Review Loop 2026-06-18

Scoring: Brand fit / User clarity / Conversion / SEO-a11y-perf / Implementation safety (0–5 each, max 25).

**Threshold: implement only 17+**

---

## Accepted (17+)

### 1. Fix chapter JSON-LD availability — Score: 24
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 4 |
| Conversion | 4 |
| SEO/a11y/perf | 5 |
| Implementation safety | 5 |

- **Problem:** Asmara, Massawa, Ritual schema claims `PreOrder` while pages say not for sale / in production / lab study.
- **Page/section:** `asmara.html`, `massawa.html`, `ritual.html` JSON-LD
- **Evidence:** `"availability": "https://schema.org/PreOrder"` on non-purchasable chapters
- **Proposed fix:** Change to `OutOfStock`
- **Expected outcome:** Search engines no longer infer purchasable products
- **Risk:** Low

### 2. Remove size selectors on future/lab forms — Score: 22
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 5 |
| Conversion | 4 |
| SEO/a11y/perf | 3 |
| Implementation safety | 5 |

- **Problem:** Asmara/Massawa/Ritual forms offer sample/50ml/100ml sizes despite no purchase path.
- **Page/section:** Chapter waitlist forms
- **Evidence:** Live site shows "Discovery sample" on Asmara; copy says "not yet available to purchase"
- **Proposed fix:** Remove preferred-size `<select>` from asmara, massawa, ritual
- **Expected outcome:** Forms read as interest/updates only
- **Risk:** Low

### 3. Remove hardcoded personal notify email — Score: 25
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 4 |
| Conversion | 4 |
| SEO/a11y/perf | 5 |
| Implementation safety | 5 |

- **Problem:** `kennethchristoffer@gmail.com` hardcoded as fallback in notify recipients
- **Page/section:** `lib/waitlist-notify.js`
- **Evidence:** Line 18–20
- **Proposed fix:** Require env var only; no personal email fallback
- **Expected outcome:** No secrets/personal data in repo; notifications skip gracefully if unset
- **Risk:** Low (signup still succeeds; README documents env)

### 4. Fix "Find a Stockist" footer label — Score: 21
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 5 |
| Conversion | 3 |
| SEO/a11y/perf | 3 |
| Implementation safety | 5 |

- **Problem:** Footer says "Find a Stockist" but links to Copenhagen studio appointments — implies stockist network
- **Page/section:** `index.html` footer Boutique column
- **Evidence:** `<a href="#stockists">Find a Stockist</a>`
- **Proposed fix:** Rename to "Copenhagen studio"
- **Expected outcome:** Honest navigation; no fake stockist signal
- **Risk:** Low

### 5. Fix homepage search stockist/appointment copy — Score: 20
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 4 |
| Conversion | 3 |
| SEO/a11y/perf | 3 |
| Implementation safety | 5 |

- **Problem:** Search item "Appointments / Copenhagen studio and stockists" overpromises
- **Page/section:** `index.html` search panel
- **Proposed fix:** "Copenhagen studio" / "Private visits by request"
- **Expected outcome:** Aligns with maison editorial tone
- **Risk:** Low

### 6. Unify cache-busting versions — Score: 18
| Category | Score |
|----------|-------|
| Brand fit | 3 |
| User clarity | 4 |
| Conversion | 3 |
| SEO/a11y/perf | 4 |
| Implementation safety | 4 |

- **Problem:** `store.html`, journal, legal pages load old CSS/JS versions
- **Page/section:** Multiple HTML files
- **Proposed fix:** Bump to `styles.css?v=105`, `script.js?v=66` sitewide
- **Expected outcome:** Consistent styling and JS behavior after deploy
- **Risk:** Low

---

## Rejected (<17 or brand violation)

| Suggestion | Score | Reason rejected |
|------------|-------|-----------------|
| Add Contact page | — | Brand rules: no generic contact page |
| Add Appointments page | — | Brand rules |
| Discovery set / sample kit push | — | Brand rules |
| Remove Copenhagen studio mailto entirely | 14 | Legitimate private studio visits exist in about/imprint; only misleading labels rejected |
| Rewrite homepage hero | 12 | Already strong; unnecessary scope |
| Add fake stockists/press/reviews | — | Brand rules |
| React / build system | — | Brand rules |
| Remove wear section "ritual" class naming | 10 | No user confusion; Ritual chapter is separate product |
| Add heavy ecommerce features | — | Brand rules |
| Change Beles PreOrder schema | 8 | Correct for waitlist-open product |
