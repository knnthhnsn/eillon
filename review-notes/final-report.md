# Final Report — EILLON Review Loop 2026-06-18

## External ChatGPT review summary

**Browser review:** Not performed — cloud agent has no access to signed-in ChatGPT Pro session.

**Substitute:** Live site fetch (https://eillon.maison/) plus full local codebase audit.

### Strongest suggestions (accepted)

1. Fix JSON-LD `PreOrder` on non-purchasable chapters → `OutOfStock`
2. Remove purchase-implying size selectors on Asmara, Massawa, Ritual forms
3. Remove hardcoded personal notify email from `lib/waitlist-notify.js`
4. Fix misleading "Find a Stockist" footer label
5. Unify CSS/JS cache-busting versions sitewide

### Weakest suggestions (rejected)

- Generic Contact / Appointments pages
- Discovery set / sample kit marketing push
- Full homepage rewrite
- React / build system migration
- Fake stockists, press, or reviews

### Suggestions rejected and why

| Suggestion | Reason |
|------------|--------|
| Contact page | Brand rules |
| Appointments page | Brand rules (mailto studio visit retained) |
| Sample kit push | Brand rules |
| Remove wear section | No conflict with Ritual chapter |
| Homepage redesign | Unnecessary scope; site is on-brand |

---

## Implemented changes

### 1. `asmara.html`, `massawa.html`, `ritual.html` — JSON-LD schema
- **What:** `PreOrder` → `OutOfStock` in Product offers
- **Why:** Pages state not for sale / in production / lab study
- **Expected effect:** Search engines no longer imply purchasable products

### 2. `asmara.html`, `massawa.html`, `ritual.html` — waitlist forms
- **What:** Removed "Preferred size" dropdown (Discovery sample / 50 ml / 100 ml)
- **Why:** Implied bottle purchase before release
- **Expected effect:** Forms read as interest/updates only

### 3. `lib/waitlist-notify.js` — notify recipients
- **What:** Removed hardcoded personal email fallback
- **Why:** Security / privacy; env vars are documented in README
- **Expected effect:** No personal data in repo; notifications skip if env unset (signup still succeeds)

### 4. `index.html` — footer and search copy
- **What:** "Find a Stockist" → "Copenhagen studio"; search "Appointments/stockists" → "Copenhagen studio / Private visits by request"
- **Why:** No fake stockist network; honest studio positioning
- **Expected effect:** Brand integrity; clearer navigation

### 5. All HTML pages — cache busting
- **What:** Unified to `styles.css?v=105`, `script.js?v=66`
- **Why:** Store, journal, and legal pages were on stale v=70/v=47
- **Expected effect:** Consistent styling and JS after deploy

### 6. `sitemap.xml` — lastmod
- **What:** Updated 2026-06-17 entries to 2026-06-18
- **Why:** Reflects review-loop changes
- **Expected effect:** Crawlers see fresh timestamps

### 8. `script.js` + `styles.css` — boutique store card captions
- **What:** Added `buildStoreCardCaption()` and overlay styles on `/store` chapter cards
- **Why:** Image-only cards hid Beles name/status; poor scan clarity
- **Expected effect:** Name, subtitle, and release status visible on each boutique card

### 9. `index.html` — studio anchor ID
- **What:** Renamed `#stockists` → `#studio` (footer + search links)
- **Why:** Remove last stockist ID reference while keeping Copenhagen studio copy
- **Expected effect:** Consistent studio language in DOM and navigation

### 10. `index.html`, `store.html` — cache bump
- **What:** `styles.css?v=106`, `script.js?v=67` on homepage and boutique
- **Why:** Pick up caption styles and JS after this pass
- **Expected effect:** Fresh assets on key conversion pages

---

## Rejected changes (not implemented)

| What | Why |
|------|-----|
| Contact / Appointments pages | Brand rules |
| Discovery set promotion | Brand rules |
| Remove Copenhagen studio mailto | Legitimate private visits documented in about/imprint |
| Beles schema change | PreOrder is correct for waitlist-open product |
| Full site redesign | Out of scope; site is editorial and on-brand |

---

## Test results

### Routes tested (dev server `python3 scripts/dev-server.py`, port 8080)

| Route | Status |
|-------|--------|
| `/` | 200 |
| `/store` | 200 |
| `/beles` | 200 |
| `/asmara` | 200 |
| `/massawa` | 200 |
| `/ritual` | 200 |
| `/journal` | 200 |
| `/journal/fico-d-india` | 200 |
| `/journal/the-bottle` | 200 |
| `/privacy` | 200 |
| `/terms` | 200 |
| `/imprint` | 200 |

### Forms checked

| Page | `product_slug` | Status language |
|------|----------------|-----------------|
| `/beles` | `beles` | Waitlist open ✓ |
| `/asmara` | `asmara` | In production / updates only ✓ |
| `/massawa` | `massawa` | Coming soon ✓ |
| `/ritual` | `ritual` | Lab study / not for sale ✓ |
| `/` footer | `all` | Newsletter ✓ |
| `/store` letter | `all` | Newsletter ✓ |

### Schema verification

- Beles: `PreOrder` (correct)
- Asmara, Massawa, Ritual: `OutOfStock` (fixed)
- No `Preferred size` on chapter forms (fixed)

### Console / assets

- All routes load via dev server with clean URL rewriting
- No hardcoded personal email in notify lib
- Cache versions at v=106 / v=67 on homepage and store (caption pass)

### Known issues

- None blocking deploy from this review loop
- `WAITLIST_NOTIFY_EMAIL` or `ADMIN_NOTIFY_EMAIL` must be set in production for signup notifications (no fallback after this change)

---

## Deployment notes

**Safe to deploy:** Yes — changes are copy, schema, form simplification, cache busting, and security cleanup.

**Environment variables required:**

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Waitlist storage |
| `RESEND_API_KEY` | Email notifications |
| `WAITLIST_NOTIFY_EMAIL` or `ADMIN_NOTIFY_EMAIL` | Notify recipient(s) — **required** after removing hardcoded fallback |
| `WAITLIST_ADMIN_KEY` | Admin dashboard |

**Manual checks before/after deploy:**

1. Confirm `WAITLIST_NOTIFY_EMAIL` is set in Vercel production
2. Spot-check `/store` product cards render with current JS
3. Submit test waitlist on `/beles` and one chapter page
4. Verify Google Rich Results for Beles (PreOrder) vs chapters (OutOfStock)

**Branch:** `review-loop-eillon-2026-06-18`
