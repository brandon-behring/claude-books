---
source_url: https://pmc.ncbi.nlm.nih.gov/articles/PMC10711986/
canonical_url: https://doi.org/10.15694/mep.2018.0000225.1
source_title: "Pham, Besanko & Devitt (2018), Examining the impact of specific types of item-writing flaws on student performance and psychometric properties of the multiple choice question, MedEdPublish 7:225"
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

# Pham, Besanko & Devitt (2018) — do item-writing flaws actually change scores?

## Author + context

- **Huy Pham, John Besanko, Peter Devitt** (University of Adelaide). Published in *MedEdPublish* (an AMEE/MedEdPublish peer-reviewed venue), 2018; DOI 10.15694/mep.2018.0000225.1. (The PMC mirror is PMC10711986.)
- This is the **empirical reality-check** on the rule taxonomies. The rules in [[itemwriting-haladyna-taxonomy]] and [[itemwriting-nbme-guide]] are mostly **consensus/logic-derived**; this study asks the harder question — *when you actually inject a specific flaw into real exam items, do difficulty and discrimination move the way the rules predict?*
- Tiered **T1** (peer-reviewed empirical study). It earns inclusion because it keeps our recommendations **honest**: it both *supports* the rules' value (flaws cause unpredictability → loss of validity) and *complicates* the folk claim that flaws simply make items easier.

## Core principle / theory

The study experimentally manipulated **10 item-writing flaws** drawn straight from the NBME/Haladyna canon: (1) window dressing / excess verbiage, (2) longest choice is correct, (3) clues via paired options, (4) none/all of the above, (5) negatively phrased questions, (6) lack of stem direction, (7) central idea in the choices rather than the stem, (8) options out of logical/numerical order, (9) clues via eponymous terms, (10) implausible distractors.

Core finding: **the effect of flaws is real but not systematic or directional.** Only **4 of 10** hypothesized effects materialized, and they did not move the standard psychometric indices (difficulty, discrimination) in a clean, predictable way. The takeaway is **not** "flaws don't matter" — it is that flaws inject **unpredictable construct-irrelevant variance**, which is precisely a *validity* threat even when average difficulty barely budges.

## Empirical backing

- This *is* the empirical layer. Of the four confirmed effects, three flaws ("longest choice correct", eponymous-term clues, implausible distractors) shifted mean scores in the cueing direction; one ("central idea in choices") shifted them the other way. None significantly moved the difficulty or discrimination indices on its own.
- Reconciles with the contested-rules picture in [[itemwriting-haladyna-taxonomy]] (e.g., NOTA's effects were "complex" across studies) and with [[itemwriting-nbme-guide]]'s framing of flaws as **construct-irrelevant variance** rather than uniform difficulty changes.

## Application to a certification study guide

- Reframes *why* we follow item-writing rules: not because each flaw reliably gifts a point, but because flaws make scores **noisier and less valid** in ways we can't predict per-item. For a credential, **validity** (the score means what it claims) is the whole point — so the rules are worth following even when any single flaw's effect is small.
- Justifies a **lightweight-but-non-optional** lint pass: we don't need elaborate psychometric machinery, but we *do* need to eliminate the named flaws, because their aggregate effect is unpredictable error.
- Tempers over-claiming in the book: we should say "these rules protect validity," not "these flaws make questions easier" (the evidence doesn't support the latter as a clean rule).

## Concrete recommendations for claude-books

- **Frame our item-writing standard around validity, not difficulty:** the reason to ban implausible distractors, longest-answer-is-correct, and clueing is that they add unpredictable error — cite Pham et al. for this.
- **Keep the flaw-removal checklist mandatory but proportionate** — eliminate the 10 named flaws; don't build heavy item-analysis tooling we can't feed with real response data. (Matches the project's anti-over-engineering reflex.)
- **Prioritize the three flaws this study found do shift scores** — "longest choice is correct", clang/eponymous cues, and implausible distractors — as the top items in any review pass.
- **Don't tell readers a flawed item is necessarily "easier"** — the honest claim is "flawed items threaten validity." Use this nuance if the book discusses assessment quality.

## Quoted (citation-ready)

> "The effect of IWFs is neither systematic nor predictable. Unpredictability in assessment produces error and thus loss of validity."
>
> — Pham, Besanko & Devitt (2018), *Examining the impact of specific types of item-writing flaws…*, *MedEdPublish* 7:225
>
> Anchor: `The effect of IWFs is neither systematic nor predictable. Unpredictability in assessment produces error and thus loss of validity`

> "The hypothesised effect of IWFs on mean item scores was confirmed in only 4 out of 10 cases."
>
> — Pham, Besanko & Devitt (2018), *MedEdPublish* 7:225
>
> Anchor: `The hypothesised effect of IWFs on mean item scores was confirmed in only 4 out of 10 cases`

## Cross-references

- See [[itemwriting-nbme-guide]] — the source of the flaw taxonomy this study tests; its "construct-irrelevant variance" framing is what this paper empirically confirms.
- See [[itemwriting-haladyna-taxonomy]] — the contested-rule entries (NOTA, all-of-the-above) line up with this study's "effects are complex/unpredictable" result.
- See [[theory-bjork-desirable-difficulties]] — distinguishes *desirable* difficulty (good for learning) from the *construct-irrelevant* difficulty flaws inject (bad for measurement).
