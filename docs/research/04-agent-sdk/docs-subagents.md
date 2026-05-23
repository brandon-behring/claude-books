---
source_url: https://code.claude.com/docs/en/agent-sdk/subagents
canonical_url: https://code.claude.com/docs/en/agent-sdk/subagents
source_title: Subagents in the SDK
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: agent-sdk
tier: T1-official
cert_domains: [1]
cert_task_areas: ["Subagent invocation", "Coordinator-subagent patterns", "Session state", "Task decomposition"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Subagents in the SDK — programmatic AgentDefinition, isolated context, Agent tool

The canonical page for spawning specialized subagents from the SDK. Pair with [[docs-python-reference]] / [[docs-typescript-reference]] for the `AgentDefinition` schema and `02-mcp-spec/` for MCP-related subagent isolation.

## Key takeaways

- **Three ways to create a subagent**:
  - **Programmatic** via `agents` option (recommended for SDK apps; this page's focus)
  - **Filesystem-based** via `.claude/agents/*.md` markdown files
  - **Built-in general-purpose** — Claude can invoke a default `general-purpose` subagent via the Agent tool without any definition
- **Agent tool, not Task tool** — but for backward compat the page documents that "The tool name was renamed from `Task` to `Agent` in Claude Code v2.1.63. Current SDK releases emit `Agent` in `tool_use` blocks but still use `Task` in the `system:init` tools list and in `result.permission_denials[].tool_name`." **Check both values** in tool-name filters.
- **Always include `"Agent"` in `allowedTools`** to auto-approve subagent invocations. Without it, Agent calls fall through to `canUseTool` or, in `dontAsk` mode, are denied.
- **Subagent context is fresh** — only the Agent tool's prompt string crosses from parent to subagent. Subagents do NOT receive the parent's conversation history, parent's system prompt, or parent's preloaded skill content. They DO receive project CLAUDE.md (via `settingSources`) and the tool definitions from their `tools` list (or inherited).
- **The parent receives the subagent's final message verbatim** as the Agent-tool result, but may summarize it. To preserve subagent output verbatim, instruct the main agent to do so.
- **Subagents cannot spawn subagents.** "Don't include `Agent` in a subagent's `tools` array."
- **`parent_tool_use_id`** is the canonical marker for "this message came from inside a subagent". Track it to attribute work to the right execution context.
- **Subagent transcripts persist independently** of the main conversation: not affected by main-session compaction; cleaned up after `cleanupPeriodDays` (default 30 days). Resume via `resume: sessionId` + naming the agent ID in the new prompt.

## Quoted (citation-ready)

> "A subagent's context window starts fresh (no parent conversation) but isn't empty. The only channel from parent to subagent is the Agent tool's prompt string, so include any file paths, error messages, or decisions the subagent needs directly in that prompt."
>
> — Subagents in the SDK, What subagents inherit
>
> Anchor: `What subagents inherit + A subagent's context window starts fresh`

> "Subagents cannot spawn their own subagents. Don't include `Agent` in a subagent's `tools` array."
>
> — Subagents in the SDK, Programmatic definition (Note)
>
> Anchor: `Programmatic definition + Subagents cannot spawn their own subagents`

> "The tool name was renamed from `Task` to `Agent` in Claude Code v2.1.63. Current SDK releases emit `Agent` in `tool_use` blocks but still use `Task` in the `system:init` tools list and in `result.permission_denials[].tool_name`. Checking both values in `block.name` ensures compatibility across SDK versions."
>
> — Subagents in the SDK, Detecting subagent invocation (Note)
>
> Anchor: `Detecting subagent invocation + The tool name was renamed`

## AgentDefinition fields (full)

| Field | Type | Required | Description |
|---|---|:---:|---|
| `description` | `string` | yes | Natural language description of when to use this agent |
| `prompt` | `string` | yes | The agent's system prompt defining its role and behavior |
| `tools` | `string[]` | no | Array of allowed tool names. If omitted, inherits all tools |
| `disallowedTools` | `string[]` | no | Array of tool names to remove from the agent's tool set |
| `model` | `string` | no | Model override. Accepts `'sonnet'` / `'opus'` / `'haiku'` / `'inherit'` / full ID |
| `skills` | `string[]` | no | List of skill names to preload (others remain invocable via the Skill tool) |
| `memory` | `'user' \| 'project' \| 'local'` | no | Memory source for this agent |
| `mcpServers` | `(string \| object)[]` | no | MCP servers available to this agent, by name or inline config |
| `maxTurns` | `number` | no | Maximum agentic turns before the subagent stops |
| `background` | `boolean` | no | Run as a non-blocking background task when invoked |
| `effort` | `'low' \| 'medium' \| 'high' \| 'xhigh' \| 'max' \| number` | no | Reasoning effort level |
| `permissionMode` | `PermissionMode` | no | Tool execution permission mode for this agent |
| `initialPrompt` | `string` | no | Auto-submitted as first user turn (Python/TS, AgentDefinition only) |
| `criticalSystemReminder_EXPERIMENTAL` | `string` | no | TS-only experimental field |

**Python field-naming gotcha**: `AgentDefinition` uses camelCase (`disallowedTools`, `permissionMode`, etc.) even in the Python SDK, distinct from `ClaudeAgentOptions` which uses snake_case.

## "What subagents inherit" — explicit channels

| The subagent receives | The subagent does NOT receive |
|---|---|
| Its own system prompt (`AgentDefinition.prompt`) and the Agent tool's prompt | The parent's conversation history or tool results |
| Project CLAUDE.md (loaded via `settingSources`) | Preloaded skill content (unless listed in `AgentDefinition.skills`) |
| Tool definitions (inherited from parent or the subset in `tools`) | The parent's system prompt |

## Invocation paths

- **Automatic**: Claude matches the subagent's `description` to the task and invokes via the Agent tool. Write descriptions to be specific and keyword-rich.
- **Explicit**: name the subagent in the prompt — `"Use the code-reviewer agent to check the authentication module"`. Bypasses automatic matching.
- **Dynamic factory pattern**: build `AgentDefinition`s at query time using factory functions. The page shows a `create_security_agent(security_level)` example that picks `model="opus"` for strict reviews and `"sonnet"` otherwise.

## Common tool combinations (page table)

| Use case | Tools | Description |
|---|---|---|
| Read-only analysis | `Read`, `Grep`, `Glob` | Examine code but not modify or execute |
| Test execution | `Bash`, `Read`, `Grep` | Run commands and analyze output |
| Code modification | `Read`, `Edit`, `Write`, `Grep`, `Glob` | Full read/write access without command execution |
| Full access | All tools | Inherits all tools from parent (omit `tools`) |

## Detecting subagent activity

In the message stream:

- Check `tool_use` blocks where `name in ("Task", "Agent")` to spot subagent **invocation** (the parent message).
- Check `parent_tool_use_id` on any message to see whether that message came from **inside** a subagent's execution.

**Python content-block access**: `message.content` is the list of blocks directly. **TS content-block access**: `message.message.content` (the API message is nested inside `SDKAssistantMessage`).

## Resuming subagents

When a subagent completes, the parent receives the subagent's `agentId` in the Agent tool result. To resume:

1. Capture `session_id` from any message in the first query.
2. Extract `agentId` from message content (it appears in Agent tool results as `agentId: <uuid>`).
3. Pass `resume: sessionId` in the second `query()` call AND include the `agentId` in the prompt.

Important: **resume the same session** to access the subagent's transcript; each `query()` starts a new session by default. For custom (non-built-in) subagents, pass the same `agents` definition in both queries.

## Subagent failure modes (from the page's troubleshooting)

- **Not delegating** — `Agent` missing from `allowedTools`; description too vague; failed to invoke by name.
- **Filesystem agents not refreshing** — loaded at startup only; restart Claude Code to pick up new files.
- **Windows long-prompt failures** — Windows command-line length limit is 8191 chars; large prompts may need filesystem-based agents instead.
- **AskUserQuestion unavailable in subagents** — per [[docs-user-input]], it does not work in subagents spawned via the Agent tool.

## Cross-references

- See [[docs-hooks-reference]] for the `SubagentStart` / `SubagentStop` hook events that fire around Agent-tool invocations.
- See [[docs-agent-loop]] for the surrounding loop semantics and the `parent_tool_use_id` propagation rule.
- See [[docs-sessions]] for resume / fork mechanics that subagent persistence rides on.
- See [[docs-permissions]] for why subagent permissions don't inherit (and how to pre-approve cleanly).
- See `docs/landscape-2026-05.md` §5.1 for the multi-agent research system (the canonical orchestrator-worker pattern that this SDK feature implements).

## Open questions / follow-ups

- **Background subagents** (`background: true`): the page mentions the field but does not document the lifecycle envelope (how does the parent receive results? polling? push?). Search the TS message-union types (`SDKTaskStartedMessage`, `SDKTaskNotificationMessage`) for the answer when a chapter needs it.
- **`memory` field semantics on `AgentDefinition`** vs `setting_sources` on the parent — both control filesystem context loading; the docs don't fully reconcile them.
- **Agent teams** are mentioned as a different feature (CLI-only, multiple Claude Code instances with shared task lists) — out of scope for this dossier, defer to `08-claude-code-internals/`.
- The `agentId` extraction is a string-search hack (`/agentId:\s*([a-f0-9-]+)/`) — chapters should warn readers this is brittle.
