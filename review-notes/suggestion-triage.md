# Suggestion Triage — EILLON Review Loop 2026-06-18

Scoring: Brand fit | User clarity | Conversion | SEO/a11y/perf | Implementation safety (max 25). Implement ≥17.

---

## ACCEPTED (score ≥17)

### 1. Remove size selectors from future/lab chapter forms
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 5 |
| Conversion | 4 |
| SEO/a11y/perf | 4 |
| Implementation safety | 5 |
| **Total** | **23** |

- **Problem:** Asmara, Massawa, Ritual forms offer bottle sizes despite "not for sale" copy.
- **Page/section:** `/asmara`, `/massawa`, `/ritual` waitlist forms
- **Evidence:** Live site and local HTML show `<select name="size">` with sample/50/100 ml options.
- **Proposed fix:** Remove size `<label>`/`<select>` from all three forms.
- **Expected outcome:** Clearer distinction between Beles waitlist and future-chapter signups.
- **Risk:** Low

### 2. Fix JSON-LD availability on non-purchasable chapters
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 4 |
| Conversion | 3 |
| SEO/a11y/perf | 5 |
| Implementation safety | 5 |
| **Total** | **22** |

- **Problem:** Schema claims `PreOrder` for chapters not offered for purchase.
- **Page/section:** `asmara.html`, `massawa.html`, `ritual.html` JSON-LD
- **Evidence:** `"availability": "https://schema.org/PreOrder"` in all three.
- **Proposed fix:** Change to `OutOfStock` for asmara/massawa/ritual.
- **Expected outcome:** Honest structured data; no false purchase signals in search.
- **Risk:** Low

### 3. Replace stockist language with Copenhagen studio anchor
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 5 |
| Conversion | 3 |
| SEO/a11y/perf | 4 |
| Implementation safety | 5 |
| **Total** | **22** |

- **Problem:** "Find a Stockist" and search "Appointments / stockists" imply retail distribution that does not exist.
- **Page/section:** `index.html` footer, search overlay
- **Evidence:** `#stockists` id, "Find a Stockist" link, search keywords include stockist.
- **Proposed fix:** Rename anchor to `#studio`, update link text to "Copenhagen studio", update search item.
- **Expected outcome:** Honest studio-by-request positioning; no fake stockist signal.
- **Risk:** Low (hash change; no external links to #stockists expected)

### 4. Fix "Oil-based" → "Oil-rich parfum" in journal
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 4 |
| Conversion | 3 |
| SEO/a11y/perf | 4 |
| Implementation safety | 5 |
| **Total** | **21** |

- **Problem:** `journal/fico-d-india.html` CTA says "Oil-based parfum" while site uses "oil-rich parfum".
- **Proposed fix:** Single copy change in article CTA.
- **Risk:** Low

### 5. Add boutique store card captions
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 5 |
| Conversion | 4 |
| SEO/a11y/perf | 3 |
| Implementation safety | 5 |
| **Total** | **22** |

- **Problem:** Boutique grid hides `.product-card__body`; chapter status not always readable.
- **Page/section:** `/store` product grid (`script.js`, `styles.css`)
- **Proposed fix:** Add `buildStoreCardCaption()` and visible caption overlay per card.
- **Risk:** Low

### 6. Remove hardcoded notify email fallback
| Category | Score |
|----------|-------|
| Brand fit | 4 |
| User clarity | 3 |
| Conversion | 2 |
| SEO/a11y/perf | 5 |
| Implementation safety | 5 |
| **Total** | **19** |

- **Problem:** Personal Gmail hardcoded as fallback in `getNotifyRecipients()`.
- **Proposed fix:** Require `WAITLIST_NOTIFY_EMAIL` or `ADMIN_NOTIFY_EMAIL`; no fallback.
- **Risk:** Low (signup still succeeds; only admin notify skipped if unconfigured)

---

## REJECTED (score <17 or brand violation)

| Suggestion | Reason rejected |
|------------|-----------------|
| Add generic Contact page | Brand rule: no generic contact page; mailto sufficient |
| Add Appointments booking page/form | Brand rule: no studio address/booking form |
| Push discovery set / sample kit | Brand rule: no sample kit push |
| Rewrite homepage as product page | Maison architecture is correct |
| Add fake stockists or press | Brand rule |
| React conversion / build system | Brand rule |
| Change Beles PreOrder schema to OutOfStock | Beles is genuinely waitlist/pre-release; PreOrder is appropriate |
| Remove Copenhagen studio appointment mailto | Valid editorial studio access; not a generic appointments page |
| Full site redesign | Out of scope; incremental only |
| Add customer reviews / testimonials | Brand rule: no fake reviews |
| Rename Ritual chapter (homepage conflict) | No real conflict; contexts differ |
