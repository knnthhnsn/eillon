# Implementation Plan — EILLON Review Loop 2026-06-18

## Accepted changes

| # | Change | Files | Risk |
|---|--------|-------|------|
| 1 | Chapter schema `OutOfStock` | `asmara.html`, `massawa.html`, `ritual.html` | Low |
| 2 | Remove size `<select>` on non-purchasable forms | `asmara.html`, `massawa.html`, `ritual.html` | Low |
| 3 | Remove hardcoded notify email | `lib/waitlist-notify.js` | Low |
| 4 | Footer "Find a Stockist" → "Copenhagen studio" | `index.html` | Low |
| 5 | Search overlay studio copy | `index.html` | Low |
| 6 | Cache bust CSS v=105, JS v=66 | All HTML pages with asset refs | Low |
| 7 | Sitemap lastmod | `sitemap.xml` | Low |

## Rejected changes

See `suggestion-triage.md` — Contact page, sample kit push, fake stockists, full redesign, React migration.

## Why each edit matters

1. **Schema** — Prevents Google Shopping/rich results from misrepresenting unreleased chapters.
2. **Form sizes** — Stops implying bottles are orderable before release.
3. **Email fallback** — Protects personal data; production must use `WAITLIST_NOTIFY_EMAIL`.
4. **Stockist label** — Brand integrity; no false retail network.
5. **Search copy** — Consistent with editorial maison positioning.
6. **Cache bust** — Store and journal pages get current product grid and nav behavior.

## Test steps

1. `python3 scripts/dev-server.py` on port 8080
2. Curl each route — 200 OK
3. Grep forms for `product_slug` values
4. Grep schema for `PreOrder` on chapter pages (should be none except beles)
5. Verify no hardcoded personal email in notify lib
6. Check console-free page loads via curl HTML inspection
