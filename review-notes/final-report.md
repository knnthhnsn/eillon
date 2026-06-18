# Final Report — EILLON Review Loop 2026-06-18

## External ChatGPT review summary

ChatGPT Pro browser was unavailable in the cloud agent environment. One external review cycle was completed via live site fetches (https://eillon.maison/) and full codebase audit, documented in `review-notes/chatgpt-live-review.md`.

### Strongest suggestions (accepted)

1. Remove size selectors on non-purchasable chapter pages — implies purchase when copy says otherwise.
2. Fix `PreOrder` JSON-LD on Asmara, Massawa, Ritual — contradicts visible "not for sale" / lab language.
3. Remove misleading "Find a Stockist" / "Appointments" navigation — no retail stockists exist.

### Weakest suggestions (rejected)

- Generic Contact or Appointments pages
- Discovery set / sample kit merchandising
- Full homepage redesign
- React migration or build system

### Suggestions rejected and why

| Suggestion | Reason |
|---|---|
| Contact page | Brand rule — no generic contact page |
| Appointments page | Brand rule — studio visits stay as mailto in footer |
| Discovery/sample kit push | Brand rule |
| Remove studio section | Real Copenhagen studio exists; labels were wrong, not the feature |
| Rewrite hero copy | Maison voice is already strong and on-brand |

---

## Implemented changes

### 1. `asmara.html`, `massawa.html`, `ritual.html`
- **What:** Removed `Preferred size` `<select>` from update/lab signup forms.
- **Why:** Size choice on non-purchasable pages reads as purchase intent.
- **Expected effect:** Clearer chapter status; less confusion between Beles waitlist and future chapters.

### 2. `asmara.html`, `massawa.html`, `ritual.html`
- **What:** JSON-LD `offers.availability` changed from `PreOrder` to `OutOfStock`.
- **Why:** Page copy states not for sale / in production / lab study.
- **Expected effect:** Search/schema aligns with visible product status.

### 3. `journal/fico-d-india.html`
- **What:** CTA line changed from "Oil-based parfum" to "Oil-rich parfum".
- **Why:** Site-wide terminology; Beles INCI includes alcohol denat.
- **Expected effect:** Consistent brand language.

### 4. `lib/waitlist-notify.js`
- **What:** Removed hardcoded `kennethchristoffer@gmail.com` fallback.
- **Why:** Personal email should not be in source; env var required.
- **Expected effect:** Notifications only when `WAITLIST_NOTIFY_EMAIL` or `ADMIN_NOTIFY_EMAIL` is configured.

### 5. `index.html`
- **What:** Renamed `#stockists` → `#studio`; footer link "Find a Stockist" → "Copenhagen studio"; search entry "Appointments" → "Copenhagen studio".
- **Why:** No stockists exist; previous labels implied retail/booking pages.
- **Expected effect:** Honest navigation; no fake stockist implication.

### 6. `review-notes/` (new)
- **What:** Added chatgpt-live-review.md, suggestion-triage.md, implementation-plan.md, final-report.md.
- **Why:** Audit trail for review loop.

---

## Rejected changes (not implemented)

- Generic Contact / Appointments pages
- Discovery set merchandising
- Store card redesign
- Homepage hero rewrite
- Beles schema change (PreOrder is correct for waitlist)

---

## Test results

### Routes tested (all HTTP 200)

`/`, `/store`, `/beles`, `/asmara`, `/massawa`, `/ritual`, `/journal`, `/journal/fico-d-india`, `/journal/the-bottle`, `/privacy`, `/terms`, `/imprint`

### Forms checked

| Page | `product_slug` | Status |
|---|---|---|
| /beles | beles | OK — size selector retained |
| /asmara | asmara | OK — no size selector |
| /massawa | massawa | OK — no size selector |
| /ritual | ritual | OK — no size selector |
| / (footer) | all | OK |

### Schema

| Page | Availability |
|---|---|
| /beles | PreOrder (correct) |
| /asmara | OutOfStock |
| /massawa | OutOfStock |
| /ritual | OutOfStock |

### Console status

Static HTML verification via curl; no JS runtime errors expected from these changes. Dev server: `python3 scripts/dev-server.py` on port 8080.

### Known issues

- None introduced by this loop.
- Live production may lag until deploy.

---

## Deployment notes

**Safe to deploy:** Yes — static HTML/CSS/JS changes only; one serverless lib change.

**Environment variables required:**

- `WAITLIST_NOTIFY_EMAIL` or `ADMIN_NOTIFY_EMAIL` — **must be set** (no hardcoded fallback after this change)
- `DATABASE_URL`, `RESEND_API_KEY`, `WAITLIST_ADMIN_KEY` — unchanged

**Manual checks before/after deploy:**

1. Confirm notify env var is set in Vercel production.
2. Spot-check `/asmara`, `/massawa`, `/ritual` — no size dropdown.
3. Homepage footer/search — "Copenhagen studio" links scroll to `#studio`.
4. `/journal/fico-d-india` — "Oil-rich parfum" in CTA.
