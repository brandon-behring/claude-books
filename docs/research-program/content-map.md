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
- Highest-value near-term tie-in: the **CLAUDE.md 60-line convergence** ↔ shipped Ch2 (a `<Tag kind="convergence">` opportunity in a later enrichment round).
- The shipped handbook topics (Ch1 mental model, Ch5 context, Ch7 validation) are mapped so the graph reflects existing coverage, even though they came via the lighter cache, not strict-live (yet).
