---
source_url: https://sensible.com/dont-make-me-think/
canonical_url: https://sensible.com/dont-make-me-think/
source_title: "Don't Make Me Think, Revisited"
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

# Don't Make Me Think, Revisited (Krug)

## Author + context

- **Steve Krug**, *Don't Make Me Think: A Common Sense Approach to Web Usability* (2000); *Don't Make Me Think, Revisited* (3rd ed., 2014). Krug is a usability consultant who distilled NN/g-style research into a practitioner-readable book that's been the field's default "first usability text" for two decades. For information design, *DMMT* is the canonical formulation of *what to optimize for* when readers scan rather than read — the user-behavior treatment that complements NN/g's design-implication treatment ([[nng-progressive-disclosure]], [[nng-f-shaped-pattern]]).
- The book is famously short (≈200 pages) and practitioner-focused; the principles transfer almost directly to long-form technical documentation despite the book's web-UI framing.

## Core thesis / principles

- **Three "Facts of Life" of how users use the web**:
  1. **We Don't Read Pages. We Scan.** Users do not read; they look for things that match their goal.
  2. **We Don't Make Optimal Choices. We Satisfice.** "Most of the time we don't choose the best option — we choose the first reasonable option, a strategy known as satisficing." Users commit to a path early and back out only when it fails.
  3. **We Muddle Through.** Users don't read instructions; they guess at affordances and try things.
- **The titular principle**: "Don't make me think." Users should never have to expend cognitive effort on figuring out the *interface* — all cognition should be available for the underlying task. Anywhere the user pauses to figure out "what does this mean?" is a design failure.
- **Billboard Design 101**: Chapter 3 of the book — designing for scanning, not reading. The page should function like a billboard the reader can absorb in a second.
- **Convention is a virtue, not a sin**. "As a rule, conventions only become conventions if they work." Don't reinvent the navigation pattern; readers have already learned the convention and you save them the cognitive load.
- **Happy talk must die**. Boilerplate introductory text that says nothing ("Welcome to our site! We are excited to bring you...") destroys the F-pattern's top-bar attention budget.

## Concrete techniques recommended

- **Eliminate instructions wherever possible**. "Your objective should always be to eliminate instructions entirely by making everything self-explanatory, or as close to it as possible. When instructions are absolutely necessary, cut them back to a bare minimum."
- **Visual hierarchy must match logical hierarchy**. If "Section A" is more important than "Section B," it should *look* more important — bigger, bolder, or earlier on the page.
- **Break pages into clearly defined areas**. Each area should announce its function visually.
- **Make obvious what's clickable** (or in prose: what's a link, what's a heading, what's code, what's body).
- **Format text to support scanning**: headings, short paragraphs, bulleted lists, highlighted key terms.
- **Omit needless words** (a quote from Strunk & White that Krug uses verbatim — see his version: "Get rid of half the words on each page, then get rid of half of what's left").
- **Each click should be mindless**: "It doesn't matter how many times I have to click, as long as each click is a mindless, unambiguous choice." (Refutes the "rule of three clicks" — depth is fine; *thinking* is the problem.)

## Applicable to claude-books pedagogy

- **The user's "big picture → drill down" principle is exactly satisficing-aware design**. Readers commit early; if the first paragraph doesn't deliver the macro picture, the reader leaves before they reach the drill-down. The macro must be the first thing.
- **Happy talk has a docs analog**: "In this section, we will discuss..." (just discuss it). "Before we begin, it's important to note..." (just note it). Cut these openings — they waste the F-pattern's top-bar budget.
- **"Get rid of half the words" applies to research-cache notes too**. The 7-column dossier tables enforce this naturally; the per-source notes can drift toward over-elaboration. Aim for signal-words ratio (cf. Tufte's data-ink ratio in [[book-tufte-visual-display]]).
- **Mindless clicks → mindless navigation in docs**. Cross-reference links should announce what they point to ("see [[course-claude-101]] for the consumer-facing onboarding course") not "see here" or "more info."
- **Visual hierarchy = Markdown heading hierarchy**. H1 > H2 > H3 should match the actual importance hierarchy. Do not use H2 for emphasis where H3 is logically correct.
- **Conventions across the cache**: `[[slug]]` links, frontmatter shape, `Quoted` / `Cross-references` headings — these are conventions the reader learns *once* and then never has to think about again. Inventing a new format per note would burn cognitive budget.

## Quoted (citation-ready)

> "We don't read pages. We scan them."
>
> — Krug, *Don't Make Me Think*, Chapter 2 ("How We Really Use the Web")
>
> Anchor: `How We Really Use the Web + We don't read pages. We scan them.`

> "In reality, though, most of the time we don't choose the best option — we choose the first reasonable option, a strategy known as satisficing."
>
> — Krug, *Don't Make Me Think*, Chapter 2 ("How We Really Use the Web")
>
> Anchor: `Satisficing + most of the time we don't choose the best option`

> "Your objective should always be to eliminate instructions entirely by making everything self-explanatory, or as close to it as possible. When instructions are absolutely necessary, cut them back to a bare minimum."
>
> — Krug, *Don't Make Me Think*, Chapter 8 ("The Farmer and the Cowman Should Be Friends")
>
> Anchor: `Eliminate instructions + Your objective should always be to eliminate`

> "Get rid of half the words on each page, then get rid of half of what's left."
>
> — Krug, *Don't Make Me Think*, Chapter 5 ("Omit Needless Words")
>
> Anchor: `Omit Needless Words + Get rid of half the words on each page`

## Cross-references

- See [[nng-f-shaped-pattern]] for the eyetracking research that underlies Krug's "we scan, we don't read."
- See [[nng-progressive-disclosure]] for the mechanism Krug's "Billboard Design" relies on (defer detail to a secondary surface).
- See [[book-tufte-visual-display]] for the data-ink-ratio principle — the chart-and-table analog of Krug's "omit needless words."
- See [[framework-cognitive-load]] for the underlying cognitive-science basis of "don't make me think" (extraneous load reduction).
- See [[book-wurman-information-anxiety]] for the IA the satisficing reader is navigating — Krug's principles assume Wurman's organizing schemes are sound.
