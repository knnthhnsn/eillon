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

### Reddit on Windows (manual — reliable)

Chrome encrypts cookies; `rdt login` often fails with **No Reddit cookies found** even when logged in. The `js_challenge=1` URL after Reddit's bot check is normal.

**Fix:**

1. Install [Cookie-Editor](https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm) in Chrome
2. Open reddit.com (logged in)
3. Cookie-Editor → find **`reddit_session`** → copy **Value**
4. Run:

```powershell
.\scripts\reddit-rdt-manual-login.ps1
```

5. Paste the value when prompted → `rdt status --json` should show `"authenticated": true`

**Note:** The script writes UTF-8 **without BOM**. PowerShell `Set-Content -Encoding UTF8` adds a BOM that breaks `rdt-cli` JSON parsing (`"No credential loaded"` even when the file exists).

Alternative: fully **quit Chrome** (all windows), then retry `rdt login`.

1. Sign in at the browser tabs (Reddit + X login).
2. Run in PowerShell from repo root:

```powershell
.\scripts\agent-reach-after-login.ps1
```

Or manually:

```powershell
agent-reach configure --from-browser chrome
# use edge instead of chrome if needed
rdt login
agent-reach doctor
```

### Exa web search

Installed via `mcporter` → `config/mcporter.json` in repo. Agent-Reach doctor should show **全网语义搜索** as available.

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
