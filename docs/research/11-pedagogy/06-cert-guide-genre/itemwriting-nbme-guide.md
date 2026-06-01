---
source_url: https://www.nbme.org/sites/default/files/2021-02/NBME_Item%20Writing%20Guide_R_6.pdf
canonical_url: https://www.nbme.org/sites/default/files/2021-02/NBME_Item%20Writing%20Guide_R_6.pdf
source_title: "NBME Item-Writing Guide: Constructing Written Test Questions for the Health Sciences (6th ed., October 2024)"
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

# NBME Item-Writing Guide — Constructing Written Test Questions (6th ed., 2024)

## Author + context

- Published by the **National Board of Medical Examiners (NBME)** — the body behind the USMLE. The PDF fetched is the **6th edition, October 2024**, retitled *Constructing Written Test Questions for the Health Sciences* (earlier editions, including the widely cited 2002/2016 ones, used "…for the Basic and Clinical Sciences"). Copyright line: "© 1996, 1998, 2001, 2002, 2016, 2020, 2024 NBME."
- Contributors (2024): Melissa S. Billings, Kristine DeRuchie, Steven Go MD, Kimberly A. Swygert PhD, Miguel A. Paniagua MD, and others. Prior-edition authors include **Susan M. Case** and **David B. Swanson** — the names most associated with the classic guide.
- This is **the** canonical practitioner-facing item-writing manual in high-stakes credentialing. It is more prescriptive and example-driven than the academic Haladyna taxonomy ([[itemwriting-haladyna-taxonomy]]); the two agree on essentially every rule. The guide's own reference list cites Haladyna & Downing (1989a/b) and Haladyna & Rodriguez (2013), so it is downstream of the same scholarship.
- Genre note: NBME's entire model is the **one-best-answer item built on a clinical/experimental vignette** — a scenario-based, application-level item. This is exactly the model a certification study guide wants to imitate.

## Core principle / theory

NBME organizes item quality around eliminating **two families of "technical item flaws"**:

1. **Irrelevant difficulty** — flaws that make the item hard for reasons unrelated to the construct (long/complex options, inconsistent numeric formats, vague frequency terms, complicated stems). These add construct-irrelevant variance.
2. **Testwiseness** — flaws that let "savvy" test-takers guess without the knowledge (grammatical cues, collectively-exhaustive option subsets, absolute terms, the correct option standing out by length, word repetition / "clang clues").

The constructive half is **five basic rules for one-best-answer items** (Ch. 5):

- **Rule 1:** focus each item on an important concept/testing point (from the blueprint).
- **Rule 2:** assess **application of knowledge, not recall of an isolated fact** — explicitly framed against Bloom's taxonomy.
- **Rule 3:** the lead-in must be **focused, closed, and clear** — answerable from vignette + lead-in alone.
- **Rule 4:** options must be **homogeneous and plausible** (rank-orderable on one dimension).
- Plus the **"cover-the-options" rule**: if the lead-in is properly focused, a test-taker should be able to cover the options and still produce the answer.

## Empirical backing

- The guide is a consensus/expertise document (NBME's institutional practice across 25+ years of USMLE development), not itself an empirical study. Its authority is **eight editions of refinement** plus alignment with the peer-reviewed Haladyna line of research it cites.
- The "cover-the-options" rule and homogeneous-options rule trace to Downing et al.'s NBME-data studies (cited inside [[itemwriting-haladyna-taxonomy]]: Downing 1991 on focused vs. unfocused stems).
- Independent empirical replication of the *flaw* taxonomy: [[itemwriting-flaws-empirical]] (Pham, Besanko & Devitt 2018) tested 10 NBME-style flaws on real exam data.

## Application to a certification study guide

- The vignette → lead-in → one-best-answer structure is a ready-made template for **scenario/Practice items** in a cert book: give a short realistic situation, ask "Which of the following is the most appropriate next step?", supply 4 homogeneous options on one continuum.
- **Rule 2 (application not recall)** is the single most transferable idea: a recall item ("Which flag enables X?") becomes an application item by wrapping it in a scenario where the reader must *decide* which tool/flag fits the situation described.
- The **"cover-the-options" test** is a free QA check for every item we write: cover the choices; if a knowledgeable reader can't produce the answer from the stem alone, the stem is under-specified.
- The two-flaw lens (irrelevant difficulty vs. testwiseness) is a compact review checklist for our question banks.

## Concrete recommendations for claude-books

- **Adopt the vignette+lead-in template for Practice items.** Stem = a 2–4 sentence concrete scenario; lead-in = one closed question ("Which of the following is the most appropriate…?"). Avoid open lead-ins like "The best approach is:".
- **Run the "cover-the-options" check on every authored item.** If the answer isn't derivable from the stem alone, rewrite the stem — don't lean on the options.
- **Default to one-best-answer; never use complex true/false (K-type), "all of the above", or "none of the above".** NBME has *removed* these from its exams entirely.
- **Keep all options homogeneous and rank-orderable on a single dimension** (all "next steps", all "root causes"), of similar length and grammar.
- **Purge the named testwiseness flaws** during review: grammatical mismatch with the lead-in, the longest/most-detailed option being correct, absolute terms ("never", "always") only in distractors, and stem words echoed in the key ("clang clues").
- **Match vignette detail to reader level** — a foundations-cert reader gets a "typical/classic" scenario; advanced material may add atypical features.

## Quoted (citation-ready)

> "There are two kinds of technical item flaws: 1. A flaw that adds irrelevant difficulty to the item can confuse all test-takers… 2. A flaw that cues the more savvy and confident test-takers (aka the 'testwise') and aids them in guessing the right answer."
>
> — NBME, *Constructing Written Test Questions for the Health Sciences* (6th ed., 2024), Ch. 3
>
> Anchor: `two kinds of technical item flaws + A flaw that adds irrelevant difficulty to the item can confuse all test-takers`

> "RULE 2: Each item should assess application of knowledge, not recall of an isolated fact… Recall items make it difficult for the educator to assess any higher level within Bloom's taxonomy, such as 'application of knowledge.'"
>
> — NBME (2024), Ch. 5, Basic Rules for Writing One-Best-Answer Items
>
> Anchor: `RULE 2 + Each item should assess application of knowledge, not recall of an isolated fact`

> "If a lead-in is properly focused, a test-taker should usually be able to read the vignette and lead-in, cover the options, and guess the correct answer without seeing the option set… When writing items, covering the options and attempting to answer the item is a good way to check whether this rule has been followed."
>
> — NBME (2024), Ch. 2, "Cover-the-Options" Rule
>
> Anchor: `Cover-the-Options + If a lead-in is properly focused, a test-taker should usually be able to read the vignette and lead-in, cover`

> "All options should be homogeneous so that they can be judged as entirely true or entirely false on a single dimension."
>
> — NBME (2024), Ch. 2, General Rules for One-Best-Answer Items
>
> Anchor: `homogeneous + All options should be homogeneous so that they can be judged as entirely true or entirely false on a single dimension`

> "The phrase 'None of the above' is problematic in items for which judgment is involved and the options are not absolutely true or false… Use of 'None of the above' essentially turns the item into a true-false item."
>
> — NBME (2024), Ch. 3, Flaws Related to Irrelevant Difficulty
>
> Anchor: `None of the above + The phrase "None of the above" is problematic in items for which judgment is involved`

> "Application of knowledge items… require test-takers to read an item and identify relevant information, interpret that information in a certain context, integrate that information with what they already know, and then answer the question posed. Vignette-based items… often provide a vehicle for eliciting the demonstration of these higher-order thinking skills."
>
> — NBME (2024), Ch. 6, Determining Level of Cognition to Assess
>
> Anchor: `Application of knowledge items + require test-takers to read an item and identify relevant information, interpret that information in a certain context`

## Cross-references

- See [[itemwriting-haladyna-taxonomy]] — the peer-reviewed 31-rule taxonomy NBME's guide is consistent with and cites; same author lineage (Haladyna/Downing/Rodriguez).
- See [[itemwriting-flaws-empirical]] — empirical test (Pham et al. 2018) of whether NBME-style flaws actually shift difficulty/discrimination.
- See [[itemwriting-acs-credentialing]] — a short credentialing/CME guide that explicitly cites this NBME manual as its source.
- See [[theory-blooms-taxonomy]] — Rule 2 ("application not recall") is the operational link from Bloom's *Apply* level to item construction.
- See [[itemwriting-brame-vanderbilt]] — university-level restatement of the same stem/distractor rules with a "definite problem" framing.
