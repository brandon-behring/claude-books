---
source_url: https://www.facs.org/media/u03akeux/multiple_choice_item_writing_guidelines.pdf
canonical_url: https://www.facs.org/for-medical-professionals/education/cme-resources/test-writing/
source_title: "American College of Surgeons, Division of Education — Multiple-Choice Item Writing Guidelines (Self-Assessment Credit: Post-Test Tips)"
fetched_at: 2026-06-01
last_verified_at: 2026-06-01
topic: pedagogy-cert-guide-genre
tier: T3-practitioner
cert_domains: []
cert_task_areas: []
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# ACS (American College of Surgeons) — credentialing/CME item-writing checklist

## Author + context

- Issued by the **American College of Surgeons, Division of Education** as guidance for authors writing **self-assessment / CME post-test** items (continuing-education credit). It is a **one-page operational checklist**, not a research paper.
- Tiered **T3** (a credentialing organization's practitioner guide, not peer-reviewed). But it is high-value here because it is exactly our genre: **a certification body telling subject-matter experts how to write the exam items that gate a credential.** Its bibliography cites the two T1 sources directly — **NBME, *Constructing Written Test Questions for the Basic and Clinical Sciences* (2016)** and **Brame (2013), Vanderbilt** ([[itemwriting-brame-vanderbilt]]) — so it is a faithful condensation of the canon.
- Useful as a **template for what a short in-book "how we write our Practice items" appendix could look like**: terse, categorized (Format vs. Content; Stem vs. Options), one bullet per rule.

## Core principle / theory

The guide splits rules into **Format** and **Content**, each subdivided into **General / Stem / Options**. Its model item is a single-best-answer with a labeled STEM and OPTIONS (one ANSWER + DISTRACTORs). Key rules:

- **Stem:** state it as a question or completion; **never** open with "Which of the following is true/false?" or "All of the following… EXCEPT"; word it **positively** (no *except*/*not*); make it answerable **without seeing the options**; exclude irrelevant/superfluous information.
- **Options:** grammar/tense consistent with the stem; **parallel in form**; **similar in length**; numerics in order and one format; **no more than four options, one correct best answer**; **avoid "All of the Above," "None of the Above," True/False, "Both A and B."**
- **Distractors:** plausible; homogeneous in content/length/grammar; mutually exclusive; free of clues.
- **Content:** one learning objective per item; avoid verbatim textbook phrasing; avoid opinion items.

## Empirical backing

- None of its own — it is a derivative checklist. Its evidentiary weight is **borrowed** from the sources it cites: the NBME guide ([[itemwriting-nbme-guide]]) and Brame/Vanderbilt ([[itemwriting-brame-vanderbilt]]), which in turn rest on the Haladyna–Downing–Rodriguez research line ([[itemwriting-haladyna-taxonomy]]).
- Value as **convergence evidence**: an independent credentialing body, working from the canon, lands on the *same* rules — strengthening confidence that these are field-wide standards, not one institution's idiosyncrasy.

## Application to a certification study guide

- This is the closest published analog to **what claude-books itself is building**: per-objective MCQs for a credential. The format ("≤4 options, one best answer, no all/none-of-the-above, positively-worded stem answerable without the options") can be adopted near-verbatim as our house item style.
- The **"one educational objective per item"** rule maps cleanly onto our chapter-objective structure: each Practice item should trace to exactly one Bloom-tagged chapter objective.
- Its **"avoid verbatim textbook phrasing"** rule is the practical guard against accidentally writing recognition-recall items lifted from our own prose.

## Concrete recommendations for claude-books

- **Adopt the ACS option rules wholesale as our house style:** ≤4 options, exactly one best answer, no "all/none of the above" or "both A and B", distractors parallel in form and similar in length. (Directly citable, certification-context.)
- **Each Practice item maps to one chapter learning objective** — enforce "construct each item to assess one educational learning objective" as a tagging rule in the item bank.
- **Stem answerable without options** — same as NBME's cover-the-options check; ACS states it as a flat rule, easy to put in a contributor guide.
- **No verbatim phrasing from the chapter** in any stem or option — paraphrase to keep items at application level.
- **Consider an in-book one-page "How our Practice items are written" note** modeled on this guide's Format/Content split, so community contributors (the CC BY edit-this-page audience) write conformant items.

## Quoted (citation-ready)

> "The stem should not begin with the phrase 'Which of the following is true/false?' or 'All of the following statements are correct EXCEPT.'"
>
> — American College of Surgeons, Division of Education, *Multiple-Choice Item Writing Guidelines*, "Stem"
>
> Anchor: `The stem should not begin with the phrase "Which of the following is true/false?"`

> "Word the stem positively; the stem should not contain negatively phrased items (for example, those with except or not in the lead-in question)."
>
> — ACS, *Multiple-Choice Item Writing Guidelines*, "Content Guidelines — Stem"
>
> Anchor: `Word the stem positively; the stem should not contain negatively phrased items`

> "Use no more than four answer options. There should be only one correct, best answer choice for each item. Avoid including 'All of the Above,' 'None of the Above,' True/False, 'Both A and B' type distractors as answer choices."
>
> — ACS, *Multiple-Choice Item Writing Guidelines*, "Options"
>
> Anchor: `Use no more than four answer options + Avoid including "All of the Above," "None of the Above," True/False, "Both A and B" type distractors`

> "The stem should be structured where a learner could answer the question without first seeing the options available."
>
> — ACS, *Multiple-Choice Item Writing Guidelines*, "Content Guidelines — Stem"
>
> Anchor: `The stem should be structured where a learner could answer the question without first seeing the options available`

> "Construct each item to assess one educational learning or instructional objective."
>
> — ACS, *Multiple-Choice Item Writing Guidelines*, "Content Guidelines — General"
>
> Anchor: `Construct each item to assess one educational learning or instructional objective`

## Cross-references

- See [[itemwriting-nbme-guide]] — the NBME manual ACS cites as its primary source; supplies the worked examples.
- See [[itemwriting-brame-vanderbilt]] — Brame (2013), the other source in ACS's bibliography.
- See [[itemwriting-haladyna-taxonomy]] — the peer-reviewed taxonomy these checklists ultimately derive from.
- See [[theory-blooms-taxonomy]] — "one educational objective per item" pairs with Bloom-tagged chapter objectives.
