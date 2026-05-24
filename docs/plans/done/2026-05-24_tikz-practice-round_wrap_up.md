# TikZ practice round + v4 components across Ch 5-8 wrap-up

**Date completed**: 2026-05-24
**Plan reference**: `~/.claude/plans/this-repo-is-supposed-buzzing-eclipse.md` § "Completed: hand-authored TikZ practice round + v4 components across Ch 5-8 tutorials"
**Commits**: `2c68f00` (Ch 5) + `7b7761e` (Ch 6) + `0306cb2` (Ch 7) + `56c8a7c` (Ch 8) + `c86e0b3` (synthesis)
**Session duration**: ~4 hours wall-clock (sequential per-chapter pairing; figure iteration was the variable cost)

## What completed (acceptance gates)

- [x] **9 hand-authored TikZ figures**: 2 per Ch 5/7/8 (tutorial + compact cheat-sheet variant) + 3 for Ch 6 (flowchart + quadrant for tutorial + compact flowchart for cheat-sheet)
- [x] **Topics**: `context-budget`, `collaboration-flowchart`, `collaboration-quadrant`, `validation-pyramid`, `extension-decision` — all under `handbook/figures/<topic>/`
- [x] **All SVGs generated** via `npm run build:figures` (10 total including agent-loop): `handbook/public/figures/<topic>/*.svg` committed; PDFs committed alongside `.tex` per scaffold recipe-16 convention
- [x] **v4 components adopted in all 4 Part II tutorial PoCs** (Ch 5/6/7/8): `<YouWillLearn>` opener (replaces blockquote); `<WorkedExample>` wraps the worked-example block (unique `id` per chapter); 2-5 `<Pitfall>` callouts (replaces bullet-list mistakes section); `<Figure>` inserted after `</WorkedExample>` (Ch 6 inserts both flowchart + quadrant figures back-to-back)
- [x] **Ch 7 + Ch 8 cheat-sheets ASCII pyramids/decision-trees replaced** with compact SVG variants; Ch 5 + Ch 6 cheat-sheets got compact figures net-new
- [x] **OUTLINE.md Ch 5-8 entries** point at the new figures + components (mirrors Ch 1)
- [x] **`handbook/figures/NOTES.md` recipe-cookbook draft** captures per-figure technique notes + cross-figure patterns (4 figures documented in detail; intended for upstream promotion to scaffold's `recipes/16-tikz-figures.md`)
- [x] **COMPARISON.md Round-3** appended with cross-chapter findings
- [x] **PEDAGOGY decision-log rows #8 / #14** updated to DECIDED+SHIPPED+ADOPTED with the 5 adopted WorkedExample IDs + per-chapter Pitfall counts

## Friction + surprises

- **Hand-authoring beat agent dispatch for figure work specifically** — confirmed by the contrast with the Part II PoC round's parallel-agent approach. Figure iteration (write → build → inspect → refine) surfaced patterns (when trapezium vs rectangle for pyramid silhouette; `\def` for proportional layouts; legend-below-vs-in-figure for compact variants) that agent-dispatch wouldn't have surfaced. The cycle is cheap (~1-3 min per pdflatex iteration) so the perceived slowdown is small.
- **Decision-tree shape transferred cleanly across Ch 6 and Ch 8** — same node styles, same arrow routing, same yes/no label-on-line pattern. Confirms the recipe is reusable; visual consistency across decision-heavy chapters is automatic when style + spacing constants are shared.
- **2×2 quadrant was the most contentious figure** — 3 rounds of axis-label placement + quadrant-hint position + pattern coordinates. Provisional rule for NOTES.md: only reach for quadrant when each pattern can be unambiguously placed in exactly one quadrant; if two patterns share, the axes are wrong.
- **Pyramid via trapeziums vs rectangles** — `shapes.geometric.trapezium` has fiddly anchor semantics (top-edge vs bottom-edge width; stacking with `node distance=0` produces gaps). Switched to plain rectangles with decreasing widths centered on x=0; gives the pyramid silhouette without the trapezium quirks. Documented in NOTES.md.
- **The locked palette held across all 4 author-from-scratch figures** — blue boxes / orange diamonds / teal endpoints / gray arrows + `\sffamily` accommodated stacked bars (Ch 5), decision flowcharts (Ch 6 + Ch 8), 2×2 axis (Ch 6), and pyramid (Ch 7) via saturation shifts (`!8`, `!10`, `!20` fills with `!70!black` strokes). The palette did NOT feel limiting — validation of the lock-the-palette decision.

## Open follow-ups

- **SVG accessibility**: `<title>`/`<desc>` inside SVG not yet added (only `alt` text via the `<Figure>` component). PEDAGOGY cross-cutting requirement #1 wants both. Needs a post-export step or a TikZ extension. Filed as scaffold upstream concern.
- **Dark mode**: SVGs ship hard-coded fills. PEDAGOGY cross-cutting #4 commits to CSS-variable substitution. Needs a post-export rewrite hook.
- **Print-PDF quality**: untested. Defer to v2 PDF work.
- **NOTES.md upstream promotion**: draft only. Promote to scaffold `recipes/16-tikz-figures.md` extension once 2-3 more figure types (state machine? sequence diagram? ER?) land in Part III/IV chapters.
- **`<WorkedExample>` deep-linking** from cheat-sheets/TL;DRs not yet wired — needs PEDAGOGY decision before doing.

## Handoff hook

5 chapters now exemplify the full v4 component + TikZ figure adoption pattern. Pattern is proven; future chapters (Ch 2-4 of Part I, Ch 9-15 of Parts III-IV) can extend the same shape when their prose drafts land. Next-up candidate: surface the patterns we've established to the workspace level as durable conventions — guides-repo recon will be the lens.
