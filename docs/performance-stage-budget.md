# EILLON Performance Stage Budget

**Cinematic Commerce System v1** — the homepage is allowed to be spectacular. These budgets protect load, interaction, and scroll quality without stripping motion, shaders, or pinned sequences.

## Principles

- **Spectacle is intentional.** Marquee, WebGL shaders, GSAP pins, and the letter archive stay.
- **Orchestration over austerity.** Defer decorative work; never block LCP or first interaction.
- **Measure honestly.** Custom `interaction_event_duration` in analytics is *not* official INP — use Lighthouse CI and Vercel Speed Insights for production vitals.

## Budgets

| Metric | Target | Guardrail |
|---|---|---|
| **LCP** | ≤ 4.5s mobile (CI) | Hero image `fetchpriority="high"`, no shader before LCP |
| **CLS** | ≤ 0.1 | Reserve space for pinned sections; font `display=optional` |
| **INP** (official) | Monitor via Vercel Speed Insights | Do not confuse with custom interaction proxy |
| **Long tasks** | No task > 200ms during initial load | Lazy-load letters bundle; defer products.js |
| **Decorative shaders** | After LCP + idle | Existing idle/defer pattern in home scripts |
| **GSAP ScrollTrigger** | After layout ready | Init in `home.js` post-DOM; refresh on font load |
| **Letters bundle** | Lazy near `#letters` | CSS/JS loaded on approach (see `home.js`) |
| **Mobile scroll** | Smooth pin handoff | No `normalizeScroll`; chain land after house pin |

## What must not regress

- Hero image remains preloaded / high priority
- `letters.min.css` + `letters.js` stay lazy-loaded
- Shader bands idle until visible
- Scene rail must not cover hero CTAs or pinned copy (edge-mounted, pointer-events scoped)
- Playwright screenshots document visual intent — manual review until diff baseline exists

## How to test

```bash
npm run build
npm run verify:all
npm run smoke:funnel
npm run lighthouse:ci
npm run test:visual
```

After deploy, compare live against repo lifecycle + archive expectations (not part of default CI):

```bash
VERIFY_PRODUCTION=true npm run verify:production
EXPECT_COMMIT_SHA=<sha> VERIFY_PRODUCTION=true npm run verify:production
```

See [`docs/deployment-truth.md`](deployment-truth.md).

### Lighthouse CI

Starts the local dev server, audits `/` on mobile, enforces performance/LCP/CLS budgets via `scripts/check-lighthouse-budget.mjs`.

### Smoke funnel

Confirms Beles proof layer, waitlist, size interest, and restock CTA markers on `/beles`.

### Visual capture

```bash
npm run test:visual
```

Writes PNGs to `artifacts/screenshots/current/` (gitignored). Review diffs manually after cinematic or layout changes.

**Browser requirement:** Playwright uses `playwright-core` with your local Chrome/Chromium binary.

- Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to a full path to `chrome` or `chromium` (recommended in CI).
- Or set `CHROME_PATH` as a fallback if the primary env var is unset.
- If neither is set, the script tries Playwright’s `channel: 'chrome'` (Google Chrome installed on the machine).

If no browser is found, the script exits with: *Install Chrome or set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH.*

Do not require `test:visual` in CI unless the runner has Chrome available.

## Scene Rail + Letters budget

| Concern | Budget |
|---|---|
| **Scene Rail LCP** | Rail init via `requestIdleCallback` — must not block LCP or hero paint |
| **Letter open CLS** | Action row reserved with `min-height`; actions fade in with ink stage — no layout shift on open |
| **Letter open long tasks** | Opening animation stages should stay under 200ms per task; defer action binding until ink stage |
| **Reduced motion** | Letters skip staged motion; actions render immediately when `prefers-reduced-motion` |
| **Letters bundle** | `data/letters.js` + `letters.js` remain lazy-loaded near `#letters` via `home.js` |

Scene rail nav clicks fire once via delegated `data-analytics-event` (with `source: scene_rail`). Letter archive actions track `letter_action_clicked` and `archive_to_beles_click` without PII.

Visual capture includes `homepage-letters-beles-dispatch-open.png` when the Beles Dispatch letter is present.

## Cinematic LCP Recovery v1

The goal is **not austerity**. The homepage stays cinematic — hero, marquee, Scene Rail, shaders, pins, and Letters archive remain.

| Target | Value |
|---|---|
| CI LCP | ≤ 4500ms (immediate gate) |
| Stretch CI LCP | ≤ 3500ms via `LH_LCP_MAX_MS=3500` |
| Field p75 LCP | ≤ 2500ms long-term |

### Protect

- One high-priority LCP asset — hero `picture` with `fetchpriority="high"` and responsive `srcset`
- Critical hero CSS inline; `home.min.css` deferred after first paint
- GSAP / ScrollTrigger / `home.js` pins load via `load-after-hero.js` after hero decode (`eillon:hero-ready`)
- Decorative shaders remain idle until visible
- Cormorant loads with `display=optional` after idle — hero word uses Georgia first to avoid font-blocked LCP
- Visual parity screenshots (`npm run test:visual`, `npm run test:production-visual`)
- `prefers-reduced-motion` unchanged

### Analyze

```bash
npm run lighthouse:ci
npm run perf:analyze
```

Writes `artifacts/performance/lcp-analysis.json` and `.md`.

### Hero variants

```bash
npm run optimize:hero
```

Generates responsive WebP/AVIF/JPEG under `images/cowboy-cowgirl-{width}.*` and `artifacts/performance/hero-image-report.md`.

## File ownership

| Concern | Primary files |
|---|---|
| Hero LCP | `index.html`, `home.css` |
| Pin performance | `scripts/home.js`, `home.css` |
| Shader defer | `script.js`, chapter shader bands |
| Analytics vitals | `scripts/analytics.js` |
| Scene rail a11y | `scripts/scene-rail.js`, `home.css` |
