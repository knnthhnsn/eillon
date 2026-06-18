# Final Report — EILLON Review Loop 2026-06-18

## External ChatGPT review summary

**Status:** ChatGPT browser review unavailable in automation environment. One cycle completed via live site fetch + codebase audit.

### Strongest suggestions (accepted)
- Remove purchase-implying size selectors from future/lab chapter forms
- Fix JSON-LD so non-purchasable chapters use `OutOfStock`, not `PreOrder`
- Replace fake stockist language with honest Copenhagen studio positioning
- Add readable captions to boutique store cards

### Weakest suggestions (rejected)
- Generic Contact / Appointments pages — violates editorial maison rules
- Discovery set push — rejected per brand
- Full redesign — unnecessary; site architecture is sound

### Suggestions rejected and why
See `review-notes/suggestion-triage.md` rejected table.

---

## Implemented changes

### 1. `asmara.html`, `massawa.html`, `ritual.html` — remove size selectors
- **What:** Removed `<select name="size">` from future/lab waitlist forms.
- **Why:** Size choice implies purchasable product; copy says updates/notify/lab only.
- **Expected effect:** Clearer product status; less conversion confusion on unreleased chapters.

### 2. `asmara.html`, `massawa.html`, `ritual.html` — JSON-LD availability
- **What:** `PreOrder` → `OutOfStock` in Product schema offers.
- **Why:** Schema must not contradict visible “not for sale” copy.
- **Expected effect:** Honest structured data for search engines.

### 3. `index.html` — studio anchor and copy
- **What:** `#stockists` → `#studio`; “Find a Stockist” → “Copenhagen studio”; search item updated.
- **Why:** No stockists exist; studio appointments are by mailto request only.
- **Expected effect:** Brand honesty; no false retail distribution signal.

### 4. `journal/fico-d-india.html` — oil-rich consistency
- **What:** CTA “Oil-based parfum” → “Oil-rich parfum”.
- **Why:** Matches site-wide language and INCI reality.
- **Expected effect:** Consistent brand vocabulary.

### 5. `script.js`, `styles.css`, `store.html` — boutique card captions
- **What:** Added `buildStoreCardCaption()`; visible name + status overlay on store grid cards.
- **Why:** Boutique CSS hides card body; status was hard to read.
- **Expected effect:** Faster chapter scanning on `/store`.

### 6. `lib/waitlist-notify.js` — remove hardcoded email
- **What:** Removed personal Gmail fallback from `getNotifyRecipients()`.
- **Why:** Secrets/personal data must not be in codebase.
- **Expected effect:** Notify only when `WAITLIST_NOTIFY_EMAIL` or `ADMIN_NOTIFY_EMAIL` is set; signup unaffected.

### 7. `sitemap.xml` — lastmod refresh
- **What:** Updated `lastmod` to 2026-06-18.
- **Why:** Reflects content changes for crawlers.

---

## Rejected changes

| Item | Reason |
|------|--------|
| Contact page | Brand rule |
| Appointments booking form | Brand rule |
| Discovery/sample kit push | Brand rule |
| Beles schema PreOrder → OutOfStock | Beles waitlist is genuinely pre-release |
| Site redesign | Out of scope |

---

## Test results

### Routes tested (all HTTP 200)
`/`, `/store`, `/beles`, `/asmara`, `/massawa`, `/ritual`, `/journal`, `/journal/fico-d-india`, `/journal/the-bottle`, `/privacy`, `/terms`, `/imprint`

### Forms checked
| Page | `product_slug` | Size field | Status copy |
|------|----------------|------------|-------------|
| `/beles` | `beles` | Yes (correct) | Waitlist open |
| `/asmara` | `asmara` | Removed | In production / updates only |
| `/massawa` | `massawa` | Removed | Coming soon |
| `/ritual` | `ritual` | Removed | Lab study / not for sale |
| `/store` letter | `all` | N/A | Newsletter |

### Console / static checks
- `buildStoreCardCaption` present in `script.js?v=68`
- No `Preferred size` in asmara/ritual HTML
- No `stockist` / `Find a Stockist` in homepage HTML
- No hardcoded personal email in `waitlist-notify.js`
- `OutOfStock` in asmara/ritual JSON-LD

### Known issues
- Images not in git repo (served from deployment); local dev shows broken images but HTML/JS behavior is verifiable.
- `npm run dev` uses `python` which may fail on some systems; `python3 scripts/dev-server.py` works.

---

## Deployment notes

**Safe to deploy:** Yes — focused copy, schema, form, and JS/CSS changes only.

**Environment variables required for production:**
- `DATABASE_URL` — waitlist storage
- `RESEND_API_KEY` — notification emails
- `WAITLIST_NOTIFY_EMAIL` or `ADMIN_NOTIFY_EMAIL` — admin notify recipients (no code fallback)
- `WAITLIST_ADMIN_KEY` — admin panel

**Manual checks before/after deploy:**
1. Visit `/store` — confirm card captions show name + status on all four chapters
2. Visit `/asmara`, `/massawa`, `/ritual` — confirm no size dropdown
3. Homepage footer — “Copenhagen studio” link scrolls to `#studio`
4. Submit test waitlist signup on staging — confirm API still returns 200
5. Rich results test on Beles (PreOrder) vs Asmara (OutOfStock) if using Search Console
