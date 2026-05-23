---
source_url: https://code.claude.com/docs/en/agent-sdk/permissions
canonical_url: https://code.claude.com/docs/en/agent-sdk/permissions
source_title: Configure permissions
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: agent-sdk
tier: T1-official
cert_domains: [1, 2]
cert_task_areas: ["Agentic loops", "Effective tool interfaces", "Structured error responses"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Permissions — the five-step evaluation order and six modes

The canonical page for permission semantics. Pair with [[docs-hooks-reference]] for step 1 of the chain and [[docs-user-input]] for step 5.

## Key takeaways

- **Six permission modes**: `default`, `acceptEdits`, `plan`, `dontAsk`, `bypassPermissions`, `auto` (TS-only).
- **Five-step evaluation order** (from the page):
  1. **Hooks** — deny here outright or pass on.
  2. **Deny rules** — `disallowed_tools` + `settings.json` deny rules. **Deny rules block even in `bypassPermissions` mode** (the only exception is scoped rules like `Bash(rm *)` which keep the tool available but block specific commands).
  3. **Permission mode** — apply the active mode.
  4. **Allow rules** — `allowed_tools` + `settings.json` allow rules.
  5. **`canUseTool` callback** — final fallback. **Skipped in `dontAsk` mode** (tool denied instead).
- **Scoped deny rules**: `disallowed_tools=["Bash(rm *)"]` keeps `Bash` available but blocks `rm *` calls in **every** mode. Bare-name rules like `disallowed_tools=["Bash"]` remove the tool from the request entirely so Claude never sees it.
- **`allowed_tools` is an allowlist, not a filter for `bypassPermissions`** — setting `allowed_tools=["Read"]` alongside `permission_mode="bypassPermissions"` still approves every tool, including `Bash`, `Write`, and `Edit`. Important gotcha.
- **`acceptEdits` covers more than file edits** — auto-approves `mkdir`, `touch`, `rm`, `rmdir`, `mv`, `cp`, `sed` filesystem commands. Only inside `cwd` + `additionalDirectories`; paths outside that scope and protected paths still prompt.
- **`plan` mode** restricts to read-only tools — Claude explores and produces a plan without editing source files.
- **`dontAsk` mode** = denies-instead-of-prompting. Useful for headless / locked-down agents.

## Quoted (citation-ready)

> "When Claude requests a tool, the SDK checks permissions in this order: 1. Hooks. 2. Deny rules. 3. Permission mode. 4. Allow rules. 5. canUseTool callback."
>
> — Configure permissions, Permission Evaluation Order
>
> Anchor: `Permission Evaluation Order + When Claude requests a tool`

> "`allowed_tools` does not constrain `bypassPermissions`. `allowed_tools` only pre-approves the tools you list…Setting `allowed_tools=[\"Read\"]` alongside `permission_mode=\"bypassPermissions\"` still approves every tool, including `Bash`, `Write`, and `Edit`."
>
> — Configure permissions, Key Constraints
>
> Anchor: `Key Constraints + allowed_tools does not constrain bypassPermissions`

> "Deny rules (`disallowed_tools`), explicit `ask` rules, and hooks are evaluated before the mode check and can still block a tool."
>
> — Configure permissions, bypassPermissions mode
>
> Anchor: `bypassPermissions + Deny rules, explicit ask rules, and hooks are evaluated before`

## Permission mode table (chapter-grade)

| Mode | Behavior |
|---|---|
| `default` | No auto-approvals; unmatched tools trigger your `canUseTool` callback; no callback means deny |
| `acceptEdits` | File edits and filesystem ops (`mkdir`, `rm`, `mv`, `cp`, etc.) auto-approved inside `cwd`/`additionalDirectories`; other Bash follows default rules |
| `plan` | Restricts Claude to read-only tools; Claude analyzes and plans without editing source files |
| `dontAsk` | Anything not pre-approved by `allowed_tools` or rules is denied; `canUseTool` is never called |
| `bypassPermissions` | All tools run without permission prompts (hooks + deny rules + explicit `ask` rules still apply); cannot run as root on Unix |
| `auto` (TS only) | Model classifier approves or denies each tool call |

## `allowed_tools` / `disallowed_tools` syntax (page table)

| Option | Effect |
|---|---|
| `allowed_tools=["Read", "Grep"]` | `Read` and `Grep` auto-approved. Tools not listed still exist and fall through to permission mode + `canUseTool` |
| `disallowed_tools=["Bash"]` | The `Bash` tool definition is **removed** from the request. Claude does not see the tool and cannot attempt it |
| `disallowed_tools=["Bash(rm *)"]` | `Bash` stays available. Calls matching `rm *` are denied in every permission mode, including `bypassPermissions`. Other `Bash` calls fall through |

## Dynamic permission changes mid-session

Both SDKs allow runtime mode changes:

```python
# Python — ClaudeSDKClient
async with ClaudeSDKClient(options=ClaudeAgentOptions(permission_mode="default")) as client:
    await client.query("Help me refactor this code")
    await client.set_permission_mode("acceptEdits")
```

```typescript
// TypeScript — Query.setPermissionMode()
const q = query({ prompt: "...", options: {} });
await q.setPermissionMode("acceptEdits");
```

## Cross-references

- See [[docs-hooks-reference]] for step 1 of the evaluation chain (hooks).
- See [[docs-user-input]] for step 5 (`canUseTool` callback, allow/deny/modify/redirect patterns).
- See [[docs-mcp]] for why `allowedTools` is the right knob for MCP-tool access (and why `bypassPermissions` is too broad).
- See [[docs-subagents]] for the "subagents do NOT inherit parent permissions" gotcha — each subagent has its own evaluation chain.
- See [[docs-agent-loop]] for the `permission_mode` field on `ClaudeAgentOptions` and its default behavior (`default`).

## Open questions / follow-ups

- The `auto` mode's "model classifier" is referenced but not described — the page links to `/en/permission-modes#eliminate-prompts-with-auto-mode` for behavior and availability. Worth a separate note if a chapter takes a strong position on `auto`.
- "Settings.json allow rules" — the `settings.json` permission-rule grammar isn't fully covered here; the link to `/en/settings#permission-settings` is the source of truth. Defer to `08-claude-code-internals/` if needed.
- The `permission_prompt_tool_name` option (Python) / `permissionPromptToolName` (TS) lets you redirect approvals to a named MCP tool — chapter-worthy enterprise pattern; only briefly mentioned.
