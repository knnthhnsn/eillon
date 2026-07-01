# Beles Dispatch → Restock Micro-Funnel Dashboard

Intended measurement path from homepage archive to Beles restock interest. Use this taxonomy in PostHog, Vercel Analytics exports, or any BI layer — event names must match exactly.

## Funnel steps

| Step | Event | Key properties |
|------|-------|----------------|
| 1 | `page_view` or `$pageview` | `page: /` |
| 2 | `scene_viewed` | `scene: letters`, `page: /` |
| 3 | `letter_archive_viewed` | `scene: letters` |
| 4 | `letter_opened` | `letter_id: beles-dispatch`, `scene: letters` |
| 5 | `letter_action_clicked` | `letter_id`, `action_kind` (`proof` \| `chapter` \| `restock`), `action_label`, `href`, `source: letter_archive` |
| 6 | `archive_to_beles_click` | `letter_id`, `action_kind`, `href`, `source: letter_archive` |
| 7 | `restock_anchor_reached` | `chapter: beles`, `source: letter_archive` |
| 8 | `restock_form_started` | `chapter: beles`, size if selected |
| 9 | `restock_form_submitted` | `chapter: beles`, size if selected |

## Recommended breakdowns

- **Device** — `device` (`mobile` \| `tablet` \| `desktop`)
- **Referrer** — `referrer` (hostname)
- **UTM** — `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- **Action kind** — `action_kind` on step 5–6
- **Selected size** — from `size_interest_selected` and restock form events
- **Route** — `page`, `chapter`, `href`

## Collector notes

- **PostHog:** Custom events (`letter_action_clicked`, `archive_to_beles_click`, etc.) must be explicitly captured into PostHog — they are not automatic from Vercel Analytics.
- **Vercel Analytics:** Events flow through `window.va('event', payload)` via `scripts/analytics.js`. Mirror the same taxonomy before relying on PostHog funnels, or export VA data into your dashboard tool.

## Local verification

```bash
npm run test:dispatch-funnel
```

Simulates steps 4–7 on localhost and asserts analytics event order via console debug output.

## Production verification

```bash
VERIFY_PRODUCTION=true npm run verify:production
```

Compares live HTML, chapter lifecycle copy, and `build-manifest.json` against repo expectations. Report: `artifacts/parity/latest.json`.
