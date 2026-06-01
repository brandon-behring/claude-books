---
source_url: https://site.ufvjm.edu.br/fammuc/files/2016/05/item-writing-guidelines.pdf
canonical_url: https://www.tandfonline.com/doi/abs/10.1207/S15324818AME1503_5
source_title: "Haladyna, Downing & Rodriguez (2002), A Review of Multiple-Choice Item-Writing Guidelines for Classroom Assessment, Applied Measurement in Education 15(3):309–334"
fetched_at: 2026-06-01
last_verified_at: 2026-06-01
topic: pedagogy-cert-guide-genre
tier: T1-official
cert_domains: []
cert_task_areas: []
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Haladyna–Downing–Rodriguez (2002) — the 31-rule item-writing taxonomy

## Author + context

- **Thomas M. Haladyna** (Arizona State University West), **Steven M. Downing** (University of Illinois at Chicago, College of Medicine), and **Michael C. Rodriguez** (University of Minnesota). Published in *Applied Measurement in Education*, 15(3), 309–334, 2002.
- This is the **definitive scholarly synthesis** of MC item-writing rules. It revises Haladyna & Downing's original 1989 taxonomy (43 rules, drawn from 46 textbook passages) down to a validated **31-guideline taxonomy**, cross-checked against 27 textbooks and 27 post-1990 research studies/reviews.
- It is the academic counterpart to the practitioner-facing [[itemwriting-nbme-guide]] (which cites Haladyna & Downing 1989a/b in its reference list). Where NBME gives worked clinical examples, this paper gives the rule list plus the **evidence weight** behind each rule.
- The same authors later expanded this into the textbook *Developing and Validating Test Items* (Haladyna & Rodriguez, Routledge, 2013).

## Core principle / theory

A validated taxonomy of **31 guidelines in five categories** (verbatim, abbreviated where noted). The categories: Content (1–8), Formatting (9–10), Style (11–13), Writing the Stem (14–17), Writing the Choices (18–31).

**Content:** (1) one specific content + single mental behavior per test specs; (2) important, not trivial content; (3) **use novel material to test higher-level learning** / paraphrase textbook language "to avoid testing for simply recall"; (4) keep items independent; (5) avoid over-specific/over-general content; (6) avoid opinion items; (7) avoid trick items; (8) keep vocabulary simple.

**Formatting/Style:** (9) use conventional formats **but AVOID the complex MC (Type K) format**; (10) format vertically; (11) edit/proof; (12) correct grammar; (13) minimize reading.

**Writing the Stem:** (14) clear directions; (15) **include the central idea in the stem, not the choices**; (16) avoid window dressing (excess verbiage); (17) **word the stem positively; avoid negatives such as NOT or EXCEPT** (if used, capitalize/boldface).

**Writing the Choices:** (18) **develop as many effective choices as you can, but research suggests three is adequate**; (19) **only one right answer**; (20) vary the key's location; (21) logical/numerical order; (22) keep choices non-overlapping; (23) **homogeneous in content and grammatical structure**; (24) **keep length about equal**; (25) **use None-of-the-above carefully**; (26) **avoid All-of-the-above**; (27) phrase choices positively; (28) **avoid clues** (a. specific determiners "always/never/completely/absolutely"; b. clang associations; c. grammatical inconsistencies; d. conspicuous correct choice; e. clueing pairs/triplets; f. absurd options); (29) **make all distractors plausible**; (30) **use typical errors of students to write distractors**; (31) use humor sparingly.

## Empirical backing

The paper tabulates each guideline's textbook endorsement and research support (Table 2). The **strongest-consensus rules** (the ones to never violate):

- **Guideline 15 — central idea in the stem: 100% endorsement, 0% against.**
- **Guidelines 28 & 29 — avoid clues / make distractors plausible: 96% endorsement, 0% against.**
- Guideline 24 (equal length) and Guideline 3 (novel material): 85% each.

Genuinely **contested** rules (use judgment): Guideline 25, *None-of-the-above*, is split — 44% for vs. 48% against; all five studies found NOTA **increases item difficulty**. Guideline 26, *All-of-the-above*, 70% for but 22% explicitly against.

The **number-of-options** guideline (18) had "received the most empirical study among all other guidelines." Haladyna & Downing (1993) found the **modal number of effective distractors per item was one**, and "about two thirds of all items had one or two effectively performing distractors." This empirical case for **three options** was later meta-analyzed by **Rodriguez (2005)**, *Three Options Are Optimal for Multiple-Choice Items: A Meta-Analysis of 80 Years of Research*, *Educational Measurement: Issues and Practice* 24(2):3–13 — see quote below.

## Application to a certification study guide

- The 31 rules are a **ready-made review checklist** for any item bank. Wire the five highest-consensus rules (15, 28, 29, plus 19 one-answer and 23 homogeneous) into a lightweight per-item lint pass.
- **Guideline 3 ("novel material") + Guideline 30 ("typical errors of students")** are the two rules that *generate* good items, not just police them: paraphrase rather than quote the book, and mine real misconceptions for distractors.
- The empirical **"three options"** result means our Practice items don't need a forced 4th/5th choice — better to write 3 strong options (1 key + 2 plausible distractors) than to pad with filler nobody picks.
- **Skip the contested formats**: no Type-K complex MC, no "all of the above", and "none of the above" only when an item would otherwise be trivially easy.

## Concrete recommendations for claude-books

- **Encode the high-consensus rules as a hard checklist** for every authored item: central idea in the stem (G15), exactly one defensible answer (G19), homogeneous options (G23), no clueing (G28), every distractor plausible (G29).
- **Default to 3 options** for retrieval-style Practice items (1 correct + 2 plausible distractors). Add a 4th only when a genuinely plausible third distractor exists. (Rodriguez 2005; Haladyna G18.)
- **Write distractors from documented misconceptions** about Claude/agent design (e.g., "subagents share the parent's context window", "hooks run asynchronously") — these are the field's real "typical errors". (G30.)
- **Paraphrase, never quote, the chapter prose in the stem** — verbatim phrasing collapses an application item into recognition recall. (G3.)
- **Ban "all of the above"; gate "none of the above"** behind a reviewer note explaining why the item needs it. (G25/G26.)
- **Word every stem and lead-in positively**; if a "NOT/EXCEPT" item is unavoidable, capitalize the negative. (G17.)

## Quoted (citation-ready)

> "A taxonomy of 31 multiple-choice item-writing guidelines was validated through a logical process that included two sources of evidence: the consensus achieved from reviewing what was found in 27 textbooks on educational testing and the results of 27 research studies and reviews published since 1990."
>
> — Haladyna, Downing & Rodriguez (2002), abstract, *Applied Measurement in Education* 15(3)
>
> Anchor: `A taxonomy of 31 multiple-choice item-writing guidelines was validated through a logical process`

> "15. Include the central idea in the stem instead of the choices. 16. Avoid window dressing (excessive verbiage). 17. Word the stem positively, avoid negatives such as NOT or EXCEPT."
>
> — Haladyna, Downing & Rodriguez (2002), Table 1, "Writing the stem"
>
> Anchor: `Include the central idea in the stem instead of the choices`

> "29. Make all distractors plausible. 30. Use typical errors of students to write your distractors."
>
> — Haladyna, Downing & Rodriguez (2002), Table 1, "Writing the choices"
>
> Anchor: `Make all distractors plausible + Use typical errors of students to write your distractors`

> "We support the current guideline, but we also think that three options are sufficient in most instances. The effort of developing that fourth option (the third plausible distractor) is probably not worth it."
>
> — Haladyna, Downing & Rodriguez (2002), §"Write as Many Plausible Distractors as You Can"
>
> Anchor: `we also think that three options are sufficient in most instances`

> "More 3-option items can be administered than 4- or 5-option items per testing time while improving content coverage, without detrimental effects on psychometric quality of test scores. Researchers have endorsed 3-option items for over 80 years with empirical evidence."
>
> — Rodriguez (2005), abstract, *Educational Measurement: Issues and Practice* 24(2):3–13
>
> Anchor: `More 3-option items can be administered than 4- or 5-option items per testing time while improving content coverage`

> "Given recent results and these arguments, NOTA should remain an option in the item-writer's toolbox, as long as its use is appropriately considered. However, given the complexity of its effects, NOTA should generally be avoided by novice item writers."
>
> — Haladyna, Downing & Rodriguez (2002), §"None of the Above Should Be Used Carefully"
>
> Anchor: `NOTA should remain an option in the item-writer's toolbox + NOTA should generally be avoided by novice item writers`

## Cross-references

- See [[itemwriting-nbme-guide]] — the practitioner manual built on this scholarship; identical rules with worked examples.
- See [[itemwriting-flaws-empirical]] — Pham et al. (2018) empirically test several of these guidelines on real exam data.
- See [[itemwriting-acs-credentialing]] — credentialing-org restatement that condenses this taxonomy into a one-page checklist.
- See [[theory-blooms-taxonomy]] — Guideline 3 ("novel material to test higher-level learning") is the Bloom *Apply/Analyze* hook at item level.
- See [[theory-bjork-desirable-difficulties]] — plausible distractors (G29) and 3-option items keep retrieval effortful without adding construct-irrelevant difficulty.
