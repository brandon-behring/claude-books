---
source_url: https://platform.claude.com/cookbook/tool-use-extracting-structured-json
canonical_url: https://platform.claude.com/cookbook/tool-use-extracting-structured-json
source_title: Extracting Structured JSON using Claude and Tool Use
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: structured-output
tier: T1-official
cert_domains: [4]
cert_task_areas: ["Structured output via tool_use + JSON schemas"]
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Cookbook — Extracting structured JSON via tool_use

The canonical "tool_use as structured-output mechanism" reference. Pre-dates the `output_config.format` Structured Outputs feature but is still the right pattern for several use cases:

- **Schema-flexible extraction** (using `additionalProperties: true` to allow open-ended fields), which structured outputs **doesn't support** (it requires `additionalProperties: false`)
- **Single-shot extraction without grammar-compile latency** on cold cache
- **Educational / cookbook reasoning** about how the agentic loop binds to schema-shaped data

The five worked examples are the canonical D4 "Structured output via tool_use + JSON schemas" reference for the cert.

## Key takeaways

- **Five extraction patterns documented**:
  1. **Article summarization** — author + topics array + summary + numeric coherence/persuasion scores + counterpoint
  2. **Named entity recognition (NER)** — array of entities with name, type (PERSON/ORG/LOCATION), context
  3. **Sentiment analysis** — three numeric scores (positive / negative / neutral)
  4. **Text classification** — array of category objects with `name` + `score`
  5. **Character characteristics with `additionalProperties: true`** — open-ended attribute extraction
- **Pattern**: define a "print_X" tool that takes the extracted data as its input; force Claude to call it; the `tool_use.input` IS the extracted JSON. Discard the tool result.
- **Force the tool call**: `tool_choice: {"type": "tool", "name": "print_summary"}` — guarantees the extraction happens (and only the extraction).
- **Why "print_X" naming**: the convention signals to Claude that the tool's role is to *commit* the extracted data, not to take an action with side effects. Cookbook recommends descriptive tool names (`print_entities`, `print_classification`, `print_all_characteristics`) which double as Claude-readable behavior hints.
- **Optional fields** modeled via the `required` array — anything not listed in `required` is implicitly optional. Claude omits it from `input` when source data lacks the info.
- **Open-ended schema**: `"input_schema": {"type": "object", "additionalProperties": true}` — Claude generates arbitrary key-value pairs (e.g., height, facial_hair, voice for a character description). **NOT compatible with structured outputs** (which requires `additionalProperties: false`); this is the niche where the older tool_use pattern survives.

## Quoted (citation-ready)

> "If you want to get structured JSON data without using tools, take a look at our 'How to enable JSON mode' cookbook."
>
> — Extracting Structured JSON using Claude and Tool Use, intro link
>
> Anchor: `cookbook intro + If you want to get structured JSON data without using tools`

(The cookbook is mostly code; the citation-ready quotes are from the prose intro and the per-example narrative.)

## Pattern reference — article summarization

```python
tools = [{
    "name": "print_summary",
    "description": "Prints a summary of the article.",
    "input_schema": {
        "type": "object",
        "properties": {
            "author": {"type": "string", "description": "Name of the article author"},
            "topics": {
                "type": "array",
                "items": {"type": "string"},
                "description": 'Array of topics, e.g. ["tech", "politics"]. Should be as specific as possible, and can overlap.'
            },
            "summary": {"type": "string", "description": "Summary of the article. One or two paragraphs max."},
            "coherence": {"type": "integer", "description": "Coherence of the article's key points, 0-100 (inclusive)"},
            "persuasion": {"type": "number", "description": "Article's persuasion score, 0.0-1.0 (inclusive)"}
        },
        "required": ["author", "topics", "summary", "coherence", "persuasion", "counterpoint"]
    }
}]

resp = client.messages.create(
    model="claude-opus-4-7", max_tokens=4096,
    tools=tools,
    messages=[{"role": "user", "content": f"<article>{ARTICLE}</article>\n\nUse the print_summary tool."}],
)

# Extraction:
json_summary = next(b.input for b in resp.content if b.type == "tool_use" and b.name == "print_summary")
```

## Pattern reference — NER (nested array of objects)

```json
{
  "name": "print_entities",
  "input_schema": {
    "type": "object",
    "properties": {
      "entities": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": {"type": "string"},
            "type": {"type": "string", "description": "e.g., PERSON, ORGANIZATION, LOCATION"},
            "context": {"type": "string"}
          },
          "required": ["name", "type", "context"]
        }
      }
    }
  }
}
```

For modern code, the recommended migration is: same schema, add `strict: true`, then use `tool_choice: {type: "tool", name: "print_entities"}` for guaranteed extraction.

## Pattern reference — open-ended attributes (`additionalProperties: true`)

```python
tools = [{
    "name": "print_all_characteristics",
    "description": "Prints all characteristics which are provided.",
    "input_schema": {"type": "object", "additionalProperties": True}
}]

resp = client.messages.create(
    model="claude-opus-4-7", max_tokens=4096, tools=tools,
    tool_choice={"type": "tool", "name": "print_all_characteristics"},
    messages=[{"role": "user", "content": (
        "Given a description of a character, your task is to extract all the characteristics "
        "of them and print them using the print_all_characteristics tool.\n\n"
        "<description>The man is tall, standing at 6'2... has dark, wavy hair... full beard..."
        "His voice is deep and resonant.</description>"
    )}],
)
# Returns: {"height": "6'2\"", "hair_color": "dark", "hair_style": "wavy", "facial_hair": "full beard", ...}
```

**This is the canonical "I don't know what fields will be present" pattern.** Structured outputs CANNOT do this — it requires `additionalProperties: false`. For open-ended schemas, tool_use stays the right tool.

## Mental model — tool_use vs structured outputs

| Scenario | Recommendation |
|---|---|
| Closed schema, known fields, want strict guarantees | `output_config.format` (structured outputs) OR `strict: true` + forced `tool_choice` |
| Closed schema, classification with `enum` | `strict: true` + `tool_choice: {type: "tool"}` (more explicit than structured outputs response coercion) |
| Open-ended fields (`additionalProperties: true`) | Tool_use without `strict` (cookbook pattern) |
| One of N possible shapes (`tool_choice: any` over multiple strict tools) | `tool_choice: {type: "any"}` + `strict: true` per tool |
| Mid-agentic-loop side-effecting tool call | Regular tool_use, optionally with `strict: true` |
| Token-budget-sensitive (cold-cache grammar compile is unacceptable) | Tool_use cookbook pattern without `strict` |

## Schema design heuristics (cookbook-implicit)

1. **Provide `description` on every field**, including atomic ones. The cookbook fills description fields even when the field is "obvious" (e.g., `"author"`) because descriptions are the dominant performance lever — same lesson as in [[../03-advanced-tool-use/docs-define-tools]].
2. **Specify number ranges in description text**, not in numerical constraints (`minimum`/`maximum`). Even pre-structured-outputs this was best practice; with structured outputs the constraint is *stripped* anyway by SDKs.
3. **For arrays of nested objects, mark inner-object fields `required` even if you might omit some.** The outer optionality (whether the entity exists) is handled by the array; the inner schema should be tight.
4. **For ambiguity, document the disambiguation policy in the field's `description`** — e.g., "Use 'unknown' if the speaker cannot be identified" or "If multiple values apply, return the most specific one."
5. **Use `enum` for closed categorical fields.** Strict mode + `enum` gives token-level grammar-constrained classification — no post-hoc fuzzy matching needed.

## Cross-references

- See [[docs-structured-outputs]] — the modern alternative for closed schemas; the cookbook pattern is the right fallback for open-ended schemas.
- See [[docs-strict-tool-use]] — `strict: true` is the cookbook pattern's "version 2" for closed schemas.
- See [[../03-advanced-tool-use/docs-define-tools]] — the canonical "Best Practices for Tool Definitions" reference; the cookbook follows those rules.
- See [[../03-advanced-tool-use/blog-tool-use-examples]] — `input_examples` complements the cookbook pattern by showing Claude when to include optional fields.
- See [[docs-claude-4-best-practices-structured-output]] — recommends "tools with an enum field containing your valid labels" for classification, codifying the cookbook pattern.

## Open questions / follow-ups

- **When is the cookbook pattern *better* than structured outputs?** Beyond the open-ended-fields niche, there's no Anthropic-published benchmark comparing the two. Hypothesis: structured outputs is always better for closed schemas (grammar guarantees + caching), but tool_use is better for cases where you don't want to be billed for refusals while the model resolves a hard task.
- **Migration recipe**: a "convert this cookbook example to structured outputs" walkthrough doesn't exist. Worth a chapter snippet showing the line-by-line transformation.
- **`additionalProperties: true` on Mythos / 4.7**: confirmed to still work (no docs change), but no benchmark on whether it improves with stricter schemas vs more permissive ones.
