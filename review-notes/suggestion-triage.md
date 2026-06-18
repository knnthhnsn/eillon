# Suggestion Triage — 2026-06-18

Scoring: Brand fit / User clarity / Conversion / SEO-a11y-perf / Safety (0–5 each, max 25). Implement ≥17.

---

## ACCEPTED (≥17)

### 1. Remove size selectors on future/lab forms
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 5 |
| Conversion | 4 |
| SEO/a11y/perf | 4 |
| Safety | 5 |
| **Total** | **23** |

- **Problem:** Asmara/Massawa/Ritual forms offer Discovery sample / 50 ml / 100 ml — reads like a purchase path.
- **Page:** `/asmara`, `/massawa`, `/ritual`
- **Evidence:** Live site and local HTML show `<select name="size">` on all three.
- **Fix:** Remove preferred-size field; keep name + email only.
- **Outcome:** Clearer that these are update/lab signups, not purchase waitlists.
- **Risk:** Low

### 2. Fix JSON-LD availability on non-sale chapters
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 4 |
| Conversion | 3 |
| SEO/a11y/perf | 5 |
| Safety | 5 |
| **Total** | **22** |

- **Problem:** `PreOrder` schema on in-production, coming-soon, and lab pages.
- **Page:** Asmara, Massawa, Ritual JSON-LD
- **Evidence:** `"availability": "https://schema.org/PreOrder"` in each file.
- **Fix:** Change to `OutOfStock` (not offered for sale).
- **Outcome:** Honest structured data; no purchase implication in search.
- **Risk:** Low

### 3. Replace stockist language with Copenhagen studio
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 5 |
| Conversion | 3 |
| SEO/a11y/perf | 4 |
| Safety | 5 |
| **Total** | **22** |

- **Problem:** “Find a Stockist” and search “stockists” suggest retail partners that do not exist.
- **Page:** Homepage footer + search overlay
- **Evidence:** `index.html` lines ~276–278, ~700.
- **Fix:** “Copenhagen studio” / “Private appointments” copy; keep mailto appointment link.
- **Outcome:** Editorial honesty; no fake stockist signal.
- **Risk:** Low

### 4. Oil-based → oil-rich parfum (journal)
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 4 |
| Conversion | 3 |
| SEO/a11y/perf | 4 |
| Safety | 5 |
| **Total** | **21** |

- **Problem:** Inconsistent terminology vs Beles product page and maison copy.
- **Page:** `/journal/fico-d-india`
- **Evidence:** “Oil-based parfum” in article CTA.
- **Fix:** “Oil-rich parfum”
- **Outcome:** Consistent brand vocabulary.
- **Risk:** Low

### 5. Remove hardcoded personal email in notify fallback
| Category | Score |
|----------|-------|
| Brand fit | 4 |
| User clarity | 3 |
| Conversion | 2 |
| SEO/a11y/perf | 4 |
| Safety | 5 |
| **Total** | **18** |

- **Problem:** `kennethchristoffer@gmail.com` hardcoded if env unset.
- **Page:** `lib/waitlist-notify.js`
- **Evidence:** `getNotifyRecipients()` fallback string.
- **Fix:** Require `WAITLIST_NOTIFY_EMAIL` or `ADMIN_NOTIFY_EMAIL`; no personal fallback.
- **Outcome:** No accidental PII exposure; forces proper env config.
- **Risk:** Low (notifications skip if unset; signup still works)

### 6. Boutique store card captions (name + status)
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 5 |
| Conversion | 5 |
| SEO/a11y/perf | 4 |
| Safety | 5 |
| **Total** | **24** |

- **Problem:** Store grid hides card body; Beles waitlist card is image-only with no visible title/status.
- **Page:** `/store` product grid
- **Evidence:** `createProductCard` skips body when `mode === 'store'`; CSS hides body.
- **Fix:** Add compact caption under each boutique card.
- **Outcome:** Readable chapter cards; clearer Beles waitlist status.
- **Risk:** Low

### 7. Sync cache-bust versions
| Category | Score |
|----------|-------|
| Brand fit | 3 |
| User clarity | 3 |
| Conversion | 2 |
| SEO/a11y/perf | 5 |
| Safety | 5 |
| **Total** | **18** |

- **Problem:** `store.html` and journal/legal pages load older `styles.css` / `script.js`.
- **Page:** Multiple HTML files
- **Fix:** Bump to `styles.css?v=105`, `script.js?v=66`, `products.js?v=7` where applicable.
- **Outcome:** Consistent styling/behavior after deploy.
- **Risk:** Low

---

## REJECTED (<17 or brand violation)

| Suggestion | Reason rejected |
|------------|-----------------|
| Add Contact / Appointments page | Brand rule — no generic contact page |
| Discovery set / sample kit promotion | Brand rule |
| Add stockist locator / retail partners | No real stockists; fake claim risk |
| Homepage product pyramid / buy CTAs for all chapters | Violates maison vs boutique architecture |
| React / build system migration | Explicitly forbidden |
| Rewrite Ritual page title to avoid “wearing ritual” | Homepage section is “Wear”; product is “Ritual” — distinct enough; rename is high churn |
| Add customer reviews / press logos | Fake social proof risk |
| Heavy ecommerce (cart, checkout) | Brand rule |
| Change Beles schema from PreOrder | Beles waitlist is legitimate preorder-intent; keep PreOrder |
