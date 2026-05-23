---
source_url: https://d2lang.com/
canonical_url: https://d2lang.com/tour/intro/
source_title: "D2 — A modern diagram scripting language that turns text to diagrams"
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

# D2 — for claude-books

## What it is + best-fit use case
- Diagrams-as-code language launched in 2022 by Terrastruct. Targets the same niche as Mermaid but with explicit goals around cleaner syntax, better layout, and a more modern aesthetic.
- Written in Go; ships as a CLI binary (`d2`) and a Go library. The CLI is the canonical interface — you give it a `.d2` file (or stdin) and it emits SVG, PNG, or PDF.
- Three layout engines built in: **dagre** (default, simple), **ELK** (Eclipse Layout Kernel — much better for complex flowcharts), **TALA** (Terrastruct's proprietary commercial engine, gives best layouts but requires a license for production use).
- **Best fit**: relationship diagrams (system architecture, component dependencies), C4-style context diagrams, and any flowchart where Mermaid's auto-layout struggles. Less native support for sequence/state/gantt — those are possible but Mermaid is stronger.

## Astro/MDX integration
- No first-party Astro plugin as of mid-2025. Integration options:
  1. **CLI-driven build step**: shell out to `d2` from a custom Astro integration or a remark plugin (`remark-d2` exists in the ecosystem but is community-maintained). Build-time SVG output, identical pattern to Mermaid.
  2. **WASM build**: D2 publishes a WASM bundle (`@terrastruct/d2`) usable in Node-only build contexts. Heavier than calling the CLI but avoids a binary install in CI.
- The integration story is markedly less polished than Mermaid's. Expect to write a small remark plugin or a `book-scaffold-astro` extension to wire it in cleanly.
- Source format is a `.d2` text file or a fenced ` ```d2 ` block in MDX.

## Source format + maintainability
- Syntax is more declarative than Mermaid's. Example:
  ```
  prompt -> reason
  reason -> {
    tool_needed: pick tool
    no_tool: end_turn
  }
  pick_tool -> call_tool -> observe -> reason
  ```
- Notable wins over Mermaid: nested containers are first-class (no `subgraph` ceremony), connections support labels with rich text including markdown + code, and styling lives in the same file but separate from structure (`shape:`, `style.fill:`, etc.).
- Diff-friendly. Authors who already write infrastructure-as-code (Terraform, Pulumi) find D2 familiar.
- Learning curve: moderate. Slightly higher floor than Mermaid because the syntax is more powerful — but the ceiling is also higher.

## Build vs runtime + dependencies
- Build-time only is the realistic choice. The D2 binary is ~30 MB; can be installed via Homebrew, `curl | sh`, or vendored into CI.
- WASM path adds ~10 MB to `node_modules` but avoids a binary.
- Output is plain SVG, embeddable identically to Mermaid's SVG.

## Accessibility
- SVG output includes `<title>` and `<desc>` elements but only if the author writes them in the D2 source (no equivalent of Mermaid's `accTitle:` directive — D2 uses object-level `tooltip:` and explicit `title:` attributes).
- Less polished out-of-the-box accessibility story than Mermaid. The handbook's lint step would need to enforce title/desc presence rather than relying on D2's defaults.
- No keyboard navigation support; same flat-SVG limitation as Mermaid.

## Theme-awareness (dark mode + print)
- D2 has built-in theme support via `--theme=<id>` CLI flag (themes 0 through 8 ship including a dark theme). Custom themes possible via TOML/JSON.
- Cleaner dual-render workflow than Mermaid: two CLI invocations with different `--theme` flags, output two SVGs.
- Print: native SVG, scales cleanly. PDF output is also native (`--format=pdf`).

## Performance
- D2 binary is fast — typical render is 50–200 ms per diagram. Faster than Mermaid's headless-browser approach.
- Output SVG size comparable to Mermaid (~3–10 KB per diagram).

## Real-world examples
- **Tailscale's engineering blog** uses D2 for network architecture diagrams.
- **Terrastruct's own products** (Terrastruct Studio) eat the dogfood.
- Adoption is still narrow compared to Mermaid — D2 shows up in mid-2020s engineering blogs and developer-focused docs but isn't yet the default anywhere mainstream.
- Notable: D2 has been promoted in the Hacker News / tech-Twitter ecosystem as "Mermaid done right," which has driven adoption among indie hackers and platform-engineering teams.

## Recommendation for claude-books
- **Defer to post-v1.0**. Mermaid's ecosystem maturity (GitHub-native rendering, Astro plugins, IDE previews, large user base) trumps D2's nicer syntax for v1.0.
- **Reconsider for v1.5+** if:
  - Multiple Mermaid diagrams in the handbook turn out unreadable due to auto-layout issues.
  - The handbook gains a substantial architecture-diagram section (Architect's Reference Volume 2) where C4-style layouts are needed.
- If adopted later, write a `remark-d2` plugin (community ones exist but are unmaintained — fork or write fresh) and route specific diagram types through it via fence tag (` ```d2 `) while keeping Mermaid as the default.
- **Do not mix half-measures**: pick Mermaid or D2 as the diagrams-as-code primary, not both. Authors get confused if they have to decide per-diagram.

## Quoted (citation-ready)

> "D2 is a diagram scripting language that turns text to diagrams. It stands for Declarative Diagramming."
>
> — D2 documentation, intro page
>
> Anchor: `intro page + D2 is a diagram scripting language`

> "TALA is a layout engine for D2 designed specifically for software architecture diagrams."
>
> — D2 documentation, TALA layout engine page
>
> Anchor: `TALA layout engine page + TALA is a layout engine`

## Cross-references
- See [[tech-mermaid]] for the more mature alternative claude-books should adopt first.
- See [[tech-graphviz-dot]] for the older but battle-tested layout engine that backs ELK and informed D2's design.
- See [[README]] for the cross-tech synthesis.
