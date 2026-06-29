# Growth Automations — Save Order (all 10)

Save each in Cursor → **Automations**. One at a time — the editor holds one draft.

## Already active (verify in UI)

- [x] Daily Growth Compass — `0 8 * * 1-5`
- [x] PR Growth Review — GitHub PR opened/updated
- [x] Manual Next Best Experiment — manual
- [ ] **Weekly Search-to-Restock** — `0 9 * * 1` ← save if not done yet

**Dedupe:** delete duplicate Daily Growth Compass if two exist.

---

## Save next (in order)

### 1. Weekly Social-to-Letter
| Field | Value |
|---|---|
| Trigger | Cron `0 10 * * 3` (Wed 10:00) |
| Tools | Read, Write, Terminal |
| Repo | `knnthhnsn/eillon` · `main` |
| Prompt | `growth/automation-prompts/03-weekly-social-to-letter.md` |

### 2. Weekly Conversion & Trust
| Field | Value |
|---|---|
| Trigger | Cron `0 11 * * 4` (Thu 11:00) |
| Tools | Read, Write, Terminal |
| Prompt | `growth/automation-prompts/04-weekly-conversion-trust.md` |

### 3. CI Failure Repair
| Field | Value |
|---|---|
| Trigger | GitHub — CI / checks failed on `knnthhnsn/eillon` |
| Tools | Read, Write, Terminal |
| Prompt | `growth/automation-prompts/07-ci-failure-repair.md` |

### 4. Main Branch Digest
| Field | Value |
|---|---|
| Trigger | Cron `0 18 * * 0` (Sun 18:00) |
| Tools | Read, Write, Terminal |
| Prompt | `growth/automation-prompts/08-main-branch-digest.md` |

### 5. Monthly Brand System
| Field | Value |
|---|---|
| Trigger | Cron `0 9 1 * *` (1st of month 09:00) |
| Tools | Read, Write, Terminal |
| Prompt | `growth/automation-prompts/05-monthly-brand-system.md` |

### 6. Automation OS Improver
| Field | Value |
|---|---|
| Trigger | Cron `0 10 1 * *` (1st of month 10:00) + manual |
| Tools | Read, Write, Terminal |
| Prompt | `growth/automation-prompts/10-automation-os-improver.md` |

---

## After each save

1. Run **Test** once manually
2. Update `growth/automation-registry.md` → `active`
3. When all 10 active, clear `known_blockers` in `growth/state.json`

## Re-open prefill

Ask: *"Open automation prefill for weekly_social_to_letter"* (or any automation_id).
