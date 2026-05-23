---
source_url: https://code.claude.com/docs/en/agent-sdk/user-input
canonical_url: https://code.claude.com/docs/en/agent-sdk/user-input
source_title: Handle approvals and user input
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: agent-sdk
tier: T1-official
cert_domains: [1, 2]
cert_task_areas: ["Agentic loops", "Effective tool interfaces", "Escalation / ambiguity resolution patterns"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# User input — `canUseTool` callback + `AskUserQuestion` tool

How the SDK pauses for user input — both for tool approvals and for Claude's own clarifying questions.

## Key takeaways

- **Two triggers for `canUseTool`**:
  1. **Tool needs approval** — Claude wants to use a tool that isn't auto-approved by rules or modes.
  2. **Claude asks a question** — Claude calls the `AskUserQuestion` tool (built in by default; if you restrict via `tools`, include `AskUserQuestion` to keep it available).
- **The callback can stay pending indefinitely** — execution pauses until the callback returns. To survive long human delays, return the `"defer"` hook decision instead (ends the query, resumable from persisted session).
- **`PermissionResultAllow` / `PermissionResultDeny`** (Python) or `{ behavior: "allow" | "deny" }` (TS) — the two return shapes.
- **Six callback-response patterns** documented:
  1. **Approve** — pass `input` through unchanged.
  2. **Approve with changes** — modify `updatedInput`. Claude sees the result but isn't told you changed anything.
  3. **Approve and remember** — echo a `PermissionUpdate` suggestion (typically with `destination: "localSettings"`) so future calls skip the prompt.
  4. **Reject** — return `behavior: "deny"` with a message.
  5. **Suggest alternative** — `deny` with guidance in the message; Claude reads and adjusts.
  6. **Redirect entirely** — use streaming input to inject a completely new instruction.
- **Python streaming-mode requirement**: `can_use_tool` requires streaming mode AND a dummy `PreToolUse` hook returning `{"continue_": True}` to keep the stream open. Without it the stream closes before the permission callback can fire.
- **`AskUserQuestion` schema**: each call carries 1-4 questions, each with 2-4 options. Fields per question: `question`, `header` (≤12 chars), `options` (each with `label` + `description`, optionally `preview` in TS), `multiSelect`. Response shape: `{ "questions": [...], "answers": { "<question text>": "<label>" } }`. Multi-select can be array OR comma-joined string.
- **TypeScript `previewFormat`**: setting `toolConfig.askUserQuestion.previewFormat` to `"markdown"` or `"html"` adds a `preview` field to each option for visual mockups. SDK rejects `<script>`, `<style>`, `<!DOCTYPE>` in HTML previews before your callback runs.
- **Subagents cannot call `AskUserQuestion`** — explicit limitation. Plan accordingly.
- **Question limits**: 1-4 questions per call; 2-4 options each.

## Quoted (citation-ready)

> "While working on a task, Claude sometimes needs to check in with users. It might need permission before deleting files, or need to ask which database to use for a new project. Your application needs to surface these requests to users so Claude can continue with their input."
>
> — Handle approvals and user input, opening paragraph
>
> Anchor: `Handle approvals and user input + While working on a task`

> "In Python, `can_use_tool` requires streaming mode and a `PreToolUse` hook that returns `{\"continue_\": True}` to keep the stream open. Without this hook, the stream closes before the permission callback can be invoked."
>
> — Handle tool approval requests, Note
>
> Anchor: `Handle tool approval requests + In Python, can_use_tool requires streaming mode`

> "Clarifying questions are especially common in `plan` mode, where Claude explores the codebase and asks questions before proposing a plan. This makes plan mode ideal for interactive workflows where you want Claude to gather requirements before making changes."
>
> — Handle clarifying questions, Tip
>
> Anchor: `Handle clarifying questions + Clarifying questions are especially common in plan mode`

## `canUseTool` signature

```python
async def can_use_tool(
    tool_name: str,
    input_data: dict,
    context: ToolPermissionContext,
) -> PermissionResultAllow | PermissionResultDeny:
    ...
```

```typescript
canUseTool: (
  toolName: string,
  input: Record<string, unknown>,
  options: {
    signal: AbortSignal;
    suggestions?: PermissionUpdate[];
    blockedPath?: string;
    decisionReason?: string;
    toolUseID: string;
    agentID?: string;
  }
) => Promise<PermissionResult>
```

## Common tool input shapes (page table)

| Tool | Input fields |
|---|---|
| `Bash` | `command`, `description`, `timeout` |
| `Write` | `file_path`, `content` |
| `Edit` | `file_path`, `old_string`, `new_string` |
| `Read` | `file_path`, `offset`, `limit` |

## `AskUserQuestion` input schema

```json
{
  "questions": [
    {
      "question": "How should I format the output?",
      "header": "Format",
      "options": [
        { "label": "Summary", "description": "Brief overview" },
        { "label": "Detailed", "description": "Full explanation" }
      ],
      "multiSelect": false
    }
  ]
}
```

Response shape (built by the callback):

```json
{
  "questions": [/* pass through original */],
  "answers": {
    "How should I format the output?": "Summary",
    "Which sections should I include?": ["Introduction", "Conclusion"]
  }
}
```

For free-text input: display an extra "Other" choice and pass the user's typed text as the value (not the literal `"Other"`).

## `PermissionUpdate` for "approve and remember"

The `suggestions` field on the context argument carries ready-made `PermissionUpdate` entries (since v0.1.80 Python). Echo one back in `updatedPermissions` to persist the rule:

```python
async def can_use_tool(tool_name, input_data, context):
    choice = await ask_user(f"Allow {tool_name}?", ["once", "always", "no"])
    if choice == "always":
        persist = [s for s in context.suggestions if s.destination == "localSettings"]
        return PermissionResultAllow(
            updated_input=input_data, updated_permissions=persist
        )
    ...
```

A `localSettings` destination writes to `.claude/settings.local.json` so future sessions skip the prompt for matching calls.

## Permission-mode interaction

The page notes that `canUseTool` is **skipped in `dontAsk` mode** — anything not pre-approved is denied without calling the callback. This is step 5 of the 5-step evaluation chain in [[docs-permissions]].

## `PermissionRequest` hook for external notifications

Per the page's Note callout: "You can also use the `PermissionRequest` hook to send external notifications (Slack, email, push) when Claude is waiting for approval."

## Cross-references

- See [[docs-permissions]] for steps 1-4 of the permission evaluation chain that surrounds this callback (step 5).
- See [[docs-hooks-reference]] for `PermissionRequest` (external-notification hook) and the `"defer"` decision.
- See [[docs-builtin-tools]] for the `AskUserQuestion` tool's place in the built-in inventory.
- See [[docs-subagents]] for why `AskUserQuestion` doesn't work inside subagents.
- See `02-mcp-spec/spec-elicitation.md` for the underlying MCP elicitation protocol that `onElicitation` connects to.

## Open questions / follow-ups

- The "redirect entirely" pattern uses streaming input — defer streaming-mode details to `09-headless-ci/` dossier (the `/en/agent-sdk/streaming-vs-single-mode` page).
- Custom tools (the `/en/agent-sdk/custom-tools` page) are another path for "collect structured input" beyond `AskUserQuestion`'s multiple-choice shape — defer to a future note.
- The `previewFormat` HTML sanitization rules are minimal (rejects `<script>`, `<style>`, `<!DOCTYPE>`) — chapters that surface previews in a browser context should warn readers to additionally sanitize.
