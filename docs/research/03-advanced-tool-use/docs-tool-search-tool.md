---
source_url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool
canonical_url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool
source_title: Tool search tool
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: advanced-tool-use
tier: T1-official
cert_domains: [2]
cert_task_areas: ["Effective tool interfaces", "Tool distribution + tool_choice", "MCP server config"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Tool search tool — API reference (regex vs BM25, defer_loading, prompt caching)

The canonical API reference for the Tool Search Tool. Complements [[blog-tool-search-tool]] (the engineering blog narrative). This note focuses on the *how* — exact tool types, response shapes, error codes, and the prompt-caching mechanics.

## Key takeaways

- **Two variants**, released together — neither supersedes the other:
  - `tool_search_tool_regex_20251119` — Claude constructs Python `re.search()` regex patterns
  - `tool_search_tool_bm25_20251119` — Claude uses natural-language queries (BM25 keyword scoring)
- **Pattern length limit** (regex variant): 200 characters
- **Maximum tools in catalog**: 10,000
- **Search results per query**: 3–5 most relevant tools
- **Search fields**: tool names, descriptions, argument names, and argument descriptions — *all four* are searched.
- **Model support**: Claude Mythos Preview, Sonnet 4.0+, Opus 4.0+, Haiku 4.5+
- **`defer_loading: true`** marks tools as on-demand; they're stripped from the system-prompt prefix so prompt caching is preserved.
- **Critical correctness rule**: the tool-search-tool itself must **never** have `defer_loading: true` and at least one non-deferred tool must exist (otherwise a 400 error fires).
- **Cookbook reference**: the page links to a cookbook on building a custom semantic-search version using embeddings — `https://platform.claude.com/cookbooks/tool_use`.

## How deferral interacts with prompt caching

The mechanism, in the page's own words:

> "Deferred tools are not included in the system-prompt prefix. When the model discovers a deferred tool through tool search, the API appends a tool_reference block inline in the conversation, then expands it into the full tool definition before passing it to Claude. The prefix is untouched, so prompt caching is preserved. The grammar for strict mode (the rules that constrain tool-call output to match your schemas) builds from the full toolset, so defer_loading and strict mode compose without grammar recompilation."
>
> — Tool search tool, Deferred tool loading: How deferral works internally
>
> Anchor: `How deferral works internally + Deferred tools are not included`

This is the architectural point that makes Tool Search safe to roll out org-wide: a 1,000-tool catalog doesn't invalidate the cached system-prompt prefix.

## Quoted (citation-ready)

> "A typical multi-server setup (GitHub, Slack, Sentry, Grafana, Splunk) can consume ~55k tokens in definitions before Claude does any actual work. Tool search typically reduces this by over 85%, loading only the 3–5 tools Claude actually needs for a given request."
>
> — Tool search tool, Context bloat problem statement
>
> Anchor: `Context bloat problem statement + A typical multi-server setup`

> "Claude's ability to correctly pick the right tool degrades significantly once you exceed 30–50 available tools. By surfacing a focused set of relevant tools on demand, tool search keeps selection accuracy high even across thousands of tools."
>
> — Tool search tool, Tool selection accuracy problem statement
>
> Anchor: `Tool selection accuracy problem statement + Claude's ability to correctly`

> "Maximum tools: 10,000 tools in your catalog"
>
> — Tool search tool, Limits
>
> Anchor: `Limits + Maximum tools`

## Response shape (when Claude searches and then calls)

```jsonc
{
  "role": "assistant",
  "content": [
    {"type": "text", "text": "I'll search for tools to help with the weather information."},
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01ABC123",
      "name": "tool_search_tool_regex",
      "input": {"query": "weather"}
    },
    {
      "type": "tool_search_tool_result",
      "tool_use_id": "srvtoolu_01ABC123",
      "content": {
        "type": "tool_search_tool_search_result",
        "tool_references": [{"type": "tool_reference", "tool_name": "get_weather"}]
      }
    },
    {"type": "text", "text": "I found a weather tool. Let me get the weather for San Francisco."},
    {
      "type": "tool_use",
      "id": "toolu_01XYZ789",
      "name": "get_weather",
      "input": {"location": "San Francisco", "unit": "fahrenheit"}
    }
  ],
  "stop_reason": "tool_use"
}
```

The `tool_reference` blocks auto-expand into full tool definitions before Claude sees them. The host does **not** need to handle this expansion — the API does it automatically as long as every referenced tool has a corresponding definition in the `tools` array.

## Error codes (200 OK with error body)

The page documents the tool-result error envelope:

```jsonc
{
  "type": "tool_search_tool_result",
  "tool_use_id": "srvtoolu_01ABC123",
  "content": {
    "type": "tool_search_tool_result_error",
    "error_code": "invalid_pattern"
  }
}
```

| Code | Cause |
|---|---|
| `too_many_requests` | Rate limit exceeded for tool search operations |
| `invalid_pattern` | Malformed regex pattern |
| `pattern_too_long` | Pattern exceeds the 200-character limit |
| `unavailable` | Service temporarily unavailable |

## Error codes (400, request-blocking)

- **"All tools have defer_loading set"** — at least one tool must be non-deferred. The tool-search tool itself should not have `defer_loading: true`.
- **"Tool reference 'unknown_tool' has no corresponding tool definition"** — every potentially-discoverable tool must have its full definition in the `tools` array.

## Custom client-side tool search

The page documents a custom-search pattern where the host implements its own search algorithm (e.g., semantic embeddings) and returns `tool_reference` blocks from a regular tool. Standard `tool_result` format:

```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_your_tool_id",
  "content": [{"type": "tool_reference", "tool_name": "discovered_tool_name"}]
}
```

Every referenced tool must still appear in `tools` with `defer_loading: true`. This is the path for orgs that want semantic search over BM25 / regex.

## Compatibility constraints

- **Not compatible with `input_examples`** (per the page's Note box): "The tool search tool is not compatible with tool use examples. If you need to provide examples of tool usage, use standard tool calling without tool search." Implication: example-bearing tools should be kept non-deferred.
- **Bedrock Converse API limitation**: server-side tool search only works through Bedrock's `InvokeModel` API, not Converse.
- **ZDR-eligible** when the org has a Zero Data Retention arrangement.
- **Available on Messages Batches API** at the same per-token pricing.

## Best-practice tips from the page

- Keep your 3–5 most frequently used tools as **non-deferred** for optimal performance.
- Use **consistent namespacing**: `github_`, `slack_`, `jira_` prefixes — search queries naturally surface tool groups.
- Add a **system-prompt section** describing available tool categories: "You can search for tools to interact with Slack, GitHub, and Jira."
- **Monitor which tools Claude discovers** to refine descriptions.

## Cross-references

- See [[blog-tool-search-tool]] for the engineering-blog narrative and the headline 79.5% → 88.1% Opus 4.5 accuracy numbers.
- See [[docs-tool-use-overview]] for the broader tool-use sub-page tree and pricing model.
- See [[docs-tool-interface-design]] on namespacing — the practice that makes Tool Search work well.
- See [[docs-programmatic-tool-calling]] — Tool Search + PTC compose well; both reduce different kinds of context cost.
- See `docs/landscape-2026-05.md` §2.4 for the high-level framing this note supplements.

## Open questions / follow-ups

- The page mentions a usage object: `usage.server_tool_use.tool_search_requests`. Whether this is metered / billed separately is not documented here — likely free (just token-cost on the search query and references).
- BM25 vs regex variant trade-offs: the page describes both but doesn't recommend one. Intuition: BM25 is more forgiving for natural-language tool catalogs; regex is more precise for tools with stable naming conventions. Worth a benchmark from chapter authors.
- The `mcp_toolset.defer_loading` pattern (per the MCP connector page) is the canonical way to apply Tool Search to MCP servers — worth a separate dossier note in `02-mcp-spec/` if not already there.
