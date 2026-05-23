# Multi-agent patterns — research dossier

Primary-source research cache for **Domain 1: Agentic Architecture & Orchestration (27%)** with cross-cutting reach into **Domain 5: Context Management & Reliability (15%)**. Covers the canonical Anthropic-authored orchestrator-worker architecture, the official "when (not) to use multi-agent" decision framework, the productized Claude Managed Agents launch (Apr 8 / May 6 2026), and supporting reliability/conference notes.

**Snapshot**: 2026-05-22. Refresh when Multiagent Orchestration / Outcomes / Dreaming move from beta → GA, or when a new Anthropic engineering post lands.

## Topic summary

Multi-agent systems are the **second-most-deployed agentic pattern after single-agent + tools**, and the source of >40% of pilot failures (per Augment Code retrospective, third-party). Anthropic now publishes both **the canonical mechanism** (multi-agent research system, Jun 2025) and **the decision framework for when to use it** (Jan 2026) — and has productized the pattern as **Claude Managed Agents' Multiagent Orchestration** (public beta, expanded at Code w/ Claude SF May 6 2026).

The dossier captures depth on five primary sources:

1. **The architecture** (mechanism, metrics, decomposition heuristics, failure modes) — `blog-multi-agent-research-system.md`
2. **The decision framework** (when yes, when no, anti-patterns, trade-offs) — `blog-when-to-use-multi-agent.md`
3. **The productized version** (Multiagent Orchestration + Outcomes + Dreaming) — `blog-claude-managed-agents.md`
4. **The API surface** (coordinator config, thread model, cross-thread routing) — `docs-multiagent-sessions.md`
5. **Cross-references** to the April 23 postmortem (reliability discipline) and Code w/ Claude SF live blog (Routines, async-first architecture).

The five primary sources are mutually reinforcing: the **decision framework's three "yes" scenarios (context protection / parallelization / specialization)** map 1:1 to the **productized "three use patterns" in Multiagent Orchestration (parallelization / specialization / escalation)** — confirming the design lineage from research blog → decision framework → product.

## Table of notes

| File | Source tier | What it covers |
|---|---|---|
| [`blog-multi-agent-research-system.md`](./blog-multi-agent-research-system.md) | T1 | Hub-and-spoke architecture; 90.2% perf gain; 4× / 15× token multipliers; 80% variance from token usage; decomposition heuristics; documented failure modes; rainbow deployments |
| [`blog-when-to-use-multi-agent.md`](./blog-when-to-use-multi-agent.md) | T1 | Three "yes" scenarios; 3-10× token cost; anti-pattern (role-based decomposition); trade-off table; verification-subagent pattern |
| [`blog-claude-managed-agents.md`](./blog-claude-managed-agents.md) | T1 | Apr 8 launch + May 6 expansion; Multiagent Orchestration / Outcomes / Dreaming; named launch customers (Notion, Rakuten, Asana, Sentry, Atlassian, ServiceNow); $0.08 / session-hour pricing |
| [`docs-multiagent-sessions.md`](./docs-multiagent-sessions.md) | T1 | API surface: coordinator + roster; depth-1 limit; 25-thread cap; shared container; primary-thread event proxy; MCP scoping rules |
| [`blog-april-23-postmortem-stub.md`](./blog-april-23-postmortem-stub.md) | T1 | Cross-reference stub; the production-discipline lessons that apply to multi-agent (full home in `10-reliability-governance/`) |
| [`news-code-w-claude-sf-2026.md`](./news-code-w-claude-sf-2026.md) | T3 | Simon Willison live blog quotes — Boris Cherny on async-first, "Routines are higher-order prompts," Dianne Na Penn "design for the next model" |

## Cert task areas covered

### Domain 1 — Agentic Architecture & Orchestration (27%)

| Task area | Note(s) |
|---|---|
| **Coordinator-subagent patterns (hub-and-spoke, isolated context)** | [[blog-multi-agent-research-system]], [[docs-multiagent-sessions]], [[blog-claude-managed-agents]] |
| **Subagent invocation (`Task` tool, `allowedTools`, `AgentDefinition`)** | [[docs-multiagent-sessions]] (`multiagent.agents` roster, `agent_toolset_20260401`), [[blog-claude-managed-agents]] (agent definition) |
| **Multi-step workflows (programmatic vs prompt-based enforcement, handoff)** | [[blog-when-to-use-multi-agent]] (anti-pattern: role-based handoffs), [[blog-multi-agent-research-system]] (subagent task descriptions) |
| **Task decomposition (sequential pipelines vs adaptive decomposition)** | [[blog-multi-agent-research-system]] (decomposition heuristic table), [[blog-when-to-use-multi-agent]] (context- vs problem-centric split) |
| **Session state** | [[docs-multiagent-sessions]] (threads persist; archive; interrupt), [[blog-claude-managed-agents]] (stateful sessions, resume cleanly) |
| **Agentic loops** — deferred to `04-agent-sdk/` dossier when populated |
| **Agent SDK hooks** — deferred to `04-agent-sdk/` dossier when populated |

### Domain 5 — Context Management & Reliability (15%)

| Task area | Note(s) |
|---|---|
| **Error propagation across multi-agent systems (structured error context)** | [[blog-multi-agent-research-system]] (Production reliability section), [[blog-april-23-postmortem-stub]], [[blog-when-to-use-multi-agent]] (telephone-game context loss) |
| **Large-codebase context (scratchpads, subagent delegation)** | [[blog-multi-agent-research-system]] (memory plan persistence, artifacts pattern) |

## Decision framework — compact table (for chapter authors)

A pre-digested form for the architect-reference's "when multi-agent" chapter; full discussion in [[blog-when-to-use-multi-agent]]:

| Question | If **yes** → | If **no** → |
|---|---|---|
| Can improved single-agent prompting get the result? | Stay single-agent | Continue checks |
| Does Tool Search Tool reduce tool overhead enough? | Stay single-agent | Continue checks |
| Does context compaction extend the horizon enough? | Stay single-agent | Continue checks |
| Are there **true context boundaries** in the task? | Multi-agent candidate | Stop — splitting would be problem-centric (anti-pattern) |
| Is task value worth 3-10× token cost? | Multi-agent candidate | Stay single-agent |
| Does one subtask generate >1000 tokens of irrelevant data? | **Context protection** scenario | Continue checks |
| Are facets independently parallelizable? | **Parallelization** scenario | Continue checks |
| Does a single agent need >20 tools or conflicting personas? | **Specialization** scenario | None of the three; stay single-agent |

**The only multi-agent pattern that "consistently succeeds across domains"** is the **verification subagent** (main agent works, separate verifier blackbox-tests with explicit "must run complete test suite" mitigation).

## Headline numbers to carry into chapters

| Claim | Source | Note |
|---|---|---|
| Multi-agent (Opus 4 + Sonnet 4 subs) outperforms single-agent Opus 4 by **90.2%** | [[blog-multi-agent-research-system]] | Internal research eval |
| Agents use **~4× more tokens** than chat | [[blog-multi-agent-research-system]] | "In our data" |
| Multi-agent uses **~15× more tokens** than chat | [[blog-multi-agent-research-system]] | "In our data" |
| Token usage explains **~80% of performance variance** | [[blog-multi-agent-research-system]] | BrowseComp eval |
| Multi-agent typically uses **3-10× more tokens** than single-agent | [[blog-when-to-use-multi-agent]] | For equivalent tasks |
| Parallel tool calls cut research time **up to 90%** | [[blog-multi-agent-research-system]] | Complex queries |
| Decomposition: **1 / 2-4 / 10+ subagents** for simple / comparison / complex | [[blog-multi-agent-research-system]] | Heuristic in lead prompt |
| Tool-call budgets: **3-10 / 10-15 each / clearly divided** per tier | [[blog-multi-agent-research-system]] | Heuristic in lead prompt |
| **20 unique agents** max in coordinator roster; **25 concurrent threads** | [[docs-multiagent-sessions]] | Beta limits |
| **Depth-1 delegation only** (depth > 1 ignored) | [[docs-multiagent-sessions]] | Hard constraint |
| Claude Managed Agents runtime: **$0.08 per session-hour** | [[blog-claude-managed-agents]] | Plus standard token rates |
| ServiceNow: **29K+ employees** rolled to Claude + Claude Code | [[blog-claude-managed-agents]] | Sales prep 95% reduction; Build Agent default model |
| Outcomes lift: **up to 10 points** task success on structured generation | [[blog-claude-managed-agents]] | Internal benchmarks |
| Harvey Dreaming lift: **~6× task completion** | [[blog-claude-managed-agents]] | Internal testing |
| **40%** of multi-agent pilots fail within 6 months | landscape-2026-05.md §4.5 | **Third-party (Augment Code)** — not Anthropic-confirmed |

## Open questions / verification follow-ups

Aggregated from the per-note "Open questions" sections:

1. **"Internal eval" / "BrowseComp" provenance** — Anthropic-published, not peer-reviewed. Treat as such in chapter prose.
2. **Outcomes vs manual verification subagent** — is Outcomes a strict superset of the "verification subagent pattern"? Worth a chapter-author A/B test.
3. **Depth-1 delegation limit** — production teams building deeper hierarchies likely use outer Agent SDK orchestration; gap to fill in `04-agent-sdk/` dossier.
4. **`{"type": "self"}` coordinator-spawns-copies pattern** — documented but no use-case examples in docs.
5. **ZDR / HIPAA gap** for stateful Managed Agents sessions — customers with those requirements need self-hosted sandboxes; merits a callout in field-guide.
6. **Dreaming privacy semantics** in multi-tenant contexts — undocumented as of 2026-05-22.
7. **Routines + Managed Agents integration semantics** — does a Routine invocation create a Managed Agents session, or distinct compute paths? Awaiting docs from May 18 product update.
8. **Boris Cherny + Cat Wu Latent Space podcast** (referenced in landscape §7.3) — worth fetching as additional primary practitioner source if `04-agent-sdk/` or `10-reliability-governance/` need depth.

## Anti-patterns flagged for chapter authors

- **Don't cite "40% multi-agent pilot failure rate" as Anthropic-confirmed** — it's third-party (Augment Code retrospective). Use the documented qualitative quote: "Teams invest months building elaborate multi-agent architectures only to discover that improved prompting on a single agent achieved equivalent results."
- **Don't conflate the multi-agent research blog's "subagent" terminology with the Agent SDK `subagents` feature** — both exist; the research-blog version is conceptual, the SDK + Managed Agents versions are operational API features.
- **Don't recommend role-based decomposition (planner/implementer/tester/reviewer)** without explicitly flagging it as the documented anti-pattern. The exception is the **verification-subagent pattern** which is the only consistently-successful multi-agent shape.
- **Don't quote the 90.2% performance gain as a general benchmark** — it's Opus 4 lead + Sonnet 4 subs on Anthropic's internal research eval. Useful as illustrative magnitude, not as a generalizable "multi-agent is 90% better" claim.
- **Don't duplicate landscape-2026-05.md §5.1-5.3 prose** in chapter content — use this dossier's direct-from-source notes with citation anchors.
