---
source_url: https://www.amazon.com/Information-Anxiety-2-Richard-Wurman/dp/0789724103
canonical_url: https://en.wikipedia.org/wiki/Richard_Saul_Wurman
source_title: "Information Anxiety (LATCH / 5 Hat Racks)"
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

# Information Anxiety — LATCH / 5 Hat Racks (Wurman)

## Author + context

- **Richard Saul Wurman**, *Information Anxiety* (1989) — also revised as *Information Anxiety 2* (2000). Wurman coined "information architect" as a job title in 1976 and founded the TED conferences in 1984. *Information Anxiety* is the foundational text on the *problem* of dense information (the anxiety of not being able to organize what one has) and the *solution* (the LATCH organizing schemes). For long-form technical content, LATCH is the canonical answer to "how can a dense corpus be organized at all?" — Wurman's answer: there are exactly five ways. The taxonomy is also called the "5 Hat Racks" in design-pattern literature.
- Wurman is the upstream source for IA-as-a-discipline. NN/g's [[nng-ia-vs-navigation]] is the modern usability-research treatment; Wurman is the original philosopher.

## Core thesis / principles

- **Information may be infinite, but the *ways* of organizing it are finite — there are exactly five**. LATCH = **L**ocation, **A**lphabet, **T**ime, **C**ategory, **H**ierarchy. (The "H" is sometimes given as "Continuum" in later editions; the underlying idea — ordering by magnitude — is the same.)
- **L — Location**: organize by physical or spatial reference. Maps, floor plans, body diagrams. Best when the *where* is what the reader needs.
- **A — Alphabet**: organize by alphabetical sequence. Dictionaries, indexes, phone books. Best when readers know the *name* of what they're looking for but not its category.
- **T — Time**: organize by chronological sequence. Histories, timelines, schedules, changelogs. Best when readers need *when* — and when sequence carries meaning.
- **C — Category**: organize by similarity or relatedness. Library Dewey decimal, biology taxonomy, web "topics." Best when readers know the *kind* but not the specific instance.
- **H — Hierarchy / Continuum**: organize by magnitude or rank. Tallest buildings, biggest economies, hottest peppers. Best when readers want to *compare by quantity*.
- **The anxiety thesis**: "Information anxiety" is the gap between data we receive and what we understand. Dense, unorganized information creates anxiety; LATCH is the cure because *every* organizing scheme reduces to one of the five (or a hybrid).

## Concrete techniques recommended

- **Pick one primary scheme per dataset**. Mixing all five at once is the failure mode. A reference doc is *primarily* C (category) with an A (alphabet) secondary index.
- **Multi-axis access for the same data**. The same content corpus can be organized by C in one view and A in another — readers choose the entry point. The 7-column dossier tables in `claude-books` are C-organized; the cert-domain index is C with sub-grouping; the per-source frontmatter `tier` is H (continuum from T1 to T3).
- **The "Five Hat Racks" naming**: useful when the audience is design-literate but not IA-literate. "Hat racks" because each scheme is a *peg* you can hang a piece of information on — the question is which peg organizes the *whole collection* best.
- **Honor the reader's mental model**. If readers think alphabetically (e.g., API references), force-fitting category will fail; if readers think by category (e.g., conceptual overviews), forcing alphabet will fail.
- **Time + Category is the most common hybrid**. Changelogs (T) within a topic (C); release notes (T) by feature area (C). Recognize hybrids explicitly rather than letting them emerge accidentally.

## Applicable to claude-books pedagogy

- **The `claude-books` topic structure is Category-primary** (10 topics: Academy, MCP, Tool Use, SDK, API, Multi-agent, etc.) **with Hierarchy-secondary** (tier: T1, T2, T3 within each topic).
- **Cert-domain access (D1–D5) is a Category re-grouping**: same corpus, different organizing scheme. Readers approaching from cert-prep get a C-by-domain view; readers approaching from a topic get a C-by-product view.
- **`volatility: fast-moving | evolving | stable` is a Continuum (H) classifier**. Same notes, ranked-by-decay-rate.
- **`last_verified_at` is Time-organized metadata** the reader can use to filter by recency.
- **The frontmatter taxonomy is explicit LATCH**: `topic` = C, `cert_domains` = C-alternative, `tier` = H, `volatility` = H, `last_verified_at` = T. Wurman's prediction: any organizing scheme will reduce to these — and `claude-books` does.
- **Chapter ordering will be a hybrid**. Likely T (newcomer → expert progression) + C (topic per chapter) — and that's *fine* if it's explicit.

## Quoted (citation-ready)

> "Information may be infinite, however… The organization of information is finite as it can only be organized by LATCH: Location, Alphabet, Time, Category, or Hierarchy."
>
> — Wurman, *Information Anxiety* (1989), introducing LATCH
>
> Anchor: `LATCH + Information may be infinite, however`

> "Information anxiety is produced by the ever-widening gap between what we understand and what we think we should understand."
>
> — Wurman, *Information Anxiety* (1989), opening thesis
>
> Anchor: `Opening thesis + Information anxiety is produced by the ever-widening gap`

> "Each strategy describes organization by Location (geographic or spatial reference), Alphabet (alphabetical sequence), Time (chronological sequence), Category (similarity or relatedness), and Continuum (orders of magnitude)."
>
> — Wurman, *Information Anxiety 2* (2000), LATCH expanded
>
> Anchor: `LATCH expanded + Each strategy describes organization by Location`

## Cross-references

- See [[nng-ia-vs-navigation]] for the modern IA treatment that builds on Wurman's foundation.
- See [[framework-diataxis]] for an opinionated *Category*-primary IA specifically for technical documentation (the four-mode taxonomy is itself a LATCH-C application).
- See [[book-tufte-envisioning-information]] for the rendering layer — how to *display* an IA the reader is navigating.
- See [[nng-progressive-disclosure]] for the mechanism that lets a category-organized IA serve novices and experts at the same surface.
