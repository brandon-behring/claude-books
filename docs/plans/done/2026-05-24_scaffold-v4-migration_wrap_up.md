# Scaffold v4 migration + Ch 1 component & TikZ adoption wrap-up

**Date completed**: 2026-05-24 (begun 2026-05-23 evening)
**Plan reference**: `~/.claude/plans/this-repo-is-supposed-buzzing-eclipse.md` § "Completed: scaffold v4 migration + Ch 1 component & TikZ adoption"
**Commits**: `e7bf72e` (deps migration to v4.2.0 + `<PocLayout>` wired into PoC route) + `6e3aba8` (Ch 1 component adoption + first TikZ figure)
**Session duration**: ~2 hours

## What completed (acceptance gates)

- [x] Scaffold migrated from v3.5.0 → v4.2.0 (BREAKING `defineStyle` API: `preset: 'tools'` → `styles: [toolsStyle]`)
- [x] Astro patch bumped 6.3.6 → 6.3.7
- [x] `<PocLayout kind="...">` wired into `handbook/src/pages/poc/[...slug].astro`; per-PoC-kind CSS variables applied; verified via grep on built HTML (`class="poc-layout poc-layout-cheat-sheet"`, etc.)
- [x] Ch 1 tutorial PoC adopted `<YouWillLearn>` / `<WorkedExample id="agent-loop-walkthrough">` / 3 `<Pitfall>` callouts / `<Figure>`
- [x] First TikZ figure: `handbook/figures/agent-loop/agent-loop.tex` rendering to SVG via the v4.2.0 `book-scaffold build-figures` pipeline (pdflatex + pdftocairo); committed `.tex` source + `.pdf` artifact + generated `.svg`
- [x] `.gitignore` updated for LaTeX intermediates (`.aux`, `.log`, `.fdb_latexmk`, `.fls`, `.synctex.gz`)
- [x] handbook/CLAUDE.md updated to reflect v4.2.0
- [x] PEDAGOGY.md decision-log rows #8 / #14 promoted from DECIDED to DECIDED+SHIPPED+ADOPTED

## Friction + surprises

- **Bonus wins from scaffold maintainer**: v4.1.0 absorbed ALL 6 issues filed during the previous pedagogy round (#56-#61); v4.2.0 shipped TikZ→SVG exactly matching the PEDAGOGY tier-2 spec. Same-day round-trip between filing issues and consuming the closures.
- **v4 BREAKING migration was 2-line config edit** — `defineBookConfig({ site })` → `defineBookConfig({ styles: [toolsStyle], site })`. Migration recipe at scaffold's `package/MIGRATION-v3-to-v4.md` worked verbatim.
- **The "deferred" component adoption became immediate** — initial plan was to ship v4 migration alone, then adopt components later. Adoption took ~30 min more so was bundled. Single Ch 1 tutorial PoC adoption proved the pattern end-to-end before scaling to Ch 5-8.
- **TikZ first-figure round was 3 iteration cycles** — `\node distance`, arrow routing, label placement. Each cycle ~2 min (pdflatex compile + visual inspect). Confirms the iterative-authoring model is fast enough to be practical.
- **TeX Live install was a one-time prerequisite** — `which pdflatex pdftocairo pdf2svg` showed `pdflatex` + `pdftocairo` available; `pdf2svg` not installed but the v4.2.0 pipeline uses `pdftocairo` (per release notes), so no additional install needed.

## Open follow-ups

- The full v4 component adoption + TikZ figures for Ch 5-8 tutorials still pending — slated for the next round
- 5 deferred PEDAGOGY decision-log items (#7 supplement format, #16 war-story sidebars, #18 numbered Tips, #19 two-tier exercises, others) untouched
- Scaffold maintainer's release cadence is highly active (8 releases on 2026-05-22 alone per guides' Phase A.0 wrap-up); claude-books should `git pull` + check CHANGELOG before filing new issues to avoid duplicate-already-fixed pattern

## Handoff hook

The v4 affordances are proven end-to-end on Ch 1. Next: extend the same component + TikZ adoption to Ch 5-8 tutorials. Hand-authored, iterative, per-chapter — the user explicitly framed this as "TikZ practice".
