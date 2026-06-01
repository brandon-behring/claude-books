---
source_url: https://comptiacdn.azureedge.net/webcontent/docs/default-source/exam-objectives/comptia-a-220-1001-exam-objectives.pdf
canonical_url: https://www.comptia.org/en-us/certifications/
source_title: "CompTIA Exam Objectives document — domain weighting + objective numbering + 'examples are not exhaustive' (A+ Core 1, 220-1001, v5.0)"
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

# CompTIA Exam Objectives — the canonical blueprint a study guide maps to

## Author + context

- **Source body**: CompTIA (the certifying body itself). The artifact is the official **Exam Objectives** document — the public, downloadable blueprint CompTIA publishes for every exam. Fetched the real PDF for **A+ Core 1 (220-1001), Version 5.0** from CompTIA's own CDN, and cross-checked the live **Security+ SY0-701** domain weights from comptia.org.
- This note is about the *upstream artifact* every cert study guide is built against. Sybex, Pearson, and Exam Ref all derive their chapter maps from a document shaped exactly like this one. For the Architect's Reference, the analog is the published *Claude Certified Architect — Foundations* D1–D5 task-area taxonomy.
- A CompTIA objectives doc is short (front matter + a numbered objective tree) and is itself a *worked model* of how to express "what is tested, and how much."

## Core principle / theory

The objectives document encodes the blueprint in a strict, reusable shape:

1. **A domain-weighting table.** A single table lists each domain (1.0, 2.0, …) with a **percentage of examination**, summing to 100%. Example (A+ Core 1): Mobile Devices 14% · Networking 20% · Hardware 27% · Virtualization & Cloud 12% · Hardware & Network Troubleshooting 27%. Example (Security+ SY0-701): General Security Concepts 12% · Threats/Vulns/Mitigations 22% · Security Architecture 18% · Security Operations 28% · Security Program Management 20%. The percentage *is* the study-time allocation signal.
2. **Three-level numbering**: Domain (`1.0`) → Objective (`1.1`, framed "Given a scenario, …") → bulleted sub-examples. Feedback/citations reference "domain, objective number, and bullet or sub bullet" — the hierarchy is addressable.
3. **"Examples are not exhaustive" disclaimer.** The bulleted examples under each objective explicitly do *not* bound the exam: "Other examples … may also be included on the exam although not listed." This protects against teaching-to-the-bullets.
4. **A "use this to guide your studies" framing** plus a candidate-skills summary ("Successful candidates will have the knowledge required to: …") at the top — the objectives doc doubles as the learning-objective master list.

## Empirical backing

Process-empirical, not study-empirical: CompTIA states the objectives "result from subject matter expert workshops and industry-wide survey results," and the credential is "accredited by ANSI to show compliance with the ISO 17024 Standard." So the domain weights are not editorial guesses — they are job-task-analysis outputs under an accreditation regime. That is the defensible basis for *weighting coverage by domain* rather than by page count, and connects to the table-of-specifications logic in [[genre-blooms-test-blueprint]].

## Application to a certification study guide

The objectives document is the contract; the study guide is the implementation. For the Architect's Reference:

- The book's **coverage budget should track the published task-area emphasis**, the way a CompTIA-aligned guide gives Security Operations (28%) more chapters/pages than General Security Concepts (12%). If the CCA-F taxonomy publishes (or implies) domain weights, mirror them in chapter count / depth, and surface that mapping to the reader.
- **Reproduce the three-level addressability** (Part = domain Dn → chapter = task area → learning-objective bullets). This makes every page traceable to a blueprint coordinate, the strongest possible "is this on-blueprint?" guarantee.
- Borrow the **"examples are not exhaustive" honesty**: a reference that diffs live Anthropic docs should state that its lists illustrate, not bound, the domain — which also hedges volatility.
- The **candidate-skills summary** ("Successful candidates will be able to…") is a clean model for a Part-opening objectives box.

## Concrete recommendations for claude-books

- **Publish an objective→chapter map as front matter** (a coverage matrix: each D1–D5 task area → the chapter that owns it). `docs/cert-coverage.md` already exists in-repo; the book should expose a reader-facing version shaped like CompTIA's domain table.
- **Weight depth by domain emphasis, and say so.** If a task area carries more exam weight, give it more chapter real-estate and a note explaining the allocation — don't hide the weighting.
- **Make every learning objective blueprint-addressable** (Part Dn → chapter task-area → objective). One coordinate per objective; this is what lets the cert-tracking agent diff coverage.
- **Add an "illustrative, not exhaustive" disclaimer** to objective lists, mirroring CompTIA — appropriate for a reference whose examples are concrete-but-generic and whose underlying product changes.
- **Open each Part with a "you will be able to…" candidate-skills summary** distilled from the task areas it covers.

## Quoted (citation-ready)

> "EXAM OBJECTIVES (DOMAINS) — The table below lists the domains measured by this examination and the extent to which they are represented: … 3.0 Hardware 27% … 5.0 Hardware and Network Troubleshooting 27% … Total 100%."
>
> — *CompTIA A+ Certification Exam: Core 1 Objectives*, v5.0 (220-1001), domain-weighting table
>
> Anchor: `CompTIA domains + The table below lists the domains measured by this examination`

> "The lists of examples provided in bulleted format are not exhaustive lists. Other examples of technologies, processes, or tasks pertaining to each objective may also be included on the exam although not listed or covered in this objectives document."
>
> — *CompTIA A+ Core 1 Objectives*, v5.0, "PLEASE NOTE"
>
> Anchor: `CompTIA not exhaustive + The lists of examples provided in bulleted format are not exhaustive lists`

> "Candidates are encouraged to use this document to help prepare for CompTIA A+ Core 1. … Successful candidates will have the knowledge required to: • Assemble components based on customer requirements • Install, configure, and maintain PCs, mobile devices, and software for end users …"
>
> — *CompTIA A+ Core 1 Objectives*, v5.0, "About the Exam"
>
> Anchor: `CompTIA candidates + Candidates are encouraged to use this document to help prepare`

> "CompTIA exams result from subject matter expert workshops and industry-wide survey results regarding the skills and knowledge required of an entry-level IT professional." / "CompTIA A+ is accredited by ANSI to show compliance with the ISO 17024 Standard…"
>
> — *CompTIA A+ Core 1 Objectives*, v5.0, "EXAM DEVELOPMENT" / "EXAM ACCREDITATION"
>
> Anchor: `CompTIA development + result from subject matter expert workshops and industry-wide survey results`

## Cross-references

- See [[genre-exam-ref-microsoft]] — Microsoft's "Skills measured" list is the same artifact under a different name; the Exam Ref chapter map mirrors it 1:1, exactly as recommended here.
- See [[genre-blooms-test-blueprint]] — the domain-weighting table is one axis of a full table of specifications; the second axis is cognitive level.
- See [[genre-sybex-study-guide]] — Sybex's "objective map" is the consumer-side artifact that points each blueprint objective to the chapter/section that covers it.
- See [[theory-blooms-taxonomy]] — the "Given a scenario, …" objective phrasing signals an Apply-level target, not Remember.
