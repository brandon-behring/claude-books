---
source_url: https://code.claude.com/docs/en/sub-agents
canonical_url: https://code.claude.com/docs/en/sub-agents
source_title: Create custom subagents
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: claude-code-internals
tier: T1-official
cert_domains: [1, 3]
cert_task_areas: ["Custom slash commands + skills", "Subagent invocation", "Coordinator-subagent patterns", "Plan mode vs direct execution"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Subagents (CLI/consumer side) — `.claude/agents/*.md`, Explore/Plan built-ins, forks

The interactive/filesystem side of subagents: built-in Explore/Plan/general-purpose agents, markdown definition files, the `/agents` TUI, three invocation patterns (natural language, `@`-mention, `--agent`), and **forked subagents** (experimental, inherit full conversation). Cross-reference [[../04-agent-sdk/docs-subagents]] for the programmatic `AgentDefinition` schema.

## Key takeaways

- **Three built-in subagents** (auto-invoked by Claude based on task):
  - **Explore** — Haiku, read-only, file discovery / code search. Skips CLAUDE.md and git status. Claude can specify thoroughness `quick` / `medium` / `very thorough`.
  - **Plan** — inherits parent model, read-only. Used during [[docs-permission-modes]] plan-mode for codebase research. Skips CLAUDE.md / git status. Prevents infinite nesting since subagents can't spawn subagents.
  - **general-purpose** — inherits parent model, all tools. Complex multi-step tasks requiring exploration + modification.
  - Plus auxiliary: `statusline-setup` (Sonnet, for `/statusline`), `claude-code-guide` (Haiku, for Claude Code feature questions).
- **Five scope levels with precedence**:
  1. Managed settings (org-wide) — highest
  2. `--agents` CLI flag (JSON, session-only)
  3. `.claude/agents/` (project; commit to VCS)
  4. `~/.claude/agents/` (user; all your projects)
  5. Plugin's `agents/` directory — lowest. Plugin agents use scoped names like `my-plugin:code-reviewer` or `my-plugin:review:security` for subfolders.
- **Subagents cannot spawn subagents.** Use Skills or chain subagents from main conversation instead. `Agent` is removed from a subagent's tool set automatically.
- **Plugin subagents have security restrictions**: `hooks`, `mcpServers`, `permissionMode` fields are **ignored** when loaded from a plugin.
- **Three invocation patterns** (escalating):
  - **Natural language**: `Use the test-runner subagent to fix failing tests` — Claude decides whether to delegate
  - **`@`-mention**: `@"code-reviewer (agent)" look at the auth changes` — guarantees that subagent runs for one task
  - **`--agent <name>` or `agent` setting**: whole session uses that subagent's system prompt, tools, model. Replaces Claude Code's default system prompt entirely.
- **Subagent context isolation**: each subagent starts with fresh, isolated context. Receives task message + own system prompt + CLAUDE.md (except Explore/Plan) + git status (except Explore/Plan) + preloaded `skills`. Does NOT receive parent's conversation history, parent's tool results, or parent's preloaded skill content.
- **Forks** (experimental, `CLAUDE_CODE_FORK_SUBAGENT=1`, v2.1.117+): subagent inherits **entire conversation so far** — same system prompt, tools, model, and message history as main session. Use when a named subagent would need too much background. The fork's own tool calls stay out of main conversation; only final result returns. `/fork` command spawns a fork. Fork-mode changes: Claude spawns forks instead of general-purpose; every subagent spawn runs in background; `/fork` replaces `/branch` alias.

## Quoted (citation-ready)

> "Subagents are specialized AI assistants that handle specific types of tasks. Use one when a side task would flood your main conversation with search results, logs, or file contents you won't reference again: the subagent does that work in its own context and returns only the summary."
>
> — Create custom subagents, opening
>
> Anchor: `Create custom subagents + Subagents are specialized AI assistants`

> "Subagents cannot spawn their own subagents. Don't include `Agent` in a subagent's `tools` array. ... If your workflow requires nested delegation, use [Skills](/en/skills) or [chain subagents](#chain-subagents) from the main conversation."
>
> — Create custom subagents, Choose between subagents and main conversation (Note)
>
> Anchor: `Choose between subagents and main conversation + Subagents cannot spawn other subagents`

> "A fork is a subagent that inherits the entire conversation so far instead of starting fresh. This drops the input isolation that subagents otherwise provide: a fork sees the same system prompt, tools, model, and message history as the main session, so you can hand it a side task without re-explaining the situation."
>
> — Create custom subagents, Fork the current conversation
>
> Anchor: `Fork the current conversation + A fork is a subagent that inherits the entire conversation`

## Markdown file format

```markdown
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Glob, Grep
model: sonnet
---

You are a code reviewer. When invoked, analyze the code and provide
specific, actionable feedback on quality, security, and best practices.
```

**Note**: Subagents are loaded at session start. **Files added or edited directly on disk require restarting the session.** Subagents created through `/agents` take effect immediately.

## Supported frontmatter fields (CLI-side)

| Field | Required | Description |
|---|:---:|---|
| `name` | Yes | Unique identifier (lowercase, hyphens). Received by hooks as `agent_type`. Filename doesn't have to match |
| `description` | Yes | When Claude should delegate to this subagent |
| `tools` | No | Allowlist (inherits all if omitted). Use `skills` to preload skills; do NOT list `Skill` here |
| `disallowedTools` | No | Denylist (applied first; `tools` resolved against remainder) |
| `model` | No | `sonnet`, `opus`, `haiku`, full ID (`claude-opus-4-7`), or `inherit`. Default: `inherit` |
| `permissionMode` | No | `default`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`, `plan`. **Ignored for plugin subagents** |
| `maxTurns` | No | Max agentic turns before subagent stops |
| `skills` | No | Skills to preload into subagent's context at startup (full content injected, not just description) |
| `mcpServers` | No | MCP servers available to this subagent (name reference or inline definition). **Ignored for plugin subagents** |
| `hooks` | No | Lifecycle hooks scoped to this subagent. **Ignored for plugin subagents** |
| `memory` | No | `user`, `project`, or `local` — persistent memory scope at `~/.claude/agent-memory/<name>/` etc. |
| `background` | No | `true` = always run as background task. Default: `false` |
| `effort` | No | Override effort level when subagent active |
| `isolation` | No | `worktree` = run in temporary git worktree branched from default branch. Cleaned up if no changes |
| `color` | No | `red`/`blue`/`green`/`yellow`/`purple`/`orange`/`pink`/`cyan` |
| `initialPrompt` | No | Auto-submitted as first user turn when agent runs as main session via `--agent`/`agent` setting |

## Model resolution order (when Claude invokes subagent)

1. `CLAUDE_CODE_SUBAGENT_MODEL` env var (if set) — overrides per-invocation and definition
2. Per-invocation `model` parameter (when Claude passes one through Agent tool)
3. Subagent definition's `model` frontmatter
4. Main conversation's model

## Permission modes (`permissionMode`)

| Mode | Behavior |
|---|---|
| `default` | Standard permission checking with prompts |
| `acceptEdits` | Auto-accept edits + common filesystem cmds for paths in cwd/`additionalDirectories` |
| `auto` | Auto-mode classifier reviews commands |
| `dontAsk` | Auto-deny prompts (explicitly allowed tools still work) |
| `bypassPermissions` | Skip prompts |
| `plan` | Plan mode (read-only exploration) |

**Inheritance rules**:
- If parent uses `bypassPermissions` or `acceptEdits` → takes precedence, cannot be overridden.
- If parent uses `auto` → subagent inherits auto; subagent's `permissionMode` is ignored.

## Disable specific subagents

```json
{
  "permissions": {
    "deny": ["Agent(Explore)", "Agent(my-custom-agent)"]
  }
}
```

Or `claude --disallowedTools "Agent(Explore)"`.

## Restrict which subagents an agent can spawn (when running as main thread)

```yaml
---
name: coordinator
tools: Agent(worker, researcher), Read, Bash
---
```

- `Agent(worker, researcher)` = allowlist of subagent types.
- `Agent` without parens = allow any subagent.
- Omit `Agent` from `tools` entirely = agent cannot spawn any subagents.
- **Only applies to agents running as main thread via `claude --agent`**. Subagents can't spawn subagents regardless.
- v2.1.63: Task tool renamed to Agent; existing `Task(...)` references work as aliases.

## Agent persistence and resume

When a subagent completes, Claude receives its `agentId`. To resume:
- Ask Claude to continue ("Continue that code review...") — Claude uses `SendMessage` tool with the agent's ID
- `SendMessage` only available when agent teams enabled (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`)

**Persistence**: subagent transcripts stored separately from main conversation. **Unaffected by main-session compaction.** Cleaned up after `cleanupPeriodDays` (default 30 days). Find IDs at `~/.claude/projects/{project}/{sessionId}/subagents/agent-{agentId}.jsonl`.

**Auto-compaction**: subagents support auto-compaction at ~95% capacity. Override with `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=<percent>`.

## Forks (experimental — `CLAUDE_CODE_FORK_SUBAGENT=1`)

```text
/fork draft unit tests for the parser changes so far
```

| | Fork | Named subagent |
|---|---|---|
| Context | Full conversation history | Fresh context with prompt you pass |
| System prompt and tools | Same as main session | From subagent's definition |
| Model | Same as main session | From subagent's `model` field |
| Permissions | Prompts surface in your terminal | Auto-denied when in background |
| Prompt cache | Shared with main session | Separate cache |

Fork's first request **reuses parent's prompt cache** — cheaper than spawning a fresh subagent for tasks needing same context.

When fork mode is enabled, **every subagent spawn runs in the background** regardless of `background` field. Set `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1` to keep spawns synchronous.

A fork cannot spawn further forks.

## Persistent memory (`memory: user|project|local`)

| Scope | Location | Use when |
|---|---|---|
| `user` | `~/.claude/agent-memory/<name>/` | Subagent should remember across all projects |
| `project` | `.claude/agent-memory/<name>/` | Project-specific; shareable via VCS |
| `local` | `.claude/agent-memory-local/<name>/` | Project-specific; NOT in VCS |

When memory enabled:
- Subagent's system prompt includes instructions for reading/writing memory dir
- Includes first **200 lines or 25KB** of `MEMORY.md` in memory dir (whichever first), with instructions to curate if exceeding
- Read, Write, Edit tools auto-enabled

`project` is recommended default — knowledge shareable via version control.

## What loads at startup for a non-fork subagent

- **System prompt**: agent's own prompt + environment details Claude Code appends. NOT the full Claude Code system prompt.
- **Task message**: delegation prompt Claude writes when handing off the work.
- **CLAUDE.md and memory**: every level of memory hierarchy main conversation loads. **Explore and Plan skip this.**
- **Git status**: snapshot from start of parent session. Absent when cwd isn't git repo or `includeGitInstructions` is false. **Explore and Plan skip regardless.**
- **Preloaded skills**: full content of any skill named in `skills` field.

## Cross-references

- See [[docs-permission-modes]] for plan mode (and built-in Plan subagent's role in it).
- See [[docs-skills]] for `context: fork` skills (inverse pattern) and the `skills` field on subagents (preloading).
- See [[docs-hooks]] for `SubagentStart`/`SubagentStop` hooks and `hooks` in subagent frontmatter (frontmatter `Stop` auto-converts to `SubagentStop` at runtime).
- See [[docs-mcp]] for inline `mcpServers` definitions (scope MCP server to subagent only, keep tool descriptions out of parent context).
- See [[../04-agent-sdk/docs-subagents]] for programmatic `AgentDefinition` schema and SDK invocation semantics.
- See `landscape-2026-05.md` §5.1 for multi-agent research-system pattern that subagents implement.

## Open questions / follow-ups

- `--agent` invocation with `initialPrompt` plus user-typed prompt — confirmed `initialPrompt` is prepended, but the join character (newline? space?) isn't specified.
- Whether `Agent(plugin-name:agent-name)` permission syntax with plugin-scoped names works the same as for `Agent(custom-name)` — implied but not explicit.
- The `cleanupPeriodDays` default of 30 — whether that applies symmetrically to forked-subagent transcripts (forks share the parent's session, but their own transcripts are stored separately).
