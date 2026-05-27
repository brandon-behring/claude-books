# Topic trajectories — momentum dashboard (v1)

One row per topic in [`taxonomy.graph.json`](./taxonomy.graph.json). Tracks how each topic is moving so depth follows the field and nothing silently rots.

> **Momentum = a hand-applied quality rubric (resolved 2026-05-26 — see [`decisions.md`](./decisions.md) D3).** Velocity (arXiv/blog/spec/GitHub dated-artifact rate) is a flash-in-the-pan *detector*, never a score on its own; weight it by **source-tier × sustained-vs-spike × convergence-count**. Demo-ware ≠ adoption (count real config/co-author traces, not stars — stars are corrupted in this niche). Keep a **revival** path. Momentum is a **staleness + field-movement radar**, *not* the depth-gate — **depth stays editorial** (importance + mastery-gap + book-need); letting "heating" auto-drive depth would chase fads. The reads below are **hand reads** under this rubric. *All* automation is deferred to a real trigger (~10–15+ topics); no momentum engine yet.

**Momentum (provisional):** 🔥 heating · ☀️ stable/active · 🌥️ cooling · 💤 dormant · ↩️ revived · `?` unknown.
**Tier:** `strict-live` / `cache` / `stub`. **Band:** ★ active frontier · · positioned.

## ★ Active frontier

### Environment Engineering
| Topic | Mom. | Tier | Last | Notes |
|---|---|---|---|---|
| Repo & doc design for agents | 🔥 | strict-live | 2026-05-26 | **DOSSIER COMPLETE** (Wave 1; 8 sources, 14 atoms, 14/14 citation-clean, audit-round-1 clean). `~/Claude/research_agent_repo_design`. |
| CLAUDE.md/AGENTS.md discipline | 🔥 | strict-live | 2026-05-26 | **DOSSIER COMPLETE** (Wave 1; 6 sources, 14 atoms, 14/14 citation-clean, audit-round-1 clean). ETH measured result + the shipped-Ch2 convergence. `~/Claude/research_agent_claudemd_discipline`. |
| Guardrails & reversibility | 🔥 | strict-live | 2026-05-26 | **DOSSIER COMPLETE** (Wave 2; 8 sources, 19 atoms, 23/23 citation-clean, audit-round-1 clean). `.claudeignore` caught as a folk claim (→ `permissions.deny`); 84% prompt-cut + Replit verified. `~/Claude/research_agent_guardrails`. |
| Cross-domain / large-repo structure | ☀️ | strict-live | 2026-05-26 | **DOSSIER COMPLETE** (Wave 2; 12 sources, 21 atoms, 21/21 citation-clean, audit-round-1 clean). `INTERFACE.md` + "shallow index deeply linked" caught as folk coinages. `~/Claude/research_agent_cross_domain`. |
| Failure breadcrumbs | ☀️ | stub | 2026-05-26 | Stable discipline (Hashimoto). Deferred. |
| Skills & progressive disclosure | 🔥 | strict-live | 2026-05-27 | **DOSSIER COMPLETE** (Wave 4; 7 sources, 22 atoms, 22/22 citation-clean, audit-round-1 clean). First-class artifact + progressive disclosure + authoring discipline; launch date corrected to **Oct 16 2025** (folk "Jan-2026"). `~/Claude/research_agent_env_skills`. |

### Context & Assembly
| Topic | Mom. | Tier | Last | Notes |
|---|---|---|---|---|
| **Context assembly** (KV-cache, compaction, JIT) | 🔥 | strict-live | 2026-05-26 | **PILOT — DOSSIER COMPLETE** (15 sources, 22/22 citation-clean, audit-round-1 clean). `~/Claude/research_agent_context_assembly`. |
| Context rot / long-context limits | 🔥 | strict-live | 2026-05-26 | **DOSSIER COMPLETE** (Wave 1; 8 sources, 13 atoms, 13/13 citation-clean, audit-round-1 clean). Sister of assembly. `~/Claude/research_agent_context_rot`. |
| Context as currency | ☀️ | cache | 2026-05-23 | Shipped (handbook Ch5). Stable principle. |

### Memory
| Topic | Mom. | Tier | Last | Notes |
|---|---|---|---|---|
| Memory anti-patterns (typed/decay) | 🔥 | strict-live | 2026-05-26 | **DOSSIER COMPLETE** (Wave 2; 13 sources, 17 atoms, 25/25 citation-clean, audit-round-1 clean). Openly unsolved (Mem0, vendor-attributed); memory = recalled context. `~/Claude/research_agent_memory`. |
| Documentation-vs-memory boundary | ☀️ | stub | 2026-05-26 | Conceptual; near-term. |
| Claude Code memory & sessions | ☀️ | cache | 2026-05-23 | Evolving feature surface. |

### Tools & MCP
| Topic | Mom. | Tier | Last | Notes |
|---|---|---|---|---|
| Tool minimization (subtract-first) | 🔥 | strict-live | 2026-05-27 | **DOSSIER COMPLETE** (Wave 4; 6 sources, 18 atoms, 18/18 citation-clean, audit-round-1 clean). Verified case studies (Vercel removed 80%→1 bash tool / Copilot 40→13 / Block 30+ APIs→3) **replaced the folk 16→1·30→2 figures**; the evaluate-then-prune loop. `~/Claude/research_agent_tool_minimization`. |
| MCP design & security | 🔥 | strict-live | 2026-05-27 | **DOSSIER COMPLETE** (Wave 4; 12 sources, 32 atoms, 32/32 citation-clean, audit-round-1 clean). Design side + governance/ecosystem; **dual-layer** current 2025-11-25 spec + announced 2026-07-28 RC (`stale_after`→2026-07-28). Attack surface stays `ops_security`. `~/Claude/research_agent_mcp_design`. |
| Advanced tool use (Tool Search, PTC) | ☀️ | cache | 2026-05-23 | Evolving. |
| MCP spec + ecosystem | 🔥 | cache | 2026-05-23 | Spec churns quarterly; re-verify often. |

### Agents & Orchestration
| Topic | Mom. | Tier | Last | Notes |
|---|---|---|---|---|
| Agent loop / agentic architecture | ☀️ | cache | 2026-05-23 | Stable core (handbook Ch1); the D1 anchor. |
| Harness frame & vocabulary | 🔥 | stub | 2026-05-26 | Vocabulary crystallized Feb–Apr 2026. |
| Build-vs-buy a custom harness | 🔥 | stub | 2026-05-26 | Active "use existing vs build" debate. |
| Sub-agents (context isolation) | ☀️ | cache | 2026-05-23 | Evolving (forked sub-agents, P/G/E). |
| Multi-agent patterns | ☀️ | cache | 2026-05-23 | Evolving. |
| Claude Agent SDK | 🔥 | cache | 2026-05-23 | Fast-moving API surface. |

### Evaluation & Verification
| Topic | Mom. | Tier | Last | Notes |
|---|---|---|---|---|
| Eval harnesses (LLM-judge, task suites) | 🔥 | strict-live | 2026-05-27 | **DOSSIER COMPLETE** (Wave 3; 4 sources, 11 atoms, 11/11 citation-clean, audit-round-1: 1 CORRECT — UK AI *Security* Institute rename). 2 Anthropic T1 primaries (2024 + 2026) + Inspect `epochs` + Zheng LLM-judge. `~/Claude/research_agent_eval_harnesses`. |
| Eval tooling landscape | 🔥 | stub | 2026-05-26 | Consolidating (Promptfoo→OpenAI). Deferred. |
| Benchmarks (Terminal-Bench, SWE-bench Pro) | 🔥 | stub | 2026-05-26 | Shifting 2026; contamination arms race. Deferred. |
| Validation architecture (6-layer) | ☀️ | cache | 2026-05-23 | Shipped (handbook Ch7). Stable. |

### Production Operations
| Topic | Mom. | Tier | Last | Notes |
|---|---|---|---|---|
| Observability / tracing / attribution | ☀️ | stub | 2026-05-26 | OTel + session logs + git attribution; steady. |
| Cost / token economics | 🔥 | stub | 2026-05-26 | KV-cache economics; cross-cutting, rising attention. |
| Security / prompt-injection / supply-chain | 🔥 | strict-live | 2026-05-27 | **DOSSIER COMPLETE** (Wave 3; 18 sources, 26 atoms, 30/30 citation-clean, audit-round-1 clean). Adversarial counterpart to guardrails; "~12–20% malicious skills" folk figure escalated (real primary: 5.2%/26.1%); EchoLeak CVE id anchored from NVD. `~/Claude/research_agent_ops_security`. |
| Human-in-the-loop / oversight | ☀️ | stub | 2026-05-26 | Approval gates, planning modes; steady. |
| Sandboxes (OS-level, self-hosted, tunnels) | 🔥 | stub | 2026-05-26 | 2026 infra shift; fast-moving. Deferred. |

## · Positioned (mapped, not yet active)

| Topic | Cluster | Mom. | Tier | Last | Notes |
|---|---|---|---|---|---|
| Prompt engineering | Prompting & SO | ☀️ | cache | 2026-05-23 | Stable principles. |
| Structured output | Prompting & SO | ☀️ | cache | 2026-05-23 | Evolving. |
| Claude Code internals | CC product surface | 🔥 | cache | 2026-05-23 | Frequent releases + CVEs. |
| Headless / CI / automation | CC product surface | ☀️ | cache | 2026-05-23 | Evolving. |
| Claude Platform & API surfaces | Claude Platform & API | 🔥 | cache | 2026-05-23 | Fast-moving. |
| Claude Code incidents & postmortems | Reliability/Gov/Compliance | 🔥 | cache | 2026-05-23 | Frequent CVEs; re-verify. |
| Governance & compliance (EU AI Act) | Reliability/Gov/Compliance | ☀️ | cache | 2026-05-23 | EU AI Act Aug-2-2026 deadline nearing. |
| Mental model / what Claude Code is | Handbook Foundations | ☀️ | cache | 2026-05-23 | Shipped (Ch1). Stable. |
| Getting started / first session / productivity | Handbook Foundations | ☀️ | cache | 2026-05-23 | Shipped (Ch3–4). Stable. |
| Team adoption & scaling patterns | Field Patterns & Adoption | ☀️ | stub | 2026-05-26 | 67-repo audit corpus (field-guide draft). |
| Public case studies (Replit, Vercel, Copilot) | Field Patterns & Adoption | 🔥 | stub | 2026-05-26 | Contrast genre to the audit; near-term. |
| Market & ecosystem (funding/adoption) | Field Patterns & Adoption | 🔥 | stub | 2026-05-26 | Hot but **low book value** + fast-decaying; excluded from harvest. |
| Pedagogy & authoring research | Pedagogy & Authoring | ☀️ | cache | 2026-05-23 | Stable (meta). |
