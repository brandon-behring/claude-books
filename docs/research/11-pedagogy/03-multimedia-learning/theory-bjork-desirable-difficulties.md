---
source_url: https://bjorklab.psych.ucla.edu/research/
canonical_url: https://bjorklab.psych.ucla.edu/research/
source_title: "Desirable Difficulties + Retrieval Practice + Interleaving (Bjork & Bjork)"
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

# Bjork — Desirable Difficulties (interleaving, spacing, retrieval practice)

## Author + context

- **Robert A. Bjork** (Distinguished Research Professor, UCLA) and **Elizabeth Ligon Bjork** (UCLA). Bjork Learning & Forgetting Lab. Robert coined the phrase "desirable difficulties" in a 1994 chapter ("Memory and metamemory considerations in the training of human beings", in *Metacognition: Knowing about knowing*, MIT Press).
- Theoretical lineage: builds on the spacing effect (first reported by Ebbinghaus, 1885), the testing effect (Roediger & Karpicke), and the *New Theory of Disuse* (Bjork & Bjork 1992) — which distinguishes **storage strength** (how durably something is stored) from **retrieval strength** (how accessible it currently is). Counterintuitive prediction: low retrieval strength *during practice* often increases storage strength *after practice*.

## Core principle / theory

"Desirable difficulties" are training conditions that **slow apparent acquisition** but **improve long-term retention and transfer**. The umbrella covers four well-studied interventions:

1. **Spacing** — distribute study over time rather than massing it. Same total study time spread over a week beats the same time crammed in one session.
2. **Interleaving** — mix different topics or problem types within a session rather than blocking (AAABBBCCC vs. ABCABCABC). Forces the learner to repeatedly select the right strategy, deepening discrimination.
3. **Retrieval practice** (the *testing effect*) — actively recalling material from memory (low-stakes quizzes, flashcards, free recall) produces dramatically better retention than re-reading. Roediger & Karpicke (2006) showed re-reading produced ~1-week retention near zero above baseline; retrieval practice retained ~70%+ at 1 week.
4. **Varying conditions of practice** (context variation) — practicing in multiple contexts (locations, problem framings, examples) improves transfer to new contexts.

These are *desirable* difficulties — they feel harder, learners often *believe* they are learning less, but post-tests show the opposite. Bjork's central methodological point: **your subjective sense of learning during practice is an unreliable guide.**

## Empirical backing

- **Spacing effect**: Cepeda et al. (2008) meta-analysis of **317 experiments** — optimal spacing gap is roughly 10–20% of the retention interval; consistent d ≈ 0.4–0.7.
- **Interleaving in math**: Rohrer & Taylor (2007), Rohrer, Dedrick & Stershic (2015) — middle schoolers who interleaved problem types scored **~76% on a delayed test vs. 38%** for blocked practice. *Twice* the retention from the same total exposure.
- **Testing effect**: Roediger & Karpicke (2006) — students who took practice tests retained 61% of material after one week, vs. 40% for re-readers. Repeated retrieval (3 tests) hit 75%.
- **Retrieval > rereading even when subjective rating disagrees**: Karpicke & Blunt (2011) — learners rated re-reading as more effective; objective post-tests showed retrieval-practice group scoring **50% higher** on transfer.
- **Variation effect**: Schmidt & Bjork (1992) — varied practice produces worse acquisition curves but better transfer to novel problems.

## Application to written technical documentation

Most documentation is *all blocked, no interleaving, no retrieval*. Translations:

- **Add end-of-chapter retrieval prompts**, not just summaries. "Without looking back, list the 3 things `Edit` will refuse to do" is a retrieval-practice intervention; "Here's a summary…" is a rereading intervention (which is what most docs default to).
- **Interleave examples** across chapters — when introducing a new technique in chapter 7, include a worked example that revisits a problem from chapter 3 alongside a chapter-7-specific one. Pure block organization is convenient for reference but suboptimal for first-read learning.
- **Spaced revisits**: design a book so a concept introduced in chapter 2 reappears in chapters 5 and 9 in new contexts. This is the [[theory-bruner-spiral-curriculum]] in modern empirical clothing.
- **Vary examples**: when explaining a pattern, give two examples from *different domains* (e.g., a CI/CD pipeline + a data-pipeline) rather than two of the same flavor. Variation builds transferable schemas.
- **Cheat sheets are fine for reference but dangerous for learning** — they reduce retrieval-practice opportunities and inflate metacognitive confidence ("I have it in front of me, I must know it"). Provide them as appendix, not as primary learning surface.

## Concrete recommendations for claude-books

- **Every chapter ends with 2–4 retrieval prompts** ("close the book and answer X") before any summary, not a recap. Summaries are rereading.
- **Spiral structure**: pick 4–6 cross-cutting concepts that each appear in ≥ 3 chapters in increasing depth (e.g., context windows, hook lifecycle, tool design, MCP). Avoid one-shot "this concept only appears here" organization for foundational ideas.
- **Worked-example variation**: when teaching a pattern, provide ≥ 2 examples from different domains, not two from the same domain.
- **Resist over-summarizing**: a "key takeaways" box is rereading; a "what would you do if…" box is retrieval. Bias toward the latter.

## Quoted (citation-ready)

> "Conditions of instruction that appear to create difficulties for the learner, slowing the rate of apparent learning, often optimize long-term retention and transfer. We have called such conditions desirable difficulties."
>
> — Bjork & Bjork (2011), "Making things hard on yourself, but in a good way", in *Psychology and the Real World*, Ch. 5
>
> Anchor: `desirable difficulties + Conditions of instruction that appear to create difficulties`

> "Repeated retrieval practice produces large gains in long-term retention compared with repeated study. Strikingly, learners themselves often predict the opposite pattern, judging repeated study to be more effective even when it produces dramatically worse retention."
>
> — Roediger & Karpicke (2006), "Test-enhanced learning", *Psychological Science* 17(3), p. 249
>
> Anchor: `retrieval practice + Repeated retrieval practice produces large gains in long-term retention`

> "Interleaving practice problems of different kinds improves later test performance compared with blocking practice of one kind at a time, even though learners typically rate blocked practice as more effective during the practice phase."
>
> — Rohrer, Dedrick & Stershic (2015), *Journal of Educational Psychology* 107(3)
>
> Anchor: `interleaving + Interleaving practice problems of different kinds improves later test performance`

## Cross-references

- See [[theory-sweller-cognitive-load]] for the apparent tension: CLT reduces load, desirable-difficulties *introduces* difficulty. Resolution: *extraneous* load (poor layout) is bad; *processing-effort* difficulty (retrieval, interleaving) is good — it converts to germane / schema-building work.
- See [[theory-bruner-spiral-curriculum]] — spiral curriculum is the structural counterpart to spaced retrieval at the book level.
- See [[theory-blooms-taxonomy]] — retrieval-prompt items should ladder up Bloom's levels (start with Remember, push to Apply / Analyze in later visits).
- See [[theory-mayer-multimedia-principles]] for the complementary "reduce extraneous load" view.
