---
source_url: https://graphviz.org/
canonical_url: https://graphviz.org/documentation/
source_title: "Graphviz — Graph Visualization Software"
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

# Graphviz / DOT — for claude-books

## What it is + best-fit use case
- Graphviz is the venerable (1991-launched, AT&T-originated) graph visualization system. DOT is its declarative language for describing graphs.
- Five layout engines: `dot` (hierarchical / layered, the default), `neato` (spring model), `fdp` (force-directed), `circo` (circular), `twopi` (radial). Each suits different graph topologies.
- **Best fit**:
  - Dependency graphs (package dep trees, import graphs, call graphs).
  - State machines with many transitions.
  - Any graph where the topology is the message — Graphviz's layout engines are still best-in-class for "automatically arrange a complex graph so it doesn't look like spaghetti."
  - Programmatic diagram generation (e.g., a build script generates a DOT file describing the rule-precedence graph in a CLAUDE.md hierarchy, Graphviz lays it out).

## Astro/MDX integration
- No first-party Astro plugin. Integration patterns:
  1. **Build step + SVG output**: `dot -Tsvg input.dot -o output.svg`. Drop SVG into `public/figures/`. Reference from MDX as `<img>` or inline SVG.
  2. **WASM library**: `viz.js` (now `@hpcc-js/wasm`) bundles Graphviz as WASM (~3 MB). Build-time: import the WASM, call from a remark plugin, emit SVG inline.
  3. **Mermaid uses Graphviz-influenced layout internally for some diagram types** — you may already get DOT-style auto-layout via Mermaid + ELK without touching Graphviz directly.
- For claude-books, pattern #1 is the right choice if Graphviz is adopted at all — direct CLI invocation is simple and the dep is just the `graphviz` Homebrew/apt package.

## Source format + maintainability
- `.dot` text files. Minimal syntax:
  ```
  digraph "agent-loop" {
    rankdir=TB;
    prompt -> reason;
    reason -> "tool needed?" [label="..."];
    "tool needed?" -> "pick tool" [label="yes"];
    "tool needed?" -> end_turn [label="no"];
    "pick tool" -> "call tool" -> observe -> reason;
  }
  ```
- Diff-friendly text. Authors who've used DOT in academic CS contexts find it familiar.
- Learning curve: low for basic graphs, medium for attributes (node shapes, edge styles, subgraph clustering).
- Auto-layout is the killer feature *and* the failure mode. When `dot` produces an unreadable layout you have very limited tools to fix it (rank constraints, invisible edges, clustering hints — not pixel placement).

## Build vs runtime + dependencies
- Binary install: `brew install graphviz` (macOS) or `apt-get install graphviz` (Linux). ~30 MB.
- Render: typical diagram 50–500 ms.
- WASM alternative (`@hpcc-js/wasm`): no binary needed, ~3 MB npm install, slightly slower.

## Accessibility
- DOT supports node and edge labels — these become `<text>` elements in SVG (screen-readable).
- No native `<title>`/`<desc>` directive. Post-processing required for accessibility tags.
- Less accessibility-aware than Mermaid (which has explicit `accTitle`/`accDescr`).

## Theme-awareness (dark mode + print)
- DOT supports color attributes per node/edge but doesn't have a built-in theme system.
- Dark-mode workflow: regenerate the SVG with different color attributes, or post-process SVG to inject CSS variables.
- Print: native SVG; scales cleanly.

## Performance
- Build-time only (if pattern #1). Fast (<500 ms per diagram).
- Output SVG: 5–20 KB depending on complexity.

## Real-world examples
- **Doxygen** — auto-generates call graphs and class hierarchies via Graphviz. Many C/C++ project docs ship Doxygen+Graphviz output.
- **Linux kernel** documentation includes Graphviz-generated graphs in some subsystems.
- **Bazel, Bazel Build, Buck** — build-system tools auto-generate dependency graphs via DOT/Graphviz.
- **Academic papers** in CS, especially in distributed systems and PL — Graphviz is the lingua franca for "here's the state machine."
- **GitHub Actions** workflows render their dependency DAG using Graphviz behind the scenes.

## Recommendation for claude-books
- **Do not adopt as a primary diagram tool.** Mermaid covers the same use cases (flowcharts, state diagrams) with better Astro integration and built-in accessibility primitives.
- **Reserve for build-step auto-generated diagrams** if and when claude-books grows automated graph generation needs — e.g., a script that walks the rule-precedence hierarchy in CLAUDE.md and generates a dep graph. Then DOT is the right intermediate format because it's easy to emit programmatically.
- **If a chapter needs a single hand-drawn graph**, Mermaid is faster to write and has better Astro integration. Don't introduce Graphviz toolchain for a one-off.
- **Lesson from Graphviz vs Mermaid**: Graphviz's layout engines (especially `dot`) are objectively better than Mermaid's for complex graphs — but Mermaid's tighter MDX integration outweighs the layout-quality gap for the handbook's diagram complexity range.

## Quoted (citation-ready)

> "Graphviz is open source graph visualization software. Graph visualization is a way of representing structural information as diagrams of abstract graphs and networks."
>
> — Graphviz, documentation home page
>
> Anchor: `documentation home page + Graphviz is open source graph visualization software`

> "The DOT Language is a plain text graph description language."
>
> — Graphviz, DOT language reference page
>
> Anchor: `DOT language reference page + The DOT Language is a plain text graph description language`

## Cross-references
- See [[tech-mermaid]] for the higher-integration alternative covering the same diagram types.
- See [[tech-d2]] for the modern descendant influenced by DOT/Graphviz.
- See [[tech-plantuml]] for an alternative declarative-diagram language with broader UML support.
- See [[README]] for the cross-tech synthesis.
