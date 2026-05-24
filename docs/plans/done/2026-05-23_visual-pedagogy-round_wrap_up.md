# Visual-pedagogy round wrap-up

**Date completed**: 2026-05-23
**Plan reference**: `~/.claude/plans/this-repo-is-supposed-buzzing-eclipse.md` § "Completed: Visual-pedagogy research + PEDAGOGY.md + Ch 1 × 5 PoCs"
**Commits**: `f21706c` (pedagogy round) + `b9bee42` (scaffold-gaps issue links) + `2c7ccf7` (figures + diagrams) + `53979f4` (lint + crossref cleanup)
**Session duration**: ~1 full day (the round most-densely-packed round to date)

## What completed (acceptance gates)

- [x] **Phase A** — 4 parallel research agents wrote 38 source notes + 4 sub-area READMEs in `docs/research/11-pedagogy/` (doc-UX patterns, info-design, multimedia learning, handbook-genre)
- [x] **Phase B** — `handbook/PEDAGOGY.md` ~700 lines: 8 visual presentation principles, visual-separation conventions, 14-item adoption shortlist, 26-row decision log
- [x] **Phase C** — 5 Ch 1 PoCs at `handbook/src/content/poc/` rendering 5 supplement formats (tutorial / how-to / TL;DR / part-summary / cheat-sheet) for side-by-side visual comparison
- [x] **Phase D** — `handbook/poc/COMPARISON.md` Round-1 synthesis memo + 6 scaffold gaps filed upstream (#56-#61, all shipped in v4.1.0)
- [x] Focused follow-up: 9 figure-tech notes added at `docs/research/11-pedagogy/05-figures-diagrams/` driving the PEDAGOGY § "Figures + diagrams" 4-tier stack
- [x] Cleanup pass: `.lint.py` topic-prefix exemption (failures 70 → 23); 34 dangling crossrefs → 0; `research_toolkit/BURN_IN_NOTES.md` round-2 lessons appended (items 10-11)

## Friction + surprises

- **Phase A dispatch cap-management held cleanly** — 4 parallel agents, ~25 tool calls each, no agent crashes or budget overruns. Per-area focused prompts (vs broad "explore everything") was the key technique.
- **The 5-format PoC experiment surfaced PEDAGOGY decision #12 organically** — the visual-separation-by-template-not-badges principle came from observing what actually felt different across the rendered PoCs, not from a-priori theory.
- **Lint false-positives were the biggest unexpected friction** — agents used per-area section names ("Layout + IA observations", "Core thesis") instead of generic "Key takeaways", triggering ~48 lint failures across topic-11 notes. Resolution was a topic-prefix exemption in `.lint.py` (relaxation, not normalization); deferred linter refinement to the toolkit (BURN_IN item #10).
- **`[[README]]` and similar literal-example syntax in prose triggered 34 false dangling-crossref warnings** — the agents writing about the `[[slug]]` convention used literal examples that the crossref regex interpreted as broken links. Bulk find/replace + reword fixed locally; toolkit-side fix queued (BURN_IN item #11: ignore `[[...]]` patterns inside backticks).

## Open follow-ups

- The 6 filed upstream issues (#56-#61) became scaffold v4.1.0 contents — closed during the scaffold-v4 migration round (`e7bf72e` + `6e3aba8`).
- Toolkit BURN_IN items #10 and #11 surfaced; not yet acted on upstream.
- PEDAGOGY decision #7 (supplement format adoption) stays OPEN; Round 2 + Round 3 surfaced more evidence but the final v1.0 commitment waits on user review of all PoCs.
- 22 cert_task_areas lint violations remain (pre-existing); user-deferred.

## Handoff hook

The PoC experiment produced 5 rendered artifacts proving the visual-differentiation principle works at the chapter-1 scale. Next: Part II PoC round applies the same template to Ch 5-8 to test whether differentiation holds across different content registers (procedural vs hierarchical vs procedural with multi-step).
