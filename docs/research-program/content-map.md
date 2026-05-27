# Content map — research → book (v1)

Which topics (and eventually which *atoms*) back which planned chapters/sections, across the three books. Cert domains are the **floor** (see [`docs/cert-coverage.md`](../cert-coverage.md)); this is the fuller picture.

> **Living + versioned, topic-grain today.** No dossiers exist yet, so there are no atoms to map. As dossiers land, each topic's verified **atoms** map to specific chapter/section units and the grain refines. The pilot (`context assembly`) builds the **first atom-grain slice** and proves the "atoms compose into chapter units" gate. Expect churn.

**Legend:** ✍️ shipped · 🎯 planned/outlined · 🌱 candidate · — n/a

## ★ Active frontier

| Topic | Cert | Handbook | Architect's Reference | Field-Guide |
|---|---|---|---|---|
| Repo & doc design for agents | D1,D3 | 🎯 Ch2 area | 🎯 environment-engineering ch | 🌱 repo-hygiene |
| CLAUDE.md/AGENTS.md discipline | D3 | ✍️ Ch2 *(convergence)* | 🎯 env-eng / config | 🌱 at-scale findings |
| Guardrails & reversibility | D3,D5 | 🌱 Ch8/antipatterns | 🎯 safety/permissions | 🌱 incident-driven |
| Cross-domain / large-repo structure | D1,D3 | — | 🎯 large-codebase ch | 🌱 monorepo |
| Failure breadcrumbs | D3,D5 | 🌱 working-practices | 🎯 harness-improvement loop | 🌱 |
| Skills & progressive disclosure | D3 | 🎯 Ch8 | 🎯 config/skills ch | 🌱 |
| **Context assembly** (pilot) | D5 | 🎯 Ch5 depth | 🎯 context-assembly / SDK loader | — |
| Context rot / long-context limits | D5 | 🌱 Ch5 caveat | 🎯 context-management ch | — |
| Context as currency | D5 | ✍️ Ch5 | 🌱 | — |
| Memory anti-patterns | D5 | 🌱 Ch5 Pitfall | 🎯 memory-architecture ch | 🌱 |
| Documentation-vs-memory boundary | D3,D5 | 🌱 | 🎯 memory ch | — |
| Claude Code memory & sessions | D3 | ✍️/🎯 Ch5 | 🌱 | — |
| Tool minimization | D2 | 🌱 Ch8 | 🎯 tool-design ch | 🌱 tool-count findings |
| MCP design & security | D2 | 🌱 Ch8 | 🎯 MCP-design ch | 🌱 MCP audits |
| Advanced tool use | D2 | 🌱 | 🎯 tool-use ch | — |
| MCP spec + ecosystem | D2 | — | 🎯 MCP ch | 🌱 |
| Agent loop / agentic architecture | D1 | ✍️ Ch1 | 🎯 architecture ch | — |
| Harness frame & vocabulary | D1 | 🌱 Ch1 framing (bridge) | 🎯 opening ch | 🌱 |
| Build-vs-buy a custom harness | D1 | — | 🎯 architecture / decision ch | 🌱 |
| Sub-agents (context isolation) | D1 | 🎯 Ch10 | 🎯 orchestration ch | 🌱 reviewer-subagent |
| Multi-agent patterns | D1,D5 | 🌱 Ch10 | 🎯 multi-agent ch | 🌱 multi-agent pilots |
| Claude Agent SDK | D1,D2 | — | 🎯 SDK chapters | — |
| Eval harnesses | D4,D5 | 🌱 Ch7 | 🎯 evaluation ch | 🌱 eval-discipline |
| Eval tooling landscape | D4 | — | 🎯 eval-tooling | 🌱 |
| Benchmarks | D4 | — | 🌱 | 🌱 benchmark realities |
| Validation architecture (6-layer) | D4,D5 | ✍️ Ch7 | 🌱 | — |
| Observability / tracing / attribution | D5 | 🌱 | 🎯 operations ch | 🎯 observability patterns |
| Cost / token economics | D5 | 🌱 Ch5 | 🎯 cost ch | 🎯 cost findings |
| Security / prompt-injection / supply-chain | D5 | 🌱 antipatterns | 🎯 security ch | 🎯 incident patterns |
| Human-in-the-loop / oversight | D5 | 🌱 | 🎯 oversight ch | 🌱 |
| Sandboxes (self-hosted, tunnels) | D3,D5 | — | 🎯 deployment/safety ch | 🌱 |

## · Positioned

| Topic | Cert | Handbook | Architect's Reference | Field-Guide |
|---|---|---|---|---|
| Prompt engineering | D4 | 🎯 Ch3/4 | 🎯 prompting ch | — |
| Structured output | D4 | 🌱 | 🎯 structured-output ch | — |
| Claude Code internals | D3 | ✍️/🎯 Ch8 | 🌱 | 🌱 config-at-scale |
| Headless / CI / automation | D3 | 🌱 | 🎯 CI/automation ch | 🌱 CI auto-fix |
| Claude Platform & API surfaces | D2,D4 | — | 🎯 API chapters | — |
| Claude Code incidents & postmortems | D5 | 🌱 antipatterns | 🌱 reliability | 🎯 failure case studies |
| Governance & compliance | D5 | — | 🌱 | 🎯 compliance ch |
| Mental model / what Claude Code is | D1,D4 | ✍️ Ch1 | 🌱 (bridge) | — |
| Getting started / first session / productivity | D3,D4 | ✍️ Ch3–4 | — | — |
| Team adoption & scaling patterns | D3 | 🌱 | 🌱 | 🎯 audit chapters |
| Public case studies (Replit/Vercel/Copilot) | D5 | 🌱 | 🌱 contrast examples | 🎯 contrast genre |
| Market & ecosystem | — | — | — | 🌱 landscape (low) |
| Pedagogy & authoring | — | meta | meta | meta |

## Notes

- Chapter targets are **indicative** — the Architect's Reference outline is greenfield; the field-guide's 67-repo audit is its own evidence class (the public case studies are a *contrast* genre, not part of the audit).
- Highest-value near-term tie-in: the **CLAUDE.md 60-line convergence** ↔ shipped Ch2 — now **researched + measured** (Wave 1 `claudemd_discipline`): `syn_claudemd_discipline_03` shows official guidance + practitioner heuristic + a controlled study (the ETH AGENTS.md result) all converge, a ready `<Tag kind="convergence">` enrichment.
- The shipped handbook topics (Ch1 mental model, Ch5 context, Ch7 validation) are mapped so the graph reflects existing coverage, even though they came via the lighter cache, not strict-live (yet).
- **Pilot complete (2026-05-26):** the `context assembly` dossier (`~/Claude/research_agent_context_assembly` — 15 sources, 5 claim-families, 21 atoms, 22/22 citation-clean) is the first strict-live dossier. Its atoms map cleanly to **Handbook Ch5** subsections (e.g., the three Lumer cache atoms → "cost lever / dynamic-tail rule / caching-can-hurt caveat") and **Architect's-Reference** context-assembly sections — the first demonstration that atomic-grain research composes into chapter units. Atom→section mapping detail lives in the dossier's `agent_index/`.
- **Per-topic DoD update (2026-05-26, [`decisions.md`](./decisions.md) D4/D5):** every dossier now also ships a grounded `synthesis.md` (the interpretive layer, each claim citing its atom IDs) and uses **permanent, never-reused atom IDs** (revisions tombstone via `superseded_by`) so future book citations never dangle.
- **Wave 1 complete (2026-05-26):** three strict-live dossiers bridged in alongside the pilot — `repo_design` (env-eng substrate; 8 sources, 14 atoms, 5 `syn_repo_design_*` claims → Handbook Ch2 area + Architect's-Reference env-eng), `claudemd_discipline` (config-file content; 6 sources, 14 atoms, 5 `syn_claudemd_discipline_*` claims → shipped Ch2 convergence + config ch), and `context_rot` (degradation evidence; 8 sources, 13 atoms → Ch5 caveat + context-management ch). Atom→section mapping detail lives in each dossier's `agent_index/`. The **cross-project composed KG** (entity-resolved by `primary_url` + `sha256`; D2 proven at 4-wide — 3 shared sources, 4 shared caches, 0 atom-ID collisions) is at `~/Claude/research-kb/composed/` (`wave1_source_registry.yml` + `wave1_claim_graph.jsonl` + `wave1_merge_report.md`); viewer rendering deferred to the viz phase.
- **Wave 2 complete (2026-05-26):** three more strict-live dossiers bridged — `guardrails` (the policy/discipline layer of agent safety; 8 sources, 19 atoms, 5 `syn_guardrails_*` → Handbook permissions/config + Architect's-Reference guardrails ch; caught `.claudeignore` as a folk claim → `permissions.deny`), `cross_domain` (large-repo/monorepo structure, the deferred #6 boundary; 12 sources, 21 atoms, 5 `syn_cross_domain_*` → Architect's-Reference env-eng-at-scale), and `memory` (memory anti-patterns; 13 sources, 17 atoms, 5 `syn_memory_*` → Architect's-Reference memory ch + Handbook). Caught `INTERFACE.md` + "shallow index, deeply linked" as folk coinages; framed memory as openly unsolved (Mem0, vendor-attributed) with "memory = recalled context" bridging to `context_rot`. Atom→section detail in each dossier's `agent_index/`. The **composed KG now spans 7 projects** (D2 proven at 7-wide — 464→451 records, 5 shared sources, 4 shared caches, **0 atom-ID collisions**) at `~/Claude/research-kb/composed/` (`wave2_source_registry.yml` + `wave2_claim_graph.jsonl` + `wave2_merge_report.md`; the 4-wide `wave1_*` snapshot preserved). Book-payload: `syn_cross_domain_04` (tags/graph = navigate-before-read) and `syn_memory_03` (doc-vs-memory boundary) are `<Tag kind="convergence">` candidates; guardrails is documentation-grounded (mostly `<Tag kind="official">`).
