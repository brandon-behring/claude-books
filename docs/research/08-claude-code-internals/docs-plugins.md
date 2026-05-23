---
source_url: https://code.claude.com/docs/en/plugins
canonical_url: https://code.claude.com/docs/en/plugins
source_title: Create plugins
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: claude-code-internals
tier: T1-official
cert_domains: [3]
cert_task_areas: ["Custom slash commands + skills"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Plugins — `.claude-plugin/plugin.json`, marketplace distribution, the boundary

The packaging layer that bundles skills, agents, hooks, MCP servers, LSP servers, and background monitors into one installable unit. Cross-reference [[docs-discover-plugins]] for the consumer/install side.

## Key takeaways

- **Plugin = directory + manifest**. Required: `.claude-plugin/plugin.json`. Optional: `skills/`, `commands/`, `agents/`, `hooks/`, `.mcp.json`, `.lsp.json`, `monitors/`, `bin/`, `settings.json` (all at plugin **root**, NOT inside `.claude-plugin/`).
- **Manifest required fields**: only `name` is required. **`version` is optional** — if omitted and plugin is git-distributed, the **commit SHA is used and every commit counts as a new version** (i.e., users get updates on every push). Setting `version` explicitly = users only get updates when you bump.
- **Plugin namespacing**: plugin skills are always prefixed (e.g., `/my-plugin:hello`). This prevents conflicts when multiple plugins have skills with the same name.
- **Plugin agents have security restrictions**: `hooks`, `mcpServers`, `permissionMode` fields are **ignored** when loading agents from a plugin. To use those fields, copy agent file into `.claude/agents/` or `~/.claude/agents/`.
- **Plugin `settings.json`**: only `agent` (activate a subagent as the main thread) and `subagentStatusLine` keys are honored. Other keys silently ignored.
- **Three local-development install methods**: `--plugin-dir ./path` (also accepts `.zip`), `--plugin-url https://example.com/plugin.zip` (CI artifact), `/plugin install <name>@<marketplace>`. `--plugin-dir` of a plugin with the same name as an installed marketplace plugin takes precedence for that session (except for managed-policy force-enable/disable).
- **`/reload-plugins`** picks up changes mid-session — reloads skills, agents, hooks, plugin MCP servers, plugin LSP servers.
- **Two official marketplaces**: `claude-plugins-official` (curated by Anthropic, **automatically available**) and `claude-community` (third-party submissions after review; add manually with `/plugin marketplace add anthropics/claude-plugins-community`).
- **The standalone vs plugin boundary** maps naturally: standalone `.claude/` configs use short names (`/hello`); plugins use namespaced names (`/plugin-name:hello`). Skills in plugin's `skills/` follow same SKILL.md format as `.claude/skills/`.

## Quoted (citation-ready)

> "Plugins let you extend Claude Code with custom functionality that can be shared across projects and teams. ... Claude Code supports two ways to add custom skills, agents, and hooks: **Standalone** (`.claude/` directory) with skill names like `/hello` — best for personal workflows, project-specific customizations, quick experiments. **Plugins** (directories with `.claude-plugin/plugin.json`) with skill names like `/plugin-name:hello` — best for sharing with teammates, distributing to community, versioned releases, reusable across projects."
>
> — Create plugins, opening + When to use plugins vs standalone configuration
>
> Anchor: `When to use plugins vs standalone configuration + Plugins let you extend Claude Code`

> "For security reasons, plugin subagents do not support the `hooks`, `mcpServers`, or `permissionMode` frontmatter fields. These fields are ignored when loading agents from a plugin."
>
> — Subagents page (cross-reference) / Plugins, Plugin structure overview
>
> Anchor: `Plugin structure overview + plugin subagents do not support the hooks`

## `plugin.json` manifest

```json
{
  "name": "my-first-plugin",
  "description": "A greeting plugin to learn the basics",
  "version": "1.0.0",
  "author": {
    "name": "Your Name"
  }
}
```

| Field | Purpose |
|---|---|
| `name` | Unique identifier AND skill namespace prefix (skills become `/<name>:<skill>`) |
| `description` | Shown in plugin manager |
| `version` | **Optional**. If unset and git-distributed, commit SHA used. See "version management" |
| `author` | Optional |

Other supported fields: `homepage`, `repository`, `license`. See full manifest schema at `/en/plugins-reference#plugin-manifest-schema`.

## Plugin directory layout

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json          # MANIFEST — only this file goes inside .claude-plugin/
├── skills/
│   └── code-review/
│       └── SKILL.md
├── commands/                 # Older / flat format; skills/ recommended
├── agents/
│   └── reviewer.md
├── hooks/
│   └── hooks.json
├── .mcp.json                 # MCP server configs
├── .lsp.json                 # LSP server configs
├── monitors/
│   └── monitors.json         # Background watchers (tail logs etc.)
├── bin/                      # Executables added to PATH while plugin enabled
└── settings.json             # Defaults (only `agent`, `subagentStatusLine` honored)
```

**Common mistake**: don't put `commands/`, `agents/`, `skills/`, `hooks/` **inside** `.claude-plugin/`. Only `plugin.json` goes there.

## Plugin component boundary

| Plugin component | Format | Where it goes | Behavior |
|---|---|---|---|
| Skill | `skills/<name>/SKILL.md` | Plugin root | Same SKILL.md format; namespaced `/plugin-name:skill-name` |
| Subagent | `agents/<name>.md` | Plugin root | Same frontmatter as standalone; **`hooks`, `mcpServers`, `permissionMode` ignored** for security |
| Hooks | `hooks/hooks.json` | Plugin root | Same format as `.claude/settings.json` hooks |
| MCP server | `.mcp.json` at plugin root OR inline in `plugin.json` | Plugin root | Auto-start when plugin enabled. Use `${CLAUDE_PLUGIN_ROOT}` for paths |
| LSP server | `.lsp.json` | Plugin root | Language Server Protocol; gives Claude jump-to-def, find-refs, type errors |
| Background monitor | `monitors/monitors.json` | Plugin root | Watches logs/files; each stdout line delivered to Claude as notification |
| Bin | `bin/` directory | Plugin root | Adds executables to Bash tool's PATH while plugin enabled |

## Inline MCP server in `plugin.json`

```json
{
  "name": "my-plugin",
  "mcpServers": {
    "plugin-api": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/api-server",
      "args": ["--port", "8080"]
    }
  }
}
```

Same effect as `.mcp.json` at plugin root.

## Background monitors (`monitors/monitors.json`)

```json
[
  {
    "name": "error-log",
    "command": "tail -F ./logs/error.log",
    "description": "Application error log"
  }
]
```

Each stdout line from `command` becomes a notification to Claude during the session. Full schema (including `when` trigger and variable substitution) at `/en/plugins-reference#monitors`.

## Default settings via plugin `settings.json`

```json
{
  "agent": "security-reviewer"
}
```

Activates one of the plugin's custom agents as the main thread. Only `agent` and `subagentStatusLine` honored. Other keys silently ignored. Settings from `settings.json` take priority over `settings` declared in `plugin.json`.

## Local-development testing

```bash
# Local directory
claude --plugin-dir ./my-plugin

# Multiple plugins
claude --plugin-dir ./plugin-one --plugin-dir ./plugin-two

# .zip archive (v2.1.128+)
claude --plugin-dir ./my-plugin.zip

# Remote .zip URL (CI artifact)
claude --plugin-url https://example.com/my-plugin.zip
claude --plugin-url "https://example.com/my-plugin.zip https://example.com/other.zip"
```

`--plugin-dir` plugin with same name as an installed marketplace plugin → local takes precedence for that session (except managed-policy force-enable/disable).

## Version management

| Mode | Behavior |
|---|---|
| `version` set in `plugin.json` | Users only get updates when you bump this field |
| `version` omitted, git-distributed | Commit SHA used; every commit = new version |

Approved community plugins are pinned to a specific commit SHA in `anthropics/claude-plugins-community`; CI bumps the pin automatically as you push new commits.

## Marketplace submission

- **Claude.ai**: `claude.ai/settings/plugins/submit`
- **Console**: `platform.claude.com/plugins/submit`

Run `claude plugin validate` locally before submission. Public catalog syncs nightly. Anthropic does not control plugin contents (third-party MCP servers, scripts) — installation is a trust decision.

## Convert standalone to plugin

| Standalone (`.claude/`) | Plugin |
|---|---|
| Only available in one project | Can be shared via marketplaces |
| Files in `.claude/commands/` | Files in `plugin-name/commands/` |
| Hooks in `settings.json` | Hooks in `hooks/hooks.json` |
| Must manually copy to share | Install with `/plugin install` |

## Cross-references

- See [[docs-discover-plugins]] for the consumer side: marketplace add, `/plugin install`, scopes, auto-update, team marketplaces.
- See [[docs-skills]] for SKILL.md format used by plugin skills.
- See [[docs-sub-agents]] for the security restrictions on plugin-loaded subagents (`hooks`/`mcpServers`/`permissionMode` ignored).
- See [[docs-hooks]] for the `hooks/hooks.json` format and per-component lifecycle scoping.
- See [[docs-mcp]] for `${CLAUDE_PLUGIN_ROOT}`/`${CLAUDE_PLUGIN_DATA}` env-var expansion in `.mcp.json`.

## Open questions / follow-ups

- The exact failure mode when an unknown key is present in plugin `settings.json` — page says "silently ignored" but whether there's a debug warning isn't documented.
- Whether `monitors/monitors.json` notifications appear as a specific `Notification` hook subtype, and the matcher value to use to filter them.
- Behavior when both a `.mcp.json` at plugin root AND an inline `mcpServers` in `plugin.json` define the same server name — implied to be undefined, but no precedence rule given.
