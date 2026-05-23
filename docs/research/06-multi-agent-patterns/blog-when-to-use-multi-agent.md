---
source_url: https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them
canonical_url: https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them
source_title: "Building multi-agent systems: When and how to use them"
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: multi-agent-patterns
tier: T1-official
cert_domains: [1, 5]
cert_task_areas:
  - Coordinator-subagent patterns (hub-and-spoke, isolated context)
  - Task decomposition (sequential pipelines vs adaptive decomposition)
  - Multi-step workflows (programmatic vs prompt-based enforcement, handoff)
  - Error propagation across multi-agent systems (structured error context)
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# claude.com blog — Building multi-agent systems: When and how to use them

Anthropic's **official decision framework** for multi-agent systems. Published Jan 23, 2026. This is the source of record for: (a) the three scenarios where multi-agent wins (context protection, parallelization, specialization), (b) the anti-pattern of role/problem-centric decomposition, (c) the 3-10× token-cost claim, (d) the "start with the simplest approach" discipline, and (e) the verification subagent pattern. The architect-reference's "when multi-agent" chapter should draft directly from this post without re-reading.

## Key takeaways

- **Anti-pattern up front**: "Start with the simplest approach that works, and add complexity only when evidence supports it." Before multi-agent, **try Tool Search Tool (≤85% token reduction), context compaction, and improved prompting on a single agent.**
- **Three scenarios where multi-agent wins**:
  1. **Context protection** — subtasks generate >1000 tokens of irrelevant information that would degrade subsequent reasoning. Tasks should be well-defined and lookup/retrieval-based.
  2. **Parallelization** — independent search-space exploration; "thoroughness, not speed."
  3. **Specialization** — when one of three pressures applies: (a) tool-set quantity overload (avoid 20+ tools), (b) conflicting system-prompt personas, (c) domain expertise that would overwhelm a generalist.
- **3-10× token cost** is the canonical pricing rule of thumb — same for both single-task equivalence and the trade-off table.
- **Multi-agent is often slower in total latency despite parallelism** (coordination overhead).
- **Critical anti-pattern**: **problem-centric / role-based decomposition** (planner / implementer / tester / reviewer). Creates coordination overhead and "the telephone game" context loss at each handoff.
- **Effective decomposition is context-centric**: split at *true context boundaries* (independent research paths, separate components with clean interfaces, blackbox verification). Tightly coupled work or shared state belongs together.
- **The verification subagent is the only multi-agent pattern that "consistently succeeds across domains"** — main agent works, separate verifier blackbox-tests. Must mitigate early-victory ("must run complete test suite before marking as passed").
- **15-20+ tools** is the operational signal to consider Tool Search Tool *before* reaching for multi-agent.

## Quoted (citation-ready)

> "Start with the simplest approach that works, and add complexity only when evidence supports it."
>
> — Building multi-agent systems, The case for starting with a single agent
>
> Anchor: `The case for starting with a single agent + "Start with the simplest approach"`

> "Multi-agent implementations typically use 3-10x more tokens than single-agent approaches for equivalent tasks."
>
> — Building multi-agent systems, A decision framework for multi-agent systems
>
> Anchor: `A decision framework for multi-agent systems + "Multi-agent implementations typically use"`

> "Teams invest months building elaborate multi-agent architectures only to discover that improved prompting on a single agent achieved equivalent results."
>
> — Building multi-agent systems, The case for starting with a single agent
>
> Anchor: `The case for starting with a single agent + "Teams invest months building elaborate"`

> "Running multiple agents in parallel allows you to explore a larger search space."
>
> — Building multi-agent systems, A decision framework for multi-agent systems
>
> Anchor: `A decision framework for multi-agent systems + "Running multiple agents in parallel"`

> "Large language models have finite context windows" and degradation occurs when irrelevant data accumulates.
>
> — Building multi-agent systems, A decision framework for multi-agent systems
>
> Anchor: `A decision framework for multi-agent systems + "Large language models have finite"`

> "You MUST run the complete test suite before marking as passed."
>
> — Building multi-agent systems, The verification subagent pattern
>
> Anchor: `The verification subagent pattern + early-victory mitigation guidance`

## The decision framework (the three "yes" conditions)

### 1. Context protection

**When to apply**: a subtask generates large volumes of intermediate data (>1000 tokens of irrelevant info per the post's example) that would pollute the main agent's reasoning. The example: a 2000+ token order-history retrieval before diagnosing a technical issue.

**Constraints**:
- Subtask must be well-defined
- Operations should be lookup/retrieval-based
- Output to the orchestrator should be compact

**Benefit**: isolated context window prevents pollution from accumulating across the main agent's turns.

### 2. Parallelization

**When to apply**: independent facets that can run concurrently — multi-source research, separate components, blackbox tests.

**Trade-off**: 3-10× token cost; **thoroughness, not speed** is the gain (often slower wall-clock total because of coordination + slowest-subagent serialization).

### 3. Specialization

**Three sub-signals**:
- **Tool-set overload**: avoid 20+ tools on one agent; focused CRM/marketing/messaging agents outperform a generalist with 40+ tools (per the post's example).
- **System-prompt conflict**: two personas with conflicting behavioral modes (e.g., concise vs verbose, strict vs lenient) — split them.
- **Domain expertise**: deep domain instruction set that would overwhelm a generalist.

## Anti-patterns (the "no" conditions)

### Problem-centric / role-based decomposition

> Dividing by work type — planner, implementer, tester, reviewer — creates:
> - Constant coordination overhead
> - Context loss at handoffs ("the telephone game")
> - Information-fidelity degradation
> - More tokens spent coordinating than executing

This is the **single most-flagged anti-pattern** in the post and the most common failure mode in observed deployments (also reported by Augment Code's 40% multi-agent pilot failure rate — see landscape doc §4.5).

### When to use context-centric instead

| Effective (context-centric) | Counterproductive (problem-centric) |
|---|---|
| Independent research paths (Asia vs Europe) | Sequential phases of same work |
| Separate components with clean interfaces | Tightly coupled components |
| Blackbox verification tasks | Work requiring shared state |

## Trade-off table (verbatim shape)

| Dimension | Single Agent | Multi-Agent |
|---|---|---|
| Token usage | Baseline | 3-10× higher |
| Latency | Fast sequential | Often slower (despite parallelism) |
| Reliability | Single SPOF | Multiple failure points |
| Maintainability | One prompt set | Multiple prompts to maintain |
| Context coherence | Unified | Fragmented at handoffs |

## The verification subagent pattern (the one that works)

The only multi-agent pattern that "consistently succeeds across domains":
- Main agent completes work
- Verification agent **blackbox-tests** without full history
- Clear success criteria provided
- Minimal context transfer required

**Critical misstep mitigation**: verifiers tend to mark passing after 1-2 tests ("early victory" problem). Required instruction: "You MUST run the complete test suite before marking as passed."

This is the source of the "Writer/Reviewer" production pattern flagged in landscape-2026-05.md §7.2, and the field-guide's "read-only reviewer subagent (no Edit/Write tools); orchestrator applies fixes" observation.

## Decision-discipline checklist (for the architect-reference chapter)

Before reaching for multi-agent:

1. Can **improved prompting** on a single agent achieve the goal? (often yes)
2. Can **Tool Search Tool** reduce the tool-overhead pressure? (85% reduction available)
3. Can **context compaction** extend the single-agent horizon enough?
4. Are there **true context boundaries** in the task, or is decomposition synthetic?
5. Is the **expected throughput gain** worth 3-10× token cost?

If any "yes" at steps 1-3, stay single-agent. If "no" to step 4, **do not split** — split would be problem-centric. If "no" to step 5, single-agent.

## Cross-references

- See [[blog-multi-agent-research-system]] for the *mechanism* (architecture, token multipliers, decomposition heuristics) that this post sits on top of.
- See [[blog-claude-managed-agents]] for the productized version (Multiagent Orchestration in Claude Managed Agents).
- See [`/Users/brandonbehring/claude-books/docs/research/03-advanced-tool-use/blog-tool-search-tool.md`](../03-advanced-tool-use/blog-tool-search-tool.md) — the "try this first" alternative.
- See [`/Users/brandonbehring/claude-books/docs/landscape-2026-05.md`](../../landscape-2026-05.md) §5.2 for the current synthesis.

## Open questions / follow-ups

- **"3-10× tokens" range origin**: Anthropic-published; consistent with the multi-agent-research-system blog's 15× figure but framed for "equivalent tasks." Treat as canonical range.
- **No specific failure-rate claim** (40% from Augment is third-party). The post leans on qualitative "Teams invest months..."
- **"Context-centric decomposition" doesn't have a named taxonomy** in the post — the framework is the prose flow under the heading.
- **Verification subagent + Outcomes (Claude Managed Agents)** — the new "Outcomes" feature is a self-grading evaluator (see `blog-claude-managed-agents.md`). Worth cross-checking whether Outcomes obsoletes the manual verification subagent in production.
