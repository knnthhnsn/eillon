# Beles Dispatch → Restock Micro-Funnel Dashboard

Machine-readable funnel definition: [`data/funnels/dispatch-to-restock.json`](../data/funnels/dispatch-to-restock.json)

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

### PostHog bridge (optional, off by default)

Enable only when PostHog is already loaded on the page:

```html
<script>
  window.EILLON_ANALYTICS_CONFIG = { posthogBridge: true };
</script>
```

**Requirements:**
- `window.posthog` must be loaded **before** bridge events matter (bridge forwards on each `track()` call).
- Bridge is **disabled by default** in `scripts/analytics.js` (`posthogBridge: false`).

**Privacy:**
- PII fields (`email`, `name`, `phone`, etc.) are stripped in `sanitizeBridgeProps` before `posthog.capture`.
- Only events in `POSTHOG_BRIDGE_EVENTS` whitelist are forwarded.

**Verification:**

```bash
npm run verify:posthog-bridge
```

### Vercel Analytics

Events flow through `window.va('event', payload)` via `scripts/analytics.js`. Mirror the same taxonomy before relying on PostHog funnels, or export VA data into your dashboard tool.

See also [`docs/deployment-truth.md`](deployment-truth.md) for post-deploy verification.

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
