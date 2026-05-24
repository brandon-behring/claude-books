# TikZ figure notes — handbook

Per-figure technique observations + cross-figure patterns + open questions, captured during the 2026-05-24 hand-authored TikZ practice round. Intended as a draft to promote upstream to `book-scaffold-astro/recipes/16-tikz-figures.md` once patterns stabilize.

## Locked palette (all figures)

```latex
% Apply in every .tex source for visual consistency:
box/.style       = { draw=blue!70!black,   fill=blue!8,   rounded corners=2pt },
decision/.style  = { draw=orange!70!black, fill=orange!10, diamond, aspect=2.2 },
endpoint/.style  = { draw=teal!70!black,   fill=teal!10,  rounded corners=10pt },
arrow/.style     = { -Stealth, thick, draw=gray!60!black },
font = \sffamily
```

For figures that don't fit the agent-loop semantics (e.g., stacked bars, pyramid), apply the same color *families* with shifted fill saturation:
- Persistent / authoritative → blue family (`blue!20` fill for bar tiles)
- Working / active / task → teal family
- Risk / threshold / noise → orange family (line: `orange!70!black`; fill: `orange!20`)
- Inert / background / available → gray family (`gray!8` fill, `gray!55!black` text)

## Per-figure notes

### `agent-loop` (Ch 1) — canonical seed

**Pattern**: Box-and-arrow flowchart with a single decision diamond and a loop edge.

**Techniques used**:
- `node distance=1cm and 1.5cm` for vertical/horizontal spacing
- `arrowlabel/.style={fill=white, inner sep=1.5pt}` for arrow labels that punch out their background
- `(observe.east) -| ++(1.5,0) |- (reason.east)` for the loop-back arrow's L-shape

**Cycles to "looks right"**: 2-3 (initial structure → arrow routing tweak).

### `context-budget` (Ch 5) — stacked horizontal bars

**Pattern**: Multiple labeled bar segments stacked horizontally with a percentage label below each row.

**Techniques used**:
- `\def\barwidth{10cm}` defines the unit width once; all bar `minimum width` values are fractions of it. Lets you rescale the whole figure by editing one number.
- Each bar segment is its own `\node[bar, fill=..., minimum width=0.XX*\barwidth] at (offset, row_y) {...}`. Position-anchoring with `anchor=south west` makes the offset math straightforward.
- Threshold lines: `\draw[dashed, thick] (0.60*\barwidth, ymin) -- (0.60*\barwidth, ymax) node[above] {label};` — node attached to the draw command labels the line at its top endpoint.
- Two thresholds (60% degradation, 83% auto-compaction) use different dash patterns (`dashed` vs `dotted`) to distinguish them; both in the orange palette.

**Tricky bits**:
- Source LaTeX used custom `WarmBlue` / `WarmGreen` / `WarmRose` colors — substituted with stock `blue` / `teal` / `orange` at `!20` saturation to match the locked palette. Text on lighter fills uses default dark-text rather than `text=white` (which was the source's choice on `!40` saturation).
- The dotted-vs-dashed distinction between the two threshold lines is the readable cue; without it they overlap visually since they're both vertical orange lines.
- Compact variant (cheat-sheet) drops in-bar text labels entirely — too cramped at 6cm width — and adds a legend below with mini-tile color swatches. Pattern: `\tikz{\node[fill=..., minimum width=8pt, minimum height=8pt] {};} Label`.

**Cycles to "looks right"**: 1 (port from source LaTeX was direct; compact variant added on second pass).

## Cross-figure patterns (emerging)

After 2 figures (agent-loop + context-budget), these patterns are starting to recur:

1. **Anchor offsets via `\def`** — when a figure has repeated proportional layout, define the unit once (`\barwidth`, `\nodeSpacing`) and reference fractions. Lets you rescale or re-proportion without touching every node.
2. **Label-on-line via `node[above]` attached to `\draw`** — cleaner than separate nodes for line annotations. The label inherits the line's color via the style.
3. **Compact variants are not just "shrink the source"** — they typically drop verbose in-figure text and add a legend below, freeing space. The figure shape stays the same; the label budget shifts.
4. **Palette saturation maps to semantic role**:
   - `!8` / `!20` = fill (background tile)
   - `!70!black` = stroke + emphasis
   - `!90!black` = stronger emphasis (rare; reserve for the most-load-bearing element)

Add more patterns as figures land.

## Open questions

- **Cheat-sheet figure widths**: 6cm felt right for `context-budget-compact` but may not generalize. The cheat-sheet PoC layout (`<PocLayout kind="cheat-sheet">`) sets `--bs-content-line-length: 55ch` — that's roughly equivalent to 5-6 inches at typical font sizes. Worth measuring the actual rendered SVG against the column in the browser before locking a convention.
- **SVG accessibility**: the agent-loop has `alt` text on the `<Figure>` component but the SVG itself has no `<title>` / `<desc>` elements. PEDAGOGY cross-cutting requirement #1 says these should be added; needs either a `tikz` extension or a post-processing step. Filing as a scaffold concern (recipe 16 should document the gap).
- **Dark mode**: PEDAGOGY cross-cutting #4 says CSS-variable substitution; my current TikZ outputs hard-coded fills. The "single SVG, two themes" pattern requires post-export `<fill="#xxx">` → `<fill="var(--diagram-blue, #xxx)">` rewriting. Out of scope this round but worth a follow-up upstream contribution.
- **Print PDF quality**: not yet tested. The `border=4mm` standalone class generates clean PDFs but font embedding for print pipelines is untested.

## Upstream-promotion candidates (to file later)

Once 5+ figures land and patterns stabilize:
1. **`recipes/16-tikz-figures.md` extension** — add a "Composing the standalone preamble" section codifying the locked palette pattern + the per-figure-style families (box / decision / endpoint / arrow / bar / thresh).
2. **`recipes/16-tikz-figures.md` extension** — add a "Tutorial-vs-compact variant" subsection codifying the compact-figure conventions (narrower width / dropped in-figure labels / legend below).
3. **Accessibility recipe** — `<title>` / `<desc>` injection via a post-export step (or a `tikz` package extension).
4. **Dark-mode SVG variable substitution** — regex replace `fill="#xxx"` → `fill="var(--diagram-x, #xxx)"` in a post-export hook.
