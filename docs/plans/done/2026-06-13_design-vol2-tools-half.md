# Design Vol 2 — Tools half (ch12–17) — sprint record

**Date:** 2026-06-13 · **Status:** ✅ DONE (committed; push pending user word) · **Issue:** #16 (partial)

## What shipped

The **Tools half of Volume 2 — Tools & Orchestration** of the Design book
(`agentic-systems-design/`): **6 chapters, ch12–17**, each with full Vol-1-parity apparatus
(YouWillLearn → spine → H2 sections → Patterns → Quick-ref → real Exercises + worked Solutions)
and a TikZ figure where one earns its place.

| Ch | Title | Backing dossier | Figure |
|----|-------|-----------------|--------|
| ch12 | Beyond One Agent, One Tool (spine) | cross-dossier (light) | two-axis map |
| ch13 | Build vs. Buy | `harness_buildvsbuy` | build→configure→wrap→extend spectrum |
| ch14 | Tool Minimization: Subtract First | `tool_minimization` | convergence (Vercel/GitHub/Block) |
| ch15 | MCP: Designing External Capability | `mcp_design` | host/client/server architecture |
| ch16 | Shaping Input — The Prompting Craft | `prompt_engineering` | (none — prose carried it) |
| ch17 | Shaping Output — Structured & Reliable | `structured_output` | four output levers ladder |

The merged "Shaping I/O" ch16 from the outline was **split** into ch16 (prompting) + ch17
(structured output); the orchestration half renumbered +1 (sub-agents→ch18, multi→ch19,
capstone→ch20), and Vol 3 → ch21–28. OUTLINE.md + content-map.md updated to match.

**Commits** (on `main`, not yet pushed): `a5324dd` linter fix · `8604b95` pilot (ch12+ch14) ·
`37a60c0` fan-out (ch13/ch15/ch16/ch17) · + the records commit. Gate at each: `design-audit`
0 FAIL, full build green (23 pages), all 5 Vol-2 figures compiled + themed.

## Decisions made (the 8, with the why)

1. **Scope = Tools half (ch12–17), not the whole volume.** De-risks the new pattern-section form
   before the harder orchestration chapters; the seam is ch12's own two-axis split.
2. **Pilot = hand-author ch12 + ch14 first.** The two highest-variance chapters — the
   structurally-unique spine and the hardest evidence case (convergence + non-laundering) — locked
   the form + evidence discipline before the fan-out.
3. **Apparatus = full Vol-1 parity** (real exercises + worked solutions), for consistency with Vol 1.
4. **Figures = real TikZ now** (toolchain confirmed: `pdflatex` TeX Live 2025 + `pdftocairo`), not
   deferred — 5 figures authored + compiled.
5. **ch16 split into ch16 + ch17.** Full apparatus + figures made a merged PE+SO chapter too heavy;
   the outline's own "split later if too large" trigger fired. Cost = a +1 renumber of ch18–28.
6. **Fan-out = a Workflow pipeline** (author→adversarial-review per chapter) for ch13/ch15/ch16/ch17;
   explicit multi-agent opt-in. 8 agents, ~5.5 min, 680K subagent tokens.
7. **Review = per-chapter adversarial reviewer** inside the Workflow, grounded in each chapter's
   dossier + manifest — because the deterministic gate is blind to evidence-honesty (laundered
   numbers, mis-attribution). Verdicts: ch13 ship · ch15 fix-then-ship · ch16 ship · ch17 ship; **zero
   CRITICAL/HIGH.**
8. **Pre-push = a final full-diff independent review** (Step 5) before pushing on the user's word.

## What the fan-out got right / what needed folding

- **Honesty disciplines all held** (verified in each agent's honestyNote + spot-checks): ch13
  rendered framework claims as vendor self-descriptions and omitted the uncached Octomind case;
  ch14 tagged the three case studies convergence-of-direction (not a transferable number) and a
  Pitfall refuses the unanchored ~85%/79.5→88.1% aggregates; ch15 rendered "cannot enforce at the
  protocol level" as a design-time obligation and enumerated four principles; ch17 stated the
  structured-output guarantee **with** its refusals/max_tokens/supported-subset exceptions every
  time — never "always valid JSON".
- **Source fidelity:** all 31 new manifest entries (5 pilot + 26 fan-out) are dossier-backed (design-audit Check 9 flagged
  none of them). Caught + fixed one author date error — `mcp-rc-2026` had `publish_date: 2026-07-28`
  (the RC's *future target* date, not the post's publish date) → omitted; undated doc pages also had
  their `2026-01-01` placeholders dropped (matching the manifest's convention).
- **Folded fixes (all LOW/MED + 2 build-breakers the reviewers missed but the gate caught):** dead
  imports removed (ch15/ch16/ch17); **ch16 stray `</content></invoke>` tool-call artifact**; **ch17
  backslash-escaped attribute quotes** (`title="\"…\""` → curly quotes). The last two are why the
  deterministic build gate runs *after* the adversarial review, not instead of it.

## Lessons (for the next Design authoring sprint)

- **Author agents leak tool-call artifacts** (`</content></invoke>`) and **backslash-escape JSX
  attributes** — both break the MDX build but pass an LLM content review. Always run the full `astro
  build` (not just `validate`/`design-audit`) as the closing gate; grep new chapters for
  `</content>|</invoke>` and `="[^"]*\\` before building.
- **TikZ style names collide with built-ins** (`cap`, `coord`, `axis`, `sub`) and **decorations need
  their library** (`\usetikzlibrary{decorations.pathreplacing}` for a brace). Compile figures
  centrally + fix; do not let parallel agents compile.
- **The Workflow fan-out works well** for uniform per-chapter author→review; the agents' structured
  manifestEntries return made the central merge clean (no concurrent manifest writes).

## Remaining (Vol 2 + beyond)

Vol 2 **orchestration half** (ch18 sub-agents · ch19 multi-agent · ch20 capstone), then **Vol 3**
(ch21–28). Then handbook port, deployment (#14), `<Term>` retrofit (#15), Vol-1 Round-2 polish (#17).
