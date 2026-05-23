---
source_url: https://www.anthropic.com/engineering/advanced-tool-use
canonical_url: https://www.anthropic.com/engineering/advanced-tool-use
source_title: Advanced Tool Use on the Claude Developer Platform
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: advanced-tool-use
tier: T1-official
cert_domains: [2]
cert_task_areas: ["Effective tool interfaces", "Tool distribution + tool_choice"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Tool Search Tool — Anthropic engineering blog deep dive

Per-pattern deep dive on **Tool Search Tool**, drawn from the canonical Anthropic engineering post (Nov 24, 2025). For the docs-side API reference, see [[docs-tool-search-tool]].

## Key takeaways

- **Mechanism**: instead of loading all tool definitions upfront, mark tools with `defer_loading: true`. Claude calls the search tool (~500 tokens to load) and retrieves 3–5 relevant tools (~3K tokens) on demand. Preserves ~95% of the context window vs the traditional approach.
- **Concrete cost**: a five-MCP-server setup (GitHub, Slack, Sentry, Grafana, Splunk) consumes roughly 55K tokens of definitions before any work starts. Adding Jira pushes the overhead past 100K. One internal Anthropic case hit "134K tokens before optimization."
- **Accuracy gains**, not just token savings:
  - **Opus 4**: 49% → 74% on the MCP eval (a +25-point swing)
  - **Opus 4.5**: 79.5% → 88.1% (+8.6 points)
- **Headline reduction**: 85% reduction in token usage on tool definitions, while preserving full library access. Prompt caching is preserved because deferred tools are stripped from the system-prompt prefix.
- **Use when**: tool definitions >10K tokens; tool selection accuracy issues; 10+ tools; MCP-powered multi-server setups; tool library growing over time. **Don't bother** when <10 tools, all tools used in every request, or definitions <100 tokens total.

## The problem it solves

Tool definitions degrade accuracy at scale, not just cost. Even before context-window math is involved, Claude's ability to correctly pick the right tool drops as the catalog grows. The Tool Search Tool is a *just-in-time retrieval* approach to tools — retrieve only what's needed for this specific turn.

The numbers most worth carrying into chapters:

- **Pre-search Opus 4.5 baseline**: 79.5% accuracy with full tool defs loaded
- **Post-search Opus 4.5**: 88.1% with the same tools made discoverable
- This is the same model, same catalog — only the *delivery* of tool definitions changes.

## Quoted (citation-ready)

> "Tool results and definitions can sometimes consume 50,000+ tokens before an agent reads a request."
>
> — Advanced Tool Use on the Claude Developer Platform, problem framing
>
> Anchor: `Problem framing + Tool results and definitions`

> "Only relevant tools load into context — typically 3-5 tools (~3K tokens) versus 72K tokens traditionally."
>
> — Advanced Tool Use on the Claude Developer Platform, Tool Search Tool mechanism
>
> Anchor: `Tool Search Tool mechanism + Only relevant tools`

> "Opus 4.5: improved from 79.5% to 88.1% accuracy on MCP evaluations."
>
> — Advanced Tool Use on the Claude Developer Platform, Tool Search Tool results
>
> Anchor: `Tool Search Tool results + Opus 4.5 improved`

## When to use (from the post)

- 10+ tools available
- Tool definitions consuming >10K tokens
- Experiencing tool selection accuracy issues with large tool sets
- Building MCP-powered systems with multiple servers (the post specifically calls out 200+ tools)
- Tool library growing over time

## When NOT to use

- Less than 10 tools total
- All tools are frequently used in every request
- Very small tool definitions (<100 tokens total)

## Why prompt caching survives

The blog post notes that "the feature preserves prompt caching since deferred tools remain excluded from initial prompts." This is the design rationale: the cached prefix is unchanged whether a deferred tool exists or not, so an organization can ship a 1,000-tool catalog without invalidating every cached system prompt. The docs page reinforces this — see [[docs-tool-search-tool]] under "How deferral works internally."

## Cross-references

- See [[docs-tool-search-tool]] for the API reference (regex vs BM25 variants, error codes, response shapes).
- See [[blog-advanced-tool-use-overview]] for the broader three-feature framing.
- See [[blog-programmatic-tool-calling]] — Tool Search reduces definition cost; Programmatic Tool Calling reduces result cost. They compose.
- See [[docs-tool-interface-design]] on consistent namespacing (`github_*`, `slack_*`) which makes Tool Search work better — the search reads tool names, descriptions, argument names, and argument descriptions.

## Open questions / follow-ups

- The 79.5% → 88.1% jump on Opus 4.5 raises a measurement question: which MCP eval was used? The post does not name the benchmark. Worth checking if Anthropic has published the eval methodology.
- The post mentions 72K tokens "traditionally" but the table in the landscape doc reports 55K for the same 5-server setup. The 72K figure may include MCP envelope/protocol overhead — confirm before quoting in a chapter.
- BM25 vs Regex variant trade-offs are not discussed in the blog post; see [[docs-tool-search-tool]] for that.
