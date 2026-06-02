# The Claude Architect's Reference — Cert-Aligned Outline (D1–D5) · v1

**What this is.** The cert-aligned volume of the claude-books series. It maps 1:1 to Anthropic's *Claude Certified Architect — Foundations* (CCA-F) five-domain taxonomy. **Exam-prep altitude, hybrid genre**: authoritative reference prose wrapped in light exam apparatus (objectives box · inline exam-watch Pitfalls · end-of-chapter self-check), and it **links outward to the _Agentic Systems Design_ book** where a domain needs design depth.

**Created.** 2026-06-01 (reorg that un-fused this cert book from the env+context deep-dive). **Round 1** (this round): conventions settled; D1 fully detailed + D2–D5 sketched; exemplar **D1.1** authored end-to-end to lock the template. See [`docs/BOOK-MAP.md`](../docs/BOOK-MAP.md).

**Backbone.** [`docs/research-program/`](../docs/research-program/) + the in-repo cache `docs/research/{02,03,04,05,06,07,08}`. **Coverage tracker:** [`docs/cert-coverage.md`](../docs/cert-coverage.md) — this outline is its architect-column source.

**Status.** Round 1 — structure settled + **Part I (D1.1–D1.7) and Part II BUILD (D2.1–D2.4) authored; 17 pages, pushed**. D2.5 (REFERENCE→handbook) + D3.1–D5.6 are placed but unauthored; **next = D2.5 or D3.1**.

---

## Conventions (settled Round 1)

- **Structure.** Domain → **Part** (1–5); CCA-F task area → **chapter**. Every task area gets a chapter (complete exam map): BUILD chapters are net-new prose this book owns; REFERENCE chapters are short exam-angle treatments that point outward.
- **Numbering.** `part` = domain # (1–5); **`chapter` = part-relative int** (resets each part). Display as **`D{part}.{chapter}`** (e.g. "D1.1"). Insert-tolerant within a part; matches the candidate's mental model.
- **Slugs.** `d{domain}-{nn}-{semantic}` — e.g. `d1-01-agentic-loops.mdx`. Domain-prefixed + semantic (reorder-safe).
- **Chapter template (hybrid).** Frontmatter (tools shape: `title, part, chapter, volatility, tools_compared, cert_domains, last_verified, last_updated, introduced_in_version, sources, description`) → `<YouWillLearn>` Bloom-verb objectives → italic meta-context opener → reference-prose sections (F-pattern headings, claim-first, ≤3 concepts/section; `<Tag>`+`<Citation>` on every sourced claim) → woven exam apparatus (`<Pitfall>` watch-outs; `<MarginNote variant="tip" label="Tip">` exam tips; `<MarginNote variant="note" label="Note">` "Need more review?" pointers for thinly-covered objectives) → **retrieval-first close** (Exam Ref + Bjork — recap is LAST): `## Practice` self-check (a scenario `<Exercise>` + `<Solution>` rationale, then `<Practice difficulty>` items) **before** the `## Exam essentials` recap → outward links where design depth lives.
- **Item-writing rules** (every `<Exercise>`/`<Practice>`; backbone `docs/research/11-pedagogy/06-cert-guide-genre/`): assess **application not recall** (vignette + closed lead-in) · **cover-the-options** stem (answerable without the options) · homogeneous, plausible distractors built from misconceptions · **no "all/none of the above"** · ~3–4 options · purge testwiseness cues (length/grammar/absolutes/clang) · **always give a rationale**, not a bare answer.
- **Cross-book links = bare prose links** (NOT `<XRef>` — it cannot cross book boundaries; see `docs/scaffold-gaps.md`). The design book is undeployed, so link targets are provisional until it ships; centralize into a `<BookLink>` component once cross-book links multiply.
- **Pedagogy backbone (in-repo):** `theory-bjork-desirable-difficulties` (retrieval prompts), `theory-blooms-taxonomy` (Bloom-verb objectives + objective↔assessment alignment; Architect emphasis = Evaluate/Create), `handbook/PEDAGOGY.md` #7/#15/#19, and **`docs/research/11-pedagogy/06-cert-guide-genre/`** — the cert-guide genre + item-writing craft (11 strict-live notes; gap [#9](https://github.com/brandon-behring/claude-books/issues/9) closed 2026-06-01). *Two-tier practice-exam pools are deferred to a later round; in-chapter self-checks are tier 1.*
- **Sources.** Public CCA-F taxonomy + Anthropic Academy + the in-repo strict-live cache. **Never** the confidential `instructor_*.pdf`.

## Cross-book contract

- This book is **exam-prep altitude**; _Agentic Systems Design_ is **design / reference altitude**.
- Every cross-book link points **outward** (cert → design), never inward — preserving the design book's clean extraction (`agentic-systems-design/SPLIT.md`).
- **REFERENCE** = mostly covered by an existing book (point out); **BUILD** = net-new prose this book owns.

---

## Part I — D1 · Agentic Architecture & Orchestration (27%) · mostly BUILD

The biggest domain; the agent loop it opens with is the substrate every later domain assumes. **Backbone:** `docs/research/04-agent-sdk/`, `docs/research/06-multi-agent-patterns/`, `docs/research/05-claude-api/`.

| Ch | Title (task area) | Mode | Backbone | Outward | Bloom |
|---|---|---|---|---|---|
| **D1.1** | **Agentic Loops: `stop_reason` & Tool-Result Handling** | BUILD | `04-agent-sdk/docs-agent-loop`, `05-claude-api/docs-tool-use` | design ch01 (Agent = Model + Harness) | Apply/Analyze |
| D1.2 | Coordinator–Subagent Patterns (hub-and-spoke, isolated context) | BUILD | `06-multi-agent-patterns/blog-multi-agent-research-system`, `blog-when-to-use-multi-agent` | design ch07 (at scale) | Analyze/Evaluate |
| D1.3 | Subagent Invocation (`Task` tool, `allowedTools`, `AgentDefinition`) | BUILD | `04-agent-sdk/docs-subagents` | — | Apply |
| D1.4 | Multi-Step Workflows: Programmatic vs Prompt-Based Handoff | BUILD | `04-agent-sdk/docs-overview`, `06-multi-agent-patterns/docs-best-practices-writer-reviewer` | — | Evaluate |
| D1.5 | Agent SDK Hooks (`PostToolUse`, interception, normalization) | BUILD | `04-agent-sdk/docs-hooks-reference` | — | Apply/Analyze |
| D1.6 | Task Decomposition: Sequential Pipelines vs Adaptive | BUILD | `06-multi-agent-patterns/blog-when-to-use-multi-agent` | — | Evaluate |
| D1.7 | Session State: `--resume`, `fork_session`, Scratchpads | BUILD | `04-agent-sdk/docs-sessions` | design ch10 (memory) | Apply |

**D1.1 detail (the authored exemplar).** *Thesis:* the agent loop is a control structure whose branch condition is `stop_reason`, and the architect's job is owning continue-vs-stop and the tool-result round-trip. *Sections:* the loop as control structure (`stop_reason: tool_use` → execute → `tool_result` → repeat until `end_turn`) · the SDK turn model (a turn = one tool-use round trip; text-only finals don't count against `max_turns`) · termination + safety (`max_turns`/`max_budget_usd`; the `ResultMessage.subtype` table) · `stop_reason` values and what each means for the loop · where Claude Code's loop sits (outer/inner; one outward link → design ch01). *Apparatus:* Pitfalls (not branching on `tool_use`; unbounded loops; reading `.result` before checking `subtype`), inline `<Exercise>` (trace a 4-turn session), `<Practice>` ×2 (enumerate `stop_reason` values + the loop consequence of each; design a safe termination policy).

---

## Part II — D2 · Tool Design & MCP Integration (18%) · BUILD

**Backbone:** `docs/research/02-mcp-spec`, `03-advanced-tool-use`, `04-agent-sdk`, `05-claude-api/docs-tool-use`.

**Status (2026-06-01):** D2.1–D2.4 (all BUILD) authored end-to-end — Effective Tool Interfaces · Structured Error Responses · Tool Distribution & `tool_choice` · MCP Server Configuration. D2.5 (Built-in Tools, REFERENCE→handbook) deferred. Volatility: D2.1/D2.2 `architectural-pattern`, D2.3/D2.4 `feature-surface`. Strict-live finding: **`errorCategory` is a phantom** (absent from every source) → D2.2 reframed on the `isError`-vs-JSON-RPC channel split.

| Ch | Title (task area) | Mode | cert_domains |
|---|---|---|---|
| D2.1 | Effective Tool Interfaces (descriptions, boundaries, naming) | BUILD | [2] |
| D2.2 | Structured Error Responses (`isError`, `errorCategory`, retryability) | BUILD | [2] |
| D2.3 | Tool Distribution & `tool_choice` (`auto`/`any`/forced) | BUILD | [2] |
| D2.4 | MCP Server Configuration (`.mcp.json`, env-var expansion) | BUILD | [2] |
| D2.5 | Built-in Tools (Read/Write/Edit/Bash/Grep/Glob) | REFERENCE → handbook | [2] |

## Part III — D3 · Claude Code Configuration & Workflows (20%) · REFERENCE + thin BUILD

Handbook is the use-side primary owner; this book is the design / exam angle. **Backbone:** `docs/research/08-claude-code-internals`.

| Ch | Title (task area) | Mode | cert_domains |
|---|---|---|---|
| D3.1 | CLAUDE.md Hierarchy & `@import` | REFERENCE → design ch04 + handbook | [3] |
| D3.2 | Slash Commands & Skills (`.claude/commands/`, `.claude/skills/`) | REFERENCE → design ch05 | [3] |
| D3.3 | `.claude/rules` with Glob Path-Scoping | BUILD (thin) | [3] |
| D3.4 | Plan Mode vs Direct Execution | REFERENCE → handbook | [3] |
| D3.5 | Iterative Refinement (test-driven, interview pattern) | REFERENCE → handbook | [3] |
| D3.6 | CI/CD Integration (`-p`, `--output-format json`, `--json-schema`) | BUILD | [3] |

## Part IV — D4 · Prompt Engineering & Structured Output (20%) · BUILD

Prompting basics belong to the handbook; `tool_use` + schemas + batch + multi-pass are this book's. **Backbone:** `docs/research/05-claude-api`, `07-structured-output`.

| Ch | Title (task area) | Mode | cert_domains |
|---|---|---|---|
| D4.1 | Explicit Criteria over Vague Instructions | REFERENCE → handbook | [4] |
| D4.2 | Few-Shot Prompting for Ambiguous Cases | REFERENCE → handbook | [4] |
| D4.3 | Structured Output via `tool_use` + JSON Schema | BUILD | [4] |
| D4.4 | Validation, Retry & Feedback Loops (semantic vs schema errors) | BUILD | [4] |
| D4.5 | Batch Processing (Message Batches API, `custom_id`, SLA) | BUILD | [4] |
| D4.6 | Multi-Pass / Multi-Instance Review (independent reviewers) | BUILD | [4] |

## Part V — D5 · Context Management & Reliability (15%) · mostly REFERENCE

**Backbone:** `docs/research/` context-rot / assembly / memory dossiers (the design book is the depth owner).

| Ch | Title (task area) | Mode | cert_domains |
|---|---|---|---|
| D5.1 | Long-Conversation Context (summarization risk, lost-in-the-middle) | REFERENCE → design ch08/ch09 | [5] |
| D5.2 | Escalation & Ambiguity Resolution | REFERENCE → handbook | [5] |
| D5.3 | Error Propagation Across Multi-Agent Systems | BUILD | [5] |
| D5.4 | Large-Codebase Context (`/compact`, scratchpads, delegation) | REFERENCE → design ch07/ch09 | [5] |
| D5.5 | Human Review & Confidence Calibration | BUILD | [5] |
| D5.6 | Information Provenance (claim-source mappings, temporal data) | REFERENCE → handbook | [5] |

---

## Verification (each authoring round)

- Each authored chapter cites a `docs/research/` (or `docs/research-program/`) backbone path + (where REFERENCE) an outward prose link to _Agentic Systems Design_.
- `docs/cert-coverage.md` architect column reconciles with this outline's BUILD vs REFERENCE marks.
- `npm -w architect-reference run build:labels && validate && build` passes; landing groups chapters by Part.
