---
source_url: https://linear.app/method
canonical_url: https://linear.app/method
source_title: "Linear Method"
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

# Linear Method — UX + visual presentation patterns

## Site context
- Linear's "method" site is a separate content surface from product docs. It's a manifesto-style essay collection on building software — the kind of artifact a tooling company publishes to crystallize its philosophy. Audience: prospective Linear customers, product/engineering leaders, anyone curious about Linear's worldview.
- Roughly book-shaped: an Introduction, "Direction" (4 chapters on strategy / prioritization), and "Building" (6 chapters on execution / launch). Numbered subsections (1.1, 2.1, 3.6) give it a printed-book feel. This is the closest production site to what a chapter of `claude-books` itself should feel like.

## Layout + IA observations
- Two-column layout: a wide primary column for long-form essays, a narrow secondary column with sidebar TOC showing section numbers + names. The right rail is *not* an "in this article" anchor list — it's the **whole-book TOC**, persistent across pages. Different choice from Stripe / Tailwind.
- Top navigation is the standard marketing-site Linear chrome (product / features / company links). No global search on the Method site itself.
- Footer links to changelog, blog, and product surfaces — Method is presented as one branch of a larger content tree.

## Code + prose interleaving
- Essentially no code. Method is pure long-form essay; code-adjacent topics (CI workflows, integration patterns) get hand-waved into prose rather than rendered as snippets.
- This is one of the few professional doc-adjacent surfaces in the bibliography that's text-only, and worth borrowing from precisely *because* it proves you can publish "serious technical content" with no code blocks at all.

## Multi-format coexistence pattern
- Single content type — the chapter essay. No "how-to vs reference" tension to resolve because reference work happens on docs/, API work happens on developers/. Method gets to be one register only.
- The clean separation is itself a pattern: instead of mixing tutorials + reference + explanation on one site, Linear hard-walls each into its own domain. Method = explanation. Docs = how-to. Developers = reference. Diátaxis quadrants get one URL each.

## Visual hierarchy techniques
- Serif or near-serif typography for headings (printed-book signal) with neutral sans-serif body. Numbered chapter subheadings (1.1, 2.1, 3.6) instead of named anchors.
- Generous whitespace; long line measures (essay-readable, not docs-density).
- Restrained palette: high-contrast monochrome with maybe one accent color for inline links.
- No icons inside the prose body — illustration restraint mirrors the writing voice.
- Each chapter opens with a short pull-quote-style framing line; the homepage opens with "There is a lost art of building true quality software."

## What's worth borrowing for claude-books
- Hard separation of registers — Linear proves you can keep how-to and explanation in entirely different visual surfaces and let readers pick the lane.
- The whole-book TOC as right rail (rather than per-page "in this article") is the right pattern for a book read sequentially. Readers want to know where they are in the larger arc, not which subheading they're under right now.
- Numbered subheadings (1.1, 1.2, 2.1) give a printed-book feel and make cross-references between chapters precise. Worth borrowing for chapter-level navigation.
- Essay-style line length (~70-75ch) instead of docs-style (~90ch+) is appropriate when the content is mostly prose. The wide-code-panel Stripe model breaks down when there isn't much code.

## What to avoid
- The single-register choice means Linear's Method site can't host tutorials or reference. For claude-books, where chapter content mixes explanation with concrete Claude Code workflows, you can't go fully Method — you'll need code blocks, callouts, and stepwise sections.
- No global search on Method is a calculated risk — the site is small enough that browsing works. A book with 50+ chapters across 3 volumes needs search.

## Quoted (citation-ready)

> "There is a lost art of building true quality software."
>
> — Linear Method, homepage hero
>
> Anchor: `homepage hero + There is a lost art of building`

> "Principles & Practices"
>
> — Linear Method, opening section title
>
> Anchor: `opening section title + Principles & Practices`

## Cross-references
- See [[site-linear-docs]] for the product-docs counterpart — same brand, different visual register.
- See [[site-diataxis]] for the framework Linear's content separation effectively follows.
- See the topic README for the cross-site synthesis (Method is the clearest "essay-book on the web" reference).
