# EILLON Growth Program

**Version:** 1.0 · 2026-06-28  
**This file is the `program.md` for EILLON autoresearch-style growth.**

## Mission

Continuously improve **qualified traffic** and **conversion readiness** for eillon.maison through small, measured experiments — without diluting the maison.

## North star

**`qualified_growth_score`** — see `/growth/scorecard.md`

## What we optimize

The "model" is the combined system:
- Website pages and conversion paths
- Content / journal / SEO architecture
- Brand voice and DESIGN.md
- Social campaign kits
- Analytics instrumentation
- Cursor automation layer

## Master loop (every experiment)

1. **Read context:** `AGENTS.md`, `DESIGN.md`, `/growth/autonomy-policy.md`, `/growth/state.json`, `/growth/baseline.md`, `/growth/memory.md`, `/growth/insights.md`, `/growth/backlog.md`, `/growth/results.tsv`, `/growth/scorecard.md`, `/growth/qa-gates.md`
2. **Check lock** — exit if locked or ≥3 open growth PRs
3. **Choose one experiment** — highest priority eligible item
4. **Hypothesis:** "If we [change], then [segment] will [action], because [evidence]."
5. **Set loop_type** — see list below
6. **Smallest useful diff** — one branch, one PR max
7. **Run QA** — `/growth/qa-gates.md`
8. **Score** — append `/growth/results.tsv`
9. **Run log** — `/growth/runs/YYYY-MM-DD-<automation>-<experiment>.md`
10. **Update** memory/insights/backlog if durable learning
11. **Decision:** keep · rework · discard · pending_review · blocked
12. **Stop** — no unbounded loops

### loop_type values
`demand_research` · `seo_content` · `landing_page` · `conversion_copy` · `social_distribution` · `video_asset` · `local_discovery` · `analytics_measurement` · `brand_system` · `technical_seo` · `internal_linking` · `retention_email` · `automation_os` · `brand_safety` · `measurement`

## Outer growth loops

### LOOP 1 — Search-to-Restock
Search intent → answer page → Beles → restock signup  
**Assets:** SEO pages, journal, FAQ schema, internal links, metadata  
**Demand:** prickly pear perfume, fico d'india, oil-rich parfum, skin scent, Copenhagen niche

### LOOP 2 — Social-to-Letter
Quiet sensory post → campaign page → The Letter  
**Assets:** `/content/campaigns/`, UTM system, letter positioning

### LOOP 3 — Visual Search-to-Chapter
Pinterest/mood → scent-world page → Beles → restock  
**Assets:** Pin copy, OG images, chapter CTAs

### LOOP 4 — Objection-to-Trust
Hesitation → calm answer → signup/appointment  
**Assets:** FAQ, journal, wear guide, form microcopy

### LOOP 5 — Copenhagen Appointment
Local/studio intent → about/studio → mailto request  
**Assets:** Local SEO, studio trust block, appointment events

## Meta loops

| Meta loop | Purpose | Rule |
|---|---|---|
| OS Improvement | Improve `/growth`, rules, prompts | No autonomy increase without human review |
| Brand Safety | Protect maison identity | One surface per run; score brand risk |
| Research | Mine demand language | Agent-Reach when available; cite sources |
| Design | Visual consistency | Update DESIGN.md when rule emerges |
| Performance | Speed/UX | One bottleneck; no premature optimization |
| Trust | Reduce hesitation | No fabricated proof |

## Continuous operation

- **Scheduled** Cursor Automations run **one** master loop iteration then exit
- **Event-triggered** automations (PR, CI) follow same single-iteration rule
- Improvement over time = repeated triggers + ledger, not `while(true)`

## Human review triggers

See `/growth/autonomy-policy.md`

## File map

| File | Role |
|---|---|
| `program.md` | This file — master instructions |
| `baseline.md` | Site snapshot |
| `memory.md` | Durable facts |
| `backlog.md` | Ranked experiments |
| `results.tsv` | Append-only ledger |
| `loop-manifest.yml` | Machine-readable loop defs |
| `automation-registry.md` | Automation status |
| `automation-prompts/` | Paste-ready Cloud Agent prompts |

## Assumptions (documented)

- Beles is the only active commercial chapter for acquisition focus
- Restock list is primary conversion until checkout exists
- Analytics meaningful only in production Vercel WA
- Cursor Automations require manual registration (2026-06-28)
