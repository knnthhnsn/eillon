# Final Report — EILLON Review Loop 2026-06-18

**Automation run:** 2026-06-18T06:00 UTC (cron) — verified prior loop; no additional code changes required.

## External ChatGPT review summary

**Method:** ChatGPT browser review was unavailable. One proxy cycle used live site fetches + full codebase audit (documented in `chatgpt-live-review.md`).

### Strongest suggestions (accepted)

1. Fix misleading `PreOrder` schema on non-purchasable chapters
2. Add visible Beles name/status on store boutique cards
3. Remove fake stockist implication in footer navigation
4. Align journal copy to “oil-rich” brand language

### Weakest suggestions (rejected)

- Sitewide visual redesign
- Adding Contact/Appointments pages
- Discovery set merchandising push
- Stockist directory without real partners

### Rejected and why

| Suggestion | Reason |
|------------|--------|
| Contact / Appointments pages | Brand rules — studio mailto is sufficient |
| Discovery sample kit push | Brand rules |
| Stockist directory | Would imply fake availability |
| Homepage hero rewrite | Current maison copy is strong; low confidence gain |
| Full cache-bust unification | Cosmetic scope creep |

---

## Implemented changes

### 1. `asmara.html`, `massawa.html`
- **What:** Product schema `availability` changed from `PreOrder` to `OutOfStock`; offer URL points to chapter page
- **Why:** Pages explicitly state not purchasable; schema must match
- **Expected effect:** Accurate structured data for future chapters

### 2. `ritual.html`
- **What:** Removed `offers` block from Product JSON-LD
- **Why:** Lab study is not for sale
- **Expected effect:** No purchase implication in search/AI crawlers

### 3. `script.js`, `styles.css`, `store.html`
- **What:** Added waitlist-open image overlay label (status + chapter name) on boutique product cards; bumped cache versions
- **Why:** Beles card was image-only in store grid while other chapters had status overlays
- **Expected effect:** All four boutique cards readable without opening each page

### 4. `journal/fico-d-india.html`
- **What:** “Oil-based parfum” → “Oil-rich parfum” in article CTA
- **Why:** Site-wide terminology standard
- **Expected effect:** Consistent brand language

### 5. `index.html`
- **What:** Footer “Find a Stockist” → “Copenhagen studio”; search “Appointments” → “Copenhagen studio”
- **Why:** No stockists listed; avoids misleading navigation
- **Expected effect:** Clearer studio appointment path via `#studio`

### 6. `lib/waitlist-notify.js`
- **What:** Removed hardcoded personal Gmail fallback
- **Why:** Privacy/safety — notifications should require explicit env configuration
- **Expected effect:** Signups still save; admin email only when `WAITLIST_NOTIFY_EMAIL` or `ADMIN_NOTIFY_EMAIL` is set

---

## Test results

### Routes tested (all HTTP 200)

`/`, `/store`, `/beles`, `/asmara`, `/massawa`, `/ritual`, `/journal`, `/journal/fico-d-india`, `/journal/the-bottle`, `/privacy`, `/terms`, `/imprint`

### Forms checked

| Page | `product_slug` | Status language |
|------|----------------|-----------------|
| `/beles` | `beles` | Waitlist open |
| `/asmara` | `asmara` | In production / updates |
| `/massawa` | `massawa` | Coming soon / notify |
| `/ritual` | `ritual` | Lab study / not for sale |
| `/store` letter | `all` | Newsletter |
| `/` footer | `all` | Newsletter |

### Console / assets

- Local dev server: no startup errors
- All referenced image assets present in `/images`
- Schema validation: asmara/massawa `OutOfStock`; ritual no `PreOrder`

### Known issues

- None blocking deploy from this loop
- Admin waitlist notifications require env vars to be set (intentional after removing hardcoded fallback)

---

## Deployment notes

**Safe to deploy:** Yes — focused static + notify safety changes.

**Environment variables:**

- `WAITLIST_NOTIFY_EMAIL` or `ADMIN_NOTIFY_EMAIL` — required for signup notifications
- `RESEND_API_KEY`, `RESEND_FROM` — required for email delivery
- `DATABASE_URL` — existing waitlist DB (unchanged)

**Manual checks after deploy:**

1. Open `/store` on mobile — confirm Beles card shows “Waitlist open” + “Beles · Fico d'India” overlay
2. Rich-results test on `/asmara`, `/ritual` if desired
3. Submit test waitlist signup and confirm admin notify only when env is configured

---

## Files changed

- `asmara.html`
- `massawa.html`
- `ritual.html`
- `journal/fico-d-india.html`
- `index.html`
- `store.html`
- `script.js`
- `styles.css`
- `lib/waitlist-notify.js`
- `review-notes/chatgpt-live-review.md` (new)
- `review-notes/suggestion-triage.md` (new)
- `review-notes/implementation-plan.md` (new)
- `review-notes/final-report.md` (new)
