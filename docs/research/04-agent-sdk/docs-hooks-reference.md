---
source_url: https://code.claude.com/docs/en/agent-sdk/hooks
canonical_url: https://code.claude.com/docs/en/agent-sdk/hooks
source_title: Intercept and control agent behavior with hooks
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: agent-sdk
tier: T1-official
cert_domains: [1, 2]
cert_task_areas: ["Agent SDK hooks", "Effective tool interfaces", "Structured error responses"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Hooks reference — every hook event with Python/TS parity

The exhaustive list of agent-SDK hook events with one-line descriptions, Python-vs-TS availability, callback I/O shape, matcher syntax, evaluation order, and async-output mode. Chapters will cite this note frequently.

## Key takeaways

- **Hooks fire at named lifecycle events** during agent execution. Two callback channels: **programmatic hooks** (callbacks in `query()` options) and **filesystem hooks** (shell commands in `settings.json`, loaded via `settingSources`). Both run in the same lifecycle.
- **Hook count and naming converged on this page** (override the landscape doc's older count when chapters cite specifics):
  - **Python SDK supports 10 hook events**: `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `UserPromptSubmit`, `Stop`, `SubagentStart`, `SubagentStop`, `PreCompact`, `PermissionRequest`, `Notification`.
  - **TypeScript SDK supports 19 hook events** — the 10 above plus `PostToolBatch`, `SessionStart`, `SessionEnd`, `Setup`, `TeammateIdle`, `TaskCompleted`, `ConfigChange`, `WorktreeCreate`, `WorktreeRemove`.
- **`SessionStart` / `SessionEnd` are TS-only as SDK callbacks.** Python apps that need them must load filesystem hooks from `.claude/settings.json` via `setting_sources=["project"]` (or run init logic on the first message of `client.receive_response()`).
- **Decision precedence** when multiple hooks act on the same event: **deny > defer > ask > allow**. A single `deny` blocks the operation regardless of what other hooks return.
- **Async output** (`async: true` / `async_: True` + `asyncTimeout`) lets a hook return immediately while a side-effect runs in the background — useful for logging/webhooks. Async hooks cannot block, modify input, or inject context.
- **Matchers are regex strings** matched against the event's "filter field" — for tool hooks, the tool name. To match all MCP tools, use `"^mcp__"`. To match every event, omit the matcher.
- **Hooks run in your application process**, so they consume host resources (and host failures kill the agent). They **do not consume agent context** — distinct from in-context system reminders.

## Quoted (citation-ready)

> "Hooks are callback functions that run your code in response to agent events, like a tool being called, a session starting, or execution stopping."
>
> — Hooks reference, opening paragraph
>
> Anchor: `Hooks reference + Hooks are callback functions that run your code`

> "When multiple hooks or permission rules apply, **deny** takes priority over **defer**, which takes priority over **ask**, which takes priority over **allow**. If any hook returns `deny`, the operation is blocked regardless of other hooks."
>
> — Hooks reference, Outputs
>
> Anchor: `Outputs + When multiple hooks or permission rules apply`

> "SessionStart and SessionEnd can be registered as SDK callback hooks in TypeScript, but are not available in the Python SDK (HookEvent omits them). In Python, they are only available as shell command hooks defined in settings files."
>
> — Hooks reference, Session hooks not available in Python
>
> Anchor: `Session hooks not available in Python + SessionStart and SessionEnd can be registered`

## Complete hook event table

| Hook event | Python SDK | TS SDK | What triggers it | Example use |
|---|:---:|:---:|---|---|
| `PreToolUse` | yes | yes | Tool call request (can block or modify) | Block dangerous shell commands |
| `PostToolUse` | yes | yes | Tool execution result | Audit-log every file change |
| `PostToolUseFailure` | yes | yes | Tool execution failure | Handle / log tool errors |
| `PostToolBatch` | no | yes | A full batch of tool calls resolves, once per batch before next model call | Inject conventions once for the whole batch |
| `UserPromptSubmit` | yes | yes | User prompt submission | Inject extra context |
| `Stop` | yes | yes | Agent execution stop | Save session state before exit |
| `SubagentStart` | yes | yes | Subagent initialization | Track parallel-task spawning |
| `SubagentStop` | yes | yes | Subagent completion | Aggregate results from parallel tasks |
| `PreCompact` | yes | yes | Conversation compaction request | Archive full transcript before summarizing |
| `PermissionRequest` | yes | yes | Permission dialog would be displayed | Custom permission handling |
| `SessionStart` | **no** | yes | Session initialization | Initialize logging / telemetry |
| `SessionEnd` | **no** | yes | Session termination | Clean up temporary resources |
| `Notification` | yes | yes | Agent status messages | Forward to Slack / PagerDuty |
| `Setup` | no | yes | Session setup / maintenance | Run init tasks |
| `TeammateIdle` | no | yes | Teammate becomes idle (agent teams) | Reassign work |
| `TaskCompleted` | no | yes | Background task completes | Aggregate results from parallel tasks |
| `ConfigChange` | no | yes | Configuration file changes | Reload settings dynamically |
| `WorktreeCreate` | no | yes | Git worktree created | Track isolated workspaces |
| `WorktreeRemove` | no | yes | Git worktree removed | Clean up workspace resources |

## Five-step lifecycle (from the page)

1. **An event fires** during agent execution.
2. **The SDK collects registered hooks** — programmatic callbacks from `options.hooks` plus shell-command hooks from settings files when the corresponding `settingSources` / `setting_sources` source is loaded.
3. **Matchers filter** — regex tested against the event's target (tool name for tool hooks, notification type for `Notification`).
4. **Callbacks execute** — receive a typed input object and a `tool_use_id` and a context object.
5. **Callback returns a decision** — top-level fields (`systemMessage`, `continue`/`continue_`) plus `hookSpecificOutput` (event-specific).

## Callback signature

Every hook callback receives three arguments:

- **Input data** — typed object whose shape depends on the hook type. All inputs share `session_id`, `cwd`, `hook_event_name`. `PreToolUse` / `PostToolUse` / `PostToolUseFailure` also carry `agent_id` and `agent_type` when invoked inside a subagent (Python). In TypeScript these fields are on the base hook input and available to all hook types.
- **Tool use ID** (`str | None` / `string | undefined`) — correlates `PreToolUse` and `PostToolUse` for the same call.
- **Context** — TS has `signal` (`AbortSignal`) for cancellation; Python's third arg is reserved.

## Return-value semantics

Callback returns an object with two field categories:

- **Top-level fields**: `systemMessage` (shown to user, not model — see the `includeHookEvents` / `include_hook_events` option), `continue` (`continue_` in Python — whether the agent keeps running after this hook).
- **`hookSpecificOutput`** (event-typed):
  - `PreToolUse`: `permissionDecision` ∈ `"allow" | "deny" | "ask" | "defer"`, `permissionDecisionReason`, `updatedInput`.
  - `PostToolUse`: `additionalContext` (appended to tool result) or `updatedToolOutput` (replaces output before Claude sees it).

Returning `{}` (empty object) means "allow without changes."

`"defer"` is special — it ends the query so the host can resume it later from the persisted session.

## Async hooks

Hooks that only side-effect can return `{ "async": True, "asyncTimeout": 30000 }` (TS) or `{ "async_": True, "asyncTimeout": 30000 }` (Python, since `async` is a reserved keyword). The agent proceeds without waiting; the background work is bounded by `asyncTimeout` ms.

Limitation: "Async outputs cannot block, modify, or inject context into the operation since the agent has already moved on."

## Matcher quick reference

```python
# Tool-name regex
HookMatcher(matcher="Write|Edit", hooks=[...])
HookMatcher(matcher="^mcp__", hooks=[...])  # all MCP tools
HookMatcher(hooks=[...])                     # match everything
```

```typescript
// Tool-name regex
{ matcher: "Write|Edit", hooks: [...] }
{ matcher: "^mcp__", hooks: [...] }
{ hooks: [...] }
```

**Matcher fields per event type**: tool hooks match against the tool name; `Notification` hooks match against the notification subtype (`permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog`, `elicitation_response`, `elicitation_complete`). Full list at `/en/hooks#matcher-patterns`.

Matchers do **not** filter by tool argument (e.g., file path). Filter inside the callback with `input_data["tool_input"]["file_path"]`.

## Multi-hook execution

"When an event fires, all matching hooks run in parallel. For permission decisions, the most restrictive result wins: a single `deny` blocks the tool call regardless of what the other hooks return. Because completion order is non-deterministic, write each hook to act independently rather than relying on another hook having run first."

## Canonical hook example (Python)

```python
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions, HookMatcher

async def protect_env_files(input_data, tool_use_id, context):
    file_path = input_data["tool_input"].get("file_path", "")
    if file_path.endswith(".env"):
        return {
            "hookSpecificOutput": {
                "hookEventName": input_data["hook_event_name"],
                "permissionDecision": "deny",
                "permissionDecisionReason": "Cannot modify .env files",
            }
        }
    return {}

options = ClaudeAgentOptions(
    hooks={"PreToolUse": [HookMatcher(matcher="Write|Edit", hooks=[protect_env_files])]}
)
```

## Common gotchas (from the page's troubleshooting)

- **Hook not firing**: case-sensitive event names (`PreToolUse`, not `preToolUse`); hooks may not fire when `max_turns` cuts the session.
- **`updatedInput` not applied**: must be inside `hookSpecificOutput` AND paired with `permissionDecision: "allow"` (or `"ask"`). With `"defer"`, `updatedInput` is ignored.
- **`systemMessage` not appearing in output**: SDK does not surface hook output in the message stream unless `includeHookEvents` is true. To pass context to the model use `additionalContext` instead.
- **Subagent permission prompts multiplying**: subagents do NOT inherit parent permissions; pre-approve via `PreToolUse` hooks or per-subagent rules.
- **Recursive hook loops with subagents**: a `UserPromptSubmit` hook that spawns subagents can loop infinitely if those subagents trigger the same hook — guard with a session-state flag.

## Cross-references

- See [[docs-permissions]] for the full evaluation chain that surrounds hooks (hooks are step 1 of 5).
- See [[docs-subagents]] for `SubagentStart` / `SubagentStop` payload fields (`agent_id`, `agent_transcript_path`).
- See [[docs-claude-code-features]] for how filesystem hooks from `settings.json` interact with programmatic hooks.
- See [[docs-user-input]] for `canUseTool` (step 5 of the permission chain) and the `PermissionRequest` hook for external notifications.
- See `02-mcp-spec/spec-elicitation.md` for the underlying MCP elicitation protocol that surfaces as the `Notification` subtypes `elicitation_*`.

## Open questions / follow-ups

- Filesystem hooks support five `type` values (`command`, `http`, `mcp_tool`, `prompt`, `agent`) per [[docs-claude-code-features]] — neither this page nor the SDK references document the full schema; the link to `/en/hooks` is the source of truth for shell-command hooks.
- The 19 TS events vs the 10 Python events — the gap is widening. Python parity is an open follow-up; track in CHANGELOGs.
- `Elicitation` and `ElicitationResult` (listed in the landscape doc as expected) are **not first-class hooks** here — they appear as `Notification` subtypes (`elicitation_dialog`, `elicitation_response`, `elicitation_complete`) and as `onElicitation` (TS Options field). Correct the landscape doc on the next refresh.
- `PostToolBatch` hook (TS-only) is the chapter-relevant new one for "batch convention injection" — worth a section in any tool-design chapter.
