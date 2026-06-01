---
source_url: https://www.ciscopress.com/store/ccna-200-301-official-cert-guide-volume-1-9780135792735
canonical_url: https://www.ciscopress.com/store/ccna-200-301-official-cert-guide-volume-1-9780135792735
source_title: "Pearson 'Official Cert Guide' (Cisco Press) — 'Do I Know This Already?' diagnostic + Foundation Topics + Exam Preparation Tasks"
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

# Pearson "Official Cert Guide" — pre-chapter diagnostic + layered review tasks

## Author + context

- **Publisher series**: Pearson IT Certification "Official Cert Guide" — the Cisco Press flagship line (e.g. *CCNA 200-301 Official Cert Guide* by Wendell Odom), and the **only self-study resources approved by Cisco**. Verbatim feature descriptions fetched from the **Cisco Press / Pearson product page** for *CCNA 200-301 Official Cert Guide, Volume 1*.
- Tier note: this is a publisher product/marketing page describing its own series conventions, so **T3-practitioner** (publisher's self-description), not T1. The conventions themselves are stable and decades-old, but the source altitude is a vendor page, not an accreditation document.
- The OCG is the genre's most *elaborately scaffolded* format: it brackets every chapter with a **pre-read diagnostic** and a **post-read drill stack**, then layers chapter-, part-, and book-level review. It is the richest precedent for a multi-tier review apparatus.

## Core principle / theory

The OCG chapter is a fixed three-stage pipeline, plus cross-chapter review:

1. **"Do I Know This Already?" (DIKTA) quiz** opens each chapter. Its job is *routing*: a self-diagnostic that tells the reader whether to read the chapter closely, skim, or skip. This is the up-front, per-chapter analog of a whole-book diagnostic assessment test.
2. **Foundation Topics** — the explanatory core (the reference prose), keyed to exam topics; "Exam topic lists make referencing easy."
3. **Exam Preparation Tasks** — a *post-read drill stack* at chapter end: review key topics, complete memory tables, define key terms, etc. Distinct from the explanatory body; pure consolidation.
4. **Layered review beyond the chapter**: "chapter-ending *and* part-ending exercises," then a whole-book **Pearson Test Prep practice-test engine** with "hundreds of well-reviewed, exam-realistic questions."

The deep structural insight is the **two-tier question design**: light *diagnostic/recall* items live inside the book (DIKTA + chapter review), while *full exam-realistic* practice lives in a separate, larger pooled bank. Review questions and practice-exam questions do different jobs and live in different places — exactly the split the Architect's Reference review-apparatus plan needs.

## Empirical backing

No published effect sizes (vendor source). The convergent backing is (a) longevity and Cisco's exclusive approval, and (b) tight alignment with [[theory-bjork-desirable-difficulties]]: DIKTA is pre-testing (a known retrieval/“pretesting effect” intervention), the Exam Preparation Tasks are spaced retrieval, and part-ending exercises interleave across chapters. The OCG essentially operationalizes testing-effect + spacing + interleaving inside a single book.

## Application to a certification study guide

The OCG gives the Architect's Reference a concrete model for the *review apparatus* the template still needs to firm up:

- **DIKTA → adopt a per-chapter "Do you already know this?" router.** The current template has only a *post*-chapter self-check; OCG shows the value of a *pre*-chapter diagnostic that lets an experienced reader (the Architect's Reference assumes prior experience) skip or skim. Cheap to add: 3–5 recall items at chapter top with an "if you miss N, read closely" rubric.
- **Separate "key topics" tagging from prose** — OCG flags the must-know items inline so the end-of-chapter drill can target them. The template's learning-objectives box can double as the key-topic list the self-check pulls from.
- **Three review altitudes**: chapter-level (self-check), part/domain-level (a Part-closing review that interleaves its chapters), and book-level (a pooled practice exam). The template currently only has chapter-level; OCG argues for adding the Part-level and book-level tiers.
- **Two-tier question split is the headline import**: inline retrieval items (small, recall, with rationale) vs. a separate full practice-exam bank (larger, scenario, exam-realistic). Keep them physically and tonally distinct.

## Concrete recommendations for claude-books

- **Add a per-chapter pre-diagnostic** ("Do I already know this?": 3–5 retrieval items + a skip/skim/read rubric) above the reference prose, mirroring DIKTA — high value for an experience-assuming reference.
- **Build the review apparatus in three tiers**: (1) inline chapter self-check (the existing Exercise + 2–3 Practice items), (2) a **Part/domain-closing review** that interleaves the chapters in that D-Part, (3) a **book-level practice exam** drawn from a separate pooled bank. This directly informs the book's review-question planning.
- **Tag "key topics" inline** so the end-of-chapter retrieval items target the flagged must-knows, not arbitrary facts. Reuse the learning-objectives box as that key-topic register.
- **Keep the two question tiers distinct in kind**: in-chapter items = short recall with rationale; the pooled bank = longer scenario/exam-realistic items. Do not let the chapter self-check try to be a practice exam.
- **Make part-ending review interleave** across the Part's chapters (mix task areas) rather than re-quizzing one chapter — the interleaving is the point.

## Quoted (citation-ready)

> "'Do I Know This Already?' quizzes open each chapter and enable you to decide how much time you need to spend on each section."
>
> — *CCNA 200-301 Official Cert Guide, Volume 1*, publisher feature description (Cisco Press / Pearson)
>
> Anchor: `Official Cert Guide DIKTA + Do I Know This Already quizzes open each chapter`

> "Chapter-ending and part-ending exercises, which help you drill on key concepts you must know thoroughly." / "Chapter-ending Exam Preparation Tasks help you drill on key concepts you must know thoroughly."
>
> — *CCNA 200-301 Official Cert Guide, Volume 1*, feature description (Cisco Press / Pearson)
>
> Anchor: `Official Cert Guide exercises + Chapter-ending and part-ending exercises`

> "The powerful Pearson Test Prep Practice Test software, complete with hundreds of well-reviewed, exam-realistic questions, customization options, and detailed performance reports."
>
> — *CCNA 200-301 Official Cert Guide, Volume 1*, companion-website / test-engine description
>
> Anchor: `Pearson Test Prep + hundreds of well-reviewed, exam-realistic questions`

> "Exam topic lists make referencing easy."
>
> — *CCNA 200-301 Official Cert Guide, Volume 1*, feature description (Cisco Press / Pearson)
>
> Anchor: `Official Cert Guide topic lists + Exam topic lists make referencing easy`

## Cross-references

- See [[genre-exam-ref-microsoft]] — Exam Ref does *post*-chapter Thought experiments only; OCG adds a *pre*-chapter DIKTA. Together they bracket the chapter (pre-diagnostic + post-retrieval) — the combined pattern to adopt.
- See [[genre-sybex-study-guide]] — Sybex's whole-book "Assessment Test" is the book-level cousin of DIKTA; OCG pushes the diagnostic down to per-chapter granularity.
- See [[genre-blooms-test-blueprint]] — the two-tier split (recall review vs. scenario practice) is a Bloom's-level split: chapter items at Remember/Understand, practice-exam items at Apply/Analyze.
- See [[theory-bjork-desirable-difficulties]] — DIKTA = pretesting; Exam Preparation Tasks = spaced retrieval; part-ending exercises = interleaving.
