# Topic 11.06 — Certification study-guide genre + assessment item-writing

The research foundation for **the Cert book's** (`architect-reference`) hybrid exam-prep template — specifically the two things the original Topic 11 pedagogy sprint did *not* cover (it surveyed reference/handbook genre, not cert prep). Executed 2026-06-01 as two parallel strict-live agents (genre conventions · item-writing craft). Closes the gap flagged in [claude-books #9](https://github.com/brandon-behring/claude-books/issues/9).

**Stats**: 11 source notes (6 genre + 5 item-writing). All follow the standard cache template (per-source frontmatter, citation-ready quotes with Anchor lines, `[[slug]]` cross-references into the existing Bjork/Bloom notes).

## Sub-clusters

| Cluster | Notes | Tier mix | Owns |
|---|---|---|---|
| **Cert-guide GENRE** (how prep books are structured) | `genre-exam-ref-microsoft`, `genre-comptia-exam-objectives`, `genre-pearson-official-cert-guide`, `genre-sybex-study-guide`, `genre-google-cloud-exam-guide`, `genre-blooms-test-blueprint` | T1×3 (Exam Ref, CompTIA, Google Cloud) / T3×3 | Chapter↔blueprint structure, diagnostics, recap placement, two-tier questions, weighting, the test blueprint |
| **Item-writing CRAFT** (how to write each question) | `itemwriting-nbme-guide`, `itemwriting-haladyna-taxonomy`, `itemwriting-acs-credentialing`, `itemwriting-brame-vanderbilt`, `itemwriting-flaws-empirical` | T1×3 (NBME, Haladyna, Pham) / T3×2 | Stem/option/distractor rules, testwiseness purge, validity framing |

**Dedup note** (the clusters overlap on vignette/cover-test/rationale): treat the **item-writing cluster as canonical for *how to write an item*** (NBME + Haladyna are the primary sources). `genre-blooms-test-blueprint` (Baylor) is kept for its **distinct contribution — the test *blueprint*** (table-of-specifications, per-domain item counts, the ≥40% higher-order Bloom quota); cite it for *what/how-much to test*, not for item mechanics.

## Headline findings

### Genre conventions (structure)

1. **Chapter = exam task-area, 1:1; the TOC restates the blueprint.** No competing narrative organization. — *Exam Ref* ("if an exam covers six major topic areas… the book will contain six chapters"), *CompTIA* (the upstream objective tree). ✅ already the cert book's convention.
2. **Bracket each chapter with diagnostics; recap comes *last*.** Optional pre-read router (Pearson "Do I Know This Already?") → prose → **retrieval prompt with worked rationale** (Exam Ref Thought-experiment → answers) → **recap box last** (Sybex "Exam Essentials"). The recap is never the bridge into review. Reinforces [[theory-bjork-desirable-difficulties]].
3. **Two-tier question design.** In-chapter review (lighter, recall/apply, with rationales) vs. a separate pooled, exam-realistic **practice-exam** bank. Physically and tonally distinct. — *Pearson*, *Sybex*.
4. **Weight coverage by published domain emphasis, and show the number.** Front-matter objective→chapter map with per-task-area %. — *CompTIA*, *Google Cloud* ("~25% of the exam"). ✅ the landing page already prints D1–D5 weights.
5. **"Need more review?" supplement pointers.** A reference openly covers every objective but teaches none from scratch, deferring thin spots to deeper sources. — *Exam Ref*. Fits the cert book's diff-live-docs + outward-links-to-design-book stance.

### Item-writing rules (craft) — the quality gate for every `<Practice>`/`<Exercise>`

1. **Assess application, not recall** — wrap the testing point in a scenario so the reader must *decide/apply*. — NBME Rule 2 (ties to Bloom *Apply*).
2. **Cover-the-options stem** — answerable from stem alone; if not, the stem is under-specified. — NBME, Haladyna G15.
3. **One clearly-best answer; homogeneous, rank-orderable options** (same kind, similar length/grammar). — NBME, Haladyna G19/G23/G24.
4. **Plausible distractors built from common misconceptions** — the generative rule, not just policing. — Brame, Haladyna G29/G30.
5. **Ban "all of the above"; gate "none of the above"** (silently becomes true/false). — NBME, Haladyna G25/G26.
6. **Positive stems; reserve NOT/EXCEPT** for when the objective demands it. — Haladyna G17.
7. **Default to ~3–4 options** (1 key + 2–3 plausible); don't pad with filler. — Rodriguez 2005 meta-analysis, Haladyna G18.
8. **Purge testwiseness cues** — longest/most-detailed key, grammatical mismatch, absolutes only in distractors, stem words echoed in the key ("clang"). — NBME, Haladyna G28.
9. **Justify the rules by *validity*, not difficulty** — flaws inject unpredictable construct-irrelevant error; they don't reliably make items easier. — Pham, Besanko & Devitt 2018 (the honesty check).

## How the Cert book consumes this

These refine the hybrid template in `architect-reference/OUTLINE.md`:

- **End-of-chapter order → retrieval-first**: `## Practice` (scenario items + rationale) *then* `## Exam essentials` recap **last** (inverts the design book's recap-first habit; cert genre + Bjork both say retrieval before summary).
- **Practice items follow the 9 item-writing rules** — vignette+lead-in, cover-the-options, application-over-recall, plausible misconception distractors, no all/none-of-the-above, rationale provided.
- **`Need more review?`** margin-note convention for objectives the reference covers thinly (defers to live Anthropic docs / the design book).
- **Two-tier banks** deferred to a later round (the future per-Part practice-exam pool); in-chapter self-checks are tier 1.

## Provenance

11 strict-live notes, two parallel agents (~17 + ~40 tool calls), 2026-06-01. Every note rests on a real fetched primary with verbatim Anchor'd quotes. Tier caveat: `itemwriting-flaws-empirical` (Pham 2018) is peer-reviewed empirical, labeled `T1-official` as the closest schema enum (stated in-note). Cross-links into [[theory-bjork-desirable-difficulties]] + [[theory-blooms-taxonomy]] (the science layer this genre/craft layer sits on).
