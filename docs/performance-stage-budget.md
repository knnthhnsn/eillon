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

### Lighthouse CI

Starts the local dev server, audits `/` on mobile, enforces performance/LCP/CLS budgets via `scripts/check-lighthouse-budget.mjs`.

### Smoke funnel

Confirms Beles proof layer, waitlist, size interest, and restock CTA markers on `/beles`.

### Visual capture

```bash
npm run test:visual
```

Writes PNGs to `artifacts/screenshots/current/` (gitignored). Review diffs manually after cinematic or layout changes.

## File ownership

| Concern | Primary files |
|---|---|
| Hero LCP | `index.html`, `home.css` |
| Pin performance | `scripts/home.js`, `home.css` |
| Shader defer | `script.js`, chapter shader bands |
| Analytics vitals | `scripts/analytics.js` |
| Scene rail a11y | `scripts/scene-rail.js`, `home.css` |
