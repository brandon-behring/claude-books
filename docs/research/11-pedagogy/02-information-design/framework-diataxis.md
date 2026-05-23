---
source_url: https://diataxis.fr/
canonical_url: https://diataxis.fr/
source_title: "Diátaxis Framework"
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

# Diátaxis Framework

## Author + context

- **Daniele Procida**, originally formulated while at Divio (Python community), now maintained at `diataxis.fr`. Adopted by major projects including Cloudflare, Gatsby, Vonage, Django, NumPy, and many others. The most influential modern IA framework *specifically for technical documentation* — the only canonical answer to "how should we organize a docs site?" at the type-of-document level. Complements general IA work ([[nng-ia-vs-navigation]], [[book-wurman-information-anxiety]]) by being opinionated and prescriptive for a specific medium.
- The name "Diátaxis" is Greek (διάταξις) for "arrangement" or "order" — chosen deliberately as a non-English term to avoid baggage from existing IA vocabulary.

## Core thesis / principles

- **Technical documentation has exactly four kinds**, each with a different *purpose* and a different *user mode*. Mixing them in a single document is the most common docs failure.
  1. **Tutorials** — learning-oriented. "Practical lessons where users learn by doing under guidance." A novice should be able to follow along and acquire skill. Like a child's first cooking class.
  2. **How-to guides** — task-oriented. "Practical directions addressing real-world problems for competent users." Assumes the reader knows the basics; gives concrete steps for a specific goal. Like a recipe.
  3. **Reference** — information-oriented. "Technical descriptions providing accurate, complete, neutral information. Reference guides contain the technical description — facts — that a user needs in order to do things correctly without interpretation or distraction." Like a dictionary or an API spec.
  4. **Explanation** — understanding-oriented. "Contextual background answering 'why?' questions. Serves understanding rather than action, often approaching subjects from multiple angles." Like an essay or a discussion.
- **Two-axis grid** distinguishes the four. The framework's diagram is the canonical reference:
  - **Action vs. cognition**: tutorials and how-to are *action-oriented*; reference and explanation are *cognition-oriented*.
  - **Acquisition vs. application**: tutorials and explanation serve *acquisition* (study mode); how-to and reference serve *application* (work mode).
- **The four modes are non-substitutable**. A tutorial cannot also be a reference; an explanation cannot also be a how-to. Each mode serves a *different reader state* — confusing the mode confuses the reader.
- **The framework is pragmatic, not theoretical**. "Diátaxis doesn't require a commitment to pursue it to a final end." Users gain value by identifying one improvement at a time in existing documentation, rather than restructuring everything.

## Concrete techniques recommended

- **Audit existing docs by mode**: for each doc page, ask "is this a tutorial, how-to, reference, or explanation?" If it's "all four," split it. If it's "none of the four," delete or repurpose it.
- **Separate the four into separate sections of the site**. Modes should be *visually* separate so the reader's mental mode-switch is supported.
- **Cross-link between modes, don't fuse**. A tutorial mentioning a concept should link to the explanation; a how-to needing a specific API should link to the reference. Don't inline the other mode's content into the body.
- **Mode-appropriate writing style**:
  - Tutorial: friendly, narrative, second-person ("you do X, then you see Y").
  - How-to: imperative, procedural, goal-anchored ("To do X, follow these steps").
  - Reference: neutral, exhaustive, structured ("Returns a String. Parameters: ..."). No tutorialization.
  - Explanation: discursive, multi-angle, third-person ("This works because...").
- **Start where the docs are weakest**, not where they're most complete. The framework's biggest payoff is in unblocking the missing mode.

## Applicable to claude-books pedagogy

- **The three-volume `claude-books` series can be mapped to Diátaxis modes**:
  - **Handbook** ≈ Tutorial + Explanation (skill acquisition, narrative-driven; explains the *why* of agent design).
  - **Field Guide** ≈ How-to (task-oriented; specific real-world problems solved).
  - **Architect's Reference** ≈ Reference + some Explanation (exhaustive, neutral, structured; the deep dive for the cert-prep reader).
- **Chapter-level mode discipline**: within a chapter, identify which mode dominates and keep the others as cross-links. A Handbook chapter on Hooks should not also be an exhaustive reference for every hook field — that belongs in the Architect's Reference.
- **The research cache itself is *reference***. The per-source notes are reference for a specific source; the topic READMEs are explanation; the chapter drafts will be tutorial/how-to. The cache's job is to be exhaustive and neutral, *not* to teach — teaching happens in the books.
- **Diátaxis predicts a specific failure mode `claude-books` should avoid**: a chapter that opens with a tutorial example, drifts into a how-to halfway through, lists reference tables in the middle, and ends with explanation. Readers can't track the mode-switch. The remedy: pick one dominant mode per chapter, cross-link the others.
- **Procida's "audit by mode" technique** is directly applicable as a chapter-draft QA pass: read each section, label its mode, flag inconsistencies.

## Quoted (citation-ready)

> "Diátaxis prescribes approaches to content, architecture and form that emerge from a systematic approach to understanding the needs of documentation users."
>
> — Procida, *Diátaxis*, "Start Here"
>
> Anchor: `Start Here + Diátaxis prescribes approaches to content, architecture and form`

> "Tutorials are lessons. They are learning-oriented. ... How-to guides are recipes. They are goal-oriented. ... Reference guides are technical descriptions. They are information-oriented. ... Explanation is discussion. It is understanding-oriented."
>
> — Procida, *Diátaxis*, "The four kinds of documentation"
>
> Anchor: `The four kinds + Tutorials are lessons`

> "Reference guides contain the technical description — facts — that a user needs in order to do things correctly without interpretation or distraction."
>
> — Procida, *Diátaxis*, "Reference"
>
> Anchor: `Reference + Reference guides contain the technical description`

> "Diátaxis became our north star for information architecture."
>
> — Cloudflare developer-documentation team, quoted on `diataxis.fr`
>
> Anchor: `Cloudflare + Diátaxis became our north star`

## Cross-references

- See [[nng-ia-vs-navigation]] for the general IA principles Diátaxis specializes for docs.
- See [[book-wurman-information-anxiety]] for LATCH — the five universal organizing schemes Diátaxis's four-mode taxonomy partially inhabits (it's a Category scheme with a specific 4-class taxonomy).
- See [[nng-progressive-disclosure]] for the technique within each Diátaxis mode (a reference page can use progressive disclosure inside the mode; a tutorial cannot, because tutorials need linear progression).
- See [[book-krug-dont-make-me-think]] for the satisficing-reader behavior Diátaxis defends against (readers committed to "tutorial mode" don't want to be ambushed by reference content).
- See [[book-tufte-envisioning-information]] for layering — the visual analog of mode separation at the page level.
