# 03-multimedia-learning — pedagogy theory backing claude-books design

Per-source primary-research notes covering the cognitive-science and pedagogy foundations for design decisions in `claude-books`: progressive disclosure, worked examples, interleaving, diagram-or-example rules, learning objectives, and section-length budgets.

**7 notes**, all **T1-official** (academic primary sources). Volatility uniformly **stable** — these are 30+ year-old foundational frameworks, not evolving spec.

## Notes

| # | Theory / framework | Author(s) | Note |
|---|---|---|---|
| 1 | Cognitive Theory of Multimedia Learning + 12 principles | Mayer (2001, 3rd ed. 2020) | [`theory-mayer-multimedia-principles.md`](./theory-mayer-multimedia-principles.md) |
| 2 | Cognitive Load Theory + worked-example effect | Sweller / Ayres / Kalyuga (2011) | [`theory-sweller-cognitive-load.md`](./theory-sweller-cognitive-load.md) |
| 3 | Dual-Coding Theory | Paivio (1986/1990) | [`theory-paivio-dual-coding.md`](./theory-paivio-dual-coding.md) |
| 4 | Desirable Difficulties (interleaving / spacing / retrieval) | Bjork & Bjork (1994 onward) | [`theory-bjork-desirable-difficulties.md`](./theory-bjork-desirable-difficulties.md) |
| 5 | Spiral Curriculum | Bruner (1960) | [`theory-bruner-spiral-curriculum.md`](./theory-bruner-spiral-curriculum.md) |
| 6 | Bloom's Taxonomy (revised) | Anderson & Krathwohl (2001) | [`theory-blooms-taxonomy.md`](./theory-blooms-taxonomy.md) |
| 7 | Chunking + schemas (working-memory foundation) | Miller (1956) + Cowan (2001) + schema theory | [`theory-miller-chunking-schemas.md`](./theory-miller-chunking-schemas.md) |

## How these theories relate

```
Working-memory limits (Miller 1956, Cowan 2001)
        │
        ├── Cognitive Load Theory (Sweller) ──── Worked-example effect, split-attention,
        │                                       expertise reversal
        │
        ├── Cognitive Theory of Multimedia Learning (Mayer) ── 12 principles
        │       │
        │       └── built on Dual-Coding (Paivio) ── multimedia, modality, image principles
        │
        └── Desirable Difficulties (Bjork) ── retrieval, interleaving, spacing
                                              (the long-term-retention counterweight to CLT)

Curriculum architecture:
        Spiral Curriculum (Bruner 1960) — revisit core concepts at increasing depth
        Bloom's Taxonomy revised (Anderson & Krathwohl 2001) — ladder objectives upward
```

## The 7 most actionable principles for claude-books

Distilled across all 7 notes, in priority order for chapter authors:

### 1. Diagram-or-example rule (multimedia + dual-coding)

Every section that introduces a non-trivial concept includes a diagram, table, or fully worked code example. Pure-prose explanation is a CTML / DCT anti-pattern.
**Sources**: [[theory-mayer-multimedia-principles]], [[theory-paivio-dual-coding]].

### 2. Worked example first, exercise later — and fade across the book

Open conceptual chapters with a complete, annotated worked example before any "your turn" exercise. Fade from worked → partial → exercise across chapters. Watch for **expertise reversal** — at the advanced volume, drop worked examples in favor of problems.
**Source**: [[theory-sweller-cognitive-load]].

### 3. Inline annotations (spatial contiguity)

Annotations next to the thing they annotate, not in a paragraph below. Numbered callouts pointing into code, inline comments, label-on-diagram beat "lines 4–7 do X" prose.
**Sources**: [[theory-mayer-multimedia-principles]], [[theory-sweller-cognitive-load]].

### 4. Cut seductive details (coherence)

No off-topic anecdotes, decorative images, or "fun facts" mid-chapter. They reduce transfer-test performance by ~30% in Mayer's data.
**Source**: [[theory-mayer-multimedia-principles]].

### 5. Retrieval prompts, not summaries (desirable difficulties)

Every chapter ends with 2–4 retrieval prompts ("close the book and answer") *before* any recap. Summaries are rereading; retrieval is what builds long-term retention.
**Source**: [[theory-bjork-desirable-difficulties]].

### 6. Spiral structure + Bloom ladder

Designate 4–6 spine concepts per volume that recur in ≥ 3 chapters at increasing depth (spiral), with each pass targeting a higher Bloom verb (Remember → Understand → Apply → Analyze → Evaluate → Create).
**Sources**: [[theory-bruner-spiral-curriculum]], [[theory-blooms-taxonomy]].

### 7. Working-memory budget per section

Hard limits: ≤ 4–5 bullets per list (group otherwise); ≤ 5 boxes per architecture diagram (cascade if more); ≤ 30 words per sentence; ≤ 3 new concepts per section; ≤ 5 positional arguments per shown function signature.
**Source**: [[theory-miller-chunking-schemas]].

## Apparent contradictions, resolved

- **CLT says "reduce load" / Bjork says "introduce difficulty"** — Resolution: *extraneous* load (poor layout, redundant text, distracting decoration) is bad; *learning-process* difficulty (retrieval, interleaving, spacing) is good — it converts to schema-building work. Reduce extraneous load to free capacity *for* desirable difficulty.

- **Mayer says cut redundant text / DCT says use multiple representations** — Resolution: redundancy = identical content in two channels splits attention. Multiple representations = *complementary* content (text + congruent diagram) doubles encoding paths. Same/different content, not same/different channels.

- **Bruner says "any subject to any child" / CLT says "respect working-memory limits"** — Resolution: Bruner is talking about the *form* of representation, not raw difficulty. Spiral pass 1 of calculus is an honest-but-simple form; full epsilon-delta limits wait for pass 3. Each pass respects the working-memory budget.

## Chapter-author cheat sheet

For each chapter draft, run this checklist (each item maps to one of the 7 notes):

- [ ] Does every conceptual section have a diagram, table, or worked example? — [[theory-mayer-multimedia-principles]], [[theory-paivio-dual-coding]]
- [ ] Does the chapter open with a complete worked example before any exercise? — [[theory-sweller-cognitive-load]]
- [ ] Are annotations inline with the code/diagram they explain? — [[theory-mayer-multimedia-principles]]
- [ ] Have you cut seductive details (off-topic anecdotes, decorative imagery)? — [[theory-mayer-multimedia-principles]]
- [ ] Do you end with retrieval prompts, not (just) a summary? — [[theory-bjork-desirable-difficulties]]
- [ ] Are the 2–4 chapter learning objectives written with Bloom verbs, mixed across levels? — [[theory-blooms-taxonomy]]
- [ ] Does this chapter revisit a spine concept from an earlier chapter at greater depth? — [[theory-bruner-spiral-curriculum]]
- [ ] Are bullet lists ≤ 5, diagrams ≤ 5 nodes, sentences ≤ 30 words, new concepts per section ≤ 3? — [[theory-miller-chunking-schemas]]

## Open questions for this topic

- **Visual hierarchy + typography research** (Tufte, Bringhurst, edge-detection studies) — adjacent to multimedia learning but distinct; consider as a future expansion (sibling directory `01-doc-ux-patterns/` is currently empty).
- **Worked-example research specific to programming** — Trafton & Reiser (1993) is the classical reference but doesn't appear here as its own note; pulled into the Sweller note instead. Could merit a dedicated note if program-specific applications get heavy.
- **Spaced-repetition implementations** (Anki / SuperMemo, FSRS algorithm) — the algorithmic side of [[theory-bjork-desirable-difficulties]] in practice; not covered here. Could be a future practitioner-tier note if claude-books considers shipping companion flashcards.
- **Accessibility considerations** (WCAG cognitive guidelines) — overlap with both multimedia learning and the empty `01-doc-ux-patterns/` sibling. Defer to that directory when populated.

## Maintenance

- All sources are stable academic primary references — no re-verification needed unless a new edition appears (Mayer's 4th edition would be the most likely event; *Cambridge Handbook of Multimedia Learning* is currently at 3rd ed., 2022).
- Citations use Anchor lines so chapter drafts can spot-check the quoted passage against the published book.
