---
source_url: https://martinfowler.com/articles/refactoring-2nd-ed.html
canonical_url: https://martinfowler.com/articles/refactoring-2nd-ed.html
source_title: "Refactoring: Improving the Design of Existing Code (2nd ed.) — Martin Fowler"
fetched_at: 2026-05-23
last_verified_at: 2026-05-23
topic: pedagogy-handbook-genre
tier: T2-release-notes
cert_domains: []
cert_task_areas: []
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Refactoring (Fowler, 2nd ed.) — handbook structure analysis

The defining "all-catalog" handbook — a book where the bulk of the value is in a uniformly-templated reference catalog of recipes, with a thin instructional shell. The most modular structure in the genre; an essential template for the back half of claude-books Volume 3 (Architect's Reference).

## Author + context

- **Author**: Martin Fowler (ThoughtWorks chief scientist; the most-cited authority on refactoring as a discipline).
- **Publisher**: Addison-Wesley (Signature Series); 1st ed. 1999 (with Beck, Brant, Opdyke, Roberts), 2nd ed. November 2018 (Fowler solo). ISBN 9780134757599.
- **Audience**: Working programmers maintaining existing codebases — the explicit framing is "improving the design of EXISTING code".
- **Position**: Defined "refactoring" as an industry-standard term; Bumblebee mascot is iconic. The 2nd edition switched code examples from Java to JavaScript (ES6) to broaden reach.

## Macro structure

- **Two halves**:
  - **Instructional shell** (Chapters 1–4, ~100 pages):
    - Ch 1: Refactoring: A First Example (the canonical movie-rental case study)
    - Ch 2: Principles in Refactoring
    - Ch 3: Bad Smells in Code (catalog of code smells)
    - Ch 4: Building Tests
  - **The Refactoring Catalog** (Chapters 5–end, ~300 pages):
    - Ch 5: Introducing the Catalog (meta — how to read entries)
    - Ch 6: A First Set of Refactorings
    - Ch 7+ : refactorings grouped by category (Encapsulation, Moving Features, Organizing Data, Simplifying Conditionals, Refactoring APIs, Dealing with Inheritance)
- **63 refactorings in print** (with 5 web-only). Of the 68 in the 1st ed, 10 dropped, 17 new added.
- **Total ~416 pages.**

## Chapter shape

- **Instructional chapters (1–4)** read like a normal book.
- **Catalog chapters (5+)** are structured as a sequence of refactoring entries, each entry self-contained, with the chapter being just a thematic cluster.

## Per-refactoring entry structure (the signature pattern)

Every refactoring follows a uniform 5-element template:

1. **Title** — the name of the refactoring as a verb-phrase ("Extract Function", "Inline Variable", "Change Function Declaration"). Bolded; sometimes an inverse refactoring is named alongside ("Extract Function ↔ Inline Function").
2. **Sketch** — a small before/after code snippet right at the top, showing the transformation in 5–10 lines. Reader can decide in seconds whether the refactoring applies.
3. **Motivation** — prose explaining when and why to apply it (and when NOT to).
4. **Mechanics** — numbered step-by-step procedure for executing the refactoring safely (often 4–10 numbered steps).
5. **Example** — a worked example, sometimes multiple examples, showing the Mechanics applied to a realistic code snippet. The 2nd ed prints code changes in COLOR (red for removed, green for added).

This template is more rigid than Effective-series items — the visual+textual treatment is identical across all 63 refactorings, which makes the catalog scannable.

## Sidebar / callout taxonomy

- **Code listings with color diff** — 2nd ed is printed in color; red/green diff highlighting is the primary visual device.
- **No "Tip" / "Note" boxes** — the structural discipline is the per-refactoring template; no sidebar callouts are needed.
- **Cross-reference arrows** in titles ("Extract Function ↔ Inline Function") show inverses.
- **Bumblebee illustration** at chapter dividers (a callback to the 1st edition's cover).
- The web edition is the canonical version and includes "more refactorings" not in print, with hyperlinks between them.

## Exercise / practice treatment

- **No exercises**, no Stop-and-Think, no Practice Problems.
- The Mechanics steps are themselves the practice — the reader is expected to apply them to their own codebase.
- Worked Examples function as guided practice (the reader can mentally execute the Mechanics against the Example).

## Cross-reference treatment

- **Refactorings cross-reference each other by name** ("After completing this, consider Extract Function on the result") — name-based, not page-based, which makes the catalog stable.
- **List of Refactorings** in the back matter — alphabetical and by category.
- **Index** is comprehensive but the by-name cross-references mean readers rarely need it.
- **Inverse pairing** in titles makes the catalog navigable both directions ("if I want to undo this, go to its inverse").

## What's worth borrowing for claude-books

- **Uniform per-recipe template** with identical visual treatment — the strongest single design choice in Refactoring. Every recipe has the same 5 elements in the same order; this consistency is what makes a 300-page catalog usable. claude-books Volume 3 (Architect's Reference) should adopt an identical template.
- **Sketch at the top** — a tiny before/after that lets readers decide in seconds whether to read the rest. Should be the first thing every recipe shows.
- **Mechanics as numbered steps** — the executable, safe procedure. For agent-engineering this could be the prompt-engineering steps or the tool-design steps for a particular recipe.
- **Inverse pairing in titles** — "Adopt X ↔ Avoid X" or "Promote to Subagent ↔ Inline into Parent" makes the catalog symmetric and helps readers think in both directions.
- **Color diff in code examples** — for a printed book this is striking; for ebook/web claude-books should adopt syntax-highlighted diffs.
- **Name-based cross-references** — names survive page-number changes; "see Extract Function" is more durable than "see page 142".
- **Web edition as canonical** — Fowler maintains a hyperlinked, live web edition with more recipes than print. claude-books should plan for an updateable web-canonical edition.

## What to avoid

- **No exercises at all** is fine for a catalog book but limits skill-building; claude-books should provide at least a "Try this in your own agent" prompt per recipe.
- **Thin instructional shell** (only 4 chapters of teaching before 300 pages of catalog) can leave first-time readers under-prepared; claude-books should weight the instructional shell more heavily, especially in Volumes 1 and 2.
- **Catalog entries can blur together** when read sequentially; claude-books should plan for distinct visual marker or icon per recipe category.

## Quoted (citation-ready)

> "The refactorings are described in detail: the motivation for doing them, mechanics of how to do them safely and a simple example."
>
> — Refactoring 2nd ed., Martin Fowler description of catalog format (martinfowler.com/articles/refactoring-2nd-ed.html)
>
> Anchor: `Fowler refactoring detailed motivation mechanics simple example`

> "The print edition is notably printed in color for the first time, allowing refactoring changes to be visually highlighted throughout the text."
>
> — Refactoring 2nd ed., publisher notes on visual design
>
> Anchor: `Fowler refactoring 2nd edition printed in color refactoring changes visually highlighted`

## Cross-references

- See [[book-effective-series]] for a complementary recipe-card model — Effective uses motivation/code/Things-to-Remember; Refactoring uses Sketch/Motivation/Mechanics/Example.
- See [[book-skiena-algorithm-design]] for a half-catalog book — Skiena's Part II is structurally similar but with looser per-entry templating.
- See [[book-pragmatic-programmer]] for the philosophical/topic-driven counterpart — Pragmatic is the inverse of Refactoring's all-recipe layout.
- See the topic README for the cross-book pattern synthesis.
