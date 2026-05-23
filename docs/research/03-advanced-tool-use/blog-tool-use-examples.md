---
source_url: https://www.anthropic.com/engineering/advanced-tool-use
canonical_url: https://www.anthropic.com/engineering/advanced-tool-use
source_title: Advanced Tool Use on the Claude Developer Platform
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: advanced-tool-use
tier: T1-official
cert_domains: [2, 4]
cert_task_areas: ["Effective tool interfaces", "Few-shot prompting (targeting ambiguous cases, format consistency)"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Tool Use Examples — Anthropic engineering blog deep dive

Per-pattern deep dive on **Tool Use Examples** (the `input_examples` field on tool definitions), drawn from the canonical Anthropic engineering post (Nov 24, 2025). For the API reference with the full schema and code, see [[docs-define-tools]].

## Key takeaways

- **The gap this closes**: JSON Schema validates *structural* correctness but cannot express *usage patterns* — when to include optional parameters, which combinations make sense, what conventions your API expects.
- **Mechanism**: add an `input_examples` array to a tool definition. Each example is a valid input object showing a real invocation pattern. Examples are schema-validated at request time (invalid examples return a 400 error).
- **Headline result**: internal testing showed accuracy on **complex parameter handling improved from 72% to 90%** — an 18-point swing.
- **Token cost**: ~20–50 tokens for simple examples, ~100–200 tokens for complex nested objects. This is essentially the few-shot prompting pattern, but at the schema layer rather than the system-prompt layer.
- **Use when**: tools have nested objects, optional parameter correlations, or format-sensitive inputs (datetime formats, ID conventions, etc.). **Don't bother** when the tool's parameters are obvious from the description alone.

## The problem it solves

The blog post frames it as a fundamental schema-language limitation:

> "JSON schemas define structural validity but cannot express 'usage patterns: when to include optional parameters, which combinations make sense, or what conventions your API expects.'"

Examples directly demonstrate those conventions to Claude alongside the schema, in the same way few-shot examples in the prompt body do for general behavior.

## Shape

```json
{
  "name": "get_weather",
  "description": "Get the current weather in a given location",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": {"type": "string", "description": "The city and state, e.g. San Francisco, CA"},
      "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
    },
    "required": ["location"]
  },
  "input_examples": [
    {"location": "San Francisco, CA", "unit": "fahrenheit"},
    {"location": "Tokyo, Japan", "unit": "celsius"},
    {"location": "New York, NY"}
  ]
}
```

The third example silently teaches Claude that `unit` is optional and how to omit it. Schema alone says `unit` is not required; the example shows what the omission *looks like*.

## Quoted (citation-ready)

> "Internal testing showed accuracy improvements from 72% to 90% on complex parameter handling."
>
> — Advanced Tool Use on the Claude Developer Platform, Tool Use Examples results
>
> Anchor: `Tool Use Examples results + Internal testing showed`

> "JSON schemas define structural validity but cannot express usage patterns: when to include optional parameters, which combinations make sense, or what conventions your API expects."
>
> — Advanced Tool Use on the Claude Developer Platform, Tool Use Examples framing
>
> Anchor: `Tool Use Examples framing + JSON schemas define structural`

## Where this lives in API terms

The `input_examples` field is documented under [[docs-define-tools]] and available on user-defined and Anthropic-schema client tools. It is **not** available on server-side tools (web_search, code_execution, web_fetch, tool_search). The docs page reinforces the recommendation:

> "Prioritize descriptions, but consider using `input_examples` for complex tools."

In other words: descriptions remain the primary tuning surface (the docs page is explicit that "This is by far the most important factor in tool performance"). Examples are a complement for the cases where the description alone can't carry the usage conventions.

## Interactions with other features

- **Tool Search**: per [[docs-tool-search-tool]] — "The tool search tool is not compatible with tool use examples." If you need examples on a tool, you cannot use it under tool search. The docs recommend keeping example-bearing tools as non-deferred (in the always-loaded set) and using examples-less tools as the deferred catalog.
- **Strict mode**: examples must validate against the tool's schema. With `strict: true`, this is doubly enforced — the schema must match exactly, and the examples must conform.
- **Programmatic Tool Calling**: examples teach Claude how to *invoke* a tool from code, not just from a top-level tool call. Combining `input_examples` with `allowed_callers: ["code_execution_20260120"]` is supported.

## Practical guidance

- **3 examples is the canonical demo count** in the docs (SF, Tokyo, NY). Two examples cover the common case; the third demonstrates the edge case (e.g., optional-parameter omission).
- **Diversify examples** — examples that all look the same teach Claude one pattern. Cover the optional-parameter cases and the format variants.
- **Examples cost tokens** — they go into the prompt alongside the schema. The docs give the explicit cost: ~20–50 tokens for simple, ~100–200 for complex.

## Cross-references

- See [[docs-define-tools]] for the full schema, validation rules, multi-language code examples.
- See [[blog-advanced-tool-use-overview]] for the three-feature framing.
- See [[docs-tool-interface-design]] for the "descriptions are the most important factor" framing that contextualizes when to reach for examples.
- See [[blog-tool-search-tool]] — incompatibility flagged above.

## Open questions / follow-ups

- The 72% → 90% number is "internal testing" on "complex parameter handling" with no named benchmark — treat as an internal-eval figure, not a publishable benchmark score.
- Whether examples should mirror real production inputs (PII concerns) vs synthetic patterns is not addressed in the post or the docs. Common-sense answer: use synthetic-but-realistic.
- Diminishing returns: at what example count does the benefit plateau? The docs and post both stop at 3 examples in their canonical demo. Likely 3–5 is the sweet spot but this is not documented.
