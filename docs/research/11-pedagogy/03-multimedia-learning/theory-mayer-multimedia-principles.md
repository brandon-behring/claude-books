---
source_url: https://www.cambridge.org/core/books/cambridge-handbook-of-multimedia-learning/4022537A40FF2D2EB10F62B5E724DC7E
canonical_url: https://www.cambridge.org/core/books/cambridge-handbook-of-multimedia-learning/4022537A40FF2D2EB10F62B5E724DC7E
source_title: "The Cambridge Handbook of Multimedia Learning (3rd ed.)"
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

# Mayer — Cognitive Theory of Multimedia Learning + 12 principles

## Author + context

- **Richard E. Mayer**, distinguished professor of psychology, UC Santa Barbara. Began the multimedia-learning research program in the late 1980s; consolidated it as the *Cognitive Theory of Multimedia Learning* (CTML) in his 2001 book *Multimedia Learning* (Cambridge UP, now in its 3rd edition, 2020) and in the *Cambridge Handbook of Multimedia Learning* (1st ed. 2005, 3rd ed. 2022).
- Theoretical lineage: combines Paivio's **Dual-Coding Theory** (separate verbal + visual channels), Baddeley's **working-memory model** (limited capacity per channel), and Sweller's **Cognitive Load Theory** (extraneous load harms learning). CTML is the single most-cited applied framework for instructional design today.

## Core principle / theory

CTML rests on three assumptions: (1) the brain has **dual channels** — auditory/verbal and visual/pictorial — that process information independently (Paivio, Baddeley); (2) each channel has **limited capacity** at any moment (Sweller, Baddeley); (3) **active learning** requires the learner to select, organize, and integrate incoming material with prior knowledge. From these assumptions Mayer derives a set of **research-backed design principles** — most listings give **12 principles** organized into three groups: (a) reducing extraneous processing — *coherence, signaling, redundancy, spatial contiguity, temporal contiguity*; (b) managing essential processing — *segmenting, pre-training, modality*; (c) fostering generative processing — *multimedia, personalization, voice, image*. Each principle has been validated in dozens of randomized controlled studies with effect sizes typically d = 0.7–1.0 on transfer tests.

## Empirical backing

- **Multimedia principle** (text + congruent picture > text alone): Mayer & Anderson (1991, 1992) — lightning narration + animation produced **89% more solutions** on transfer tests than narration alone.
- **Coherence principle** (cut seductive details): Harp & Mayer (1998) showed that adding interesting-but-irrelevant text/illustrations *reduced* transfer-test scores by ~30%.
- **Signaling principle**: Mautone & Mayer (2001) — adding headings, color highlighting, and outline cues improved transfer by d ≈ 0.5–0.7.
- **Spatial contiguity** + **temporal contiguity**: Mayer (1989), Moreno & Mayer (1999) — labels placed next to (vs. far from) the part they describe yielded d ≈ 1.1 transfer gain.
- **Modality principle**: narrated animation outperforms on-screen text + animation (Mayer & Moreno, 1998; Tindall-Ford et al., 1997). Effect size meta-analyzed across **30+ studies** at d ≈ 1.0 (Ginns, 2005).
- **Redundancy principle**: simultaneous narration + identical on-screen text is *worse* than narration alone — splits the visual channel between picture and text (Kalyuga, Chandler, Sweller 1999, 2000).
- 3rd ed. (2020) reports the principle library now spans **190+ experiments**.

## Application to written technical documentation

Most multimedia-learning research uses *narrated animation* (e.g. how-a-pump-works) as the canonical stimulus, but the underlying cognitive constraints — limited working memory, dual channels, active integration — apply to **any** technical text. Translations:

- **Multimedia + dual-coding**: pair every non-trivial concept with a diagram, table, or worked code example. Pure prose forces all processing through the verbal channel.
- **Spatial contiguity**: keep diagram labels *inline* with the diagram, not in a separate legend. For code, keep the annotation *adjacent* to the line it explains (or use code comments) rather than in a paragraph below.
- **Coherence**: cut anecdotes, jokes, and "fun facts" that don't advance the learning goal. Especially harmful in reference material that learners scan.
- **Signaling**: use headings, bold, callouts, and consistent typographic conventions to mark the structure. Markdown-style boxed callouts (Note / Warning / Tip) are CTML-style signals.
- **Segmenting + pre-training**: break long sequences into named, learner-paced chunks; introduce key terminology *before* the chapter that uses it heavily.
- **Redundancy**: avoid repeating identical text in a code block's caption and its surrounding prose — pick one channel.
- **Personalization + voice**: conversational ("you", "we") prose outperforms formal third-person in transfer studies, even in technical writing (Moreno & Mayer 2000, 2004).
- **Image principle** (a static author photo does *not* improve learning): don't add author avatars or decorative headshots — they add no comprehension benefit.

## Concrete recommendations for claude-books

- **Pair every conceptual section with a diagram or worked code example** (multimedia principle). Pure-prose chapters are an anti-pattern.
- **Use callout boxes (Note / Warning / Tip / Pro tip) as signaling cues** — these are CTML signals, not "decoration". Apply consistently per book.
- **Inline annotations next to code** (`// like this` or hover-anchored sidenotes) over "see line 4 below" prose (spatial contiguity).
- **Cut seductive details** — no off-topic anecdotes mid-chapter even if entertaining (coherence). Move them to dedicated "Sidebar" sections at end of chapter if kept at all.
- **Use second-person, conversational voice** in instructional sections (personalization principle); reserve formal/passive voice for reference tables.

## Quoted (citation-ready)

> "People learn more deeply from words and pictures than from words alone."
>
> — Mayer, *Multimedia Learning* (3rd ed., 2020), Ch. 1 ("the multimedia principle")
>
> Anchor: `multimedia principle + People learn more deeply from words and pictures`

> "Extraneous processing is cognitive processing during learning that does not serve the instructional objective and is caused by poor instructional design. Three principles for reducing extraneous processing are the coherence principle, signaling principle, and redundancy principle."
>
> — Mayer, *Cambridge Handbook of Multimedia Learning* (3rd ed., 2022), Ch. 2 ("Cognitive Theory of Multimedia Learning")
>
> Anchor: `extraneous processing + Extraneous processing is cognitive processing during learning`

> "When identical printed text accompanies spoken narration with animation, learners perform worse on transfer tests than when narration accompanies animation alone."
>
> — Mayer, *Multimedia Learning* (3rd ed., 2020), Ch. 7 ("the redundancy principle")
>
> Anchor: `redundancy + When identical printed text accompanies spoken narration`

## Cross-references

- See [[theory-sweller-cognitive-load]] for the cognitive-load theoretical substrate Mayer builds on (intrinsic / extraneous / germane).
- See [[theory-paivio-dual-coding]] for the dual-channel claim that underwrites the multimedia and modality principles.
- See [[theory-bjork-desirable-difficulties]] for the complementary view that *some* extraneous-looking load (interleaving, retrieval) is desirable for long-term retention.
- See [[theory-miller-chunking-schemas]] for the working-memory capacity constraints that motivate segmenting and pre-training.
