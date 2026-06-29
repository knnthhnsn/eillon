# Main Branch Digest — 2026-06-29

**Automation:** `main_branch_digest` (cron `*/30 * * * *`)  
**Window:** last 7 days (`git log --since="7 days ago" origin/main`)  
**HEAD:** `c714cf6`  
**Commits:** 74  
**New since prior digest (14:00 UTC):** 0 — same HEAD; baseline drift fix applied this run.

## Summary

Main shipped substantial homepage motion/perf work, the full growth OS scaffold, three SEO experiments (EXP-003/004/005), and first L2b auto-merge. Beles restock trust microcopy is live. Sitemap now 19 public URLs including prickly-pear discovery and smell-intent journal article.

## By category

### Growth (10 commits)

| Commit | Change |
|---|---|
| `32a9790` | Growth OS scaffold, `/prickly-pear-parfum` discovery landing (EXP-003), favicon |
| `a6c33f0` | AI hard review protocol + automation registry sync |
| `2d91bbe` | Save-order docs for remaining growth automations |
| `f693e9c` | MCP setup, conditional auto-merge policy wiring |
| `f5679c9` | Growth OS completion: Reddit login, auto-merge, Agent-Reach sync |
| `9a40e0a` | EXP-004 — journal article “What does Fico d'India smell like?” |
| `790ad6f` | EXP-005 — Beles restock form trust microcopy (PR #44) |
| `9c91e6f` | EXP-005 auto-merge ledger entry (`pr_growth_auto_merge`) |
| `b3619e2` | Phase 4 demand sprint CI + lifecycle copy sweep |
| `d3943a4` | Sitemap refresh (part of SEO cluster) |

**Shipped EXP IDs on main:** EXP-001, EXP-002, EXP-003, EXP-004, EXP-005, EXP-031 — all `done` in backlog.

**Next eligible:** EXP-008 (journal → Beles internal links).

### Performance (45 commits)

Major homepage GSAP ScrollTrigger pin chain (hero → house → maison), WebGL editorial shaders site-wide, Lighthouse optimizations (critical CSS, lazy letters bundle, CSS marquee), mobile iOS pin stabilization (`normalizeScroll`, ordered init, sticky stage), and jsDelivr CDN hotfix for scroll-pin script when Vercel deploy quota blocks prod.

Key commits: `5547413`, `0ab1ab9`, `0e92d94`, `4c04c10`, `a5d83e3`, `de93013`, `94b69cc`, `c714cf6`, shader series (`ee372e6`–`3b28f7f`), `d1cd430` WebP picture elements.

### Content (14 commits)

- EXP-003 `/prickly-pear-parfum` — high-intent discovery landing with FAQ schema
- EXP-004 `/journal/what-does-fico-d-india-smell-like` — smell-intent article
- House of Memory headline/layout iterations, leopard background, wear imagery refresh
- Phase 3–4 proof layer, lifecycle labels, legal/trust fixes (`b17f343`)
- Beles accord profile image optimization (`291538f`)

### Infra (4 commits)

- Phase 2: analytics funnel, API rate limits, CI pipeline, security headers (`baae843`)
- Phase 3: auto-generated sitemap, consent recording (`6e04d95`)
- Vercel build fix — skip Python wax-seal in CI (`ea60689`)
- Phase 4 demand sprint CI (`b3619e2`)

## Architecture / baseline drift

| Area | Baseline (2026-06-28) | Main now | Action |
|---|---|---|---|
| Sitemap URLs | 17 | 19 | Updated `baseline.md` |
| Routes | Missing discovery + smell-intent | `/prickly-pear-parfum`, `/journal/what-does-fico-d-india-smell-like` | Updated `baseline.md` |
| Beles conversion | Form only | Trust microcopy block above submit | Updated `baseline.md` |
| SEO gap | No prickly-pear landing | Shipped EXP-003 | Gap partially closed in baseline |
| Analytics events | Unchanged | No new distinct newsletter events | No change |
| API routes | Unchanged | `/api/waitlist` only | No change |

## Durable learnings (→ `memory.md`)

1. **L2b auto-merge works** — EXP-005 merged via PR #44 with AI hard review pass_with_notes, 0 blocks, CI green.
2. **GSAP pins on mobile** — eager script load, ordered pin init, house→maison chain, `normalizeScroll` for iOS; defer letters bundle for Lighthouse.
3. **Vercel deploy quota** — jsDelivr CDN for scroll-pin script is valid interim hotfix until deploy succeeds.
4. **Growth OS operational** — 10 automations registered 2026-06-29; monitor Beles `restock_form_started→submitted` 14d post EXP-005.

## Backlog adjustments

No status changes required — EXP-001/002/003/004/005/031 already marked `done`.

## Follow-ups

- Monitor GSC for prickly-pear and smell-intent clusters (14–28d)
- Run EXP-008 (internal linking) as next highest-priority eligible experiment
- Confirm prod deploy when Vercel quota resets (jsDelivr hotfix temporary)
- Save `pr_growth_auto_merge` automation if still awaiting save in Cursor UI

---
*Digest complete. Lock: N/A (read-only).*
