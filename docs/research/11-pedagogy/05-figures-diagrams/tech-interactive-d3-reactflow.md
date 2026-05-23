---
source_url: https://d3js.org/
canonical_url: https://d3js.org/
source_title: "D3.js + React Flow — Runtime interactive figures (deferred)"
fetched_at: 2026-05-23
last_verified_at: 2026-05-23
topic: pedagogy-figures-diagrams
tier: T3-practitioner
cert_domains: []
cert_task_areas: []
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# D3.js + React Flow / @xyflow — for claude-books (deferred)

## What they are + best-fit use case
- **D3.js**: foundational JavaScript library for runtime data-visualization. Provides low-level primitives (scales, axes, selections, transitions) for binding data to DOM/SVG elements. The "library of libraries" — most modern viz libraries (Observable Plot, Vega-Lite, Plotly's open-source layer) are built on D3 ideas.
- **Observable Plot**: D3's higher-level companion (also by Mike Bostock's team) — declarative chart-grammar API for common chart types. Smaller surface than D3 but covers 80% of chart needs.
- **React Flow / @xyflow**: React component library specifically for interactive node-graph editors. Supports drag-rearrange, pan/zoom, custom node types, edge routing. Popular for "build-your-own-workflow" UIs.
- **Best fit for a book**: only for figures where interaction *is* the pedagogy — e.g., a context-budget visualizer where reader slides a "session length" knob and watches the bar chart re-balance, or a "drag-and-drop a CLAUDE.md hierarchy and see precedence resolve" demo.
- Not appropriate for static figures. The static equivalent (a Mermaid flowchart or an authored SVG) is better in every dimension except interactivity.

## Astro/MDX integration
- Astro 6 supports React island components via `@astrojs/react`. The handbook currently uses Preact (`@astrojs/preact`); React Flow specifically targets React but works in Preact-compat mode for most components.
- Pattern: an `<InteractiveFigure>` MDX component that's an Astro island (`client:visible` directive). Loads on scroll-into-view, hydrates the interactive widget.
- For D3 directly: an `<svg ref={d3SetupHandler}>` component pattern is standard. D3 + Preact is workable; D3 + Astro server-rendered shell + Preact hydration is the cleanest pattern.
- For Observable Plot: simpler API; can render server-side to static SVG for the no-JS fallback, then hydrate to interactive for users with JS.

## Source format + maintainability
- TypeScript/JavaScript source files. Diff-friendly text.
- Learning curve: D3 has a famously steep learning curve (the data-join idiom takes weeks to internalize). Observable Plot is easier. React Flow is moderate.
- Maintenance burden: significant. An interactive figure is essentially a small application; it has tests, dependencies, accessibility considerations, and version churn (D3 v5 → v6 → v7 each had breaking changes).
- For a handbook, each interactive figure is a measurable engineering project, not a quick author task.

## Build vs runtime + dependencies
- Pure runtime. The library code ships to the browser.
- D3 minified: ~95 KB gzipped (full bundle). Tree-shakable to ~30 KB for typical usage. Observable Plot adds another ~50 KB.
- React Flow: ~80 KB gzipped + React/Preact base (~50 KB if not already loaded).
- A single interactive figure can add 100–200 KB to the page weight. Several on one page = noticeable load time hit.

## Accessibility
- **The hard problem.** Interactive SVG diagrams require:
  - Keyboard navigation (tab through interactive elements; arrow keys for graph traversal).
  - Screen-reader announcements of state changes (`aria-live` regions, custom announcements via JS).
  - Static fallback for no-JS / no-interaction users (`<noscript>` block, or server-rendered initial state).
  - Reduced-motion support (`prefers-reduced-motion`) — disable transitions for users who can't tolerate them.
- D3 and React Flow do not provide accessibility primitives out of the box. Each interactive figure becomes a custom accessibility audit.
- This is the primary reason the handbook should defer interactive figures: each one is a major accessibility commitment, not a free deliverable.

## Theme-awareness (dark mode + print)
- Possible but requires explicit CSS-variable plumbing through the D3/React Flow rendering code.
- Print: interactive figures should fall back to a static snapshot for print. The pattern is: a non-interactive `<img src="figure-static.svg">` shown via `@media print`, replaced by the interactive component via `@media screen` + JS.

## Performance
- Largest page-weight cost of any technology in this survey. Each interactive figure = a small SPA.
- Lazy-loading helps but doesn't eliminate the cost.
- Build cost: low (Vite/Rollup tree-shakes the library). Runtime cost: high (JS execution, event handlers, animation frames).

## Real-world examples
- **Observable Notebooks** themselves — Mike Bostock's platform. Every notebook is a runtime interactive D3 figure.
- **The Pudding** — explanatory journalism site; heavy D3 usage for scrollytelling.
- **NYT Graphics Department** — D3 for most of their interactive features.
- **`Explorable Explanations`** (Bret Victor's tradition; many indie sites like `explorabl.es`) — heavy interactive-figure use.
- **n8n, Make, Zapier UI** — React Flow / @xyflow for the workflow editor.
- **`Distill.pub` papers** — D3 + custom code for interactive explanations of ML concepts. The gold standard for what an interactive book figure can be.
- **Conspicuously absent**: most published technical books. Even books with companion websites typically use static figures. Distill.pub is the exception, not the rule.

## Recommendation for claude-books
- **Defer all interactive figures to post-v1.0.** The accessibility burden, the maintenance burden, and the build/runtime complexity all argue for "later, with intent."
- **Candidate figures for v1.5+ or v2.0** (each requires its own engineering scoping):
  - **Context-budget visualizer** (slider: session length → bar chart of context allocation). Pedagogical leverage: high. Pairs with chapter 5 "Context" material from the source repo.
  - **CLAUDE.md hierarchy resolver** (paste a directory tree, click a path, see which CLAUDE.md applies in precedence order). Pedagogical leverage: high. Pairs with the configuration-layer hierarchy.
  - **Agent-loop simulator** (step through a worked example of the loop, advancing one iteration at a time). Pedagogical leverage: moderate. The static diagram + worked-example narrative may already deliver the value.
- **Static alternative for v1.0**: each candidate interactive figure has a static counterpart (Mermaid + worked example + table) that meets the diagram-or-example rule from PEDAGOGY.md.
- **If/when adopted**:
  - Establish an `<InteractiveFigure>` MDX component scaffold first, with accessibility primitives baked in (keyboard navigation harness, `aria-live` region, no-JS fallback slot).
  - Budget ~1 person-week per figure including accessibility audit.
  - Cap at ≤5 interactive figures total across all three volumes — they're expensive.

## Quoted (citation-ready)

> "D3.js is a JavaScript library for manipulating documents based on data. D3 helps you bring data to life using HTML, SVG, and CSS."
>
> — D3.js, home page tagline
>
> Anchor: `home page tagline + D3.js is a JavaScript library for manipulating documents`

> "React Flow is a customizable React component for building node-based editors and interactive diagrams."
>
> — @xyflow/react documentation, introduction
>
> Anchor: `introduction + React Flow is a customizable React component`

> "Truly explorable explanations are a fundamentally new medium ... A user who is engaged with an explorable explanation is no longer a passive reader; they are an active participant."
>
> — Bret Victor, "Explorable Explanations" (2011)
>
> Anchor: `Explorable Explanations + Truly explorable explanations are a fundamentally new medium`

## Cross-references
- See [[tech-mermaid]] for the static alternative for v1.0.
- See [[tech-authored-svg]] for the higher-fidelity static alternative.
- See `handbook/PEDAGOGY.md` "Visual presentation principles" for the static-default rationale.
- See [[README]] for cross-tech synthesis + the v1.0/v1.5/v2.0 staging.
