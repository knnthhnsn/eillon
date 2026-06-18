# Final Report — EILLON Review Loop 2026-06-18

## External ChatGPT review summary

**Method:** ChatGPT browser was unavailable in the cloud agent environment. One external review cycle was completed via live site fetch + codebase audit using the specified prompt.

### Strongest suggestions (accepted)

1. Remove purchase-implying size selectors from future/lab chapter forms
2. Fix incorrect `PreOrder` JSON-LD on non-sale chapters
3. Replace “stockist” language with honest Copenhagen studio copy
4. Add visible name/status on boutique store cards (Beles was image-only)
5. Remove hardcoded personal email from waitlist notifications

### Weakest suggestions (rejected)

- Generic Contact/Appointments page
- Discovery set / sample kit push
- Fake stockists, press, or reviews
- Framework migration

### Rejected and why

| Suggestion | Reason |
|------------|--------|
| Contact page | Brand rule — editorial maison, not service desk |
| Stockist locator | No retail partners; would be misleading |
| Homepage product rewrite | Maison architecture is correct |
| React / build system | Explicitly forbidden |

---

## Implemented changes

### 1. `asmara.html`, `massawa.html`, `ritual.html`
- **What:** Removed `Preferred size` `<select>` from update/lab forms
- **Why:** Size choice implied purchasability on non-sale chapters
- **Effect:** Forms read as studio updates only

### 2. `asmara.html`, `massawa.html`, `ritual.html`
- **What:** JSON-LD `availability` changed from `PreOrder` to `OutOfStock`
- **Why:** Chapters are not offered for sale
- **Effect:** Honest structured data for search

### 3. `index.html`
- **What:** Search + footer copy: “Copenhagen studio” instead of “Find a Stockist”
- **Why:** No stockists exist; studio appointments are the real offer
- **Effect:** No fake retail signal

### 4. `journal/fico-d-india.html`
- **What:** “Oil-based parfum” → “Oil-rich parfum”
- **Why:** Site-wide vocabulary consistency
- **Effect:** Aligned with Beles product language

### 5. `lib/waitlist-notify.js`
- **What:** Removed hardcoded personal email fallback
- **Why:** Privacy/security; env vars should be required
- **Effect:** Notifications only when `WAITLIST_NOTIFY_EMAIL` or `ADMIN_NOTIFY_EMAIL` is set; signups still succeed

### 6. `script.js`, `styles.css`
- **What:** Boutique store grid cards now show status + chapter name caption
- **Why:** Beles waitlist card had no visible title/status in store mode
- **Effect:** Clearer boutique navigation and conversion path

### 7. Multiple HTML files
- **What:** Cache-bust versions synced to `styles.css?v=105`, `script.js?v=66`, `products.js?v=7`
- **Why:** Store and journal pages were on stale asset versions
- **Effect:** Consistent post-deploy styling/behavior

---

## Rejected changes (no implementation)

| Item | Reason |
|------|--------|
| Dedicated contact page | Brand rule |
| Discovery sample kit CTA expansion | Brand rule |
| Beles schema change | Waitlist is legitimate preorder-intent |
| Ritual page rename | “Wear” section vs “Ritual” chapter are distinct enough |

---

## Test results

### Routes tested (all HTTP 200)

`/`, `/store`, `/beles`, `/asmara`, `/massawa`, `/ritual`, `/journal`, `/journal/fico-d-india`, `/journal/the-bottle`, `/privacy`, `/terms`, `/imprint`

### Forms checked

| Page | `data-product-slug` | Size field |
|------|---------------------|------------|
| `/beles` | `beles` | Size buttons (correct) |
| `/asmara` | `asmara` | Removed |
| `/massawa` | `massawa` | Removed |
| `/ritual` | `ritual` | Removed |

### Content verification

- Asmara: 0 “Preferred size” matches
- Ritual schema: `OutOfStock`
- Homepage: no “Find a Stockist” text
- Journal: “Oil-rich parfum”
- Hardcoded personal email: removed from codebase

### Console status

Static HTML/JS served locally; no automated browser console run. Manual spot-check recommended for store card captions and search overlay.

### Known issues

- `id="stockists"` anchor retained on homepage studio block (ID only; visible copy updated)
- Waitlist API requires `DATABASE_URL` in production — not testable locally without env

---

## Deployment notes

**Safe to deploy:** Yes — focused, low-risk edits.

**Environment variables required:**

- `DATABASE_URL` — waitlist storage
- `RESEND_API_KEY` — email notifications
- `WAITLIST_NOTIFY_EMAIL` or `ADMIN_NOTIFY_EMAIL` — **now required** for admin notifications (no fallback)
- `WAITLIST_ADMIN_KEY` — admin dashboard

**Manual checks before/after deploy:**

1. Open `/store` — confirm each card shows name + status caption
2. Submit test signup on `/asmara` — confirm no size field in form
3. Verify `WAITLIST_NOTIFY_EMAIL` is set in Vercel production env
4. Rich Results Test on `/ritual` — confirm `OutOfStock`
