---
source_url: https://platform.claude.com/docs/en/api/openai-sdk
canonical_url: https://platform.claude.com/docs/en/api/openai-sdk
source_title: OpenAI SDK compatibility (structured-output excerpts)
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

# OpenAI SDK compatibility — structured-output gotchas

Sharp-edged compatibility note. Anthropic provides an OpenAI-SDK-compatible layer so teams can swap base URL + API key and start testing. **For structured outputs specifically, this compatibility layer DOES NOT preserve the guarantees** — the relevant OpenAI fields are silently ignored. Anyone migrating an existing OpenAI structured-output pipeline to Claude needs to swap to the native Claude API + `output_config.format` to get back the guarantees they had.

## Key takeaways

- **`response_format` is IGNORED** on the OpenAI SDK compat layer. For JSON output → use native Claude API + [[docs-structured-outputs]].
- **`strict` on tools is IGNORED**. Both the `tools[n].function.strict` and the deprecated `functions[n].strict` are ignored. For guaranteed schema validation → use native Claude API + [[docs-strict-tool-use]].
- **No errors, just silent fallback**: "Most unsupported fields are silently ignored rather than producing errors." This is the dangerous part — code that *was* getting strict guarantees on OpenAI will appear to work on Claude via the compat layer but actually produce occasional schema violations.
- **Other relevant ignored fields**: `prediction`, `logprobs`, `logit_bias`, `seed`, `service_tier`, `reasoning_effort`. The Claude-native pattern for thinking/effort is `extra_body={"thinking": {"type": "enabled", "budget_tokens": 2000}}`.
- **System / developer messages are hoisted**: OpenAI lets system messages appear anywhere; Claude requires a single initial system message, so the compat layer **concatenates all of them at the start** with `\n` separators. This can change behavior of role-prompt-relies-on-position patterns.
- **The fix is documented inline**: every ignored structured-output field's docs row links to "use Structured Outputs with native Claude API".

## Quoted (citation-ready)

> "The `strict` parameter for function calling is ignored, which means the tool use JSON is not guaranteed to follow the supplied schema. For guaranteed schema conformance, use the native Claude API with Structured Outputs."
>
> — OpenAI SDK compatibility, Important OpenAI compatibility limitations → API behavior
>
> Anchor: `API behavior + The strict parameter for function calling is ignored`

> "`response_format`: Ignored. For JSON output, use Structured Outputs with the native Claude API"
>
> — OpenAI SDK compatibility, Simple fields table
>
> Anchor: `Simple fields + response_format Ignored`

> "`strict`: Ignored. Use Structured Outputs with native Claude API for strict schema validation"
>
> — OpenAI SDK compatibility, tools[n].function fields / functions[n] fields tables
>
> Anchor: `tools fields + strict Ignored`

> "Most unsupported fields are silently ignored rather than producing errors."
>
> — OpenAI SDK compatibility, API behavior
>
> Anchor: `API behavior + Most unsupported fields are silently ignored`

## Migration table — OpenAI structured-output features → Claude native

| OpenAI SDK | Claude compat behavior | Native Claude API replacement |
|---|---|---|
| `response_format: {type: "json_object"}` | Ignored | Use `output_config: {format: {type: "json_schema", schema: ...}}` ([[docs-structured-outputs]]) |
| `response_format: {type: "json_schema", json_schema: {...}}` | Ignored | Same as above (note Claude uses `output_config.format` not `response_format`) |
| `tools[n].function.strict: true` | Ignored | Use top-level `strict: true` on tool definition ([[docs-strict-tool-use]]) |
| `functions[n].strict: true` | Ignored | Same — also note `functions` is deprecated in OpenAI itself |

## Anti-pattern: false sense of security in production

A team migrates from OpenAI with this code:

```python
client = OpenAI(api_key=ANTHROPIC_KEY, base_url="https://api.anthropic.com/v1/")
resp = client.chat.completions.create(
    model="claude-opus-4-7",
    messages=[...],
    response_format={"type": "json_schema", "json_schema": {"name": "extract", "schema": SCHEMA, "strict": True}}
)
data = json.loads(resp.choices[0].message.content)
```

The code **runs**. Sometimes the output is even valid JSON. But:
- `response_format` is **silently dropped**.
- The schema is **not enforced**.
- Production sees ~5% schema violations and 0.5% non-JSON output, surfacing as `JSON.parse` errors in flaky downstream services.

The fix is to switch to native Anthropic SDK:

```python
client = anthropic.Anthropic()
resp = client.messages.create(
    model="claude-opus-4-7", max_tokens=4096,
    messages=[...],
    output_config={"format": {"type": "json_schema", "schema": SCHEMA}}
)
data = json.loads(resp.content[0].text)
```

The output is now grammar-guaranteed to be schema-valid (modulo `stop_reason: refusal` or `max_tokens`).

## Cross-references

- See [[docs-structured-outputs]] for the native replacement.
- See [[docs-strict-tool-use]] for the native tool-strict replacement.
- See [[../05-claude-api/docs-tool-use]] — broader API surface; the compat layer covers basic `tool_choice` modes but loses the strict-input guarantees.
- See [[docs-claude-4-best-practices-structured-output]] — `extra_body` is the documented place to pass Anthropic-only params through the OpenAI SDK (e.g., `thinking`).

## Open questions / follow-ups

- **Auto-warning for users of the compat layer**: docs flag this clearly but no telemetry / warning is emitted at API level. A request to Anthropic to consider returning a soft-deprecation header (`X-Anthropic-Ignored: response_format,strict`) would help migration.
- **OpenAI's structured outputs `strict: true` GA timeline vs Claude's**: Claude's structured outputs went GA on the same generation that OpenAI's did, but the OpenAI compat layer was designed before structured outputs existed and hasn't been updated. The semantics are likely intentional (compat layer is testing-only) but it's worth a note in any "migrate from OpenAI" chapter.
- **Latency comparison**: when running the same schema through OpenAI compat vs native Claude, native Claude pays first-call grammar-compile latency that OpenAI compat doesn't (because compat ignores the schema entirely). For benchmark-comparison work, this is a confounder.
