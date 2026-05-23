---
source_url: https://platform.claude.com/docs/en/build-with-claude/structured-outputs
canonical_url: https://platform.claude.com/docs/en/build-with-claude/structured-outputs
source_title: Structured outputs
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: structured-output
tier: T1-official
cert_domains: [4, 5]
cert_task_areas: ["Structured output via tool_use + JSON schemas", "Validation, retry, feedback loops (semantic vs schema errors)"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Structured outputs — `output_config.format` and strict tool use

The dedicated Structured Outputs page. The cert PDF (v0.1) talks about validation/retry loops in the abstract; in May 2026 the API has shipped a **constrained-decoding** primitive that eliminates schema-violation retries entirely. There are now **two complementary features** behind the same docs page: `output_config.format` (free-form Claude response coerced to JSON) and `strict: true` on tool definitions (covered in [[docs-strict-tool-use]]).

## Key takeaways

- **Two features, one page**: `output_config.format` constrains Claude's *response* to a JSON schema; `strict: true` constrains Claude's *tool calls* to a JSON schema. They compose in a single request.
- **GA across the lineup**: Claude Mythos Preview, Opus 4.7 / 4.6 / 4.5, Sonnet 4.6 / 4.5, Haiku 4.5. Platform availability varies (Claude API + Claude Platform on AWS guaranteed; Bedrock/Vertex/Foundry vary).
- **Beta header retired in favor of stable param**: the old `structured-outputs-2025-11-13` beta header + `output_format` parameter still work during a transition window but the recommended shape is `output_config: {format: {type: "json_schema", schema: {...}}}`.
- **Mechanism is grammar-constrained sampling**: Anthropic compiles your JSON Schema into a grammar and constrains token selection at decode time. There is a **first-request grammar-compilation latency** but compiled grammars are **cached for 24 hours from last use**. Cache invalidates on `schema` or tool-set change; name/description changes do NOT invalidate.
- **Schema subset, not full Draft 2020-12**: object / array / string / integer / number / boolean / null; `enum`, `const`, `anyOf`, `allOf` (no `$ref` inside `allOf`), `$ref` / `$defs` / `definitions` (no *external* refs), `default`, string formats (`date-time`, `time`, `date`, `duration`, `email`, `hostname`, `uri`, `ipv4`, `ipv6`, `uuid`), regex patterns (no backrefs / lookahead / lookbehind / `\b`). `required` + `additionalProperties: false` are **mandatory** on every object. Numerical (`minimum`/`maximum`/`multipleOf`) and string-length constraints **not supported**; SDKs strip them and inject the constraint into the *description* instead, then validate after the call.
- **`additionalProperties: false` is required on every object node**, full stop. This is the most common 400 cause for hand-authored schemas.
- **Required vs optional and property ordering**: required properties appear first in the output, then optional ones, regardless of declaration order. Optionality is per the JSON Schema `required` array — there is no separate "nullable" toggle, but you can model nullable as `{"type": ["string", "null"]}` or via `anyOf`.
- **Hard limits per request**: 20 strict tools, 24 total optional parameters across strict schemas, 16 parameters using union types (`anyOf` or type arrays). Beyond these, plus an internal compiled-grammar size cap → **400 "Schema is too complex for compilation"**.
- **Refusal still wins**: if Claude refuses (`stop_reason: "refusal"`), the response is **200** and **billed** but the output may not match the schema. `stop_reason: "max_tokens"` is the other partial-output failure mode — retry with a higher `max_tokens`.
- **Feature compatibility**: works with **Batch (50% off), token counting, streaming, vision, prompt caching**. **Incompatible** with the `stop` parameter and (per [[../05-claude-api/docs-citations]]) with Citations on user-supplied document blocks (returns 400). Changing `output_config.format` invalidates the conversation's prompt cache.
- **Five SDK paths**: Python `client.messages.parse()` (Pydantic), TypeScript `messages.parse()` with `zodOutputFormat()` / `jsonSchemaOutputFormat()`, Ruby `Anthropic::BaseModel`, Java `outputConfig(Class<T>)`, PHP `StructuredOutputModel`. Each transforms your schema to the supported subset on the way out and validates the response against the full schema (including stripped constraints) on the way in.
- **ZDR + HIPAA caveat**: schemas are temporarily cached up to 24h for grammar reuse; **PHI must not be included in schema definitions** (property names, enums, consts, regex patterns). PHI is allowed only in message content.

## Quoted (citation-ready)

> "Structured outputs constrain Claude's responses to follow a specific schema, ensuring valid, parseable output for downstream processing. They provide two complementary features: JSON outputs (`output_config.format`): Get Claude's response in a specific JSON format. Strict tool use (`strict: true`): Guarantee schema validation on tool names and inputs."
>
> — Structured outputs, Overview
>
> Anchor: `Overview + Structured outputs constrain Claude's responses to follow a specific schema`

> "Structured outputs guarantee schema-compliant responses through constrained decoding: Always valid: No more JSON.parse() errors. Type safe: Guaranteed field types and required fields. Reliable: No retries needed for schema violations."
>
> — Structured outputs, How It Works
>
> Anchor: `How It Works + Structured outputs guarantee schema-compliant responses through constrained decoding`

> "**Important:** The `output_format` parameter has moved to `output_config.format`. The old beta header (`structured-outputs-2025-11-13`) and `output_format` parameter will continue working during a transition period, but you should migrate to the new shape."
>
> — Structured outputs, API Parameter Migration
>
> Anchor: `API Parameter Migration + The output_format parameter has moved`

> "**Result of unsupported features:** You'll receive a 400 error with details."
>
> — Structured outputs, JSON Schema Requirements → Not Supported
>
> Anchor: `Not Supported + You'll receive a 400 error with details`

> "First request latency: Additional latency while grammar compiles. Automatic caching: Compiled grammars cached for 24 hours from last use. Cache invalidation: Occurs if you change the JSON schema structure or set of tools. Changing only `name` or `description` fields does NOT invalidate cache."
>
> — Structured outputs, Important Considerations → Grammar Compilation and Caching
>
> Anchor: `Grammar Compilation and Caching + First request latency`

> "Refusals (`stop_reason: "refusal"`): Response has stop_reason: 'refusal'. 200 status code. Billed for tokens generated. Output may not match schema (refusal takes precedence). Token limit reached (`stop_reason: "max_tokens"`): Response has stop_reason: 'max_tokens'. Output may be incomplete and not match schema. Retry with higher max_tokens."
>
> — Structured outputs, Invalid Outputs
>
> Anchor: `Invalid Outputs + Refusals`

> "HIPAA eligible, but PHI must not be included in JSON schema definitions. PHI should only appear in message content (prompts and responses)."
>
> — Structured outputs, Data Retention
>
> Anchor: `Data Retention + HIPAA eligible, but PHI must not be included in JSON schema definitions`

## API shape — JSON outputs

```json
POST /v1/messages
{
  "model": "claude-opus-4-7",
  "max_tokens": 1024,
  "messages": [
    {"role": "user", "content": "Extract: John Smith (john@example.com) wants Enterprise plan + demo Tuesday 2pm."}
  ],
  "output_config": {
    "format": {
      "type": "json_schema",
      "schema": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "email": {"type": "string"},
          "plan_interest": {"type": "string"},
          "demo_requested": {"type": "boolean"}
        },
        "required": ["name", "email", "plan_interest", "demo_requested"],
        "additionalProperties": false
      }
    }
  }
}
```

Response: valid JSON matching the schema is in `response.content[0].text`.

## Composing JSON outputs + strict tool use in one request

```python
response = client.messages.create(
    model="claude-opus-4-7", max_tokens=1024, messages=[...],
    output_config={"format": {"type": "json_schema", "schema": {
        "type": "object",
        "properties": {
            "summary": {"type": "string"},
            "next_steps": {"type": "array", "items": {"type": "string"}},
        },
        "required": ["summary", "next_steps"],
        "additionalProperties": False,
    }}},
    tools=[{"name": "search_flights", "strict": True, "input_schema": {...}}]
)
```

`output_config` controls *what Claude says*. `strict: true` controls *how Claude calls your functions*. Different problems, same grammar-constrained-decoding pipeline.

## JSON Schema subset reference

| Feature | Supported? |
|---|---|
| `object`, `array`, `string`, `integer`, `number`, `boolean`, `null` | ✅ |
| `enum` (strings / numbers / bools / nulls) | ✅ |
| `const` | ✅ |
| `anyOf` | ✅ |
| `allOf` (without `$ref`) | ✅ |
| `$ref` / `$defs` / `definitions` (internal) | ✅ |
| External `$ref` (`http://…`) | ❌ |
| Recursive schemas | ❌ |
| Numerical constraints (`minimum`/`maximum`/`multipleOf`) | ❌ |
| String constraints (`minLength`/`maxLength`) | ❌ |
| `minItems` other than 0 / 1 | ❌ |
| `additionalProperties` other than `false` | ❌ |
| String formats: `date-time`, `time`, `date`, `duration`, `email`, `hostname`, `uri`, `ipv4`, `ipv6`, `uuid` | ✅ |
| Regex backrefs (`\1`), lookaround (`(?=…)`), word boundaries (`\b`) | ❌ |
| Regex `*`, `+`, `?`, simple `{n,m}`, char classes, groups, `^…$` | ✅ |

When an SDK helper is used, **unsupported constraints are silently stripped from the schema sent to the API**, encoded as description-text instead ("Must be at least 100"), and the original schema is used for **client-side post-validation**. This is the closest thing the API provides to "soft constraints with retry": the constraint isn't enforced by the decoder but the SDK round-trip catches violations.

## Schema-complexity limits

| Limit | Value | Notes |
|---|---|---|
| Strict tools per request | 20 | Non-strict tools don't count |
| Optional parameters across strict schemas | 24 | Cumulative |
| Parameters using union types (`anyOf` or `[type, …]`) | 16 | Cumulative |
| Compiled-grammar size | internal | Exceeding it returns 400 `Schema is too complex for compilation` |

If you hit the cap: mark fewer tools strict, prefer required over optional, flatten nested objects, or split into multiple sequential requests.

## Property ordering

Per the docs, "required properties appear first, followed by optional properties." So a schema with `required: ["name", "email"]` and additional optional `notes`, `age` will return:

```
{ "name": ..., "email": ..., "notes": ..., "age": ... }
```

regardless of the order in which they're declared in `properties`. Implication: when sample-snapshotting outputs for tests, don't rely on declaration order to drive expected key order.

## Cross-references

- See [[docs-strict-tool-use]] — `strict: true` on tool definitions, full deep-dive.
- See [[blog-extract-structured-json-cookbook]] — the **older** tool_use-as-structured-output pattern that this feature subsumes (with one important difference: when you don't need to constrain Claude's *response*, the cookbook pattern with a single forced tool is still simpler and is still recommended for D4 "structured extraction" use cases).
- See [[docs-agent-sdk-structured-outputs]] — Agent SDK wrapper which adds a retry loop on top.
- See [[../05-claude-api/docs-citations]] — Citations + Structured Outputs return **400** (Anchor `Feature compatibility + Citations cannot be used together with Structured Outputs`).
- See [[../05-claude-api/docs-batch-api]] — batch + structured outputs compose (50% off); see [[blog-batch-structured-output-pattern]].
- See [[../03-advanced-tool-use/docs-define-tools]] for non-strict tool definition (Best Practices: "Provide extremely detailed descriptions").
- See [[docs-increase-output-consistency]] for the prompt-engineering fallback when strict schemas don't fit (XML tags, prefill, examples, retrieval).

## Open questions / follow-ups

- **Refusal handling**: docs are explicit that refusals override schema compliance and you ARE billed. No documented automatic-retry behavior — callers must handle 200 + `stop_reason: refusal` explicitly. Worth a chapter snippet that wraps the SDK call and detects this case.
- **`output_format` deprecation window**: docs say "continue working during a transition period" without a date. Watch for changelog announcements; chapters should use `output_config.format` going forward.
- **External `$ref` for security**: the explicit "external $ref not supported" hardens against SSRF; aligns with the MCP 2026-07-28 RC's posture (do-not-auto-dereference for tool input schemas).
- **Per-platform availability matrix**: docs say "Availability varies by platform" but don't enumerate which models support structured outputs on Bedrock vs Vertex vs Foundry. Cross-check with each cloud's docs before committing to a chapter example.
- **The `default` property** is listed as supported but the docs don't explain its behavior under constrained decoding — does Claude *use* the default when uncertain, or does it always emit a value? Worth empirical verification.
- **Token cost of the injected system prompt**: docs say "slightly higher" without a number, unlike tool use which publishes 346/313. A specific number would help chapters comparing costs across approaches.
