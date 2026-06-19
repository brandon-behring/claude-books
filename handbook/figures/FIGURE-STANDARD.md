# Figure visual standard — v0 seed

**Status: v0 seed (2026-06-19).** First pass at a *consistent, brand-aligned* figure look,
established while authoring the handbook's decision/before-after figures (ch08, ch10, ch11).
Deliberately small and honest — it captures what we settled on and *why*, not a frozen law.
Expect to revisit it (see [Open tensions](#open-tensions) + [Roadmap](#roadmap)).

**Scope today:** the 5 hand-authored handbook figures —
`extension-decision`, `delegation-decision`, `orchestration-decision` (decision trees) +
`worktree-isolation`, `serial-vs-orchestrated` (before/after panels).
**Not yet covered:** the 4 older figures (`agent-loop`, `collaboration-*`, `context-budget`,
`validation-pyramid`) still use the retired stock-color palette — migration is roadmap, not done.

> Supersedes the "Locked palette" block in [`NOTES.md`](./NOTES.md) (stock `blue!70!black` /
> `orange` / `teal`). Those `.tex` techniques still hold; only the *colors* are replaced here.

---

## 1. The palette — Warm-Tol, mirrored from the scaffold brand

The figures are the one place the books were *off-brand*: TikZ stock hues instead of the
scaffold's brand tokens. The fix is to mirror the scaffold's **Warm-Tol** palette
(`@brandon_m_behring/book-scaffold-astro` → `styles/tokens.css`) directly into each `.tex`
via `\definecolor`. All four books inherit these tokens with zero overrides, and
`brandon-behring.dev` mirrors the same accent blue — so one palette ties every property together.

```latex
% Drop this block into every figure .tex (the shared seed):
\definecolor{warmblue}{HTML}{3B6FA0}   % --warm-blue
\definecolor{warmrose}{HTML}{C06858}   % --warm-rose
\definecolor{warmgreen}{HTML}{4A7E3F}  % --warm-green
\definecolor{warmplum}{HTML}{8A4E82}   % --warm-plum
\definecolor{warmgold}{HTML}{C09840}   % --warm-gold
\definecolor{warmcrimson}{HTML}{A03838} % --warm-crimson (reserved: strongest warning)
```

Neutrals (diamonds, flow arrows, text) are **not** hard-coded — they stay near-neutral gray so
the build's retheme step maps them to the theme-aware `--diagram-ink/paper/grid` tokens (§3).

## 2. Category → color map (the code the reader learns)

Color carries **one** job: it names *which concept* a node is. Each concept owns a hue and reuses
it across figures and chapters, so the reader learns a code once. Two coherent uses of the code:

| Hue | Hex | Concept it names | Appears in |
|---|---|---|---|
| **blue** | `#3B6FA0` | the lightweight / default option | ch08 Command · ch11 Subagents |
| **green** | `#4A7E3F` | the good outcome — delegate / skill / the "after" | ch08 Skill · ch10 Delegate · ch11 Agent view · every "after" panel |
| **rose** | `#C06858` | caution / enforcement / the "before / problem" | ch08 Hook · every "before" panel |
| **plum** | `#8A4E82` | authority / external / the heaviest tool | ch08 MCP server · ch11 Dynamic workflows |
| **gold** | `#C09840` | packaging / coordination | ch08 Plugin · ch11 Agent teams |
| neutral gray | `--diagram-*` | scaffolding — decision diamonds, flow arrows, text | all |

**Honest caveat:** the code is *categorical-first*. In before/after figures the hue is genuinely
**semantic** (rose = the problem, green = the fix) and that reads instantly. In the decision trees
some hues are **pure differentiation** — ch11's four orchestration surfaces (blue/green/gold/plum)
get distinct hues mainly so they're tellable apart, not because "gold" *means* coordination. That's
a real seam, flagged in §5.

## 3. How color survives light **and** dark (load-bearing)

One SVG serves both themes. `npm run build:figures` post-processes each `pdftocairo` SVG through the
scaffold's `classifyColor` (`src/lib/figure.mjs`):

```
chroma = max(r,g,b) − min(r,g,b)
chroma > 0.12  → leave the color exactly as authored (an intentional accent)
otherwise      → remap by luminance to var(--diagram-ink | paper | grid)
```

**Design consequence — put the category in the *border*, not the fill.** A bold Warm-Tol *stroke*
has chroma ≈ 0.3–0.4, clears the 0.12 gate, and renders as-authored in **both** themes. A pale
*fill* (`warmblue!13`, chroma < 0.12) is read as near-neutral "paper" and **collapses to the
dark page color in dark mode** — its category vanishes. So:

- **Category = a bold colored border** (`line width=0.8–0.9pt`, `draw=warm…`). Survives both themes.
- **Fill = the faint same-hue tint** (`fill=warm…!13–!16`). Cosmetic in light mode; expected to
  drop out in dark mode — fine, because the border already carries the meaning.
- Verified by rendering ch08 in dark mode (the colored borders stay legible on `--paper` dark).

Opt a figure out of theming entirely with a `%! no-theme` line in its `.tex` (we don't use it here).

## 4. Pedagogy checklist (apply to every figure)

Grounded in the same research as [`PEDAGOGY.md`](../PEDAGOGY.md) (Mayer multimedia + signaling +
coherence; Tufte data-ink; Sweller load; Miller/Cowan chunking). The rules that fixed the first
"incomprehensible" drafts:

- [ ] **Terse labels** — ≤ ~7 words, no parentheticals, no jargon, no file paths *inside* a node.
      Detail belongs in the prose or the caption, not the shape. (This was the single biggest fix.)
- [ ] **Color = category only.** Decision diamonds are **neutral** so the scaffolding recedes and
      the colored endpoints pop (Mayer signaling).
- [ ] **≤ ~7 nodes** per figure (chunking). A decision tree past ~5 questions wants splitting.
- [ ] **Text breathes** — diamonds `inner sep ≥ 4pt` (`aspect ~2.0`); endpoints `min height ~1.05cm`
      + `inner sep 6pt`. Labels must not crowd the borders. (The "too close to the lines" fix.)
- [ ] **Caption explains *why*, not *what*** — the figure shows the *what*; the caption gives the
      rule for reading it (e.g. "stop at the first yes").
- [ ] **Long `alt`** on `<Figure>` — describe the path through the diagram for screen readers;
      the SVG `<title>`/`<desc>` are filled from `caption`/`alt` by the scaffold.

## 5. Open tensions (revisit before locking a v1)

1. **5 colors vs Mayer's "≤3 semantic colors."** Coherence research says fewer colors = less load.
   We deliberately run up to 5 because each is a *taught, reused code*, not decoration — defensible,
   but the weakest hue-as-meaning cases (ch11's four surfaces, §2 caveat) are where a reader could
   stall. A v1 option: keep blue/green/rose strongly semantic; let the "differentiation-only" hues
   be a lighter cue (shape, number, or position) instead of a full category color.
2. **Tints are cosmetic-only in dark mode** (§3). Acceptable now (borders carry meaning), but if we
   ever want filled category blocks to read in dark mode, that needs named `--fig-*` tokens upstream
   (Roadmap) rather than chroma-gated fills.
3. **No shared `\definecolor` include yet** — the block in §1 is copy-pasted into each `.tex`. Fine
   for 5 figures; a `_warmtol.tex` `\input` (or upstream tokens) is the de-dup once the set grows.

## 6. Per-form conventions

**Decision tree** (`extension-`, `delegation-`, `orchestration-decision`): vertical
stop-at-first-match ladder. Neutral diamond per question cascading down; each "yes" branches right
to a category-colored endpoint; "no" continues down. `arrowlabel` punches a white background so
yes/no reads over the line. Caption states the stopping rule.

**Before/after** (`worktree-isolation`, `serial-vs-orchestrated`): two side-by-side panels, the
problem panel **rose**-bordered, the fix panel **green**-bordered (the semantic core of §2). Each
panel is self-contained; the contrast *is* the argument. Accompanies (doesn't replace) the prose
`<BeforeAfter>` — house style keeps both.

## 7. Build + verify

```bash
cd handbook && npm run build:figures   # .tex → pdflatex → pdftocairo → SVG + retheme
npm run build && npm run validate      # figures aren't routes; validate checks <Figure src> resolves
```

- Grep a built SVG for the Warm-Tol hex (`#3B6FA0` etc.) — accents present, non-empty.
- Neutrals carry `var(--diagram-` — retheme ran.
- **Visual is the real gate** (codex/CI can't see renders): the set must read as one coherent
  Warm-Tol family in light *and* dark; author signs off before merge.

## Roadmap (beyond the handbook — the cross-property seed)

1. Migrate the 4 older handbook figures (`agent-loop`, `collaboration-*`, `context-budget`,
   `validation-pyramid`) to this palette for whole-book consistency.
2. File an upstream scaffold issue: add named `--fig-*` tokens to `tokens.css` so figures, the other
   three books, and `brandon-behring.dev` share one source of truth (do **not** edit the scaffold
   from this repo — log in `docs/scaffold-gaps.md` + file `consumer:claude-books`).
3. Align `brandon-behring.dev` diagrams to the same palette.
4. Consider hosting the cross-property design system as a Claude Design (`/design-sync`) project.
