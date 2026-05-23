---
source_url: https://platform.claude.com/docs/en/about-claude/pricing
canonical_url: https://platform.claude.com/docs/en/about-claude/pricing
source_title: Pricing
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: claude-api
tier: T1-official
cert_domains: [2, 4, 5]
cert_task_areas: ["Batch processing (Message Batches API, custom_id, SLA matching)", "Structured output via tool_use + JSON schemas"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Claude API pricing — current rates & modifier stacks

## Key takeaways

- **Per-model base rates**: Opus 4.7 / Opus 4.6 / Opus 4.5 at $5 / $25 per MTok in/out; Sonnet 4.6 / 4.5 at $3 / $15; Haiku 4.5 at $1 / $5. Opus 4.1 + deprecated Opus 4 remain at $15 / $75. Haiku 3.5 (Bedrock/Vertex-only after retirement on first-party) at $0.80 / $4.
- **Prompt caching** uses three multipliers vs base input: **1.25×** for 5-minute cache writes, **2×** for 1-hour cache writes, **0.1×** for cache reads/hits. The 5-min cache pays for itself after one read; the 1-hour cache after two reads.
- **Batch API gives a flat 50% discount** on both input and output across all tiers (Opus 4.7 batch: $2.50 / $12.50 per MTok). Does not stack with fast mode.
- **Fast mode** (beta) is 6× standard rates and Opus 4.6 / Opus 4.7 only. Stacks with cache and data-residency multipliers; not available with Batch or on Claude Platform on AWS.
- **Data residency US-only** (`inference_geo: "us"`) applies a **1.1× multiplier** on all token categories for Opus 4.6 / Sonnet 4.6 and later. Earlier models 400-error on the parameter. Global is the default and uses standard pricing.
- **Web search** is **$10 per 1,000 searches** plus standard token costs; **web fetch** has no surcharge (token costs only); **code execution** is free when bundled with web search/fetch, otherwise execution-time billed (1,550 free hours/org/month, then $0.05/container-hour).
- **Computer use overhead**: 466–499 system-prompt tokens + 735 tokens per tool definition (Claude 4.x); screenshots billed per Vision pricing.
- **Claude Managed Agents** introduces session-runtime billing: $0.08/session-hour while status=`running`. Batch, fast mode, data residency, and partner cloud pricing **do not apply** to Managed Agents.
- **Opus 4.7 tokenizer is denser**: "may use up to 35% more tokens for the same fixed text" vs prior models. Re-baseline cost-per-task forecasts when migrating.

## Quoted (citation-ready)

> "Prompt caching uses the following pricing multipliers relative to base input token rates: 5-minute cache write: 1.25x base input price ... 1-hour cache write: 2x base input price ... Cache read (hit): 0.1x base input price ... These multipliers stack with other pricing modifiers, including the Batch API discount and data residency."
>
> — Pricing, "Prompt caching"
>
> Anchor: `Prompt caching + Prompt caching uses the following pricing multipliers`

> "The Batch API allows asynchronous processing of large volumes of requests with a 50% discount on both input and output tokens."
>
> — Pricing, "Batch processing"
>
> Anchor: `Batch processing + The Batch API allows asynchronous processing`

> "Opus 4.7 uses a new tokenizer compared to previous models, contributing to its improved performance on a wide range of tasks. This new tokenizer may use up to 35% more tokens for the same fixed text."
>
> — Pricing, "Model pricing" (Note callout)
>
> Anchor: `Model pricing + Opus 4.7 uses a new tokenizer compared to previous models`

> "For Claude Opus 4.6, Claude Sonnet 4.6, and later models, specifying US-only inference through the `inference_geo` parameter incurs a 1.1x multiplier on all token pricing categories, including input tokens, output tokens, cache writes, and cache reads."
>
> — Pricing, "Data residency pricing"
>
> Anchor: `Data residency pricing + For Claude Opus 4.6, Claude Sonnet 4.6, and later models`

## Pricing grid (chapter-author copy block)

### Base model pricing — per MTok

| Model | Base input | 5m cache write (1.25×) | 1h cache write (2×) | Cache read (0.1×) | Output |
|---|---|---|---|---|---|
| Opus 4.7 / 4.6 / 4.5 | $5 | $6.25 | $10 | $0.50 | $25 |
| Opus 4.1 (and dep. Opus 4) | $15 | $18.75 | $30 | $1.50 | $75 |
| Sonnet 4.6 / 4.5 / (dep. Sonnet 4) | $3 | $3.75 | $6 | $0.30 | $15 |
| Haiku 4.5 | $1 | $1.25 | $2 | $0.10 | $5 |
| Haiku 3.5 (Bedrock/Vertex-only) | $0.80 | $1 | $1.60 | $0.08 | $4 |

### Batch (50% off base)

| Model | Batch input | Batch output |
|---|---|---|
| Opus 4.7 / 4.6 / 4.5 | $2.50 | $12.50 |
| Opus 4.1 (and dep. Opus 4) | $7.50 | $37.50 |
| Sonnet 4.6 / 4.5 / (dep. Sonnet 4) | $1.50 | $7.50 |
| Haiku 4.5 | $0.50 | $2.50 |
| Haiku 3.5 | $0.40 | $2 |

### Modifier multipliers (stack rules)

| Modifier | Multiplier | Stacks with cache? | Stacks with batch? | Stacks with fast mode? |
|---|---|---|---|---|
| 5-min cache write | 1.25× input | — | yes | yes |
| 1-hour cache write | 2× input | — | yes | yes |
| Cache read | 0.1× input | — | yes | yes |
| Batch API | 0.5× in & out | yes | — | **no** |
| Fast mode (Opus only, beta) | 6× | yes (cache applies on top) | **no** | — |
| Data residency US (`inference_geo: "us"`) | 1.1× all categories | yes | yes | yes |
| Bedrock/Vertex regional endpoints | 1.1× over global | n/a (partner) | n/a (partner) | n/a (partner) |

### Tool overheads

| Item | Tokens (Claude 4.x) | Notes |
|---|---|---|
| Tool-use system prompt (`auto` / `none`) | 346 | Excludes tool schemas themselves |
| Tool-use system prompt (`any` / forced) | 313 | |
| Bash tool definition | 245 | + stdout/stderr token cost |
| Text editor tool (`text_editor_20250429`) | 700 | |
| Computer use beta system prompt | 466–499 | Plus per-tool definitions |
| Computer use tool definition | 735 | Claude 4.x |
| Web search per use | $10 / 1,000 + content tokens | One search = one use regardless of result count |
| Web fetch per use | $0 + content tokens | Use `max_content_tokens` to cap |

### Code execution

- Free when bundled with `web_search_20260209` or `web_fetch_20260209`.
- Standalone: minimum 5 minutes execution time per call; **1,550 free hours/org/month**; $0.05/container-hour beyond.

### Claude Managed Agents

- Tokens at standard model pricing + **$0.08/session-hour** (metered to the millisecond while `status=running`).
- **Excluded modifiers**: Batch discount, fast mode premium, data residency multiplier, Cloud platform pricing.

## Worked example — single-turn Opus 4.7 with 80% cache hit

50,000 input tokens (40k cached) + 15,000 output tokens (no batch / no fast mode / global):

| Line item | Calculation | Cost |
|---|---|---|
| Uncached input | 10,000 × $5/M | $0.05 |
| Cache reads | 40,000 × $5 × 0.1 / M | $0.02 |
| Output | 15,000 × $25/M | $0.375 |
| **Total** | | **$0.445** |

Add `inference_geo: "us"`: multiply all line items by 1.1 → $0.49.
Add Batch: multiply input + output items (cache reads also halve) by 0.5 → $0.245 (pre-residency).

## Cross-references

- See [[docs-models-overview]] for the model lineup itself (this note is the pricing source of truth).
- See [[docs-batch-api]] for the Batch mechanics + the `output-300k-2026-03-24` extended output beta.
- See [[docs-computer-use]] for the 466–499 + 735-token computer-use overhead breakdown.
- See [[docs-tool-use]] for the 346/313 tool-use system-prompt overhead; deeper tool overhead lives in [[../03-advanced-tool-use/docs-tool-use-overview]].
- See `../../landscape-2026-05.md` §1.2 for the marketing-level pricing summary.

## Open questions / follow-ups

- **Volume discounts and enterprise pricing** are negotiated per-account; no public table exists. Field-guide chapters citing per-task costs should disclose tier when known.
- **Fast mode** is still beta as of fetch date; verify graduation status before citing in a published chapter (volatility: evolving).
- **Cache hit rate ranges** ("typically 30–98%, depending on traffic patterns") are surfaced only in the Batch section's prompt-caching subsection; no separate cache-rate primer found.
