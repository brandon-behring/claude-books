---
topic: pedagogy-figures-diagrams
fetched_at: 2026-05-23
last_verified_at: 2026-05-23
verified: true
---

# Sub-topic 05 — Figure / diagram rendering technologies for claude-books

The research foundation for the handbook's figures/diagrams strategy. Synthesis of 8 tech-note files comparing diagram-rendering technologies for an Astro 6 + MDX 5 technical-book stack.

**Inputs evaluated**: Mermaid, D2, TikZ → SVG pipeline, hand-authored SVG, ASCII / box-drawing, Excalidraw, Graphviz / DOT, PlantUML, D3.js + React Flow (interactive — deferred).

**Sprint context**: requested as a focused slice for the diagram-or-example rule from PEDAGOGY.md. Pairs with the source LaTeX repo's existing TikZ investment and the static-first / print-friendly v1.0 commitment.

## Tech notes in this sub-topic

| # | Tech | Slug | Recommendation |
|---|---|---|---|
| 1 | Mermaid | [[tech-mermaid]] | **Adopt as default** for flowchart/sequence/state/simple-ER |
| 2 | D2 | [[tech-d2]] | Defer to post-v1.0 (revisit if Mermaid's layout fails) |
| 3 | TikZ → SVG pipeline | [[tech-tikz-svg-pipeline]] | **Adopt for source-repo-inherited diagrams** (preserve LaTeX investment) |
| 4 | Authored SVG (Figma export) | [[tech-authored-svg]] | **Adopt for hero / chapter-opening visuals** (~6–10 figures total) |
| 5 | ASCII / box-drawing | [[tech-ascii-boxdrawing]] | **Adopt for cheat sheets + code-context diagrams** (already in PoC) |
| 6 | Excalidraw | [[tech-excalidraw]] | Defer to v1.5 / Volume 3 (Field-Guide's informal register) |
| 7 | Graphviz / DOT | [[tech-graphviz-dot]] | Do not adopt for v1.0 (Mermaid covers same use cases) |
| 8 | PlantUML | [[tech-plantuml]] | Do not adopt for v1.0 (Mermaid wins on integration; PlantUML wins on C4 if Vol 2 needs it) |
| 9 | D3.js + React Flow (interactive) | [[tech-interactive-d3-reactflow]] | **Defer all** to v1.5+ with explicit per-figure scoping |

## Recommended adoption set for v1.0

**Three-tier diagram stack** matching the diagram-or-example rule (PEDAGOGY.md principle 6):

### Tier 1 — Default (Mermaid)
- Build-time SVG rendering via `remark-mermaidjs` or `@theguild/remark-mermaid`.
- Covers flowcharts (agent loop variants), sequence diagrams (tool-call traces), state machines (session lifecycle), simple class/ER diagrams.
- **Estimated count**: 30–50 figures across the three volumes.
- **Guardrails**: `accTitle` + `accDescr` required on every diagram; cap nodes at ≤7 (Miller); custom WCAG-AA theme audited for light + dark.

### Tier 2 — Source-inherited (TikZ → SVG)
- Pipeline: `~/claude-best-practices/figures/*.tex` → `dvisvgm` → `handbook/public/figures/*.svg` (dual-render light/dark).
- Covers diagrams already authored in the LaTeX source repo: agent loop (Ch 1), L1–L5 maturity pyramid (Ch 1), context-budget bar charts (Ch 5), configuration hierarchy (Ch 8).
- **Estimated count**: 8–15 figures inherited from source repo.
- **Guardrails**: manual alt text + figcaption per figure; CSS-variable color substitution for dark mode; lint enforces dual-theme variants exist.

### Tier 3 — Hero authored (Figma → SVG)
- Workflow: design in Figma → SVG export → `book-scaffold process-svg` → inline in MDX with `<title>`/`<desc>`/`role="img"`.
- Covers chapter-opening visuals, the volume-pivot landing illustration, the few "this metaphor unlocks the chapter" diagrams.
- **Estimated count**: 6–10 figures total across v1.0.
- **Guardrails**: budget the design investment; reserve for high-leverage figures only.

### Tier 4 — ASCII (cheat sheets only)
- Plain text in `<pre>` blocks within `figure` wrappers with `aria-label` describing the diagram and `aria-hidden="true"` on the inner code.
- Covers cheat-sheet supplements (Ch 1 cheat-sheet PoC already uses this), code-context diagrams quoting actual file content, print-dense reference materials.
- **Estimated count**: 5–10 figures in cheat sheets + supplements; zero in main narrative chapters.
- **Guardrails**: monospace font with strong box-drawing glyph support; prose figcaption mandatory.

## Cross-cutting findings

Patterns that hold across the 8+ technologies surveyed:

### 1. SVG is the universal output target

Every diagram tech worth adopting outputs SVG. The handbook's pipeline contract should be: **whatever the source format, the artifact in `public/figures/` is SVG**. This makes accessibility tooling, dark-mode CSS-variable substitution, and print-CSS uniform across diagram sources.

### 2. Build-time > runtime for static books

Build-time SVG (Mermaid, D2, TikZ, authored, Graphviz, PlantUML) wins over runtime rendering (D3, React Flow, runtime Mermaid) for a static, print-friendly book. The diagram-or-example rule is satisfied by the rendered artifact, not by the interactivity. v1.0 ships zero runtime diagram rendering.

### 3. Accessibility is the differentiator nobody talks about

Mermaid is the only diagrams-as-code tool with built-in accessibility primitives (`accTitle` / `accDescr`). Every other tech requires post-processing or manual SVG editing to inject `<title>` / `<desc>` / `role="img"` / `aria-labelledby`. This single feature is what tilts the recommendation toward Mermaid for the diagrams-as-code role. **The lint step in `book-scaffold validate` should enforce title/desc presence on every figure regardless of source.**

### 4. Dark mode is solved by CSS-variable substitution — and nothing else

The cleanest dark-mode pattern across all techs:
- SVG fills/strokes use `var(--diagram-primary, #fallback)`.
- Page CSS sets `--diagram-primary` per light/dark mode.
- Same SVG renders correctly in both modes.

For tools that don't emit CSS-variable-friendly SVG (TikZ, Excalidraw, some Mermaid themes), a post-export SVG-rewrite step injects the variables. **Avoid the "render two SVGs and swap via JS" pattern** — it doubles build cost, duplicates accessibility tags, and complicates print-CSS.

### 5. Print-friendly = SVG with embedded fonts

For PDF/print exports, the SVG must either (a) embed font outlines via SVG `<path>` or (b) reference a font that's guaranteed available in the print PDF. Most diagram tools default to (b) with web-default fonts; the print pipeline (e.g., `book-scaffold render-pdf`) needs to either embed fonts or fall back to system fonts. This is a build-pipeline concern, not a diagram-tech-choice concern, but it constrains the diagram tools: avoid tools that emit raster fallbacks (some PlantUML configs).

### 6. The "diagrams as artifacts" mindset is the right scaling strategy

Three of the recommended tools (Mermaid build-time output, TikZ → SVG export, Figma → SVG export) treat the SVG file in `public/figures/` as a build artifact, not the editable source. The editable source (`.mermaid` fence, `.tex` file, `.fig` Figma file) lives separately. This separation:
- Lets the static site ship without diagram-rendering toolchain dependencies in production.
- Enables source-hash caching to avoid re-rendering unchanged diagrams.
- Keeps the diff-review surface (`.mermaid` source vs `.svg` artifact) cleanly bifurcated.

### 7. The author-experience hierarchy

For an author touching a diagram, the experience-quality ordering across techs is:
1. **Mermaid** (fence inline in MDX; minimal context switch) — best author UX.
2. **ASCII** (literally type it in the MDX) — second best, with the AsciiFlow assist.
3. **D2 / Graphviz / PlantUML** (separate `.d2`/`.dot`/`.puml` file) — slight context switch but text-based.
4. **TikZ** (separate `.tex` file + LaTeX literacy) — high context switch.
5. **Authored SVG** (Figma round-trip) — highest context switch; reserve for high-leverage diagrams.

This ordering reinforces "Mermaid as the default" — authors will reach for it because it's right there. Make sure the build pipeline rewards that reach.

## Recommended decision posture

For each new diagram the handbook adds, the decision algorithm:

```
Is this diagram already in the LaTeX source repo?
├── YES → TikZ → SVG pipeline (Tier 2). Preserve the source-repo work.
└── NO ↓
    Is this a hero / chapter-opening / metaphor diagram?
    ├── YES → Authored SVG (Tier 3). Budget design time.
    └── NO ↓
        Is this a cheat-sheet or code-context diagram?
        ├── YES → ASCII (Tier 4). Lives next to dense text.
        └── NO → Mermaid (Tier 1). Default.
```

**No diagram in the handbook should require a runtime decision by the author beyond this tree.** Authors must not be asked to evaluate D2 vs Mermaid per-diagram. Pick one default, hold it.

## Open questions for this sub-topic

- **Mermaid build-time integration choice**: `remark-mermaidjs` (Puppeteer-based, more battle-tested) vs `@theguild/remark-mermaid` (newer, smaller dep). Needs PoC to choose.
- **TikZ pipeline ownership**: does `book-scaffold-astro` own the LaTeX → SVG pipeline, or does the source LaTeX repo own its own build artifacts and `handbook/` consume them as pre-built assets? Leaning toward source-repo-owns based on the cleaner separation, but needs alignment with the source repo's CI.
- **CSS-variable theming for Mermaid**: Mermaid's emitted SVG doesn't use CSS variables natively. Post-processing pipeline (regex-replace `fill="#xxx"` → `fill="var(--diagram-x, #xxx)"`) needs to be built. Approach: write once in `book-scaffold-astro`, reuse across all three volumes.
- **C4 architecture diagrams for Volume 2 (Architect's Reference)**: Mermaid added C4 support in v9.4 but quality is mixed. C4-PlantUML is best-in-class. Defer the decision until Volume 2 chapter outlines exist; for now Mermaid C4 is the working assumption.
- **Print/PDF output for v2 (if added)**: which tech ships best to PDF? Authored SVG and TikZ are PDF-native. Mermaid SVG works in PDF but font handling is sometimes flaky. Document the requirements when v2 PDF work begins.
- **Interactive figure scaffold for v1.5+**: when interactive figures are scoped, design the `<InteractiveFigure>` MDX component to enforce accessibility primitives (keyboard nav harness, `aria-live`, no-JS fallback) as a structural constraint, not as a per-figure manual responsibility.

## Sprint log

- **2026-05-23**: Initial sub-topic dossier. 8 tech-note files + this README. Coverage: 6 build-time diagrams-as-code techs, 2 manual-authoring techs, 1 deferred-interactive tech. Total 9 notes (counting interactive D3+React-Flow as one combined "deferred" note).

## Cross-references

- `handbook/PEDAGOGY.md` — principle 6 (diagram-or-example rule), principle 8 (signaling), working-memory cap (≤5 boxes per diagram).
- `handbook/src/content/poc/ch01-cheat-sheet.mdx` — existing ASCII PoC that demonstrates Tier 4 in practice.
- `~/claude-best-practices/chapters/*.tex` — the source LaTeX repo's TikZ diagrams; canonical input for Tier 2.
- [[../01-doc-ux-patterns/site-react-dev]] — React.dev's authored-SVG hero illustrations (Tier 3 inspiration).
- [[../01-doc-ux-patterns/site-stripe-docs]] — Stripe's dual-render light/dark architecture SVGs.
- [[../03-multimedia-learning/theory-miller-chunking-schemas]] — the ≤7-node cap derives from this.
- [[../03-multimedia-learning/theory-mayer-multimedia-principles]] — signaling + coherence principles inform diagram-pruning discipline.
