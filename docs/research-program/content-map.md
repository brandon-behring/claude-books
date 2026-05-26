# Content map — research → book (v0)

Which topics (and eventually which *atoms*) back which planned chapters/sections, across the three
books. In the spirit of [`docs/cert-coverage.md`](../cert-coverage.md) — cert domains are the
**floor**; this map is the fuller picture.

> **Living + versioned.** This is **topic-grain** today (the strict-live dossiers don't exist yet,
> so there are no atoms to map). As dossiers land, each topic's verified **atoms** get mapped to
> specific chapter/section units here, and the grain refines. Atoms grow and mappings change over
> time — expect this file to churn. The pilot (`context assembly`) builds the **first atom-grain
> slice** and proves the "atoms compose into chapter units" acceptance gate.

**Legend:** ✍️ shipped · 🎯 planned/outlined · 🌱 candidate (topic could feed this, not yet planned) · — n/a

| Topic | Cert (floor) | Handbook (use) | Architect's Reference (design) | Field-Guide (observed) |
|---|---|---|---|---|
| Repo & doc design for agents | D1,D3 | 🎯 Ch2 area (codebase-as-curriculum) | 🎯 Environment-engineering chapter | 🌱 repo-hygiene patterns |
| CLAUDE.md/AGENTS.md discipline | D3 | ✍️ Ch2 (60-line) — **convergence** | 🎯 env-eng / config | 🌱 at-scale CLAUDE.md findings |
| Guardrails & reversibility | D3,D5 | 🌱 Ch8/antipatterns | 🎯 permissions/sandboxes/safety | 🌱 incident-driven guardrails |
| Cross-domain / large-repo structure | D1,D3 | — | 🎯 large-codebase chapter | 🌱 monorepo patterns |
| Failure breadcrumbs | D3,D5 | 🌱 working-practices | 🎯 harness-improvement loop | 🌱 |
| **Context assembly** (pilot) | D5 | 🎯 Ch5 (context-as-currency depth) | 🎯 context-assembly / SDK loader | — |
| Context rot / long-context limits | D5 | 🌱 Ch5 caveat | 🎯 context-management chapter | — |
| Context as currency | D5 | ✍️ Ch5 | 🌱 | — |
| Memory anti-patterns | D5 | 🌱 Ch5 (memory-staleness Pitfall) | 🎯 memory-architecture chapter | 🌱 |
| Documentation-vs-memory boundary | D3,D5 | 🌱 | 🎯 memory chapter | — |
| Claude Code memory & sessions | D3 | ✍️/🎯 Ch5 | 🌱 | — |
| Tool minimization | D2 | 🌱 Ch8 | 🎯 tool-design chapter | 🌱 tool-count findings |
| MCP design & security | D2 | 🌱 Ch8 (consume vs build) | 🎯 MCP-design chapter | 🌱 MCP server audits |
| Advanced tool use | D2 | 🌱 | 🎯 tool-use chapter | — |
| MCP spec + ecosystem | D2 | — | 🎯 MCP chapter | 🌱 |
| Harness frame & vocabulary | D1 | 🌱 Ch1 framing (bridge) | 🎯 opening / architecture chapter | 🌱 |
| Sub-agents (context isolation) | D1 | 🎯 Ch10 (use subagents) | 🎯 orchestration chapter | 🌱 reviewer-subagent pattern |
| Multi-agent patterns | D1,D5 | 🌱 Ch10 | 🎯 multi-agent chapter | 🌱 multi-agent pilots |
| Claude Agent SDK | D1,D2 | — | 🎯 SDK chapters | — |
| Eval harnesses | D4,D5 | 🌱 Ch7 | 🎯 evaluation chapter | 🌱 eval-discipline findings |
| Eval tooling landscape | D4 | — | 🎯 eval-tooling section | 🌱 |
| Benchmarks | D4 | — | 🌱 | 🌱 benchmark realities |
| Validation architecture (6-layer) | D4,D5 | ✍️ Ch7 | 🌱 | — |
| Prompt engineering | D4 | 🎯 Ch3/4 | 🎯 prompting chapter | — |
| Structured output | D4 | 🌱 | 🎯 structured-output chapter | — |
| Claude Code internals | D3 | ✍️/🎯 Ch8 | 🌱 | 🌱 config-at-scale |
| Headless / CI / automation | D3 | 🌱 | 🎯 CI/automation chapter | 🌱 CI auto-fix patterns |
| Incidents (Replit, sandbox) | D5 | 🌱 antipatterns | 🌱 reliability | 🎯 failure case studies |
| Sandboxes (self-hosted, tunnels) | D3,D5 | — | 🎯 deployment/safety chapter | 🌱 |
| Governance & compliance | D5 | — | 🌱 | 🎯 compliance chapter |
| Anthropic Academy courses | D1–D5 | 🌱 (T1 source) | 🌱 (T1 source) | — |
| Claude API surfaces | D2,D4 | — | 🎯 API chapters | — |
| Market & ecosystem | — | — | — | 🌱 landscape (low priority) |
| Pedagogy & authoring | — | meta | meta | meta |

## Notes

- Book chapter targets are **indicative** — the Architect's Reference outline is greenfield, and
  the field-guide's 67-repo audit corpus is a different evidence class (publicly-reported case
  studies like Replit/Vercel are a *contrast* genre, not part of the audit).
- The **convergence** row (CLAUDE.md 60-line discipline ↔ shipped handbook Ch2) is the highest-value
  near-term tie-in: practitioner sources (Hashimoto / HumanLayer / ETH) independently corroborate
  what Ch2 already teaches → a `<Tag kind="convergence">` opportunity in a later enrichment round.
