---
source_url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools
canonical_url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools
source_title: Define tools
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: advanced-tool-use
tier: T1-official
cert_domains: [2]
cert_task_areas: ["Effective tool interfaces", "Tool distribution + tool_choice"]
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Define tools — schema, descriptions, tool_choice modes

The canonical API reference for client tool definitions: required fields, optional fields, `tool_choice` modes, and `input_examples`. Cited heavily by [[blog-tool-use-examples]] and [[docs-tool-interface-design]].

## Key takeaways

- A client tool definition has **three required fields** and several optional ones:
  - `name`: must match `^[a-zA-Z0-9_-]{1,64}$`
  - `description`: detailed plaintext — "by far the most important factor in tool performance"
  - `input_schema`: a JSON Schema object
  - Optional: `input_examples`, `cache_control`, `strict`, `defer_loading`, `allowed_callers`, `eager_input_streaming`
- **Four `tool_choice` modes** with documented behavior:
  - `auto` — Claude decides (default when `tools` are provided)
  - `any` — Claude must use *some* provided tool, doesn't pick which
  - `tool` (with a specific name) — forces a particular tool
  - `none` — prevents any tool use (default when no `tools` provided)
- **Extended thinking compatibility**: only `auto` and `none` are compatible with extended thinking. `any` and `tool` return an error.
- **Claude Mythos Preview** does not support forced tool use at all — only `auto` or `none`.
- **`input_examples`** (the Tool Use Examples feature) is documented here with full schema details, including the 400 error on schema-invalid examples and the ~20–50 / ~100–200 token cost for simple vs complex examples.
- The page surfaces five **best practices for tool definitions** in prose; these are the citation-ready bullets for the architect-reference design chapters.

## The five best-practices verbatim

> "Provide extremely detailed descriptions. This is by far the most important factor in tool performance."
>
> — Define tools, Best practices for tool definitions
>
> Anchor: `Best practices for tool definitions + Provide extremely detailed`

> "Consolidate related operations into fewer tools. Rather than creating a separate tool for every action (create_pr, review_pr, merge_pr), group them into a single tool with an action parameter. Fewer, more capable tools reduce selection ambiguity and make your tool surface easier for Claude to navigate."
>
> — Define tools, Best practices for tool definitions
>
> Anchor: `Best practices for tool definitions + Consolidate related operations`

> "Use meaningful namespacing in tool names. When your tools span multiple services or resources, prefix names with the service (e.g., github_list_prs, slack_send_message). This makes tool selection unambiguous as your library grows, and is especially important when using tool search."
>
> — Define tools, Best practices for tool definitions
>
> Anchor: `Best practices for tool definitions + Use meaningful namespacing`

> "Design tool responses to return only high-signal information. Return semantic, stable identifiers (e.g., slugs or UUIDs) rather than opaque internal references, and include only the fields Claude needs to reason about its next step. Bloated responses waste context and make it harder for Claude to extract what matters."
>
> — Define tools, Best practices for tool definitions
>
> Anchor: `Best practices for tool definitions + Design tool responses`

## `tool_choice` mode reference

```json
// Default — Claude picks
{ "type": "auto" }

// Must use some tool
{ "type": "any" }

// Must use this exact tool
{ "type": "tool", "name": "get_weather" }

// No tools
{ "type": "none" }
```

The docs page is explicit about the prefill behavior:

> "Note that when you have tool_choice as any or tool, the API prefills the assistant message to force a tool to be used. This means that the models will not emit a natural language response or explanation before tool_use content blocks, even if explicitly asked to do so."
>
> — Define tools, Forcing tool use
>
> Anchor: `Forcing tool use + Note that when you have`

For natural-language preamble while still steering to a specific tool: use `auto` and ask in the user message ("Use the get_weather tool in your response.").

## Strict mode (composes with `tool_choice: any`)

> "Combine `tool_choice: {'type': 'any'}` with strict tool use to guarantee both that one of your tools will be called AND that the tool inputs strictly follow your schema. Set `strict: true` on your tool definitions to enable schema validation."
>
> — Define tools, Forcing tool use Tip
>
> Anchor: `Forcing tool use Tip + Combine tool_choice any`

`strict: true` is available on all tools except `mcp_toolset` (per the tool reference page).

## Prompt-cache interaction with `tool_choice`

The docs note an important caching wrinkle:

> "When using prompt caching, changes to the tool_choice parameter will invalidate cached message blocks. Tool definitions and system prompts remain cached, but message content must be reprocessed."

If a workflow toggles `tool_choice` per turn (e.g., forcing a specific tool on certain steps), expect message-block cache invalidation on those turns. Keep `tool_choice` stable across cached turns.

## Good vs poor description example

```json
// Good
{
  "name": "get_stock_price",
  "description": "Retrieves the current stock price for a given ticker symbol. The ticker symbol must be a valid symbol for a publicly traded company on a major US stock exchange like NYSE or NASDAQ. The tool will return the latest trade price in USD. It should be used when the user asks about the current or most recent price of a specific stock. It will not provide any other information about the stock or company.",
  "input_schema": {
    "type": "object",
    "properties": {
      "ticker": {"type": "string", "description": "The stock ticker symbol, e.g. AAPL for Apple Inc."}
    },
    "required": ["ticker"]
  }
}

// Poor
{
  "name": "get_stock_price",
  "description": "Gets the stock price for a ticker.",
  "input_schema": {
    "type": "object",
    "properties": {"ticker": {"type": "string"}},
    "required": ["ticker"]
  }
}
```

The page's gloss: "The good description clearly explains what the tool does, when to use it, what data it returns, and what the ticker parameter means. The poor description is too brief and leaves Claude with many open questions about the tool's behavior and usage."

Aim, per the page: "at least 3-4 sentences per tool description, more if the tool is complex."

## `input_examples` reference (Tool Use Examples)

The optional field on user-defined and Anthropic-schema client tools (not on server tools):

```json
{
  "name": "get_weather",
  "description": "...",
  "input_schema": { ... },
  "input_examples": [
    {"location": "San Francisco, CA", "unit": "fahrenheit"},
    {"location": "Tokyo, Japan", "unit": "celsius"},
    {"location": "New York, NY"}
  ]
}
```

**Constraints**:
- Each example must validate against `input_schema` (invalid → 400 error)
- Not supported for server-side tools
- Token cost: ~20–50 tokens for simple examples, ~100–200 tokens for complex nested objects

## Cross-references

- See [[docs-tool-use-overview]] for where `define-tools` fits in the sub-page tree.
- See [[docs-handle-tool-calls]] for how `tool_use` and `tool_result` are paired in the message history.
- See [[docs-parallel-tool-use]] for `disable_parallel_tool_use` (a request-level parameter, not a tool-definition property).
- See [[blog-tool-use-examples]] for the engineering blog framing and benchmark numbers behind `input_examples`.
- See [[docs-tool-interface-design]] for synthesis across the post + this docs page.

## Open questions / follow-ups

- The page directly cites the **Writing Tools for Agents** blog post for "deeper guidance on tool design"; that's the source for [[docs-tool-interface-design]].
- `eager_input_streaming` is listed as a tool property but isn't deep-covered on this page; it lives at `/agents-and-tools/tool-use/fine-grained-tool-streaming`. Worth a separate note if a chapter needs it.
- The model recommendation ("Use Claude Opus 4.7 for complex tools and ambiguous queries; Claude Haiku models may infer missing parameters") is a useful design heuristic — Opus is the right default for multi-tool agentic systems.
