# Cert book — authoring kickoff (handoff)

**Date:** 2026-06-01 · **Book:** `architect-reference/` (the **Cert** lens) · **Status:** skeleton (slot + D1–D5 `OUTLINE.md`), builds 6 pages, `profile=minimal`. **Next:** author chapters.

> Resume point for the cert book. The structural plan is [`architect-reference/OUTLINE.md`](../../architect-reference/OUTLINE.md); this doc adds the **open decisions + gotchas** a planning round needs. Scope context: [`docs/BOOK-MAP.md`](../BOOK-MAP.md). Authoring a 5-domain book is big → expect a fresh **plan-mode round** (3–5 clarifying questions) before writing.

## Setup (do first)

- **Add `BOOK_PROFILE=tools` to `architect-reference/.env`.** The design book has it; the cert skeleton lacks it → currently `profile=minimal`, so `validate` won't enforce the tools frontmatter (`cert_domains`, `tools_compared`). *The assistant is permission-blocked from `.env` files — the user creates this one line.*

## Domain map (weights + build-vs-reference; full detail in `OUTLINE.md`)

| Domain | Wt | Mode | Backbone (docs/research…) | XRef → Agentic Systems Design |
|---|---|---|---|---|
| D1 Agentic Architecture & Orchestration | 27% | mostly **BUILD** | research-program agents/orchestration; `04-agent-sdk`, `06-multi-agent-patterns` | ch01 (Agent=Model+Harness), ch03/ch07 |
| D2 Tool Design & MCP | 18% | **BUILD** | `02-mcp-spec`, `03-advanced-tool-use`, `04-agent-sdk` | ch05 (skills) |
| D3 Claude Code Config & Workflows | 20% | **REFERENCE** + thin build | `08-claude-code-internals` | ch04 (instruction layer), ch05 (skills) |
| D4 Prompt Eng & Structured Output | 20% | **BUILD** | `05-claude-api`, `07-structured-output` | — |
| D5 Context Mgmt & Reliability | 15% | mostly **REFERENCE** | context rot / assembly / memory dossiers | ch08/ch09/ch10/ch06 |

Use-side overlap: the **handbook** owns D3 (use) and shares D4; the cert book is the design / exam-prep angle. Cross-book contract: cert XRefs **outward** into the design book, never inward.

## Open decisions (resolve in the planning round — parallels the design book's 5)

1. **Genre.** The cert book is *exam-prep altitude*. Study-guide (objectives + "need to know" + practice Qs) vs reference vs hybrid? It need **not** match the design book's reference-altitude genre.
2. **First domain.** D1 (biggest, mostly BUILD) to lead with substance, vs a REFERENCE-heavy one (D5/D3) to cheaply establish the cross-book XRef pattern first.
3. **Granularity.** One chapter per domain (5 ch) vs per task-area (finer; `docs/cert-coverage.md` lists the task areas).
4. **Cross-book XRef mechanism.** How does an `<XRef>` from `architect-reference` resolve into an `agentic-systems-design` chapter? `labels.json` is per-book — cross-book linking may need a scaffold feature or plain prose links. Investigate; possibly file a scaffold gap.
5. **SPLIT.md nuance.** Once the cert book XRefs INTO the design book, `agentic-systems-design/SPLIT.md`'s "0 cross-refs **in**" is no longer literally true. It does **not** block the design book's extraction (the design book has 0 *outbound* deps); inbound cert refs are the *cert book's* concern on extraction (repoint to the published design book). Update SPLIT.md wording when the first cert→agentic XRef lands.

## Carry these conventions (CLAUDE.md + the design book)

- **Sources:** cite the **public** CCA-F taxonomy + Anthropic Academy. **Never** the confidential `instructor_*.pdf`.
- Practice tags (`official`/`practitioner`/`convergence`); margin notes (25-word cap, approved labels); `cert_domains` frontmatter; scaffold components only; honest evidence tiering; PEDAGOGY constraints (≤3 concepts/section, two-level disclosure, F-pattern headings, claim-first sentences).
- **Build gotcha:** `book-scaffold validate` misses `tier`/`volatility` enum violations + MDX `<<` — only a full `npm -w architect-reference run build` catches them. Valid tiers `T1-official`/`T2-release-notes`/`T3-practitioner`/`T4-conjecture`; volatility `stable-principle`/`architectural-pattern`/`feature-surface`.

## Pointers

OUTLINE `architect-reference/OUTLINE.md` · backbone `docs/research-program/` + `docs/research/{02,03,04,05,06,07,08}` · coverage matrix `docs/cert-coverage.md` · scopes `docs/BOOK-MAP.md`.
