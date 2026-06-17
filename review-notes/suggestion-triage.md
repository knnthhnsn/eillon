# Suggestion Triage — EILLON Review Loop 2026-06-17

Scoring: Brand fit (0–5) · User clarity (0–5) · Conversion (0–5) · SEO/a11y/perf (0–5) · Implementation safety (0–5) · **Max 25**

**Threshold: implement only 17+**

---

## Accepted (17+)

### 1. Chapter JSON-LD availability fix
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 4 |
| Conversion | 3 |
| SEO/a11y/perf | 5 |
| Implementation safety | 5 |
| **Total** | **22** |

- **Problem:** Schema claims PreOrder while pages say not for sale.
- **Page/section:** asmara.html, massawa.html, ritual.html JSON-LD
- **Evidence:** `"availability": "https://schema.org/PreOrder"` vs visible "not yet available to purchase"
- **Proposed fix:** Set `OutOfStock` for asmara, massawa, ritual offers.
- **Expected outcome:** Search engines and rich results align with editorial product status.
- **Risk:** Low

### 2. Remove hardcoded notify email
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 3 |
| Conversion | 2 |
| SEO/a11y/perf | 4 |
| Implementation safety | 5 |
| **Total** | **19** |

- **Problem:** Private Gmail hardcoded as fallback in waitlist notifications.
- **Page/section:** lib/waitlist-notify.js
- **Evidence:** `|| 'kennethchristoffer@gmail.com'`
- **Proposed fix:** Require `WAITLIST_NOTIFY_EMAIL` or `ADMIN_NOTIFY_EMAIL`; skip send if unset.
- **Expected outcome:** No personal data exposure; notifications only when configured.
- **Risk:** Low (signup still succeeds; notify is async)

### 3. Cache version alignment
| Category | Score |
|----------|-------|
| Brand fit | 4 |
| User clarity | 4 |
| Conversion | 3 |
| SEO/a11y/perf | 4 |
| Implementation safety | 5 |
| **Total** | **20** |

- **Problem:** Stale CSS/JS on legal, journal, store pages.
- **Page/section:** privacy, terms, imprint, journal/*, store.html
- **Evidence:** v=70/v=47 vs v=104/v=65 on main pages
- **Proposed fix:** Bump to styles.css?v=105, script.js?v=66 consistently.
- **Expected outcome:** Consistent styling and waitlist behavior after deploy.
- **Risk:** Low

### 4. Footer "Find a Stockist" label
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 5 |
| Conversion | 3 |
| SEO/a11y/perf | 3 |
| Implementation safety | 5 |
| **Total** | **21** |

- **Problem:** Implies external stockists; section is Copenhagen studio appointments.
- **Page/section:** index.html footer Boutique column
- **Evidence:** `<a href="#stockists">Find a Stockist</a>` above studio appointment copy
- **Proposed fix:** Rename to "Copenhagen studio".
- **Expected outcome:** Honest navigation; no fake stockist implication.
- **Risk:** Low

### 5. Search overlay "Appointments" label
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 5 |
| Conversion | 2 |
| SEO/a11y/perf | 3 |
| Implementation safety | 5 |
| **Total** | **20** |

- **Problem:** Generic "Appointments" in search; links to studio section.
- **Page/section:** index.html search panel
- **Proposed fix:** Rename to "Copenhagen studio".
- **Expected outcome:** Consistent with maison tone and actual content.
- **Risk:** Low

### 6. Chapter form sample option wording
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 4 |
| Conversion | 3 |
| SEO/a11y/perf | 2 |
| Implementation safety | 5 |
| **Total** | **19** |

- **Problem:** "Discovery sample" on unreleased chapters reads like sample-kit merchandising.
- **Page/section:** asmara, massawa, ritual waitlist size selects
- **Proposed fix:** Use "2 ml sample" to match Beles product data.
- **Expected outcome:** Neutral size preference without discovery-set push.
- **Risk:** Low

---

## Rejected (<17 or brand violation)

| Suggestion | Reason rejected |
|------------|-----------------|
| Add Contact / Appointments page | Brand rule — no generic contact/appointments page |
| Discovery set / sample kit CTA | Brand rule — no sample kit push |
| Add fake stockists or press | Brand rule |
| React / build system migration | Brand rule — no framework conversion |
| Rewrite homepage as product page | Brand architecture — homepage is maison |
| Add buy-now on Asmara/Massawa | Product status — future chapters only |
| Change Ritual to purchasable | Ritual must remain lab study |
| Add customer reviews section | Fake social proof risk |
| Heavy video preload on all pages | Performance — already lazy-loaded where possible |
| Remove Copenhagen studio mailto | Real studio channel; editorial not commercial |
