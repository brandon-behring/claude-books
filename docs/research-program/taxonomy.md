# Topic taxonomy (v1)

The narrative companion to [`taxonomy.graph.json`](./taxonomy.graph.json) (the source of truth + what renders). **v1** folds in the 2026-05-26 eyeball-pass decisions; it supersedes v0 (commit `c540511`).

> **Still provisional + emergent.** The clusters and 44 nodes are a *working* carving, not a settled ontology. The pilot re-assesses; the eventual KG reveals the true sub-areas. Argue with it.

## How to read it

- **Axis = topic/capability.** Cert domains + book targets ride along in node `data` as *lenses*; they are not the spine.
- **Two bands** (`data.frontier`): **active** = the harness-core + operations region we research first; **positioned** = mapped now (full three-books scope) but not yet active.
- **`kb_status`** — `ingested` (full color) = has research (existing cache or a dossier); `not_ingested` (greyed/dashed) = stub, not yet researched. The greyed *active* nodes are the gap this program fills first.
- **`tier`** — `strict-live` (a `~/Claude/` dossier) · `cache` (the lighter 167-note cache) · `stub`. Endgame: unify under strict-live.
- **`priority`** — `PILOT` · `near-term` · `deferred` / `deferred-low` · `cached` / `shipped`.

## Active frontier (7 clusters — researched first)

1. **Environment Engineering** — repo & doc design, CLAUDE.md/AGENTS.md discipline *(convergence w/ shipped Ch2)*, guardrails & reversibility, cross-domain structure, failure-breadcrumbs, **skills & progressive disclosure**.
2. **Context & Assembly** *(holds the pilot)* — **context assembly** (one node for v1; KV-cache/compaction/JIT/budget/positional-bias are its dossier sub-areas), context rot, context-as-currency.
3. **Memory** — anti-patterns (typed/decay), documentation-vs-memory boundary, Claude Code memory & sessions.
4. **Tools & MCP** — tool minimization, MCP design & security, advanced tool use, MCP spec.
5. **Agents & Orchestration** — **agent loop / agentic architecture**, harness frame & vocabulary, **build-vs-buy a custom harness**, sub-agents, multi-agent patterns, Agent SDK.
6. **Evaluation & Verification** — eval harnesses, eval tooling, benchmarks, validation 6-layer.
7. **Production Operations** *(new in v1)* — observability/tracing/attribution, cost/token economics, security/prompt-injection/supply-chain, human-in-the-loop/oversight, sandboxes.

## Positioned (7 clusters — mapped, not yet active)

8. **Prompting & Structured Output** — prompt engineering, structured output.
9. **Claude Code (product surface)** — internals (settings/hooks/commands), headless/CI.
10. **Claude Platform & API** — models, tool_use, thinking, batches, files, citations, computer use *(extracted from the old grab-bag)*.
11. **Reliability, Governance & Compliance** — Claude Code incidents/postmortems, governance/compliance (EU AI Act). *(Security + sandboxes moved to Production Operations.)*
12. **Handbook Foundations** *(new)* — mental model / what Claude Code is *(Ch1)*, getting started / first session / productivity *(Ch3–4)*.
13. **Field Patterns & Adoption** *(new)* — team adoption & scaling (the 67-repo audit), public case studies (Replit/Vercel/Copilot — a contrast genre to the audit), market/ecosystem *(low)*.
14. **Pedagogy & Authoring** *(meta)* — how the books themselves are made.

## What changed from v0

- **+ Production Operations** cluster (the missing "run it in prod" layer): observability, cost, security, HITL, sandboxes.
- **+ Handbook Foundations, + Field Patterns & Adoption, + Claude Platform & API** — so the map covers the *full three-books scope*, not just the design space.
- **Dropped `Academy courses` as a node** — it's a *source*, not a topic (belongs in seeds/bib).
- **Added gap nodes** the source-doc/cert/book triangulation surfaced: agent loop, build-vs-buy harness, skills & progressive disclosure, + the whole ops layer.
- **`ctx-assembly` kept as one node** — its ~6 sub-topics are the dossier's sub-areas, promoted to sibling nodes *after* the pilot.

## The first deep focus (gather phase)

The **pilot** is `ctx-assembly`. The **near-term** stubs to deepen after it: the Environment-Engineering set, context-rot, memory anti-patterns + doc-vs-memory, tool-minimization, MCP-design, harness-frame + build-vs-buy, eval-harnesses, the Production-Operations set, public case studies. Everything `cached` is already covered (lighter tier) and migrates to strict-live over time (single-system endgame).

## What's deliberately NOT settled

Clustering, node atomicity, and the dossier-worthy set are **open** — see the plan's *Open decisions*. This v1 is the foundation to pilot against, expected to iterate.
