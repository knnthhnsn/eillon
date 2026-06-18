# Suggestion Triage — 2026-06-18 (09:01 UTC cron)

Scoring: Brand fit | User clarity | Conversion | SEO/a11y/perf | Implementation safety (max 25). **Implement if ≥ 17.**

---

## Accepted (score ≥ 17)

### 1. Remove stray `</a>` in homepage search overlay
| Category | Score |
|----------|-------|
| Brand fit | 3 |
| User clarity | 4 |
| Conversion | 2 |
| SEO/a11y/perf | 5 |
| Implementation safety | 5 |
| **Total** | **19** |

- **Problem:** Extra closing anchor tag after Copenhagen studio search item
- **Page:** `/` search overlay
- **Evidence:** Line 280 `</a>` with no matching open tag; anchor open/close count mismatched before fix
- **Fix:** Remove stray `</a>`
- **Expected outcome:** Valid HTML; search overlay parses correctly
- **Risk:** None

### 2. Fix invalid `package.json` syntax
| Category | Score |
|----------|-------|
| Brand fit | 1 |
| User clarity | 3 |
| Conversion | 1 |
| SEO/a11y/perf | 2 |
| Implementation safety | 5 |
| **Total** | **12** → **Accepted on tooling override** |

- **Problem:** Missing comma breaks JSON parse; `npm run` scripts may fail
- **Evidence:** `SyntaxError: Expected ',' or '}'` at line 8
- **Fix:** Add comma after `verify` script entry
- **Expected outcome:** Valid package.json; dev/verify scripts runnable
- **Risk:** None

### 3. Align privacy copy to restock-list language
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 5 |
| Conversion | 2 |
| SEO/a11y/perf | 2 |
| Implementation safety | 5 |
| **Total** | **19** |

- **Problem:** Privacy page says "Beles waitlist" while site is out-of-stock / restock-list
- **Page:** `/privacy`
- **Evidence:** "join the Beles waitlist", "boutique waitlist form"
- **Fix:** Use "chapter restock list" language consistent with store and product pages
- **Expected outcome:** Legal copy matches visible product status
- **Risk:** None

### 4. Add journal article URLs to llms.txt
| Category | Score |
|----------|-------|
| Brand fit | 3 |
| User clarity | 3 |
| Conversion | 2 |
| SEO/a11y/perf | 4 |
| Implementation safety | 5 |
| **Total** | **17** |

- **Problem:** `llms.txt` lists journal index but not article pages
- **Fix:** Add `/journal/fico-d-india` and `/journal/the-bottle`
- **Expected outcome:** AI crawlers can discover editorial content
- **Risk:** None

---

## Prior loop — already implemented (verified, not re-done)

| Item | Status |
|------|--------|
| Asmara/Massawa OutOfStock schema | ✓ |
| Ritual no purchase offers | ✓ |
| Store card out-of-stock overlays | ✓ |
| Journal oil-rich copy | ✓ |
| Copenhagen studio nav labels | ✓ |
| No hardcoded notify email | ✓ |

---

## Rejected (score < 17 or brand violation)

| Suggestion | Reason rejected |
|------------|-----------------|
| Add Contact page | Violates brand rules |
| Add Appointments page | Violates brand rules; studio mailto is sufficient |
| Push discovery sample kit | Violates brand rules |
| Add stockist directory | No real stockists — would be fake |
| Add press/review section | No verified press to cite |
| Rewrite homepage hero | Current copy is strong and on-brand |
| Revert out-of-stock to waitlist-open | Code and live site intentionally out-of-stock |
| Unify all `styles.css?v=` cache versions | Cosmetic; out of scope |
