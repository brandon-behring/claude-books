---
source_url: https://designingfortheweb.co.uk/
canonical_url: https://designingfortheweb.co.uk/
source_title: "A Practical Guide to Designing for the Web"
fetched_at: 2026-05-23
last_verified_at: 2026-05-23
topic: pedagogy-info-design
tier: T1-official
cert_domains: []
cert_task_areas: []
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# A Practical Guide to Designing for the Web (Boulton)

## Author + context

- **Mark Boulton**, *A Practical Guide to Designing for the Web*, Five Simple Steps (publisher Boulton co-founded), 2009. Boulton is a Welsh designer who worked on the BBC, CERN, and the Drupal redesign; founded the "Five Simple Steps" series with the eponymous "5 Steps" formula adapted to typography, grids, color, etc. The companion blog series — "Five Simple Steps to Better Typography" and "Five Simple Steps to Designing Grid Systems" — are extensively cited as the practical-typography canon for screen reading.
- For long-form technical content, Boulton's contribution is the *grid system* idea applied to documents (not just visual layouts): the underlying structural skeleton that gives prose its rhythm. Companion to Tufte ([[book-tufte-visual-display]] for content density) and Krug ([[book-krug-dont-make-me-think]] for reader behavior).

## Core thesis / principles

- **Design is communication**. Boulton: "Typography to me is about design. It's about words and the conveying of meaning. It's about setting words that people read." Typography is not aesthetic ornament; it's the load-bearing structure of how prose communicates.
- **Visual hierarchy is achieved with two primary tools — size and weight**. Color and position are secondary; size and weight are the levers that scale across all media. A heading is "more important" because it's bigger and bolder — and that visual hierarchy must match the logical hierarchy of the content.
- **Humans recognize order**. "Humans are pattern-recognizable machines; humans recognize order. Grid systems can help create such order." A grid system doesn't constrain creativity — it answers the boring questions (where do folios go, how wide is the measure) so the designer focuses on the interesting ones.
- **Five grid families**: **Columnar** (blog-style), **Hierarchical** (single-column with prominent header), **Modular** (grid of equal cells, like iPad apps), **Baseline** (vertical rhythm anchored to line-height), and **Compound** (a base grid with sub-grids). Each is suited to different content shapes.
- **The Measure** (line length): one of the most overlooked typography choices. Too wide and the reader loses the next line; too narrow and the rhythm breaks. The classical range is 45–75 characters per line.
- **White space is content**. "Plenty of white space to 'hang' a number of design elements." White space is what lets the eye separate one element from another; it's not "empty" — it's an active design choice.

## Concrete techniques recommended

- **Establish a baseline grid first**. Pick a line-height; every other vertical measurement (heading spacing, paragraph spacing, list spacing) snaps to a multiple of it. The page reads as rhythmic rather than ad-hoc.
- **Two-level typographic hierarchy minimum**. Body text + one heading level isn't enough; reasonable docs need at least three sizes (body, sub-heading, section heading) to support scanning.
- **Match grid to content shape**. A reference doc with many parallel entries → modular grid. A long-form essay → columnar with hierarchical sub-grid for asides. A landing page → hierarchical grid with one dominant element.
- **Use a system, not ad-hoc choices**. "Design of a website should be a system." Every choice should be derivable from a small set of rules; one-off exceptions break the reader's pattern recognition.
- **Hang punctuation outside the measure** (a typography refinement that improves line-end alignment for quotes, em-dashes, etc.).
- **Constrain font choices ruthlessly**. Boulton typically uses one face for body and one for display; rarely more than two families per design.

## Applicable to claude-books pedagogy

- **Markdown gives us a baseline grid for free** (line-height is enforced by the renderer). The leverage we have is in *consistent heading hierarchy* and *consistent emphasis use* across the cache — which the existing template provides.
- **Per-source notes use a hierarchical grid**: one H1 (title), several H2s (Core thesis / Concrete techniques / Quoted / Cross-references) — the visual rhythm comes from the parallel structure, not from heading depth.
- **The 7-column dossier table is a modular grid**: equal-width cells across many rows, supporting horizontal comparison. Boulton's prediction: modular grids excel at parallel-comparable content — which is exactly what dossiers are.
- **Boulton's "humans recognize order" justifies the convention work in `claude-books`**: identical frontmatter shape, identical heading sequence, identical cross-reference syntax. The reader learns the pattern once and then never has to think about *form* again — all cognitive budget goes to *content*. Cf. Krug's "conventions are virtues" ([[book-krug-dont-make-me-think]]).
- **The Measure applies to code blocks too**. Long lines wrap awkwardly in narrow renderings; break at ~80 characters so the eye doesn't lose its place.
- **"Design is communication"** = the docs analog: every formatting choice should serve comprehension. A bullet list because the items are parallel; a heading because the section is logically distinct; bold for first occurrences of terms. No formatting choice should be aesthetic-only.

## Quoted (citation-ready)

> "Typography to me is about design. It's about words and the conveying of meaning. It's about setting words that people read. A certain amount of it is creative, a certain amount is expression and aesthetics, but mostly it's about people reading stuff."
>
> — Boulton, "Five Simple Steps to Better Typography," opening
>
> Anchor: `Better Typography + Typography to me is about design`

> "Typographic hierarchy is how different faces, weights and sizes of typefaces structure a document."
>
> — Boulton, "Five Simple Steps to Better Typography, Part 4 (Hierarchy)"
>
> Anchor: `Hierarchy + Typographic hierarchy is how different faces, weights and sizes`

> "Humans are pattern-recognizable machines, humans recognize order. Grid systems can help create such order."
>
> — Boulton, "Five Simple Steps to Designing Grid Systems"
>
> Anchor: `Designing Grid Systems + Humans are pattern-recognizable machines`

## Cross-references

- See [[book-krug-dont-make-me-think]] for the user-side justification: scanning readers depend on visual hierarchy to navigate.
- See [[book-tufte-envisioning-information]] for layering — the visual rendering of hierarchy *within* a single page; Boulton's grids are the structural skeleton.
- See [[nng-f-shaped-pattern]] for the eyetracking data that proves visual hierarchy actually directs attention.
- See [[framework-cognitive-load]] for the cognitive basis of pattern recognition Boulton invokes.
- See [[framework-diataxis]] for IA — Boulton's grids organize *visual* space; Diátaxis organizes *content* space.
