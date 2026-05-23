---
source_url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use
canonical_url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use
source_title: Parallel tool use
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: advanced-tool-use
tier: T1-official
cert_domains: [2, 1]
cert_task_areas: ["Tool distribution + tool_choice", "Effective tool interfaces"]
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Parallel tool use — execution semantics + disable_parallel_tool_use

How Claude emits multiple `tool_use` blocks in a single response and how the host handles them. Claude 4 models are parallel-capable by default; the page documents how to opt out, how to format the message history correctly, and how to maximize parallelism via prompting.

## Key takeaways

- **Default behavior** (Claude 4 models): Claude may emit multiple `tool_use` blocks in a single assistant turn whenever multiple independent operations are needed.
- **Execution semantics**: tool calls in a single assistant turn are **unordered** — the host can run them concurrently (`Promise.all`, `asyncio.gather`), sequentially, or in any order. Claude doesn't assume one call has completed before another. Dependent calls are issued across separate turns.
- **`disable_parallel_tool_use=true`** combined with:
  - `tool_choice: auto` → Claude uses **at most one** tool
  - `tool_choice: any` or `tool` → Claude uses **exactly one** tool
- **Critical message-history rule**: all `tool_result` blocks for a parallel-call turn must be in a **single user message**. Splitting them across multiple user messages "teaches" Claude to avoid parallel calls in future turns.
- The page provides two **system-prompt patterns** for maximizing parallelism, including a longer `<use_parallel_tool_calls>` block recommended when the default isn't sufficient.
- **`disable_parallel_tool_use` is not supported with Programmatic Tool Calling** (per [[docs-programmatic-tool-calling]] constraints section).

## Quoted (citation-ready)

> "Tool calls in a single assistant turn are unordered. You can run them concurrently (Promise.all, asyncio.gather), sequentially, or in any order. Claude doesn't assume one call in the batch has completed before another. Claude issues dependent calls across separate turns."
>
> — Parallel tool use, Execution semantics
>
> Anchor: `Execution semantics + Tool calls in a single assistant turn`

> "Claude might occasionally batch calls that turn out to depend on each other (for example, a create followed by an update of the same resource). You don't need to detect this in advance: dispatch all the calls, and if one fails because of a missing prerequisite, return the natural error message in a tool_result with is_error: true. Claude recognizes the dependency and reissues the call after the prerequisite completes."
>
> — Parallel tool use, Execution semantics
>
> Anchor: `Execution semantics + Claude might occasionally batch`

## Message-history wrong vs right (verbatim)

```jsonc
// Wrong — separate user messages reduce future parallel calls
[
  {"role": "assistant", "content": [tool_use_1, tool_use_2]},
  {"role": "user", "content": [tool_result_1]},
  {"role": "user", "content": [tool_result_2]}
]

// Correct — single user message preserves parallel-call behavior
[
  {"role": "assistant", "content": [tool_use_1, tool_use_2]},
  {"role": "user", "content": [tool_result_1, tool_result_2]}
]
```

This is the **single most common reason** parallel tool calls stop working in production code, per the troubleshooting section.

## Parallel-prompting system-prompt patterns

Short version (for Claude 4):

```text
For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
```

Strong version (recommended when default isn't enough):

```text
<use_parallel_tool_calls>
For maximum efficiency, whenever you perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially. Prioritize calling tools in parallel whenever possible. For example, when reading 3 files, run 3 tool calls in parallel to read all 3 files into context at the same time. When running multiple read-only commands like `ls` or `list_dir`, always run all of the commands in parallel. Err on the side of maximizing parallel tool calls rather than running too many tools sequentially.
</use_parallel_tool_calls>
```

## When dependent calls accidentally batch

The page's recommended pattern (cited above): just let the failure happen and return `is_error: true` with the natural error text. Don't switch to sequential execution preemptively. To reduce frequency, add to the system prompt: "Only batch tool calls that are independent of each other."

## Measuring parallel-call rate

The page suggests a simple metric:

```python
# Average tools per tool-calling message
tool_call_messages = [msg for msg in messages if any(b.type == "tool_use" for b in msg.content)]
total = sum(len([b for b in msg.content if b.type == "tool_use"]) for msg in tool_call_messages)
avg = total / len(tool_call_messages) if tool_call_messages else 0.0
# Should be > 1.0 if parallel calls are working
```

If `avg ≤ 1.0`, parallel calls are not being made — check message-history formatting first.

## Cross-references

- See [[docs-handle-tool-calls]] for the underlying single-call agentic-loop reference.
- See [[docs-define-tools]] for `tool_choice` modes that interact with `disable_parallel_tool_use`.
- See [[docs-programmatic-tool-calling]] — PTC is the **alternative** to parallel tool calls when you need orchestration across many tool calls. Choose one or the other; they don't compose (`disable_parallel_tool_use` is unsupported with PTC).
- See `docs/landscape-2026-05.md` §7.2 — "Required guardrails" mentions tool-permission scoping that interacts with parallelism in production.

## Open questions / follow-ups

- Whether Claude Opus 4.7's adaptive thinking influences parallel-call frequency is undocumented; intuition suggests adaptive thinking with a long budget might serialize more.
- The page doesn't address rate-limit considerations when 10+ tools execute concurrently against a downstream API — that's an integration concern, not a Claude-API one.
- The metric formula assumes all turns are tool-using; in mixed conversations this is fine but worth caveating in chapter drafts.
