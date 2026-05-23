---
topic: claude-code-internals
cert_domains: [3]
cert_task_areas:
  - "CLAUDE.md hierarchy (user / project / directory; @import)"
  - "Custom slash commands + skills (.claude/commands/, .claude/skills/)"
  - ".claude/rules/ with YAML glob path-scoping"
  - "Plan mode vs direct execution"
  - "Iterative refinement (concrete examples, test-driven, interview pattern)"
  - "CI/CD integration (-p flag, --output-format json, --json-schema)"
  - "MCP server config (.mcp.json vs ~/.claude.json, env var expansion)"
  - "Subagent invocation"
  - "Coordinator-subagent patterns"
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
---

# Claude Code internals — D3 (and parts of D1, D2) coverage

The Claude Code CLI **consumer view**: hook events, settings hierarchy, plugins, skills, sub-agents, commands, plan mode, memory, MCP integration. The Agent SDK is the **programmatic view** — see `04-agent-sdk/`. The MCP protocol itself is documented in `02-mcp-spec/`. This dossier focuses on what chapter authors need to teach a developer using Claude Code interactively or scripted via `-p`.

## Notes table

| File | Source URL | Notes |
|---|---|---|
| [docs-hooks](./docs-hooks.md) | https://code.claude.com/docs/en/hooks | 29 lifecycle events; 5 hook types; matcher syntax; decision precedence; locations table |
| [docs-model-config](./docs-model-config.md) | https://code.claude.com/docs/en/model-config | 8 aliases incl. `opusplan`; effort levels per model; `availableModels` allowlist; `modelOverrides`; 1M context |
| [docs-skills](./docs-skills.md) | https://code.claude.com/docs/en/skills | SKILL.md frontmatter (full table); `disable-model-invocation`; `user-invocable`; `context: fork`; `paths`; live change detection |
| [docs-sub-agents](./docs-sub-agents.md) | https://code.claude.com/docs/en/sub-agents | Built-in Explore/Plan/general-purpose; 5 scopes; YAML fields (incl. `isolation: worktree`, `memory`, `initialPrompt`); forks (experimental) |
| [docs-memory](./docs-memory.md) | https://code.claude.com/docs/en/memory | 4 CLAUDE.md scopes; `.claude/rules/*.md` with `paths` glob; auto memory; `@import`; `claudeMdExcludes`; `claudeMd` managed-key |
| [docs-plugins](./docs-plugins.md) | https://code.claude.com/docs/en/plugins | `.claude-plugin/plugin.json`; 7 component types; security restrictions on plugin agents; conversion path from standalone |
| [docs-discover-plugins](./docs-discover-plugins.md) | https://code.claude.com/docs/en/discover-plugins | `claude-plugins-official` (auto) + `claude-community` (manual); `/plugin` TUI; 4 install scopes; auto-update toggles |
| [docs-mcp](./docs-mcp.md) | https://code.claude.com/docs/en/mcp | Three transports; `.mcp.json` vs `~/.claude.json`; env-var expansion (`${VAR:-default}`); OAuth; Tool Search; `alwaysLoad` |
| [docs-permission-modes](./docs-permission-modes.md) | https://code.claude.com/docs/en/permission-modes | 6 modes; plan mode flow; auto-mode classifier (3-in-a-row / 20-total fallback); protected paths; Shift+Tab cycle |
| [docs-settings](./docs-settings.md) | https://code.claude.com/docs/en/settings | 5-level precedence (Managed > CLI > Local > Project > User); permission rules merge; layered ASCII diagram |
| [docs-commands](./docs-commands.md) | https://code.claude.com/docs/en/commands | 70+ commands organized by workflow phase; bundled `[Skill]` commands; MCP prompts; plugin-namespacing |

## Cert task area coverage (D3 primary)

| D3 task area | Primary note | Cross-refs |
|---|---|---|
| CLAUDE.md hierarchy (user / project / directory; @import) | [docs-memory](./docs-memory.md) | [docs-settings](./docs-settings.md), `04-agent-sdk/docs-claude-code-features` |
| Custom slash commands + skills (`.claude/commands/`, `.claude/skills/`) | [docs-skills](./docs-skills.md), [docs-commands](./docs-commands.md) | [docs-plugins](./docs-plugins.md) |
| `.claude/rules/` with YAML glob path-scoping | [docs-memory](./docs-memory.md) | [docs-skills](./docs-skills.md) (uses same `paths` format) |
| Plan mode vs direct execution | [docs-permission-modes](./docs-permission-modes.md) | [docs-sub-agents](./docs-sub-agents.md) (built-in Plan subagent), [docs-model-config](./docs-model-config.md) (`opusplan`) |
| Iterative refinement | [docs-commands](./docs-commands.md) (`/code-review`, `/run`, `/verify`) | [docs-permission-modes](./docs-permission-modes.md) (acceptEdits) |
| CI/CD integration (`-p`, `--output-format json`, `--json-schema`) | **defer to `09-headless-ci/`** | [docs-permission-modes](./docs-permission-modes.md) (`dontAsk` for CI) |
| MCP server config (`.mcp.json` vs `~/.claude.json`, env var expansion) | [docs-mcp](./docs-mcp.md) | `02-mcp-spec/` for protocol, [docs-plugins](./docs-plugins.md) for plugin MCP |

## Settings hierarchy diagram (for chapter authors)

```
                              SETTINGS RESOLUTION ORDER
                              ─────────────────────────

  ┌────────────────────────────────────────────────────────────────────────┐
  │ 1. Managed (org IT / MDM / GPO)                                        │
  │    macOS: /Library/Application Support/ClaudeCode/managed-settings.json│
  │    Linux:  /etc/claude-code/managed-settings.json                      │
  │    Windows: C:\Program Files\ClaudeCode\managed-settings.json          │
  │                                                                        │
  │    Managed-only keys: claudeMd, availableModels,                       │
  │      allowManagedHooksOnly, disableAutoMode,                           │
  │      disableBypassPermissionsMode                                      │
  └────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (cannot be overridden)
  ┌────────────────────────────────────────────────────────────────────────┐
  │ 2. CLI flags & env vars (session-only)                                 │
  │    --model, --effort, --permission-mode, --agent, --add-dir,           │
  │    --plugin-dir, --plugin-url, --setting-sources, --agents,            │
  │    --client-id, --callback-port, --dangerously-skip-permissions, ...   │
  │                                                                        │
  │    ANTHROPIC_MODEL, ANTHROPIC_DEFAULT_*_MODEL,                         │
  │    CLAUDE_CODE_EFFORT_LEVEL, CLAUDE_PROJECT_DIR,                       │
  │    CLAUDE_CODE_FORK_SUBAGENT, CLAUDE_CODE_DISABLE_BACKGROUND_TASKS,    │
  │    ENABLE_TOOL_SEARCH, MAX_MCP_OUTPUT_TOKENS, ...                      │
  └────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │ 3. Local (.claude/settings.local.json — GITIGNORED)                    │
  │    Personal-project overrides, claudeMdExcludes,                       │
  │    enabledPlugins (local scope)                                        │
  │                                                                        │
  │    REJECTED here: defaultMode: "auto", autoMemoryDirectory             │
  └────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │ 4. Project (.claude/settings.json — COMMITTED TO VCS)                  │
  │    Team-shared: permissions allow/ask/deny, hooks,                     │
  │    extraKnownMarketplaces, agent default, defaultMode,                 │
  │    enabledPlugins (project scope)                                      │
  │                                                                        │
  │    REJECTED here: defaultMode: "auto", autoMemoryDirectory             │
  └────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │ 5. User (~/.claude/settings.json)                                      │
  │    Personal defaults across all projects                               │
  │    Can hold: autoMemoryDirectory, defaultMode: "auto"                  │
  └────────────────────────────────────────────────────────────────────────┘

  EXCEPTION: permissions.{allow,ask,deny}, allowedHttpHookUrls,
             httpHookAllowedEnvVars, filesystem.allowWrite, and
             extraKnownMarketplaces MERGE across all scopes.

  SIBLING FILES (loaded regardless of settingSources at SDK level):
    ~/.claude.json                          # global config + MCP local + MCP user
    ~/.claude/projects/<project>/memory/    # auto memory
    Managed CLAUDE.md                       # macOS/Linux/Windows locations vary
    .mcp.json                               # project MCP servers
    .claude/CLAUDE.md / CLAUDE.md           # project memory
    .claude/rules/*.md                      # path-scoped rules
    .claude/skills/<name>/SKILL.md          # project skills
    .claude/agents/<name>.md                # project subagents
    .claude/commands/<name>.md              # legacy custom commands (merged into skills)
    CLAUDE.local.md                         # personal-project memory (gitignored)
```

## The plugins / skills / MCP / hooks / subagents boundary

Verified against [docs-plugins](./docs-plugins.md), `landscape-2026-05.md` §7.1, and primary docs:

| Concept | Purpose | When loaded | Cost model | Distribution |
|---|---|---|---|---|
| **CLAUDE.md** | "Always-on instructions" | Every session in full | High (loaded fully, every turn) | Repo / user / managed |
| **`.claude/rules/`** | Path-scoped instructions | Session start (or when matching files opened) | Medium (only matching rules load) | Repo / user / managed |
| **Skill** | Procedural knowledge / playbook | Description scanned at start (~100 tokens each); body lazy-loaded on invocation | Low (until invoked, then sticky for rest of session) | Personal / project / plugin / managed |
| **MCP server** | External tool surface | Connection at session start (deferred via Tool Search) | High (tool descriptions are large, hence Tool Search) | Local / project / user / plugin / claude.ai |
| **Hook** | Deterministic shell/HTTP/MCP/prompt/agent intercept on lifecycle event | At configured event | Out-of-context (runs in your application process or shell, not Claude's window) | User / project / local / managed / plugin / skill+agent frontmatter |
| **Subagent** | Isolated context for a focused task | Spawned on Agent tool call (or `--agent` for whole session) | Out-of-context (own context window, returns only summary to parent) | Managed / `--agents` JSON / project / user / plugin |
| **Plugin** | Bundle of skills + agents + hooks + MCP + LSP + monitors | When plugin enabled | Aggregates child costs; v2.1.143+ shows context-cost estimate at install | Marketplace / `--plugin-dir` / `--plugin-url` |
| **Background monitor** | Watches logs/files/external status; notifies Claude | When plugin enabled (auto-starts) | Notifications enter context | Plugin only |
| **LSP plugin** | Language Server Protocol for diagnostics + navigation | When plugin enabled | Diagnostics auto-injected after edits; navigation calls on-demand | Plugin only |

## Hooks vs SDK discrepancy table

| | CLI ([docs-hooks](./docs-hooks.md)) | TS SDK ([04-agent-sdk/docs-hooks-reference](../04-agent-sdk/docs-hooks-reference.md)) | Python SDK |
|---|---|---|---|
| Total event count | **29** | 19 | 10 |
| `Elicitation` / `ElicitationResult` | First-class events | `Notification` subtypes (`elicitation_*`); also `onElicitation` Options field | Same as TS |
| `Setup`, `UserPromptExpansion`, `TaskCreated`, `CwdChanged`, `FileChanged`, `PostCompact`, `InstructionsLoaded`, `StopFailure`, `PermissionDenied` | Yes | Partial (some TS-only) | No |
| `PostToolBatch` | Yes | TS-only | No |

The landscape doc's earlier "~31 events" estimate is close but the canonical count from `code.claude.com/docs/en/hooks` is **29** (already noted as `supersedes` on [docs-hooks](./docs-hooks.md)).

## Three permission-mode comparison

| Mode | When to use | What auto-approves | Cycle position |
|---|---|---|---|
| `default` | Sensitive work, getting started | Reads only | Default in cycle |
| `acceptEdits` | Iterating on code under review | Reads + edits + `mkdir`/`touch`/`mv`/`cp`/`sed` for in-scope paths | In cycle |
| `plan` | Research before changes | Reads only (no edits, no commands) | In cycle |
| `auto` | Long tasks, prompt fatigue | Everything, with background safety classifier (Anthropic API only; Sonnet/Opus 4.6+ / Opus 4.7) | Optional |
| `dontAsk` | CI/scripts (non-interactive) | Only pre-approved tools + read-only Bash | Never in cycle |
| `bypassPermissions` | Isolated containers/VMs only | Everything (except root `/` and `~` removals) | Optional (must launch with flag) |

## Open questions for the dossier

1. **`.claude/rules/` post-compaction behavior** — root CLAUDE.md is re-injected after compaction; rules behavior is implicit. ([docs-memory](./docs-memory.md))
2. **`PostToolBatch` semantics inside subagents** — does it fire per subagent batch or only main session? ([docs-hooks](./docs-hooks.md))
3. **`--agent <name>` + `--system-prompt` interaction** — both replace Claude Code's system prompt; precedence rules not explicit. ([docs-sub-agents](./docs-sub-agents.md))
4. **Forked subagents under managed `disableAutoMode`/`disableBypassPermissionsMode`** — whether forks inherit blocked modes or fail at spawn. ([docs-permission-modes](./docs-permission-modes.md))
5. **`/run` and `/verify` skills introduced v2.1.145** — these are early; expect refinement in chapter authoring after a few months of community feedback.

## CI/CD cross-reference

The `-p` headless mode, `--output-format json`, `--json-schema`, GitHub Actions integration, and GitLab CI patterns belong to **`09-headless-ci/`**. This dossier covers the interactive consumer side. The `dontAsk` permission mode and the auto-mode `-p` fallback behavior are the CI-relevant subset captured here.

## Sources verified

All 11 notes fetched from `code.claude.com/docs/en/` on 2026-05-22. Tier T1 throughout. No third-party reporting in this dossier.
