---
source_url: https://code.claude.com/docs/en/agent-sdk/agent-loop
canonical_url: https://code.claude.com/docs/en/agent-sdk/agent-loop
source_title: How the agent loop works
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: agent-sdk
tier: T1-official
cert_domains: [1, 5]
cert_task_areas: ["Agentic loops", "Long-conversation context", "Large-codebase context"]
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Agent loop — the canonical execution model

The doc page that walks through what happens inside `query()`. Required reading for any chapter that uses the words "stop_reason", "tool result", "turn", "compaction", or "ResultMessage". Pair with [[docs-overview]] for the framing and [[docs-hooks-reference]] for the intercept points.

## Key takeaways

- **Five-step loop**:
  1. **Receive prompt** — SDK yields a `SystemMessage` with `subtype: "init"` carrying session metadata.
  2. **Evaluate and respond** — Claude responds with text and/or tool calls; SDK yields an `AssistantMessage`.
  3. **Execute tools** — SDK runs requested tools and feeds results back. Hooks can intercept before tools run.
  4. **Repeat** — Steps 2-3 are one **turn**. The loop continues until Claude produces output with no tool calls.
  5. **Return result** — final `AssistantMessage` (text-only) followed by `ResultMessage` (final text + usage + cost + session ID).
- **A turn counts only tool-use round trips.** Text-only final responses don't count against `max_turns`. The page's example: 4-turn session = 3 tool-use turns + 1 final text response. `max_turns=2` would have stopped before the final edit step.
- **Two budgets**: `max_turns` (turn count) and `max_budget_usd` (client-side cost estimate). Hit either → `ResultMessage.subtype` becomes `error_max_turns` or `error_max_budget_usd`.
- **Five core message types**: `SystemMessage`, `AssistantMessage`, `UserMessage`, `StreamEvent` (partial-message mode only), `ResultMessage`. TS yields additional observability events (hook events, tool progress, rate limits, task notifications) but those aren't required to drive the loop.
- **The result subtype is the termination indicator** (always check before reading `.result`):
  | Subtype | Meaning | `.result` populated? |
  |---|---|---|
  | `success` | Normal finish | yes |
  | `error_max_turns` | Hit `maxTurns` | no |
  | `error_max_budget_usd` | Hit `maxBudgetUsd` | no |
  | `error_during_execution` | API/cancellation error | no |
  | `error_max_structured_output_retries` | JSON Schema validation failed after retry limit | no |
- **Context window is cumulative within a session.** System prompt, tool definitions, CLAUDE.md, conversation history, tool inputs/outputs all accumulate. Prompt caching covers the static prefix (system prompt + tool defs + CLAUDE.md) — first request pays full price, subsequent requests cheap.
- **Automatic compaction** triggers near the context limit. Emits `SystemMessage` with `subtype: "compact_boundary"` (Python) or a separate `SDKCompactBoundaryMessage` (TS). The `PreCompact` hook receives a `trigger` field (`manual` or `auto`).
- **`stop_reason`** on `ResultMessage`: `end_turn` (normal), `max_tokens` (output budget), `refusal` (model declined). On error subtypes, `stop_reason` carries the value from the last assistant response.

## Quoted (citation-ready)

> "The Agent SDK lets you embed Claude Code's autonomous agent loop in your own applications."
>
> — How the agent loop works, opening paragraph
>
> Anchor: `How the agent loop works + The Agent SDK lets you embed`

> "A turn is one round trip inside the loop: Claude produces output that includes tool calls, the SDK executes those tools, and the results feed back to Claude automatically. This happens without yielding control back to your code. Turns continue until Claude produces output with no tool calls, at which point the loop ends and the final result is delivered."
>
> — How the agent loop works, Turns and messages
>
> Anchor: `Turns and messages + A turn is one round trip`

> "Compaction replaces older messages with a summary, so specific instructions from early in the conversation may not be preserved. Persistent rules belong in CLAUDE.md (loaded via settingSources) rather than in the initial prompt, because CLAUDE.md content is re-injected on every request."
>
> — How the agent loop works, Automatic compaction
>
> Anchor: `Automatic compaction + Compaction replaces older messages`

## Effort levels (chapter-worthy table)

| Level | Behavior | Good for |
|---|---|---|
| `low` | Minimal reasoning, fast responses | File lookups, listing directories |
| `medium` | Balanced reasoning | Routine edits, standard tasks |
| `high` | Thorough analysis | Refactors, debugging |
| `xhigh` | Extended reasoning depth | Coding and agentic tasks; recommended on Opus 4.7 |
| `max` | Maximum reasoning depth | Multi-step problems requiring deep analysis |

**Defaults**: Python leaves `effort` unset (defers to model default). TypeScript defaults to `"high"`.

**Independence from extended thinking**: "`effort` trades latency and token cost for reasoning depth within each response. Extended thinking is a separate feature that produces visible chain-of-thought blocks in the output. They are independent: you can set `effort: "low"` with extended thinking enabled, or `effort: "max"` without it."

## Permission modes (referenced; see [[docs-permissions]] for full)

| Mode | Behavior |
|---|---|
| `default` | Tools not covered by allow rules trigger your approval callback; no callback means deny |
| `acceptEdits` | Auto-approves file edits + filesystem commands (`mkdir`, `touch`, `mv`, `cp`, etc.); other Bash follows default rules |
| `plan` | Read-only tools run; produces a plan without editing source files |
| `dontAsk` | Never prompts; pre-approved by rules run, everything else denied |
| `auto` (TS only) | Model-classifier approves/denies each call |
| `bypassPermissions` | Runs all allowed tools without asking. Cannot run as root on Unix. |

## Context-consumers table (very useful for chapters)

| Source | When it loads | Impact |
|---|---|---|
| System prompt | Every request | Small fixed cost, always present |
| CLAUDE.md files | Session start (via `settingSources`) | Full content in every request (but prompt-cached) |
| Tool definitions | Every request; MCP schemas deferred by default | Built-in tool schemas every request; Tool Search defers MCP schemas (falls back to upfront on Vertex AI or non-first-party `ANTHROPIC_BASE_URL`) |
| Conversation history | Accumulates over turns | Grows with each turn: prompts, responses, tool inputs/outputs |
| Skill descriptions | Session start (via setting sources) | Short summaries; full content loads only when invoked |

## Compaction-customization recipes

Three knobs:

1. **CLAUDE.md "Summary instructions" section** — the compactor reads CLAUDE.md like any other context; add a section describing what to preserve. The section header is free-form (not a magic string); the compactor matches on intent.
2. **`PreCompact` hook** — runs before compaction (e.g., to archive transcript). Receives `trigger: "manual" | "auto"`.
3. **Manual compaction** — send `/compact` as a prompt string to trigger compaction on demand. Slash commands sent through `query()` are SDK inputs, not CLI-only shortcuts.

## "Put it all together" reference example (Python)

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage

async def run_agent():
    session_id = None
    async for message in query(
        prompt="Find and fix the bug causing test failures in the auth module",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Bash", "Glob", "Grep"],
            setting_sources=["project"],
            max_turns=30,
            effort="high",
        ),
    ):
        if isinstance(message, ResultMessage):
            session_id = message.session_id
            if message.subtype == "success":
                print(f"Done: {message.result}")
            elif message.subtype == "error_max_turns":
                print(f"Hit turn limit. Resume session {session_id} to continue.")
            elif message.subtype == "error_max_budget_usd":
                print("Hit budget limit.")
            else:
                print(f"Stopped: {message.subtype}")
            if message.total_cost_usd is not None:
                print(f"Cost: ${message.total_cost_usd:.4f}")

asyncio.run(run_agent())
```

## Cross-references

- See [[docs-overview]] for the SDK's position relative to Client SDK / CLI / Managed Agents.
- See [[docs-permissions]] for the full 5-step permission evaluation.
- See [[docs-hooks-reference]] for the intercept points and decision precedence.
- See [[docs-sessions]] for resume / fork mechanics that pick up where the loop ended.
- See [[docs-structured-outputs]] for `outputFormat` and `error_max_structured_output_retries`.
- See [[03-advanced-tool-use/blog-tool-search-tool]] for the MCP-tool-deferred-loading optimization.

## Open questions / follow-ups

- "**Token usage explains 80% of performance variance** in web-browsing evals" is from the multi-agent research blog post, not this page — chapters that cite agent-loop cost should ground in the per-feature context-costs link this page mentions (`/en/features-overview#understand-context-costs`).
- The page references `/en/agent-sdk/streaming-output` and `/en/agent-sdk/streaming-vs-single-mode` for streaming details — defer to `09-headless-ci/` dossier or a follow-up note.
- "Custom tools default to sequential execution. To enable parallel execution for a custom tool, set `readOnlyHint` in its annotations." — chapter authors may want to A/B that hint's effect; not benchmarked here.
