---
source_url: https://platform.claude.com/docs/en/build-with-claude/tool-use
canonical_url: https://platform.claude.com/docs/en/build-with-claude/tool-use
source_title: Tool use with Claude
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: advanced-tool-use
tier: T1-official
cert_domains: [2]
cert_task_areas: ["Effective tool interfaces", "Tool distribution + tool_choice", "Built-in tools"]
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Tool use with Claude — API overview

The current canonical entry page for tool use in the Claude API. The page now lives under `platform.claude.com` (the old `docs.claude.com` URL 301-redirects). Provides the agentic loop conceptual model, the client-tool vs server-tool distinction, and the system-prompt token overhead table that matters for pricing math.

## Key takeaways

- **Client tools vs server tools — the primary axis**:
  - **Client tools** (user-defined tools + Anthropic-schema tools `bash`, `text_editor`, `computer`, `memory`): Claude emits `stop_reason: "tool_use"`, your application executes, you return a `tool_result` block.
  - **Server tools** (`web_search`, `web_fetch`, `code_execution`, `tool_search`, `advisor`): Anthropic runs the code; you see results directly without handling execution.
- **System-prompt token overhead** is fixed per request (when ≥1 tool is provided):
  - All Claude 4.x models (Opus 4.7 / 4.6 / 4.5 / 4.1, Sonnet 4.6 / 4.5, Haiku 4.5): **346 tokens** for `tool_choice: "auto"` or `"none"`; **313 tokens** for `"any"` or `"tool"`
  - These are *in addition to* the `tools` parameter (schemas) and any `tool_use`/`tool_result` blocks
- The docs page notes a strong claim about tool-use leverage: "Tool access is one of the highest-leverage primitives you can give an agent. On benchmarks like LAB-Bench FigQA and SWE-bench, adding even basic tools produces outsized capability gains, often surpassing human expert baselines."
- **`strict: true`** is now a first-class tool definition option for guaranteed schema conformance — see [[docs-define-tools]] for the field and [[docs-tool-interface-design]] for when to use it.
- For new code, the docs surface two abstractions that hide the manual loop: **Tool Runner** (SDK abstraction that drives the agentic loop) and the older manual flow described in [[docs-handle-tool-calls]].

## The tool-use contract — verbatim conceptual model

The docs page (and its sibling "How tool use works") frame tool use as a *typed-callback contract*:

> "Tool use is a contract between your application and the model. You specify what operations are available and what shape their inputs and outputs take; Claude decides when and how to call them. The model never executes anything on its own."

This is the framing chapters should adopt. Tool use is not "the model executes a function" — it's "the model emits a structured request, your code runs it, you return a structured result."

## Quoted (citation-ready)

> "Tool use is a contract between your application and the model. You specify what operations are available and what shape their inputs and outputs take; Claude decides when and how to call them. The model never executes anything on its own."
>
> — Tool use with Claude (via How tool use works), The tool-use contract
>
> Anchor: `The tool-use contract + Tool use is a contract`

> "Tool access is one of the highest-leverage primitives you can give an agent. On benchmarks like LAB-Bench FigQA (scientific figure interpretation) and SWE-bench (real-world software engineering), adding even basic tools produces outsized capability gains, often surpassing human expert baselines."
>
> — Tool use with Claude, framing paragraph
>
> Anchor: `Framing paragraph + Tool access is one of`

> "Client tools (including user-defined tools and Anthropic-schema tools like bash and text_editor) run in your application: Claude responds with stop_reason: 'tool_use' and one or more tool_use blocks, your code executes the operation, and you send back a tool_result. Server tools (web_search, code_execution, web_fetch, tool_search) run on Anthropic's infrastructure: you see the results directly without handling execution."
>
> — Tool use with Claude, How tool use works
>
> Anchor: `How tool use works + Client tools`

## Pricing model

Tool-use requests are priced on three axes (per the docs page):

1. **Total input tokens** sent to the model (including the `tools` parameter — tool names, descriptions, schemas)
2. **Output tokens** generated
3. **For server-side tools**, additional usage-based pricing (e.g., web search at $10 per 1K searches)

The constructed tool-use system prompt template is documented verbatim:

```text
In this environment you have access to a set of tools you can use to answer the user's question.
{{ FORMATTING INSTRUCTIONS }}
String and scalar parameters should be specified as is, while lists and objects should use JSON format. Note that spaces for string values are not stripped. The output is not expected to be valid XML and is parsed with regular expressions.
Here are the functions available in JSONSchema format:
{{ TOOL DEFINITIONS IN JSON SCHEMA }}
{{ USER SYSTEM PROMPT }}
{{ TOOL CONFIGURATION }}
```

This template is what produces the 346/313-token overhead figures.

## Sub-pages in the tool-use tree

The current docs structure (May 2026):

- `/agents-and-tools/tool-use/overview` — this page
- `/agents-and-tools/tool-use/how-tool-use-works` — conceptual deep dive (loop, where tools run, when to use)
- `/agents-and-tools/tool-use/build-a-tool-using-agent` — tutorial
- `/agents-and-tools/tool-use/define-tools` — schema, descriptions, `tool_choice`, `input_examples` — see [[docs-define-tools]]
- `/agents-and-tools/tool-use/handle-tool-calls` — parsing `tool_use`, formatting `tool_result`, `is_error` — see [[docs-handle-tool-calls]]
- `/agents-and-tools/tool-use/parallel-tool-use` — see [[docs-parallel-tool-use]]
- `/agents-and-tools/tool-use/tool-search-tool` — see [[docs-tool-search-tool]]
- `/agents-and-tools/tool-use/programmatic-tool-calling` — see [[docs-programmatic-tool-calling]]
- `/agents-and-tools/tool-use/strict-tool-use` — schema-conformance guarantees (referenced but no separate dossier note yet)
- `/agents-and-tools/tool-use/fine-grained-tool-streaming` — `eager_input_streaming` field (referenced)
- `/agents-and-tools/tool-use/tool-runner` — SDK abstraction
- `/agents-and-tools/tool-use/tool-reference` — directory of Anthropic-provided tools and properties (see notes on naming and `defer_loading` / `allowed_callers` below)

## Anthropic-provided tools as of May 2026

From the tool reference page:

| Tool | `type` | Execution | Status |
|---|---|---|---|
| Web search | `web_search_20260209` / `web_search_20250305` | Server | GA |
| Web fetch | `web_fetch_20260209` / `web_fetch_20250910` | Server | GA |
| Code execution | `code_execution_20260120` / `code_execution_20250825` | Server | GA |
| Advisor | `advisor_20260301` | Server | Beta: `advisor-tool-2026-03-01` |
| Tool search | `tool_search_tool_regex_20251119` / `tool_search_tool_bm25_20251119` | Server | GA |
| MCP connector | `mcp_toolset` | Server | Beta: `mcp-client-2025-11-20` |
| Memory | `memory_20250818` | Client | GA |
| Bash | `bash_20250124` | Client | GA |
| Text editor | `text_editor_20250728` / `text_editor_20250124` | Client | GA |
| Computer use | `computer_20251124` / `computer_20250124` | Client | Beta |

## Cross-references

- See [[docs-define-tools]] for the tool definition reference (name, description, input_schema, input_examples, tool_choice modes).
- See [[docs-handle-tool-calls]] for the response-parsing reference and structured error handling.
- See [[docs-parallel-tool-use]] for `disable_parallel_tool_use` and parallel-call execution semantics.
- See [[docs-tool-search-tool]] for Tool Search Tool API reference.
- See [[docs-programmatic-tool-calling]] for Programmatic Tool Calling API reference.
- See [[docs-tool-interface-design]] for synthesis on naming, descriptions, consolidation.

## Open questions / follow-ups

- The "Advisor tool" (`advisor_20260301`) is listed as a Beta server tool but does not appear in the landscape doc. Worth a separate pass to understand what it does.
- `fine-grained-tool-streaming` (the `eager_input_streaming` field) is referenced but not yet captured here — only relevant for some long-running tool-call latencies.
- The legacy `docs.claude.com` URL still 301-redirects to `platform.claude.com` — confirm in subsequent quarters that this remains stable.
