---
source_url: https://www.nngroup.com/articles/ia-vs-navigation/
canonical_url: https://www.nngroup.com/articles/ia-vs-navigation/
source_title: "Information Architecture vs Navigation"
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

# Information Architecture vs. Navigation (NN/g)

## Author + context

- **Page Laubheimer**, NN/g. NN/g's canonical treatment of *what IA is* vs *what navigation is* — a distinction that's load-bearing for technical documentation because most "navigation problems" in docs are actually IA problems pretending to be navigation problems. The article establishes that the IA is logical (taxonomy, relationships, naming); navigation is what surfaces some of it in the UI. Companions [[framework-diataxis]] (an opinionated IA for docs) and [[book-wurman-information-anxiety]] (Wurman's LATCH organizing schemes that underlie any IA).

## Core thesis / principles

- **IA is the backbone; navigation is the visible surface**. "IA is the information backbone of the site; navigation refers to those elements in the UI that allow users to reach specific information on the site."
- **IA is not part of the UI** — it informs the UI. "The information architecture (IA) is not part of the on-screen user interface (UI) — rather, IA informs UI." The IA exists in spreadsheets, sitemaps, and diagrams; navigation is the thin slice that gets rendered.
- **Two main IA components**:
  1. Identifying and defining site content and functionality (what's in the system)
  2. Establishing the underlying organization, structure, and naming conventions (how it relates)
- **Five core IA activities**:
  - Content inventory (locating existing content)
  - Content audit (evaluating its usefulness)
  - Information grouping (user-centered relationships)
  - Taxonomy development (standardized naming)
  - Descriptive metadata creation (discovery aids)
- **Foundational sequencing principle**: "Define the IA Before Designing Navigation." Doing it in the opposite order forces the IA to accommodate navigation choices made on aesthetic grounds — and the navigation always wins, distorting the IA.

## Concrete techniques recommended

- **Inventory before architecture**. List every piece of content that exists or needs to exist before deciding on groupings. Don't design the navbar first.
- **Card sorting** to discover user mental models. Give users content items and ask them to group; the groupings reveal the IA the user's brain expects.
- **Taxonomy = controlled vocabulary**. "Skills" should always be "Skills" — not sometimes "Plugins", sometimes "Extensions". One name per concept.
- **Test the IA independently of the UI**. Tree-testing tools let you validate that users can navigate the *logical* hierarchy before any visual design exists.
- **Metadata for findability**: tags, topics, cross-references — every content item should have enough metadata to be discovered through multiple paths, not just the single nav path.

## Applicable to claude-books pedagogy

- **`claude-books` has explicit IA work already**: the 10-topic research cache (`02-mcp-spec/`, `04-agent-sdk/`, etc.), the cert-domain taxonomy (D1–D5), the cert-task-areas array — these are IA artifacts that pre-exist any chapter's navigation. The chapters and TOCs are *navigation* over this IA.
- **Frontmatter is the IA layer**: `topic`, `cert_domains`, `cert_task_areas`, `tier`, `volatility`, `supersedes` form a controlled vocabulary that lets cross-cutting access (grep, dossier-build) bypass the linear chapter navigation.
- **Define the IA before designing the chapter TOC**. The research cache (`docs/research/`) was built before chapter outlines for exactly this reason — chapters are derived from the IA, not the other way around.
- **One name per concept**. The "hook count ~31" correction in the landscape doc is a controlled-vocabulary failure: "hook" meant different things in CLI vs Python SDK vs TS SDK. Fixed by separating the three counts (CLI: 29, Python: 10, TS: 19).
- **Cross-references as IA artifacts**: the `[[slug]]` syntax in research notes is the IA layer made navigable — readers can follow conceptual relationships rather than just linear order.

## Quoted (citation-ready)

> "IA is the information backbone of the site; navigation refers to those elements in the UI that allow users to reach specific information on the site."
>
> — Laubheimer, "IA vs Navigation," NN/g, opening
>
> Anchor: `IA vs Navigation + IA is the information backbone of the site`

> "The information architecture (IA) is not part of the on-screen user interface (UI) — rather, IA informs UI."
>
> — Laubheimer, "IA vs Navigation," NN/g, "What is IA" section
>
> Anchor: `What is IA + The information architecture (IA) is not part of the on-screen`

> "Define the IA Before Designing Navigation."
>
> — Laubheimer, "IA vs Navigation," NN/g, "Foundational Principle" section
>
> Anchor: `Foundational Principle + Define the IA Before Designing Navigation`

## Cross-references

- See [[framework-diataxis]] for an opinionated IA *specifically for technical documentation* — the only canonical IA framework that explicitly addresses docs.
- See [[book-wurman-information-anxiety]] for LATCH — the five fundamental organizing schemes any IA must choose from (Location, Alphabet, Time, Category, Hierarchy/Continuum).
- See [[nng-progressive-disclosure]] for the technique that lets an IA serve multiple audiences (primary surface for casual; secondary layer for deep).
- See [[book-tufte-envisioning-information]] for layering — the visual rendering of the IA the reader navigates.
- See [[book-krug-dont-make-me-think]] for the navigation-quality principle ("don't make me think") that IA enables.
