# Advanced tool use — research dossier

Primary-source research cache for **Domain 2: Tool Design & MCP Integration** (cert weight 18%) and the cross-cutting tool-use foundation used throughout the architect-reference. All notes are **T1-official** (Anthropic engineering blog + `platform.claude.com` API reference + `docs.claude.com` legacy redirect).

**Snapshot**: 2026-05-22. Refresh quarterly or when the beta header `advanced-tool-use-2025-11-20` graduates / shifts.

## Topic summary

Tool use in the Claude API has expanded from the basic `tool_use` / `tool_result` contract into a layered system that addresses three failure modes hit at scale:

1. **Tool definitions consuming context** (a 5-MCP-server setup costs ~55K tokens before any work) — solved by the **Tool Search Tool** (regex / BM25 variants; 85% token reduction; Opus 4.5 accuracy 79.5% → 88.1%).
2. **Intermediate tool results polluting Claude's reasoning context** (multi-step research blows the window with raw data) — solved by **Programmatic Tool Calling** (Claude writes Python in a sandbox; tools become callable via `allowed_callers`; 37% token reduction average; intermediate results are not billed against context).
3. **JSON Schema being insufficient for usage conventions** (when to include optional params, format expectations) — solved by **Tool Use Examples** (`input_examples` field; 72% → 90% accuracy on complex parameters).

The three features compose. Tool Search reduces **definition** cost; PTC reduces **result** cost; Examples improves **invocation** accuracy. All three sit on top of a foundation of careful tool *interface design* (naming, namespacing, descriptions, consolidation, structured errors).

The dossier captures the canonical Nov 24, 2025 engineering post (split into per-pattern notes) plus the docs.claude.com / platform.claude.com API reference pages (define-tools, handle-tool-calls, parallel-tool-use, tool-search-tool, programmatic-tool-calling) and a synthesis note on tool interface design pulled from "Writing tools for agents" + the best-practices boxes in the docs.

## Table of notes

| File | Source tier | What it covers |
|---|---|---|
| [`blog-advanced-tool-use-overview.md`](./blog-advanced-tool-use-overview.md) | T1 | Three-feature framing, beta-header activation, conclusion quote |
| [`blog-tool-search-tool.md`](./blog-tool-search-tool.md) | T1 | Tool Search Tool deep dive: 85% token reduction, accuracy gains, when to use |
| [`blog-programmatic-tool-calling.md`](./blog-programmatic-tool-calling.md) | T1 | Programmatic Tool Calling deep dive: 37% reduction, capability unlocks, constraints |
| [`blog-tool-use-examples.md`](./blog-tool-use-examples.md) | T1 | Tool Use Examples deep dive: 72% → 90% accuracy on complex parameters |
| [`docs-tool-use-overview.md`](./docs-tool-use-overview.md) | T1 | API overview, client-vs-server, 346/313-token overhead, tool reference table |
| [`docs-define-tools.md`](./docs-define-tools.md) | T1 | Tool definition schema, `tool_choice` modes, `input_examples`, best practices |
| [`docs-handle-tool-calls.md`](./docs-handle-tool-calls.md) | T1 | Agentic loop, `is_error`, retries, formatting rules, error message principle |
| [`docs-parallel-tool-use.md`](./docs-parallel-tool-use.md) | T1 | Execution semantics, `disable_parallel_tool_use`, message-history rules |
| [`docs-tool-search-tool.md`](./docs-tool-search-tool.md) | T1 | Tool Search API reference: regex vs BM25, defer_loading, error codes, prompt caching |
| [`docs-programmatic-tool-calling.md`](./docs-programmatic-tool-calling.md) | T1 | PTC API reference: `allowed_callers`, container lifecycle, `caller` field, constraints |
| [`docs-tool-interface-design.md`](./docs-tool-interface-design.md) | T1 | Synthesis: naming, consolidation, error messages, evaluation methodology |

## Cert task areas covered (Domain 2)

All Domain 2 task areas have primary-source coverage in this dossier:

| Task area | Note(s) |
|---|---|
| **Effective tool interfaces (descriptions, boundaries, naming)** | [[docs-tool-interface-design]], [[docs-define-tools]] (best practices section) |
| **Structured error responses (`is_error`, error categories, retryability)** | [[docs-handle-tool-calls]], [[docs-tool-interface-design]] (Principle 4) |
| **Tool distribution + `tool_choice` (`auto`/`any`/forced/`none`)** | [[docs-define-tools]] (tool_choice section), [[docs-parallel-tool-use]] (`disable_parallel_tool_use`) |
| **MCP server config (interaction with Tool Search)** | [[docs-tool-search-tool]] (MCP integration + custom search); MCP-specific config lives in `02-mcp-spec/` |
| **Built-in tools (Read/Write/Edit/Bash/Grep/Glob)** | [[docs-tool-use-overview]] (Anthropic-provided tools table); built-in Claude Code tools deferred to `08-claude-code-internals/` |

Cross-domain coverage:

- **D1 Agentic Architecture**: PTC is a multi-step orchestration primitive; covered in [[docs-programmatic-tool-calling]].
- **D4 Prompt Engineering & Structured Output**: `input_examples` is few-shot at the schema layer; covered in [[blog-tool-use-examples]] and [[docs-define-tools]]. Strict tool use (mentioned but no separate note) is also D4-relevant.
- **D5 Context Management & Reliability**: Tool Search + PTC are the two canonical context-budget protections; `is_error` retry behavior in [[docs-handle-tool-calls]] feeds reliability discussion.

## Headline numbers to carry into chapters

| Claim | Source | Note |
|---|---|---|
| Tool Search reduces definitions by ~85% (3–5 tools, ~3K tokens vs 55K–72K traditionally) | [[blog-tool-search-tool]], [[docs-tool-search-tool]] | 5-MCP-server reference setup |
| Opus 4.5 accuracy 79.5% → 88.1% with Tool Search | [[blog-tool-search-tool]] | Internal MCP eval |
| Opus 4 accuracy 49% → 74% with Tool Search | [[blog-tool-search-tool]] | Internal MCP eval; +25 points |
| PTC reduces tokens 43,588 → 27,297 (37%) on complex research | [[blog-programmatic-tool-calling]] | Average; "complex research" eval unnamed |
| PTC eliminates 19+ inference passes by combining 20+ tool calls | [[blog-programmatic-tool-calling]] | Internal example |
| Tool Use Examples accuracy 72% → 90% on complex parameter handling | [[blog-tool-use-examples]] | "Internal testing" |
| Tool-use system-prompt overhead: 346 (auto/none) or 313 (any/tool) tokens | [[docs-tool-use-overview]] | All Claude 4.x models; in addition to schemas |
| Maximum tools in catalog: 10,000 | [[docs-tool-search-tool]] | Tool Search limit |
| Tool search regex max length: 200 characters | [[docs-tool-search-tool]] | Regex variant |
| Container idle timeout: 4.5 min; max lifetime: 30 days | [[docs-programmatic-tool-calling]] | PTC + code execution |
| Claude retries invalid tool calls 2–3 times before apologizing | [[docs-handle-tool-calls]] | Default behavior |

## Open questions / verification follow-ups

Aggregated from the per-note "Open questions" sections:

1. **Beta header status**: `advanced-tool-use-2025-11-20` was the activation header in Nov 2025; confirm it's still active and not graduated to GA in May 2026.
2. **Benchmark provenance**: the headline numbers (85% reduction, 72% → 90%, 37%) are mostly described as "internal testing" — none cite a public benchmark. Treat as Anthropic-published rather than peer-reviewed.
3. **BM25 vs regex Tool Search variant**: no recommendation, no documented benchmark. Worth a chapter-author A/B test.
4. **Async wrapper for PTC**: tools become async functions automatically but the wrapper is hidden in examples. A chapter snippet showing the wrapper would help readers.
5. **Advisor tool** (`advisor_20260301`): new server tool listed in the tool reference but not in the landscape doc — needs its own dossier note if chapter coverage expands.
6. **Fine-grained tool streaming** (`eager_input_streaming`): referenced as a tool property but not yet captured in this dossier — only matters for long-running tool calls.
7. **MCP RC 2026-07-28 interaction**: when the new MCP spec goes final, deferred-loading semantics may shift (extensions framework, MCP Apps). Cross-check at RC final.
8. **Strict tool use** (`strict: true`): referenced repeatedly but no dedicated note in this dossier. May warrant one for the D4 Structured Output chapter.

## Anti-patterns flagged for chapter authors

- **Don't** duplicate the landscape-doc §2.4 summary — use this dossier's direct-from-source notes with citation anchors.
- **Don't** quote a benchmark number without naming its provenance ("internal testing" is not the same as "MCP eval").
- **Don't** confuse `disable_parallel_tool_use` (a request-level parameter) with `tool_choice` modes (also request-level but semantically different).
- **Don't** mix the looser "regular tool result" formatting rules with the stricter PTC tool-result rules. [[docs-programmatic-tool-calling]] documents the difference.
- **Don't** assume Tool Search and Tool Use Examples compose — they're explicitly incompatible per [[docs-tool-search-tool]]. Choose one per tool.
