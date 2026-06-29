# Run: EXP-001 · manual_os_build

**Date:** 2026-06-28  
**Agent:** Composer 2.5  
**Branch:** main (OS scaffold)  
**Loop type:** measurement

## Hypothesis

If we document baseline, conversion paths, analytics, and SEO state in /growth/baseline.md, then future agents can run experiments without re-discovering the repo, because persistent memory reduces rework and errors.

## Changes

| File | Summary |
|---|---|
| growth/baseline.md | Full site/conversion/SEO snapshot |
| growth/cursor-capabilities.md | Environment audit |
| growth/README.md, program.md | OS entry points |

## QA

| Gate | Result |
|---|---|
| validate-ledger | pass |
| growth:qa | pass (post-scripts) |
| brand safety | pass |

## Scores

qualified_growth_score: **16** — **keep**

## Decision

**Status:** keep

## Durable learnings

- Static site + Vercel + Neon waitlist; analytics via EILLON_ANALYTICS
- Primary funnel: Beles restock → Letter → appointment
