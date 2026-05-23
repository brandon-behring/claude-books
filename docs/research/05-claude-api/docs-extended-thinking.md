---
source_url: https://platform.claude.com/docs/en/build-with-claude/extended-thinking
canonical_url: https://platform.claude.com/docs/en/build-with-claude/extended-thinking
source_title: Extended thinking
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: claude-api
tier: T1-official
cert_domains: [1, 5]
cert_task_areas: ["Agentic loops", "Long-conversation context"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Extended thinking (legacy block API) — Sonnet 4.6 + Haiku 4.5

## Key takeaways

- **Manual extended thinking** uses `thinking: {type: "enabled", budget_tokens: N}` to set an explicit token budget Claude may consume for internal reasoning, producing one or more `thinking` content blocks before the text response.
- **Opus 4.7 does NOT support this API** and returns a 400 error — use [[docs-adaptive-thinking]] instead.
- **Sonnet 4.6 supports manual but it is deprecated**; Anthropic recommends adaptive thinking on Sonnet 4.6 and Opus 4.6. Manual remains the **only option on Haiku 4.5**.
- **`budget_tokens` constrains the thinking step itself**, not the output text; it must be less than `max_tokens`, and cannot combine with `max_tokens: 0` (cache pre-warming).
- **Tool use with manual thinking restricts `tool_choice`** to `"auto"` (default) or `"none"`. `"any"` and forced `{"type": "tool", ...}` are incompatible because they force a call, which contradicts the thinking-first contract.
- **Thinking blocks must be passed back into the next turn** when continuing a tool-use loop. Skipping them risks the model losing the thread (and on Opus 4.5+ / Sonnet 4.6+, the server keeps them in context across turns by default; earlier Opus/Sonnet + all Haiku models strip them).
- **`signature` field is encrypted full thinking**, used for round-trip integrity verification. Opaque; do not parse; portable across Claude API / Bedrock / Vertex.
- **Summarized vs omitted display**: summarized is the default on Claude 4 models *except* Opus 4.7 / Mythos (which default to omitted). You are billed for full thinking tokens in either case.

## Quoted (citation-ready)

> "The `budget_tokens` parameter determines the maximum number of tokens Claude is allowed to use for its internal reasoning process. This limit applies to full thinking tokens, not to the summarized output. Larger budgets can improve response quality by enabling more thorough analysis for complex problems, although Claude may not use the entire budget allocated, especially at ranges above 32k."
>
> — Extended thinking, "Key parameters"
>
> Anchor: `Key parameters + The budget_tokens parameter determines the maximum number of tokens`

> "Tool use with thinking only supports `tool_choice: {"type": "auto"}` (the default) or `tool_choice: {"type": "none"}`. Using `tool_choice: {"type": "any"}` or `tool_choice: {"type": "tool", "name": "..."}` will result in an error because these options force tool use, which is incompatible with extended thinking."
>
> — Extended thinking, "Tool use integration" → "Tool choice limitations"
>
> Anchor: `Tool choice limitations + Tool use with thinking only supports tool_choice`

> "For Claude Opus 4.7, use adaptive thinking (`thinking: {type: "adaptive"}`) with the effort parameter. Manual extended thinking (`thinking: {type: "enabled", budget_tokens: N}`) is no longer supported on Claude Opus 4.7 and returns a 400 error."
>
> — Extended thinking, supported-models callout
>
> Anchor: `Supported models + For Claude Opus 4.7, use adaptive thinking`

## API shape (manual mode)

```json
{
    "model": "claude-sonnet-4-6",
    "max_tokens": 16000,
    "thinking": {
        "type": "enabled",
        "budget_tokens": 10000,
        "display": "summarized"
    },
    "messages": [{"role": "user", "content": "Show step by step..."}]
}
```

Response contains a `thinking` content block before the `text` block:

```json
{
  "content": [
    {"type": "thinking", "thinking": "Let me analyze...", "signature": "WaUjzkyp..."},
    {"type": "text", "text": "Based on my analysis..."}
  ]
}
```

## Tool-use round trip (manual mode)

On a tool-using turn, Claude responds with `thinking`, `tool_use`, optional text. The next user turn must carry the `thinking` block **back** alongside the `tool_use`+`tool_result`:

```python
continuation = client.messages.create(
    model="claude-sonnet-4-6",
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[
        {"role": "user", "content": "What's the weather in Paris?"},
        {"role": "assistant", "content": [thinking_block, tool_use_block]},
        {"role": "user", "content": [
            {"type": "tool_result", "tool_use_id": tool_use_block.id, "content": "88°F"}
        ]},
    ],
)
```

## Cache + thinking interactions

- **System prompts**: remain cached even when thinking parameters change.
- **Message-level cache**: invalidated when `budget_tokens` changes, when mode toggles between `enabled` and `disabled`, **and** when toggling between `enabled` and `adaptive`.
- **Thinking blocks are themselves cacheable** and count as input tokens when read from cache.

## Streaming with extended thinking

Thinking content streams via `thinking_delta` events inside `content_block_delta` events on a `thinking` content block; just before `content_block_stop`, a `signature_delta` arrives carrying the encrypted full thinking. With `display: "omitted"`, no `thinking_delta` events fire — only `signature_delta`. See [[docs-streaming]] for the full event taxonomy.

## Cross-references

- See [[docs-adaptive-thinking]] for the recommended modern path; this note is for legacy + Haiku 4.5.
- See [[docs-models-overview]] for which models support which mode.
- See [[docs-streaming]] for `thinking_delta` / `signature_delta` event details.
- See [[docs-tool-use]] for the broader tool-use overview; the `tool_choice` restriction here is critical for designing agentic loops on Sonnet 4.6.
- See `../../landscape-2026-05.md` §1.5 for the marketing-level distinction; this note is the API contract.

## Open questions / follow-ups

- **April 23 postmortem (Bug 2)**: the `clear_thinking_20251015` header had a bug clearing thinking blocks every turn instead of once, fixed in v2.1.101. Not relevant to current API contract but historically interesting for reliability chapters.
- **Haiku 4.5 deprecation timeline for extended thinking**: not stated. Given Sonnet 4.6 + Opus 4.6 are deprecated for manual, Haiku 4.5 may follow when a Haiku-class adaptive model ships.
- **Cross-platform `signature` portability** stated as "compatible across Claude APIs, Bedrock, and Vertex AI" — verify no Mistral Foundry caveat.
