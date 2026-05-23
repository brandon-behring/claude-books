# Claude API — research dossier

Primary-source research cache for **Domain 4: Prompt Engineering & Structured Output** (cert weight 20%) and **Domain 2: Tool Design & MCP Integration** (cert weight 18%), focused on the actual surface area of the Claude API: model lineup, pricing, thinking modes, tool use, batch processing, files, citations, streaming, and computer use. All notes are **T1-official** (`platform.claude.com/docs`).

**Snapshot**: 2026-05-22. Refresh when:
- Opus 4.7 tokenizer guidance graduates from "may use up to 35% more tokens" to a stable rule.
- Files API exits beta.
- A new computer-use header generation lands.
- The 1M context graduates from a per-model badge to a tier-wide default.

## Topic summary

The Claude API in May 2026 is a **single Messages contract** with several layered modifiers and a small set of beta features that handle the long tail. The headline surfaces:

- **Three current models** (Opus 4.7, Sonnet 4.6, Haiku 4.5) covering a Pareto curve from "max intelligence, denser tokenizer, only adaptive thinking" to "fastest, manual thinking only, 200k context." Legacy 4.5/4.6/4.1 models remain available; Opus 4 / Sonnet 4 (`20250514`) **retire 2026-06-15**.
- **Thinking-mode bifurcation** as the most important design choice for an agentic loop: adaptive thinking (Opus 4.7 only; Opus 4.6 / Sonnet 4.6 recommended) decides budget per turn; manual extended thinking (Haiku 4.5; Sonnet 4.6 still supported / deprecated) requires explicit `budget_tokens`. Opus 4.7 **rejects** manual thinking with a 400.
- **Pricing modifiers stack** in predictable ways: cache (1.25× write / 0.1× read), batch (0.5× both), data residency US (1.1×), fast mode (6×, Opus-only beta). Compute the multipliers in this order: base × (cache or no-cache) × (batch or fast-mode or neither) × (residency or global).
- **Batch API is 50% off, 24-hour SLA, and unlocks 300k output** via `output-300k-2026-03-24` for Opus 4.7 / 4.6 and Sonnet 4.6. The only major Messages-API feature it does not support is streaming.
- **Files API (beta), Citations (GA), Streaming (GA), Computer use (beta)** round out the high-leverage features. Citations + Structured Outputs are mutually exclusive (400 error). Computer use ships with two beta headers (new for 4.5+, old for 4.4 generation) and a 466–499 + 735 token overhead.
- **Tool use** is documented here only at the foundation level; the in-depth patterns (Tool Search, Programmatic Tool Calling, Tool Use Examples) live in the sibling dossier — see [[../03-advanced-tool-use/README]].

The dossier holds primary-source quotes for every load-bearing claim so chapter authors can quote with confidence and provide anchor strings to readers who want to verify.

## Table of notes

| File | Source | What it covers |
|---|---|---|
| [`docs-models-overview.md`](./docs-models-overview.md) | T1 | Current + legacy model lineup, thinking-mode matrix, Opus 4.7 tokenizer note, batch-only 300k output beta |
| [`docs-pricing.md`](./docs-pricing.md) | T1 | Base/cache/batch/fast-mode/residency multipliers + tool overhead table + Managed Agents session billing |
| [`docs-adaptive-thinking.md`](./docs-adaptive-thinking.md) | T1 | Adaptive mode mechanism + effort levels (low/medium/high/xhigh/max) + interleaved thinking |
| [`docs-extended-thinking.md`](./docs-extended-thinking.md) | T1 | Legacy manual mode (Haiku 4.5; Sonnet 4.6 deprecated); `budget_tokens`, tool-choice restriction |
| [`docs-tool-use.md`](./docs-tool-use.md) | T1 | Foundation `tool_use`/`tool_result` contract; `tool_choice` modes; cross-ref to 03-advanced-tool-use |
| [`docs-batch-api.md`](./docs-batch-api.md) | T1 | Message Batches API: 50% off, 24h SLA, `custom_id`, extended-output 300k beta header |
| [`docs-files-api.md`](./docs-files-api.md) | T1 | Files API (beta, `files-api-2025-04-14`): upload, reference, supported types, limits |
| [`docs-citations.md`](./docs-citations.md) | T1 | Citations: `citations.enabled`, three document modes, response shape, structured-output incompat |
| [`docs-streaming.md`](./docs-streaming.md) | T1 | SSE event taxonomy: deltas (text / JSON / thinking / signature / citations), error recovery |
| [`docs-computer-use.md`](./docs-computer-use.md) | T1 | Computer use (beta): two header generations, action grammar, prompt-injection defense |

## Pricing-context block (chapter-author copy)

Compact table to lift into pricing-sensitive chapters. Source: [[docs-pricing]].

| Model | Base in/out per MTok | 5m cache write / 1h write / read | Batch in/out | Notes |
|---|---|---|---|---|
| Opus 4.7 | $5 / $25 | $6.25 / $10 / $0.50 | $2.50 / $12.50 | New tokenizer; up to 35% more tokens for same text |
| Opus 4.6 | $5 / $25 | $6.25 / $10 / $0.50 | $2.50 / $12.50 | Adaptive recommended |
| Sonnet 4.6 | $3 / $15 | $3.75 / $6 / $0.30 | $1.50 / $7.50 | Both thinking modes |
| Haiku 4.5 | $1 / $5 | $1.25 / $2 / $0.10 | $0.50 / $2.50 | Manual thinking only |
| Opus 4.1 | $15 / $75 | $18.75 / $30 / $1.50 | $7.50 / $37.50 | Legacy; consider migrating |

Modifier stacks (multiply in this order):

1. **Base** model rate.
2. **Cache** modifier: writes (1.25× or 2×) or reads (0.1×).
3. **Mode** modifier: Batch (0.5×) **or** Fast mode (6×) — not both.
4. **Geography** modifier: `inference_geo: "us"` (1.1×) for Opus 4.6 / Sonnet 4.6+ models.

Plus surcharges:
- Web search: $10 / 1,000 searches.
- Code execution (standalone): $0.05 / container-hour beyond 1,550 free hours/org/month.
- Managed Agents session runtime: $0.08 / session-hour.

## Cert task areas covered

### Domain 4 — Prompt Engineering & Structured Output (20%)

| Task area | Note(s) |
|---|---|
| Structured output via `tool_use` + JSON schemas | [[docs-tool-use]] (foundation); [[../03-advanced-tool-use/docs-define-tools]] (depth) |
| Validation, retry, feedback loops (semantic vs schema errors) | [[../03-advanced-tool-use/docs-handle-tool-calls]] (primary); [[docs-citations]] (provenance pattern) |
| Batch processing (Message Batches API, `custom_id`, SLA matching) | [[docs-batch-api]] (primary) |
| Multi-instance / multi-pass review | Cross-domain; covered in 06-multi-agent-patterns |
| Few-shot prompting (format consistency) | [[docs-models-overview]] notes; [[../03-advanced-tool-use/blog-tool-use-examples]] |
| Explicit criteria over vague instructions | [[docs-tool-use]] (parameter inference); [[docs-computer-use]] (prompting tips) |

### Domain 2 — Tool Design & MCP Integration (18%)

| Task area | Note(s) |
|---|---|
| Tool distribution + `tool_choice` (`auto`/`any`/forced/`none`) | [[docs-tool-use]] (foundation) |
| Effective tool interfaces (descriptions, boundaries, naming) | [[docs-computer-use]] (action grammar example); deep coverage in 03-advanced-tool-use |
| Structured error responses (`isError`, retryability) | 03-advanced-tool-use |
| Built-in tools (Read, Write, Edit, Bash, Grep, Glob) | [[docs-files-api]] (file inputs); [[docs-tool-use]] (overhead); Claude Code-specific tools deferred to 08-claude-code-internals |

### Cross-domain

- **D1 Agentic Architecture**: adaptive thinking + tool-use interleaving — [[docs-adaptive-thinking]], [[docs-streaming]]
- **D5 Context Management & Reliability**: cache semantics — [[docs-pricing]], [[docs-adaptive-thinking]]; error recovery for streamed responses — [[docs-streaming]]

## Headline numbers to carry into chapters

| Claim | Source | Note |
|---|---|---|
| Opus 4.7 tokenizer is denser by up to 35% | [[docs-pricing]], [[docs-models-overview]] | Re-baseline cost forecasts on migration |
| Batch API: 50% off, 24h SLA, 300k output via `output-300k-2026-03-24` | [[docs-batch-api]] | Opus 4.7 / 4.6, Sonnet 4.6 only for the extended output |
| Cache: 1.25× write, 0.1× read; pays off after 1 read (5min) or 2 reads (1hr) | [[docs-pricing]] | Stacks with batch and residency |
| Computer use: 466–499 system + 735 per tool def tokens (Claude 4.x) | [[docs-computer-use]] | Plus screenshots and tool-result content |
| Citations: `cited_text` is not billed (output or input) | [[docs-citations]] | Vs prompt-based "quote your sources" pattern |
| Effort levels: low, medium, high, **xhigh** (Opus 4.7 only), max | [[docs-adaptive-thinking]] | New `xhigh` is Opus 4.7 exclusive |
| Tool-use system prompt: 346 (auto/none) or 313 (any/tool) tokens, Claude 4.x | [[docs-tool-use]], [[docs-pricing]] | In addition to your tool schemas |
| Files API limit: 500 MB/file, 500 GB/org, ~100 ops/min (beta) | [[docs-files-api]] | Workspace-scoped |
| Batch limit: 100,000 requests or 256 MB; results retained 29 days | [[docs-batch-api]] | `custom_id` required (1-64 char alphanumeric+`-`+`_`) |
| Adaptive recommended over manual on Opus 4.6 / Sonnet 4.6; required on Opus 4.7 | [[docs-adaptive-thinking]], [[docs-extended-thinking]] | Manual is deprecated, not removed (yet) |

## Cross-references to other dossiers

- [[../02-mcp-spec/README]] — MCP spec governance and the `2026-07-28` RC; relevant when chapter discusses tool servers that surface through the MCP connector.
- [[../03-advanced-tool-use/README]] — Tool Search Tool, Programmatic Tool Calling, Tool Use Examples; depth on tool-use patterns this dossier deliberately omits.
- `../../landscape-2026-05.md` §1.1, §1.2, §1.5 — marketing-level summary; trust this dossier's primary-source notes for chapter content.
- `../../cert-coverage.md` — domain weights and task-area phrasing.

## Anti-patterns flagged for chapter authors

- **Don't** restate "Files API is GA" — the docs still mark it beta and require the `files-api-2025-04-14` header (see [[docs-files-api]]).
- **Don't** assume Opus 4.7 accepts manual `thinking: {type: "enabled", budget_tokens: N}` — it returns **400**.
- **Don't** mix cited-text + Structured Outputs in the same request — **400**.
- **Don't** mix batch + fast mode — mutually exclusive (and batch is much cheaper anyway).
- **Don't** rely on batch result ordering — match by `custom_id`.
- **Don't** plan a 300k-output sync request — extended output is **batch-only**.
- **Don't** duplicate tool-use depth from this dossier — cross-reference [[../03-advanced-tool-use/README]].
- **Don't** quote tokenizer densities without flagging that Opus 4.7's tokenizer makes cross-model context comparisons unreliable.

## Open questions / verification follow-ups

Aggregated from per-note "Open questions" sections:

1. **Files API beta → GA timeline**: still requires beta header as of fetch date. Landscape doc claims GA; this dossier is right and landscape doc needs updating.
2. **Computer use header generations** — `computer-use-2025-11-24` and `computer-use-2025-01-24` coexist. Plan for at least a partial migration window before the older header retires.
3. **Fast mode + Opus 4.7 graduation**: still beta. Track before a chapter cites the 6× premium tier in a stable architecture.
4. **`max_tokens` vs `budget_tokens` interaction** under adaptive thinking — cache breaks on cross-mode toggles but not on effort changes; this is implicit, not explicit, in the docs.
5. **`RequestSearchResultBlock` + citations** referenced in incompatibility warning but undocumented in fetched pages. Worth a dedicated dive if a RAG chapter uses search-result blocks.
6. **Bedrock/Vertex parity** for Files API, extended-output batch, and fast mode: explicit "not on partner clouds" for several features; verify per-platform before chapters give platform-specific guidance.
7. **April 23 postmortem follow-up** (landscape-doc §6.1): default effort regression (`high` → `medium`) was reverted in April. Confirm effort defaults are still `xhigh` for Opus 4.7 and `high` for others at chapter-publication time.
8. **Multi-turn tool calling in batch** — landscape doc says "not supported"; primary docs say "batch supports all features except streaming." The practical constraint is single-shot batched requests; cite the FAQ if a chapter raises the question.
9. **Cache hit rates in batch** ("30%–98%, depending on traffic") — wide; no benchmark. Treat as illustrative.
10. **`eager_input_streaming`** and fine-grained tool streaming — referenced but not fully captured; covered in 03-advanced-tool-use.

## How to use this dossier

- **Quoting**: every primary-source claim has a verbatim quote with an anchor string in the note. Lift the quote, cite the anchor, and the reader can grep the live docs to verify.
- **Pricing**: lift the table from [[docs-pricing]] rather than the landscape doc summary. The dossier is the source of truth.
- **Adaptive vs extended thinking**: [[docs-adaptive-thinking]] for current behavior; [[docs-extended-thinking]] for legacy + Haiku 4.5. Do not write thinking-mode advice without checking both.
- **Beta status**: any feature called beta here needs a beta-header callout in the chapter. Treat that as a tax on writing — if you don't want the tax, pick a GA feature.
