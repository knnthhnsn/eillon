# Suggestion Triage — 2026-06-18

Scoring: Brand fit | User clarity | Conversion | SEO/a11y/perf | Implementation safety (max 25). **Implement if ≥ 17.**

---

## Accepted (score ≥ 17)

### 1. Fix incorrect PreOrder schema on future chapters
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 4 |
| Conversion | 3 |
| SEO/a11y/perf | 5 |
| Implementation safety | 5 |
| **Total** | **22** |

- **Problem:** Asmara/Massawa JSON-LD claims `PreOrder` while copy says not purchasable
- **Page:** `/asmara`, `/massawa`
- **Evidence:** `"availability": "https://schema.org/PreOrder"` in product schema
- **Fix:** Change to `OutOfStock`; point offer URL to chapter page (not waitlist purchase)
- **Expected outcome:** Schema matches visible status; safer rich-result signals
- **Risk:** Low

### 2. Remove purchase offer schema from Ritual lab study
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 4 |
| Conversion | 2 |
| SEO/a11y/perf | 5 |
| Implementation safety | 5 |
| **Total** | **21** |

- **Problem:** Ritual is not for sale but schema includes PreOrder offer
- **Page:** `/ritual`
- **Evidence:** Product `offers` block with PreOrder
- **Fix:** Remove `offers` from Ritual Product schema
- **Expected outcome:** No implied purchasability in structured data
- **Risk:** Low

### 3. Show Beles name/status on store boutique cards
| Category | Score |
|----------|-------|
| Brand fit | 4 |
| User clarity | 5 |
| Conversion | 5 |
| SEO/a11y/perf | 3 |
| Implementation safety | 5 |
| **Total** | **22** |

- **Problem:** Boutique grid hides card body; Beles (waitlist-open) had no image overlay label
- **Page:** `/store`
- **Evidence:** `product-grid--boutique .product-card__body { display: none }`; labels only for non-waitlist statuses
- **Fix:** Add waitlist-open image label with status + chapter name on mood cards
- **Expected outcome:** All four chapter cards readable at a glance
- **Risk:** Low

### 4. Align “oil-based” → “oil-rich” in journal
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 4 |
| Conversion | 3 |
| SEO/a11y/perf | 3 |
| Implementation safety | 5 |
| **Total** | **20** |

- **Problem:** Inconsistent terminology vs Beles product page and maison copy
- **Page:** `/journal/fico-d-india`
- **Evidence:** CTA line “Oil-based parfum”
- **Fix:** “Oil-rich parfum”
- **Expected outcome:** Consistent brand language
- **Risk:** None

### 5. Rename misleading “Find a Stockist” footer link
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 5 |
| Conversion | 3 |
| SEO/a11y/perf | 2 |
| Implementation safety | 5 |
| **Total** | **20** |

- **Problem:** Link implies stockists exist; section is Copenhagen studio appointments only
- **Page:** `/` footer
- **Evidence:** “Find a Stockist” → `#stockists` with studio appointment copy only
- **Fix:** Label “Copenhagen studio”
- **Expected outcome:** No fake stockist implication
- **Risk:** None

### 6. Clarify homepage search studio entry
| Category | Score |
|----------|-------|
| Brand fit | 4 |
| User clarity | 5 |
| Conversion | 2 |
| SEO/a11y/perf | 2 |
| Implementation safety | 5 |
| **Total** | **18** |

- **Problem:** Search item “Appointments” sounds like a dedicated page
- **Page:** `/` search overlay
- **Fix:** Rename to “Copenhagen studio” with accurate subtitle
- **Expected outcome:** Clearer navigation expectation
- **Risk:** None

### 7. Remove hardcoded personal notify email fallback
| Category | Score |
|----------|-------|
| Brand fit | 3 |
| User clarity | 2 |
| Conversion | 1 |
| SEO/a11y/perf | 2 |
| Implementation safety | 5 |
| **Total** | **13** → **Accepted on safety override** |

- **Problem:** Personal Gmail hardcoded as fallback in `waitlist-notify.js`
- **Evidence:** `|| 'kennethchristoffer@gmail.com'`
- **Fix:** Require `WAITLIST_NOTIFY_EMAIL` or `ADMIN_NOTIFY_EMAIL`; skip send if unset
- **Expected outcome:** No personal data in repo; notifications only when configured
- **Risk:** Low — signup still succeeds; only admin notify skipped

---

## Rejected (score < 17 or brand violation)

| Suggestion | Reason rejected |
|------------|-----------------|
| Add Contact page | Violates brand rules |
| Add Appointments page | Violates brand rules; studio mailto is sufficient |
| Push discovery sample kit | Violates brand rules |
| Add stockist directory | No real stockists — would be fake |
| Add press/review section | No verified press to cite |
| Rewrite homepage hero | Low confidence; current copy is strong and on-brand |
| Unify all `styles.css?v=` cache versions sitewide | Cosmetic; out of scope |
| Change Ritual page `@type` to CreativeWork | Larger schema refactor; removing offers is sufficient |
| Add visible prices to store boutique cards | Editorial boutique intent; Beles pricing belongs on `/beles` |
| Remove Copenhagen studio appointment block | Editorial maison touch; not a generic booking form |
