# Final Report — EILLON Review Loop 2026-06-17

## External ChatGPT review summary

**Method:** ChatGPT Pro browser was unavailable in the cloud automation environment. Review substituted with live fetch of https://eillon.maison/ plus full local codebase audit. One cycle only — no repeat.

### Strongest suggestions (accepted)

1. Fix incorrect `PreOrder` schema on Asmara, Massawa, and Ritual — pages explicitly state not purchasable; Ritual is lab-only.
2. Remove hardcoded personal Gmail from waitlist notification fallback — security/privacy risk.
3. Align journal "oil-based" → "oil-rich" — brand vocabulary consistency.

### Weakest suggestions (rejected)

1. Add Contact/Appointments page — violates EILLON editorial maison direction.
2. Push discovery sample kit as product — brand rule rejection.
3. Remove homepage palette scent-world cards — editorial maison content, not product pyramids.

### Suggestions rejected and why

| Suggestion | Reason |
|------------|--------|
| Generic contact/appointments page | Brand rule |
| Discovery/sample kit marketing push | Brand rule |
| Fake reviews / press | Brand rule |
| React / build system | Brand rule |
| Make Ritual purchasable | Brand rule — lab study |
| Remove all Beles from homepage | Beles as first chapter is intentional |

---

## Implemented changes

### 1. `asmara.html`, `massawa.html`, `ritual.html`
- **What:** JSON-LD `offers.availability` changed from `PreOrder` to `OutOfStock`; added descriptive text matching page copy.
- **Why:** Schema contradicted visible status ("not yet available to purchase"; Ritual "not for sale").
- **Expected effect:** Search/rich results align with chapter release states.

### 2. `journal/fico-d-india.html`
- **What:** CTA copy "Oil-based parfum" → "Oil-rich parfum".
- **Why:** Site-wide brand term is oil-rich.
- **Expected effect:** Consistent language across journal and product pages.

### 3. `lib/waitlist-notify.js`
- **What:** Removed hardcoded `kennethchristoffer@gmail.com` fallback; notifications require `WAITLIST_NOTIFY_EMAIL` or `ADMIN_NOTIFY_EMAIL` env.
- **Why:** No personal emails in source; prod uses env vars.
- **Expected effect:** Signups still succeed; notify skipped when unconfigured (existing behavior for missing API key).

### 4. `privacy.html`
- **What:** Meta description no longer mentions "appointment data"; now "waitlist, newsletter, and studio contact."
- **Why:** No appointment form on site; accurate SEO snippet.
- **Expected effect:** Clearer search result for privacy page.

### 5. CSS cache-bust sync (`journal.html`, `journal/*.html`, `privacy.html`, `terms.html`, `imprint.html`, `store.html`)
- **What:** Bumped `styles.css?v=70|95` → `v=105`.
- **Why:** Legal/journal pages could serve stale CSS after main site updates.
- **Expected effect:** Consistent styling post-deploy.

### 6. Review documentation
- **What:** Added `review-notes/chatgpt-live-review.md`, `suggestion-triage.md`, `implementation-plan.md`, this report.
- **Why:** Audit trail for the controlled improvement loop.

---

## Rejected changes (not implemented)

- Contact/appointments page
- Discovery sample kit push
- Homepage palette removal
- Framework migration
- Ritual commercialization
- FAQ schema on all chapter pages (marginal gain)

---

## Test results

### Routes tested (all HTTP 200)

`/`, `/store`, `/beles`, `/asmara`, `/massawa`, `/ritual`, `/journal`, `/journal/fico-d-india`, `/journal/the-bottle`, `/privacy`, `/terms`, `/imprint`

### Forms checked

| Page | `data-product-slug` | Status |
|------|---------------------|--------|
| `/beles` | `beles` | OK |
| `/asmara` | `asmara` | OK |
| `/massawa` | `massawa` | OK |
| `/ritual` | `ritual` | OK |
| `/store` letter | `all` | OK |

### Schema

- Beles: `PreOrder` (correct — waitlist open)
- Asmara, Massawa, Ritual: `OutOfStock` (correct)

### Copy / security

- No `oil-based` in HTML
- No hardcoded Gmail in `lib/` or `api/`

### Console / assets

- Local server: `python3 scripts/dev-server.py` on port 8080
- Note: `npm run dev` fails if `python` not on PATH — use `python3 scripts/dev-server.py`
- Image assets referenced in chapter pages verified present (`scent-asmara.jpg`, `scent-massawa.jpg`, `ritual.jpg`)
- Store product grid container present; cards rendered by `script.js` + `data/products.js`

### Known issues

- None blocking deploy from this review loop.
- Waitlist admin and API require Neon/Resend env vars in production (pre-existing).

---

## Deployment notes

**Safe to deploy:** Yes — small, focused changes; no breaking routes or form behavior changes.

**Environment variables needed (production):**

- `DATABASE_URL` — waitlist storage
- `RESEND_API_KEY` — notification emails (optional; signup succeeds without)
- `WAITLIST_NOTIFY_EMAIL` or `ADMIN_NOTIFY_EMAIL` — notify recipients (required for admin alerts after this change)
- `WAITLIST_ADMIN_KEY` — admin dashboard

**Manual checks before/after deploy:**

1. Confirm chapter pages show correct status in browser (Asmara in production, Massawa coming soon, Ritual lab).
2. Submit test waitlist on `/beles` in staging if available.
3. Verify Google Rich Results / schema for chapter pages after cache clears.
4. Spot-check journal and legal pages for CSS after deploy (v=105).

---

## Branch

`review-loop-eillon-2026-06-17`
