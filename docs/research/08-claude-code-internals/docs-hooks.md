---
source_url: https://code.claude.com/docs/en/hooks
canonical_url: https://code.claude.com/docs/en/hooks
source_title: Hooks reference
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: claude-code-internals
tier: T1-official
cert_domains: [3]
cert_task_areas: ["Custom slash commands + skills", ".claude/rules/ with YAML glob path-scoping", "CI/CD integration"]
volatility: evolving
verified: true
supersedes: ["04-agent-sdk/docs-hooks-reference (for hook-count specifics)"]
superseded_by: []
---

# Hooks reference — full CLI-side lifecycle (29 events, 5 hook types)

The canonical, complete enumeration of Claude Code CLI hook events. **This is the consumer / CLI surface; the SDK side (Python=10 events, TypeScript=19 events) is documented in [[../04-agent-sdk/docs-hooks-reference]]**. The CLI side enumerates **29 distinct events** — landscape doc's "~31" is close but this page is the ground truth. Filesystem hooks (`settings.json`) and skill/agent-frontmatter hooks both use the same event set.

## Key takeaways

- **29 lifecycle events** spanning session lifecycle, prompt handling, tool calls, subagents, tasks, worktrees, files, MCP elicitation, and config changes. The TS SDK exposes a subset (19); Python SDK exposes 10.
- **Five hook types**: `command` (shell), `http` (POST to URL), `mcp_tool` (call an already-connected MCP tool), `prompt` (single-turn LLM yes/no), `agent` (spawn subagent verifier, experimental). All five types share the common fields `type`, `if`, `timeout`, `statusMessage`, `once`.
- **Six hook locations** with merging behavior: `~/.claude/settings.json` (user, machine-local), `.claude/settings.json` (project, gitted), `.claude/settings.local.json` (personal-project, gitignored), managed-policy settings (org-wide, admin-controlled, cannot be overridden), plugin `hooks/hooks.json` (bundled with plugin), and skill/agent frontmatter (scoped to that component's lifecycle).
- **Decision precedence**: `continue: false` is absolute (stops Claude entirely regardless of event). Otherwise, event-specific decisions apply. Exit code 0 with no JSON means "no opinion; normal flow applies." Exit code 2 is "blocking error" — stderr is fed back to Claude, JSON in stdout ignored.
- **Async hooks** (`async: true` / `asyncRewake: true`, command-only) run background work without blocking; `asyncRewake: true` wakes Claude on exit code 2 with stderr/stdout as a system reminder.
- **Path placeholders** in hook commands: `${CLAUDE_PROJECT_DIR}`, `${CLAUDE_PLUGIN_ROOT}`, `${CLAUDE_PLUGIN_DATA}`. These resolve regardless of `cwd`.
- **Matcher semantics**: `"*"` / `""` / omitted = match all; only letters/digits/`_`/`|` = exact or `|`-separated list (e.g., `"Edit|Write"`); any other character = JavaScript regex (e.g., `"^Notebook"`, `"mcp__memory__.*"`).
- The `/hooks` slash command opens a read-only browser showing every event with hook counts, source indication (`User`, `Project`, `Local`, `Plugin`, `Session`, `Built-in`), and full command/prompt/URL.

## Quoted (citation-ready)

> "Hooks are user-defined shell commands, HTTP endpoints, or LLM prompts that execute automatically at specific points in Claude Code's lifecycle. Use this reference to look up event schemas, configuration options, JSON input/output formats, and advanced features like async hooks, HTTP hooks, and MCP tool hooks."
>
> — Hooks reference, opening definition
>
> Anchor: `Hooks reference + Hooks are user-defined shell commands`

> "`continue: false` takes absolute precedence. Stops Claude entirely regardless of event type."
>
> — Hooks reference, Decision Precedence Rules
>
> Anchor: `Decision Precedence Rules + continue: false takes absolute precedence`

> "**`disableAllHooks` respects managed settings hierarchy.** Managed policy hooks can only be disabled by managed settings."
>
> — Hooks reference, Disabling Hooks
>
> Anchor: `Disabling Hooks + disableAllHooks respects managed settings hierarchy`

## Complete hook event table (29 events)

Grouped by lifecycle phase. Cross-reference [[../04-agent-sdk/docs-hooks-reference]] for the SDK subset.

### Session lifecycle (4)

| Event | When it fires | Matcher values |
|---|---|---|
| `SessionStart` | Session begins or resumes | `startup`, `resume`, `clear`, `compact` |
| `Setup` | `--init-only`, or `--init` / `--maintenance` in `-p` mode | `init`, `maintenance` |
| `SessionEnd` | Session terminates | `clear`, `resume`, `logout`, `prompt_input_exit`, `bypass_permissions_disabled`, `other` |
| `Stop` | Claude finishes responding | n/a (no matcher) |

### Prompt handling (3)

| Event | When it fires | Matcher values |
|---|---|---|
| `UserPromptSubmit` | User submits a prompt, before Claude processes it | n/a |
| `UserPromptExpansion` | User-typed command expands into a prompt, before reaching Claude. Can block the expansion | Command/skill name |
| `StopFailure` | Turn ends due to API error | `rate_limit`, `authentication_failed`, `oauth_org_not_allowed`, `billing_error` |

### Tool calls (5)

| Event | When it fires | Matcher values |
|---|---|---|
| `PreToolUse` | Before a tool call executes (can block) | tool name |
| `PostToolUse` | After a tool call succeeds | tool name |
| `PostToolUseFailure` | After a tool call fails | tool name |
| `PostToolBatch` | After a full batch of parallel tool calls resolves, before next model call | tool name |
| `PermissionRequest` | When a permission dialog appears | tool name |
| `PermissionDenied` | When a tool call is denied by the auto mode classifier | tool name |

### Subagents and tasks (4)

| Event | When it fires | Matcher values |
|---|---|---|
| `SubagentStart` | Subagent spawned | agent type |
| `SubagentStop` | Subagent finishes | agent type |
| `TaskCreated` | Task being created via `TaskCreate` | task identifier |
| `TaskCompleted` | Task being marked completed | task identifier |
| `TeammateIdle` | Agent-team teammate about to go idle | teammate name |

### Worktrees and filesystem (4)

| Event | When it fires | Matcher values |
|---|---|---|
| `WorktreeCreate` | Worktree created via `--worktree` or `isolation: "worktree"` | n/a |
| `WorktreeRemove` | Worktree removed | n/a |
| `CwdChanged` | Working directory changes | n/a |
| `FileChanged` | Watched file changes on disk | path |

### Context, config, and notifications (5)

| Event | When it fires | Matcher values |
|---|---|---|
| `PreCompact` | Before context compaction | `manual`, `auto` |
| `PostCompact` | After compaction completes | n/a |
| `InstructionsLoaded` | A `CLAUDE.md` or `.claude/rules/*.md` file loaded into context | `session_start`, `nested_traversal`, `path_glob_match`, `include`, `compact` |
| `ConfigChange` | Configuration file changes during session | `user_settings`, `project_settings`, `local_settings`, `policy_settings`, `skills` |
| `Notification` | Claude Code sends a notification | `permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog` |

### MCP elicitation (2)

| Event | When it fires | Matcher values |
|---|---|---|
| `Elicitation` | MCP server requests user input during a tool call | MCP server name |
| `ElicitationResult` | After a user responds to an MCP elicitation | MCP server name |

**Discrepancy note**: The landscape doc says "~31 events"; this canonical page documents 29. Earlier mentions of `Elicitation` and `ElicitationResult` as separate first-class hooks are confirmed here. `PostToolBatch` is CLI/TS-side only (not Python). `Setup`, `TeammateIdle`, `TaskCreated`/`TaskCompleted`, `WorktreeCreate`/`WorktreeRemove`, `ConfigChange`, `CwdChanged`, `FileChanged`, `UserPromptExpansion`, `StopFailure`, `PostCompact`, `InstructionsLoaded`, `PermissionDenied` are not in the Python SDK.

## Five hook types

Every hook has a `type` field. The five values:

### `command` (shell)

```json
{
  "type": "command",
  "command": "node",
  "args": ["${CLAUDE_PLUGIN_ROOT}/scripts/format.js", "--fix"],
  "async": false,
  "asyncRewake": false,
  "shell": "bash",
  "timeout": 600
}
```

- **Exec form** (with `args`): no shell, special chars verbatim.
- **Shell form** (without `args`): shell interprets pipes, `&&`, redirects, globs.
- `shell`: `"bash"` (default) or `"powershell"`.

### `http`

```json
{
  "type": "http",
  "url": "http://localhost:8080/hooks/pre-tool-use",
  "timeout": 30,
  "headers": {"Authorization": "Bearer $MY_TOKEN"},
  "allowedEnvVars": ["MY_TOKEN"]
}
```

- Non-2xx, connection failures, timeouts → non-blocking errors; execution continues.

### `mcp_tool`

```json
{
  "type": "mcp_tool",
  "server": "my_server",
  "tool": "security_scan",
  "input": {"file_path": "${tool_input.file_path}"},
  "timeout": 600
}
```

- `server` must already be connected; tool output treated like command stdout.

### `prompt` (single-turn LLM)

```json
{
  "type": "prompt",
  "prompt": "Does this command appear safe to run? $ARGUMENTS",
  "model": "claude-haiku-4",
  "timeout": 30
}
```

- Returns yes/no decision as JSON; default model is a fast one if `model` omitted.

### `agent` (experimental)

```json
{
  "type": "agent",
  "prompt": "Verify deployment target is not production. $ARGUMENTS",
  "timeout": 60
}
```

- Spawns a subagent that can use Read, Grep, Glob, etc. to verify conditions.

## Common hook input fields (stdin for `command`, POST body for `http`)

```json
{
  "session_id": "abc123",
  "transcript_path": "/home/user/.claude/projects/.../transcript.jsonl",
  "cwd": "/home/user/my-project",
  "permission_mode": "default",
  "effort": {"level": "high"},
  "hook_event_name": "PreToolUse",
  "agent_id": "agent-123",
  "agent_type": "security-reviewer"
}
```

`permission_mode` ∈ `"default" | "plan" | "acceptEdits" | "auto" | "dontAsk" | "bypassPermissions"`.
`effort.level` ∈ `"low" | "medium" | "high" | "xhigh" | "max"`. Also exposed as `$CLAUDE_EFFORT` env var.

## Decision control by event type

| Events | Decision pattern | Control fields |
|---|---|---|
| `UserPromptSubmit`, `UserPromptExpansion`, `PostToolUse`, `PostToolUseFailure`, `PostToolBatch`, `Stop`, `SubagentStop`, `ConfigChange`, `PreCompact` | Top-level `decision` | `decision: "block"`, `reason` |
| `PreToolUse` | `hookSpecificOutput` | `permissionDecision` ∈ `allow`/`deny`/`ask`/`defer`, `permissionDecisionReason` |
| `PermissionRequest` | `hookSpecificOutput` | `decision.behavior` ∈ `allow`/`deny` |
| `PermissionDenied` | `hookSpecificOutput` | `retry: true` allows model to retry |
| `WorktreeCreate` | path return | Command hook prints path on stdout; HTTP returns `hookSpecificOutput.worktreePath` |
| `Elicitation` / `ElicitationResult` | `hookSpecificOutput` | `action` ∈ `accept`/`decline`/`cancel`, `content` |
| `SessionStart`, `Setup`, `SubagentStart` | Context only | `hookSpecificOutput.additionalContext` (no blocking) |
| `WorktreeRemove`, `Notification`, `SessionEnd`, `PostCompact`, `InstructionsLoaded`, `StopFailure`, `CwdChanged`, `FileChanged` | No decision control | n/a |

## Universal JSON output fields

```json
{
  "continue": true,
  "stopReason": "Optional message when continue: false",
  "suppressOutput": false,
  "systemMessage": "Warning shown to user",
  "terminalSequence": "\\033]777;notify;Title;Body\\007",
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "additionalContext": "Context for Claude",
    "decision": "block",
    "reason": "Why",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Reason"
  }
}
```

`additionalContext` appears wrapped in a system reminder; output capped at **10,000 characters** (excess saved to file).

Where `additionalContext` is injected:
- `SessionStart`, `Setup`, `SubagentStart` → start of conversation, before first prompt
- `UserPromptSubmit`, `UserPromptExpansion` → alongside submitted prompt
- `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PostToolBatch` → next to tool result

## Hook locations and shareability

| Location | Scope | Shareable |
|---|---|---|
| `~/.claude/settings.json` | All your projects | No (machine-local) |
| `.claude/settings.json` | Single project | Yes (commit) |
| `.claude/settings.local.json` | Single project | No (gitignored) |
| Managed policy settings | Org-wide | Yes (admin-controlled) |
| Plugin `hooks/hooks.json` | When plugin enabled | Yes (bundled w/ plugin) |
| Skill/agent frontmatter | While component active | Yes (in component file) |

## Hooks in skills and agents (frontmatter)

```yaml
---
name: secure-operations
description: Perform operations with security checks
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/security-check.sh"
---
```

- Scoped to component's lifetime; cleaned up when component finishes.
- All hook events supported.
- For subagents, `Stop` hooks **automatically convert to `SubagentStop`**.

## Exit code semantics (command hooks)

| Exit code | Meaning |
|---|---|
| `0` | Success. Claude Code parses stdout for JSON output. JSON only processed on exit 0 |
| `2` | Blocking error. Stderr fed back to Claude. JSON in stdout ignored |
| Anything else | Non-blocking error. Transcript shows error notice. Execution continues |

## Cross-references

- See [[docs-model-config]] for the settings hierarchy that includes `hooks` and `disableAllHooks`.
- See [[docs-skills]] for `hooks` in skill frontmatter.
- See [[docs-sub-agents]] for `hooks` in subagent frontmatter and `SubagentStart`/`SubagentStop` matchers.
- See [[docs-permission-modes]] for the `permission_mode` input field values.
- See [[../04-agent-sdk/docs-hooks-reference]] for the SDK-side subset (Python: 10 events, TS: 19 events) and programmatic callback signature.
- See `landscape-2026-05.md` §1.3 — confirms the 29-event canonical count (vs. landscape's "~31").

## Open questions / follow-ups

- The exact set of hook events emitted by **`agent` type hooks** when the spawned verifier itself uses tools is not documented on this page — defer to `claude-plugins-official` example or empirical test.
- Whether **plugin frontmatter hooks** can use `agent` type given the security restriction that plugin subagents have no `hooks`/`mcpServers`/`permissionMode` is implicit but not explicit on this page.
- Discrepancy with the landscape doc's earlier claim of `Elicitation` / `ElicitationResult` being SDK-side `Notification` subtypes only: at the CLI level they are first-class events. The SDK-side dossier should be updated on next refresh.
