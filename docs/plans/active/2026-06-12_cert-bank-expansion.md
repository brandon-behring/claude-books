# Sprint 2 — Cert question-bank expansion (per-chapter coverage)

> **Status: IN PROGRESS 2026-06-12** (planned + approved same session as Sprint 1, executed on
> Opus 4.8 max-effort). Issue [#13](https://github.com/brandon-behring/claude-books/issues/13).
> Sequenced *after* Sprint 1 (apparatus adoption) so every authored question lands directly in the
> final rendering pipeline — scored ExamRunner on `/practice-exam`, `<AssessmentTest>` on
> `/assessment`, the `/answers` appendix, and `<ObjectiveMap>`'s domain→chapter matrix.

## Goal

Grow `architect-reference/src/content/questions/` from the **10-question seed** (2/domain, only 9
chapters touched) to **per-chapter coverage** — every one of the 30 chapters carries ≥2 scoreable
items, with the bank's domain distribution tracking the CCA-F blueprint (27/18/20/20/15). Target:
**73 questions** (≈63 new). Item-writing rules are locked in
[`../../../architect-reference/OUTLINE.md`](../../../architect-reference/OUTLINE.md) (line 19); the
seed files are the working templates.

## Decisions (user, 2026-06-12, one-question rounds)

1. **Blueprint-weighted, floor 2.** Every chapter ≥2 questions; extra weight to high-weight domains.
   Achieved split 28.8/16.4/19.2/19.2/16.4 ≈ blueprint 27/18/20/20/15 — exactness would be false
   precision against a published-but-coarse weighting.
2. **Pattern + parallel fan-out.** Hand-author one full chapter's quota first (d1-02) to lock the
   item pattern, then one author subagent per remaining chapter — the QC shape proven in Sprint 1's
   29-chapter Diagnostic conversion.
3. **Cross-model QC.** **Fable 5 authors** (consistent voice, strong distractor craft);
   **Opus 4.8 reviewer fan-out** (one per chapter) breaks the author–judge self-preference
   correlation. Each reviewer carries both lenses — item-craft compliance AND factual grounding in
   that chapter's own prose (the self-contained promise). Flagged items are fixed or struck before
   commit; author↔reviewer disagreements escalate to a 2-vote panel (Opus + Fable, one lens each).

**Folded without a separate decision** (no real fork): all items `type: mcq` (the only scoreable
type; CCA-F is MCQ; the seed is all-MCQ) · Bloom skew toward apply/analyze/evaluate (the rules
mandate application-not-recall) · `<Rationale appendix for="<id>">` style · id = filename stem,
`chapter: d{N}-{nn}`, quoted `difficulty` "1"–"3", 4 options a–d, exactly one `correct: true`, no
all/none-of-the-above · a new **cert-audit Check 14** (≥2 questions/chapter) as a permanent
regression gate, mirroring Sprint 1's Check 9 hardening · reviewers read each chapter anyway, so the
10 seeds get a flag-only review pass too.

## Quota table

Quota = target items per chapter; New = quota − existing seeds. **d1-02 is hand-authored**; the
other 28 chapters with New > 0 go to the author fan-out. (d5-04 is already at quota → 0 new.)

| Domain (blueprint) | Chapters | Quota/ch | Seeds | New | Domain total |
|---|---|---|---|---|---|
| **D1** Agentic Architecture (27%) | d1-01…d1-07 (7) | 3 | 2 in d1-01 | 19 | **21** |
| **D2** Tool Design & MCP (18%) | d2-01…d2-05 (5) | 2, +1 in d2-01 & d2-04 | 1 in d2-02, 1 in d2-04 | 10 | **12** |
| **D3** Config & Workflows (20%) | d3-01…d3-06 (6) | 2, +1 in d3-01 & d3-04 | 1 in d3-01, 1 in d3-06 | 12 | **14** |
| **D4** Prompt Eng & Structured Output (20%) | d4-01…d4-06 (6) | 2, +1 in d4-03 & d4-04 | 2 in d4-03 | 12 | **14** |
| **D5** Context Mgmt & Reliability (15%) | d5-01…d5-06 (6) | 2 | 2 in d5-04 | 10 | **12** |
| | **30** | | **10** | **63** | **73** |

Per-chapter New count: d1-01=1, d1-02=3*, d1-03=3, d1-04=3, d1-05=3, d1-06=3, d1-07=3 · d2-01=3,
d2-02=1, d2-03=2, d2-04=2, d2-05=2 · d3-01=2, d3-02=2, d3-03=2, d3-04=3, d3-05=2, d3-06=1 · d4-01=2,
d4-02=2, d4-03=1, d4-04=3, d4-05=2, d4-06=2 · d5-01=2, d5-02=2, d5-03=2, d5-04=0, d5-05=2, d5-06=2.
(*hand-authored)

## Item pattern (locked from the seeds)

File `src/content/questions/d{N}-{nn}-{semantic}.mdx`. Frontmatter: `id` (= stem) · `type: mcq` ·
`chapter` (e.g. `d1-02`) · `domain` (verbatim one of the five `examDomains` in
`astro.config.mjs:19` — a mismatch throws at build) · `bloom_level` · `difficulty` ("1"–"3") ·
`options:` (4 entries `{id, text, correct?}`, exactly one `correct: true`). Body:
`import Rationale …` → cover-the-options vignette + closed lead-in → `<Rationale appendix for="<id>">`
that states the key and refutes each distractor's misconception. Models:
`d1-01-loop-end-turn.mdx` (recall shape) and `d5-04-compact-vs-clear.mdx` / `d1-02-*` (the
preferred application shape).

## Author-agent prompt template (one per chapter, Fable 5)

> Read `architect-reference/src/content/chapters/<slug>.mdx` in full. Author exactly **N** MCQ
> question files into `architect-reference/src/content/questions/`, one file each, following the
> conventions in the d1-02 pattern files *verbatim*. Every claim in every stem, correct answer, and
> rationale must be **grounded in this chapter's prose** — no outside facts, no new claims (the book
> is self-contained). Assess **application, not recall**: vignette + closed cover-the-options
> lead-in; 4 options; plausible distractors built from the misconceptions the chapter explicitly
> corrects; no all/none-of-the-above; no testwiseness cues. Avoid these angles already covered by
> existing seeds for this chapter: <list or "none">. Return the file paths + a one-line angle for
> each.

## Execution steps

1. **Plan doc** (this file) + commit `docs(plans):`.
2. **Pattern chapter** — hand-author d1-02's 3 items; `npm run validate && npm run build`;
   render-check `/practice-exam` (13 items, scoreable), `/answers`, `/assessment`. Commit
   `feat(architect-reference):`.
3. **Author fan-out** — 28 Fable agents (skip d1-02, d5-04). Collect file lists.
4. **Mechanical verify** — quota counts, dup-id, `npm run validate`, cert build.
5. **QC fan-out** — 30 Opus reviewers (both lenses); apply fixes / strikes; refill below floor 2;
   escalate disagreements to the 2-vote panel.
6. **Check 14** — bank coverage ≥2/chapter in `scripts/cert-audit.mjs`; run 14/14.
7. **End-to-end verify** — validate + build; render `/practice-exam`, `/assessment`, `/answers`,
   `<ObjectiveMap>` (all 30 chapters linked).
8. **Record** — ROADMAP Sprint 2 → DONE; close #13; this doc → `docs/plans/done/`; update
   `project_cert_book.md` memory; commits per git pattern; push on the user's word.

## Done =

Bank ≈73 questions, every chapter ≥2, domain weights ≈ blueprint; all items rule-compliant and
chapter-grounded after cross-model review; `npm run validate` + build green; cert-audit **14/14**
(new Check 14); `/practice-exam`, `/assessment`, `/answers`, and `<ObjectiveMap>` all render the
full bank; #13 closed; records reconciled.

## Decisions made (post-hoc log)

_(Filled during execution: struck items + why, any quota refills, escalations, distribution actually
achieved.)_
