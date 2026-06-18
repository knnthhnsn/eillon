# Suggestion Triage — 2026-06-18

Scoring: Brand fit · User clarity · Conversion · SEO/a11y/perf · Implementation safety (max 25). Implement ≥17.

---

## ACCEPTED (implement)

### 1. Remove size selectors on Asmara, Massawa, Ritual
| Category | Score |
|---|---|
| Brand fit | 5 |
| User clarity | 5 |
| Conversion | 4 |
| SEO/a11y/perf | 4 |
| Safety | 5 |
| **Total** | **23** |

- **Problem:** Size dropdown on update-only / lab pages implies bottles can be ordered.
- **Page:** asmara.html, massawa.html, ritual.html
- **Evidence:** Live Asmara shows "Preferred size" with sample/50ml/100ml options; copy says "not yet available to purchase."
- **Fix:** Remove size `<select>` from all three forms.
- **Outcome:** Clearer non-purchasable status.
- **Risk:** Low

### 2. Fix JSON-LD availability on non-purchasable chapters
| Category | Score |
|---|---|
| Brand fit | 4 |
| User clarity | 4 |
| Conversion | 3 |
| SEO/a11y/perf | 5 |
| Safety | 5 |
| **Total** | **21** |

- **Problem:** `PreOrder` schema on pages that say not for sale / in production / lab.
- **Page:** asmara.html, massawa.html, ritual.html
- **Fix:** Change to `https://schema.org/OutOfStock`
- **Outcome:** Search engines won't misrepresent purchase availability.
- **Risk:** Low

### 3. Fix "oil-based" → "oil-rich parfum" on journal
| Category | Score |
|---|---|
| Brand fit | 5 |
| User clarity | 5 |
| Conversion | 3 |
| SEO/a11y/perf | 4 |
| Safety | 5 |
| **Total** | **22** |

- **Problem:** Inconsistent terminology; "oil-based" overstates formula type.
- **Page:** journal/fico-d-india.html
- **Fix:** "Oil-rich parfum · Copenhagen · Waitlist open"
- **Risk:** Low

### 4. Remove hardcoded notify email fallback
| Category | Score |
|---|---|
| Brand fit | 3 |
| User clarity | 3 |
| Conversion | 2 |
| SEO/a11y/perf | 5 |
| Safety | 5 |
| **Total** | **18** |

- **Problem:** Personal Gmail hardcoded as fallback in `lib/waitlist-notify.js`.
- **Fix:** Require `WAITLIST_NOTIFY_EMAIL` or `ADMIN_NOTIFY_EMAIL`; return not configured if missing.
- **Risk:** Low (production must have env var set)

### 5. Fix misleading stockist / appointments navigation on homepage
| Category | Score |
|---|---|
| Brand fit | 5 |
| User clarity | 5 |
| Conversion | 3 |
| SEO/a11y/perf | 3 |
| Safety | 5 |
| **Total** | **21** |

- **Problem:** "Find a Stockist" and search "Appointments" imply retail/booking pages that don't exist and violate brand rules.
- **Page:** index.html
- **Fix:** Rename anchor `#stockists` → `#studio`; footer link → "Copenhagen studio"; search entry → "Copenhagen studio" with accurate description.
- **Risk:** Low

---

## REJECTED

| Suggestion | Reason |
|---|---|
| Add Contact page | Violates brand rules — no generic contact page |
| Add Appointments page | Violates brand rules — studio visits stay as mailto in footer |
| Discovery set / sample kit push | Violates brand rules |
| Remove Copenhagen studio section entirely | Real studio visits exist; only misleading labels need fixing |
| Rewrite homepage hero | Brand voice is strong; unnecessary scope |
| Add fake stockists or press | Violates brand rules |
| Change Beles PreOrder schema | Correct for waitlist-open product |
| Add React / build system | Out of scope |
| Remove mini-waitlist forms on store cards | Useful for chapter updates; CTAs match status |
