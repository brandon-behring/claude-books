---
source_url: https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking
canonical_url: https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking
source_title: Adaptive thinking
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: claude-api
tier: T1-official
cert_domains: [1, 5]
cert_task_areas: ["Agentic loops", "Long-conversation context"]
volatility: fast-moving
verified: true
supersedes: []
superseded_by: []
---

# Adaptive thinking — Opus 4.7 / Sonnet 4.6 / Opus 4.6

## Key takeaways

- **Adaptive thinking is the recommended thinking mode** for Opus 4.7, Sonnet 4.6, and Opus 4.6. The model *decides* whether and how much to think per request; you guide via the `effort` parameter, not via `budget_tokens`.
- **On Opus 4.7, adaptive is the only mode**. Manual extended thinking (`thinking: {type: "enabled", budget_tokens: N}`) returns a **400 error**. On Sonnet 4.6 and Opus 4.6 the manual mode is still functional but **deprecated**.
- **Effort levels** are soft guidance:
  - `low` — Claude minimizes thinking; skips for simple tasks.
  - `medium` — moderate thinking; may skip very simple queries.
  - `high` (default) — Claude always thinks; deep reasoning on complex tasks.
  - `xhigh` — **Opus 4.7 only**; "always thinks deeply with extended exploration".
  - `max` — Claude always thinks with no constraints on depth. Available on Mythos Preview, Opus 4.7, Opus 4.6, Sonnet 4.6.
- **Interleaved thinking is automatic** in adaptive mode (Claude can think between tool calls). On manual-mode Sonnet 4.6 it requires the `interleaved-thinking-2025-05-14` beta header; on manual-mode Opus 4.6 it is **not available** at all — if you need inter-tool thinking on Opus 4.6, use adaptive.
- **Display defaults differ by model**: Opus 4.7 defaults to `display: "omitted"` (empty `thinking` field, signature only — faster TTFT); Opus 4.6 / Sonnet 4.6 default to `display: "summarized"`. Switching between `omitted` and `summarized` between turns is supported.
- **You are still billed for full thinking tokens**, regardless of display mode. Summary and omitted both reduce *visible* output, not *billed* output.
- **Cache breakpoints survive within-mode** (consecutive adaptive requests preserve cache), but **switching between `adaptive` and `enabled`/`disabled` breaks message-level cache** (system prompts and tool defs remain cached).
- **No beta header required** for adaptive thinking.

## Quoted (citation-ready)

> "Adaptive thinking is the recommended way to use [extended thinking] with Claude Opus 4.7, Claude Opus 4.6, and Claude Sonnet 4.6, and is the default mode on Claude Mythos Preview (where it auto-applies whenever `thinking` is unset). Instead of manually setting a thinking token budget, adaptive thinking lets Claude dynamically determine when and how much to use extended thinking based on the complexity of each request. On Claude Opus 4.7, adaptive thinking is the **only** supported thinking mode; manual `thinking: {type: "enabled", budget_tokens: N}` is no longer accepted."
>
> — Adaptive thinking, intro
>
> Anchor: `Adaptive thinking + Adaptive thinking is the recommended way to use`

> "In adaptive mode, thinking is optional for the model. Claude evaluates the complexity of each request and determines whether and how much to use extended thinking. At the default effort level (`high`), Claude almost always thinks. At lower effort levels, Claude may skip thinking for simpler problems."
>
> — Adaptive thinking, "How adaptive thinking works"
>
> Anchor: `How adaptive thinking works + In adaptive mode, thinking is optional for the model`

> "Adaptive thinking also automatically enables interleaved thinking. This means Claude can think between tool calls, making it especially effective for agentic workflows."
>
> — Adaptive thinking, "How adaptive thinking works"
>
> Anchor: `How adaptive thinking works + Adaptive thinking also automatically enables interleaved thinking`

> "Consecutive requests using `adaptive` thinking preserve prompt cache breakpoints. However, switching between `adaptive` and `enabled`/`disabled` thinking modes breaks cache breakpoints for messages. System prompts and tool definitions remain cached regardless of mode changes."
>
> — Adaptive thinking, "Important considerations" → "Prompt caching"
>
> Anchor: `Prompt caching + Consecutive requests using adaptive thinking preserve prompt cache breakpoints`

## API shape

Minimal Opus 4.7 request with adaptive thinking + medium effort:

```json
{
    "model": "claude-opus-4-7",
    "max_tokens": 16000,
    "thinking": { "type": "adaptive" },
    "output_config": { "effort": "medium" },
    "messages": [
        {"role": "user", "content": "What is the capital of France?"}
    ]
}
```

Streamed thinking arrives as `thinking_delta` events in the SSE stream (see [[docs-streaming]]). With `display: "omitted"` no `thinking_delta` events are emitted — only `signature_delta`.

## Modes comparison

| Mode | Config | Availability | When to use |
|---|---|---|---|
| Adaptive | `thinking: {type: "adaptive"}` | Mythos (default), Opus 4.7 (only mode), Opus 4.6, Sonnet 4.6 | Default for current models; model decides budget, guide with `effort` |
| Manual | `thinking: {type: "enabled", budget_tokens: N}` | All except Opus 4.7 (which 400s). Deprecated on Opus 4.6 + Sonnet 4.6 | When you need precise control over thinking spend |
| Disabled | omit `thinking` or `{type: "disabled"}` | All except Mythos | Lowest latency, no reasoning chain |

## Cost-control levers

- `max_tokens` is a **hard limit** on total output (thinking + text). Watch for `stop_reason: "max_tokens"` and raise the cap *or* lower effort.
- `effort` is **soft guidance**. Lower effort = more likely to skip thinking for simple turns.
- Prompt-based steering works ("Extended thinking adds latency and should only be used when it will meaningfully improve answer quality…") but **measure impact** — steering Claude to think less can hurt quality on reasoning-heavy workloads.

## Validation differences vs manual mode

- Previous assistant turns **don't need to start with a thinking block** under adaptive mode (unlike manual, which enforces it).
- If Claude skips thinking on a simple turn, **no thinking block is produced**, regardless of `display`.

## Cross-references

- See [[docs-extended-thinking]] for the legacy manual block API (Haiku 4.5 still requires it; Sonnet 4.6 still supports it).
- See [[docs-streaming]] for `thinking_delta` / `signature_delta` event semantics.
- See [[docs-tool-use]] for tool-use interaction: `tool_choice: "any"` and forced `tool` choice are incompatible with thinking; only `auto` and `none` work.
- See [[../03-advanced-tool-use/docs-programmatic-tool-calling]] — PTC composes with adaptive thinking; Claude can think between PTC code-block executions.
- See `../../landscape-2026-05.md` §1.1 for the high-level note on the "new `xhigh` effort level" landing with Opus 4.7.

## Open questions / follow-ups

- **April 23 postmortem** (in landscape doc §6.1) documents a default-effort regression where `high` → `medium` was reverted. Adaptive's *recommended default* is now `xhigh` for Opus 4.7 and `high` for others — confirm this remains in May/Jun 2026 by checking the postmortem's followup notes.
- **Effort + caching interaction**: effort change does not break caching (it's an `output_config` field), but no explicit "effort changes preserve cache" sentence exists in the docs — verified empirically by some teams (uncited).
- **Mythos Preview specifics** (e.g., "summarizes from the first token, no verbose preamble") are unverifiable without access.
