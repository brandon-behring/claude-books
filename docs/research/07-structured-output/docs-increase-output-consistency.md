---
source_url: https://platform.claude.com/docs/en/docs/test-and-evaluate/strengthen-guardrails/increase-consistency
canonical_url: https://platform.claude.com/docs/en/docs/test-and-evaluate/strengthen-guardrails/increase-consistency
source_title: Increase output consistency
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: structured-output
tier: T1-official
cert_domains: [4, 5]
cert_task_areas: ["Validation, retry, feedback loops (semantic vs schema errors)", "Few-shot prompting (targeting ambiguous cases, format consistency)"]
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Increase output consistency — the prompt-engineering fallback when strict schemas don't fit

This page is the "what to do **before** you reach for `output_config.format`" reference. Anthropic's own docs steer hard to structured outputs for *guaranteed* JSON conformance, but call out a set of prompt-engineering techniques that still matter for outputs **beyond strict JSON** (XML reports, mixed prose + structure, role-consistent character outputs, retrieval-grounded answers).

## Key takeaways

- **Top-of-page tip is unequivocal**: for guaranteed JSON schema conformance, use [[docs-structured-outputs]] — these techniques are for "general output consistency or when you need flexibility beyond strict JSON schemas."
- **Five technique families documented**:
  1. **Specify output format precisely** (JSON / XML / custom template).
  2. **Prefill Claude's response** with a partial structure to enforce the rest. **Note**: prefilling is **NOT supported on Claude Mythos Preview, Opus 4.7, Opus 4.6, Sonnet 4.6**. Use structured outputs or system-prompt instructions on those models instead.
  3. **Constrain with examples** (few-shot, wrapped in `<example>` tags).
  4. **Use retrieval for contextual consistency** (RAG-style grounding in a knowledge base; output wrapped in repeatable XML structure with `<kb_entry>` + `<answer>`).
  5. **Chain prompts** for complex tasks (sub-task isolation).
- **Plus role-prompting** (system message defining role + scenario coverage in user message) — for character consistency across runs.
- **Critical model-availability caveat**: prefill — historically the go-to technique for "force the assistant to start with `{` to lock JSON output" — has been retired on the 4.6 / 4.7 generation. The new path is structured outputs or system-prompt instructions.

## Quoted (citation-ready)

> "For guaranteed JSON schema conformance: If you need Claude to always output valid JSON that conforms to a specific schema, use Structured Outputs instead of the prompt engineering techniques below. Structured outputs provide guaranteed schema compliance and are specifically designed for this use case. The techniques below are useful for general output consistency or when you need flexibility beyond strict JSON schemas."
>
> — Increase output consistency, top-of-page Tip
>
> Anchor: `Increase output consistency Tip + For guaranteed JSON schema conformance`

> "Prefilling is not supported on Claude Mythos Preview, Claude Opus 4.7, Claude Opus 4.6, and Claude Sonnet 4.6. Use structured outputs or system prompt instructions instead."
>
> — Increase output consistency, Prefill Claude's response (Note)
>
> Anchor: `Prefill Claude's response Note + Prefilling is not supported`

> "Precisely define your desired output format using JSON, XML, or custom templates so that Claude understands every output formatting element you require."
>
> — Increase output consistency, Specify the desired output format
>
> Anchor: `Specify the desired output format + Precisely define your desired output format`

## The "format spec in the user message" pattern

Standard pre-structured-outputs pattern, still useful for XML/custom outputs:

```
You're a Customer Insights AI. Analyze this feedback and output in JSON format with keys:
- "sentiment" (positive/negative/neutral)
- "key_issues" (list)
- "action_items" (list of dicts with "team" and "task")

"I've been a loyal user for 3 years..."
```

The Claude 4.x best-practices page (see [[docs-claude-4-best-practices-structured-output]]) makes the upgrade explicit:

> "Try simply asking the model to conform to your output structure first, as newer models can reliably match complex schemas when told to, especially if implemented with retries."

This is the **lowest-effort structured-output approach**: a clear schema-as-prompt + a retry wrapper on `JSON.parse` errors. It works well for low-stakes / experimental flows where the latency hit of structured outputs' grammar compilation isn't worth it.

## The retry-on-parse-error pattern (canonical, pre-structured-outputs)

The docs don't show code, but the canonical pattern is:

```python
import json
from anthropic import Anthropic

def extract_structured(client, prompt, schema_description, max_retries=3):
    history = [{"role": "user", "content": f"{prompt}\n\nOutput as JSON: {schema_description}"}]
    for attempt in range(max_retries):
        resp = client.messages.create(model="claude-opus-4-7", max_tokens=1024, messages=history)
        text = resp.content[0].text
        try:
            return json.loads(text)
        except json.JSONDecodeError as e:
            history.append({"role": "assistant", "content": text})
            history.append({"role": "user", "content": (
                f"That output failed JSON parsing with error: {e}. "
                "Please re-emit the response as strict JSON with no preamble."
            )})
    raise RuntimeError("Could not get parseable JSON after retries")
```

**Important caveat for 4.6 / 4.7**: assistant prefill is no longer supported, so the historical "prefill `{` to force JSON" trick is gone. The retry pattern above (re-asking with the error message) is what survives.

This is exactly the "Validation, retry, feedback loops" cert task area — the structured-outputs feature **subsumes** this for schema errors but the **semantic-error** version (where JSON parses fine but contains wrong data) still requires this style of feedback loop. See [[blog-semantic-vs-schema-errors]].

## XML structures: when structured-outputs isn't enough

For mixed prose + structured outputs (reports, knowledge-base answers, character-consistent role outputs), structured outputs is too restrictive. The docs' "Daily sales report" example uses nested XML:

```xml
<report>
  <summary>
    <metric name="total_revenue">$842,567.00</metric>
    ...
  </summary>
  <top_products>...</top_products>
  <regional_performance>...</regional_performance>
  <action_items>
    <item>Investigate Americas revenue drop...</item>
  </action_items>
</report>
```

For this shape, "specify-output-format + few-shot examples" + parse-on-output is still the right tool. Trying to coerce this into a flat JSON schema loses the visual / authorial hierarchy.

## Few-shot for ambiguous cases (matches D4 cert task area)

The docs' "competitor analysis" example shows the canonical few-shot pattern:

1. Give a *single* fully-worked example output (wrapped in template tags)
2. Then ask Claude to analyze multiple new instances *in the same format*

The Claude 4 best-practices page (see [[docs-claude-4-best-practices-structured-output]]) adds: "Include 3–5 examples for best results" and emphasizes **relevance** + **diversity** + **structure** (wrapped in `<example>` / `<examples>` tags). Few-shot is especially powerful for **ambiguous edge cases** — show the desired behavior on the messy case, not just the clean one.

## Retrieval for contextual consistency

The "IT support" example shows the canonical RAG-output-shape pattern: wrap the knowledge base in `<kb>` tags, then require the output to contain `<kb_entry>...</kb_entry>` referencing the source. This is the prompt-engineered equivalent of [[../05-claude-api/docs-citations]] for cases where the API-level Citations feature can't be used (e.g., outputs need to interleave KB references with prose and free-form structure simultaneously — which Citations + Structured Outputs can't do because they're mutually exclusive).

## Cross-references

- See [[docs-structured-outputs]] — the modern alternative; the page itself acknowledges these techniques are now secondary.
- See [[docs-claude-4-best-practices-structured-output]] — Claude 4.x-specific guidance, including the migration story for prefill-based patterns.
- See [[blog-semantic-vs-schema-errors]] — when JSON.parse succeeds but the data is wrong, you're back to retry-with-feedback even with structured outputs.
- See [[blog-extract-structured-json-cookbook]] — tool_use as a structured-output mechanism, the pre-`output_config.format` canonical pattern.
- See [[../05-claude-api/docs-citations]] — Citations + Structured Outputs are mutually exclusive (400); when that hurts, fall back to the prompt-engineered grounding pattern documented here.

## Open questions / follow-ups

- **Prefill deprecation timeline**: the docs flag this as "not supported on 4.6 / 4.7" but don't say whether 4.5 still allows it. Cert chapter should clarify.
- **XML output token cost vs JSON**: no benchmark in the docs. Likely comparable, but worth noting that XML has higher serialization overhead per node (closing tags + whitespace).
- **Few-shot count for structured outputs**: when `output_config.format` is active, do few-shot examples in the user message still help? Likely yes (they steer *content* not *shape*) but not benchmarked.
- **Retrieval + structured outputs**: docs don't show a combined example. Likely safe (both compose), but PHI guidance from [[docs-structured-outputs]] applies to the schema, not the retrieved content.
