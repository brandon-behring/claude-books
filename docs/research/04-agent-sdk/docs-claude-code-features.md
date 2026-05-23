---
source_url: https://code.claude.com/docs/en/agent-sdk/claude-code-features
canonical_url: https://code.claude.com/docs/en/agent-sdk/claude-code-features
source_title: Use Claude Code features in the SDK
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: agent-sdk
tier: T1-official
cert_domains: [1, 3]
cert_task_areas: ["Session state", "CLAUDE.md hierarchy", "Agent SDK hooks", "Multi-step workflows"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Claude Code features in the SDK — `settingSources` and what loads

How filesystem-based Claude Code features (CLAUDE.md, skills, hooks, rules, `.mcp.json`) flow into SDK queries via `settingSources` (TS) / `setting_sources` (Python).

## Key takeaways

- **Three setting sources**: `"user"` (`~/.claude/`), `"project"` (`<cwd>/.claude/`), `"local"` (`<cwd>/.claude/settings.local.json`).
- **Default behavior**: when you **omit** `settingSources`, the SDK loads all three sources — matching Claude Code CLI behavior. **`settingSources: []` opts out entirely** (still loads managed-policy settings + `~/.claude.json` global config + auto-memory).
- **Per-source load contents** (canonical table reproduced below).
- **`cwd`** governs project lookups. CLAUDE.md and rules load from `<cwd>` and **every parent directory**. Skills load from `<cwd>` and every parent **up to the repository root**. Project `settings.json` and hooks load only from `<cwd>/.claude/` (no parent fallback).
- **Multi-tenant warning**: "Do not rely on default `query()` options for multi-tenant isolation." Managed-policy settings, `~/.claude.json`, and auto memory load regardless of `settingSources`. For multi-tenant deployments, run each tenant in its own filesystem AND set `settingSources: []` AND `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` in `env`.
- **Filesystem hooks support five `type` values**: `command` (shell), `http` (POST to endpoint), `mcp_tool` (call MCP tool), `prompt` (LLM evaluates a prompt), `agent` (spawns a verifier agent). They fire in the main agent AND in any subagents it spawns.
- **Programmatic hooks** (callbacks in `query()`) fire only in the main session, not subagents.

## Quoted (citation-ready)

> "When you omit `settingSources`, `query()` reads the same filesystem settings as the Claude Code CLI: user, project, and local settings, CLAUDE.md files, and `.claude/` skills, agents, and commands. To run without these, pass `settingSources: []`, which limits the agent to what you configure programmatically."
>
> — Use Claude Code features in the SDK, opening paragraph
>
> Anchor: `Use Claude Code features in the SDK + When you omit settingSources`

> "Do not rely on default `query()` options for multi-tenant isolation. Because the inputs above are read regardless of `settingSources`, an SDK process can pick up host-level configuration and per-directory memory. For multi-tenant deployments, run each tenant in its own filesystem and set `settingSources: []` plus `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` in `env`."
>
> — Use Claude Code features in the SDK, Warning
>
> Anchor: `What settingSources does not control + Do not rely on default query() options`

## What each source loads (canonical table)

| Source | What it loads | Location |
|---|---|---|
| `"project"` | Project CLAUDE.md, `.claude/rules/*.md`, project skills, project hooks, project `settings.json` | `<cwd>/.claude/` for `settings.json` and hooks; `<cwd>` and every parent for CLAUDE.md / rules; `<cwd>` and every parent up to repo root for skills |
| `"user"` | User CLAUDE.md, `~/.claude/rules/*.md`, user skills, user settings | `~/.claude/` |
| `"local"` | `CLAUDE.local.md`, `.claude/settings.local.json` | `<cwd>/.claude/` for `settings.local.json`; `<cwd>` and every parent for `CLAUDE.local.md` |

## What `settingSources` does NOT control

| Input | Behavior | To disable |
|---|---|---|
| Managed policy settings | Always loaded when present on the host | Remove the managed settings file |
| `~/.claude.json` global config | Always read | Relocate with `CLAUDE_CONFIG_DIR` in `env` |
| Auto memory at `~/.claude/projects/<project>/memory/` | Loaded by default into the system prompt | `autoMemoryEnabled: false` in settings, or `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` in `env` |

## CLAUDE.md load levels (chapter-worthy)

| Level | Location | When loaded |
|---|---|---|
| Project (root) | `<cwd>/CLAUDE.md` or `<cwd>/.claude/CLAUDE.md` | `settingSources` includes `"project"` |
| Project rules | `<cwd>/.claude/rules/*.md` and `.claude/rules/*.md` in every parent | `settingSources` includes `"project"` |
| Project (parent dirs) | `CLAUDE.md` files **above** `cwd` | `settingSources` includes `"project"`, loaded at session start |
| Project (child dirs) | `CLAUDE.md` files in **subdirectories** of `cwd` | `settingSources` includes `"project"`, **loaded on demand** when the agent reads a file in that subtree |
| Local | `<cwd>/CLAUDE.local.md` and `CLAUDE.local.md` in every parent | `settingSources` includes `"local"` |
| User | `~/.claude/CLAUDE.md` | `settingSources` includes `"user"` |
| User rules | `~/.claude/rules/*.md` | `settingSources` includes `"user"` |

All levels are **additive** — no hard precedence between them. If instructions conflict, "the outcome depends on how Claude interprets them. Write non-conflicting rules, or state precedence explicitly in the more specific file."

## Hook-type decision

| Hook type | Best for |
|---|---|
| **Filesystem** (`settings.json`) | Sharing hooks between CLI and SDK sessions. Supports `command` / `http` / `mcp_tool` / `prompt` / `agent` types. Fires in the main agent AND any subagents |
| **Programmatic** (callbacks in `query()`) | Application-specific logic; returning structured decisions; in-process integration. **Scoped to the main session only** |

## "Choose the right feature" matrix (chapter-grade)

| You want to… | Use | SDK surface |
|---|---|---|
| Set project conventions your agent always follows | CLAUDE.md | `settingSources: ["project"]` loads it automatically |
| Give the agent reference material it loads when relevant | Skills | `settingSources` + `skills` option |
| Run a reusable workflow (deploy, review, release) | User-invocable skills | `settingSources` + `skills` option |
| Delegate an isolated subtask to a fresh context | Subagents | `agents` parameter + `allowedTools: ["Agent"]` |
| Coordinate multiple Claude Code instances with shared task lists | Agent teams | NOT directly configured via SDK; CLI feature |
| Run deterministic logic on tool calls (audit, block, transform) | Hooks | `hooks` parameter with callbacks, or shell scripts via `settingSources` |
| Give Claude structured tool access to an external service | MCP | `mcpServers` parameter |

## Cross-references

- See [[docs-hooks-reference]] for the full programmatic-hook event list and per-SDK availability.
- See [[docs-system-prompts]] for how the `claude_code` preset interacts with CLAUDE.md and `excludeDynamicSections`.
- See [[docs-skills]] for how the `skills` option pairs with `settingSources`.
- See [[docs-subagents]] for the `agents` programmatic-definition pattern.
- See [[docs-mcp]] for `.mcp.json` interplay with the `project` source.

## Open questions / follow-ups

- "Agent teams" is mentioned as a CLI-only feature with shared task lists and direct inter-agent messaging — defer to a future dossier in `08-claude-code-internals/`.
- "Plugins" option (`SdkPluginConfig`) loads custom plugins from local paths — touched on this page; full mechanics in `/en/agent-sdk/plugins`. Defer.
- Filesystem hook types `prompt` and `agent` are documented only by their type names here — the `/en/hooks` reference is the source of truth and likely worth a separate note in `08-claude-code-internals/`.
