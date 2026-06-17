# Suggestion Triage — EILLON Review Loop 2026-06-17

Scoring: Brand fit (0–5) · User clarity (0–5) · Conversion value (0–5) · SEO/a11y/perf (0–5) · Implementation safety (0–5) · **Max 25**

Threshold: **Implement only 17+**

---

## Accepted (17+)

### 1. Fix Product schema availability on non-purchasable chapters
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 4 |
| Conversion | 3 |
| SEO/a11y/perf | 5 |
| Safety | 5 |
| **Total** | **22** |

- **Problem:** Asmara, Massawa, Ritual schema claims `PreOrder` while pages say not purchasable; Ritual is lab study.
- **Page/section:** `asmara.html`, `massawa.html`, `ritual.html` JSON-LD
- **Evidence:** Page copy: "not yet available to purchase"; Ritual: "not for sale"
- **Proposed fix:** Change availability to `OutOfStock`; Ritual remove misleading purchase implication
- **Expected outcome:** Search engines and rich results align with visible status
- **Risk:** Low

### 2. Align journal copy: oil-based → oil-rich
| Category | Score |
|----------|-------|
| Brand fit | 5 |
| User clarity | 4 |
| Conversion | 3 |
| SEO/a11y/perf | 4 |
| Safety | 5 |
| **Total** | **21** |

- **Problem:** Inconsistent terminology in journal CTA
- **Page/section:** `journal/fico-d-india.html` article CTA
- **Evidence:** Line reads "Oil-based parfum"; site standard is "oil-rich"
- **Proposed fix:** Replace with "Oil-rich parfum"
- **Expected outcome:** Consistent brand language
- **Risk:** Low

### 3. Remove hardcoded personal email from waitlist notifications
| Category | Score |
|----------|-------|
| Brand fit | 4 |
| User clarity | 3 |
| Conversion | 2 |
| SEO/a11y/perf | 5 |
| Safety | 5 |
| **Total** | **19** |

- **Problem:** Fallback notify email is a personal Gmail in source code
- **Page/section:** `lib/waitlist-notify.js`
- **Evidence:** `|| 'kennethchristoffer@gmail.com'`
- **Proposed fix:** Use env vars only; skip notify when unconfigured
- **Expected outcome:** No personal data in repo; prod uses env
- **Risk:** Low (signup still succeeds; notify already optional)

### 4. Fix privacy meta description
| Category | Score |
|----------|-------|
| Brand fit | 4 |
| User clarity | 4 |
| Conversion | 2 |
| SEO/a11y/perf | 4 |
| Safety | 5 |
| **Total** | **19** |

- **Problem:** Meta mentions "appointment data" but no appointment form exists
- **Page/section:** `privacy.html` meta description
- **Evidence:** `content="...waitlist, newsletter, and appointment data."`
- **Proposed fix:** "waitlist, newsletter, and studio contact"
- **Expected outcome:** Accurate SEO snippet
- **Risk:** Low

### 5. Sync CSS cache-bust versions on legal/journal pages
| Category | Score |
|----------|-------|
| Brand fit | 3 |
| User clarity | 3 |
| Conversion | 2 |
| SEO/a11y/perf | 4 |
| Safety | 5 |
| **Total** | **17** |

- **Problem:** Journal/legal pages load older `styles.css?v=70`
- **Page/section:** journal, privacy, terms, imprint, store
- **Evidence:** Main pages at v=104, legal at v=70
- **Proposed fix:** Bump to v=105 on stale pages
- **Expected outcome:** Consistent styling after deploy
- **Risk:** Low

---

## Rejected (<17 or brand violation)

| Suggestion | Reason rejected |
|------------|-----------------|
| Add Contact / Appointments page | Brand rule — no generic contact/appointments page |
| Discovery sample kit push | Brand rule — no sample kit push |
| Remove homepage palette note lists | Scores 14 — palette is maison scent-world language, not product pyramid; editorial fit |
| Add customer reviews / press logos | Brand rule — no fake press/reviews |
| Convert to React / add build system | Brand rule — no framework migration |
| Change Ritual product page to full purchasable layout | Brand rule — Ritual stays lab study |
| Remove imprint appointment hours | Scores 12 — legal disclosure by request, not a booking form |
| Add heavy ecommerce (cart, checkout) | Brand rule — editorial maison, not commercial store |
| Rewrite homepage to remove all Beles mentions | Scores 11 — Beles as first chapter is intentional; boutique CTA appropriate |
| Add structured data FAQ to all chapter pages | Scores 15 — Beles FAQ sufficient; marginal gain |
| Remove "Discovery sample" from chapter waitlist size selects | Scores 13 — size preference only, not a kit product push |
