---
source_url: https://platform.claude.com/docs/en/build-with-claude/streaming
canonical_url: https://platform.claude.com/docs/en/build-with-claude/streaming
source_title: Streaming messages
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: claude-api
tier: T1-official
cert_domains: [1, 4, 5]
cert_task_areas: ["Agentic loops", "Structured output via tool_use + JSON schemas", "Long-conversation context"]
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Streaming messages — SSE event taxonomy

## Key takeaways

- **Set `"stream": true`** on the Messages request to switch from a single JSON response to a Server-Sent Events stream.
- **Event flow**: `message_start` → (per content block: `content_block_start` → `content_block_delta*` → `content_block_stop`) → `message_delta*` → `message_stop`. **`ping` events** may appear anywhere. **`error` events** may interrupt mid-stream (e.g., `overloaded_error` ≈ HTTP 529).
- **Delta types on `content_block_delta`**:
  - `text_delta` — incremental text
  - `input_json_delta` — partial-JSON chunks for `tool_use` input (string deltas; final `input` is always an object)
  - `thinking_delta` — incremental thinking content
  - `signature_delta` — final encrypted signature for a thinking block (fires once, just before `content_block_stop`)
  - `citations_delta` — incremental citation pointers (one citation per delta)
- **Tool use streaming**: `input` arrives one key-value at a time; current models stream one key+value chunk pair before moving to the next. Use SDK helpers or partial-JSON libraries (e.g., Pydantic) to parse mid-stream. **Fine-grained tool streaming** is opt-in per tool via `eager_input_streaming`.
- **Thinking streaming**: with `display: "summarized"`, both `thinking_delta` and `signature_delta` fire. With `display: "omitted"`, **no `thinking_delta`** — only one `signature_delta` then `content_block_stop`. This is the time-to-first-text optimization.
- **`message_delta.usage` is cumulative**, not per-delta — important if you accumulate.
- **Batch API does not support streaming.** Use sync Messages API for streaming.
- **Error recovery (Claude 4.6+)**: capture partial response, then send a **user** message instructing continuation. On Claude 4.5 and earlier, the partial was placed in an **assistant** message. Tool-use and thinking blocks cannot be partially recovered; resume from the most recent text block.

## Quoted (citation-ready)

> "When creating a Message, you can set `"stream": true` to incrementally stream the response using server-sent events (SSE)."
>
> — Streaming messages, intro
>
> Anchor: `Streaming messages + When creating a Message, you can set "stream": true`

> "Each stream uses the following event flow: 1. `message_start`: contains a `Message` object with empty `content`. 2. A series of content blocks, each of which have a `content_block_start`, one or more `content_block_delta` events, and a `content_block_stop` event. Each content block has an `index` that corresponds to its index in the final Message `content` array. 3. One or more `message_delta` events, indicating top-level changes to the final `Message` object. 4. A final `message_stop` event."
>
> — Streaming messages, "Event types"
>
> Anchor: `Event types + Each stream uses the following event flow`

> "The deltas for `tool_use` content blocks correspond to updates for the `input` field of the block. To support maximum granularity, the deltas are partial JSON strings, whereas the final `tool_use.input` is always an object. You can accumulate the string deltas and parse the JSON once you receive a `content_block_stop` event."
>
> — Streaming messages, "Content block delta types" → "Input JSON delta"
>
> Anchor: `Input JSON delta + The deltas for tool_use content blocks correspond to updates`

> "When `display: "omitted"` is set on the thinking configuration, no `thinking_delta` events are sent. The thinking block opens, receives a single `signature_delta`, and closes."
>
> — Streaming messages, "Content block delta types" → "Thinking delta"
>
> Anchor: `Thinking delta + When display: "omitted" is set on the thinking configuration`

## Event reference

| Event | Carries | Notes |
|---|---|---|
| `message_start` | `Message` skeleton with empty `content` and initial `usage` | First event |
| `content_block_start` | `index`, `content_block` (initial shape — e.g. `{type:"text", text:""}` or `{type:"tool_use", id, name, input:{}}`) | One per content block |
| `content_block_delta` | `index`, `delta` (see delta types) | Many per block |
| `content_block_stop` | `index` | One per block |
| `message_delta` | `delta` (top-level `stop_reason`, `stop_sequence`), `usage` (cumulative) | One or more |
| `message_stop` | — | Final |
| `ping` | — | Anywhere |
| `error` | `error.type`, `error.message` | E.g. `overloaded_error` |

## Delta types

```sse
# text_delta
event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"ello frien"}}

# input_json_delta
event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"{\"location\": \"San Fra"}}

# thinking_delta
event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"thinking_delta","thinking":"I need to find the GCD..."}}

# signature_delta
event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"signature_delta","signature":"EqQBCgIYAhIM..."}}

# citations_delta
event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"citations_delta","citation":{"type":"char_location","cited_text":"...","document_index":0,"start_char_index":0,"end_char_index":36}}}
```

## SDK convenience patterns

- **Python**: `client.messages.stream(...)` context manager exposes `stream.text_stream` and `stream.get_final_message()`.
- **TypeScript**: `client.messages.stream({...}).on("text", ...)` plus `await stream.finalMessage()`.
- **Go**: `client.Messages.NewStreaming(...)` + `message.Accumulate(event)` to build the final `Message`.
- **Java**: `client.messages().createStreaming(...)` + `MessageAccumulator.create()` helper.
- **Ruby**: `.accumulated_message` on a stream object.
- **PHP**: iterate `createStream(...)` and accumulate manually.

## Streaming + tool use

`stop_reason: "tool_use"` arrives via the `message_delta` event. Each `tool_use` block streams its `input` as partial JSON; if you opt into `eager_input_streaming` on a tool, the JSON deltas are emitted at finer granularity (useful for long-tail parameter fields). See [[../03-advanced-tool-use/docs-define-tools]] for `eager_input_streaming`.

## Streaming + extended thinking

With adaptive or manual thinking, the first content block is `thinking`. Final `signature_delta` carries the encrypted thinking for the next-turn round trip. If a tool follows, normal `tool_use` streaming kicks in.

## Streaming + web search (server tool)

When a server tool runs server-side, you'll see `content_block_start` events for `server_tool_use` and a `web_search_tool_result` block (carrying the search response payload), inline with normal text deltas. See the docs page's full SSE sample for the multi-block sequence.

## Error recovery

| Model gen | Continuation pattern |
|---|---|
| Claude 4.5 and earlier | Resume by adding the partial response as the start of a new **assistant** message and continuing |
| Claude 4.6 and later | Resume by adding a **user** message with the partial content and an instruction to "continue from where you left off" |

Tool-use and thinking blocks cannot be partially recovered — resume from the most recent text block.

## Cross-references

- See [[docs-tool-use]] for the agentic loop the streaming events drive.
- See [[docs-adaptive-thinking]] and [[docs-extended-thinking]] for `thinking_delta` semantics and `display` behavior.
- See [[docs-citations]] for `citations_delta`.
- See [[docs-batch-api]] for the explicit "streaming is not supported in batch" caveat.
- See [[../03-advanced-tool-use/docs-define-tools]] for `eager_input_streaming` (fine-grained tool streaming).
- See `../../landscape-2026-05.md` §1.5 — listed as GA, confirmed here.

## Open questions / follow-ups

- **Fine-grained tool streaming** opt-in lives on tool definitions; behavior matrix per model not specified in the streaming doc itself — covered in advanced tool-use dossier.
- **`message_delta` cumulative usage** is flagged in a Warning but the cumulative-vs-delta semantics for `cache_creation_input_tokens` / `cache_read_input_tokens` aren't explicit. Verify before writing a token-meter chapter section.
- **Mid-stream `error` event handling** — docs say "your code should handle unknown event types gracefully" but no canonical retry/backoff guidance.
