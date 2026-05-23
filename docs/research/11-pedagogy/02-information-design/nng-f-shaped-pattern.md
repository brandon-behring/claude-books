---
source_url: https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
canonical_url: https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
source_title: "F-Shaped Pattern of Reading on the Web"
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

# F-Shaped Pattern of Reading on the Web (NN/g)

## Author + context

- **Kara Pernice**, NN/g, originally identified by Jakob Nielsen via eyetracking studies in 2006; the article has been updated multiple times (most recent ~2017 onward) to refute the claim that the F-pattern is "obsolete" — NN/g eyetracking confirms it persists. This article documents *what readers actually do* with unformatted text: they scan, not read, in a recognizable F shape. Companions [[nng-progressive-disclosure]] (what to put where) and [[book-krug-dont-make-me-think]] (the design-implication book) to form the modern "scanning-not-reading" canon.

## Core thesis / principles

- **The F-pattern has three movements**:
  1. **Horizontal scan** across the upper content area (top bar of the F)
  2. **Second horizontal movement** lower on the page, covering less distance (lower bar)
  3. **Vertical scan** down the left side of content (stem of the F)
- **First lines get more attention than subsequent lines**. The eyetracking observation: "First lines of text on a page receive more gazes than subsequent lines of text on the same page." The first words of each paragraph carry disproportionate weight.
- **Three preconditions for F-pattern scanning**:
  1. Text lacks web formatting (no bolding, no bullets, no subheadings)
  2. Users prioritize efficiency over thoroughness
  3. Users lack deep interest in *all* the content
- **The user's "fault" is not the user's fault**: "When writers and designers have not taken any steps to direct the user to the most relevant, interesting, or helpful information, users will then find their own path." The F-pattern is a *default* — what readers fall back to when given no guidance.
- **Right-side content gets skipped**. "Users may skip important content simply because it appears on the right side of the page." This is a hard constraint on layout.

## Concrete techniques recommended

- **Place crucial points in opening paragraphs and first sentences**. The "top bar of the F" gets the most attention; spend the budget on what matters.
- **Use prominent headings with information-rich first words**. "Setting up a webhook" beats "How you can get started with the webhook setup process." First words matter because they're what's read in the vertical scan.
- **Bold important phrases inline**. The F-pattern fails *when* formatting is absent; the cure is to add formatting that creates secondary entry points.
- **Use bullets and numbered lists**. Each bullet is a mini-paragraph with its own first-word weight; bulleted lists redistribute attention down the page in a way unformatted paragraphs cannot.
- **Make link text meaningful**. "Click here" gives no signal in a scan; "View the Skills directory" does.
- **Remove unnecessary content**. The F-pattern is partly a defense against information overload; reducing the corpus increases the per-item attention.

## Applicable to claude-books pedagogy

- **First-word load**: every section heading should start with the most distinctive content word, not a particle. "Hooks for security review" beats "Using hooks for security review."
- **Lead with the headline**. The first sentence of every section should state the section's claim outright. Readers scanning the F-stem only see the first ~5 words; if those don't carry the load, the reader bounces.
- **Bullets > prose for enumerable content**. The 7-column dossier tables in `claude-books` are F-pattern-friendly: column headers in the top bar, row headers in the stem, content scannable in a grid.
- **Right-side content is dead zone**. Single-column layouts dominate technical docs partly because of this; if a sidebar must exist, it should be labeled secondary, not load-bearing.
- **Headings every ~4-6 paragraphs**. Without them, a long prose run becomes one F-block, and the lower bar of the F drifts below the fold.
- **The dossier README's "Key takeaway (1 line)" column is F-pattern-optimized**: dense first-line summary for the reader who only scans the table.

## Quoted (citation-ready)

> "When users read content online, they often scan rather than read every word. The most common scan pattern is in the shape of an F."
>
> — Pernice, "F-Shaped Pattern of Reading on the Web," NN/g, opening
>
> Anchor: `F-Shaped Pattern + When users read content online, they often scan`

> "When writers and designers have not taken any steps to direct the user to the most relevant, interesting, or helpful information, users will then find their own path. Sometimes that path is in the shape of an F."
>
> — Pernice, "F-Shaped Pattern of Reading on the Web," NN/g, "Why" section
>
> Anchor: `Why + When writers and designers have not taken any steps to direct`

> "First lines of text on a page receive more gazes than subsequent lines of text on the same page."
>
> — Pernice, "F-Shaped Pattern of Reading on the Web," NN/g, "Eyetracking" section
>
> Anchor: `Eyetracking + First lines of text on a page receive more gazes`

## Cross-references

- See [[book-krug-dont-make-me-think]] for the design-implication treatment — Krug's "Billboard Design 101" is essentially a chapter on responding to the F-pattern.
- See [[nng-progressive-disclosure]] for how to redirect attention from the F-spine to a "second layer" the reader can explore.
- See [[nng-ia-vs-navigation]] for why the F-pattern dictates IA — readers' scanning behavior should shape what gets top-level placement.
- See [[book-tufte-visual-display]] for data-ink — the chart equivalent of removing unscanable noise.
