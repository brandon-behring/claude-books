# Guides-repo recon wrap-up

**Date completed**: 2026-05-24
**Plan reference**: `~/.claude/plans/this-repo-is-supposed-buzzing-eclipse.md` § "Completed: guides-repo recon"
**Commits**: `4b4a93c` (13-category memo at `docs/guides-recon.md`)
**Session duration**: ~2 hours (~30 min Phase-1 recon agent + ~90 min memo authoring)

## What completed (acceptance gates)

- [x] **`docs/guides-recon.md`** — 6034-word working memo (target was 4500-5500; came in slightly long because the 13 categories each warranted ~1 full page)
- [x] **13 category sections** populated with the 5-block template (what guides did / why / claude-books current / what claude-books could do given different audience / concrete adoption path)
- [x] **Reverse view** cataloging 8 claude-books innovations not present in guides (living COMPARISON memo, 4-tier figure stack with per-figure decision tree, hand-authored TikZ recipes in NOTES.md, `<PocLayout>` upstream-driven, 5×4-format PoC experiment, 47-note pedagogy research breadth, topic-prefix lint exemption, DECIDED/SHIPPED/ADOPTED state tracking)
- [x] **Priority summary table** with P0/P1/P2/P3 categorization for all 13 categories
- [x] **Roadmap note added** in plan file's "Phase 2 — Architect's Reference" section flagging hub+sibling-repos architecture as a Phase 2 Step 3 bootstrap decision
- [x] **`npm run build --prefix handbook`** still clean (31 pages); no MDX touched this round

## Friction + surprises

- **Phase-1 recon agent overstated existing claude-books artifacts** — agent's report mentioned a "~350-line style guide" that doesn't exist; verified via `find` + `ls` before planning. Catch was easy because the claim was specific enough to falsify.
- **The user's "thorough analysis first" clarification reshaped the round significantly** — initial plan was "land 3-7 ADOPT NOW items"; the clarification shifted to "memo first, decisions later." Tightened scope + raised quality bar; final memo is more useful as a working doc.
- **Audience-divergence framing** was the load-bearing structural choice — guides serves interview-prep learners (tutorial register); claude-books serves Claude Code practitioners (reference register). Many guides patterns translate; some intentionally don't. The memo's per-category "could-do given different audience" block is what makes the analysis usable rather than a copy-everything plea.
- **The reverse-view section preserved important claude-books innovations** — without it, the memo would have read as deficit-listing. The reverse-view signals which guides patterns *should not* be wholesale adopted because their analogs in claude-books are load-bearing.

## Open follow-ups

- **Bundle D adoption round** (the next round) lands P0 + P1 + style guide (7 of 13 categories). Already planned in active plan-file section.
- **6 deferred categories** wait for natural phase boundaries: Zod schema extensions + multi-paradigm lint (after 2-3 chapters land); PFL framing + dossier evidence citations (opportunistic during chapter prose); session-handoff (when work cadence becomes episodic); hub+sibling architecture (Phase 2 Step 3 bootstrap).
- **Adoption decisions still per-pattern** — even within Bundle D, each category has implementation choices the user pre-approved (workspace-root location, TikZ-as-content, Standard refactor scope, 3-workflow CI including research-lint, ~30-line wrap-ups).

## Handoff hook

The recon memo is the input for the next round's execution plan. Bundle D adoption (5 commits: foundational surfaces + CI workflows + friction-log backfill + design-doc refactor + style guide) is queued and approved.
