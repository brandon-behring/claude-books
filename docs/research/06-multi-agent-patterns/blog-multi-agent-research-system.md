---
source_url: https://www.anthropic.com/engineering/multi-agent-research-system
canonical_url: https://www.anthropic.com/engineering/multi-agent-research-system
source_title: How we built our multi-agent research system
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: multi-agent-patterns
tier: T1-official
cert_domains: [1, 5]
cert_task_areas:
  - Coordinator-subagent patterns (hub-and-spoke, isolated context)
  - Task decomposition (sequential pipelines vs adaptive decomposition)
  - Subagent invocation
  - Error propagation across multi-agent systems (structured error context)
  - Large-codebase context (scratchpads, subagent delegation)
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Anthropic engineering blog — How we built our multi-agent research system

The canonical Anthropic-authored reference architecture for orchestrator-worker multi-agent systems. Documents the hub-and-spoke design that powers Claude's Research feature, with explicit metrics (90.2% performance gain, 4× / 15× token multipliers, 80% variance explained by token usage), decomposition heuristics, and documented failure modes. Published Jun 13, 2025; still cited in landscape-2026-05.md §5.1 as the canonical multi-agent reference.

## Key takeaways

- **Hub-and-spoke / orchestrator-worker** is the canonical pattern: a **lead agent** analyzes the query, develops a strategy, and **spawns subagents in parallel** to explore aspects independently. Subagents operate in **isolated context windows** and **do not see parent state**.
- **The lead agent persists its plan to Memory** to survive 200K-token context truncation; subagents retrieve stored context like the research plan from memory rather than losing work when reaching the context limit.
- **The artifacts pattern**: subagents output to filesystem/external storage and pass lightweight references back to the coordinator — bypassing the main coordinator for high-fidelity outputs while keeping the coordinator's context lean.
- **Performance**: multi-agent Opus 4 (lead) + Sonnet 4 (subagents) outperformed single-agent Opus 4 by **90.2%** on Anthropic's internal research eval.
- **Token cost**: agents use ~**4× more tokens** than chat; multi-agent systems use ~**15× more tokens** than chat. **Token usage alone explains ~80% of the performance variance** on BrowseComp.
- **Decomposition heuristics embedded in the lead prompt**: simple fact-finding = 1 agent / 3-10 tool calls; direct comparisons = 2-4 subagents / 10-15 calls each; complex research = 10+ subagents with clearly divided responsibilities.
- **Subagent task descriptions must specify**: objective, output format, tool/source guidance, and clear task boundaries.
- **Production reliability is hard**: "Minor system failures can be catastrophic for agents" — Anthropic uses **rainbow deployments** to gradually shift traffic between versions, and built tracing that monitors decision patterns without accessing conversation contents.
- **Documented failure modes**: spawning 50 subagents for simple queries; "scouring the web endlessly for nonexistent sources"; duplicate work / coverage gaps when task descriptions lack clarity; overly verbose search queries; choosing SEO content farms over authoritative sources; continuing research despite sufficient results.

## Quoted (citation-ready)

> "We found that a multi-agent system with Claude Opus 4 as the lead agent and Claude Sonnet 4 subagents outperformed single-agent Claude Opus 4 by 90.2% on our internal research eval."
>
> — How we built our multi-agent research system, Benefits of a multi-agent system
>
> Anchor: `Benefits of a multi-agent system + "Our internal evaluations show that"`

> "In our data, agents typically use about 4× more tokens than chat interactions, and multi-agent systems use about 15× more tokens than chats."
>
> — How we built our multi-agent research system, Benefits of a multi-agent system
>
> Anchor: `Benefits of a multi-agent system + "In our data, agents typically"`

> "We found that token usage by itself explains 80% of the variance in our BrowseComp eval."
>
> — How we built our multi-agent research system, Benefits of a multi-agent system
>
> Anchor: `Benefits of a multi-agent system + "We found that token usage"`

> "Simple fact-finding requires just 1 agent with 3-10 tool calls, direct comparisons might need 2-4 subagents with 10-15 calls each, and complex research might use more than 10 subagents with clearly divided responsibilities."
>
> — How we built our multi-agent research system, Prompt engineering and evaluations
>
> Anchor: `Prompt engineering and evaluations + "Simple fact-finding requires just 1"`

> "Each subagent needs an objective, an output format, guidance on the tools and sources to use, and clear task boundaries."
>
> — How we built our multi-agent research system, Prompt engineering and evaluations
>
> Anchor: `Prompt engineering and evaluations + "Each subagent needs an objective"`

> "The LeadResearcher begins by thinking through the approach and saving its plan to Memory to persist the context, since if the context window exceeds 200,000 tokens it will be truncated."
>
> — How we built our multi-agent research system, Architecture overview for Research
>
> Anchor: `Architecture overview for Research + "The LeadResearcher begins by thinking"`

> "Further, they can retrieve stored context like the research plan from their memory rather than losing previous work when reaching the context limit."
>
> — How we built our multi-agent research system, Appendix (Long-horizon conversation management)
>
> Anchor: `Appendix + "Further, they can retrieve stored"`

> "Rather than requiring subagents to communicate everything through the lead agent, implement artifact systems where specialized agents can create outputs that persist independently."
>
> — How we built our multi-agent research system, Appendix (Subagent output to filesystem pattern)
>
> Anchor: `Appendix + "Subagent output to a filesystem"`

> "Without effective mitigations, minor system failures can be catastrophic for agents."
>
> — How we built our multi-agent research system, Production reliability and engineering challenges
>
> Anchor: `Production reliability and engineering challenges + "Without effective mitigations, minor system"`

> "We use rainbow deployments to avoid disrupting running agents, by gradually shifting traffic from old to new versions while keeping both running simultaneously."
>
> — How we built our multi-agent research system, Production reliability and engineering challenges
>
> Anchor: `Production reliability and engineering challenges + "We therefore need to prevent"`

> "Research work involves open-ended problems where it's very difficult to predict the required steps in advance. You can't hardcode a fixed path for exploring complex topics, as the process is inherently dynamic and path-dependent."
>
> — How we built our multi-agent research system, Benefits of a multi-agent system
>
> Anchor: `Benefits of a multi-agent system + "Research work involves open-ended problems"`

## Architecture detail (mechanism)

**Lead agent (orchestrator)**:
- Analyzes user query, develops strategy
- Uses extended thinking as controllable scratchpad to plan approach
- **Saves plan to Memory** before context-limit truncation risk
- Spawns 3-5 subagents in parallel (vs serially)
- Synthesizes findings and decides if additional research needed
- Creates specialized subagents with specific task descriptions (objective, output format, tool/source guidance, boundaries)

**Subagents (workers)**:
- Each runs in **its own context window** — does not see parent state
- Own set of tools and prompts
- Use **interleaved thinking after tool results** to evaluate quality and identify gaps
- Use **3+ tools in parallel** within their own scope
- Can return findings to coordinator OR write artifacts to filesystem (artifacts pattern)

**Two parallelization strategies in production**:
1. Lead agent spins up 3-5 subagents in parallel (vs serially)
2. Subagents use 3+ tools in parallel (parallel tool calling — cut research time **up to 90%** for complex queries)

**Effort-scaling heuristic** (embedded in the lead prompt):

| Query type | Agent count | Tool calls |
|---|---|---|
| Simple fact-finding | 1 | 3-10 |
| Direct comparisons | 2-4 | 10-15 each |
| Complex research | 10+ | "clearly divided responsibilities" |

## Documented failure modes (verbatim from post)

Early system failures included:
- Spawning 50 subagents for simple queries
- "Scouring the web endlessly for nonexistent sources"
- Distracting each other with excessive updates
- Agents continuing when sufficient results already obtained
- Overly verbose search queries
- Selecting incorrect tools
- Subagents duplicating work or leaving gaps
- Choosing SEO-optimized content farms over authoritative sources
- Agents unable to judge appropriate effort for different tasks

These are the empirical antecedents to the official decision-framework anti-patterns in `blog-when-to-use-multi-agent.md`.

## Eight prompt-engineering principles (from post)

1. **Think like your agents** — build simulations to observe step-by-step behavior
2. **Teach orchestrator delegation** — detailed task descriptions with clear boundaries
3. **Scale effort to query complexity** — embed guidelines for resource allocation
4. **Tool design is critical** — match tool usage to user intent; examine available tools first
5. **Let agents improve themselves** — Claude 4 models can diagnose and suggest prompt improvements
6. **Start wide, then narrow** — short, broad queries before progressively narrowing focus
7. **Guide thinking process** — extended thinking as planning scratchpad; interleaved thinking for subagent evaluation
8. **Parallel tool calling** — up to 90% faster on complex queries

## Production-reliability practices (from post)

- **Resume from error points** rather than restart from beginning (statefulness + error compounding)
- **Full production tracing** of decision patterns and interaction structures **without accessing conversation contents** (privacy-preserving observability)
- **Rainbow deployments** to gradually shift traffic between versions while keeping both running
- **Synchronous execution bottleneck acknowledged**: lead agents execute subagents synchronously; async would add parallelism but adds result-coordination complexity

## Evaluation methodology

- **Small-sample testing** with ~20 representative queries; early changes showed 30% → 80% success-rate jumps
- **LLM-as-judge** scoring against rubric: factual accuracy, citation accuracy, completeness, source quality, tool efficiency. Outputs 0.0-1.0 with pass/fail grade. Single-LLM-call judge was "most consistent".
- **Human evaluation** catches edge cases: hallucinations, system failures, source-selection biases

## Cross-references

- See [[blog-when-to-use-multi-agent]] for the *decision* framework that builds on this *mechanism* (when to reach for this pattern vs single-agent + Tool Search).
- See [[blog-claude-managed-agents]] for the GA productization of this pattern (Multiagent Orchestration in Claude Managed Agents).
- See [[docs-multiagent-sessions]] for the API surface that lets you build this pattern on Anthropic infrastructure.
- See [`/Users/brandonbehring/claude-books/docs/research/03-advanced-tool-use/blog-tool-search-tool.md`](../03-advanced-tool-use/blog-tool-search-tool.md) — Tool Search is the prerequisite-to-try-first per the decision framework.
- See [`/Users/brandonbehring/claude-books/docs/research/03-advanced-tool-use/blog-programmatic-tool-calling.md`](../03-advanced-tool-use/blog-programmatic-tool-calling.md) — PTC is an alternative to multi-agent for sequencing many tool calls without context bloat.
- See [`/Users/brandonbehring/claude-books/docs/landscape-2026-05.md`](../../landscape-2026-05.md) §5.1 for the canonical synthesis already in use.

## Open questions / follow-ups

- **Specific eval names**: the "internal research eval" and "BrowseComp" are mentioned but not benchmarked against public peer-reviewed numbers. Treat as Anthropic-published.
- **"Up to 90% faster" parallel tool calls** has no published methodology — Anthropic-internal.
- **Synchronous-execution constraint**: the post flags it as a current limit; Claude Managed Agents (Apr 8 2026) may have resolved this in the productized version — verify when reading `docs-multiagent-sessions.md`.
- **Subagent task description schema** is described prose-style; no `AgentDefinition`-equivalent schema in the post. The Agent SDK / Claude Managed Agents docs are the operational reference.
