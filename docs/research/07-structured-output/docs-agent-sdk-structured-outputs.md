---
source_url: https://platform.claude.com/docs/en/agent-sdk/structured-outputs
canonical_url: https://code.claude.com/docs/en/agent-sdk/structured-outputs
source_title: Get structured output from agents
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: structured-output
tier: T1-official
cert_domains: [4, 5]
cert_task_areas: ["Validation, retry, feedback loops (semantic vs schema errors)", "Structured output via tool_use + JSON schemas"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Agent SDK — `outputFormat` / `output_format` with validation + retry loop

The Agent SDK's structured-output wrapper layers a **validation-and-retry loop** on top of the raw API. The Claude API's structured-outputs feature uses constrained decoding so the *first* response is schema-valid by construction; the Agent SDK extends that to multi-turn agentic runs where the agent may need to use tools before producing the final structured payload. After all the tool use, the SDK re-prompts on schema mismatch — the explicit place "validation, retry, feedback loops" gets first-class API support.

## Key takeaways

- **Configuration**: `outputFormat` (TS) / `output_format` (Python) on `ClaudeAgentOptions`. Value: `{type: "json_schema", schema: <json-schema-object>}`. Identical shape to the raw API's `output_config.format`.
- **Result discrimination via `subtype`**:
  - `success` — output generated and validated; `message.structured_output` is the typed payload.
  - `error_max_structured_output_retries` — agent exhausted its retry budget. No structured payload. Caller must fall back.
- **Built-in retry loop**: the SDK "validates the output against the schema, re-prompting on mismatch." If it can't get a schema-valid output within the retry limit, the result is the error subtype above (NOT an exception — you check `message.subtype`).
- **Same JSON Schema subset** as the raw API; the docs explicitly link to `structured-outputs#json-schema-limitations`.
- **Zod + Pydantic first-class**: TS uses `z.toJSONSchema(...)` to feed the SDK and `Schema.safeParse(message.structured_output)` to get typed objects back. Python uses `Model.model_json_schema()` to feed the SDK and `Model.model_validate(...)` on the way out. The benefit: full type inference, runtime validation, better error messages, and reusable schemas.
- **Composes with multi-turn tool use**: the canonical example is "find TODOs (Grep), get git blame (Bash), return as a single structured payload." The agent decides what tools to call; the structured output is the *final answer*.
- **Schema design heuristics from the docs**: keep schemas focused (deep nesting + many `required` is the failure mode); match schema to task (make fields optional when source data may not contain them); use clear prompts (ambiguity → schema-violation retries → eventual `error_max_structured_output_retries`).
- **The error subtype isn't just for show**: it's the contract for the cert task area "Validation, retry, feedback loops (semantic vs schema errors)". The SDK handles **schema errors** by retrying. **Semantic errors** (schema-valid JSON with wrong data) are NOT detected — see [[blog-semantic-vs-schema-errors]] in this dossier.

## Quoted (citation-ready)

> "Structured outputs let you define the exact shape of data you want back from an agent. The agent can use any tools it needs to complete the task, and you still get validated JSON matching your schema at the end. Define a JSON Schema for the structure you need, and the SDK validates the output against it, re-prompting on mismatch. If validation does not succeed within the retry limit, the result is an error instead of structured data."
>
> — Get structured output from agents, intro
>
> Anchor: `intro + Structured outputs let you define the exact shape of data`

> "Structured output generation can fail when the agent cannot produce valid JSON matching your schema. This typically happens when the schema is too complex for the task, the task itself is ambiguous, or the agent hits its retry limit trying to fix validation errors."
>
> — Get structured output from agents, Error handling
>
> Anchor: `Error handling + Structured output generation can fail when the agent cannot produce valid JSON`

> "**Tips for avoiding errors:** Keep schemas focused. Deeply nested schemas with many required fields are harder to satisfy. Start simple and add complexity as needed. Match schema to task. If the task might not have all the information your schema requires, make those fields optional. Use clear prompts. Ambiguous prompts make it harder for the agent to know what output to produce."
>
> — Get structured output from agents, Error handling
>
> Anchor: `Error handling + Tips for avoiding errors`

## Result subtype table

| Subtype | Meaning |
|---|---|
| `success` | Output generated and validated successfully; `message.structured_output` is set |
| `error_max_structured_output_retries` | Agent couldn't produce valid output after multiple attempts; structured_output absent |

## SDK shape — TypeScript

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

const FeaturePlan = z.object({
  feature_name: z.string(),
  summary: z.string(),
  steps: z.array(z.object({
    step_number: z.number(),
    description: z.string(),
    estimated_complexity: z.enum(["low", "medium", "high"])
  })),
  risks: z.array(z.string())
});

for await (const message of query({
  prompt: "Plan dark mode for a React app",
  options: { outputFormat: { type: "json_schema", schema: z.toJSONSchema(FeaturePlan) } }
})) {
  if (message.type === "result" && message.subtype === "success" && message.structured_output) {
    const parsed = FeaturePlan.safeParse(message.structured_output);
    if (parsed.success) { /* parsed.data is typed FeaturePlan */ }
  } else if (message.type === "result" && message.subtype === "error_max_structured_output_retries") {
    // fall back: simpler prompt, simpler schema, or unstructured output
  }
}
```

## SDK shape — Python

```python
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage
from pydantic import BaseModel

class FeaturePlan(BaseModel):
    feature_name: str
    summary: str
    steps: list[dict]
    risks: list[str]

async for message in query(
    prompt="Plan dark mode for a React app",
    options=ClaudeAgentOptions(output_format={
        "type": "json_schema",
        "schema": FeaturePlan.model_json_schema(),
    }),
):
    if isinstance(message, ResultMessage):
        if message.subtype == "success" and message.structured_output:
            plan = FeaturePlan.model_validate(message.structured_output)
        elif message.subtype == "error_max_structured_output_retries":
            # fall back
            pass
```

## The "agent can call any tools, then returns structured payload" pattern

Canonical docs example — TODO-tracker agent:

1. Agent receives prompt: "Find TODOs and identify authors"
2. Agent autonomously calls `Grep` to find lines matching `TODO:`
3. Agent autonomously calls `Bash` to run `git blame`
4. Agent assembles result into the schema:
   ```json
   {
     "todos": [{"text": "...", "file": "...", "line": 12, "author": "...", "date": "..."}],
     "total_count": 4
   }
   ```
5. SDK validates against schema (note `author` and `date` are optional — git-blame may not be available)
6. SDK returns `ResultMessage(subtype="success", structured_output={...})`

This is the cert-exam canonical "Claude as ETL stage in an agentic pipeline" — agent has tool freedom in the middle, but the contract at the boundary is a strict JSON schema.

## Schema-design heuristics encoded in the docs

1. **Mark optional what might be missing.** The TODO example marks `author` and `date` optional because git-blame can fail. **DON'T** make a field `required` just because you "want" it — make it required only when the source data **always** has it. This is the most under-emphasized lesson in the docs.
2. **Flatten before you go deep.** Nested-object-of-nested-objects with all-required leaves is the classic recipe for `error_max_structured_output_retries`.
3. **Resolve ambiguity in the prompt, not via more schema constraints.** Tightening the schema doesn't fix an ambiguous task; the agent just retries and eventually errors. Clarify the user prompt instead.
4. **Use Zod / Pydantic.** The runtime validation step is what lets you reject `success` payloads that pass the API's grammar but fail your fuller constraints (e.g., `minLength` that was stripped by the SDK).

## Cross-references

- See [[docs-structured-outputs]] for the raw-API equivalent (`output_config.format`) — same JSON Schema subset, no retry loop.
- See [[docs-strict-tool-use]] — the Agent SDK uses strict tool use internally for the agent's tool calls; the structured output applies to the *final* answer after the tool-using loop finishes.
- See [[docs-increase-output-consistency]] — the prompt-engineering alternatives if you don't want to use structured outputs at all (XML tags, prefill, retrieval, few-shot).
- See [[../04-agent-sdk/]] — referenced for SDK setup, hooks, and the broader `ClaudeAgentOptions` surface.
- See [[blog-semantic-vs-schema-errors]] — why `success` doesn't mean correct, and what to do about it.

## Open questions / follow-ups

- **Retry-limit number**: the docs say "multiple attempts" but don't disclose the exact retry budget. Worth instrumenting an SDK run with a deliberately tough schema to learn the count empirically.
- **Retry-feedback shape**: does the SDK feed the validation error back to the model as part of the retry, or does it just re-issue the same prompt? The phrase "re-prompting on mismatch" suggests the former. Either way, a chapter could show the message-history shape during a retry run.
- **Cost of retries**: each retry is a full additional inference, so a 3-retry exhausted run is ~4× the cost of a successful one-shot. Not noted in the docs; finance chapters should be explicit.
- **Comparison to OpenAI's structured outputs**: OpenAI's `response_format: {type: "json_schema", strict: true}` has near-identical semantics. The Agent SDK retry behavior is the Claude-specific value-add.
- **The Code SDK's structured output also wraps Codex tools** — would a similar wrapper work for arbitrary `query()` use with MCP servers? Docs imply yes; worth verifying with an MCP+structured-output example.
