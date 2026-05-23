---
source_url: https://code.claude.com/docs/en/settings
canonical_url: https://code.claude.com/docs/en/settings
source_title: Claude Code Settings
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: claude-code-internals
tier: T1-official
cert_domains: [3]
cert_task_areas: ["CLAUDE.md hierarchy", "Custom slash commands + skills"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Settings — the 5-level hierarchy (Managed > CLI > Local > Project > User)

How Claude Code resolves configuration across four settings files plus CLI overrides. Cross-reference [[docs-model-config]] for the `model`/`effort`/`availableModels` keys, [[docs-permission-modes]] for `permissions.defaultMode`, and [[docs-memory]] for `claudeMd`/`claudeMdExcludes`/`autoMemoryDirectory`/`autoMemoryEnabled`.

## Key takeaways

- **Five-level precedence** (highest to lowest):
  1. **Managed** — server-managed or platform-specific path (cannot be overridden)
  2. **CLI arguments** — `--model`, `--permission-mode`, etc. (session-only)
  3. **Local** — `.claude/settings.local.json` (gitignored; personal-project overrides)
  4. **Project** — `.claude/settings.json` (committed to repo; shared with team)
  5. **User** — `~/.claude/settings.json`
- **Exception**: permission rules (`allow`, `ask`, `deny`) **MERGE** across scopes rather than override. Deny evaluated first, then ask, then allow. First matching rule wins. Other arrays like `filesystem.allowWrite` also merge.
- **Object scalars** follow precedence (highest scope wins); **nested structures** deep-merge.
- **`$schema`** key: `https://json.schemastore.org/claude-code-settings.json` for editor autocomplete.
- **Hot reload**: most settings reload without restart (permissions, hooks, env). Some keys (`model`, `outputStyle`) require restart.
- **Backups**: Claude Code automatically creates timestamped backups; retains 5 most recent.
- **Settings rejection by scope**: `defaultMode: "auto"` and `autoMemoryDirectory` are **rejected from project/local settings** (cloned repo can't grant itself auto mode or redirect auto memory).

## Quoted (citation-ready)

> "When the same setting appears in multiple scopes, Claude Code applies them in priority order: Managed (highest) → can't be overridden by anything → Command line arguments → temporary session overrides → Local → overrides project and user settings → Project → overrides user settings → User (lowest) → applies when nothing else specifies the setting. Exception: Permission rules **merge** across scopes rather than override."
>
> — Claude Code Settings (settings page summary), Settings Hierarchy & Precedence
>
> Anchor: `Settings Hierarchy & Precedence + When the same setting appears in multiple scopes`

## Settings file locations

| Scope | Location | OS notes |
|---|---|---|
| **Managed** | Server-managed via `managed-settings.json`, or `/Library/Application Support/ClaudeCode/managed-settings.json` (macOS), `/etc/claude-code/managed-settings.json` (Linux/WSL), `C:\Program Files\ClaudeCode\managed-settings.json` (Windows) | Deployed by IT/MDM/GPO; cannot be overridden |
| **User** | `~/.claude/settings.json` | `%USERPROFILE%\.claude\` on Windows |
| **Project** | `.claude/settings.json` | Committed to git |
| **Local** | `.claude/settings.local.json` | Gitignored |

## Configuration map across artifact types

| Artifact | User | Project | Local |
|---|---|---|---|
| Settings | `~/.claude/settings.json` | `.claude/settings.json` | `.claude/settings.local.json` |
| Subagents | `~/.claude/agents/` | `.claude/agents/` | None |
| Skills | `~/.claude/skills/` | `.claude/skills/` | None |
| Rules | `~/.claude/rules/` | `.claude/rules/` | None |
| MCP servers | `~/.claude.json` (user scope) | `.mcp.json` | per-project in `~/.claude.json` (local scope) |
| Plugins | In `settings.json` (`enabledPlugins`) | In `settings.json` | In `settings.local.json` |
| CLAUDE.md | `~/.claude/CLAUDE.md` | `CLAUDE.md` or `.claude/CLAUDE.md` | `CLAUDE.local.md` |
| Auto memory | `~/.claude/projects/<project>/memory/` | (per-repo, machine-local) | (per-repo, machine-local) |

## Core settings (selection)

| Setting | Purpose |
|---|---|
| `model` | Override default model (alias or full ID) |
| `effortLevel` | Default effort level for the session |
| `availableModels` | **Managed-only enforcement**: allowlist of models users can select |
| `modelOverrides` | Provider-specific model ID routing |
| `outputStyle` | Adjust system prompt style |
| `language` | Preferred response language |
| `autoMemoryEnabled` | Enable/disable auto memory |
| `autoMemoryDirectory` | Override auto memory location (managed/user only) |
| `alwaysThinkingEnabled` | Extended thinking by default |
| `claudeMd` | **Managed-only**: inline CLAUDE.md content |
| `claudeMdExcludes` | Glob patterns to skip ancestor CLAUDE.md files |
| `hooks` | Lifecycle event handlers (full schema in [[docs-hooks]]) |
| `disableAllHooks` | Disable all hooks entirely |
| `allowedHttpHookUrls` | Allowlist URL patterns for HTTP hooks (merges across scopes) |
| `httpHookAllowedEnvVars` | Allowlist env vars for hook header interpolation |
| `allowManagedHooksOnly` | **Managed-only**: only managed, SDK, force-enabled plugin hooks load |
| `agent` | Run main thread as a named subagent |
| `subagentStatusLine` | Format for subagent status display |
| `cleanupPeriodDays` | Days before subagent transcripts cleaned up (default 30) |
| `env` | Environment variables for all sessions and subprocesses |
| `apiKeyHelper` | Script to generate auth tokens |
| `forceLoginMethod` | Restrict to `"claudeai"` or `"console"` |
| `forceLoginOrgUUID` | Require org membership |
| `permissions.allow` | Pre-approve tool patterns (merges across scopes) |
| `permissions.ask` | Confirm before tool use (merges) |
| `permissions.deny` | Block tool patterns (merges) |
| `permissions.defaultMode` | Permission mode on startup |
| `permissions.additionalDirectories` | Extra working directories |
| `permissions.disableAutoMode` | **Managed-only**: lock auto mode off |
| `permissions.disableBypassPermissionsMode` | **Managed-only**: lock bypass off |
| `sandbox.enabled` | Sandboxing on/off |
| `worktree.*` | Git worktree settings |
| `extraKnownMarketplaces` | Team-marketplace declarations (auto-suggest at trust) |
| `enabledPlugins` | Active plugins by scope |
| `skillOverrides` | Skill visibility overrides |
| `skillListingBudgetFraction` | Description budget fraction (default 0.01 = 1%) |
| `maxSkillDescriptionChars` | Per-skill description cap (default 1,536) |
| `viewMode` | `"default"`, `"verbose"`, `"focus"` |
| `tui` | `"default"` or `"fullscreen"` |
| `editorMode` | `"normal"` or `"vim"` |
| `disableSkillShellExecution` | Block `` !`cmd` `` execution in skills |
| `showThinkingSummaries` | Display extended thinking blocks |
| `showClearContextOnPlanAccept` | Plan-approval offers context clear |

## Permission rules (merge across scopes)

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test *)",
      "Read(~/.zshrc)"
    ],
    "deny": [
      "Bash(curl *)",
      "Read(./.env)",
      "Read(./secrets/**)"
    ],
    "ask": [
      "Bash(git push *)"
    ],
    "defaultMode": "acceptEdits",
    "additionalDirectories": ["../docs/"]
  }
}
```

Rule evaluation order: **deny first, then ask, then allow**. First matching rule wins.

## Real-world example

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "model": "claude-sonnet-4-6",
  "language": "english",
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Read(src/**)",
      "Edit(src/**)"
    ],
    "deny": [
      "Read(./.env)",
      "WebFetch(domain:sensitive.internal)"
    ],
    "defaultMode": "acceptEdits"
  },
  "env": {
    "NODE_ENV": "development"
  },
  "autoMemoryEnabled": true,
  "spinnerTipsEnabled": false,
  "editorMode": "vim"
}
```

## Settings layer for chapter authors

For a chapter explaining "how to configure Claude Code" succinctly, this is the canonical layered ASCII / block:

```
+-------------------------------------------------------------+
| 1. Managed (org IT)                                         |
|    macOS: /Library/Application Support/ClaudeCode/...       |
|    Linux: /etc/claude-code/managed-settings.json            |
|    Windows: C:\Program Files\ClaudeCode\managed-settings... |
|    → claudeMd, availableModels, allowManagedHooksOnly,      |
|      disableAutoMode, disableBypassPermissionsMode          |
+-------------------------------------------------------------+
                       ↓ cannot be overridden
+-------------------------------------------------------------+
| 2. CLI flags & env vars                                     |
|    --model, --effort, --permission-mode, --agent            |
|    --add-dir, --plugin-dir, --plugin-url, --setting-sources |
|    --agents, --client-id, --callback-port, ...              |
|    ANTHROPIC_MODEL, ANTHROPIC_DEFAULT_*_MODEL,              |
|    CLAUDE_CODE_EFFORT_LEVEL, CLAUDE_PROJECT_DIR, ...        |
+-------------------------------------------------------------+
                       ↓ session-only
+-------------------------------------------------------------+
| 3. Local (.claude/settings.local.json, gitignored)          |
|    Personal-project overrides, claudeMdExcludes,            |
|    enabledPlugins (local scope)                             |
+-------------------------------------------------------------+
                       ↓
+-------------------------------------------------------------+
| 4. Project (.claude/settings.json, committed)               |
|    Team-shared: permissions allow/deny, hooks,              |
|    extraKnownMarketplaces, agent default, defaultMode       |
+-------------------------------------------------------------+
                       ↓
+-------------------------------------------------------------+
| 5. User (~/.claude/settings.json)                           |
|    Personal defaults across all projects                    |
|    autoMemoryDirectory (also accepted at managed)           |
+-------------------------------------------------------------+

Sibling files (loaded regardless of settingSources for the SDK):
- ~/.claude.json (global config + MCP local-scope + MCP user-scope)
- ~/.claude/projects/<project>/memory/ (auto memory)
- Managed CLAUDE.md (location depends on OS)
```

## Cross-references

- See [[docs-model-config]] for `model`, `effortLevel`, `availableModels`, `modelOverrides`.
- See [[docs-permission-modes]] for `permissions.defaultMode`, `disableAutoMode`, `disableBypassPermissionsMode`.
- See [[docs-hooks]] for `hooks`, `disableAllHooks`, `allowedHttpHookUrls`, `httpHookAllowedEnvVars`, `allowManagedHooksOnly`.
- See [[docs-skills]] for `skillOverrides`, `skillListingBudgetFraction`, `maxSkillDescriptionChars`, `disableSkillShellExecution`.
- See [[docs-memory]] for `claudeMd`, `claudeMdExcludes`, `autoMemoryEnabled`, `autoMemoryDirectory`.
- See [[docs-discover-plugins]] for `extraKnownMarketplaces`, `enabledPlugins`.
- See [[docs-mcp]] for `allowedMcpServers`, `deniedMcpServers`, `managed-mcp.json`.
- See [[../04-agent-sdk/docs-claude-code-features]] for `settingSources` and how the SDK opts in/out of these settings.

## Open questions / follow-ups

- The full list of "automatic backup" file naming convention and where backups live (the page mentions backups but not their storage path).
- Whether `skillListingBudgetFraction` and `maxSkillDescriptionChars` accept dynamic resizing mid-session or only at startup.
- Some settings (e.g., `forceLoginOrgUUID`) are documented elsewhere — defer to `/en/permissions#managed-settings` for the full enforcement-side enumeration.
