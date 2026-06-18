# Handbook Ch 6 pilot port — tutorial-first + port-recipe

**Status**: active — started 2026-06-18
**Type**: Large Task — handbook Parts II–IV port, chapter 1 of 11, scoped as a *pilot*
**Decided via**: `/exploring-options`, 3 rounds, 2026-06-18
**Approved plan**: `~/.claude/plans/i-want-to-examine-zippy-curry.md`

## Context

The reconcile is committed (`7174e0c`): slim content model on record, `poc/`→`supplements/`,
Part I (ch01–04) wired via `<ChapterSupplements>`. The handbook is the series laggard — Part I
ported, Parts II–IV (ch05–15) pending. Audit verdict (2026-06-18): *port-don't-rewrite*; LaTeX
source on disk at `~/claude-best-practices/chapters/`.

This is the **first chapter of the port, run as a pilot**: port Ch 6 (Thinking Together) by hand,
end-to-end, under the slim model, to prove the workflow — then re-plan the remaining 10 with a proven
recipe. Ch 6 = stable PORT+ content *and* carries all four draft supplements, so it exercises the
slim "earned-supplements" discipline Part I never tested.

## Decisions Made

1. **Pilot, not full-plan** (strategy). Port one chapter, prove the slim workflow, then re-plan.
   *Rejected*: full Parts II–IV plan now (commits 11 chapters before the slim workflow is proven on
   one); stable-tier batch (still commits 4 before a single proof).
2. **Tutorial-first** (method). Promote `ch06-tutorial.mdx` as the chapter spine; reconcile vs the
   `.tex`; add the slim requirements it lacks. *Rejected*: `.tex`-first (discards a near-complete MDX
   draft already in the target vocabulary); synthesize-fresh (wastes the strongest draft). Note: for
   ch09–15, which have no draft supplements, `.tex`-first is the necessary fallback.
3. **Recipe during the pilot**. Distill `handbook/docs/port-recipe.md` while authoring, so the fan-out
   re-plan starts from a spec and can delegate chapters to parallel subagents (cert/Design precedent).
   *Rejected*: capture-at-re-plan; lightweight-notes-only.
4. **Disposition: promote 2, absorb 1, fold 1**. how-to + cheat-sheet earn their keep (promote);
   tutorial is absorbed into the chapter (via `git mv`, history preserved); TL;DR folds into the
   chapter Quick Reference but the file stays `draft: true` (don't delete — superseded-draft cleanup
   is a fan-out batch decision, matching the reconcile session's "build + noindex + segregate" posture).

## Reconcile findings (Ch 6)

- The `.tex` (515 ln) is **broader** than the tutorial (294 ln). The tutorial dropped: *Tests as
  thinking tools* (exploration vs. verification; property-based tests as assumption detectors),
  *Quick wins that compound* (docstrings / type hints / error messages / code archaeology /
  README-driven development), two of three *anti-sycophancy techniques* (argue-the-other-side;
  devil's-advocate-in-a-separate-session + the two-session-divergence insight), and the
  *prompt-pattern-library* hook (→ spirals to Ch 8 commands/skills + Ch 14 team). The PORT+
  completeness check folds these back → reconciled chapter ≈ 500 ln (matches OUTLINE target).
- The interview pattern is `\official` in the `.tex` with source URL `code.claude.com/docs/en/best-practices`
  → add `<Citation src="anthropic-claude-code-best-practices" />` (the tutorial omitted it).
- The `.tex`'s "thinking mirror" metaphor + "honest caveat" (no memory / tends to agree / occasional
  confident wrongness) are good framing the tutorial dropped — restore as an `<InsightBox>` + warning.

## Work plan (phases)

0. ✅ Move reconcile plan → `docs/plans/done/`; create this doc.
1. Build canonical `chapters/ch06-thinking-together.mdx` (tutorial-first): chapter frontmatter +
   full import block; add 2–4 numbered `<Tip>`s (provisional numbers — see below); convert the
   tutorial's retrieval prompts → 3 inline `<Exercise>` and `<TryThis>` → 2–3 `<Practice>` +
   `<ExerciseSolutions>`; add a Quick Reference (absorb TL;DR); end with `<ChapterSupplements chapter={6} />`.
2. Reconcile vs `05_thinking_partner.tex`: fold in the dropped sections above; currency spot-check only.
3. Disposition: drop `draft:true` from `ch06-howto-pre-mortem.mdx` + `ch06-cheat-sheet.mdx`, fix their
   `(#)` links; leave `ch06-tldr.mdx` draft.
4. Write `handbook/docs/port-recipe.md`.
5. Verify (build/validate/render), update memory, suggest commit.

**Tip numbering**: Part I used 1–8. Ch 6 ports out of reading order (before ch05), so its Tips take
*provisional* numbers (9+) and get finalized at the fan-out when ch05 lands. Documented in the recipe.

## Verification

- `cd handbook && npm run build` + `npm run validate` green (root-relative-link warnings under
  `base:/handbook/` are pre-existing convention, not errors).
- Render: ch06 route renders all components + a "Go deeper" block of exactly 2 links (how-to +
  cheat-sheet); the two supplements load without a DRAFT marker; `/supplements/ch06-tutorial` 404s.
- `grep -rn "ch06-tutorial" handbook/src` → no dangling refs; no unresolved `(#)` in kept supplements.
- Self-review vs `port-recipe.md`; `git status` shows tutorial→chapter as a rename.
