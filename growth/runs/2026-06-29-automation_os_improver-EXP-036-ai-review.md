# AI Hard Review — EXP-036

**Date:** 2026-06-29
**Automation:** automation_os_improver
**Branch:** growth/os-2026-06-29
**Bugbot runs:** 0 (docs/scripts-only; light self-checklist per ai-review.md)
**Verdict:** pass

## Summary

OS improvement run targeting ledger hygiene and QA reliability. EXP-002b used non-canonical status `pending_registration` (violates program.md decision enum). validate-ledger now rejects invalid statuses and score mismatches. growth:qa bootstraps npm ci when node_modules is incomplete. No autonomy policy changes; no safety loosening.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| warn | results.tsv EXP-002b | Status was pending_registration | Fixed to blocked; note points to registry |
| warn | validate-ledger.mjs | Only checked column count | Added status, loop_type, score validation |
| warn | qa.mjs | Build failed on fresh env without npm ci | Added GSAP dep check + npm ci bootstrap |

## Checklist sign-off

- [x] Brand (DESIGN.md) — no public copy changed
- [x] Claims / products.js — untouched
- [x] Privacy / analytics — untouched
- [x] SEO / metadata — untouched
- [x] A11y (if UI) — N/A
- [x] Ledger + run log ready

## QA commands

- npm run growth:validate-ledger — pass
- npm run growth:qa — pass
