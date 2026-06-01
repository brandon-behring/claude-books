# Architect's Reference — Ch1 complete handoff (2026-05-27)

**One-line resume:** The Architect's Reference book is stood up and its first chapter — the D1 Agents & Orchestration spine opener, **"Agent = Model + Harness"** — is authored from the `harness_frame` strict-live dossier, validated, built, and committed on `architect-reference-v0` (commit `f3384d1`); the **dossier → chapter pipeline** and the **new-book-standup template** are proven end-to-end.

## What's done

**The 23-dossier research KB (Waves 1–7) backs all five cert domains** (D1 + D2 + D3 + D4 + D5 strict-live; 23-wide composed KG at `~/Claude/research-kb/composed/wave7_*`, **0 claim/evidence ID collisions** asserted at every merge, prior wave snapshots byte-identical). Bridge commits land on `research-program-v0`; book-authoring lands on `architect-reference-v0` (branched off `research-program-v0`).

### Architect's Reference — new greenfield Astro book

- **Mirrors the handbook scaffold** (tools profile, `@brandon_m_behring/book-scaffold-astro` v4.3.0) rather than using `create-book` (scaffold gap #28: no `src/pages/`). Files: `package.json`, `astro.config.mjs`, `src/content.config.ts` (`defineBookSchemas()`), the gap-#28 routes `src/pages/{index, chapters/[...slug]}.astro`, `sources/manifest.yaml` (the 10 verified sources from `harness_frame`'s `bib_ledger.yml`), and `.env` (`BOOK_PROFILE=tools`, force-added because the root `.gitignore` ignores `.env` — the same convention as `handbook/.env`).
- Registered in the root workspaces — root `npm install` picks it up; tracking `git@github.com:brandon-behring/claude-books.git`.
- **Verified end-to-end:** `validate` ✓ 1 chapter, profile=tools, 0 errors · `astro build` clean · pagefind indexes the chapter · rendered HTML carries the resolved citation URLs, the **4 Official / 1 Convergence / 2 Practitioner** practice-tag chips (exactly the synthesis's tag-guidance distribution), and the `Convergence` callout.

### Ch1 — "Agent = Model + Harness"

Authored from `~/Claude/research_agent_harness_frame/` (10 sources, 20 atoms, CoVe r1 0/0/0). **Section order verbatim from the synthesis's "For the books" Architect's-Reference hook:** the frame (`syn_harness_frame_01`) → three-layer model (`syn_..._03`) → components taxonomy (`syn_..._04`, with `<Convergence>` on the cross-vendor parts-list claim — T1 Anthropic + T2 LangGraph agree) → nested loop (`syn_..._02`) → provenance arc (`syn_..._05`, rendered as dated-history-not-definition) → hand-off map (`syn_..._06`). Honest caveats (vocabulary still settling, single-vendor-dense definitions, the T3-transcript Karpathy anchor) are surfaced via MarginNote warnings + a "What is still settling" section.

**Discipline honored:** scaffold-only components (no handbook-custom imports cross-book); every cited claim traces to a `harness_frame` atom via `<Citation src>` against the manifest; `<Tag kind>` per the synthesis tag-guidance (Official for T1 definitions, Convergence only on the cross-vendor parts-list, Practitioner on T3 provenance); forward-refs to unwritten D1 siblings are **prose, not `<XRef>`** (so `validate` stays clean until those chapters' label ids exist); figures + the shared glossary deferred (anti-over-engineering — wire them on a real trigger).

## The proven pipeline (template for the next chapters)

1. **Pick the dossier** (any of the 23) and read its `synthesis.md` — the **"For the books"** hook prescribes the chapter's exact section order for each target book.
2. **Build the chapter's spine** from the typed `syn_*` claims; each grounds the specific atoms (`claim_<slug>_NNNN`) you'll cite.
3. **Map atoms → manifest sources**: the dossier's `bib_ledger.yml` lists each atom's source — add any new ones to `architect-reference/sources/manifest.yaml` (preserve the schema: `id` / `url` / `title` / `author` / `publish_date` / `captured_at` / `tier` / `tool`).
4. **Author the MDX** mirroring `architect-reference/src/content/chapters/ch01-harness-frame.mdx`: scaffold-only components, `<Citation src>` on every cited claim, `<Tag kind>` per the synthesis tag-guidance, honest caveats from the dossier's "What is contested / open."
5. **Forward-refs to unwritten chapters → prose** (no `<XRef>` until those chapters' label ids exist). As siblings land, prose forward-refs can be **upgraded to `<XRef>`**.
6. **Verify:** `npm -w architect-reference run build:labels && npm -w architect-reference run validate && npm -w architect-reference run build` — all must pass (0 errors). Confirm the rendered HTML's citations resolve and the practice-tag distribution matches the synthesis's tag-guidance.
7. **Commit on `architect-reference-v0`** (one commit per chapter is the natural rhythm).

## Continuation roadmap

### The rest of the D1 spine — each dossier already complete + citation-clean

- **Ch2 — Build vs. buy a custom harness** ← `harness_buildvsbuy` (7 src / 14 atoms / 5 syn; CoVe r1 0/1/0 — one authorship correction already applied).
- **Ch3 — Sub-agents (context isolation)** ← `sub_agents` (7 src / 18 atoms / 5 syn; CoVe r1 0/0/1 — one SPA live↔cache-drift FLAG; cache is the strict-live source of truth).
- **Ch4 — Multi-agent patterns** ← `multi_agent` (6 src / 15 atoms / 5 syn; CoVe r1 0/1/0 — **preserves the Anthropic orchestrator-worker vs Cognition "don't build multi-agents" tension UNFLATTENED**).

As Ch2–4 land, Ch1's hand-off-map prose forward-refs can be upgraded to `<XRef>` once those chapters' label ids exist.

### Then the D2 / D5 / D4 chapters — all fully backed

- **D2 (Tools & MCP):** `tool_minimization` (subtract-first; verified case studies); `mcp_design` (design + governance/ecosystem, plus the **dual-layer "spec-in-transition" convention** for the announced 2026-07-28 RC).
- **D5 (Production Operations):** `ops_observability` (logging + OTel GenAI semconv + attribution + surfacing; `/cost`→`/usage` rename flagged); `ops_cost` (figures verbatim — 1.25× write / 0.1× read / 5-min TTL / 4×/15× multi-agent / 50% batch; per-MTok dollars deliberately un-anchored — synthesis states the ladder qualitatively); `ops_hitl` (oversight workflow, with the "3/20 denials" mechanism correctly excluded as auto-mode-only); `ops_security` (already strict-live from Wave 3).
- **D4 (Prompting & Structured Output):** `prompt_engineering` (captures **prefill DEPRECATED on Claude 4.6+** + the prompt-eng docs consolidation); `structured_output` (strict-mode guarantee + caveats; now GA, beta header transitioning to `output_config.format`); `prompt_evaluation` (HARD boundary vs `eval_harnesses` held — judge-calibration cross-linked, not re-derived).

### Deferred infrastructure (to wire on a real trigger)

- **Figures pipeline (TikZ → SVG)** — the package.json already has `build:figures`. First figures to add: a **Model + Harness** diagram and the **three-layer model** diagram for Ch1. Needs a `figures/<topic>/<name>.tex` plus the TikZ toolchain.
- **Shared `glossary/` book** — harvest the dossiers' `agent_index/00_overview.md` Glossary sections; deep-linked across all three books via `<XRef>`. The `harness_frame` glossary section is the cleanest starter set.
- **Field-Guide and Handbook Part II–IV** are separate efforts (the handbook is a LaTeX → MDX rewrite from `~/claude-best-practices/`, not greenfield like the Architect's Reference).

## Open items (none blocking)

- **Dated rechecks pending:** MCP RC **2026-07-28** (volatile atoms in `mcp_design` auto-flag via `stale_after_days: 62`); ops_cost pricing + Mem0 after **2026-06-26**; prompt-engineering docs consolidation (post-Wave-7 finding) — re-verify when the next consolidation phase lands.
- **Toolkit burn-in candidates** (left to the separately-managed `~/Claude/research_toolkit` workflow per the user): the dual-layer "spec-in-transition" convention is in `BURN_IN_NOTES.md` but not yet in the toolkit's `references/`; the `confidence.domains` enum drift (`medium` → `moderate`); the YAML colon-space / leading-quote friction in gather output; `wave4-burn-in` branch still unmerged.
- **Scaffold-gap observation (no entry filed this session):** `book-scaffold build-labels` reports "0 chapters" under the workspace consumer even though `validate` finds the chapter — harmless while no `<XRef>` ids exist, but the same class as gap #30 (build-tips chapters-base-detection). If a future chapter uses `<XRef>` to a labeled-component id and `labels.json` doesn't pick it up, set `BOOK_CHAPTERS_DIR=src/content/chapters` on `build:labels` (the workaround that works for `build:tips`).

## Branches + commits (where things live)

- **`main`** — published handbook lineage (`origin`).
- **`part-i-v1.0-prose`** — handbook v1.0 prose lineage (`origin`).
- **`research-program-v0`** — the 7-wave strict-live research program. Most-recent first:
  - `b4ca6bb` docs(plans): Wave 7 complete handoff — D4 closed, all five cert domains strict-live.
  - `664f91a` research-program: Wave 7 complete — D4 (prompt-engineering, structured-output, prompt-evaluation) bridged (23-wide, 0 collisions).
  - `31720fe` / `9d39340` — Wave 6 (D5 Production Operations) handoff + bridge (20-wide).
  - `f008429` / `32c3014` — Wave 5 (D1 spine + orphan) handoff + bridge (17-wide).
  - `e9eb905` / `2d08a22` — Wave 4 (Tools & Extensibility) handoff + bridge (12-wide, prior session).
- **`architect-reference-v0`** — book authoring, off `research-program-v0`. Most-recent first:
  - **(this handoff)** `docs(plans): architect-reference Ch1 complete handoff`.
  - `f3384d1` `architect-reference: stand up the book + author Ch1 "Agent = Model + Harness"` (book-scaffold mirror, tools profile; D1 spine opener from `harness_frame`).

## Resume detail (to author the next chapter)

```bash
cd /Users/brandonbehring/claude-books
git switch architect-reference-v0
# 1) Read the next dossier's synthesis "For the books" hook:
#    ~/Claude/research_agent_harness_buildvsbuy/synthesis.md
# 2) Mirror src/content/chapters/ch01-harness-frame.mdx into ch02-build-vs-buy.mdx
#    (frontmatter: chapter: 2, volatility: architectural-pattern, etc.)
# 3) Add any new sources to architect-reference/sources/manifest.yaml.
# 4) Verify:
npm -w architect-reference run build:labels && \
  npm -w architect-reference run validate && \
  npm -w architect-reference run build
# 5) Commit per the message convention (one commit per chapter).
```

When Ch2–Ch4 land, Ch1's hand-off-map prose forward-refs can be **upgraded to `<XRef>`** to those chapters' anchors.
