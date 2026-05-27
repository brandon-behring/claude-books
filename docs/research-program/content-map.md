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
- **Wave 3 complete (2026-05-27):** two more strict-live dossiers bridged — `ops_security` (the adversarial-input layer, the explicit counterpart to `guardrails`; 18 sources, 26 atoms, 30/30 citation-clean, 5 `syn_ops_security_*` → Architect's-Reference security ch + Field-guide incident patterns + Handbook Ch13 antipatterns; payload is the **lethal-trifecta-as-necessary-conditions** hinge and **design-by-construction over evadable detection**; the "~12–20% malicious skills" folk figure was **escalated, not asserted** — real registry-scan primary is 5.2%/26.1% — and the EchoLeak CVE id was anchored from the **NVD primary**, not the secondary write-up) and `eval_harnesses` (the measurement discipline; 4 sources, 11 atoms, 11/11 citation-clean, 5 `syn_eval_harnesses_*` → Handbook **Ch7 measurement layer** + Architect's-Reference evaluation ch; build-evals-before-harnesses + LLM-judge-as-**calibrated-instrument** + read-results-statistically; CoVe caught the UK AI *Security* Institute rename). CoVe round-1: ops-security 0/0/0, eval-harnesses 1 CORRECT. The **composed KG now spans 9 projects** (D2/D5 proven at 9-wide — 608→595 records, same 5 shared sources + 4 shared caches as Wave 2, **0 atom-ID collisions**) at `~/Claude/research-kb/composed/` (`wave3_source_registry.yml` + `wave3_claim_graph.jsonl` + `wave3_merge_report.md`; the 7-wide `wave2_*` snapshot preserved). Book-payload: `syn_eval_harnesses_01` (evals-before-harnesses) cross-links shipped Ch7; `syn_ops_security_02` (design-by-construction) is a `<Tag kind="convergence">` candidate (independent T1 defense papers agree). `ops-sandboxes` stays deferred (no active book-consumer for OS-isolation infra).
- **Wave 4 complete (2026-05-27):** the **Tools & Extensibility trio** bridged — `env_skills` (Agent Skills as a first-class artifact + progressive disclosure + authoring discipline + distribution; 7 sources, 22 atoms, 22/22 citation-clean, 5 `syn_env_skills_*` → Handbook **Ch8** + Architect's-Reference config/skills ch; **all-first-party Anthropic** spine; launch date corrected to **Oct 16 2025** from the folk "Jan-2026"; the adoption-prevalence question escalated, no clean primary), `tool_minimization` (subtract-first; 6 sources, 18 atoms, 18/18 citation-clean, 5 `syn_tool_minimization_*` → Handbook Ch8 + Architect's-Reference tool-design ch + Field-guide; **the strict-live gather replaced the folk figures with verified case studies** — Vercel removed 80%→a single bash tool (100% vs 80% success), Copilot 40→13 tools (+2-5pp), Block 30+ APIs/200+ endpoints→3 MCP tools; `syn_tool_minimization_02` is the wave's one `<Tag kind="convergence">` candidate — three *independent* teams, each a vendor self-report not an independent benchmark), and `mcp_design` (MCP design + governance/ecosystem; 12 sources, 32 atoms, 32/32 citation-clean, 6 `syn_mcp_design_*` → Architect's-Reference MCP-design ch; user-signed-off scope = design + governance, attack surface stays `ops_security` S3). CoVe round-1: all three **0/0/0 clean**. **New methodology — the dual-layer "spec-in-transition" convention** (`mcp_design`): anchor *what is* (the current 2025-11-25 spec) and *what's coming* (the announced 2026-07-28 RC — stateless core, Tasks→extension, MCP Apps) as **distinct atoms**, the coming-layer phrased announced-not-current with `stale_after`→2026-07-28 so the freshness radar auto-flags the recheck; reuses existing `volatility`/`stale_after_days`/`supersedes` fields (cheap discipline, not new machinery). The **composed KG now spans 12 projects** (D2/D5 proven at 12-wide — 828→813 records, 7 shared sources + 4 shared caches, **0 atom-ID collisions**; the two new Wave-4 primaries cross-link the graph — the Agent Skills post ↔ `claudemd_discipline`, the "writing effective tools" post ↔ `context_assembly`) at `~/Claude/research-kb/composed/` (`wave4_source_registry.yml` + `wave4_claim_graph.jsonl` + `wave4_merge_report.md`; the 9-wide `wave3_*` snapshot preserved).
- **Wave 5 complete (2026-05-27):** the **Agents & Orchestration D1 architecture spine** bridged — `harness_frame` (Agent = Model + Harness; inner/outer loop; the 3-layer context/environment/assembly model; components taxonomy; provenance; 10 sources, 20 atoms, 20/20 citation-clean, 5 `syn_harness_frame_*` → Architect's-Reference **opening/architecture ch** + Handbook **Ch1 framing bridge**; CoVe **0/0/0 clean**), `harness_buildvsbuy` (when-to-build-custom vs configure/wrap an existing harness; decision criteria + framework landscape + the middle path; 7 sources, 14 atoms, 14/14 citation-clean, 5 `syn_harness_buildvsbuy_*` → Architect's-Reference architecture/decision ch; CoVe **1 CORRECT** — managed-agents authorship), `sub_agents` (context-isolation mechanism — fresh context, forked sub-agents, P/G/E, isolation-not-capability; 7 sources, 18 atoms, 18/18 citation-clean, 5 `syn_sub_agents_*` → Handbook **Ch10** + Architect's-Reference orchestration ch; CoVe **1 FLAG** — claude.com/blog is an SPA with live↔cache drift, the **cache is the source of truth**), and `multi_agent` (orchestrator-worker topologies, when-not-to, the role-decomposition anti-pattern; 6 sources, 15 atoms, 15/15 citation-clean, 5 `syn_multi_agent_*` → Architect's-Reference multi-agent ch; CoVe **1 CORRECT** — multi-agent-research authorship; **preserves the Anthropic orchestrator-worker vs Cognition "don't build multi-agents" tension UNFLATTENED** — both framings carried, not reconciled). Plus the orphan `capabilities_scaling` (built **May-20** pre-wave, re-verified v2.5.0) **bridged** into a new positioned node `agent-capabilities` (11 sources, 14 atoms, citation-clean → Architect's-Reference **background** — the Model half of Agent = Model + Harness; scaling/emergence, *not* a how-to topic). **Book targets:** the Architect's-Reference D1 architecture spine reads `harness_frame → harness_buildvsbuy → sub_agents → multi_agent`; the Handbook gets the **Ch1 framing bridge** (harness_frame) + **Ch10 sub-agents**; `agent-capabilities` is orthogonal background. The **composed KG now spans 17 projects** (D1 + D2 + D5 proven at 17-wide — **1120 raw → 1092 composed** (28 shared nodes collapsed), **141 distinct sources, 14 shared, 5 shared caches**, **0 claim/evidence ID collisions** (asserted at merge); HumanLayer same-as applied; the big cross-dossier shared primaries are **building-effective-agents** ↔ `harness_frame`/`harness_buildvsbuy`/`multi_agent` and **multi-agent-research** ↔ `sub_agents`/`multi_agent`) at `~/Claude/research-kb/composed/` (`wave5_source_registry.yml` + `wave5_claim_graph.jsonl` + `wave5_merge_report.md`; the 12-wide `wave4_*` snapshot preserved byte-identical).
