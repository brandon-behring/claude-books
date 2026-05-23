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

# Programmatic Tool Calling — Anthropic engineering blog deep dive

Per-pattern deep dive on **Programmatic Tool Calling** (PTC), drawn from the canonical Anthropic engineering post (Nov 24, 2025). For the docs-side API reference with `allowed_callers` syntax, container lifecycle, and code examples, see [[docs-programmatic-tool-calling]].

## Key takeaways

- **Mechanism**: Claude writes Python code that orchestrates tool calls inside the `code_execution` sandbox. When the code invokes a tool, execution pauses and the API surfaces a `tool_use` block; the host returns the result, code execution resumes. **Intermediate tool results never enter Claude's context window** — only the final code output does.
- **The pollution problem this solves**: traditional tool calling forces all intermediate results into the context window even when only summaries are needed. The blog post calls this "context pollution from intermediate results."
- **Headline savings on complex research**: average token usage dropped from **43,588 to 27,297 tokens** — a **37% reduction**.
- **Round-trip elimination**: combining 20+ tool calls into a single code block eliminated 19+ inference passes in the post's example.
- **Capability gains** (not just cost):
  - Knowledge retrieval: 25.6% → 28.5%
  - GIA benchmarks: 46.5% → 51.2%
- **Use when**: large-dataset filtering/aggregation; multi-step workflows with 3+ dependent tool calls; conditional logic on intermediate results; parallel operations across many items. **Don't bother** for single tool calls with simple responses or when intermediate data is exactly what Claude needs to reason about.

## The mechanism

Tools become callable from code when their definition includes:

```json
"allowed_callers": ["code_execution_20260120"]
```

Claude then writes ordinary Python that calls them as async functions:

```python
async def _claude_code():
    regions = ["West", "East", "Central", "North", "South"]
    results = {}
    for region in regions:
        data = await query_database(f"<sql for {region}>")
        results[region] = sum(row["revenue"] for row in data)
    top_region = max(results.items(), key=lambda x: x[1])
    print(f"Top region: {top_region[0]} with ${top_region[1]:,} in revenue")
```

The 20-employee budget compliance example from the post: traditional tool calling needs 20 round-trips pulling thousands of expense line items into context. PTC runs all 20 lookups in code, filters in code, and returns a handful of lines to Claude.

## Quoted (citation-ready)

> "Average token usage dropped from 43,588 to 27,297 tokens — a 37% reduction on complex research."
>
> — Advanced Tool Use on the Claude Developer Platform, Programmatic Tool Calling results
>
> Anchor: `Programmatic Tool Calling results + Average token usage`

> "Eliminated 19+ inference passes by combining 20+ tool calls into single code blocks."
>
> — Advanced Tool Use on the Claude Developer Platform, Programmatic Tool Calling results
>
> Anchor: `Programmatic Tool Calling results + Eliminated 19+ inference passes`

> "Knowledge retrieval improved from 25.6% to 28.5%; GIA benchmarks improved from 46.5% to 51.2%."
>
> — Advanced Tool Use on the Claude Developer Platform, Programmatic Tool Calling results
>
> Anchor: `Programmatic Tool Calling results + Knowledge retrieval`

## Why the gain compounds

The post is explicit that PTC unlocked agent performance on multi-step web research benchmarks specifically: "On agentic search benchmarks like BrowseComp and DeepSearchQA, which test multi-step web research and complex information retrieval, adding programmatic tool calling on top of basic search tools was the key factor that fully unlocked agent performance." That's a stronger claim than "saves tokens" — it's saying some tasks are *only practical* via PTC because the intermediate-result context cost would otherwise dominate.

## When to use (per the docs page reinforcement)

- Processing large datasets where you only need aggregates or summaries
- Multi-step workflows with 3+ dependent tool calls
- Operations requiring filtering, sorting, or transformation of tool results
- Tasks where intermediate data shouldn't influence Claude's reasoning
- Parallel operations across many items (e.g., checking 50 endpoints)

## When NOT to use

- Single tool calls with simple responses
- Tools that need immediate user feedback (the code-execution loop adds latency vs a direct call)
- Very fast operations where code execution overhead would outweigh the benefit
- MCP-connector tools (per the docs page, "Tools provided by an MCP connector" cannot be called programmatically)

## Constraints worth flagging in chapter drafts

- `strict: true` is **not compatible** with PTC (per [[docs-programmatic-tool-calling]])
- `tool_choice` cannot force programmatic calling of a specific tool
- `disable_parallel_tool_use: true` is not supported with PTC
- Tool result messages responding to programmatic tool calls must contain **only** `tool_result` blocks — no text content

## Cross-references

- See [[docs-programmatic-tool-calling]] for the full API reference (response shape with `caller` field, container lifecycle, error handling).
- See [[blog-tool-search-tool]] — Tool Search reduces *definition* cost; PTC reduces *result* cost. They compose.
- See [[blog-advanced-tool-use-overview]] for the three-feature framing.
- See [[docs-tool-interface-design]] for how to write tool descriptions that work for both direct and programmatic invocation (the post emphasizes detailed output-format docs because Claude deserializes results in code).

## Open questions / follow-ups

- The 37% number applies "on complex research" — the post does not say which benchmark. The two named benchmarks (BrowseComp, DeepSearchQA) measure capability, not token use. Treat 37% as average reduction on the post's internal eval set unless a specific public benchmark is identified.
- The post says "20+ tool calls" and "19+ inference passes" — the +1 difference suggests one initial sampling plus one per-tool result, but PTC supposedly batches them all. The exact accounting is ambiguous; the takeaway (round-trip elimination) is the point.
- Custom tools become async Python functions (per docs), but the wrapper is hidden from the post's examples. Whether developers need to think about async at all when authoring tools is unclear — likely no, since the wrapper is automatic.
