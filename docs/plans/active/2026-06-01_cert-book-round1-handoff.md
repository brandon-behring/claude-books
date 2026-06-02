# Cert book — Round 1 handoff (clean-session resume point)

**Date:** 2026-06-01 · **Book:** `architect-reference/` (the **Cert** lens, CCA-F D1–D5) · **Status:** Round 1 — structure + conventions settled; **Part I (D1.1–D1.7) + Part II (D2.1–D2.5) + all of Part III (D3.1–D3.6) authored (18 of ~30 chapters)**; cert-guide-genre research done; REFERENCE sub-template locked. Builds **24 pages**, `validate` clean, all on `main` (pushed).

> **Update 2026-06-01 (later session):** D1.3–D1.7 authored end-to-end this session (Subagent Invocation · Multi-Step Workflows · Agent SDK Hooks · Task Decomposition · Session State) — **Part I (Domain 1) is now prose-complete**. The chapter template, the per-chapter loop, and the gotchas below all held verbatim and **still apply** to Parts II–V. **Next move = D2.1 Effective Tool Interfaces** (Part II / D2 · Tool Design & MCP, 18%). New finding: classify each chapter's `volatility` by claim-type (D1.5 Hooks shipped `feature-surface`, the rest `architectural-pattern`).

> **Update 2026-06-01 (Part II BUILD session):** D2.1–D2.4 authored end-to-end (Effective Tool Interfaces · Structured Error Responses · Tool Distribution & `tool_choice` · MCP Server Configuration) — **Part II BUILD is now prose-complete** (4 commits, pushed; **17 pages**). Template + per-chapter loop held verbatim again. Two strict-live findings: **`errorCategory` is a phantom** (absent from every source → D2.2 reframed on the `isError`-vs-JSON-RPC split), and the "3–4 sentences" tool-description guideline **is** cached (cite it; the first recon mis-flagged it). Volatility: D2.1/D2.2 `architectural-pattern`, D2.3/D2.4 `feature-surface`. **Next move = D2.5** (Built-in Tools, REFERENCE→handbook — short outward chapter) **or D3.1** (Part III).

> **Update 2026-06-01 (REFERENCE-chapters session):** D2.5 (Built-in Tools) + D3.1 (CLAUDE.md Hierarchy & `@import`) authored end-to-end — the book's **first two REFERENCE chapters**. Part II is now complete (5/5); Part III is opened. 2 commits, pushed; **19 pages**. The **REFERENCE sub-template is locked**: 4 sections (not 5), ≤2 Pitfalls, **bare-prose cross-book links** (never `<XRef>`), full Practice/Exam-essentials apparatus retained. Findings: D2.5 needed **zero new manifest keys** (existing `agent-sdk-overview`/`agent-loop`/`permissions` covered every claim); **D2.5's outward link is prose-only** (handbook target unwritten — a 404 blob link is worse than none) while **D3.1's is a real provisional blob link** (design ch04 exists on disk); `docs-memory.md` is mostly faithful T1 *paraphrase* not verbatim quotes (cite the source key, don't sharpen). Volatility: D2.5 `feature-surface`, D3.1 `architectural-pattern`. **Next move = D3.2 Slash Commands & Skills** or the rest of Part III.

> **Update 2026-06-02 (Part III finish session):** D3.2–D3.6 authored end-to-end (Slash Commands & Skills · Path-Scoped Rules · Plan Mode vs Direct Execution · Iterative Refinement · CI/CD Integration) — **Part III is now complete (D3.1–D3.6, 18 ch, 24 pages)**, 5 commits + 1 reconcile, pushed. Decisions taken via `/exploring-options`: all 5 straight through; D3.4/D3.5 use **real cert→handbook blob links** to `ch03-first-session.mdx` (exists on disk); **D3.5 = `stable-principle`** (the book's first). Strict-live wins: D3.3 reused `claude-code-memory` and D3.5 reused `claude-code-best-practices` (0 new keys each — the interview-pattern dossier's `source_url` *is* the best-practices page); the recon's over-granular 7-key proposal for D3.2 collapsed to 2; D3.6's `--json-schema` shown as illustration only (no fabricated output payload); "direct execution" left un-coined (D3.4 frames plan-vs-direct as a decision). Manifest now **30 keys**. **Next move = Part IV (D4.1 Explicit Criteria) or Part V.**

> **Resume here for a clean/compacted session.** Supersedes the kickoff (`2026-06-01_cert-book-kickoff.md`, now historical). Canonical structure = [`architect-reference/OUTLINE.md`](../../architect-reference/OUTLINE.md). Canonical decisions = the live plan `~/.claude/plans/this-repo-has-gotten-humble-origami.md` + memory `project_cert_book.md`. The two authored chapters **are the template** — copy them.

## What's done

- **Structure + conventions** (genre, numbering, coverage, cross-book links, item-writing rules) — all settled, written into `OUTLINE.md`.
- **D1.1 Agentic Loops** + **D1.2 Coordinator–Subagent Patterns** — authored end-to-end, built, committed, pushed.
- **Part-grouped landing** (`src/pages/index.astro`) — auto-groups chapters by Part/domain with exam weights (no per-chapter edit needed).
- **Research backbone for the genre**: `docs/research/11-pedagogy/06-cert-guide-genre/` (11 strict-live notes + README; **#9 closed**). The template was refined from it (retrieval-first close + item-writing rules).
- **Issues**: #9 closed. Open *by design*: **#10** (add `BOOK_PROFILE=tools` to `architect-reference/.env` — user's one-liner, parity only) and **scaffold #96** (cross-book `<XRef>` — upstream feature, don't build from this repo).

## Settled decisions (do NOT re-litigate)

1. **Genre = hybrid** — reference prose + light exam apparatus.
2. **Structure** = task-area→chapter, domain→Part; **per-part numbering `D{p}.{c}`**; slug `d{domain}-{nn}-{semantic}`.
3. **Coverage** = complete ~30-ch exam map — BUILD where this book owns the task area, short REFERENCE chapters that point outward where the handbook/design book own it.
4. **Cross-book links = bare prose links** (NOT `<XRef>` — impossible across books, scaffold #96). Targets are provisional GitHub-blob links until the design book deploys.
5. **Empirical (verified)**: `minimalChapterSchema = toolsChapterSchema` → no `.env` needed to build/validate; `cert_domains` is stripped, not enforced.

## The chapter template (embodied in D1.1 + D1.2)

Frontmatter (tools shape: `title, part, chapter, volatility, tools_compared, cert_domains, last_verified, last_updated, introduced_in_version, sources, description`) → explicit component imports → `<YouWillLearn>` **Bloom-verb** objectives → italic meta-context opener → reference-prose sections (F-pattern headings, claim-first, ≤3 concepts/section; `<Tag>`+`<Citation>` on every sourced claim; `<ConceptBox>`/`<KeyIdea>`) → woven exam apparatus (`<Pitfall>` watch-outs; `<MarginNote variant="tip" label="Tip">` exam tips; `<MarginNote variant="note" label="Note">` "Need more review?" for thin spots) → **retrieval-first close** (recap LAST): `## Practice` (a scenario `<Exercise>` + `<ExerciseSolutions>`/`<Solution for>` rationale, then `<Practice difficulty>` items) **then** `## Exam essentials` recap → outward prose link where design depth lives.

**Item-writing rules** (every `<Exercise>`/`<Practice>`; backbone `06-cert-guide-genre/`): application-not-recall (vignette + closed lead-in) · cover-the-options stem · homogeneous plausible distractors from misconceptions · no "all/none of the above" · ~3–4 options · purge testwiseness cues · always give a rationale.

## The per-chapter authoring loop (repeatable)

1. **Read the backbone** dossier (`OUTLINE.md` names it per chapter; it lives under `docs/research/`).
2. **Author** `src/content/chapters/d{N}-{nn}-{slug}.mdx` to the template — copy `d1-02-coordinator-subagent-patterns.mdx` as the model.
3. **Add new source keys** to `sources/manifest.yaml` (shape: `id, url, title, [author], [publish_date], captured_at, tier, tool`). Reuse existing keys where the source repeats.
4. **Flip the cell** in `docs/cert-coverage.md` → `🟢 D{p}.{c} (authored YYYY-MM-DD)`.
5. **Verify**: `npm -w architect-reference run build:labels && npm -w architect-reference run validate && npm -w architect-reference run build`. The full **build** catches MDX/enum issues that `validate` misses.
6. **Commit** (`feat(architect-reference): …`) + push. The landing page needs no edit — it auto-groups by `part`.

## Next chapters (Parts I–III done → Part IV or Part V)

- ✅ **Part I complete:** D1.1–D1.7 authored, built, committed, pushed. Domain-1 column of `docs/cert-coverage.md` is all 🟢.
- ✅ **Part II complete:** D2.1–D2.5 authored, built, committed, pushed. Domain-2 rows D2.1–D2.5 all 🟢.
- ✅ **Part III complete:** D3.1–D3.6 authored, built (24 pages), pushed. Domain-3 rows D3.1–D3.6 all 🟢.
- **Next = Part IV (D4.1 Explicit Criteria over Vague Instructions)** or **Part V (D5.x)** — see `OUTLINE.md` Part IV/V tables. Part IV is prompt-engineering + structured output (BUILD-heavy: D4.3 structured output, D4.4 validation/retry, D4.5 batch, D4.6 multi-pass); Part V is context-management (mostly REFERENCE→design). The REFERENCE sub-template, the per-chapter loop, and the gotchas are unchanged: **copy `d3-01`/`d3-05` for REFERENCE shapes** (stable-principle now in the vocabulary) **or `d2-04`/`d3-06` for feature-surface BUILD**. Outward-link rule: **real blob link when the target file (design ch0x / handbook ch0x) exists on disk; prose-only when it doesn't yet.**

## Gotchas

- **Benign build line** `/convergence … patterns collection … empty` — pre-existing scaffold quirk (tracked scaffold #86); `build` still exits 0. Not a regression; ignore.
- `validate` misses sources-`tier`/`volatility` enum violations + MDX `<<` — only a full `build` catches them.
- **gh is snap-confined**: use `--body` inline (avoid apostrophes) or a `$HOME` body-file; a batched `gh issue create` prints no URL on success — verify via `gh issue list`.
- **Never** cite the confidential `instructor_*.pdf` — public CCA-F taxonomy + Anthropic Academy + the in-repo strict-live cache only.

## Pointers

Plan `~/.claude/plans/this-repo-has-gotten-humble-origami.md` · structure `architect-reference/OUTLINE.md` · models `architect-reference/src/content/chapters/d1-0{1,2}-*.mdx` · backbone `docs/research/{04-agent-sdk,05-claude-api,06-multi-agent-patterns,07-structured-output,08-claude-code-internals}/` + `docs/research/11-pedagogy/06-cert-guide-genre/` · coverage `docs/cert-coverage.md` · scopes `docs/BOOK-MAP.md` · memory `project_cert_book.md`.
