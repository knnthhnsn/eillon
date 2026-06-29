# Main Branch Digest — 2026-06-29

**Automation:** `main_branch_digest`  
**Window:** 2026-06-22 → 2026-06-29 (7 days)  
**Branch:** `main` @ `32a9790`  
**Commits:** 61

## Summary

Heavy week: growth OS landed, prickly-pear discovery page shipped, homepage motion/perf iterated, Phase 2–4 infra (analytics, CI, sitemap gen), and editorial/visual upgrades (WebGL shaders, Beautiful Letters, wear imagery).

## Shipped by category

### Growth (4 commits / 1 mega-commit)

| Commit | Date | Summary | EXP |
|---|---|---|---|
| `32a9790` | 2026-06-29 | Full `/growth/` OS, Cursor rules, automation prompts/registry, DESIGN.md, prickly-pear landing, favicon, campaign scaffold | EXP-001, EXP-002, EXP-003, EXP-031 |

**Growth OS highlights:**
- Baseline, backlog, results ledger, QA gates, scorecard, autonomy policy (L2b auto-merge)
- 10 automations verified active in Cursor UI; `pr_growth_auto_merge` awaiting save
- `/prickly-pear-parfum` discovery landing with FAQ schema + journal internal links (EXP-003)

### Performance (6 commits)

| Commit | Date | Summary |
|---|---|---|
| `5547413` | 2026-06-28 | Critical CSS, lazy bundles, CSS marquee for Lighthouse |
| `a6b3dea` | 2026-06-28 | Remove page loaders — content visible immediately |
| `0ab1ab9` | 2026-06-28 | Fix mobile carousel/pin jitter; defer letters bundle |
| `ea60689` | 2026-06-28 | Skip Python wax-seal step in CI (Vercel build fix) |
| `d1cd430` | 2026-06-24 | Display-sized WebP + `<picture>` for editorial images |
| `19aa0eb` | 2026-06-27 | GSC coverage, mobile editorial UX, Lighthouse |

**Perf pattern:** Lazy-load non-critical assets; keep GSAP eager for pin stability; split build steps that require Python from CI.

### Content (45+ commits)

| Theme | Commits | Summary |
|---|---|---|
| Homepage motion | `ee372e6`…`c7ddcfd` (6/27–28) | WebGL section shaders, GSAP scroll pins, name marquee/orbit, House of Memory leopard backdrop |
| Beautiful Letters | `13c83de` | Sky archive backdrop + branded wax seals |
| Wear imagery | `ce1a452` | Close-skin shots replace prior wear photos |
| Trust/legal | `b17f343` | Chapter lifecycle labels, Asmara geography, shipping schema, privacy, imprint |
| Proof/education | `6e04d95`, `291538f` | Proof layer, batch BL-001 journal, CVR 43933485, Beles accord images |
| Editorial refresh | `6fb50cf`, `4141493` | Inner page styles, journal water tones, footer/logo fixes |
| Demand sprint | `b3619e2` | Phase 4 CI, lifecycle copy sweep, Ballpark study kit |

### Infra (4 commits)

| Commit | Date | Summary |
|---|---|---|
| `baae843` | 2026-06-25 | Phase 2: `scripts/analytics.js`, API rate limits, CI workflow, security headers |
| `6e04d95` | 2026-06-25 | Phase 3: consent recording, auto-generated sitemap, proof sections, DB helpers |
| `b3619e2` | 2026-06-25 | Phase 4 demand sprint CI + lifecycle copy verification |
| `d3943a4` | 2026-06-28 | Sitemap refresh after homepage changes |

## Architecture changes (baseline impact)

| Change | Action |
|---|---|
| New route `/prickly-pear-parfum` | **Updated** `growth/baseline.md` |
| Sitemap 17 → 18 URLs | **Updated** baseline SEO table |
| `scripts/analytics.js` funnel events | Already documented in baseline (Phase 2 shipped earlier in window) |
| `/content/campaigns/` scaffold | Noted in baseline social section |
| Growth OS under `/growth/` | Documented in baseline QA section (growth:qa) |

No API route changes in the final 7-day window beyond rate-limit/consent helpers already in baseline scope.

## Backlog adjustments

| EXP | Prior | After | Evidence |
|---|---|---|---|
| EXP-001 | done | done | Baseline + OS in `32a9790` |
| EXP-002 | done | done | Rules + prompts in `32a9790` |
| EXP-003 | done | done | `prickly-pear-parfum.html` in `32a9790` |
| EXP-031 | done | done | Registry verified 2026-06-29 |

No other backlog EXP IDs shipped this window. **Next:** EXP-004 (Fico d'India smell article).

## Durable learnings → memory.md

- Growth OS operational; 10/11 automations active
- Prickly-pear landing closes top SEO gap; monitor GSC 14–28d
- GSAP must load before pin init; lazy GSAP caused mobile jitter (fixed)
- CI must not depend on Python numpy for Vercel builds
- Homepage shaders + pins are high-churn — batch QA after motion changes

## Next focus

1. EXP-004 — journal smell article (highest backlog priority)
2. EXP-005 — restock form trust microcopy
3. Save `pr_growth_auto_merge` in Automations UI
4. Monitor prickly-pear landing in GSC after index

---
*Digest complete. Baseline drift fixed. Lock unchanged.*
