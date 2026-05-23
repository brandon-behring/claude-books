# Claude Agent SDK — research dossier

Primary-source research cache for the **Claude Agent SDK** (Python + TypeScript). This dossier underpins handbook material on the SDK and architect-reference material on agentic-loop architecture, subagent design, hook lifecycles, and structured output.

**Snapshot**: 2026-05-22. Refresh when (a) a new SDK release changes the public surface materially (TS jumped from 0.2.x to 0.3.142 inside three months — expect more), (b) the 2026-06-15 "Agent SDK credit" billing change activates, or (c) the MCP RC 2026-07-28 lands and the `mcp_servers` / `.mcp.json` schemas shift.

## Topic summary

The Claude Agent SDK is the **library form of Claude Code** — the same agent loop, built-in tools, hooks, subagents, MCP integration, and session model, but programmable from Python or TypeScript instead of driven from a terminal. It exists at one level below Managed Agents (Anthropic-hosted REST API) and one level above the Anthropic Client SDK (raw API with you-implement-the-tool-loop).

The SDK was **renamed from "Claude Code SDK" to "Claude Agent SDK"** to reflect its broader agentic scope. Python ships as `claude-agent-sdk` (v0.2.86, 2026-05-22, MIT); TypeScript ships as `@anthropic-ai/claude-agent-sdk` (v0.3.149, 2026-05-22) with a **bundled Claude Code binary**.

Key surfaces, in approximate order of chapter relevance:

1. **`query()` entry point** (both SDKs) — async generator that drives the agent loop. Python supplements it with `ClaudeSDKClient` for multi-turn convenience.
2. **`ClaudeAgentOptions` / `Options`** — a ~40-field configuration object. Critical fields: `allowed_tools`/`disallowed_tools`, `hooks`, `agents`, `mcp_servers`, `permission_mode`, `resume`/`fork_session`, `setting_sources`, `system_prompt`, `output_format`, `max_turns`/`max_budget_usd`.
3. **Five-step permission evaluation** — Hooks → Deny rules → Permission mode → Allow rules → `canUseTool` callback. Six modes: `default | acceptEdits | plan | dontAsk | bypassPermissions | auto (TS-only)`.
4. **Hooks** — 10 events in Python, 19 in TypeScript. Lifecycle decision precedence: `deny > defer > ask > allow`. Filesystem hooks (from `settings.json`) and programmatic hooks (callbacks in `query()`) run side-by-side.
5. **Subagents** — programmatic `AgentDefinition` with the `agents` option, invoked via the `Agent` tool (formerly `Task`). Isolated context windows; only the Agent tool's prompt crosses parent → subagent. Subagents cannot spawn subagents.
6. **MCP integration** — four transport types (`stdio`, `sse`, `http`, `sdk`). MCP tools named `mcp__<server>__<action>`. Tool Search defers MCP schemas by default to preserve context.
7. **Sessions** — JSONL on disk at `~/.claude/projects/<encoded-cwd>/<session-id>.jsonl`. `continue` / `resume` / `fork_session` to navigate.
8. **Filesystem features via `settingSources`** — CLAUDE.md, skills, hooks, `.claude/rules/`, `.mcp.json`. Default loads `user` + `project` + `local`; empty array opts out for multi-tenant.
9. **System prompts** — minimal default (≠ `claude -p` CLI), `claude_code` preset (+ `append`), or custom. `excludeDynamicSections: true` enables cross-session prompt-cache reuse.
10. **Structured output** — `outputFormat: { type: "json_schema", schema }`. Validated data on `ResultMessage.structured_output`; failure produces `error_max_structured_output_retries` subtype.

The TypeScript SDK's experimental V2 session API (`createSession()` / `send()` / `stream()`) was **removed in v0.3.142**; current code should not use it.

## Table of notes

| File | Source tier | What it covers |
|---|---|---|
| [`docs-overview.md`](./docs-overview.md) | T1 | Top-level entry point; package names; auth env vars; product positioning vs Client SDK / CLI / Managed Agents; the 2026-06-15 Agent SDK credit change |
| [`docs-quickstart.md`](./docs-quickstart.md) | T1 | Install + API key + bug-fixing agent; tool / permission-mode quick-pick tables; Opus 4.7 troubleshooting |
| [`docs-python-reference.md`](./docs-python-reference.md) | T1 | Full Python API: `query()` signature, `ClaudeSDKClient`, every `ClaudeAgentOptions` field, message types, type unions |
| [`docs-typescript-reference.md`](./docs-typescript-reference.md) | T1 | Full TS API: `query()` + `startup()`, `Query` interface (17 control methods), every `Options` field, env-var timeouts |
| [`docs-typescript-v2-preview-removed.md`](./docs-typescript-v2-preview-removed.md) | T1 | V2 `send()`/`stream()` API — removed in v0.3.142; migration cheat sheet |
| [`docs-agent-loop.md`](./docs-agent-loop.md) | T1 | The five-step loop, turns vs messages, effort levels, context-consumers table, automatic compaction |
| [`docs-builtin-tools.md`](./docs-builtin-tools.md) | T1 | Inventory of 13+ built-in tools (Read, Write, Edit, Bash, Monitor, Glob, Grep, WebSearch, WebFetch, ToolSearch, Agent, Skill, AskUserQuestion, TaskCreate, TaskUpdate); Task→Agent rename note |
| [`docs-hooks-reference.md`](./docs-hooks-reference.md) | T1 | Every hook event with Python/TS parity (Python: 10; TS: 19); lifecycle order; matcher syntax; async output mode; decision precedence |
| [`docs-subagents.md`](./docs-subagents.md) | T1 | `AgentDefinition` schema, the Agent tool / Task-renaming compat, isolated-context channels, resume mechanics |
| [`docs-sessions.md`](./docs-sessions.md) | T1 | JSONL storage path, `continue`/`resume`/`fork`, cross-host resume strategies, `SessionStore` adapter (alpha) |
| [`docs-mcp.md`](./docs-mcp.md) | T1 | Four MCP transports (`stdio`/`sse`/`http`/`sdk`); `mcp__server__action` naming; `allowedTools` wildcard pattern |
| [`docs-permissions.md`](./docs-permissions.md) | T1 | Six modes; five-step evaluation order; scoped vs bare-name deny rules; `bypassPermissions` gotchas |
| [`docs-claude-code-features.md`](./docs-claude-code-features.md) | T1 | `settingSources` mechanics; what each source loads; multi-tenant isolation warning; CLAUDE.md load levels |
| [`docs-skills.md`](./docs-skills.md) | T1 | Filesystem-only skills; `skills` option as a context filter, not a sandbox; lazy-loading |
| [`docs-system-prompts.md`](./docs-system-prompts.md) | T1 | Preset vs append vs custom; `excludeDynamicSections` for cache reuse; output styles (`keep-coding-instructions`) |
| [`docs-user-input.md`](./docs-user-input.md) | T1 | `canUseTool` callback; six response patterns; `AskUserQuestion` schema; `PermissionRequest` hook for external notifications |
| [`docs-structured-outputs.md`](./docs-structured-outputs.md) | T1 | `outputFormat` JSON Schema; Zod / Pydantic helpers; `error_max_structured_output_retries` subtype |
| [`github-claude-agent-sdk-python.md`](./github-claude-agent-sdk-python.md) | T2 | Python package metadata (v0.2.86); MIT license; bundled CLI; daily release cadence |
| [`github-claude-agent-sdk-typescript.md`](./github-claude-agent-sdk-typescript.md) | T2 | TS package metadata (v0.3.149); version-jump anomaly (0.2.x → 0.3.142); bundled binary; daily release cadence |

## Cert task areas covered

This dossier is structured around the D1 and D2 cert task areas (per `docs/cert-coverage.md`):

### Domain 1 (Agentic Architecture & Orchestration, 27%)

| Task area | Note(s) |
|---|---|
| **Agentic loops** (`stop_reason`, tool result handling) | [[docs-agent-loop]] is the canonical note; [[docs-overview]] frames the loop relative to other Claude products |
| **Coordinator-subagent patterns** (hub-and-spoke, isolated context) | [[docs-subagents]] (the SDK's implementation); references `docs/landscape-2026-05.md` §5.1 for the canonical pattern |
| **Subagent invocation** (`Task`/`Agent` tool, `allowedTools`, `AgentDefinition`) | [[docs-subagents]] with the Task→Agent renaming gotcha; [[docs-builtin-tools]] for the tool's place in the inventory |
| **Multi-step workflows** | [[docs-agent-loop]] (turns), [[docs-subagents]] (parent → subagent prompt-passing), [[docs-structured-outputs]] (validated end-state) |
| **Agent SDK hooks** (`PostToolUse`, tool interception, normalization) | [[docs-hooks-reference]] with full event list and Python/TS parity |
| **Task decomposition** (sequential vs adaptive) | [[docs-subagents]] (factory-pattern subagent creation), [[docs-builtin-tools]] (`TaskCreate`/`TaskUpdate` for background tasks) |
| **Session state** (`--resume`, `fork_session`, scratchpads) | [[docs-sessions]] (canonical); [[docs-subagents]] for subagent-specific resume; [[docs-claude-code-features]] for CLAUDE.md scratchpad |

### Domain 2 (Tool Design & MCP Integration, 18%)

| Task area | Note(s) |
|---|---|
| **Effective tool interfaces** (descriptions, boundaries, naming) | [[docs-builtin-tools]] for the inventory; [[docs-mcp]] for the `mcp__server__action` convention; [[03-advanced-tool-use/docs-tool-interface-design]] for the broader principles |
| **Structured error responses** (`isError`, retryability) | [[docs-hooks-reference]] (`PostToolUseFailure`), [[docs-structured-outputs]] (`error_max_structured_output_retries`) |
| **Tool distribution + `tool_choice`** | Partial coverage via [[docs-permissions]] (`allowed_tools`/`disallowed_tools` is the SDK's distribution mechanism); deeper in `03-advanced-tool-use/` |
| **MCP server config** (`.mcp.json` vs programmatic, env-var expansion) | [[docs-mcp]] is the canonical note; [[docs-claude-code-features]] for `settingSources`-driven `.mcp.json` loading |
| **Built-in tools** (Read, Write, Edit, Bash, Grep, Glob) | [[docs-builtin-tools]] |

### Cross-domain coverage

- **D3 Claude Code Configuration**: [[docs-claude-code-features]] is the bridge — `settingSources` is the SDK's view of the CLI's settings hierarchy. [[docs-system-prompts]] covers CLAUDE.md, output styles.
- **D4 Prompt Engineering & Structured Output**: [[docs-structured-outputs]] is the structured-output canonical note; [[docs-system-prompts]] for prompt-engineering knobs.
- **D5 Context Management & Reliability**: [[docs-agent-loop]] (compaction, context-consumers table), [[docs-system-prompts]] (`excludeDynamicSections` cache-reuse), [[docs-sessions]] (durable state).

## Headline numbers to carry into chapters

| Claim | Source |
|---|---|
| Python SDK current release: **v0.2.86** (2026-05-22, MIT, 7,014 stars) | [[github-claude-agent-sdk-python]] |
| TypeScript SDK current release: **v0.3.149** (2026-05-22, 1,454 stars) | [[github-claude-agent-sdk-typescript]] |
| Python supports **10 hook events**; TypeScript supports **19** | [[docs-hooks-reference]] |
| TS version-jump: 0.2.x → **0.3.142** removed the V2 session API | [[docs-typescript-v2-preview-removed]] |
| Agent SDK credit billing starts **2026-06-15** (separate from interactive limits) | [[docs-overview]] |
| Five-step permission evaluation; deny precedence: **deny > defer > ask > allow** | [[docs-permissions]], [[docs-hooks-reference]] |
| Hook decision precedence is enforced regardless of permission mode (deny rules even override `bypassPermissions`) | [[docs-permissions]] |
| Subagents do NOT inherit parent permissions; must pre-approve `Agent` tool in `allowedTools` | [[docs-subagents]] |
| Task→Agent tool rename in Claude Code v2.1.63; check both names in `block.name` filters | [[docs-subagents]] |
| Six permission modes; `auto` is **TypeScript-only** | [[docs-permissions]] |
| Sessions persist to `~/.claude/projects/<encoded-cwd>/<session-id>.jsonl` (replace non-alphanumerics with `-`) | [[docs-sessions]] |
| MCP tool naming: `mcp__<server>__<tool>`; wildcards work in `allowedTools` | [[docs-mcp]] |
| Default `effort` differs: Python defers to model, **TypeScript defaults to `"high"`** | [[docs-typescript-reference]], [[docs-agent-loop]] |

## Anti-patterns flagged for chapter authors

- **Don't** confuse `ClaudeAgentOptions` (snake_case in Python) with `AgentDefinition` (camelCase in Python) — both Python types but different naming conventions.
- **Don't** quote the landscape doc's "10 hooks" without checking [[docs-hooks-reference]] — the count is **Python: 10, TS: 19**, and the doc page has the canonical event list.
- **Don't** assume `allowed_tools=["Read"]` constrains `bypassPermissions` — it doesn't. Use `disallowed_tools` for hard blocks.
- **Don't** assume `bypassPermissions` covers MCP — `acceptEdits` definitely doesn't auto-approve MCP tools; even `bypassPermissions` is unnecessarily broad. Use `mcp__server__*` wildcards in `allowedTools` instead.
- **Don't** code against V2 `unstable_v2_createSession` — removed in v0.3.142. Migrate to V1 `query()` with session options.
- **Don't** rely on default `query()` options for multi-tenant isolation — set `settingSources: []` AND `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` AND run each tenant in its own filesystem.
- **Don't** filter `tool_use` blocks on just `"Task"` OR just `"Agent"` — current SDK releases mix the two (the system:init tools list and `permission_denials[].tool_name` still use `"Task"`, but live `tool_use` blocks emit `"Agent"`). Check both.

## Open questions / verification follow-ups

Aggregated from the per-note "Open questions" sections:

1. **Agent SDK credit value**: the 2026-06-15 billing change announces a "separate monthly Agent SDK credit allotment" but neither the overview page nor the linked support article (which we did not fetch) specifies the dollar / token value. Track the support article.
2. **`v0.2.111` reference in Quickstart troubleshooting**: as of 2026-05-22 the latest Python tag is `v0.2.86`. Either v0.2.111 is forward-looking or the doc is slightly out of sync. Verify on next release.
3. **Sandbox / SandboxSettings**: the `sandbox` field on options is referenced but the schema isn't on the Python/TS reference pages — defer to `/en/agent-sdk/sandbox` (and possibly `09-headless-ci/` dossier).
4. **`SessionStore` adapter** (alpha) for cross-host resume — defer to `09-headless-ci/`.
5. **Background subagents** (`background: true`) lifecycle — not fully documented on [[docs-subagents]]. Search TS message-union types (`SDKTaskStartedMessage`, `SDKTaskNotificationMessage`) for the answer.
6. **TS-only hooks** (`PostToolBatch`, `Setup`, `TeammateIdle`, `TaskCompleted`, `ConfigChange`, `WorktreeCreate`, `WorktreeRemove`) — Python parity is a CHANGELOG-tracking job.
7. **`auto` permission mode** classifier details — defer to `/en/permission-modes#eliminate-prompts-with-auto-mode` for chapter authors who lean on it.
8. **Output styles in Python**: the SDK lacks a programmatic switch — `Options.settings.outputStyle` is TS-only. Chapter authors targeting Python should rely on `append` or custom strings.
9. **`AskUserQuestion` HTML preview sanitization** — minimal (rejects `<script>`/`<style>`/`<!DOCTYPE>`). Chapter material that surfaces previews in a browser should warn readers to additionally sanitize.
10. **MCP RC 2026-07-28 interaction**: when the new MCP spec goes final (stateless handshake, deprecated Sampling/Roots/Logging), the `mcp_servers` schema and Tool Search semantics may shift. Cross-check at RC final and refresh [[docs-mcp]].
