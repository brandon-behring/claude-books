# Visual-pedagogy design — theoretical rationale for PEDAGOGY decisions

**Date**: 2026-05-23
**Status**: canonical rationale for the decisions captured in `~/claude-books/handbook/PEDAGOGY.md`.
**Provenance**: extracted from PEDAGOGY.md during the Bundle D guides-recon-action round (2026-05-24) per recon §9 (date-prefixed design docs as a superseded chain). PEDAGOGY.md retains the *what we decided* + author-facing rules; this doc carries the *why those decisions* — the theoretical commitments and source research.

## Why split rationale from decisions

PEDAGOGY.md is a working author-reference document — read frequently during chapter authoring + scaffold-component adoption. Decision-state tracking (DECIDED / SHIPPED / ADOPTED) and visual conventions need to stay scannable + load-bearing. Theoretical rationale (the *why we picked Sweller, Bruner, Mayer*) is read once per onboarding + cited per decision; it doesn't need to live in the same file.

The split lets a chapter author open PEDAGOGY.md to find the rule + lets a curious contributor open this doc to find the load-bearing theory. Different reading needs, different documents.

## Load-bearing pedagogical theory commitments

The handbook's pedagogical design draws on five named bodies of theory, each cited explicitly in the per-decision rationale. None of these are uniquely original to claude-books; the contribution is *committing to them as engineering constraints* on chapter authoring, not as aspirational guidelines.

### Bruner's spiral curriculum

Per [[../docs/research/11-pedagogy/03-multimedia-learning/theory-bruner-spiral-curriculum]]: concepts are revisited at increasing depth as the learner matures. Each revisit explicitly connects back to the earlier treatment so the learner perceives accumulating mastery, not redundancy.

The LaTeX source's `00_preamble.tex` already enacts this. The cache note distills the principle as a design rule: *"designate 4–6 spine concepts per volume that recur in ≥ 3 chapters at increasing depth, with each pass targeting a higher Bloom verb (Remember → Understand → Apply → Analyze → Evaluate → Create)."*

Adopted in: PEDAGOGY decision #1 (Bruner spiral curriculum, predates this doc) + decision #10 (interleaving rationale section).

### Bjork's "desirable difficulties"

Per [[../docs/research/11-pedagogy/03-multimedia-learning/theory-bjork-desirable-difficulties]]: making learning *harder* in specific ways (spaced retrieval, interleaved practice, varying contexts) **improves long-term retention** even though it makes initial learning slower and feel harder.

The cross-references between chapters force readers to integrate concepts across contexts; the worked-example placements interleave abstract principle with concrete application. Applied as: *"every chapter ends with 2–4 retrieval prompts ('close the book and answer') before any recap. Summaries are rereading; retrieval is what builds long-term retention."*

Adopted in: PEDAGOGY decision #15 (retrieval prompts at chapter end, vs summary recap) + the existing tutorial PoCs' end-of-chapter "Retrieve before you summarize" sections.

### Mayer's signaling principle (multimedia learning principles)

Per [[../docs/research/11-pedagogy/03-multimedia-learning/theory-mayer-multimedia-principles]]: visual + verbal cues that direct attention to essential material improve learning.

The 8-category margin-note system is signaling: `Cost` directs financial attention; `Warning` directs failure-mode attention; etc. Differentiating them visually (color + label) makes the signal actionable. The v4.1.0 pedagogy callout family (`<YouWillLearn>` / `<WorkedExample>` / `<Pitfall>`) extends signaling to first-class structural cues: gold callout for chapter openers; plum collapsible for worked examples; crimson for retrospective common-mistake.

Per Mayer's 12 principles (coherence, redundancy, spatial + temporal contiguity, modality, multimedia, signaling, segmenting, pre-training, personalization, voice, image principles), figure + prose combinations also constrain choices — notably the redundancy principle (don't duplicate prose + on-screen text simultaneously) and the modality principle (prefer narration + visual over text + visual).

Adopted in: PEDAGOGY decisions #5 (8-category margin notes), #11 (visual presentation principles — 8 numbered), #14 (rich callout vocabulary).

### Sweller's worked-example effect (cognitive load theory)

Per [[../docs/research/11-pedagogy/03-multimedia-learning/theory-sweller-cognitive-load]]: complete worked examples reduce extraneous load for novices and outperform unguided problem-solving early in learning.

The handbook's plan: *"open conceptual chapters with a complete, annotated worked example before any 'your turn' exercise. Fade from worked → partial → exercise across chapters."* The `<WorkedExample>` MDX component (scaffold v4.1.0) renders these collapsibly so expert readers can skip.

Worked examples are valuable but interrupt prose flow. Closed-by-default collapsibles let scanners skip them; learners click to expand. This is Sweller's worked-example effect layered with hierarchical disclosure (per [[../docs/research/11-pedagogy/02-information-design/nng-progressive-disclosure]]).

Adopted in: PEDAGOGY decision #8 (`<WorkedExample>` collapsible component; SHIPPED + ADOPTED across Ch 1 + Ch 5-8 tutorial PoCs).

### Working-memory budget (Miller + Cowan chunking)

Per [[../docs/research/11-pedagogy/03-multimedia-learning/theory-miller-chunking-schemas]]: Miller's 7±2 + Cowan's 4 chunks for novices.

Hard limits per section: ≤4–5 bullets per list; ≤5 boxes per architecture diagram; ≤30 words per sentence; ≤3 new concepts per section. The 4-tier figure stack's per-figure node-count cap (≤7 per Miller) derives from this; diagram-or-example commitments respect the limit by decomposing larger architectures into multiple linked diagrams rather than one cluttered figure.

Adopted in: PEDAGOGY visual presentation principles + the figures-section node-cap rule.

## Interleaving rationale — why these theories combine

The five theories together answer: why the spiral curriculum + scattered worked examples + cross-references — instead of "introduce a concept fully, then never revisit it"?

- **Bruner** answers *the structural question*: concepts must recur at depth.
- **Bjork** answers *the retention question*: the recurrence must be effortful, not redundant.
- **Mayer** answers *the surface question*: visual + verbal signaling tells the reader what's important *now*.
- **Sweller** answers *the cognitive-load question*: worked examples are the cheapest way to bootstrap a new concept; gradient toward exercises preserves transfer.
- **Miller/Cowan** answers *the chunking question*: each section's working-memory load is bounded; respect the budget or the rest fails.

These five together justify the 4-layer pedagogical model + visual presentation principles + decision-log entries that PEDAGOGY.md commits to. Each PEDAGOGY decision implicitly leans on one or more of these theories; this doc makes that leaning explicit.

## Worked-example collapsible — why this specific UX

PEDAGOGY decision #8 commits to `<WorkedExample>` as a *collapsible by default* component (using HTML `<details>`/`<summary>`, zero JS). The choice draws on two compatible commitments:

1. **Sweller's worked-example effect** — complete worked examples *should be visible* to novices who need them, because partial / abstract examples increase extraneous load.
2. **NN/g progressive disclosure** ([[../docs/research/11-pedagogy/02-information-design/nng-progressive-disclosure]]) — but expert readers shouldn't be forced through them; they impose their own load on someone who's already past the worked-example need.

The collapsible-by-default resolves the tension: the worked example is *present* (Sweller satisfied) but *not always rendered* (NN/g satisfied). Anchor-based deep-linking (`#worked-example-{id}`) means a TL;DR or cheat-sheet can point a reader directly to the relevant example without forcing them to scroll through prose.

This is *layered disclosure*, not pure progressive disclosure: the example exists at every level of detail; the reader picks when to see it.

## Open questions deferred to v1.1+

These are real pedagogical questions but not blockers for v1.0. Recorded here (vs in PEDAGOGY.md's decision-log) because they're more about theoretical scope than active decisions:

- **Sub-chapter prerequisite tagging** — currently each chapter has one maturity level. Should sections within a chapter be tagged "this section assumes L3+ background"? Useful for advanced material in an L1-tagged chapter; complexity tradeoff. Revisit after 4-5 chapters land in v1.0. (Tracked as PEDAGOGY decision #9; DEFERRED to v1.1.)
- **Reader profile router on landing page** — explicit MDX-rendered version of the four-persona "How to Read" pathways. Blocked on Phase 0.7 scaffold component work.
- **Glossary integration** — `<TermDef>` + `<Term>` MDX components + a `glossary/` workspace member. Blocked on Phase 0.7 scaffold work. Will replace the implicit `[Vocab]` margin-note category once landed.
- **Live API playgrounds** — interactive Claude API examples embedded in chapters. Deferred to post-v1.0 per the project roadmap.
- **Re-audit cadence for fast-moving content** — the staleness banner triggers at 90 days but doesn't enforce a refresh. Add a CI check that fails the build for content > 90 days stale + `volatility: fast-moving` once Ch 1–5 are in v1.0.
- **Transfer-model (PFL framing) adoption** — guides-repo recon §6 surfaced productive-failure-learning as a pattern claude-books could adopt opportunistically. Currently P2 deferred; revisit during chapter v1.0 prose drafts. The pessimism note (per `detterman1993transfer`, `barnett2002when`): far transfer remains empirically rare; aspire to near-transfer within-domain + medium-transfer to adjacent technical roles, NOT far transfer to unrelated domains. Practitioner audience may not benefit as much as learning-guide audience.
- **Multi-paradigm presentation as a lint rule** — guides-repo recon §7 surfaced UDL multi-paradigm enforcement (warn if <2 paradigms declared per chapter). Currently P3 deferred until after 2-3 chapters land and the `paradigms[]` field shape emerges from real use.

## How to read this doc

- **As a chapter author**: skim once to know what theory each PEDAGOGY decision draws on; come back when a contributor questions a decision and you need to articulate the *why*.
- **As a reviewer**: when reviewing chapter prose, check that the prose respects the load-bearing theories (e.g., a section with 8 bullets violates Miller; a chapter with no retrieval prompts violates Bjork).
- **As a contributor proposing new pedagogical commitments**: add a new section here citing the theory + the cache note(s); add a corresponding decision-log row in PEDAGOGY.md with the convention.
- **For research updates**: when a research note in `docs/research/11-pedagogy/03-multimedia-learning/` revises a finding, update the relevant section here AND audit PEDAGOGY decisions that depend on it.

## Provenance

- 2026-05-23: original rationale sections drafted as part of the visual-pedagogy round (commit `f21706c` + subsequent refinements).
- 2026-05-24: extracted from PEDAGOGY.md to this doc per guides-recon §9 decision (date-prefixed design docs).
- Research backing: 47 source notes in `docs/research/11-pedagogy/` (5 sub-areas: doc-UX patterns, info-design, multimedia learning, handbook-genre, figure tech).
