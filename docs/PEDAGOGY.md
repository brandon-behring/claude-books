# Series pedagogy — the genre→device model

> The canonical, series-level statement of **which teaching devices belong in which book, and why.**
> Companion to [`BOOK-MAP.md`](./BOOK-MAP.md) (scopes + the depth ladder) and
> [`ROADMAP.md`](./ROADMAP.md) (status). Book-specific pedagogy detail lives in each book's own doc —
> e.g. [`handbook/PEDAGOGY.md`](../handbook/PEDAGOGY.md). Established by the 2026-06-19 series pedagogy
> & positioning audit ([`audits/2026-06-19_series-pedagogy-and-positioning-audit.md`](./audits/2026-06-19_series-pedagogy-and-positioning-audit.md)).
> Last updated: **2026-06-19**.

## Why this doc exists

The four books teach with **different apparatus**, and that is correct — a tutorial, a principle
essay, an exam study guide, and a reference treatise should not look the same. But "different" must
be *intentional by genre*, not drift. This doc fixes the rule: each book has a **genre**, each genre
has a device profile, and divergence outside that profile is a finding, not a feature.

## Genres map to the depth ladder

| Book | Genre | Ladder position (see [`BOOK-MAP.md`](./BOOK-MAP.md)) |
|---|---|---|
| `handbook/` | **Tutorial / how-to** | Rung 1 — use it today (Claude-specific, lean-but-standalone) |
| `agentic-coding/` | **Principle / comparative essay** | Rung 2 — why it works, across tools |
| `agentic-systems-design/` | **Reference treatise** | Rung 3 — engineer it (deepest) |
| `architect-reference/` | **Study guide** | Orthogonal — the exam path |

The pedagogy *serves the ladder*: handbook teaches by **doing** (exercises on your own project);
agentic-coding teaches by **comparing** (convergence/divergence across tools); the cert book teaches
by **testing** (diagnostics + a question bank); design teaches by **sourcing** (dense citation +
worked patterns).

## The genre→device matrix (canonical)

**Core** = expected in the genre. **Optional** = fine when it earns its place. **Out** = a genre
mismatch; using it is drift.

| Genre (book) | Core devices | Optional | Out (genre mismatch) |
|---|---|---|---|
| **Tutorial** (handbook) | `YouWillLearn`, `KeyIdea`, `BeforeAfter`, `WorkedExample`, `Tip`, `Pitfall`, `Exercise`/`Practice`/`Solution`, `MarginNote`, Figures | `Convergence` breadcrumb to rung 2 | `Diagnostic`, `PartReview`, the pervasive `Tag` system |
| **Principle/comparative** (agentic-coding) | `KeyIdea`, `ConceptBox`, `Convergence`, `Divergence`, `Citation`, `TryThis` | Figures (comparison), `Sidenote` | `Exercise`/`Practice` (no drilling), `Diagnostic` |
| **Study guide** (architect-reference) | `Diagnostic`, `YouWillLearn`, `Exercise`/`Practice`/`Solution`, `Rationale`, `PartReview`, `WorkedExample`, `Tag`, `Citation`, `Pitfall` | `ConceptBox` | `BeforeAfter` (rare) |
| **Reference** (design) | `Citation` (dense), `Tag`, `KeyIdea`, `ConceptBox`, `InsightBox`, `MarginNote`, `WorkedExample`, Figures | `Exercise`/`Practice` (applied reinforcement) | `Diagnostic`, `PartReview` |

### Evidence — verified device counts (2026-06-19, chapters only; figures = `.tex` assets)

| Device | handbook | agentic-coding | architect-ref | design |
|---|---:|---:|---:|---:|
| files / lines | 20 / 5622 | 23 / 3823 | 30 / 5217 | 28 / 4623 |
| Exercise / Practice / Solution | 48 / 46 / 48 | 0 / 0 / 0 | 30 / 64 / 94 | 33 / 34 / 62 |
| Citation | 97 | 44 | 303 | 625 |
| Tag | 0 | 0 | 297 | 282 |
| MarginNote / Sidenote | 51 / 0 | 0 / 5 | 45 / 0 | 61 / 0 |
| KeyIdea / Pitfall | 36 / 79 | 23 / 0 | 50 / 53 | 38 / 27 |
| WorkedExample / YouWillLearn | 7 / 16 | 0 / 0 | 30 / 30 | 15 / 28 |
| InsightBox / BeforeAfter / Tip | 23 / 18 / 44 | 0 / 0 / 0 | 0 / 0 / 0 | 28 / 0 / 0 |
| TryThis / ConceptBox | 0 / 0 | 18 / 18 | 0 / 43 | 0 / 26 |
| Convergence / Divergence | 0 / 0 | 20 / 42 | 0 / 0 | 10 / 0 |
| Diagnostic / PartReview | 0 / 0 | 0 / 0 | 30 / 5 | 0 / 0 |
| Figures (`.tex`) | 14 | 0 | 0 | 18 |

Reproduce: `grep -rohE "<Comp[ >/]" <book>/src/content/chapters/`. (The earlier exploration pass
mis-counted several of these — notably agentic-coding's citations and design's exercises; the table
above is the corrected, reproducible set.)

## Series-wide conventions

- **`volatility` enum** is exactly `stable-principle` / `architectural-pattern` / `feature-surface`
  (the old `evolving` / `fast-moving` names are **retired**). The scaffold maps each to a freshness
  threshold vs `last_verified`: feature-surface 90d / architectural-pattern 180d / stable-principle 365d.
- **`<MarginNote>` is a guideline, not a capped/validated limit.** The retired 25-word cap is gone;
  asides earn their place by **function, not word count** (one secondary-disclosure layer per chapter;
  promote load-bearing notes into the body). See each book's `CLAUDE.md`.
- **The source-`<Tag>` system (`official`/`practitioner`/`convergence`) is scoped to the
  reference-altitude books** (architect-reference + design), where pervasive provenance suits the
  genre. The Use books cite with `<Citation>`; they do **not** carry the Tag system. (This scopes the
  old "source-tagging is a universal standard" decision to where it fits.)
- **Figures** follow [`handbook/figures/FIGURE-STANDARD.md`](../handbook/figures/FIGURE-STANDARD.md).
  Design ships figures too and should consume the same standard; the named `--fig-*` token work is an
  *upstream* (scaffold / brandon-behring.dev) concern — see [`scaffold-gaps.md`](./scaffold-gaps.md).
- **Cross-book links** use `<BookLink>` (separate Astro apps); in-book links use `<XRef>`.

## Shared pedagogical principles

These hold across all books (detailed, with sources, in [`handbook/PEDAGOGY.md`](../handbook/PEDAGOGY.md)
and [`docs/research/11-pedagogy/`](./research/11-pedagogy/)):

- **Bruner spiral** — key concepts revisited at increasing depth (within a book, and *up the ladder*).
- **Worked examples + retrieval** — collapsible `<WorkedExample>` + end-of-section retrieval prompts.
- **Macro-before-micro** — each chapter opens with a compressed view (`YouWillLearn` + a `KeyIdea`).
- **Epistemic transparency** — claims are sourced (`<Citation>`; `<Tag>` in the reference books).
- **Match form to reader-mode** — Diátaxis discipline; the genre→device matrix above is its enforcement.

## Per-book pedagogy homes

- **handbook** — [`handbook/PEDAGOGY.md`](../handbook/PEDAGOGY.md) (the original, deepest treatment;
  handbook-specific decisions + the visual-pedagogy research synthesis).
- **agentic-coding / architect-reference / agentic-systems-design** — no dedicated pedagogy doc; their
  device profiles are governed by this matrix + their `CLAUDE.md` authoring guides.

> **Open follow-ups** (from the audit, not yet executed): the agentic-coding rigor re-examination
> (citations + cross-tool depth + currency); design adopting the figure standard once `--fig-*` lands.
