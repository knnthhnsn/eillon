# Suggestion Triage — 2026-06-18 (11:00 UTC run)

Scoring: Brand fit | User clarity | Conversion | SEO/a11y/perf | Implementation safety (max 25). **Implement if ≥ 17.**

---

## Accepted (score ≥ 17)

### 1. Fix site-wide search overlay studio link (NEW this run)
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 5 |
| Conversion | 3 |
| SEO/a11y/perf | 2 |
| Implementation safety | 5 |
| **Total** | **20** |

- **Problem:** Search overlay on all pages still says “Appointments” / “stockists” and links to `#stockists`, which no longer exists (homepage uses `#studio`)
- **Page:** All pages via `scripts/site-nav.js`
- **Evidence:** Injected search item href `#stockists`; footer uses `#studio`
- **Fix:** Rename to “Copenhagen studio”, accurate subtitle, link to `#studio` / `/#studio`
- **Expected outcome:** Working anchor + no fake stockist implication in global nav search
- **Risk:** None

### 2. Fix incorrect PreOrder schema on future chapters (prior loop — verified)
| **Total** | **22** |

Already implemented in `asmara.html`, `massawa.html`.

### 3. Remove purchase offer schema from Ritual lab study (prior loop — verified)
| **Total** | **21** |

Already implemented in `ritual.html`.

### 4. Show chapter name/status on store boutique cards (prior loop — verified)
| **Total** | **22** |

Already implemented in `script.js`, `styles.css`, `store.html`.

### 5. Align “oil-based” → “oil-rich” in journal (prior loop — verified)
| **Total** | **20** |

Already implemented in `journal/fico-d-india.html`.

### 6. Rename misleading footer link on homepage (prior loop — verified)
| **Total** | **20** |

Already implemented in `index.html`.

### 7. Remove hardcoded personal notify email fallback (prior loop — verified)
| **Total** | **13** → **Accepted on safety override** |

Already implemented in `lib/waitlist-notify.js`.

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
| Unify all `styles.css?v=` cache versions sitewide | Cosmetic; out of scope |
| Change Ritual `@type` to CreativeWork | Larger schema refactor; removing offers is sufficient |
| Add visible prices to store boutique cards | Editorial boutique intent; Beles pricing belongs on `/beles` |
| Revert out-of-stock status to waitlist-open | Codebase intentionally uses out-of-stock; live site matches |
