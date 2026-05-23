---
source_url: https://diataxis.fr/
canonical_url: https://diataxis.fr/
source_title: "Diátaxis"
fetched_at: 2026-05-23
last_verified_at: 2026-05-23
topic: pedagogy-doc-ux
tier: T3-practitioner
cert_domains: []
cert_task_areas: []
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Diátaxis — UX + visual presentation patterns

## Site context
- Diátaxis is a framework for organizing technical documentation into four quadrants — **tutorials**, **how-to guides**, **reference**, **explanation** — published by Daniele Procida. The site at `diataxis.fr` is the canonical source. Meta-relevant for claude-books because the framework itself is widely adopted by the doc sites in this research set (Cloudflare, Astro, React.dev all approximate it; MDN, Microsoft Learn approximate it less rigorously).
- The site is a single-author Sphinx-built reference for the framework, also serving as **proof-by-example** that you can structure even the framework's own docs along Diátaxis lines.

## Layout + IA observations
- Three-column layout: left sidebar with hierarchical nav (mirrors the framework's own organization: "Start here / Applying Diátaxis / Tutorials / How-to guides / Reference / Explanation / Understanding Diátaxis / Foundations / Quality / The compass"); wide center content; right "Contents" anchor TOC.
- Sidebar nav toggleable — readers can hide the left or right sidebar for focused reading.
- Top nav minimal: site title, search box, theme toggle (Light / Dark / Auto).
- Heading anchors visible via `[¶]` symbol next to each H2/H3 — cleaner than the typical hover-only anchor pattern.

## Code + prose interleaving
- Almost no code. Diátaxis is a meta-framework, not a programming docs site — the content is all prose-and-diagram about how to organize content.
- One distinctive primitive: **the Diátaxis compass diagram** — a 2x2 grid showing tutorials (top-left), how-to (top-right), reference (bottom-right), explanation (bottom-left). The diagram appears on the landing and serves as the site's visual signature.

## Multi-format coexistence pattern
- The framework explicitly *prescribes* visual differentiation by quadrant. The site itself doesn't dramatically differentiate its own pages, because it's all "explanation" content — but it includes guidance on how implementers should make tutorials look different from reference.
- Inter-quadrant bridge pages exist: "Tutorials and how-to guides", "Reference and explanation" — these acknowledge that the boundary between adjacent quadrants is fuzzy and worth discussing explicitly.

## Visual hierarchy techniques
- Sphinx default theme with light customization. Sans-serif typography, generous whitespace, neutral palette.
- Horizontal rules between major sections (`---`) for visual rhythm.
- Pull-quote-styled practitioner quotes ("X uses Diátaxis at Y company...") establish social proof.
- The compass diagram is the visual centerpiece — repeated motifs throughout the site keep the reader oriented (which quadrant am I in, why does this matter).

## What's worth borrowing for claude-books
- **Adopt the framework explicitly.** Most production doc sites in this research set lean on Diátaxis without naming it. claude-books should name it: state in Volume 1's intro that each volume corresponds to specific quadrants. Volume 1 = tutorial + explanation (introductory). Volume 2 = how-to (workflows). Volume 3 = reference + explanation (architect-level). Explicit framing helps readers navigate.
- **The compass diagram as a recurring visual anchor** is a great idea — show readers which quadrant they're in on every chapter opener. Cheap to implement; high navigational value.
- **Bridge pages** between adjacent quadrants are a smart pattern. Books should have explicit "How tutorials and how-to guides differ" / "How reference relates to explanation" sections, especially in Volume 1, to set reader expectations.
- The "show H2/H3 anchors with `[¶]`" pattern is more discoverable than hover-only anchors and worth borrowing.

## What to avoid
- The Sphinx default theme is fine but unremarkable — the framework's *content* is the value, not its visual presentation. claude-books shouldn't model its visual register on Diátaxis the site; it should model its IA on Diátaxis the framework.
- Diátaxis sometimes argues for strict quadrant separation that may be hard to maintain in practice. A book chapter often mixes tutorial-shaped intro with reference-shaped middle and explanation-shaped conclusion — that's fine; just be aware which mode each section is in.

## Quoted (citation-ready)

> "Diátaxis identifies four distinct kinds of documentation - tutorials, how-to guides, technical reference and explanation - and recommends that they be kept separate."
>
> — Diátaxis, framework summary (paraphrased from site framing)
>
> Anchor: `framework summary + Diátaxis identifies four distinct kinds of documentation`

> "The compass"
>
> — Diátaxis, navigation item title for the 2x2 diagram pivot
>
> Anchor: `navigation item + The compass`

## Cross-references
- See [[site-astro-docs]] for the doc site that most faithfully implements Diátaxis as top-nav pivots (Tutorial / Guide / Reference / Ecosystem).
- See [[site-react-dev]] for a clean two-mode (Learn / Reference) reduction of the four quadrants.
- See [[site-cloudflare-docs]] for explicit content-type badges on every page — another Diátaxis-aware approach.
- See [[site-linear-method]] for the "single quadrant = single surface" Linear-style approach (Method = pure explanation, no other quadrants).
- See the topic README for the cross-site synthesis (Diátaxis is the most-cited framework across the research).
