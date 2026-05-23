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

# Advanced tool use — overview and framing

The canonical Nov 24, 2025 Anthropic engineering post that introduces three beta features as a combined toolkit for scaling tool surfaces beyond the limits of traditional tool calling: **Tool Search Tool**, **Programmatic Tool Calling**, and **Tool Use Examples**. This note captures the shared framing; the three per-pattern notes go deeper on each.

## Key takeaways

- The post frames all three features as solutions to the same underlying problem: at scale, dumping every tool definition and every tool result into the context window degrades both cost and accuracy.
- Each feature targets a different failure mode: tool **definitions** swamping context (Tool Search), tool **results** swamping context (Programmatic Tool Calling), and tool **invocation** being underspecified (Tool Use Examples).
- The features are independent and can be combined; activated via the beta header `betas=["advanced-tool-use-2025-11-20"]` and require Sonnet 4.5 or later when the post was published (broader model support has since landed — see per-feature notes).
- The post explicitly positions advanced tool use as the path from "simple function calling toward intelligent orchestration" — the closing line of the article.
- Each feature section includes a "Less beneficial when:" clause — the post is unusually direct about when *not* to enable a feature.

## Quoted (citation-ready)

> "The future of AI agents is one where models work seamlessly across hundreds or thousands of tools."
>
> — Advanced Tool Use on the Claude Developer Platform, opening framing
>
> Anchor: `Opening framing + The future of AI agents`

> "Tool results and definitions can sometimes consume 50,000+ tokens before an agent reads a request."
>
> — Advanced Tool Use on the Claude Developer Platform, problem statement
>
> Anchor: `Problem statement + Tool results and definitions`

> "These features move tool use from simple function calling toward intelligent orchestration."
>
> — Advanced Tool Use on the Claude Developer Platform, conclusion
>
> Anchor: `Conclusion + These features move tool use`

## The three patterns at a glance

| Pattern | Problem solved | Headline result | Use when |
|---|---|---|---|
| **Tool Search Tool** | Tool definitions consume context before any work starts | 85% token reduction; Opus 4.5 accuracy 79.5% → 88.1% | 10+ tools; tool defs >10K tokens; multi-server MCP setups |
| **Programmatic Tool Calling** | Intermediate tool results pollute Claude's reasoning context | Token usage 43,588 → 27,297 (37% reduction); 19+ inference passes eliminated | Large-data filtering; 3+ dependent tool calls; aggregation tasks |
| **Tool Use Examples** | JSON schema can't express usage conventions for complex parameters | Complex-parameter accuracy 72% → 90% | Nested objects; optional-parameter correlations; format-sensitive inputs |

## Activation

```text
anthropic-beta: advanced-tool-use-2025-11-20
```

The post specifies `model="claude-sonnet-4-5-20250929"` or later at publication. As of May 2026, Tool Search supports Claude Mythos Preview, Sonnet 4.0+, Opus 4.0+, Haiku 4.5+ (per [[docs-tool-search-tool]]); Programmatic Tool Calling requires the `code_execution_20260120` tool version (per [[docs-programmatic-tool-calling]]); Input Examples is generally available on user-defined and Anthropic-schema client tools (per [[docs-define-tools]]).

## Cross-references

- See [[blog-tool-search-tool]] for the Tool Search Tool deep dive (token savings, accuracy gains).
- See [[blog-programmatic-tool-calling]] for the Programmatic Tool Calling deep dive (orchestration via code, 37% token reduction).
- See [[blog-tool-use-examples]] for the Tool Use Examples deep dive (72% → 90% accuracy).
- See [[docs-tool-interface-design]] for synthesis on naming, descriptions, consolidation, and tool overlap.
- See `docs/landscape-2026-05.md` §2.4 for the high-level summary that this dossier supplements.

## Open questions / follow-ups

- The beta header `advanced-tool-use-2025-11-20` has been stable since publication; is it still the active header in May 2026, or has it been folded into a newer beta or graduated? Verify against the current beta header reference page.
- The post mentions an internal case where "tool definitions consume 134K tokens before optimization" but does not name the customer or workload; treat as illustrative.
- The post does not cover how Tool Search + Programmatic Tool Calling interact when both are enabled (e.g., does Claude search for tools from within code execution?). Worth confirming from cookbook examples.
