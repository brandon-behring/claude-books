---
source_url: https://services.google.com/fh/files/misc/professional_cloud_architect_exam_guide_english.pdf
canonical_url: https://cloud.google.com/learn/certification/cloud-architect
source_title: "Google Cloud 'Professional Cloud Architect' certification exam guide — weighted sections + case studies + 'topics that may be included' framing"
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

# Google Cloud exam guide — weighted sections + shared case studies (an architect cert)

## Author + context

- **Source body**: Google Cloud (the certifying body). The artifact is the official **Professional Cloud Architect certification exam guide** (fetched the real PDF from Google's `services.google.com` CDN) plus the live **cloud.google.com/learn/certification/cloud-architect** page (verbatim resource framing). This is the most *architect-specific* primary source in the set — same job family as the Claude Certified Architect — Foundations.
- Tier **T1-official**: a first-party certifying-body blueprint, not a publisher page. It is the upstream "what is tested" document a Google-Cloud-aligned study guide is built against, analogous to [[genre-comptia-exam-objectives]] but for a design/architecture credential.
- Why it matters here: it shows how an *architecture* cert (judgment, trade-offs, scenarios) structures its blueprint differently from a fact-heavy cert — heavy on **weighted sections**, **case studies**, and a **role/competency statement** rather than long fact lists.

## Core principle / theory

The Google Cloud exam guide encodes the blueprint with five moves:

1. **A role/competency opening statement** — "A Professional Cloud Architect is able to leverage Google Cloud technologies to design, develop, and manage robust, secure, scalable… solutions…" The guide opens by defining the *practitioner*, then derives sections from that role. (Same shape as CompTIA's "Successful candidates will be able to…" but framed around design judgment.)
2. **Weighted, numbered sections** — "Section 1: Designing and planning a cloud solution architecture (~25% of the exam)", etc. The `~25%` is the study-time signal; sections are numbered (1, 2, …) with sub-objectives (`1.1`, `1.2`).
3. **Bulleted "Considerations include:" sub-topics** under each objective — illustrative, not exhaustive (e.g. "design decision trade-offs," "workload disposition strategies (build, buy, modify, deprecate)").
4. **Shared, named case studies** — the guide publishes the actual fictitious-business case studies *in advance* ("Altostrat Media," "Cymbal Retail," "EHR Healthcare") that the exam's scenario questions refer to. The cert tells you the scenarios up front; mastery = applying knowledge to them.
5. **An anchoring framework** — the guide explicitly threads the Well-Architected Framework's pillars "implicitly and explicitly … throughout the exam objectives," giving the whole blueprint a cross-cutting spine of principles.

## Empirical backing

Not empirical; it is a certifying-body blueprint. The defensible-weighting basis is the same job-task-analysis logic certifying bodies use (cf. CompTIA's ISO-17024 framing in [[genre-comptia-exam-objectives]]). The notable design choice — **case studies make up 20–30% of the exam** and are **published in advance** — is a transparency move: it tells candidates the application targets and pushes assessment up [[theory-blooms-taxonomy]] to Apply/Analyze without hiding the contexts.

## Application to a certification study guide

For the Architect's Reference, this is the closest *subject-matter* analog (an architecture credential), and it argues for three things the publisher notes don't emphasize:

- **A role/competency statement up front.** Open the book (and ideally each Part) by defining what a "Claude architect" can *do*, then derive task-area chapters from that role — Google leads with the practitioner, not a fact list. Fits a reference that assumes experience.
- **Weighted sections, stated as percentages.** Google prints `~25%` per section. If the CCA-F taxonomy exposes (or implies) weights, mirror them and *show the number*, so depth allocation is transparent and the reader can budget study time.
- **Published, recurring case studies.** This is the strongest idea to import: a small set of **named, reusable scenario contexts** (fictitious orgs/systems) that the book's scenario Exercises and practice items repeatedly draw on. Recurring case studies interleave concepts across chapters (a [[theory-bjork-desirable-difficulties]] move) and let later chapters pose Apply-level questions against an already-established context — without re-teaching the setup.
- **A cross-cutting principles spine** — Google threads Well-Architected pillars through every section. The Architect's Reference can thread a small set of cross-cutting Claude-architecture principles through all D1–D5 chapters, giving the reference coherence beyond the blueprint's flat task-area list.

## Concrete recommendations for claude-books

- **Open the book and each Part with a "a Claude architect is able to…" competency statement**, then list the task-area chapters as the means to that competency (Google-style role-first framing).
- **State per-task-area weighting as an explicit percentage/proportion** in the front-matter objective map (mirroring `~25% of the exam`), so coverage depth is transparent — pairs with the domain-weighting recommendation in [[genre-comptia-exam-objectives]].
- **Introduce a small set of named, reusable case studies** (2–4 fictitious orgs/systems, concrete-but-generic per editorial rules) that recurring scenario Exercises and practice items reference across multiple chapters — interleaving + Apply-level retrieval without re-setup.
- **Thread a short cross-cutting principles set** (e.g. a Claude "well-architected" spine) through every D1–D5 chapter, called out where each task area touches it.
- **Keep "Considerations include:" sub-bullets illustrative, not exhaustive** — matches the CompTIA "not exhaustive" discipline and hedges product volatility.

## Quoted (citation-ready)

> "Section 1: Designing and planning a cloud solution architecture (~25% of the exam) — 1.1 Designing a cloud solution infrastructure that meets business requirements. Considerations include: … Design decision trade-offs … Workload disposition strategies (e.g., build, buy, modify, or deprecate)…"
>
> — *Professional Cloud Architect Certification exam guide* (Google Cloud), Section 1
>
> Anchor: `Google Cloud Section 1 + Designing and planning a cloud solution architecture (~25% of the exam)`

> "The [standard exam guide] and [renewal exam guide] contain a complete list of topics that may be included on each exam, helping you determine if your skills align with the exam."
>
> — Google Cloud, cloud.google.com/learn/certification/cloud-architect, "Exam guide"
>
> Anchor: `Google Cloud exam guide + a complete list of topics that may be included on each exam`

> "Each exam includes 2 case studies. Case study questions make up 20–30% of the exam and assess your ability to apply your knowledge to a realistic business situation. You can view the case studies on a split screen during the exam."
>
> — Google Cloud, cloud.google.com/learn/certification/cloud-architect, "Case studies"
>
> Anchor: `Google Cloud case studies + Case study questions make up 20-30% of the exam`

> "A Professional Cloud Architect is able to leverage Google Cloud technologies to design, develop, and manage robust, secure, scalable, efficient, cost-effective, highly available, and flexible solutions that drive business objectives."
>
> — *Professional Cloud Architect Certification exam guide* (Google Cloud), role statement
>
> Anchor: `Google Cloud role + A Professional Cloud Architect is able to leverage Google Cloud technologies to design`

## Cross-references

- See [[genre-comptia-exam-objectives]] — the same upstream-blueprint role, with explicit percentage weights; Google's `~25%` per section is the architecture-cert analog of CompTIA's domain table.
- See [[genre-blooms-test-blueprint]] — published case studies + "apply your knowledge to a realistic business situation" is the vignette/higher-order item design, surfaced at the blueprint level.
- See [[genre-exam-ref-microsoft]] — Google's role-first opening parallels Exam Ref's experience-assuming stance; both target practitioners, not beginners.
- See [[theory-bjork-desirable-difficulties]] — a small set of recurring named case studies is an interleaving + spaced-revisit device at book scale.
