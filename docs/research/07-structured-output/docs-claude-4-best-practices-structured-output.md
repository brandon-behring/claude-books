---
source_url: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-4-best-practices
canonical_url: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-4-best-practices
source_title: Prompting best practices
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: structured-output
tier: T1-official
cert_domains: [4, 5]
cert_task_areas: ["Few-shot prompting (targeting ambiguous cases, format consistency)", "Validation, retry, feedback loops (semantic vs schema errors)", "Structured output via tool_use + JSON schemas"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Prompting best practices — Opus 4.7 / 4.6 / Sonnet 4.6 / Haiku 4.5 structured-output guidance

The single canonical prompt-engineering reference for Claude's current model lineup. This note extracts the **structured-output-relevant** sections only — for the full page (verbosity, design defaults, frontend, etc.) see the broader API dossier.

Two structural shifts in the 4.7 era that change how to think about structured output:

1. **More literal instruction-following** — Opus 4.7 won't silently generalize a structured-output spec. State it explicitly.
2. **Prefill is gone on 4.6 / 4.7 / Mythos** — the historical "prefill `{`" trick for JSON is dead; the migration path is structured outputs + system-prompt instructions.

## Key takeaways

- **The "ask first, structured outputs second" hierarchy is explicit**: try plain instruction + few-shot first; reach for `output_config.format` only when you need *guaranteed* compliance.
- **Few-shot best practices for structured output**: 3–5 examples; wrap in `<example>`/`<examples>` tags; make them **relevant** + **diverse** + **structured**.
- **XML tags are first-class** for structuring complex prompts: `<instructions>`, `<context>`, `<input>`, `<documents>`, `<example>`. Nested with `index="n"` for multi-document.
- **Control formatting positively**: "Tell Claude what to do, not what not to do" — "respond in smoothly flowing prose" beats "do not use markdown."
- **For classification, use tools with enum fields OR structured outputs** — both lock the output to a closed set.
- **Prefill is retired** on Mythos / Opus 4.7 / Opus 4.6 / Sonnet 4.6; migration is to structured outputs, XML tags in instructions, or tool calling. Sending a prefilled last assistant message to those models returns a **400 invalid_request_error**.
- **Opus 4.7 specifically**: structured extraction and pipelines benefit from the more-literal instruction-following. Don't try to be clever about "the model will figure out the format from one example" — it won't, by design.

## Quoted (citation-ready)

> "Claude Opus 4.7 interprets prompts more literally and explicitly than Claude Opus 4.6, particularly at lower effort levels. It will not silently generalize an instruction from one item to another, and it will not infer requests you didn't make. The upside of this literalism is precision and less thrash, and it generally performs better for API use cases with carefully tuned prompts, structured extraction, and pipelines where you want predictable behavior."
>
> — Prompting best practices, Prompting Claude Opus 4.7 → More literal instruction following
>
> Anchor: `More literal instruction following + Claude Opus 4.7 interprets prompts more literally`

> "Examples are one of the most reliable ways to steer Claude's output format, tone, and structure. A few well-crafted examples (known as few-shot or multishot prompting) can dramatically improve accuracy and consistency. When adding examples, make them: Relevant: Mirror your actual use case closely. Diverse: Cover edge cases and vary enough that Claude doesn't pick up unintended patterns. Structured: Wrap examples in <example> tags (multiple examples in <examples> tags) so Claude can distinguish them from instructions."
>
> — Prompting best practices, Use examples effectively
>
> Anchor: `Use examples effectively + Examples are one of the most reliable ways to steer Claude's output format`

> "The Structured Outputs feature is designed specifically to constrain Claude's responses to follow a given schema. Try simply asking the model to conform to your output structure first, as newer models can reliably match complex schemas when told to, especially if implemented with retries. For classification tasks, use either tools with an enum field containing your valid labels or structured outputs."
>
> — Prompting best practices, Migrating from prefill → Controlling output formatting
>
> Anchor: `Controlling output formatting + The Structured Outputs feature is designed specifically to constrain`

> "Use direct instructions in the system prompt: 'Respond directly without preamble. Do not start with phrases like 'Here is...', 'Based on...', etc.' Alternatively, direct the model to output within XML tags, use structured outputs, or use tool calling. If the occasional preamble slips through, strip it in post-processing."
>
> — Prompting best practices, Migrating from prefill → Eliminating preambles
>
> Anchor: `Eliminating preambles + Use direct instructions in the system prompt`

## The four "prefill replacement" patterns

For Mythos / Opus 4.7 / 4.6 / Sonnet 4.6, prefill no longer works. The docs enumerate the migration:

| What prefill used to do | Replacement on 4.6+ |
|---|---|
| Force JSON / YAML / classification format | **Structured outputs** (`output_config.format`); or "ask the model to conform + retry" |
| Eliminate "Here is..." preambles | System-prompt instruction OR XML-tag output OR structured outputs OR tool calling; post-process to strip |
| Avoid bad refusals | No longer needed — appropriate-refusal-handling has improved |
| Continue partial completions | Move continuation to user message: `"Your previous response was interrupted and ended with [text]. Continue from where you left off."` |
| Context hydration | Inject context into user turn or hydrate via tools / context compaction |

## Few-shot for structured-output tasks

The docs are unambiguous: 3–5 examples, wrapped in `<example>` tags. For schema-constrained outputs, examples shape **content** (what to extract, what to label as "other", how to handle ambiguity) even when the *shape* is locked by structured outputs. For schema-flexible outputs, examples shape **both** content and shape.

**The cert task "Few-shot prompting (targeting ambiguous cases, format consistency)" is satisfied by**:
- 3–5 examples
- one or more on a deliberately ambiguous / edge case
- wrapped consistently in `<example>` tags
- including the *desired* handling for the ambiguous case (e.g., output `null`, or use `"other"` + detail string, etc.)

## XML tags as structured-output substrate

When structured outputs is too restrictive (e.g., mixed prose + structure, or hierarchy that nests deeper than the grammar limits), the docs explicitly recommend:

> "Write the prose sections of your response in `<smoothly_flowing_prose_paragraphs>` tags."

i.e., structured-output-via-XML, parsed downstream by `lxml` / `BeautifulSoup`. This is the canonical fallback for D4-style structured output that needs human-readable presentation alongside machine-readable structure.

## Tool-use as structured output (cert task area canonical)

> "For classification tasks, use either tools with an enum field containing your valid labels or structured outputs."

The cert task area "Structured output via tool_use + JSON schemas" lives at the intersection: define a tool with a single `category` parameter constrained by `enum`, force-call it (`tool_choice: {type: "tool", name: ...}`), use `strict: true` for guaranteed enum-validity. See [[blog-extract-structured-json-cookbook]] for the worked examples.

## Adaptive thinking + structured outputs

Adaptive thinking (Opus 4.7 / Sonnet 4.6) is **complementary** to structured outputs: the thinking budget lets the model reason through ambiguity before emitting the constrained JSON. For high-stakes extraction (insurance claims, medical records, legal filings), increase effort to `xhigh` (Opus 4.7) or `max` and let adaptive thinking work before constrained decoding takes over.

## Cross-references

- See [[docs-structured-outputs]] — the structured-outputs feature itself.
- See [[docs-increase-output-consistency]] — the prompt-engineering siblings (specify format, prefill (legacy), examples, retrieval, chaining).
- See [[docs-strict-tool-use]] — strict tool use is the right primitive for classification (`enum` + `strict: true` + `tool_choice: tool`).
- See [[blog-extract-structured-json-cookbook]] — the worked-example version of tool-use-as-classification.
- See [[../05-claude-api/docs-adaptive-thinking]] — adaptive thinking interacts with structured-output retries (the model can spend more cycles on a single attempt vs more retries).

## Open questions / follow-ups

- **Few-shot example count for tool-use-as-structured-output**: the docs say 3–5 for general few-shot; the [[../03-advanced-tool-use/blog-tool-use-examples]] page documents `input_examples` with no specific count. Likely the same advice (3–5 across the schema's edge cases).
- **Effort + structured outputs cost**: high/xhigh adaptive thinking + grammar-constrained decoding is the most expensive shape. Cost-per-row for an extraction job at xhigh isn't documented.
- **Migration path for code that prefilled the assistant turn**: explicit guidance for *retrieved-context* prefill (where the prefill was a long context block) isn't given; structured outputs / context-hydration via tools is the implied path.
