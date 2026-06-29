# Cursor & Repo Capabilities — EILLON Growth OS

**Audited:** 2026-06-28  
**Auditor:** Composer 2.5 (initial OS build)

## Environment

| Capability | Status | Evidence | Action taken |
|---|---|---|---|
| Cursor IDE / Agents | available | Active session in EILLON workspace | Built repo-local growth OS |
| `/automate` skill | available | `C:\Users\kenne\.cursor\skills-cursor\automate\SKILL.md` | Did **not** bulk-register automations (requires per-automation user approval in Automations editor) |
| `cursor-app-control.open_automation` | available | MCP tool descriptor present | Documented manual registration in `/docs/cursor-automations-setup.md` |
| Cursor CLI `agent` | unknown | Not verified in this session | Documented as optional fallback |
| Cloud Agents | unknown | Not verified from repo | Prompts written for Cloud Agent paste-in |
| `.cursor/` directory | **created** | Did not exist before this build | Added rules + MCP example |
| `AGENTS.md` (root) | **created** | Did not exist | Created |
| `DESIGN.md` | **created** | Did not exist | Created |
| `.cursor/mcp.json` (committed) | unavailable | Not present; secrets must not be committed | Created `.cursor/mcp.json.example` only |
| codebase-memory-mcp | unavailable | Not in session MCP catalog | Documented as manual MCP setup |
| Agent-Reach | unavailable | Not in session MCP catalog | Documented in `research-sources.md` |
| GitHub integration | available | `gh` CLI works; repo `knnthhnsn/eillon` | Used for deployment checks in prior sessions |
| CI | available | `.github/workflows/ci.yml` → `npm run ci` | Documented in `qa-gates.md` |

## Repository stack

| Item | Finding |
|---|---|
| Framework | Static HTML/CSS/JS on Vercel |
| Package manager | npm (`package.json`, `package-lock.json`) |
| Build | `npm run build` (CSS/JS minify, sitemap) |
| Deploy | Vercel; `vercel.json`; production `eillon.maison` |
| Database | Neon Postgres via `/api/waitlist` |
| Analytics | Vercel Web Analytics + `scripts/analytics.js` (`EILLON_ANALYTICS`) |
| Tests | No unit test suite; verification via `verify:*`, `smoke:funnel`, Lighthouse CI |

## Automation registration status

| Result | Detail |
|---|---|
| **Automations registered in Cursor** | **10 active** (+1 auto-merge awaiting save) |
| **Blocker** | Resolved 2026-06-29 — user registered automations in UI |
| **MCP codebase-memory-mcp** | installed | `~/.cursor/mcp.json` via `codebase-memory-mcp install` |
| **Agent-Reach CLI** | installed | pip from GitHub; run `agent-reach doctor` |
| **Alternative built** | 10 prompt files under `/growth/automation-prompts/` + `/docs/cursor-automations-setup.md` |
| **Registry status** | All automations marked `pending_registration` until user registers manually |

## Next capability upgrades (human)

1. Register automations from `/docs/cursor-automations-setup.md` one at a time.
2. Optionally install codebase-memory-mcp and Agent-Reach per `.cursor/mcp.json.example`.
3. Connect Search Console / Vercel Analytics read access for `daily_growth_compass` (docs-only until connected).
