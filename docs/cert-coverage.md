# Cert-domain coverage matrix

Each cert domain × task area × which book/chapter covers it. Used during each book's outline phase as a thoroughness check. Update as the cert evolves (watch list in [`cert-tracking.md`](./cert-tracking.md)) and as chapters land.

**Status legend**:
- ✅ shipped
- 🟡 outlined
- 🟢 in rewrite
- ⬜ not yet covered
- 📘 reference-altitude (now the *Agentic Systems Design* book) — design/architecture treatment, not exam-prep framing

The books target the publicly-known taxonomy. The confidential v0.1 PDF is internal research aid only; this matrix references the public 5-domain structure.

> **2026-06-01 reorg note.** The 11-ch *Environment & Context* volume is now its own book, **Agentic Systems Design** (formerly inside `architect-reference`). In this matrix: the **`Architect's Ref` column = the cert-aligned book** (D1–D5, mostly `⬜` — to build); the **`📘` cells = reference-altitude coverage that now lives in *Agentic Systems Design*** (ch4/ch5 instruction-layer + skills for D3; rot/assembly/memory/guardrails for D5; the *Agent = Model + Harness* frame behind D1). A dedicated "Agentic Design" column is deferred until the cert chapters are authored. See [`BOOK-MAP.md`](./BOOK-MAP.md).

**Agentic Systems Design — Environment & Context (11 ch, shipped 2026-05-30):** environment engineering (E1–E5) + context (rot / assembly / memory) at reference altitude. The cert-aligned Architect's Reference XRefs into it where D1/D3/D5 need design depth.

## Domain 1 — Agentic Architecture & Orchestration (27%)

Primary owner: **architect-reference**. Cross-references: handbook ch on agents/parallel work (use-side only); field-guide observations on multi-agent setups.

| Task area | Handbook | Architect's Ref | Field-Guide |
|---|---|---|---|
| Agentic loops (`stop_reason`, tool result handling) | ⬜ | 🟢 D1.1 (primary, authored 2026-06-01) | ⬜ |
| Coordinator-subagent patterns (hub-and-spoke, isolated context) | 🟡 ch10 (use-side) | 🟢 D1.2 (authored 2026-06-01) | ⬜ |
| Subagent invocation (`Task` tool, `allowedTools`, `AgentDefinition`) | 🟡 ch10 (use) | 🟢 D1.3 (authored 2026-06-01) | ⬜ |
| Multi-step workflows (programmatic vs prompt-based enforcement, handoff) | ⬜ | 🟢 D1.4 (authored 2026-06-01) | ⬜ |
| Agent SDK hooks (`PostToolUse`, tool interception, normalization) | ⬜ | ⬜ (primary) | ⬜ |
| Task decomposition (sequential pipelines vs adaptive decomposition) | 🟡 ch10 (delegation) | ⬜ (architecture) | ⬜ |
| Session state (`--resume`, `fork_session`, scratchpads) | 🟡 ch5 (scratchpads) | ⬜ (`fork_session`) | ⬜ |

## Domain 2 — Tool Design & MCP Integration (18%)

Primary owner: **architect-reference**. Cross-references: handbook on built-in tools usage + extension consumption; field-guide on observed MCP setups.

| Task area | Handbook | Architect's Ref | Field-Guide |
|---|---|---|---|
| Effective tool interfaces (descriptions, boundaries, naming) | ⬜ | ⬜ (primary) | ⬜ |
| Structured error responses (`isError`, `errorCategory`, retryability) | ⬜ | ⬜ (primary) | ⬜ |
| Tool distribution + `tool_choice` (`auto`/`any`/forced) | ⬜ | ⬜ (primary) | ⬜ |
| MCP server config (`.mcp.json` vs `~/.claude.json`, env var expansion) | 🟡 ch8 (consume-side) | ⬜ (deeper) | ⬜ |
| Built-in tools (Read, Write, Edit, Bash, Grep, Glob) | 🟡 ch3, ch8 | ⬜ | ⬜ |

## Domain 3 — Claude Code Configuration & Workflows (20%)

Primary owner: **handbook**. Cross-references: field-guide observations on CLAUDE.md at scale.

| Task area | Handbook | Architect's Ref | Field-Guide |
|---|---|---|---|
| CLAUDE.md hierarchy (user / project / directory; `@import`) | 🟡 ch2, ch9 | 📘 ch4 (instruction layer) | ⬜ |
| Custom slash commands + skills (`.claude/commands/`, `.claude/skills/`) | 🟡 ch8 | 📘 ch5 (skills) | ⬜ |
| `.claude/rules/` with YAML glob path-scoping | 🟡 ch9 | ⬜ | ⬜ |
| Plan mode vs direct execution | 🟡 ch3 | ⬜ | ⬜ |
| Iterative refinement (concrete examples, test-driven, interview pattern) | 🟡 ch6, ch7 | ⬜ | ⬜ |
| CI/CD integration (`-p` flag, `--output-format json`, `--json-schema`) | 🟡 ch12 | ⬜ | ⬜ |

## Domain 4 — Prompt Engineering & Structured Output (20%)

Split: prompting basics belong to **handbook**; tool_use + JSON schemas + batch processing + multi-pass review belong to **architect-reference**.

| Task area | Handbook | Architect's Ref | Field-Guide |
|---|---|---|---|
| Explicit criteria over vague instructions | 🟡 ch4 | ⬜ | ⬜ |
| Few-shot prompting (targeting ambiguous cases, format consistency) | 🟡 ch4, App B | ⬜ | ⬜ |
| Structured output via `tool_use` + JSON schemas | ⬜ | ⬜ (primary) | ⬜ |
| Validation, retry, feedback loops (semantic vs schema errors) | ⬜ | ⬜ (primary) | ⬜ |
| Batch processing (Message Batches API, custom_id, SLA matching) | 🟡 App B (basics) | ⬜ (deep) | ⬜ |
| Multi-instance / multi-pass review (independent reviewers, attention dilution) | 🟡 ch10 (worktrees), ch14 (code review) | ⬜ (architecture) | ⬜ |

## Domain 5 — Context Management & Reliability (15%)

Cross-cutting; shared across all three books.

| Task area | Handbook | Architect's Ref | Field-Guide |
|---|---|---|---|
| Long-conversation context (progressive summarization risks, lost-in-the-middle) | 🟡 ch5, App A | 📘 ch8 (rot), ch9 (assembly) | ⬜ |
| Escalation / ambiguity resolution patterns | 🟡 ch13 | ⬜ | ⬜ |
| Error propagation across multi-agent systems (structured error context) | ⬜ | ⬜ (primary) | ⬜ |
| Large-codebase context (scratchpads, subagent delegation, `/compact`) | 🟡 ch5, ch10 | 📘 ch7 (at scale), ch9 (compaction) | ⬜ |
| Human review workflows + confidence calibration | ⬜ | ⬜ | ⬜ |
| Information provenance (claim-source mappings, temporal data) | 🟡 ch6 (ADRs) | ⬜ | ⬜ |

## How to update

When a chapter lands (or moves to outlined / rewrite state), update the matching cell. When the cert publishes new task areas (watch [`cert-tracking.md`](./cert-tracking.md) diffs), add rows. The matrix is feedback for outline reviewers — if a book's owned domain has many ⬜ cells in its scope, the outline is missing coverage.
