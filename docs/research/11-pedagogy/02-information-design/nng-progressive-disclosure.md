---
source_url: https://www.nngroup.com/articles/progressive-disclosure/
canonical_url: https://www.nngroup.com/articles/progressive-disclosure/
source_title: "Progressive Disclosure"
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

# Progressive Disclosure (NN/g)

## Author + context

- **Jakob Nielsen**, Nielsen Norman Group, originally published 2006 (multiple revisions since). NN/g is the most-cited usability research firm; Nielsen literally wrote the 1994 textbook on heuristic evaluation that's still the reference for "10 usability heuristics." For information design, this article is the canonical formulation of *the technique* that lets dense applications stay learnable — defer rare options to a second layer that the reader/user can summon. The prose analog is folded subsections, "advanced" callouts, and expandable details — and crucially, *what NOT to put in the primary surface*.
- The article companions other NN/g pieces ([[nng-f-shaped-pattern]] for scanning, [[nng-ia-vs-navigation]] for hierarchy) that together define the modern usability-design view of how to present information without overwhelming readers.

## Core thesis / principles

- **Defer rarely used features to a second screen**. "Initially, show users only a few of the most important options. Offer a larger set of specialized options upon request." This is the core mechanism; everything else is implementation.
- **Two critical design requirements**:
  1. **Correct feature split**: "You must get the right split between initial and secondary features. You have to disclose everything that users frequently need up front."
  2. **Obvious progression**: "It must be obvious how users progress from the primary to the secondary disclosure levels" — through clear UI mechanics and informative labeling.
- **Three usability gains**: improves *learnability* for novice users, *efficiency* for advanced users, and *lower error rates* — all three simultaneously, which is rare in design tradeoffs.
- **Two-level limit**: "Designs exceeding two disclosure levels typically fail. Multiple levels create navigation confusion and usability problems." This is a hard ceiling, not a soft guideline.
- **Distinguished from staged disclosure (wizards)**: a wizard is *linear* (step 1 → step 2 → step 3); progressive disclosure is *hierarchical* (primary screen + on-demand secondary). Wizards work for sequenced tasks; progressive disclosure works for "most users do A, some users need B."

## Concrete techniques recommended

- **"Show advanced options" affordances**: print dialogs are the canonical UI example — basic options visible; "Advanced" button reveals scaling, reverse printing, and dozens of rarely-used controls.
- **Default to the common case**. The primary surface should serve the 80% of users; the secondary surface serves the 20% who need the advanced view.
- **Always-visible toggle to expand all**. "It must be obvious how users progress" means there should be a clear, labeled control for "show more" — not a hidden gesture.
- **Names matter**: "Advanced options" is OK; "More" is not — "More" gives the user no information about what they'll find behind it.
- **Stay at two levels**. If you have a third level emerging, the IA is wrong; restructure.

## Applicable to claude-books pedagogy

- **Prose progressive disclosure**: each chapter should have a primary surface (the body) and one (and only one) secondary layer — callouts, "deeper dive" boxes, footnotes, or appendix references. Three nested levels of "this is also worth knowing" is too many.
- **The "core 80% of readers" gate**: every body paragraph should be load-bearing for the median reader's learning. If only 20% of readers need it, push to a callout or footnote. (The user's stated principle is the prose analog of this: "big picture for everyone, drill-down for those who want it.")
- **"Advanced options" → "Going deeper" callouts**. Standard pattern: a labeled box that the reader can mentally bypass on a first pass and return to on a second pass. NN/g's principle: it must be *obviously* a secondary layer — not buried inline with the body prose.
- **Reference docs should *also* be progressive**. The 7-column dossier tables in `claude-books` (`dossier-build` skill) are a primary-surface artifact; per-source notes are the secondary-disclosure layer the reader can drill into.
- **Two-level limit applies to nested skill/agent docs too**: if a SKILL.md or agent prompt has three nested "for advanced users" sections, the agent itself is over-scoped.

## Quoted (citation-ready)

> "Progressive disclosure defers advanced or rarely used features to a secondary screen, making applications easier to learn and less error-prone. Initially, show users only a few of the most important options. Offer a larger set of specialized options upon request."
>
> — Nielsen, "Progressive Disclosure," NN/g, opening section
>
> Anchor: `Progressive Disclosure + defers advanced or rarely used features`

> "You must get the right split between initial and secondary features. You have to disclose everything that users frequently need up front. ... It must be obvious how users progress from the primary to the secondary disclosure levels."
>
> — Nielsen, "Progressive Disclosure," NN/g, "Design Principles" section
>
> Anchor: `Design Principles + You must get the right split between initial and secondary`

> "Designs exceeding two disclosure levels typically fail. Multiple levels create navigation confusion and usability problems."
>
> — Nielsen, "Progressive Disclosure," NN/g, "Warning" section
>
> Anchor: `Warning + Designs exceeding two disclosure levels typically fail`

## Cross-references

- See [[nng-f-shaped-pattern]] for what readers do when *all* content is on one surface (they scan; they miss everything not on the F-spine).
- See [[nng-ia-vs-navigation]] for the IA underlying progressive disclosure — you can't defer to a second layer unless you've decided which features belong where.
- See [[book-tufte-envisioning-information]] for layering — the visual-design analog of progressive disclosure (encoding hierarchy *within* one surface rather than across two).
- See [[framework-diataxis]] for IA — tutorials vs reference is itself a kind of progressive disclosure (newcomers stay on tutorials; experts go to reference).
- See [[book-krug-dont-make-me-think]] for satisficing — the behavior that makes progressive disclosure work (readers won't dig past the primary surface unless visibly invited).
