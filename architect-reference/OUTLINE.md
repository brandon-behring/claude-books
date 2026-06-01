# The Claude Architect's Reference — Cert-Aligned Outline (D1–D5) · v0

**What this is.** The cert-aligned volume of the claude-books series. It maps 1:1 to Anthropic's *Claude Certified Architect — Foundations* (CCA-F) five-domain taxonomy. Exam-prep altitude: it owns the cert spine and **XRefs into the _Agentic Systems Design_ book** where a domain needs design depth.

**Created.** 2026-06-01, in the reorg that un-fused this cert book from the environment+context deep-dive (now the standalone _Agentic Systems Design_ book). See [`docs/BOOK-MAP.md`](../docs/BOOK-MAP.md).

**Backbone.** [`docs/research-program/`](../docs/research-program/) (taxonomy clusters + content-map rows), already bridging all five domains. **Coverage tracker:** [`docs/cert-coverage.md`](../docs/cert-coverage.md) — this outline is its architect-column source.

**Status.** Skeleton — slot + outline only. No chapters authored this round.

---

## Cross-book contract

- This book is **exam-prep altitude**; _Agentic Systems Design_ is **design / reference altitude**.
- Every cross-book XRef points **outward** (cert → design), never inward — preserving the design book's clean one-day extraction (see `agentic-systems-design/SPLIT.md`).
- A domain marked **REFERENCE** is mostly covered by an existing book (XRef it); **BUILD** is net-new prose this book owns.

---

## D1 — Agentic Architecture & Orchestration (27%) · mostly BUILD

**Backbone:** research-program taxonomy cluster (Agents & Orchestration); content-map rows: agent-loop, build-vs-buy, sub-agents, multi-agent, Agent SDK.
**XRef →** _Agentic Systems Design_ ch01 (Agent = Model + Harness), ch03 / ch07 (repo & scale substrate).
**Build:** agentic loops (`stop_reason`, tool-result handling) · coordinator–subagent patterns · multi-step workflows (programmatic vs prompt-based handoff) · Agent SDK hooks · task decomposition · session state (`--resume`, `fork_session`). _(all ⬜ in cert-coverage.md)_

## D2 — Tool Design & MCP Integration (18%) · BUILD

**Backbone:** `docs/research/02-mcp-spec`, `03-advanced-tool-use`, `04-agent-sdk`.
**XRef →** _Agentic Systems Design_ ch05 (skills — the procedure-vs-tool axis).
**Build:** effective tool interfaces · structured error responses (`isError`, retryability) · `tool_choice` distribution · MCP server config.

## D3 — Claude Code Configuration & Workflows (20%) · REFERENCE + thin BUILD

**Backbone:** `docs/research/08-claude-code-internals`.
**XRef →** _Agentic Systems Design_ ch04 (instruction layer / CLAUDE.md design), ch05 (skills design) — the 📘 cells in cert-coverage.md.
**Build (exam-prep angle):** CLAUDE.md hierarchy mechanics + `@import` · `.claude/rules/` glob-scoping · plan mode · iterative refinement · CI/CD (`-p`, `--output-format json`, `--json-schema`).
**Note:** the handbook is the use-side primary owner of D3; this book is the design / architecture angle.

## D4 — Prompt Engineering & Structured Output (20%) · BUILD

**Backbone:** `docs/research/05-claude-api`, `07-structured-output`.
**Build:** explicit criteria over vague instructions · few-shot for ambiguous cases · structured output via `tool_use` + JSON schema · validation / retry / feedback loops · batch processing · multi-pass review.
**Note:** prompting basics are the handbook's; tool_use + schemas + batch + multi-pass review are this book's.

## D5 — Context Management & Reliability (15%) · mostly REFERENCE

**Backbone:** `docs/research/` context-rot / assembly / memory dossiers.
**XRef →** _Agentic Systems Design_ ch08 (rot), ch09 (assembly), ch10 (memory), ch06 (guardrails) — the 📘 cells.
**Build (gaps only):** error propagation across multi-agent systems · human-review / confidence calibration.

---

## Verification (when authoring begins)

- Each D-section cites a `docs/research-program/` backbone path + (where 📘) an XRef target in _Agentic Systems Design_.
- `docs/cert-coverage.md` architect column reconciles with this outline's BUILD vs REFERENCE marks.
- `npm -w architect-reference run validate && build` passes once chapters land.
