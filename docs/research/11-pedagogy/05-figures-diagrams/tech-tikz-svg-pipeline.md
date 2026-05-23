---
source_url: https://tikz.dev/
canonical_url: https://tikz.dev/
source_title: "TikZ & PGF — TeX-based graphics package"
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

# TikZ → SVG pipeline — for claude-books

## What it is + best-fit use case
- TikZ (TikZ ist kein Zeichenprogramm) is a LaTeX package for programmatic vector graphics. PGF (Portable Graphics Format) is the lower-level layer; TikZ is the user-facing syntax. Together they're the de-facto academic-publishing standard for technical diagrams.
- **Best fit**: precision math figures (functions, geometric proofs, statistical plots via pgfplots), publication-quality tikz-cd commutative diagrams, manually-positioned multi-layer diagrams where auto-layout fails, and any figure that needs to live in both a LaTeX-built PDF book AND a static HTML site.
- The source repo `~/claude-best-practices/` already invests heavily in TikZ — agent-loop diagrams, L1–L5 maturity pyramid, configuration hierarchy, context-budget bar charts (see `chapters/05_context.tex` for a four-panel context-evolution diagram), the property-vs-principle dichotomy diagrams in chapter 1, etc.
- Strengths over diagrams-as-code tools: pixel-precise control, full mathematical typesetting (LaTeX math inline in diagram labels), academic-publication aesthetic. Weaknesses: heavy toolchain, slow build, requires LaTeX expertise to author or modify.

## Astro/MDX integration
- TikZ does not render in a browser natively. The pipeline always involves rendering TikZ → PDF or DVI → SVG (or PNG) at build time, then including the SVG/PNG in MDX as `<img>` or inline.
- Three established pipelines:
  1. **`tikz2svg` / `pdf2svg` / `dvisvgm`**: standard LaTeX build to DVI, then `dvisvgm` (ships with TeX Live) emits SVG. Cleanest output; the SVG includes proper font outlines or embedded fonts.
  2. **`tikzjax`**: JavaScript runtime that ships a pre-compiled TikZ-to-SVG WASM bundle (~3 MB). Heavy but works in-browser; used by Obsidian's TikZ plugin.
  3. **Standalone `tikzpicture` documents compiled offline**: author writes `.tikz` or `.tex` snippets, a build script wraps them in a `\documentclass{standalone}` shell, runs `pdflatex` + `pdf2svg`, drops `.svg` files into `public/figures/`. MDX references via `<img src="/figures/agent-loop.svg" alt="...">`. Most common pattern for hybrid LaTeX+web book projects.
- For claude-books, pipeline 3 is the pragmatic choice — it lets the LaTeX source remain the canonical source, with SVG as a derived artifact. Book-scaffold-astro's `build:figures` script could orchestrate this (run `make figures` in the source repo, copy SVGs to `handbook/public/figures/`).

## Source format + maintainability
- `.tex` or `.tikz` files. Each diagram is a `\begin{tikzpicture}...\end{tikzpicture}` block.
- Diff-friendly text, but readability is poor — TikZ syntax is verbose, position-heavy (`(0, 0.35)`, `(0.10*\barwidth, 0)`), and full of math-mode escapes.
- Learning curve: high. Authors need LaTeX literacy plus TikZ-specific idioms (node styles, paths, decorations, libraries).
- Maintenance pain: changing one node's position often cascades through a manual layout. Refactoring a TikZ diagram is real work. The upside is that once a diagram is "right" it tends to stay right across years.
- **Key advantage for claude-books**: the source repo's existing TikZ diagrams are already authored, debugged, and visually polished. Re-doing them in Mermaid would lose quality and the substantial author-investment that exists.

## Build vs runtime + dependencies
- Build-time only. No runtime cost (the SVG inlines).
- Toolchain weight: heavy. Requires a TeX Live installation (~2 GB full install, ~500 MB scheme-medium). CI needs a TeX Docker image (`texlive/texlive:latest` is ~5 GB).
- Build cost: each diagram takes 3–10 seconds (LaTeX compile + SVG conversion). Cache by source-hash to avoid rebuilding unchanged figures.
- Alternative: Tectonic (Rust-based LaTeX engine) — faster startup, simpler install, but doesn't yet support every TikZ feature (esp. some PGF libraries).

## Accessibility
- `dvisvgm` output is SVG with text as either outlines or embedded font references — text-as-outlines kills screen-reader access entirely (the SVG is a picture, not text). Use `dvisvgm --font-format=woff2` or `--no-fonts` flag carefully.
- Even with text preserved, TikZ SVGs lack semantic structure — they're flat geometric primitives. Adding `<title>` and `<desc>` requires post-processing the SVG.
- **Mandatory pattern for claude-books**: every imported TikZ SVG must be wrapped in MDX with explicit alt text + a `<figcaption>` describing the diagram in prose. Treat TikZ-imported figures the same as photographs — image-with-caption-and-alt is the contract.
- This is the area where TikZ → SVG loses to diagrams-as-code tools that emit semantic SVG with built-in `accTitle`/`accDescr`.

## Theme-awareness (dark mode + print)
- TikZ diagrams typically encode colors absolutely. Dark-mode support requires either:
  - **Dual-render**: compile two versions, one with light palette and one with dark, swap via CSS `prefers-color-scheme`.
  - **SVG CSS-variable post-processing**: rewrite fill/stroke colors to CSS custom properties, then let the page's theme set the variables.
  - Approach #2 is more elegant but requires a SVG transform step. dvisvgm has `--currentcolor` flag to emit `currentColor` for strokes; can be extended.
- Print: TikZ is print-native by definition. PDF book builds use the diagram directly; the web book uses the SVG export. This is the singular advantage of TikZ for a multi-format book — same source, two outputs.

## Performance
- Build-time cost is the main consideration. A 30-figure book adds ~3–5 minutes to a cold build. With source-hash caching, incremental builds are fast.
- Output SVG sizes vary: simple diagram 5–15 KB; complex pgfplots chart 30–80 KB. Larger than Mermaid output but still small.

## Real-world examples
- **Academic textbooks** widely: CS:APP (Bryant & O'Hallaron), TAOCP (Knuth, though he uses METAFONT historically), most ACM/IEEE papers.
- **Open-source technical books with web + PDF outputs**: Diátaxis source uses some TikZ; many statistics-textbook web ports (e.g., Bishop's PRML supplements) ship pre-rendered TikZ SVGs.
- **The Rust Programming Language book** uses simple manually-authored SVG, not TikZ — a counter-example showing that high-quality web tech books sometimes avoid LaTeX entirely.
- **Math Stack Exchange answers and arXiv papers** are the largest TikZ corpus.

## Recommendation for claude-books
- **Adopt for diagrams already authored in the source repo** — agent loop, L1–L5 maturity pyramid, context-budget bar charts, configuration hierarchy. Re-creating these in Mermaid would be a downgrade in both visual quality and authorial investment.
- **Pipeline**: orchestrate via `book-scaffold build-figures` — point at `~/claude-best-practices/figures/*.tex`, output to `handbook/public/figures/*.svg` (dual-render for dark mode).
- **Mandatory guardrails**:
  - Every imported TikZ figure must have alt text + figcaption (manual; not generated).
  - Color-variable substitution for dark mode (use `dvisvgm --currentcolor` + custom CSS).
  - Lint that every diagram has both `.svg-light` and `.svg-dark` variants.
- **Do NOT** author new diagrams in TikZ unless they require pgfplots-level precision (rare in this handbook). For new diagrams, Mermaid is faster and yields more maintainable output.
- **Long-term**: the LaTeX source repo is the canonical home for TikZ diagrams; the MDX handbook treats them as imported assets. This split preserves source-repo workflows while letting the web book ship.

## Quoted (citation-ready)

> "TikZ provides a powerful and modern way to describe pictures in a way that you describe the structure of a picture, not the pixels."
>
> — Till Tantau, *The TikZ and PGF Packages Manual*, "Foreword" (PGF/TikZ 3.x)
>
> Anchor: `Foreword + TikZ provides a powerful and modern way`

> "PGF is a TeX macro package for generating graphics. It is platform- and format-independent and works together with the most important TeX backend drivers, including pdftex and dvips."
>
> — PGF/TikZ Manual, introduction
>
> Anchor: `introduction + PGF is a TeX macro package`

## Cross-references
- See [[tech-authored-svg]] for the manual-SVG alternative used by some high-quality web books.
- See [[tech-mermaid]] for the diagrams-as-code default for new diagrams.
- See [[tech-graphviz-dot]] for the older programmatic-graphics tradition TikZ partially descends from.
- See the topic README for the cross-tech synthesis + how TikZ fits the dual-output (PDF + web) strategy.
