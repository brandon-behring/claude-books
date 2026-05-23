---
source_url: https://code.claude.com/docs/en/agent-sdk/overview
canonical_url: https://code.claude.com/docs/en/agent-sdk/overview
source_title: Built-in tools (synthesized from Agent SDK overview + agent-loop)
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: agent-sdk
tier: T1-official
cert_domains: [2]
cert_task_areas: ["Built-in tools", "Effective tool interfaces"]
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Built-in tools available to SDK consumers

Synthesized from the overview "Capabilities → Built-in tools" tab and the agent-loop "Built-in tools" table. The two sources together enumerate the same 13+ named tools available to every SDK consumer by default.

## Key takeaways

- **The SDK ships ~13 built-in tools** out of the box, identical to those that power Claude Code. They fall into six categories.
- **Tool names are exact and case-sensitive** — they appear verbatim in `allowed_tools` / `allowedTools` lists and as `tool_use.name` blocks in messages.
- **The `Agent` tool replaced `Task`** in Claude Code v2.1.63 (per [[docs-subagents]]). Current SDK releases emit `"Agent"` in `tool_use` blocks but legacy code that filters on `"Task"` still works because the `system:init` tools list and `permission_denials[].tool_name` field continue to use `"Task"`.
- **`ToolSearch` is included in the agent-loop's tool table** as a discovery tool — Tool Search Tool from [[03-advanced-tool-use/blog-tool-search-tool]] is exposed inside the SDK via `Tools` preset; chapters can cite it without re-deriving.
- **No `Task` tool listed separately** — Task tool has been renamed; the orchestration tools are `Agent`, `Skill`, `AskUserQuestion`, `TaskCreate`, `TaskUpdate`.

## Quoted (citation-ready)

> "The SDK includes the same tools that power Claude Code."
>
> — Agent loop, Built-in tools section
>
> Anchor: `Built-in tools + The SDK includes the same tools that power Claude Code`

> "Everything that makes Claude Code powerful is available in the SDK."
>
> — Agent SDK overview, Capabilities section
>
> Anchor: `Capabilities + Everything that makes Claude Code powerful`

## Complete tool inventory

Combining the overview's "Built-in tools" table with the agent-loop's "Built-in tools" table:

| Category | Tool | What it does |
|---|---|---|
| **File operations** | `Read` | Read any file in the working directory |
| | `Write` | Create new files |
| | `Edit` | Make precise edits to existing files |
| **Search** | `Glob` | Find files by pattern (`**/*.ts`, `src/**/*.py`) |
| | `Grep` | Search file contents with regex |
| **Execution** | `Bash` | Run terminal commands, scripts, git operations |
| | `Monitor` | Watch a background script and react to each output line as an event |
| **Web** | `WebSearch` | Search the web for current information |
| | `WebFetch` | Fetch and parse web page content |
| **Discovery** | `ToolSearch` | Dynamically find and load tools on-demand instead of preloading all of them |
| **Orchestration** | `Agent` | Spawn subagents (formerly `Task`) |
| | `Skill` | Invoke skills declaratively |
| | `AskUserQuestion` | Ask the user clarifying questions with multiple-choice options |
| | `TaskCreate` | Create a background task |
| | `TaskUpdate` | Update a running task |

## Naming notes for chapter authors

- **MCP tool naming convention**: `mcp__<server-name>__<tool-name>`. For a server keyed `"playwright"` in `mcpServers`, its tools are `mcp__playwright__browser_screenshot`, `mcp__playwright__browser_click`, etc.
- **Tool aliases** (TS `Options.toolAliases`) let you remap a built-in name to an MCP tool — e.g., `{ Bash: 'mcp__workspace__bash' }` swaps the default `Bash` for a sandboxed MCP version.
- **`Agent` vs `Task`** dual emission: see [[docs-subagents]]. Always check both names if you maintain pre-v2.1.63-compatible code.

## Tool presets

Both SDKs accept `tools: { type: "preset", preset: "claude_code" }` (or the equivalent dict in Python) to load **the same tool list Claude Code uses**. This is the "give me everything" mode. Combined with `allowed_tools: []` (the default) it means every tool is *available* but each unlisted call still requires permission (per [[docs-permissions]]).

## Parallel execution semantics

From [[docs-agent-loop]]: "Read-only tools (like `Read`, `Glob`, `Grep`, and MCP tools marked as read-only) can run concurrently. Tools that modify state (like `Edit`, `Write`, and `Bash`) run sequentially to avoid conflicts. Custom tools default to sequential execution. To enable parallel execution for a custom tool, set `readOnlyHint` in its annotations."

## Cross-references

- See [[docs-subagents]] for the `Agent` tool's invocation semantics, the `parent_tool_use_id` field, and the Task→Agent renaming.
- See [[docs-mcp]] for MCP-tool naming and the `mcp__server__action` convention.
- See [[docs-user-input]] for the `AskUserQuestion` tool's input/output shape and the `questions` array schema.
- See [[03-advanced-tool-use/blog-tool-search-tool]] for the Tool Search engineering-blog narrative.
- See [[03-advanced-tool-use/docs-tool-search-tool]] for the Tool Search API reference (regex vs BM25).

## Open questions / follow-ups

- The `Monitor` tool is unusual — "Watch a background script and react to each output line as an event." Not documented in detail on either page. Worth a dedicated note if a chapter on observability needs it.
- `TaskCreate` / `TaskUpdate` semantics overlap with the deferred-tool-use `"defer"` permission decision and with background-subagent `background: true` — three different scheduling primitives. Worth a synthesis note in `06-multi-agent-patterns/`.
- The orchestration tools imply a richer "task graph" model than the docs describe in one place. Pull together when the Claude Managed Agents dossier (§5.3 landscape doc) gets its own entry.
