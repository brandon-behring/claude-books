---
source_url: https://developer.mozilla.org/en-US/docs/Web/SVG
canonical_url: https://developer.mozilla.org/en-US/docs/Web/SVG
source_title: "SVG — Scalable Vector Graphics (MDN reference)"
fetched_at: 2026-05-23
last_verified_at: 2026-05-23
topic: pedagogy-figures-diagrams
tier: T1-official
cert_domains: []
cert_task_areas: []
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Authored SVG (Figma export + hand-tuned) — for claude-books

## What it is + best-fit use case
- "Authored SVG" = SVG files produced by a design tool (Figma, Illustrator, Inkscape, Affinity Designer) and then exported / hand-tuned. Distinct from generated SVG (Mermaid, D2, TikZ pipelines) and from runtime-drawn SVG (D3.js, React Flow).
- **Best fit**: hero illustrations, cover-quality conceptual diagrams, chapter-opening visuals, illustrated metaphors (e.g., React's docs use cartoon illustrations of state, props, components). Anything that needs design polish beyond what diagrams-as-code produces.
- Also the right answer for diagrams where the *layout itself carries pedagogical meaning* — e.g., the agent-loop diagram where the arrows need to convey a feedback shape, not just connect nodes. Diagrams-as-code's auto-layout fights this.

## Astro/MDX integration
- Trivial. SVG is HTML-native — drop the `.svg` file in `public/figures/` and reference via `<img src="/figures/foo.svg" alt="..." />` or `<Image>` (Astro's optimized image component). Inline SVG (literally pasting `<svg>...</svg>` into MDX) also works and gives CSS access to internal paths for theming.
- Astro 6's Image component can serve `.svg` directly without optimization (SVG is already vector). Use `loading="lazy"` for below-fold figures.
- For interactive SVG (e.g., hover highlights, click-to-annotate), MDX-imported `.svg` components via `@astrojs/svg` or `vite-plugin-svgr` give component-style import. Defer this — v1.0 ships static.

## Source format + maintainability
- `.svg` file. Text-based XML — git-diffable in principle, but in practice authored SVG diffs are noisy (path data `d="M 12.3,45.6 L 78.9,..."` looks different on every export from Figma).
- Two maintenance models:
  1. **Figma as source-of-truth**: design lives in Figma, exported to `.svg`, committed as build artifact. Edits require re-opening Figma, re-exporting. Designers happy, engineers unhappy with binary-ish workflow.
  2. **`.svg` as source-of-truth (hand-authored or post-export-tuned)**: designer or developer edits the SVG directly in a text editor or vector tool that respects file structure (Inkscape's "save as plain SVG" mode). More git-friendly but requires SVG literacy.
- For claude-books, the realistic workflow is #1 with a `figures-source/` directory storing the Figma export and `public/figures/` storing the post-processed (minified, theme-aware, accessibility-tagged) version. Build script (`scripts/process-svg.mjs`) automates SVGO minification + class injection.
- Tools: SVGO for minification (removes editor cruft), svgomg.net for visual minification preview, Inkscape for free hand-tuning.

## Build vs runtime + dependencies
- Zero runtime cost (it's just an image).
- Build-time: optional SVGO pass to strip Figma's editor metadata (saves ~30% file size). Optional theme-injection pass to swap hardcoded fills for CSS custom properties.
- No toolchain dependency at build time beyond an SVG processor (`svgo` is a single npm dep).

## Accessibility
- Best-in-class when authored deliberately. Inline SVG can include:
  - `<title>` (short label, read first by screen readers).
  - `<desc>` (longer description; explains the diagram for users who can't see it).
  - `role="img"` + `aria-labelledby` referencing the title.
  - Semantic grouping via `<g aria-label="...">`.
- Example pattern from a high-quality book:
  ```html
  <svg role="img" aria-labelledby="agent-loop-title agent-loop-desc">
    <title id="agent-loop-title">Claude Code agent loop</title>
    <desc id="agent-loop-desc">The agent receives a prompt, reasons about it, calls tools, observes results, and loops until it decides to end the turn.</desc>
    ...
  </svg>
  ```
- Authored SVG also affords keyboard-navigable interactive regions (tab through `<g role="button" tabindex="0">`) — though deferred for v1.0.
- Figma export does NOT include title/desc by default. Authors must add them in post-processing.

## Theme-awareness (dark mode + print)
- Inline SVG can use CSS custom properties: `fill="var(--diagram-primary, #1a73e8)"`. The page's theme stylesheet sets `--diagram-primary` per light/dark mode. This is the cleanest dark-mode pattern across all diagram technologies surveyed.
- Print: SVG scales infinitely. For print-CSS, override CSS variables in `@media print` to use ink-friendly colors (typically pure black on white).
- Practical workflow: design with two color swatches in Figma (one for light mode, one for dark), export, run a script that replaces hardcoded fills with `currentColor` or `var(--...)`.

## Performance
- Per-figure: 2–50 KB depending on complexity. A polished hero diagram might be 30 KB; a simple icon might be 1 KB.
- Page weight: noticeable if a chapter inlines 10+ SVGs. Use `<img src="*.svg">` (loaded lazily) for non-hero figures; inline only when CSS-theming or accessibility-grouping requires it.

## Real-world examples
- **React.dev** — heavy use of authored SVG illustrations (the bubble metaphor for state, the cake-layer metaphor for components-vs-elements). These are the visual hooks of the docs.
- **Stripe Docs** — careful authored SVG architecture diagrams for payment-flow visualizations. Polished, theme-aware, dual-render light/dark.
- **The Rust Programming Language book** — simple hand-authored SVGs (ownership/borrowing diagrams). Not glamorous, but accessible and consistent.
- **Tailwind CSS Docs** — uses Figma-designed illustrations for marketing pages; reference pages stay text-and-code-only.
- **Linear.app docs** — minimal but distinctive authored SVGs for the few diagrams they ship.

## Recommendation for claude-books
- **Adopt for hero diagrams and chapter-opening visuals**. The agent-loop diagram (Ch 1), the L1–L5 maturity pyramid, and the volume-pivot illustration on the landing page are the candidates.
- **Process**:
  1. Design in Figma using two color swatches (light + dark mode equivalents).
  2. Export as SVG.
  3. Run through `book-scaffold process-svg` (yet to build) — strips Figma metadata, swaps fills to CSS vars, injects `<title>`/`<desc>` placeholders.
  4. Author fills in title/desc manually.
  5. Lint enforces title/desc presence + non-empty.
- **Budget**: invest in ~6–10 hero SVGs total for v1.0, not 50. Authored SVG is expensive to produce; reserve it for high-leverage diagrams.
- **Don't** use authored SVG for things Mermaid handles well — sequence diagrams, simple flowcharts, state machines. Diagrams-as-code wins there.

## Quoted (citation-ready)

> "SVG is, essentially, to graphics what HTML is to text."
>
> — MDN Web Docs, SVG reference overview
>
> Anchor: `SVG reference overview + SVG is essentially to graphics`

> "If you wish to associate an `accessible name` or `accessible description` to a non-text content, the recommended approach is to use the `aria-labelledby` or `aria-describedby` properties pointing to a `<title>` or `<desc>` element inside the SVG content."
>
> — W3C, SVG Accessibility API Mappings, "Naming and Describing"
>
> Anchor: `Naming and Describing + If you wish to associate an accessible name`

## Cross-references
- See [[tech-mermaid]] for the "good enough" alternative for non-hero diagrams.
- See [[tech-excalidraw]] for the hand-drawn aesthetic alternative.
- See [[tech-tikz-svg-pipeline]] for the precision-math alternative inherited from the LaTeX source.
- See [[README]] for the cross-tech synthesis + the "authored SVG = hero only" guideline.
