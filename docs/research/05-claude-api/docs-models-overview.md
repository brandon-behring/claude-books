---
source_url: https://platform.claude.com/docs/en/about-claude/models/overview
canonical_url: https://platform.claude.com/docs/en/about-claude/models/overview
source_title: Models overview
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: claude-api
tier: T1-official
cert_domains: [4]
cert_task_areas: ["Explicit criteria over vague instructions", "Few-shot prompting"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Claude models lineup (current + legacy)

## Key takeaways

- **Three current models**: Opus 4.7 (`claude-opus-4-7`, 1M ctx, 128k max output, Jan 2026 cutoff), Sonnet 4.6 (`claude-sonnet-4-6`, 1M ctx, 64k max output, Aug 2025 cutoff), Haiku 4.5 (`claude-haiku-4-5`, 200k ctx, 64k max output, Feb 2025 cutoff).
- **Thinking-mode split is the load-bearing distinction**: Opus 4.7 supports **adaptive thinking only** (manual extended-thinking blocks return 400); Sonnet 4.6 supports **both** adaptive and manual; Haiku 4.5 supports **manual extended thinking only** (no adaptive).
- **Opus 4.7 uses a new tokenizer** that may consume up to 35% more tokens for the same fixed text vs prior Claude tokenizers (~555k words / 1M tokens vs ~750k for Sonnet 4.6). Cross-model context-budget comparisons should account for this.
- **Legacy models still available**: Opus 4.6, Sonnet 4.5, Opus 4.5, Opus 4.1. **Deprecated and retiring 2026-06-15**: `claude-sonnet-4-20250514`, `claude-opus-4-20250514`.
- **Model IDs are pinned snapshots**, including the dateless 4.6+ format. The alias column is *not* an evergreen pointer for 4.6+ models. Before 4.6, aliases resolve to dated IDs.
- **Batch-only extended output**: Opus 4.7, Opus 4.6, and Sonnet 4.6 support up to **300k output tokens** when using the Message Batches API with the `output-300k-2026-03-24` beta header. The synchronous Messages API caps at the values above.

## Quoted (citation-ready)

> "If you're unsure which model to use, consider starting with **Claude Opus 4.7** for the most complex tasks. It is our most capable generally available model, with a step-change improvement in agentic coding over Claude Opus 4.6."
>
> — Models overview, "Choosing a model"
>
> Anchor: `Choosing a model + If you're unsure which model to use, consider`

> "Every Claude model ID is a pinned snapshot. Models with a date in the ID (for example, `20250929`) are fixed to that specific release. Starting with the Claude 4.6 generation, model IDs use a dateless format that is also a pinned snapshot, not an evergreen pointer."
>
> — Models overview, "Latest models comparison" (Note callout)
>
> Anchor: `Latest models comparison + Every Claude model ID is a pinned snapshot`

> "The Max output values above apply to the synchronous Messages API. On the [Message Batches API], Opus 4.7, Opus 4.6, and Sonnet 4.6 support up to 300k output tokens by using the `output-300k-2026-03-24` beta header."
>
> — Models overview, "Latest models comparison" (Note callout)
>
> Anchor: `Latest models comparison + The Max output values above apply to the synchronous Messages API`

## Current models — at-a-glance

| Feature | Opus 4.7 | Sonnet 4.6 | Haiku 4.5 |
|---|---|---|---|
| API ID | `claude-opus-4-7` | `claude-sonnet-4-6` | `claude-haiku-4-5-20251001` |
| API alias | `claude-opus-4-7` | `claude-sonnet-4-6` | `claude-haiku-4-5` |
| Context window | 1M tokens (~555k words) | 1M tokens (~750k words) | 200k tokens |
| Max output (sync) | 128k tokens | 64k tokens | 64k tokens |
| Max output (batch, beta) | 300k | 300k | 64k |
| Reliable knowledge cutoff | Jan 2026 | Aug 2025 | Feb 2025 |
| Training data cutoff | Jan 2026 | Jan 2026 | Jul 2025 |
| Adaptive thinking | Yes (only mode) | Yes | No |
| Extended thinking (manual) | No (400 error) | Yes (deprecated) | Yes |
| Priority Tier eligible | Yes | Yes | Yes |
| Comparative latency | Moderate | Fast | Fastest |

Pricing alignment lives in [[docs-pricing]] (do not duplicate here — chapter authors should grab from the pricing note).

## Legacy models still available

| Model | API ID | Context | Max output | Status |
|---|---|---|---|---|
| Opus 4.6 | `claude-opus-4-6` | 1M | 128k | Current, supported |
| Sonnet 4.5 | `claude-sonnet-4-5-20250929` | 200k | 64k | Current, supported |
| Opus 4.5 | `claude-opus-4-5-20251101` | 200k | 64k | Current, supported |
| Opus 4.1 | `claude-opus-4-1-20250805` | 200k | 32k | Current, supported |
| Sonnet 4 | `claude-sonnet-4-20250514` | 200k | 64k | **Deprecated — retires 2026-06-15** |
| Opus 4 | `claude-opus-4-20250514` | 200k | 32k | **Deprecated — retires 2026-06-15** |

A separate **Claude Mythos Preview** (`claude-mythos-preview`) is offered as an invitation-only research preview under Project Glasswing (defensive cybersecurity); not self-serve. Adaptive thinking is the default and cannot be disabled.

## Cloud platforms

All current models are available via Claude API, Claude Platform on AWS (uses Claude API model IDs), Amazon Bedrock (uses Bedrock-style IDs like `anthropic.claude-opus-4-7`), Vertex AI (uses Vertex IDs like `claude-opus-4-7@...`), and Microsoft Foundry. Starting with Sonnet 4.5+/Opus 4.5+/Haiku 4.5+, Bedrock offers global and regional endpoints; Vertex offers global, multi-region, and regional. Regional/multi-region carry a 10% premium over global.

## Programmatic capability lookup

The [Models API](https://platform.claude.com/docs/en/api/models/list) returns `max_input_tokens`, `max_tokens`, and a `capabilities` object per model — use this rather than hardcoding the table above into harness code.

## Cross-references

- See [[docs-pricing]] for the per-model price grid (input/output/cache writes/cache reads/batch). Do not duplicate pricing here.
- See [[docs-adaptive-thinking]] for the Opus 4.7 / Sonnet 4.6 thinking mechanism; see [[docs-extended-thinking]] for the legacy block API used by Sonnet 4.6 / Haiku 4.5.
- See [[docs-batch-api]] for the `output-300k-2026-03-24` beta header that unlocks 300k output on batch.
- See [[../02-mcp-spec/README]] for MCP spec governance; the model lineup is independent of MCP spec versioning.
- See `../../landscape-2026-05.md` §1.1 for the marketing-table summary; this note is the primary source.

## Open questions / follow-ups

- **Tokenizer densities** are surfaced only as tooltip text in the overview ("~555K words / 2.5M Unicode chars" for Opus 4.7). A dedicated Tokenizer reference page would be useful; not found at the time of fetch.
- **Claude Mythos Preview** — public capability documentation is paywalled behind the Project Glasswing invitation. Verification beyond "research preview" not possible from primary sources.
- **Model deprecations** page (`/docs/en/about-claude/model-deprecations`) was referenced but not fetched in this dossier; capture the full deprecation calendar if a reliability chapter needs it.
