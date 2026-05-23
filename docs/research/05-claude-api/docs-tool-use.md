---
source_url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
canonical_url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
source_title: Tool use with Claude
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: claude-api
tier: T1-official
cert_domains: [2, 4]
cert_task_areas: ["Tool distribution + tool_choice (auto/any/forced)", "Structured output via tool_use + JSON schemas"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Tool use — overview (foundation note)

> **Scope**: this note captures the Claude API tool-use *contract* — `tool_use` / `tool_result` blocks, client vs server tools, `tool_choice`, and the system-prompt token overhead. Deep dives on Tool Search Tool, Programmatic Tool Calling, and Tool Use Examples live in the sibling dossier — see [[../03-advanced-tool-use/README]]. Do not duplicate those here; cross-reference instead.

## Key takeaways

- **Tool use is "the highest-leverage primitive you can give an agent."** Claude responds with `stop_reason: "tool_use"` and one or more `tool_use` content blocks; your application executes the call and returns `tool_result` blocks on the next user turn.
- **Client tools vs server tools**: client tools (user-defined + Anthropic-schema tools like `bash`, `text_editor`) run in your code; server tools (`web_search`, `web_fetch`, `code_execution`, `tool_search`) run on Anthropic's infrastructure and return results directly without round-tripping.
- **`tool_choice` modes**: `"auto"` (default), `"any"` (must use *some* tool but Claude picks), `{"type": "tool", "name": "..."}` (forced), `"none"` (no tools this turn).
- **`tool_choice: "any"` and forced tool are incompatible with extended thinking** (manual mode). Adaptive thinking has the same limitation. Use `"auto"` or `"none"` when thinking is enabled.
- **System-prompt overhead** (Claude 4.x): 346 tokens for `auto`/`none`, 313 tokens for `any`/`tool`. This is in addition to your tool schemas. (`tool_choice: "none"` with zero tools defined uses 0 additional tokens.)
- **Strict tool use**: add `strict: true` to a tool definition to enforce schema conformance on the model side. Documented separately; cross-reference: [[../03-advanced-tool-use/docs-define-tools]].
- **Opus is more likely to ask** for missing required params; Sonnet is more likely to guess. Useful when designing the prompt for required-field elicitation.

## Quoted (citation-ready)

> "Tool use lets Claude call functions you define or that Anthropic provides. Claude decides when to call a tool based on the user's request and the tool's description, then returns a structured call that your application executes (client tools) or that Anthropic executes (server tools)."
>
> — Tool use with Claude, intro
>
> Anchor: `Tool use with Claude + Tool use lets Claude call functions`

> "Tool access is one of the highest-leverage primitives you can give an agent. On benchmarks like LAB-Bench FigQA (scientific figure interpretation) and SWE-bench (real-world software engineering), adding even basic tools produces outsized capability gains, often surpassing human expert baselines."
>
> — Tool use with Claude, intro
>
> Anchor: `Tool use with Claude + Tool access is one of the highest-leverage primitives`

> "If the user's prompt doesn't include enough information to fill all the required parameters for a tool, Claude Opus is much more likely to recognize that a parameter is missing and ask for it. Claude Sonnet may ask, especially when prompted to think before outputting a tool request. But it may also do its best to infer a reasonable value."
>
> — Tool use with Claude, "What happens when Claude needs more information"
>
> Anchor: `What happens when Claude needs more information + If the user's prompt doesn't include enough information`

## API shape (basic example, server tool)

```json
{
  "model": "claude-opus-4-7",
  "max_tokens": 1024,
  "tools": [{"type": "web_search_20260209", "name": "web_search"}],
  "messages": [{"role": "user", "content": "What's the latest on the Mars rover?"}]
}
```

Client tool round-trip (skeleton):

1. Send `tools=[{name, description, input_schema}]` plus user message.
2. Claude returns `stop_reason: "tool_use"` + a `tool_use` block carrying `id`, `name`, `input`.
3. Your app executes the call.
4. Next request appends the assistant turn (echoing the `tool_use` block) and a user turn with one or more `tool_result` blocks (`{type: "tool_result", tool_use_id, content, is_error?}`).
5. Repeat until `stop_reason: "end_turn"`.

## Tool-use system-prompt overhead

When you provide ≥1 tool, Claude injects a system prompt that enables tool use. This is in addition to your schemas:

| Model | `auto` / `none` | `any` / forced `tool` |
|---|---|---|
| Opus 4.7 / 4.6 / 4.5 / 4.1 / (dep. Opus 4) | 346 tokens | 313 tokens |
| Sonnet 4.6 / 4.5 / (dep. Sonnet 4) | 346 | 313 |
| Haiku 4.5 | 346 | 313 |
| Haiku 3.5 (Bedrock/Vertex-only) | 264 | 340 |

## Pricing impact

- Client tools: priced as ordinary input + output tokens.
- Server tools: input + output tokens **plus** per-use surcharge for billable tools (web search $10 / 1,000; web fetch $0; code execution: free with web search/fetch, otherwise execution-time billed). Detail: [[docs-pricing]].

## Cross-references

- **Advanced tool-use patterns** (Tool Search Tool, Programmatic Tool Calling, Tool Use Examples) — see the dedicated dossier: [[../03-advanced-tool-use/README]]. Notably:
  - [[../03-advanced-tool-use/docs-tool-search-tool]] for context-saving at 10+ tools.
  - [[../03-advanced-tool-use/docs-programmatic-tool-calling]] for orchestrating multi-step tool flows via sandboxed code.
  - [[../03-advanced-tool-use/docs-define-tools]] for `strict: true`, `input_examples`, and tool_choice in depth.
  - [[../03-advanced-tool-use/docs-handle-tool-calls]] for `is_error`, retries, formatting rules.
  - [[../03-advanced-tool-use/docs-parallel-tool-use]] for `disable_parallel_tool_use` and message-history rules.
- See [[docs-adaptive-thinking]] / [[docs-extended-thinking]] for the `tool_choice` incompatibility with forced calling.
- See [[docs-streaming]] for `input_json_delta` partial-JSON streaming of tool input.
- See [[../02-mcp-spec/spec-tools]] for the MCP tool contract; MCP tools surface to Claude as ordinary tools after broker resolution.

## Open questions / follow-ups

- **MCP connector** (`/docs/en/agents-and-tools/mcp-connector`) is referenced as the recommended path for connecting Claude to MCP servers from API code — not captured here; covered by [[../02-mcp-spec/]].
- **Server tool catalog** completeness: web search / web fetch / code execution / tool search are confirmed; new server tools (e.g., `advisor_20260301` from the advanced-tool-use dossier) may exist. Refresh `/docs/en/agents-and-tools/tool-use/tool-reference` before chapter publication.
