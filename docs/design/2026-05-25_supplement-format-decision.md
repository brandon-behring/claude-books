# Supplement format + chapter-shape decisions

**Date**: 2026-05-25
**Status**: working decision memo. Options presented without recommendations; user picks from clean slate.
**Settles**: PEDAGOGY decision-log rows #7 (supplement format), #16 (war-story sidebars), #18 (numbered Tips), #19 (two-tier exercise model).

> **Revised 2026-06-18 — this memo is now historical.** Decision **#7 was revised to SLIM** (canonical
> chapter + *earned* supplements only), superseding this memo's Option-B "5 per chapter" lock *and*
> COMPARISON Round 4's blanket "4 per chapter." #18 (Tips) and #19 (two-tier exercises) are unchanged.
> The supplement collection was renamed `poc/`→`supplements/`. See the PEDAGOGY decision log (#7) and
> `docs/plans/active/2026-06-18_handbook-reconcile-slim.md`. The options below are retained as the
> decision's provenance.

## Context

Bundle D infrastructure round shipped 2026-05-24 (5 commits closing 7 of 13 guides-recon items). The natural next blocker for Ch 1 v1.0 prose work is the 4 OPEN PEDAGOGY decisions that together define **chapter shape** — what supplement artifacts ship per chapter, whether chapters carry war-story sidebars, whether numbered Tips are a first-class pedagogical device, and whether exercises follow a two-tier (inline + end-of-chapter) model.

This memo presents options for each without recommendations. Pick per decision; I'll update PEDAGOGY decision-log accordingly and ship a single commit.

## PoC-kind summaries (the supplement formats currently in flight)

Five formats currently exist as PoCs at `~/claude-books/handbook/src/content/poc/` (22 artifacts total across Ch 1 + Ch 5-8). Decision #7 is about which of these v1.0 commits to producing per chapter.

**Tutorial** (~200 lines, 5 instances). Narrative + worked example + retrieval prompts. Opens with `<YouWillLearn>`; wraps the worked example in `<WorkedExample>`; closes with retrieval prompts + `<TryThis>`. The Diátaxis tutorial mode applied to a practitioner reference. *Cross-chapter observation (COMPARISON Round 3)*: worked examples are the spine of every tutorial; the narrative arc collapses without one.

**How-to** (~130 lines, 5 instances). One sharp problem → numbered 5-7 steps → expected outcome. Diátaxis how-to mode. Picks a concrete use case the chapter material grounds (e.g., "recover from runaway context" for Ch 5; "pre-mortem before architectural decision" for Ch 6). *Cross-chapter observation*: each chapter produces 1 clearly-sharp how-to; the use case usually emerges from the worked example's neighborhood.

**TL;DR** (~60 lines, 5 instances). 1-page compressed essence. `<KeyIdea>` opener + a single table + cross-links. ~5-minute read. *Cross-chapter observation (Round 2)*: distinct from the tutorial's executive summary — different audience (the reader who isn't going to read the tutorial) and different length budget.

**Cheat-sheet** (~140 lines, 5 instances). Reference-card density: tables, decision matrices, ASCII or SVG diagrams, command snippets. Look-up oriented, not linear. *Cross-chapter observation*: the tutorial-vs-cheat-sheet visual distinction held across all 4 chapters of Part II with different content registers — confirming the per-kind layout discipline works.

**Part-summary** (~95 lines, 2 instances — Part I + Part II). Reader-journey framing covering an entire Part's arc with L-level progression (L1→L2 for Part I, L2→L3 for Part II). *Cross-chapter observation (Round 2 + Round 3)*: structurally repetitive vs a longer TL;DR; the L-progression framing is the only feature that genuinely differs. **The most contentious format.**

Build state: 31 pages render clean across all 22 PoCs. Per-PoC-kind layout shipped in scaffold v4.1.0 + adopted in `handbook/src/pages/poc/[...slug].astro` (per-kind CSS variables: line-length, vertical-rhythm, heading-weight).

## Decision #7 — supplement format(s) for v1.0

Three options. Cost-per-chapter assumes Round-2 observation that worked examples take the longest to author; tutorial is the single load-bearing artifact.

**Option A — 4 per chapter (tutorial + TL;DR + 1 how-to + 1 cheat-sheet); drop part-summary entirely.**
- Volume cost: 60 artifacts across 15 chapters (4 × 15).
- Authoring cost: ~3 hours per chapter (tutorial dominates; TL;DR + how-to + cheat-sheet derive from tutorial work).
- Reader value: full quadrant coverage (narrative / procedural / scan / look-up). Each format has distinct audience.
- Maintenance: 4 artifacts move when chapter content evolves; manageable but real.
- Risk: drops Part-summary feature even though Part I/II PoCs exist. Reader-journey arc framing is lost.

**Option B — 5 per chapter (above + part-summary, one per Part not per chapter).**
- Volume cost: 60 artifacts + 4 Part summaries (one per Part of 4) = 64 total.
- Authoring cost: similar to A; part-summary is ~95 lines and derives from Part's TL;DRs.
- Reader value: adds the L-progression framing that no other format carries. Useful for "where am I in the journey?" wayfinding.
- Maintenance: 5 artifacts per Part; Part-summary needs sync when any of its chapters change.
- Risk: Round-2 observation suggests part-summary is structurally close to a long TL;DR. The L-progression framing is real but may not justify the artifact.

**Option C — 3 per chapter (tutorial + TL;DR + 1 cheat-sheet); drop how-to and part-summary.**
- Volume cost: 45 artifacts across 15 chapters.
- Authoring cost: ~2.5 hours per chapter; how-to was the easiest derivation but adds time.
- Reader value: loses the Diátaxis how-to mode entirely. Procedural readers fall through.
- Maintenance: 3 artifacts; lightest of the three options.
- Risk: how-to often disambiguates "I want to do X right now" from "I want to understand X." Dropping it pushes that disambiguation onto the tutorial, which may bloat.

## Decision #16 — war-story sidebars in chapters

Per Skiena's *Algorithm Design Manual* (3rd ed.) — 3-6 page first-person narratives at chapter ends, presenting real industry/research problems with false starts before the right answer. The genre-defining example for war stories in technical writing.

**Option A — adopt war-story sidebars; ~1 per chapter when a named anecdote exists.**
- Format: `<WarStory>` scaffold component (needs Phase 0.7 work; surface as upstream issue per `consumer:claude-books` policy).
- Content: first-person narrative of an Anthropic engineer's session, a documented postmortem (Anthropic has published a few — e.g., April 2026 incident), or a published practitioner experience.
- Cost: ~1 hour per war-story; sourcing the anecdote is the variable cost (some chapters won't have a clean one).
- Risk: the named anecdote test is restrictive — claude-books is largely about Anthropic stack, not the author's personal war stories. Skiena had 30+ years of his own consulting work. Without that, war-stories risk feeling fabricated.

**Option B — keep DEFERRED until first 2-3 chapters land; decide based on what authoring surfaces.**
- Rationale: PEDAGOGY decision-log already has this position ("does the format work for Anthropic-specific content?"). Chapter prose will reveal whether named anecdotes naturally appear.
- Cost: no commitment now; revisit after Ch 1 + Ch 2 prose drafted.
- Risk: forgetting to decide later. Mitigation: schedule decision at the end of Ch 2 prose round.

**Option C — commit "no"; war-stories belong in Field-Guide (Volume 3), not Handbook.**
- Rationale: the audit-of-67-repos that grounds Field-Guide is exactly the war-story source material. Handbook is *how to use Claude well*; war stories are *what teams did and what happened*. Activity-based book boundary (per initial-bootstrap design doc decision #2) supports this split.
- Cost: zero; closes the question.
- Risk: forecloses a pedagogical device the Handbook might benefit from. Mitigation: revisit if a Handbook chapter genuinely needs one (Ch 13 Antipatterns is a candidate).

## Decision #18 — numbered Tips à la Pragmatic Programmer

Per *The Pragmatic Programmer* (2nd ed.) — 100 numbered Tips distributed across prose, then collected on a pull-out tip card at the back. The signature pedagogical device; the book's identity.

**Option A — adopt; ~50 total cap across volumes; `<Tip n="...">` scaffold component; cross-volume numbering.**
- Format: `<Tip n="14" title="Care About Your Craft">Single-sentence rule, callback-able from later chapters.</Tip>` (component needs Phase 0.7 work; surface as upstream issue).
- Volume distribution: ~25 Tips for Handbook, ~15 for Architect's Reference, ~10 for Field-Guide. Numbered sequentially across volumes (Tip 1-25 in Handbook, Tip 26-40 in Architect's Reference, etc.).
- Cost: ~10 min per Tip when authoring the chapter (the insight earns the Tip; the Tip earns the callback). 50 Tips × 10 min = ~8 hours total across all volumes.
- Reader value: pull-quotable; sharable; collected on a pull-out card per Pragmatic Programmer's signature device. Excellent spaced-repetition.
- Risk: editorial-coordination cost is real — every Tip needs to be visible to every other Tip's author; numbering needs central management. Three-volume coordination harder than single-book.

**Option B — keep DEFERRED; surface during chapter prose if a Tip-shaped insight emerges.**
- Rationale: don't pre-commit to a numbering system; let Tips emerge during authoring. If they do, formalize. If they don't, no harm done.
- Cost: zero; revisit per chapter.
- Risk: Tips authored before the convention is fixed may be awkward to retrofit numbering.

**Option C — commit "no"; `<MarginNote variant="tip">` covers the use case adequately.**
- Rationale: claude-books already has `<MarginNote variant="tip" label="Tip">` from the scaffold's 8-category margin-note system. That covers per-section pull-quotable insights without numbering or cross-volume coordination.
- Cost: zero; closes the question.
- Risk: forecloses the pull-out-tip-card device that gives Pragmatic Programmer its identity. Mitigation: claude-books has other identity-bearing devices (figure stack, decision-log, PEDAGOGY itself) that don't need Tips to differentiate.

## Decision #19 — two-tier exercise model (inline + end-of-chapter)

Per CS:APP (Bryant + O'Hallaron) — inline Practice Problems at the point a concept is introduced (solutions at chapter end) + end-of-chapter Homework Problems (instructor-manual only, difficulty-rated). The two-tier model lets the reader self-grade while reading AND have harder problems for after.

**Option A — adopt two-tier; inline `<Exercise>` + end-of-chapter `<Practice>` (scaffold work).**
- Format: `<Exercise id="...">` for inline (solution in `<details>` collapse); `<Practice id="..." difficulty="2">` for end-of-chapter sets. Both need Phase 0.7 scaffold work (surface as upstream issues).
- Cost: ~30 min per exercise (~3 inline + 2-3 end-of-chapter per chapter = ~3 hours per chapter).
- Reader value: significant for a practitioner reference — readers self-test while reading; harder problems available for after. Spaced-repetition device.
- Risk: practitioner audience may not engage with exercises like academic audiences do. CS:APP works because CMU 15-213 makes labs mandatory; claude-books has no equivalent forcing function.

**Option B — keep DEFERRED until Phase 0.7 component shipped; chapter prose uses `<TryThis>` only.**
- Rationale: `<TryThis>` already exists in scaffold; covers the inline-exercise use case adequately for v1.0. End-of-chapter Practice can be added later via upstream scaffold work.
- Cost: low (~10 min per `<TryThis>`); aligns with existing PoC patterns.
- Risk: locks claude-books into single-tier exercise model; harder to add Practice later without retrofitting chapters.

**Option C — commit "no" two-tier; `<TryThis>` at chapter end is sufficient.**
- Rationale: `<TryThis>` at chapter end (currently the PoC pattern) is the practitioner-appropriate equivalent. CS:APP's full two-tier is academic-textbook overhead for an audience that won't grade themselves at scale.
- Cost: zero.
- Risk: forecloses the inline-self-test pattern that supports active reading.

## Cross-decision considerations

**Compounding chapter cost**. Per-chapter authoring time scales with the supplement count + per-supplement features:
- Option A on #7 + Option C on #16/#18/#19 = ~3 hours per chapter (tightest).
- Option B on #7 + Option A on #16/#18/#19 = ~6-7 hours per chapter (heaviest).

Across 15 chapters this is a real 45-hour delta. Plus the editorial-coordination cost for #18 (~50 Tips) + the scaffold-component work for #16/#18/#19 (3 new components surface as upstream issues).

**Editorial-coordination overhead**. Decisions #16 + #18 + #19 each add author-side workflow:
- #16 war-stories: sourcing/verifying the anecdote; first-person voice that doesn't sound fabricated.
- #18 numbered Tips: cross-volume numbering registry; per-volume Tip allotment.
- #19 two-tier exercises: difficulty rating; solution discipline.

The decision-log can absorb 1-2 of these comfortably. All 3 + supplement-format complexity is a lot of overhead before v1.0 prose lands.

**v1.0 vs v1.1 split**. Decisions that need to land for v1.0 (chapter prose can't ship without them):
- #7 supplement format — yes, v1.0.
- #16 war-stories — could ship in v1.1 (chapters land without; sidebars added later).
- #18 numbered Tips — could ship in v1.1 (chapters land without; Tips retrofitted from existing prose).
- #19 two-tier exercises — could ship in v1.1 (chapters ship with `<TryThis>` only; Practice added later).

If editorial-coordination overhead is a concern, defer #16/#18/#19 to v1.1 by picking Option B on each.

## Provenance

- Sources for per-decision options: PEDAGOGY decision-log rows #7/#16/#18/#19; COMPARISON.md Rounds 1-3; research cache notes `~/claude-books/docs/research/11-pedagogy/04-handbook-genre/book-{pragmatic-programmer,skiena-algorithm-design,csapp-bryant}.md`.
- Memo length: ~1750 words.
- No recommendations included per user direction (2026-05-24 clarification round).
