# Topic taxonomy (v0 — provisional)

The narrative companion to [`taxonomy.graph.json`](./taxonomy.graph.json). The graph is the
source of truth (and what renders); this file explains it.

> **Provisional + emergent.** The clusters and the ~33 topic nodes below are a *starting point*,
> re-derived from first principles from the two launchpad docs + the existing cache + the cert
> domains. They are **not fixed.** The pilot will re-assess the clustering; the eventual KG will
> reveal the true sub-areas. Treat this as a v0 to argue with, not a settled ontology.

## How to read it

- **Clusters** (`metadata.sections`) are the top-level regions — the filter pills + node colors
  in the viewer. They are lenses for navigation, **not** the deep structure.
- **`kb_status`** — `ingested` (full color) = the topic already has research (existing cache or a
  future strict-live dossier); `not_ingested` (greyed + dashed) = a **stub**, not yet researched.
  Right now the *new* harness/env/assembly topics are stubs (we haven't done them yet); the
  existing-cache topics show as ingested. **The greyed region is the gap this program fills.**
- **`tier`** — `strict-live` (a `~/Claude/` dossier) vs `cache` (the lighter 167-note per-source
  cache) vs `stub` (nothing yet). The endgame unifies everything under strict-live.
- **`priority`** — `PILOT` (context assembly) · `near-term` (the harness/env/assembly focus) ·
  `deferred` / `deferred-low` · `cached` / `shipped` (already covered elsewhere).
- **Cert domains + book targets** ride along in node `data` as lenses — cert is the *floor*.

## Clusters (v0)

1. **Environment Engineering** *(first deep region)* — the repo as the agent's substrate:
   repo/doc design, the CLAUDE.md/AGENTS.md 60-line discipline (a **convergence** with the shipped
   handbook Ch2), guardrails & reversibility, cross-domain structure, failure-breadcrumbs.
2. **Context & Assembly** *(first deep region; holds the pilot)* — the per-turn boundary layer:
   **context assembly** (KV-cache, compaction, JIT, token budget, positional bias) + its sister
   **context rot** (long-context limits) + the handbook's **context-as-currency**.
3. **Memory** — anti-patterns (typed/decay), the documentation-vs-memory boundary, Claude Code
   memory/sessions.
4. **Tools & MCP** — tool minimization (subtract-first, the count cliff), MCP design & security,
   advanced tool use, the MCP spec.
5. **Agents & Orchestration** — the harness frame & vocabulary, sub-agents (context isolation),
   multi-agent patterns, the Agent SDK.
6. **Evaluation & Verification** — eval harnesses (LLM-as-judge, task suites), the tooling
   landscape, benchmarks, the handbook's 6-layer validation.
7. **Prompting & Structured Output** — prompt engineering, structured output via `tool_use`.
8. **Claude Code Config & Workflows** — internals (settings/hooks/skills), headless/CI.
9. **Reliability, Governance & Security** — incidents (Replit, sandbox bypass), sandboxes
   (OS-level + self-hosted + MCP tunnels), governance/compliance.
10. **Foundations & Ecosystem** — Academy courses, the Claude API surfaces, market/ecosystem (low).
11. **Pedagogy & Authoring** — the meta-layer (how the books themselves are made).

## The first deep focus (gather phase)

The **near-term** harvest concentrates on clusters 1–2 (+ the memory boundary, tool minimization,
MCP design, harness frame, eval harnesses). These are the `not_ingested` / `near-term` nodes —
the genuine gaps the launchpad docs surfaced. The **pilot** is `ctx-assembly` (cluster 2), taken
fully through the strict-live pipeline as the proof-of-pattern.

Everything marked `cached` is already covered (at the lighter tier) by the existing
`docs/research/` cache; it is positioned here so the map is whole, and will migrate to strict-live
over time (the single-system endgame).

## What's deliberately NOT settled here

The clustering, the node atomicity, and which nodes deserve a deep dossier are all **open** — see
the plan's *Open decisions* list. This v0 exists to be revised once the pilot + breadth scan give
us something concrete to reason over.
