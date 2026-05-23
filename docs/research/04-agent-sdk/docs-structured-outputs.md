---
source_url: https://code.claude.com/docs/en/agent-sdk/structured-outputs
canonical_url: https://code.claude.com/docs/en/agent-sdk/structured-outputs
source_title: Get structured output from agents
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: agent-sdk
tier: T1-official
cert_domains: [4]
cert_task_areas: ["Structured output via tool_use + JSON schemas", "Validation, retry, feedback loops"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Structured outputs — `outputFormat` with JSON Schema, Zod, and Pydantic

The agent can use any tools it needs and still return validated JSON matching your schema as the final result.

## Key takeaways

- **Configure with `outputFormat`** (TS) / `output_format` (Python). Shape: `{ type: "json_schema", schema: <JSON Schema> }`.
- **Validated output appears on `ResultMessage.structured_output`** — present only on the `success` subtype.
- **Validation retries are bounded**. If validation fails after the retry limit, `ResultMessage.subtype` becomes `error_max_structured_output_retries`.
- **Schema generation helpers**: `z.toJSONSchema(...)` for Zod (TS) or `Model.model_json_schema()` for Pydantic (Python). Then runtime-validate with `safeParse()` / `model_validate()` for full type safety.
- **Multi-step tool use works**: the agent calls Grep, Bash, Read, Edit, etc. on the way to the structured result. Optional schema fields stay omitted when info isn't available.
- **Supported JSON Schema features**: all basic types (object, array, string, number, boolean, null), `enum`, `const`, `required`, nested objects, and `$ref` definitions. Full feature list and limitations: `/en/build-with-claude/structured-outputs#json-schema-limitations` on platform docs.

## Quoted (citation-ready)

> "Structured outputs let you define the exact shape of data you want back from an agent. The agent can use any tools it needs to complete the task, and you still get validated JSON matching your schema at the end."
>
> — Get structured output from agents, opening paragraph
>
> Anchor: `Get structured output from agents + Structured outputs let you define`

> "If validation does not succeed within the retry limit, the result is an error instead of structured data."
>
> — Get structured output from agents, opening paragraph
>
> Anchor: `Get structured output from agents + If validation does not succeed within the retry limit`

## Quick start (Python with Pydantic)

```python
from pydantic import BaseModel
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage

class FeaturePlan(BaseModel):
    feature_name: str
    summary: str
    steps: list[dict]
    risks: list[str]

async for message in query(
    prompt="Plan how to add dark mode support to a React app.",
    options=ClaudeAgentOptions(
        output_format={
            "type": "json_schema",
            "schema": FeaturePlan.model_json_schema(),
        }
    ),
):
    if isinstance(message, ResultMessage) and message.structured_output:
        plan = FeaturePlan.model_validate(message.structured_output)
        print(plan.feature_name)
```

## Error handling

| Subtype | Meaning |
|---|---|
| `success` | Output was generated and validated successfully |
| `error_max_structured_output_retries` | Agent couldn't produce valid output after multiple attempts |

Both subtypes always include `total_cost_usd`, `usage`, `num_turns`, `session_id`.

The page's tips for avoiding errors:

- **Keep schemas focused.** Deeply nested schemas with many required fields are harder to satisfy.
- **Match schema to task.** Mark fields optional when the task might not have all the data.
- **Use clear prompts.** Ambiguous prompts make it harder for the agent to know what to produce.

## Cross-references

- See [[docs-agent-loop]] for the full `ResultMessage.subtype` enum (`error_max_structured_output_retries` is one of five).
- See `02-mcp-spec/spec-tools.md` for the underlying tool-output content shape that JSON Schema validation extends.
- See `docs/research/07-structured-output/` (forthcoming) for the broader API-level structured-output mechanism — the SDK's `outputFormat` reuses the Anthropic API's structured-output feature.

## Open questions / follow-ups

- The page does not document **retry budget** (how many retries before `error_max_structured_output_retries`?). Worth a follow-up — likely surfaces in the Python/TS reference field somewhere.
- "Standard JSON Schema features" list is short; the limitations link at `/en/build-with-claude/structured-outputs#json-schema-limitations` is the canonical source for what's NOT supported (recursion limits, etc.). Defer to platform-docs research.
- Combining structured outputs with custom tools / multi-step research is the rich pattern — the page hints at it but doesn't have a full case study. Worth chapter-author work.
