---
source_url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use
canonical_url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use
source_title: Strict tool use
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: structured-output
tier: T1-official
cert_domains: [2, 4]
cert_task_areas: ["Structured output via tool_use + JSON schemas", "Validation, retry, feedback loops (semantic vs schema errors)"]
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Strict tool use — `strict: true` on tool definitions

This is the dedicated docs page that `03-advanced-tool-use/` referenced but didn't cover deeply. Setting `strict: true` on a tool definition guarantees Claude's tool *inputs* (the JSON object passed as the `input` to a `tool_use` block) match your `input_schema` exactly, using the same grammar-constrained-sampling pipeline as [[docs-structured-outputs]]. The schema subset, the compile-and-cache behavior, and the per-request limits are all identical — strict tool use IS structured outputs, applied to the `tool_use.input` instead of the final assistant text.

## Key takeaways

- **Strict tool use is the right primitive for agentic workflows.** Without it, Claude can produce schema-shape but wrong-type inputs (`"2"` instead of `2`) or omit required fields, breaking your downstream function with a runtime error.
- **Top-level `strict: true` is the only API change** required at the tool-definition level (alongside `name`, `description`, `input_schema`). No headers, no separate `tool_choice` setting needed.
- **Two guarantees**: (a) tool `input` strictly follows the `input_schema`, (b) tool `name` is always one of the provided tools (or a server tool). Conflated together this is what eliminates "phantom-tool" hallucinations.
- **The supported-schema subset is shared with structured outputs** ([[docs-structured-outputs]]) — same allow-list (`additionalProperties: false` required on every object, etc.), same caching (24h since last use), same compile-time grammar costs on first call.
- **20 strict-tools-per-request cap; 24 cumulative-optional-parameters cap; 16 union-types cap.** Beyond → 400. Mark only critical tools strict to stay inside.
- **Composes with `tool_choice: any`**: when you need "must use a tool AND inputs are schema-valid", combine `tool_choice: {type: "any"}` + `strict: true` on every tool. (See [[../03-advanced-tool-use/docs-define-tools]] for the `tool_choice` mode reference.)
- **HIPAA-eligible with the same PHI caveat as structured outputs**: schemas are cached separately from message content, so PHI must NOT appear in `input_schema` property names, enum values, const values, or pattern regexes. Only message content gets HIPAA protections.
- **Available across the lineup** (same matrix as structured outputs).
- **NOT available on `mcp_toolset`** (per the tool reference page noted in [[../03-advanced-tool-use/docs-define-tools]]).

## Quoted (citation-ready)

> "Setting `strict: true` on a tool definition guarantees Claude's tool inputs match your JSON Schema by constraining the model's token sampling to schema-valid outputs (a technique called grammar-constrained sampling)."
>
> — Strict tool use, intro
>
> Anchor: `Strict tool use intro + Setting strict true on a tool definition guarantees Claude's tool inputs`

> "Building reliable agentic systems requires guaranteed schema conformance. Without strict mode, Claude might return incompatible types ('2' instead of 2) or missing required fields, breaking your functions and causing runtime errors."
>
> — Strict tool use, Why strict tool use matters for agents
>
> Anchor: `Why strict tool use matters for agents + Building reliable agentic systems requires guaranteed schema conformance`

> "Strict tool use guarantees type-safe parameters: Functions receive correctly-typed arguments every time. No need to validate and retry tool calls. Production-ready agents that work consistently at scale."
>
> — Strict tool use, Why strict tool use matters for agents
>
> Anchor: `Why strict tool use matters for agents + Strict tool use guarantees type-safe parameters`

> "Strict tool use compiles tool input_schema definitions into grammars using the same pipeline as structured outputs. Tool schemas are temporarily cached for up to 24 hours since last use. Prompts and responses are not retained beyond the API response."
>
> — Strict tool use, Data retention
>
> Anchor: `Data retention + Strict tool use compiles tool input_schema definitions into grammars`

> "Do not include PHI in `input_schema` property names, `enum` values, `const` values, or `pattern` regular expressions."
>
> — Strict tool use, Data retention
>
> Anchor: `Data retention + Do not include PHI in input_schema property names`

## API shape

Single tool, with `strict: true`:

```json
{
  "model": "claude-opus-4-7",
  "max_tokens": 1024,
  "messages": [{"role": "user", "content": "What is the weather in San Francisco?"}],
  "tools": [{
    "name": "get_weather",
    "description": "Get the current weather in a given location",
    "strict": true,
    "input_schema": {
      "type": "object",
      "properties": {
        "location": {"type": "string", "description": "City, State"},
        "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
      },
      "required": ["location"],
      "additionalProperties": false
    }
  }]
}
```

Response — `input` is grammar-validated against the schema:

```json
{"type": "tool_use", "name": "get_weather", "input": {"location": "San Francisco, CA"}}
```

## Agentic workflow with multiple validated tools

Pattern from the docs page: a trip-planning agent with `search_flights` + `search_hotels`, both strict. Once at least one tool is strict in a request you start consuming the 20-strict-tools and 24-optional-params budget — make non-critical tools non-strict.

## How strict + `tool_choice: any` compose

The docs callout (Anchor `Forcing tool use Tip + Combine tool_choice any` from [[../03-advanced-tool-use/docs-define-tools]]):

> "Combine `tool_choice: {'type': 'any'}` with strict tool use to guarantee both that one of your tools will be called AND that the tool inputs strictly follow your schema."

This is the canonical "structured extraction with N candidate tools" pattern. For "extraction with exactly one tool" use `tool_choice: {type: "tool", name: "..."}` + `strict: true`.

## Mental model: when to use which

| Need | Use |
|---|---|
| Free-form Claude response coerced to a fixed JSON shape | `output_config.format` ([[docs-structured-outputs]]) |
| One specific extraction shape, no other tools | `tool_choice: {type: "tool", name: ...}` + `strict: true` |
| One of N extraction shapes (classification + extraction) | `tool_choice: {type: "any"}` + `strict: true` on each |
| Mid-agent-loop tool call must be schema-valid | `strict: true` on the relevant tools (leave others non-strict to save grammar-cap budget) |
| Strict-validated Claude response AND strict-validated tool inputs in the same turn | both `output_config.format` + `strict: true` on tools |

## Cross-references

- See [[docs-structured-outputs]] for the JSON-Schema subset and grammar-compile semantics (this page references the same `#json-schema-limitations` anchor).
- See [[../03-advanced-tool-use/docs-define-tools]] for `tool_choice`, the broader best-practices on tool definitions, and the relationship between `strict`, prefilling, and extended thinking compatibility.
- See [[docs-agent-sdk-structured-outputs]] for the higher-level wrapper that adds a retry loop above strict mode for the cases where the model still can't satisfy the schema (e.g., information is missing from input).
- See [[../05-claude-api/docs-tool-use]] (`api-incompatibility` table) — `strict` is **ignored** when calling through the OpenAI SDK compatibility layer; per [[docs-openai-sdk-compat-structured-output]] native Claude API + structured outputs is required for strict-shape guarantees.

## Open questions / follow-ups

- **Latency impact** of strict mode beyond the first-call grammar-compile penalty isn't quantified. Worth a chapter A/B for a known-tool workload.
- **What happens when input data doesn't contain enough to satisfy `required`?** The docs page punts this to the Agent SDK's retry loop. Tools without enough info to fill `required` will still produce *some* schema-valid input — see [[blog-extract-structured-json-cookbook]] and Claude Opus's note on asking-for-clarification when required params are missing.
- **`mcp_toolset` exclusion**: which third-party MCP servers actively need strict mode and what's the workaround? Likely "duplicate the MCP tool as a native client tool with `strict: true`" — confirm in a follow-up note.
- **Streaming + strict**: docs assert streaming compatibility (since it's in the structured-outputs feature-compat list) but don't show a streaming example. Worth verifying that token-by-token grammar enforcement plays well with `content_block_delta` ordering.
