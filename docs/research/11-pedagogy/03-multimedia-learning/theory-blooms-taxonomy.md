---
source_url: https://www.pearson.com/us/higher-education/program/Anderson-A-Taxonomy-for-Learning-Teaching-and-Assessing-A-Revision-of-Bloom-s-Taxonomy-of-Educational-Objectives-Complete-Edition/PGM52333.html
canonical_url: https://www.pearson.com/us/higher-education/program/Anderson-A-Taxonomy-for-Learning-Teaching-and-Assessing-A-Revision-of-Bloom-s-Taxonomy-of-Educational-Objectives-Complete-Edition/PGM52333.html
source_title: "A Taxonomy for Learning, Teaching, and Assessing: A Revision of Bloom's Taxonomy (Anderson & Krathwohl, 2001)"
fetched_at: 2026-05-23
last_verified_at: 2026-05-23
topic: pedagogy-multimedia-learning
tier: T1-official
cert_domains: []
cert_task_areas: []
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Bloom's Taxonomy (revised) — Anderson & Krathwohl 2001

## Author + context

- **Lorin W. Anderson** and **David R. Krathwohl** (with eight co-authors) led an 8-year revision (1995–2001) of **Benjamin Bloom's 1956** *Taxonomy of Educational Objectives, Handbook 1: Cognitive Domain*. Krathwohl was a co-author on the original 1956 taxonomy and bridged both editions.
- Published as *A Taxonomy for Learning, Teaching, and Assessing* (Longman / Pearson, 2001). Frequently abbreviated *Anderson & Krathwohl, 2001*.
- Theoretical lineage: the original 1956 taxonomy emerged from a multi-year American Psychological Association project to standardize educational-objective language. The 2001 revision (a) **converted nouns to verbs** (Knowledge → Remember; Comprehension → Understand), (b) **reordered top two levels** (Synthesis → Create now at the top; Evaluate now penultimate), and (c) **added a Knowledge Dimension** (Factual, Conceptual, Procedural, Metacognitive) crossed with the original *Cognitive Process Dimension* — yielding a 4 × 6 grid for objective writing.

## Core principle / theory

The taxonomy is a **hierarchy of cognitive complexity** intended for writing learning objectives. The six levels of the **Cognitive Process Dimension** (revised, 2001), from lowest to highest:

1. **Remember** — recognize, recall (verbs: define, list, identify, name)
2. **Understand** — explain, interpret, summarize, paraphrase, classify
3. **Apply** — use a procedure in a familiar or new situation; execute, implement
4. **Analyze** — differentiate, organize, attribute; break material into parts and detect how parts relate
5. **Evaluate** — make judgments based on criteria; critique, check
6. **Create** — produce a new or original work; generate, plan, produce

(The 1956 original used: Knowledge / Comprehension / Application / Analysis / Synthesis / Evaluation. The 2001 swap of top two places — Create above Evaluate — reflects research that *generating* something new is the most cognitively demanding act.)

Crossed with the **Knowledge Dimension** — Factual / Conceptual / Procedural / Metacognitive — it produces a 24-cell *Taxonomy Table* used to classify objectives, instructional activities, and assessments. A common course-design diagnostic: do your assessments target the *same* cells your objectives claim?

## Empirical backing

- Bloom (1956) was originally consensus-derived from APA committee work, not empirical at first; the **revision** (Anderson & Krathwohl 2001) draws on intervening cognitive-psychology research, particularly schema theory and metacognition.
- **Hattie's meta-meta-analyses** (*Visible Learning*, 2009, updated 2023) place "challenging goals" and "concept-level objectives" at d ≈ 0.50–0.75 effect size — Bloom-informed objective-writing is a documented contributor.
- **Course-alignment studies** (Biggs *Constructive Alignment*, 2003) show that explicit Bloom-level alignment between objectives, learning activities, and assessments produces measurably better learning outcomes; widely adopted in higher-ed accreditation frameworks (ABET, AACSB).
- Pedagogical content: hundreds of curriculum-design textbooks since 2001 use the revised taxonomy as their primary objective-writing framework.

## Application to written technical documentation

Technical-doc chapter outcomes are often implicit ("after this chapter you'll understand X") — *Understand* is one of six Bloom levels and the second-lowest. Translations:

- **Write per-chapter learning objectives using Bloom verbs.** "After this chapter you'll be able to *apply* X to your codebase" or "*evaluate* whether Y is appropriate" is stronger than "understand Y".
- **Ladder objectives upward across the book.** Early chapters: Remember + Understand. Middle: Apply + Analyze. Capstone / advanced: Evaluate + Create. This pairs naturally with [[theory-bruner-spiral-curriculum]] — each spiral pass targets a higher Bloom level on the same concept.
- **Match assessments to objectives.** If the objective is "Apply", the end-of-chapter exercise must require *use* of the technique, not just recall. The most common docs anti-pattern: stating an Apply-level objective and providing a Remember-level recap.
- **Use the Knowledge Dimension to diversify exercises.** Mix factual ("list the 3 hook events"), conceptual ("why are hooks evaluated synchronously?"), procedural ("write a hook that…"), and metacognitive ("how would you decide whether a use case needs a hook or a subagent?") items.
- **Bloom levels signal expected reader effort.** Mark sections "Apply" or "Evaluate" so readers know they're being asked to *do*, not just *read*. This is a CTML signaling cue.

## Concrete recommendations for claude-books

- **Each chapter opens with 2–4 Bloom-verb learning objectives** ("By the end of this chapter you will be able to…"). Mix levels; avoid all-"Understand" sets.
- **Ladder objectives across volumes**: Volume 1 (Build) emphasizes Apply + Analyze; Volume 2 (Architect) Evaluate + Create; Volume 3 (Govern) Evaluate + Create at the system level.
- **Match end-of-chapter exercises to objective levels.** An Apply objective → an apply-the-technique exercise. An Evaluate objective → a critique-this-design exercise. Don't end an Apply chapter with a multiple-choice recall quiz.
- **Diversify the Knowledge Dimension across exercises** within a chapter — at least one factual, one conceptual, one procedural per chapter; sprinkle metacognitive prompts in capstone chapters.

## Quoted (citation-ready)

> "The Cognitive Process Dimension in the revised Taxonomy contains six categories: Remember, Understand, Apply, Analyze, Evaluate, and Create. The continuum underlying the cognitive process dimension is assumed to be cognitive complexity; that is, Understand is believed to be more cognitively complex than Remember, Apply is believed to be more cognitively complex than Understand, and so on."
>
> — Anderson & Krathwohl (2001), *A Taxonomy for Learning, Teaching, and Assessing*, Ch. 5
>
> Anchor: `Cognitive Process Dimension + The Cognitive Process Dimension in the revised Taxonomy contains six categories`

> "Two major changes from the original framework are evident: the nouns of the original framework have been replaced with verbs (e.g., Knowledge becomes Remember), and the top two categories have been interchanged in the revised framework (with Create at the top, above Evaluate). The interchange reflects more recent thinking about the relative cognitive complexity of these processes."
>
> — Anderson & Krathwohl (2001), Ch. 1
>
> Anchor: `Two major changes + Two major changes from the original framework are evident`

> "Alignment among objectives, instruction, and assessment is fundamental to good teaching. A taxonomy table makes the alignment problem visible: you can locate each objective, each activity, and each assessment in the same grid and see whether they cluster."
>
> — Anderson & Krathwohl (2001), Ch. 1 ("How is the Taxonomy Used?")
>
> Anchor: `Alignment + Alignment among objectives, instruction, and assessment is fundamental`

## Cross-references

- See [[theory-bruner-spiral-curriculum]] — each spiral pass over a concept should target a higher Bloom level.
- See [[theory-bjork-desirable-difficulties]] — retrieval prompts should be drafted at Apply / Analyze level (not just Remember) to maximize transfer.
- See [[theory-mayer-multimedia-principles]] — Bloom-level objectives are a form of *signaling* (Mayer's signaling principle) at the chapter scale.
- See [[theory-sweller-cognitive-load]] — higher Bloom levels require more working-memory capacity; pre-train terminology before pushing readers to Apply / Evaluate work.
