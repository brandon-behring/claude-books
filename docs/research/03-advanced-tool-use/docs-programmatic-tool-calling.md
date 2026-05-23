---
source_url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling
canonical_url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling
source_title: Programmatic tool calling
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: advanced-tool-use
tier: T1-official
cert_domains: [2, 1]
cert_task_areas: ["Effective tool interfaces", "Multi-step workflows", "Tool distribution + tool_choice"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Programmatic tool calling — API reference (allowed_callers, container, caller field)

The canonical API reference for Programmatic Tool Calling (PTC). Complements [[blog-programmatic-tool-calling]] (the engineering blog narrative). This note documents the *how* — exact tool definitions, response shapes, container lifecycle, error handling.

## Key takeaways

- **Activation**: include the `code_execution_20260120` server tool in the request, and on each tool that should be callable from code, add `"allowed_callers": ["code_execution_20260120"]`.
- **Supported models**: Opus 4.7, Opus 4.6, Sonnet 4.6, Opus 4.5, Sonnet 4.5. Available on Claude API, Claude Platform on AWS, Microsoft Foundry. **Not available** on Bedrock or Vertex AI.
- **`allowed_callers` enum** has two values: `"direct"` (default if omitted) and `"code_execution_20260120"`. The docs recommend choosing one or the other per tool, not both, for clarity.
- **Response includes a `caller` field** on every `tool_use` block, with `type: "direct"` or `type: "code_execution_20260120"` + a `tool_id` referencing the parent code-execution call.
- **Container lifecycle**: new container per request (or reuse by passing `container` parameter), 30-day max, 4.5-min idle timeout. Container ID returned in responses.
- **Strict tool-result formatting rule**: when responding to a PTC tool call, the user message must contain **only** `tool_result` blocks — no text content, even after.
- **MCP-connector tools cannot be called programmatically** — this is the only documented tool restriction.
- **Custom tools become async Python functions** automatically (the page hides the async wrapper in its examples but notes it exists).
- **ZDR ineligible**: "This feature is not eligible for Zero Data Retention. Data is retained according to the feature's standard retention policy."

## Quoted (citation-ready)

> "Programmatic tool calling allows Claude to write code that calls your tools programmatically within a code execution container, rather than requiring round trips through the model for each tool invocation. This reduces latency for multi-tool workflows and decreases token consumption by allowing Claude to filter or process data before it reaches the model's context window."
>
> — Programmatic tool calling, Overview
>
> Anchor: `Overview + Programmatic tool calling allows`

> "On agentic search benchmarks like BrowseComp and DeepSearchQA, which test multi-step web research and complex information retrieval, adding programmatic tool calling on top of basic search tools was the key factor that fully unlocked agent performance."
>
> — Programmatic tool calling, Overview
>
> Anchor: `Overview + On agentic search benchmarks`

> "Consider checking budget compliance across 20 employees: the traditional approach requires 20 separate model round-trips, pulling thousands of expense line items into the context along the way. With programmatic tool calling, a single script runs all 20 lookups, filters the results, and returns only the employees who exceeded their limits, shrinking what Claude needs to reason over from hundreds of kilobytes down to a handful of lines."
>
> — Programmatic tool calling, Overview
>
> Anchor: `Overview + Consider checking budget compliance`

## The five-step flow

1. **Initial request**: host sends a user message with `code_execution_20260120` + a tool with `allowed_callers: ["code_execution_20260120"]`.
2. **Claude writes code**: response includes a `server_tool_use` block (the `code_execution` call), and Claude's Python code calls the tool. API pauses, returns `stop_reason: "tool_use"` with the `tool_use` block carrying the `caller` reference.
3. **Host provides tool result**: must be **only** `tool_result` blocks. Pass `container` ID for reuse.
4. **Code continues**: more tool calls or completion. If more pending, repeat step 3.
5. **Final response**: `code_execution_tool_result` with stdout, Claude's final assistant text. `stop_reason: "end_turn"`.

## `allowed_callers` reference

```json
{
  "name": "query_database",
  "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
  "input_schema": { ... },
  "allowed_callers": ["code_execution_20260120"]
}
```

| `allowed_callers` value | Meaning |
|---|---|
| `["direct"]` | Only Claude can call directly (default if omitted) |
| `["code_execution_20260120"]` | Only callable from code execution |
| `["direct", "code_execution_20260120"]` | Both, but the docs recommend picking one |

## Programmatic invocation response shape

```jsonc
// Code execution itself
{
  "type": "server_tool_use",
  "id": "srvtoolu_abc123",
  "name": "code_execution",
  "input": {"code": "results = await query_database('<sql>')\n..."}
}

// Tool called from inside the code
{
  "type": "tool_use",
  "id": "toolu_def456",
  "name": "query_database",
  "input": {"sql": "<sql>"},
  "caller": {
    "type": "code_execution_20260120",
    "tool_id": "srvtoolu_abc123"
  }
}
```

The `caller.tool_id` links back to the parent code-execution call. Hosts can use this to log/observe which tools fired from which code block.

## Final code-execution result shape

```jsonc
{
  "type": "code_execution_tool_result",
  "tool_use_id": "srvtoolu_abc123",
  "content": {
    "type": "code_execution_result",
    "stdout": "Top 5 customers: [{'customer_id': 'C1', 'revenue': 45000}, ...]",
    "stderr": "",
    "return_code": 0,
    "content": []
  }
}
```

## Container lifecycle

- **Created per request** by default; pass `container: "<id>"` to reuse
- **Idle timeout**: 4.5 minutes
- **Hard maximum**: 30 days
- **Container ID returned** in responses as `container: {id, expires_at}`
- If the container expires mid-call, Claude's code receives a `TimeoutError` in stderr and typically retries.

## Error codes

| Error | Cause | Fix |
|---|---|---|
| `invalid_tool_input` | Tool input doesn't match schema | Validate your tool's `input_schema` |
| `tool_not_allowed` | Tool doesn't allow the requested caller type | Check `allowed_callers` includes the right contexts |

Tool execution errors come through as ordinary `tool_result` blocks; Claude's running code receives the error and handles it like any Python exception.

## Constraints worth memorizing

The page lists "Feature incompatibilities" explicitly:

- **`strict: true` is not supported** with programmatic calling
- **`tool_choice` cannot force programmatic calling** of a specific tool
- **`disable_parallel_tool_use: true` is not supported** with PTC

Tool restrictions:
- **MCP-connector tools cannot be called programmatically**

Message-formatting restriction (unique to PTC):
- **Tool-result-only responses** — if there are pending programmatic tool calls waiting for results, the response message must contain only `tool_result` blocks. No text, even after. (This differs from regular client-side tool calls, where text after `tool_result` is allowed — see [[docs-handle-tool-calls]].)

## When to use (per the "When to use programmatic calling" section)

**Good use cases:**
- Processing large datasets where you only need aggregates or summaries
- Multi-step workflows with 3+ dependent tool calls
- Operations requiring filtering, sorting, or transformation of tool results
- Tasks where intermediate data shouldn't influence Claude's reasoning
- Parallel operations across many items (e.g., checking 50 endpoints)

**Less ideal use cases:**
- Single tool calls with simple responses
- Tools that need immediate user feedback
- Very fast operations where code execution overhead would outweigh the benefit

## Token-efficiency note (chapter material)

> "Tool results from programmatic invocations do not count toward your input/output token usage. Only the final code execution result and Claude's response count."
>
> — Programmatic tool calling, Usage and pricing
>
> Anchor: `Usage and pricing + Tool results from programmatic`

This is a strong cost-side claim: intermediate tool results are "free" from a token-billing perspective. The 37% reduction figure in [[blog-programmatic-tool-calling]] is the upper bound on what shows up in the bill.

## Self-hosted alternatives

The page describes three implementation paths, in increasing order of safety:

1. **Client-side direct execution** — simple, but executes untrusted code outside a sandbox. Code-injection risk.
2. **Self-managed sandboxed execution** — same approach, but sandboxed. Complex to build/maintain.
3. **Anthropic-managed execution (this feature)** — safe by default, opinionated Python environment.

The page is direct: use Anthropic-managed if you're on Claude API, Claude Platform on AWS, or Microsoft Foundry.

## Cross-references

- See [[blog-programmatic-tool-calling]] for the engineering-blog framing and the 37% / 25.6% → 28.5% / 46.5% → 51.2% benchmark numbers.
- See [[docs-tool-use-overview]] for the broader tool-use sub-page tree.
- See [[docs-handle-tool-calls]] for ordinary (non-PTC) `tool_result` formatting — note the stricter rule for PTC.
- See [[docs-tool-search-tool]] — PTC and Tool Search compose to attack two different context-cost axes.
- See [[docs-tool-interface-design]] for "detailed output descriptions" guidance — particularly important for PTC since Claude deserializes results in code.

## Open questions / follow-ups

- Whether Bedrock and Vertex AI support are planned. The page just says "not currently available" — no timeline.
- "Custom tools are converted to async Python functions to support parallel tool calling. When Claude writes code that calls your tools, it uses await (e.g., result = await query_database('<sql>'))" — but the async wrapper is omitted from examples for clarity. Worth a chapter snippet that shows the real wrapper.
- ZDR ineligibility is a noted limitation; some regulated industries will need to wait for parity with the rest of the platform.
