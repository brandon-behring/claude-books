---
source_url: https://global.oup.com/academic/product/mental-representations-9780195066661
canonical_url: https://global.oup.com/academic/product/mental-representations-9780195066661
source_title: "Mental Representations: A Dual Coding Approach (Paivio, 1986/1990)"
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

# Paivio — Dual-Coding Theory

## Author + context

- **Allan Paivio** (1925–2016), professor of psychology, University of Western Ontario. First articulated Dual-Coding Theory (DCT) in the 1971 monograph *Imagery and Verbal Processes* (Holt, Rinehart & Winston) and consolidated it in *Mental Representations: A Dual Coding Approach* (Oxford UP, 1986; pbk 1990).
- Theoretical lineage: rejected the dominant 1960s view that all cognition was symbolic-propositional. Argued — controversially at the time, mainstream now — that **mental imagery is a distinct, parallel cognitive system** with its own operating characteristics. DCT is the empirical foundation for the multimedia principle, the picture-superiority effect, and most modern visual-aided instruction.

## Core principle / theory

Human cognition operates two functionally and structurally distinct subsystems:

1. **Verbal system** — encodes and processes linguistic units (*logogens*): words, propositions, syntactic structures. Sequential, abstract.
2. **Imagery (nonverbal) system** — encodes and processes perceptual/imagistic units (*imagens*): visual, auditory, motor, tactile representations. Parallel, concrete, spatially organized.

Crucially: the two systems are **independent but interconnected**. A concept that is encoded in **both** verbal and imagery systems has two retrieval routes, doubling the probability of recall (*additive effect*). Concrete words (which spontaneously evoke images) are remembered better than abstract words (the *concreteness effect*); pictures are remembered better than words (the *picture-superiority effect*) because they automatically engage the imagery system *and* are typically named (engaging the verbal system).

Implications for instruction: (a) text + congruent picture > text alone (additive recall paths); (b) concrete language (cars, kitchens, hammers) outperforms abstract language (entities, contexts, paradigms); (c) **incongruent** or decorative imagery has no benefit and may actively distract (later refined as Mayer's *coherence principle*).

## Empirical backing

- **Picture-superiority effect** (Paivio & Csapo, 1969, 1973): free recall of pictures exceeded free recall of words by **~2×**. Replicated across hundreds of studies; meta-analyzed effect ≈ d = 1.0+.
- **Concreteness effect** (Paivio, Yuille & Madigan 1968): concrete nouns (image-evoking) recalled at roughly **twice** the rate of abstract nouns.
- **Imagery instructions** (Bower, 1972): asking learners to form mental images of word lists doubled recall vs. rote rehearsal.
- **Bilingual extension**: Paivio's later work showed dual coding extends across languages — bilinguals encode each language in a separate verbal store, plus the shared imagery store.
- **Modern neuroscience confirmation**: fMRI work (Just et al., 2004; Mason & Just, 2006) shows verbal and visuospatial processing recruit distinct cortical networks, consistent with DCT's structural claim.

## Application to written technical documentation

DCT is the simplest, most-cited justification for "use diagrams". Translations to written documentation:

- **Every non-trivial concept gets a diagram OR a concrete worked example.** Both engage the nonverbal system in addition to the verbal system. (A code example *is* a kind of visual representation — line layout, indentation, structural symmetry — not just a verbal one.)
- **Prefer concrete metaphors over abstract definitions**. "A queue is like a coffee-shop line" (concrete, image-evoking) is more memorable than "a queue is an ordered data structure with FIFO semantics" (abstract).
- **Use congruent imagery only**. A diagram unrelated to the surrounding text creates two competing representations and *harms* recall (this is the coherence-principle / seductive-details finding that Harp & Mayer 1998 demonstrated).
- **Architecture diagrams + prose description** for any system with > 2 components. Pure prose (Component A connects to Component B which forwards to Component C) overloads the verbal system; the same content in a node-edge diagram is offloaded to the imagery system.
- **Tables count as visual encoding**. A 4-column table of "feature × supported model" beats four paragraphs of comparable prose for recall.

## Concrete recommendations for claude-books

- **Diagram-or-example rule**: every section that introduces a new concept includes either a diagram, a table, or a fully worked code example. No "concept-only" sections.
- **Concrete examples first, formal definition second**. Open with the coffee-shop-line metaphor (or its technical equivalent); state the formal definition in a follow-up paragraph or a "Definition" callout.
- **Cut decorative imagery** — every figure must illustrate the surrounding text. Aesthetic/stock photos are a coherence violation per Mayer 1998.

## Quoted (citation-ready)

> "Dual coding theory assumes that there are two cognitive subsystems, one specialized for the representation and processing of nonverbal objects/events (i.e., imagery), and the other specialized for dealing with language. The two systems are presumed to be structurally and functionally distinct."
>
> — Paivio, *Mental Representations* (1986), Ch. 4
>
> Anchor: `Dual coding theory + Dual coding theory assumes that there are two cognitive subsystems`

> "Memory for pictures is generally superior to memory for words referring to the same concepts. This picture superiority effect is interpreted as evidence that pictures are more likely than words to be coded in both verbal and nonverbal memory systems."
>
> — Paivio, *Mental Representations* (1986), Ch. 7
>
> Anchor: `picture superiority + Memory for pictures is generally superior to memory for words`

> "Concrete words consistently produce higher recall than abstract words, an effect attributable to the greater probability that concrete words evoke imaginal as well as verbal codes."
>
> — Paivio, *Mental Representations* (1986), Ch. 7 ("the concreteness effect")
>
> Anchor: `concreteness effect + Concrete words consistently produce higher recall than abstract words`

## Cross-references

- See [[theory-mayer-multimedia-principles]] — Mayer's *multimedia*, *modality*, and *coherence* principles are direct CTML-formalizations of Paivio's dual coding.
- See [[theory-sweller-cognitive-load]] — DCT explains *why* the modality effect reduces extraneous load (auditory narration + visual diagram splits the channels).
- See [[theory-miller-chunking-schemas]] — both verbal and imagery systems are subject to working-memory limits but those limits are channel-separate.
