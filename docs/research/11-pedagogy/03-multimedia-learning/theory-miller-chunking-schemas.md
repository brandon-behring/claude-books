---
source_url: https://psychclassics.yorku.ca/Miller/
canonical_url: https://psychclassics.yorku.ca/Miller/
source_title: "The Magical Number Seven, Plus or Minus Two (Miller, 1956) + schema theory"
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

# Miller — Chunking + Schemas (working-memory foundations)

## Author + context

- **George A. Miller** (1920–2012), Harvard, then Princeton; one of the founders of cognitive psychology. His 1956 paper *The Magical Number Seven, Plus or Minus Two: Some Limits on Our Capacity for Processing Information* (*Psychological Review* 63(2): 81–97) is among the **most-cited psychology papers ever** (~60,000+ citations).
- **Schema theory** lineage: Bartlett (1932) introduced the *schema* construct in *Remembering*; **John R. Anderson** (CMU) formalized it as ACT-R in the 1980s–90s; **Michelene Chi** (1988, "Self-explanations: How students study and use examples in learning to solve problems") showed schema-building is the mechanism behind expert/novice performance differences.
- These threads anchor the working-memory side of all instructional theory: Mayer's CTML, Sweller's CLT, and modern Cognitive Load research all start from "working memory is small, long-term-memory schemas are how we get past that limit."

## Core principle / theory

**Two empirical findings + one theoretical bridge:**

1. **Working memory is severely limited.** Miller (1956) reviewed dozens of experiments — span of immediate memory, absolute judgment, dichotic listening — and converged on roughly **7 ± 2 chunks** of independent information held simultaneously. Cowan's (2001) modernization revises this downward to **3–5 chunks** for adults, ~4 being the modal estimate, when rehearsal is prevented. The exact number is contested; the *severe limit* is not.

2. **Chunking expands effective capacity.** A "chunk" is a unit defined by long-term memory. The string `FBICIAIRSNATO` is 13 letters (over limit); recoded as `FBI / CIA / IRS / NATO` it's 4 chunks (under limit). Chunking is the most powerful working-memory expansion trick known — it's why chess masters memorize a board faster than novices (they see 5 chunks, not 32 pieces; Chase & Simon, 1973).

3. **Schemas are how chunks form and persist.** A *schema* is a structured long-term-memory representation of a recurring pattern (a "restaurant script", a "for-loop pattern", a "sorting-algorithm template"). Schemas in long-term memory let working memory operate on *single chunks* that internally encode rich detail. **Learning = building and refining schemas.** All durable expertise is schema-mediated.

## Empirical backing

- **Miller (1956)**: the original paper synthesized work by Pollack, Garner, Hayes, and others — span-of-attention experiments consistently landed in the 5–9 range.
- **Cowan (2001)**: meta-analysis of post-1980 studies (chunking controlled, articulatory suppression preventing rehearsal) produced the **~4-chunk** estimate; published as the lead article in *Behavioral and Brain Sciences*.
- **Chess expertise** (Chase & Simon 1973; de Groot 1965): chess masters reconstructed real game positions far better than novices, but **no better** on random board positions — proving the advantage was schema-based chunking, not raw memory.
- **Programmer chunking** (McKeithen, Reitman, Rueter & Hirtle 1981): expert programmers chunked `if (x > 0) print x` as one unit; novices saw 8 tokens.
- **Schema acquisition + worked examples** (Sweller, Chi): novices who study worked examples build schemas faster than equivalent problem-solvers (see [[theory-sweller-cognitive-load]]).

## Application to written technical documentation

Two consequences:

**(A) Don't exceed the budget.** Working memory holds ~4 chunks at once; any single sentence, code block, or diagram that requires the reader to track more than 4 unrelated elements will fail comprehension. Translations:

- **Sentence length**: aim for ≤ 25 words; sentences over 30 routinely break parsing.
- **Function-signature complexity**: a function with 8 positional parameters is over-limit. Object-bag parameters or named arguments reduce *cognitive* parameter count by chunking related ones.
- **Diagram component count**: a system diagram with 12 boxes and 20 arrows is over-limit. Break into 3 sub-diagrams with ≤ 5 nodes each, or use a hierarchical "zoom" structure.
- **Lists / bullet points**: 4–6 items maximum per list; longer lists need grouping (the reader will chunk them into headings whether you provide the headings or not — provide them).

**(B) Build schemas, not facts.** A doc that teaches isolated facts will be forgotten; a doc that teaches *patterns* (schemas) sticks. Translations:

- **Pattern-name + example** structure beats fact dumps. "The orchestrator-worker pattern" (named schema) is more retrievable than "you can have a top-level loop call sub-loops".
- **Repeat the schema in multiple contexts** (interleaving, see [[theory-bjork-desirable-difficulties]]) to consolidate it.
- **Explicit comparisons across patterns** (this vs. that, when to use which) accelerate schema discrimination.

## Concrete recommendations for claude-books

- **Hard limits on per-section element interactivity**:
  - ≤ 4–5 bullets per list (group into sub-headings if more)
  - ≤ 5 boxes per architecture diagram (use a "zoom in" cascade for more)
  - ≤ 30 words per sentence (break into two)
  - ≤ 5 positional arguments per shown function signature
- **Name your patterns.** Every recurring approach gets a memorable name ("orchestrator-worker", "writer-reviewer", "fan-out/fan-in"). Named schemas are retrievable; unnamed ones are not.
- **Pre-train the schema vocabulary** in a glossary or chapter-1 sidebar; subsequent chapters cite the name rather than re-describing the pattern (pre-training principle, Mayer).
- **Show schemas in *contrast*** ("orchestrator-worker vs. router-handler") — discrimination strengthens schemas.

## Quoted (citation-ready)

> "The span of immediate memory imposes severe limitations on the amount of information that we are able to receive, process, and remember. By organizing the stimulus input simultaneously into several dimensions and successively into a sequence of chunks, we manage to break (or at least stretch) this informational bottleneck."
>
> — Miller (1956), *Psychological Review* 63(2), p. 95
>
> Anchor: `span of immediate memory + The span of immediate memory imposes severe limitations`

> "The contrast between the unitary character of the chunk and the multidimensional character of the bits of information it contains is what gives chunking its power. By chunking, we expand our processing capacity beyond what its raw limits would seem to allow."
>
> — Miller (1956), p. 93
>
> Anchor: `chunking + The contrast between the unitary character of the chunk`

> "The reanalysis carried out here suggests that the capacity limit is more like four chunks of information than the more commonly cited limit of seven, when rehearsal and chunking strategies are controlled."
>
> — Cowan (2001), *Behavioral and Brain Sciences* 24(1), p. 87
>
> Anchor: `four chunks + The reanalysis carried out here suggests that the capacity limit is more like four`

## Cross-references

- See [[theory-sweller-cognitive-load]] — CLT's intrinsic/extraneous/germane categories are operating on Miller's limited capacity.
- See [[theory-mayer-multimedia-principles]] — Mayer's segmenting and pre-training principles are direct mitigations for the working-memory bottleneck.
- See [[theory-paivio-dual-coding]] — dual coding *doubles* capacity by recruiting two independent channels, each with its own working-memory limit.
- See [[theory-bjork-desirable-difficulties]] — schemas built via retrieval and interleaving persist longer than schemas built via blocked study.
