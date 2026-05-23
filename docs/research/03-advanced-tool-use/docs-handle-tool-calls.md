---
source_url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls
canonical_url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls
source_title: Handle tool calls
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: advanced-tool-use
tier: T1-official
cert_domains: [2, 5]
cert_task_areas: ["Structured error responses", "Effective tool interfaces", "Error propagation across multi-agent systems"]
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Handle tool calls — agentic loop, is_error, retries

The API reference for the *response side* of the tool-use contract: parsing `tool_use` blocks, formatting `tool_result` blocks, and signaling failures with `is_error`. The primary citation for the architect-reference chapter on structured error responses.

## Key takeaways

- The agentic-loop response shape: `stop_reason: "tool_use"` plus one-or-more `tool_use` content blocks, each with `id`, `name`, and `input` (matching the tool's `input_schema`).
- The host extracts the `tool_use`, runs the tool, and replies in a single `user` message containing one or more `tool_result` blocks. **Critical formatting**: `tool_result` blocks must come **first** in the content array; text after is allowed but text before causes a 400 error.
- **`is_error: true`** is the canonical signal that a tool call failed. Claude incorporates the error into its next-turn reasoning and may retry — the page documents that "If a tool request is invalid or missing parameters, Claude will retry 2-3 times with corrections before apologizing to the user."
- **Tool result content can be**:
  - A plain string (`"15 degrees"`)
  - A list of nested content blocks (`[{"type": "text", "text": "..."}]`)
  - A list of document blocks (`[{"type": "document", ...}]`)
  - Images via the `image` block type
  - Empty (just `tool_use_id` with no `content`)
- **Server tools handle their own errors transparently** — the host never sees `is_error` blocks for server tools; Claude provides an alternative response or explanation. Web search has a documented error code set (`too_many_requests`, `invalid_input`, `max_uses_exceeded`, `query_too_long`, `unavailable`).
- The page directs readers to **Tool Runner** (SDK abstraction) for the automatic version of this loop; the manual flow is documented for the "custom control" case.

## The error-message principle (citation-ready)

The docs put a Tip box around the most important design principle in the page:

> "Write instructive error messages. Instead of generic errors like 'failed', include what went wrong and what Claude should try next, e.g., 'Rate limit exceeded. Retry after 60 seconds.' This gives Claude the context it needs to recover or adapt without guessing."
>
> — Handle tool calls, Tool execution error
>
> Anchor: `Tool execution error + Write instructive error messages`

This is the citation for "structured error responses" in the cert-coverage matrix — pair `is_error: true` with actionable error text, not opaque codes.

## Quoted (citation-ready)

> "Tool result blocks must immediately follow their corresponding tool use blocks in the message history. You cannot include any messages between the assistant's tool use message and the user's tool result message."
>
> — Handle tool calls, Important formatting requirements
>
> Anchor: `Important formatting requirements + Tool result blocks must immediately`

> "If a tool request is invalid or missing parameters, Claude will retry 2-3 times with corrections before apologizing to the user."
>
> — Handle tool calls, Invalid tool name
>
> Anchor: `Invalid tool name + If a tool request is invalid`

> "To eliminate invalid tool calls entirely, use strict tool use with strict: true on your tool definitions. This guarantees that tool inputs will always match your schema exactly, preventing missing parameters and type mismatches."
>
> — Handle tool calls, Invalid tool name Tip
>
> Anchor: `Invalid tool name Tip + To eliminate invalid tool calls`

## `tool_result` block shape reference

Successful result with text content:
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
  "content": "15 degrees"
}
```

Failed result with `is_error`:
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
  "content": "ConnectionError: the weather service API is not available (HTTP 500)",
  "is_error": true
}
```

Result with image:
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01...",
  "content": [
    {"type": "text", "text": "15 degrees"},
    {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": "..."}}
  ]
}
```

Result with document:
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01...",
  "content": [
    {"type": "text", "text": "The weather is"},
    {"type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "15 degrees"}}
  ]
}
```

## Three error categories (the page's taxonomy)

1. **Tool execution error** — your tool threw at runtime. Use `is_error: true` + actionable text.
2. **Invalid tool name / missing parameter** — Claude tried to call a tool with bad args. Use `is_error: true` + describe what was missing. Claude retries 2–3 times.
3. **Server tool error** — Anthropic's infrastructure handles these transparently; you don't return `is_error` for these. Web search and similar surface specific error codes you can observe in the response.

## Important formatting rules (chapter material)

The page documents two correctness rules that **must** appear in any chapter that teaches the agentic loop:

1. **Tool results immediately follow tool use**: no intervening messages between the assistant's tool-use message and the user's tool-result message.
2. **Tool_result blocks come first** in the user-message content array; any text comes **after**. Text-before-tool-result returns a 400 error.

The page makes this explicit with an annotated example showing the wrong vs right ordering.

## Cross-references

- See [[docs-define-tools]] for the request-side reference (defining tools, `tool_choice`).
- See [[docs-parallel-tool-use]] for how multiple `tool_use` blocks in one response must be handled in a single user message of `tool_result` blocks.
- See [[docs-tool-interface-design]] on actionable error responses as a core design principle.
- See [[blog-programmatic-tool-calling]] — programmatic tool calling adds a *stricter* formatting rule: when responding to a PTC tool call, the user message must contain *only* `tool_result` blocks, with no text content at all.

## Open questions / follow-ups

- Strict mode (`strict: true`) is repeatedly cross-referenced from this page; deserves its own dossier note if a future chapter goes deep on schema-guaranteed outputs.
- The "Claude retries 2-3 times" claim is operationally important but not parameterized in the API; presumably configurable via system-prompt instruction, but undocumented.
- The page does not address timeout behavior for *client* tools — how long does Claude wait for a response before treating it as failed? Presumably the underlying HTTP timeout dominates; worth confirming in a chapter on long-running tools.
