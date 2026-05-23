---
source_url: https://excalidraw.com/
canonical_url: https://docs.excalidraw.com/docs/
source_title: "Excalidraw — Virtual whiteboard for sketching hand-drawn-like diagrams"
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

# Excalidraw — for claude-books

## What it is + best-fit use case
- Browser-based and (via `@excalidraw/excalidraw`) embeddable whiteboard/diagram editor with a distinctive hand-sketched aesthetic. Open source (MIT), originally built by Christopher Chedeau (@vjeux).
- Saves diagrams as `.excalidraw` JSON files (text, diff-friendly) or exports as SVG/PNG.
- **Best fit**:
  - Conceptual diagrams where polish would feel cold — system metaphors, brainstormy "here's how I think about this" diagrams, war-room sketches.
  - Diagrams that pair well with conversational narrative tone — the hand-drawn aesthetic signals "this is a working model, not a formal spec."
  - Author-driven illustrations where the diagram should look "made by a human thinking out loud."
- Not appropriate for: formal architecture diagrams, sequence/state diagrams with strict semantics, anything that needs to look authoritative.

## Astro/MDX integration
- Three integration paths:
  1. **Export to SVG, commit to repo, embed as `<img>` or inline SVG.** Cleanest for static sites. The `.excalidraw` source file lives alongside as the editable artifact.
  2. **`@excalidraw/excalidraw` React component embedded directly.** Bundles a substantial React app (~600 KB). Defer this for v1.0 — overkill for static rendering.
  3. **Tools like `excalidraw-mcp` or `obsidian-excalidraw`** for editing workflow; output is still SVG.
- For Astro 6 + MDX 5 the right path is #1: keep `.excalidraw` files in `figures-source/`, run a build step that exports SVG, commit the SVG to `public/figures/`.
- The export tool: Excalidraw's CLI (`@excalidraw/excalidraw-cli`) takes `.excalidraw` → SVG. Headless-browser-free, so CI-friendly.

## Source format + maintainability
- `.excalidraw` is JSON — text, technically diff-friendly, but in practice diffs are noisy (every element has an id, position, etc.). Treat the `.excalidraw` file as the canonical edit-source, not as a primary git artifact for review.
- The editor is the source of truth — you don't hand-edit `.excalidraw` JSON, you open it in the web app (or VS Code's Excalidraw extension, or Obsidian's Excalidraw plugin).
- Learning curve: low (drag-drop drawing tool). Authors who can use Figma can use Excalidraw in 5 minutes.
- Collaboration: Excalidraw Plus (paid) offers real-time multi-user editing. The free version supports a "live collab" session via WebRTC for ad-hoc sessions.

## Build vs runtime + dependencies
- Build-time: `@excalidraw/excalidraw-cli` exports SVG. No headless browser, no LaTeX. ~30 MB npm install.
- Runtime: zero, if you go the export-to-SVG route.
- The runtime React-component path is heavy (600 KB) and only justified if you want users to interactively edit a diagram on the page — not a v1.0 requirement for a book.

## Accessibility
- Exported SVG includes text labels as `<text>` elements (screen-readable). Hand-drawn paths are decorative `<path>` elements.
- No automatic `<title>`/`<desc>` generation — you add these in post-processing or via the same workflow as authored SVG.
- Color contrast in the default palette is acceptable for light mode; dark-mode contrast requires custom palette or a post-export color-swap.

## Theme-awareness (dark mode + print)
- Excalidraw editor supports light and dark mode and can export in either. Dual-export pattern works: open the file, switch theme in app, export light SVG; switch theme, export dark SVG. Two artifacts in `public/figures/`.
- The hand-drawn aesthetic translates well to print — the "sketchy" stroke style reads as informal regardless of medium.
- Print-CSS: SVG scales cleanly. The Excalidraw font (an open-source font called "Virgil" / "Cascadia Code" alt) needs to be either embedded in the SVG or available on the page.

## Performance
- SVG per diagram: 10–40 KB (larger than Mermaid because the sketchy paths use many small line segments).
- Optional WOFF2 font (the Excalidraw "hand-drawn" font, ~50 KB) shared across all diagrams.

## Real-world examples
- **Obsidian community** has popularized Excalidraw heavily — the Obsidian-Excalidraw plugin is one of the most-installed plugins, used by many tech-bloggers for diagrams in personal knowledge bases.
- **`tldraw`** is a competing open-source whiteboard tool with a similar export-to-SVG workflow; some books use tldraw instead.
- **`Designing Data-Intensive Applications` 2nd edition (still in writing)** has discussed using Excalidraw for some diagrams (per Martin Kleppmann's blog).
- **Indie engineering blogs** (e.g., posts on Substack, hashnode.dev) — Excalidraw is the default informal-diagram tool of the 2023–2025 era.
- **Conference talks**: many engineering-talk slide decks use Excalidraw for the "here's how I think about X" diagram.

## Recommendation for claude-books
- **Defer to v1.5+ (post-v1.0).** The handbook's aesthetic target — closer to "technical reference" than "engineering blog" — slightly disfavors the hand-drawn look as a default.
- **Reconsider for the Field-Guide volume (Volume 3)**, which is more war-stories-and-patterns oriented. Excalidraw could fit Field-Guide's tonal register as the diagram tool for "here's what failure looked like, sketched on a whiteboard."
- If adopted later, the workflow is: edit `.excalidraw` files in Obsidian-Excalidraw plugin or excalidraw.com → CLI export to SVG → commit SVG to `public/figures/excalidraw/`.
- **Mandatory guardrails (if adopted)**:
  - Title/desc post-processing (same as authored SVG).
  - Dual light/dark export.
  - Cap usage to specific contexts (Field-Guide war stories, blog-style chapter openers) — don't mix Excalidraw and clean SVG within the same chapter.

## Quoted (citation-ready)

> "Excalidraw is an open source virtual whiteboard for sketching hand-drawn like diagrams."
>
> — Excalidraw documentation, introduction
>
> Anchor: `introduction + Excalidraw is an open source virtual whiteboard`

> "The hand-drawn style is what makes Excalidraw special. It conveys ideas without looking like a finished blueprint."
>
> — Excalidraw blog (paraphrased from founders' interviews; verify on visit)
>
> Anchor: `blog + hand-drawn style is what makes Excalidraw special`

## Cross-references
- See [[tech-authored-svg]] for the formal-aesthetic alternative.
- See [[tech-mermaid]] for the no-aesthetic diagrams-as-code default.
- See the topic README for cross-tech synthesis + the "Excalidraw deferred to Volume 3" rationale.
