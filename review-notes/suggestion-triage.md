# Suggestion Triage — 2026-06-18 (10:01 UTC cron)

Scoring: Brand fit | User clarity | Conversion | SEO/a11y/perf | Implementation safety (max 25). **Implement if ≥ 17.**

Prior loop items (schema, store cards, copy, notify safety) were verified as already implemented — no re-implementation needed.

---

## Accepted (score ≥ 17)

### 1. Remove stray `</a>` in homepage search overlay
| Category | Score |
|----------|-------|
| Brand fit | 3 |
| User clarity | 5 |
| Conversion | 2 |
| SEO/a11y/perf | 5 |
| Implementation safety | 5 |
| **Total** | **20** |

- **Problem:** Invalid HTML in search results panel
- **Page:** `/` search overlay
- **Evidence:** Extra `</a>` after Copenhagen studio link (line 280)
- **Fix:** Remove stray closing tag
- **Expected outcome:** Valid DOM; search overlay links parse correctly
- **Risk:** None

### 2. Fix `package.json` JSON syntax
| Category | Score |
|----------|-------|
| Brand fit | 1 |
| User clarity | 3 |
| Conversion | 1 |
| SEO/a11y/perf | 2 |
| Implementation safety | 5 |
| **Total** | **12** → **Accepted on safety override** |

- **Problem:** Missing comma breaks all npm scripts
- **Evidence:** `JSON.parse` fails at line 8; `npm run dev` and `npm run verify` unusable
- **Fix:** Add comma after `verify` script entry
- **Expected outcome:** Local dev and verify tooling work
- **Risk:** None

---

## Rejected (score < 17 or brand violation)

| Suggestion | Reason rejected |
|------------|-----------------|
| Add Contact page | Violates brand rules |
| Add Appointments page | Violates brand rules |
| Push discovery sample kit | Violates brand rules |
| Add stockist directory | No real stockists |
| Remove craftsmanship sustainability section | Content is factual (small batch, glass, minimal wrap) — not fake claims |
| Re-implement prior loop schema/card fixes | Already in codebase |
| Sitewide cache-bust unification | Cosmetic scope creep |
| Homepage hero rewrite | Current copy is strong and on-brand |
