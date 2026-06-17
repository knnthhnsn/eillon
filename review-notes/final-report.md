# Final Report — EILLON Review Loop 2026-06-17

## External ChatGPT review summary

**Method:** ChatGPT Pro browser was unavailable in the cloud automation environment. An independent audit of https://eillon.maison/ and the local codebase was performed using the same prompt scope and brand filters.

### Strongest suggestions (implemented)

1. Fix chapter JSON-LD `PreOrder` → `OutOfStock` on unreleased pages
2. Remove hardcoded personal email from waitlist notification fallback
3. Align CSS/JS cache-busting versions across all pages
4. Rename misleading "Find a Stockist" and search "Appointments" labels

### Weakest suggestions (rejected)

- Generic Contact/Appointments pages
- Discovery set / sample kit merchandising
- Fake stockists, press, or reviews
- Framework migration or heavy ecommerce expansion

### Suggestions rejected and why

| Suggestion | Reason |
|------------|--------|
| Dedicated Contact page | Brand rule — editorial maison, not generic contact |
| Sample kit / discovery set push | Brand rule |
| Add external stockists | No real stockists to list |
| Make Ritual purchasable | Lab study only |
| React / build system | Brand rule — keep static site |

---

## Implemented changes

### 1. Chapter JSON-LD availability
- **Files:** `asmara.html`, `massawa.html`, `ritual.html`
- **Change:** `PreOrder` → `OutOfStock` in Product offers schema
- **Why:** Visible copy says not for sale; schema must match
- **Expected effect:** Accurate rich-result signals for future chapters

### 2. Waitlist notification email
- **File:** `lib/waitlist-notify.js`
- **Change:** Removed hardcoded Gmail fallback; empty env returns `notifications_not_configured`
- **Why:** Protect personal data; env vars are source of truth
- **Expected effect:** No accidental emails to private address in misconfigured deploys

### 3. Cache version alignment
- **Files:** All HTML pages (20 files)
- **Change:** `styles.css?v=105`, `script.js?v=66` site-wide
- **Why:** Legal/journal/store pages were on stale v=70/v=47
- **Expected effect:** Consistent styling and waitlist JS after deploy

### 4. Navigation copy clarity
- **File:** `index.html`
- **Change:** "Find a Stockist" → "Copenhagen studio"; search "Appointments" → "Copenhagen studio"
- **Why:** Section is studio appointments, not third-party stockists
- **Expected effect:** Honest, editorial navigation

### 5. Chapter waitlist size wording
- **Files:** `asmara.html`, `massawa.html`, `ritual.html`
- **Change:** "Discovery sample" → "2 ml sample"
- **Why:** Avoids sample-kit merchandising tone on unreleased chapters
- **Expected effect:** Neutral size preference language

### 6. Review documentation
- **Files:** `review-notes/chatgpt-live-review.md`, `suggestion-triage.md`, `implementation-plan.md`, `final-report.md`
- **Why:** Audit trail for automation loop

---

## Rejected changes (not implemented)

- Generic contact/appointments pages
- Discovery set CTAs
- Fake stockists or press
- Purchasable future chapters
- Site-wide redesign or framework migration

---

## Test results

### Routes tested (all HTTP 200)

| Route | Title verified |
|-------|----------------|
| `/` | EILLON — Afro-Mediterranean Memory Perfumery |
| `/store` | The Boutique — EILLON |
| `/beles` | Beles · Fico d'India |
| `/asmara` | Asmara · Rain on Stone |
| `/massawa` | Massawa · Red Sea Citrus |
| `/ritual` | Ritual · Frankincense & Myrrh |
| `/journal` | Journal — EILLON |
| `/journal/fico-d-india` | What Fico d'India means in Beles |
| `/journal/the-bottle` | The bottle as architecture |
| `/privacy` | Privacy — EILLON |
| `/terms` | Terms — EILLON |
| `/imprint` | Imprint — EILLON |

### Forms checked

| Page | `product_slug` | Status language |
|------|----------------|-----------------|
| `/beles` | `beles` | Waitlist open / PreOrder schema |
| `/asmara` | `asmara` | In production / OutOfStock schema |
| `/massawa` | `massawa` | Coming soon / OutOfStock schema |
| `/ritual` | `ritual` | Concept lab / OutOfStock schema |
| Footer / store letter | `all` | Newsletter |

### Console / assets

- Dev server: `python3 scripts/dev-server.py` on port 8080 — all routes load
- Store page includes `data-product-grid` and `script.js?v=66`
- Privacy page loads `styles.css?v=105`
- No hardcoded personal email in `lib/waitlist-notify.js`
- Referenced images in `index.html` exist locally

### Known issues

- None blocking deploy from this loop
- Product cards on `/store` require JS execution (by design); static curl does not render cards but `data-product-grid` + `products.js` are present

---

## Deployment notes

**Safe to deploy:** Yes — small, focused changes; no breaking API or routing changes.

**Environment variables required for notifications:**

- `WAITLIST_NOTIFY_EMAIL` or `ADMIN_NOTIFY_EMAIL` (required for admin signup alerts after hardcoded fallback removal)
- `DATABASE_URL` (waitlist persistence)
- `RESEND_API_KEY` (email delivery)
- `WAITLIST_ADMIN_KEY` (admin page access)

**Manual checks before/after deploy:**

1. Confirm `WAITLIST_NOTIFY_EMAIL` is set in Vercel production
2. Spot-check `/store` product cards render in browser
3. Submit test waitlist on `/beles` and verify API response
4. Validate rich results / schema on chapter pages if using Search Console

---

## Files changed

- `asmara.html`, `massawa.html`, `ritual.html` — schema, sample wording, cache versions
- `index.html` — navigation labels, cache versions
- `lib/waitlist-notify.js` — email fallback removal
- All other HTML pages — cache version bumps
- `review-notes/*` — audit documentation
