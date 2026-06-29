# EILLON Growth Operating System

The persistent brain for autonomous growth on **eillon.maison**.

## Start here

| Role | Read first |
|---|---|
| Any agent | `/AGENTS.md` → `/growth/program.md` |
| Brand/copy work | `DESIGN.md` |
| Automation | `/growth/autonomy-policy.md` + `/growth/automation-registry.md` |
| New experiment | `/growth/backlog.md` + `/growth/scorecard.md` |

## Directory

```
growth/
├── program.md              # Master loop instructions
├── baseline.md             # Site/conversion/SEO snapshot
├── memory.md               # Durable learnings
├── insights.md             # Current demand/conversion signals
├── backlog.md              # Ranked experiment queue
├── results.tsv             # Append-only experiment ledger
├── scorecard.md            # qualified_growth_score rubric
├── autonomy-policy.md      # What agents may/may not do
├── qa-gates.md             # CI + keep gates
├── utm-system.md           # Campaign URL conventions
├── loop-manifest.yml       # Loop definitions (internal manifest)
├── automation-registry.md  # Automation status
├── automation-prompts/     # Cursor Cloud Agent prompts
├── state.json              # Runtime lock/focus state
├── runs/                   # Per-run logs
└── AGENTS.md               # Growth folder agent rules
```

## Quick commands

```bash
npm run growth:qa              # Minimum gate before keep
npm run growth:score -- ...    # Score an experiment
npm run growth:next            # Next backlog item
npm run growth:validate-ledger # Check results.tsv
npm run growth:state           # Validate state.json
```

## Status (2026-06-28)

- **OS:** Online (EXP-001, EXP-002 keep)
- **Automations:** All `pending_registration` — see `/docs/cursor-automations-setup.md`
- **Next experiment:** EXP-003 (prickly pear landing)

## Principles

1. One experiment at a time
2. Measure with `qualified_growth_score`
3. Keep / discard / rework — log everything
4. Brand precision over generic growth
5. Never auto-merge or auto-deploy
