---
source_url: https://mermaid.js.org/
canonical_url: https://mermaid.js.org/intro/
source_title: "Mermaid — JavaScript-based diagramming and charting from Markdown-like text"
fetched_at: 2026-05-23
last_verified_at: 2026-05-23
topic: pedagogy-figures-diagrams
tier: T1-official
cert_domains: []
cert_task_areas: []
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Mermaid — for claude-books

## What it is + best-fit use case
- Diagrams-as-code system; renders flowcharts, sequence, class, state, ER, gitgraph, gantt, mindmap, timeline, sankey, quadrant, and architecture diagrams from a Markdown-like fenced-code syntax.
- v10+ ships with a pluggable renderer; v11 (current as of late 2025) added layered ELK auto-layout and improved theming.
- **Best fit for the handbook**: flowcharts (agent loop, decision trees), sequence diagrams (tool-call traces), state diagrams (session lifecycle), and simple class/ER diagrams (configuration-layer hierarchy). Not strong for arbitrary precision math figures or pixel-tuned hero illustrations.
- Most ubiquitous diagrams-as-code option — supported natively on GitHub, GitLab, Notion, Obsidian, VS Code preview, Docusaurus, Astro Starlight (via plugin), Nextra, and most static-site generators.

## Astro/MDX integration
- Two main integration paths:
  1. **Build-time SVG via remark plugin** (`remark-mermaidjs`, `astro-mermaid`, or `@theguild/remark-mermaid`): runs Puppeteer/Playwright headlessly during `astro build`, converts ` ```mermaid ` fences into inline SVG. Zero runtime JS cost. Tradeoff: build slower (headless browser spin-up) and CI needs Chromium-compatible environment.
  2. **Runtime hydration**: ship `mermaid.min.js` (~600 KB minified before gzip) as a client-side script that scans for `<pre class="mermaid">` and rewrites them. Tradeoff: page weight + flash-of-unrendered-text but no build dep.
- For an Astro 6 + MDX 5 stack the build-time path is the obvious default (matches Astro's "ship zero JS by default" philosophy). The Astro Starlight ecosystem has `astro-mermaid` and `starlight-mermaid` community integrations.
- The fence-pattern (` ```mermaid ` triple-backtick block) is a de-facto standard — markdown remains diffable + previewable in GitHub even before the build runs.

## Source format + maintainability
- Plain-text fenced code in MDX. Diff-friendly, git-blame-friendly, copy-paste-friendly. Authors edit the diagram source inline without leaving the document.
- DSL is line-based, terse. Example flowchart:
  ```
  flowchart TD
    A[Prompt] --> B{Tool needed?}
    B -- yes --> C[Pick tool]
    B -- no --> D[end_turn]
    C --> E[Call tool]
    E --> F[Observe result]
    F --> B
  ```
- Learning curve: low for basic flowcharts (most authors can produce a useful diagram in 10 minutes). Medium for sequence/state. The curve flattens once you've done two or three diagrams of a given type.
- Pain points: layout control is limited (it's auto-layout — you can hint with `direction`, subgraphs, link lengths, but you cannot pixel-place nodes). When the auto-layout produces a crossing or an unbalanced render, your only escape hatch is to switch to a different layout engine (ELK) or rewrite the diagram.

## Build vs runtime + dependencies
- **Build-time path** depends on a headless browser (Puppeteer/Playwright). On macOS/Linux that's ~150 MB Chromium download once. CI needs `playwright install chromium` or equivalent.
- **Runtime path** ships `mermaid.min.js` — adds ~600 KB to first-page payload (gzip ~180 KB). Acceptable for app-style docs (Mintlify uses runtime), unacceptable for a print-friendly book aiming at static SVG.
- For claude-books (static, print-friendly, accessibility-first), build-time SVG is the right answer.

## Accessibility
- v9+ added explicit `accTitle` and `accDescr` directives that generate `<title>` and `<desc>` elements on the SVG output — these are read by screen readers.
- Example syntax:
  ```
  flowchart TD
    accTitle: Claude Code agent loop
    accDescr: The agent receives a prompt, decides whether a tool is needed, and either calls a tool or ends the turn. The loop continues until the agent decides no further tools are needed.
    A[Prompt] --> B{Tool needed?}
  ```
- Limitations: keyboard navigation through the SVG is not provided by default (the SVG is a flat image). For a complex diagram, the `accDescr` carries the full burden of conveying meaning to a screen-reader user. Authors must write meaningful descriptions, not just repeat node labels.
- Color-contrast: Mermaid's default themes (default, forest, dark, neutral) have not all been audited against WCAG AA. Custom themes are mandatory if the handbook commits to AA contrast across light + dark modes.

## Theme-awareness (dark mode + print)
- Mermaid supports `%%{init: {'theme':'default'} }%%` directives or runtime theme switching. For Astro the cleanest pattern is to render two SVGs at build time (light + dark) and conditionally show via CSS `prefers-color-scheme` or a theme-toggle attribute.
- Print: SVG scales cleanly; ensure font-embedding or fallback to web-safe fonts so PDFs render correctly.
- The book-scaffold-astro's `build:figures` script could orchestrate the dual-theme render.

## Performance
- Build-time SVG is "free" at runtime — the rendered SVG inlines into the HTML, no JS, no FOUC.
- File-size per diagram: typical Mermaid SVG is 3–8 KB. Negligible.
- Build cost: each diagram ~200–800 ms via headless browser. A book with 50 diagrams adds ~30 s to build. Cacheable across builds if you key on the source-code hash.

## Real-world examples
- **GitHub** renders Mermaid in any `.md` file natively — most discoverable use.
- **Docusaurus** ships an official `@docusaurus/theme-mermaid` plugin. Many React/Vue/etc. docs use it.
- **Microsoft Learn** uses Mermaid in some technical pathways (e.g., Azure architecture flow diagrams).
- **Obsidian** has native Mermaid support — has become the default in tech-blogger workflows.
- **Cloud-vendor docs** (AWS architecture diagrams, GCP architecture decision docs) frequently use Mermaid for low-fidelity flow diagrams.
- Notably absent from the high-end published tech books — Mermaid is the docs/blog standard, not the published-book standard (which is still hand-authored SVG + TikZ).

## Recommendation for claude-books
- **Adopt as the default** for flowcharts, sequence diagrams, state diagrams, and simple ER/class diagrams. Use build-time SVG via `remark-mermaidjs` or `@theguild/remark-mermaid`. Configure dual-theme render (light + dark).
- **Mandatory guardrails**:
  - Every diagram must declare `accTitle` + `accDescr` (linted in `book-scaffold validate`).
  - Cap nodes at ≤7 (Miller's chunk limit from [[../03-multimedia-learning/theory-miller-chunking-schemas]]).
  - Use a custom theme (not `default`) audited for WCAG AA contrast in both modes.
  - Never use Mermaid for hero/cover-quality diagrams — those go to hand-authored SVG.
- **When Mermaid fails**: if auto-layout produces an unreadable result twice, switch to D2 (next ranked diagrams-as-code) or hand-author the SVG. Don't fight Mermaid's layout engine.

## Quoted (citation-ready)

> "Mermaid lets you create diagrams and visualizations using text and code."
>
> — Mermaid documentation, intro page header
>
> Anchor: `intro page header + Mermaid lets you create diagrams`

> "Diagrams in Mermaid can be made more accessible by adding `accTitle` and `accDescr` to give them a title and a description."
>
> — Mermaid documentation, accessibility section
>
> Anchor: `accessibility section + Diagrams in Mermaid can be made more accessible`

## Cross-references
- See [[tech-d2]] for the next-gen alternative when Mermaid's layout fails.
- See [[tech-authored-svg]] for hero diagrams beyond Mermaid's pay-grade.
- See [[tech-ascii-boxdrawing]] for the cheat-sheet/print-only alternative the PoC already uses.
- See the topic README for the cross-tech synthesis + adoption shortlist.
