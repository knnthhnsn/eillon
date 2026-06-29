# EILLON Growth MCP Setup

Optional MCPs for richer automations. **Never commit `.cursor/mcp.json` with secrets** — use Cursor Settings → Tools & MCP or local gitignored file.

## 1. Codebase Memory MCP (long-term code intelligence)

Indexes the repo into a local graph so agents trace routes, links, and impact without re-discovering the site each run.

### Install (Windows)

```powershell
npm install -g codebase-memory-mcp
codebase-memory-mcp install
```

If Cursor is not auto-detected, add manually to **`%USERPROFILE%\.cursor\mcp.json`**:

```json
{
  "mcpServers": {
    "codebase-memory-mcp": {
      "command": "codebase-memory-mcp",
      "args": []
    }
  }
}
```

Restart Cursor → **Settings → Tools & MCP** → confirm server shows tools.

### First use (once per machine)

In any agent chat: **"Index the EILLON repository at this path"** or run:

```powershell
cd C:\Users\kenne\Desktop\Eillon
codebase-memory-mcp cli index_repository "{\"repo_path\": \"C:\\Users\\kenne\\Desktop\\Eillon\"}"
```

### Used by

- `daily_growth_compass` — architecture context
- `weekly_search_to_restock` — internal link targets
- `pr_growth_review` — impact of HTML/route changes
- All growth automations (read `growth/memory.md` first; MCP supplements)

---

## 2. Agent-Reach (demand research — Reddit, YouTube, web)

**Not an MCP server** — a CLI + skill router. Automations use **Terminal** to run `agent-reach doctor` and platform CLIs.

### Install

```powershell
pip install agent-reach
agent-reach install --env=auto
agent-reach doctor
```

Follow `doctor` output for Reddit (OpenCLI or `rdt login`), Exa search (often auto), YouTube (yt-dlp).

### Cursor skill (optional)

```powershell
npx skills add https://github.com/panniantong/agent-reach --skill agent-reach
```

Restart Cursor. Daily Compass prompt already checks for Agent-Reach availability.

### Research rules

- Cite in `growth/insights.md` per `growth/research-sources.md`
- Transform language — never paste user comments as site copy
- No PII in growth files

---

## 3. Verify in automations

| Automation | MCP / tool |
|---|---|
| Daily Growth Compass | Agent-Reach `doctor` + one demand query; codebase-memory for route context |
| Weekly Search-to-Restock | codebase-memory `search_graph` for internal links |
| PR Growth Review | codebase-memory for blast radius |

---

## Troubleshooting

| Issue | Fix |
|---|---|
| MCP not in Automations editor | Only **dashboard** MCPs work in Cloud Agents; codebase-memory must be in Cursor MCP settings |
| Agent-Reach Reddit 403 | Configure login per `agent-reach doctor` |
| Index stale | `codebase-memory-mcp config set auto_index true` |

See also: `.cursor/mcp.json.example`, `growth/cursor-capabilities.md`.
