---
source_url: https://lawsofux.com/cognitive-load/
canonical_url: https://lawsofux.com/cognitive-load/
source_title: "Cognitive Load + Hick's Law in Interface Design"
fetched_at: 2026-05-23
last_verified_at: 2026-05-23
topic: pedagogy-info-design
tier: T1-official
cert_domains: []
cert_task_areas: []
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Cognitive Load + Hick's Law (interface application)

## Author + context

- **John Sweller** (educational psychologist, UNSW Sydney) developed Cognitive Load Theory (CLT) starting in the late 1980s; the seminal paper is Sweller, J. (1988) "Cognitive Load During Problem Solving: Effects on Learning," *Cognitive Science* 12, 257–285. Originally framed for instructional design (math worked-examples); has since been applied extensively to UI/UX. **William Hick + Ray Hyman** (1952) formulated what's now Hick's Law (or the Hick-Hyman Law) in *Quarterly Journal of Experimental Psychology* and *Journal of Experimental Psychology* respectively.
- Combined, these two laws underpin every modern claim that "fewer options = better." Curated at [Laws of UX](https://lawsofux.com/) (by Jon Yablonski) — the canonical practitioner-facing reference for both. For long-form technical content, CLT is the cognitive-science basis for why we treat "extraneous load reduction" as a design principle and not just an aesthetic preference.

## Core thesis / principles

- **Cognitive Load Theory** posits that working memory has *strictly limited* capacity (~4 items at once, per Miller / Cowan refinements). When information presented exceeds capacity, learning fails — not "fails to be efficient" but actually fails.
- **Three types of cognitive load**:
  1. **Intrinsic load** — the irreducible complexity of the content itself. Some topics are just hard.
  2. **Extraneous load** — load caused by *how* the information is presented (poor layout, redundant text, confusing labels, irrelevant content). This is the only type the designer can reduce.
  3. **Germane load** — load devoted to *learning the schema* (deep processing for transferable understanding). This is desirable load.
- **Design implication**: minimize extraneous load to free working memory for intrinsic + germane load. Every redundant word, every off-topic callout, every inconsistent label is *extraneous* — directly subtracting from the reader's capacity for the actual content.
- **Hick's Law**: "The time it takes to make a decision increases with the number and complexity of choices." Formally: T = b · log₂(n + 1), where n is the number of choices and b is an empirical constant. Decision time scales *logarithmically* — adding a 5th option to 4 is bad, but adding the 20th to 19 is much worse.
- **Working memory bottleneck**: the reason both laws "feel right" is the same — human cognition has a small, fast working memory and a large, slow long-term memory. Effective communication moves novel material through working memory at a rate it can handle.

## Concrete techniques recommended

- **Reduce extraneous load**:
  - Eliminate clutter (Tufte's chartjunk analog).
  - Use consistent naming (Wurman's controlled vocabulary).
  - Chunk information into ~4-item groups.
  - Use familiar conventions (Krug's principle).
  - Place related content together (proximity).
- **Apply Hick's Law to menus, options, and choice points**:
  - Minimize choices when response time matters.
  - Break complex tasks into smaller steps (each step's choice-set is smaller).
  - Highlight a recommended default (the reader doesn't have to compare all options).
  - Progressively disclose (cf. [[nng-progressive-disclosure]]) — only show advanced choices on demand.
  - Avoid over-simplification: collapsing 8 options into 2 vague mega-options moves the cognitive load from *choice* to *interpretation*, which is worse.
- **Chunk content for working memory**: aim for ~4 items per group at the surface. Lists longer than 7 items should be subdivided (e.g., the 10-topic research cache is already subdivided by topic and then by tier).
- **Use worked examples** (Sweller's classical instructional-design technique): a fully-solved example before asking the reader to solve a similar problem. Cf. how `claude-books` will show a working SKILL.md before asking the reader to write one.

## Applicable to claude-books pedagogy

- **The "big picture → drill down" principle is a CLT-aware sequencing**: the macro view establishes a *schema* (germane load: cheap because it's just the skeleton); the drill-down then loads detail *into* the schema (lower extraneous load because the reader has somewhere to put it).
- **Frontmatter as cognitive offloading**: structured frontmatter means the reader doesn't have to hold "what's the tier? what cert domain? when verified?" in working memory — they look it up. Working memory freed for content.
- **Cross-references over forward declarations**: rather than recap a concept inline, link to the relevant other note — readers who already know the concept skip; readers who don't follow the link. Either way working memory isn't burned on background.
- **Hick's Law constrains TOC width**: a topic README with 25 sibling entries violates Hick; the existing 10-topic top-level grouping is well within bounds.
- **Three usability gains from progressive disclosure (NN/g)** are explained by CLT: novices have less extraneous load (only see relevant options); experts have less intrinsic load (have learned the schema); errors are lower (less working-memory pressure means fewer slips). It's not three independent gains — it's one mechanism.
- **The 7-column dossier table cap is CLT-aware**: 7 columns is near Miller's classical "7±2" working-memory bound; pushing to 12 columns would push the table past the comfort zone. Smaller per-row tables outperform wider ones for this reason.

## Quoted (citation-ready)

> "The amount of mental resources needed to understand and interact with an interface."
>
> — Yablonski, *Laws of UX*, "Cognitive Load" (Sweller's framework, distilled)
>
> Anchor: `Cognitive Load + The amount of mental resources needed`

> "Extraneous cognitive load: mental processing that consumes cognitive resources without advancing user comprehension — such as poorly designed or superfluous interface components."
>
> — Yablonski, *Laws of UX*, "Cognitive Load" (Sweller's framework)
>
> Anchor: `Extraneous load + mental processing that consumes cognitive resources`

> "The time it takes to make a decision increases with the number and complexity of choices."
>
> — Yablonski, *Laws of UX*, "Hick's Law" (after Hick 1952 / Hyman 1953)
>
> Anchor: `Hick's Law + The time it takes to make a decision`

> "Working memory has limited capacity. When incoming information surpasses available mental capacity, users experience difficulty concentrating, overlook important details, and feel stressed."
>
> — Yablonski, *Laws of UX*, "Cognitive Load" (Sweller's CLT)
>
> Anchor: `Working memory + has limited capacity`

## Cross-references

- See [[nng-progressive-disclosure]] for the design technique that operationalizes CLT (defer non-essential load).
- See [[book-krug-dont-make-me-think]] for the practitioner formulation of the same principle ("don't make me think" = "reduce extraneous load").
- See [[book-tufte-visual-display]] for data-ink ratio — the chart analog of "reduce extraneous load."
- See [[book-wurman-information-anxiety]] for the *organizational* response to working-memory limits (LATCH gives the reader 5 fixed schemas rather than ad-hoc).
- See [[framework-diataxis]] for an opinionated IA that minimizes cross-mode cognitive switching (reading reference vs. following a tutorial loads different schemas).
