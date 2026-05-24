# Handbook pedagogy

The pedagogical model for the `claude-books` handbook. This doc formalizes what's implicit in the LaTeX source (`~/claude-best-practices/`), fills the gaps, and proposes conventions for how multi-format content (chapters + supplements + reference + explanation) coexists without becoming a "mash up = no style."

**Status**: **Draft (2026-05-23).** Visual-design sections are filled from Phase A research notes in `../docs/research/11-pedagogy/`. Other sections still have explicit **OPEN** markers where the user is exploring options. See `decisions log` at end for the live state of each choice.

This doc is a reference for future contributors. Read once; refer when applying the model.

---

## Inventory: what already exists

Substantial pedagogical infrastructure exists in two repos. Most of this doc is **synthesis, not invention**.

### From `~/claude-best-practices/` (LaTeX source)

**Macro level** — load-bearing organizing principles:

- **L1–L5 Maturity Model** (`appendices/maturity.tex`) — five adoption levels with explicit progression criteria. Not schedule-based; based on observed practice patterns:
  - **L1 (Conversational)** — default usage, no config — Week 1
  - **L2 (Configured)** — CLAUDE.md, commands, permissions — Weeks 2–4
  - **L3 (Systematic)** — hub-and-spoke, rules, memory — Months 2–3
  - **L4 (Autonomous)** — skills, MCP, subagents — Months 3–6
  - **L5 (Enterprise)** — team-wide deployment — Month 6+
- **Spiral Curriculum** — explicitly named in `chapters/00_preamble.tex` ll. 66-84. Four concepts revisited at increasing depth: CLAUDE.md, context, testing, extensions. Each revisit *explicitly connects back* to the earlier treatment. This is Bruner's spiral curriculum applied to a technical handbook.
- **Four-persona reader routing** (`00_preamble.tex` ll. 54-64) — "How to Read" section with four entry paths:
  - New to Claude Code → start at Ch 1, read Part I straight through
  - Already configured → start at Ch 4 (Part II), skim Part I
  - Experienced user → jump to Ch 11 (antipatterns), then Ch 8 (architecture)
  - DS/ML team lead → Ch 15 + Appendix (maturity) + Ch 5 + Ch 6
- **Three-source label system** (`00_preamble.tex` ll. 9-23 + `.claude/CLAUDE.md`):
  - `\official{}` — Anthropic-documented, URL-verified
  - `\practitioner{}` — observed practice from 20+ projects
  - `\convergence{}` — both sources agree independently

**Micro level** — pedagogical primitives:

- **Margin-note 8 categories** (`claude-best-practices.sty` ll. 232-293): Official, Tip, Warning, Cost, Enterprise, Template, Vocab, Cross-Ref. 25-word cap enforced. Color-coded per Warm Tol palette.
- **Pedagogical box types** (`claude-best-practices.sty` ll. 344-395):
  - `\beforeafter` — contrast pair (vague vs. precise; before/after refactor)
  - `\trybox` — 10-minute practice exercise on reader's own project
  - `\whybox` — reasoning/rationale ("why" not "what")
  - `\keybox` — crystallized takeaway (reader should memorize)
  - `\decisionbox` — decision framework ("when to choose X vs Y")
  - `\recovery` — escape route from an anti-pattern (pairs with `\antipattern`)

### From `~/claude-books/handbook/` (MDX workspace)

- **Part Intros in `OUTLINE.md`** — each Part declares "you are at L_n, by end of this Part you'll be at L_{n+1}." Reinforces maturity progression at Part boundaries.
- **`cert_domains` frontmatter** — each chapter declares which cert domains (1-5) it covers. Cross-referenced in `docs/cert-coverage.md`.
- **`volatility` + staleness banner** — `stable-principle` / `evolving` / `fast-moving`. Banner renders for `fast-moving` content older than 90 days. Honest transparency about freshness.
- **Custom MDX components** (`handbook/src/components/`): `<BeforeAfter>`, `<DecisionBox>`, `<MaturityLevel>` + scaffold-inherited `<KeyIdea>`, `<TryThis>`, `<MarginNote>`, `<InsightBox>`, `<Tag>`, `<XRef>`.
- **Research cache** (`docs/research/`) — 123+ primary-source notes feeding chapter citations.

### Implicit framework

What the LaTeX source enacts without explicitly naming:
- **Bruner's spiral curriculum** (named in the preamble as "spiral structure" but not cited as Bruner)
- **Persona-routed pathways** (similar to Diátaxis' acknowledgment of different reader modes, but not framed that way)
- **Hierarchical disclosure** (chapter intros → sections → callouts → margin notes is a 4-level hierarchy, but never named as such)
- **Source attribution discipline** (the `\official{}` / `\practitioner{}` / `\convergence{}` tag system is a deliberate **epistemic transparency** convention — readers see *where* each claim comes from)

---

## Visual presentation principles

Eight principles synthesized from the visual-pedagogy research sprint (`docs/research/11-pedagogy/`, 38 source notes across 4 sub-areas: production-site UX, information design literature, multimedia learning, handbook-genre examples). Each principle is backed by ≥2 independent sources and applied to a specific claude-books design choice.

### 1. Macro view before micro detail — and the macro is the same content, just compressed

*Sources*: [[book-tufte-envisioning-information]] (micro/macro readings), [[book-krug-dont-make-me-think]] (satisficing — readers commit early), [[nng-f-shaped-pattern]] (first lines/headings carry the load), [[site-stripe-docs]] (quickstart-first IA).

**Applied as**: every chapter opens with a **2-3 paragraph executive summary + a `<KeyIdea>` callout**. The summary is *integrated* into the chapter (not a separate "TL;DR" page) — it's the macro view of the same content the body explores in detail. Readers who stop at the summary should still walk away with the chapter's central claim.

### 2. Two-level disclosure max — three is overload

*Sources*: [[nng-progressive-disclosure]] (formal two-level limit), [[theory-sweller-cognitive-load]] (working-memory bound), [[site-react-dev]] (`<DeepDive>` collapsibles as the canonical second layer).

**Applied as**: primary body for all readers + **one secondary layer** for depth-seekers. The secondary layer = collapsible `<WorkedExample>` blocks (Phase 0.7 component) + `[[slug]]` cross-references to other notes / chapters. Nested collapsibles within collapsibles are banned.

### 3. Maximize signal; erase decoration (data-ink discipline)

*Sources*: [[book-tufte-visual-display]] (data-ink ratio, chartjunk), [[book-krug-dont-make-me-think]] ("omit needless words"), [[theory-sweller-cognitive-load]] (extraneous-load reduction), [[theory-mayer-multimedia-principles]] (coherence principle — cut seductive details).

**Applied as**: no decorative dividers, no off-topic anecdotes for "color," no redundant emphasis. Every paragraph must change what the reader knows. The 8-category margin-note system signals semantically (Cost / Warning / Tip / etc.) rather than decoratively. Mayer's data: seductive details reduce transfer-test performance by ~30%.

### 4. Pick exactly one organizing scheme per layer — LATCH

*Sources*: [[book-wurman-information-anxiety]] (LATCH: Location, Alphabet, Time, Category, Hierarchy), [[nng-ia-vs-navigation]] (IA before navigation), [[framework-diataxis]] (Category-based taxonomy as one disciplined choice).

**Applied as**: claude-books uses **Category at the volume level** (Handbook / Architect's Ref / Field-Guide), **Category at the Part level** (Foundations / Practice / Scaling / Team), **Hierarchy within Parts** (chapter sequence), **Time on per-chapter `last_updated` metadata**. Multi-axis access is fine; mixing all five at the *same* level is the failure mode.

### 5. Pattern recognition over per-instance learning (small multiples)

*Sources*: [[book-tufte-envisioning-information]] (small multiples — parallel structure across variations lets readers learn the *shape* once), [[book-krug-dont-make-me-think]] (conventions are virtues), [[book-effective-series]] (rigid item template across 90 items), [[book-refactoring-fowler]] (uniform per-recipe template across 60+ recipes).

**Applied as**: every chapter follows the same section sequence (Executive summary → Core mechanism → Worked example → Principles in detail → Spiral cross-references → `<TryThis>` exercise → Pitfalls). Every Architect's Reference recipe follows Refactoring's template (Sketch / When-to-use / Mechanics / Example / Things-to-Remember). The research cache already enacts this — same frontmatter, same body sections, same `[[slug]]` convention across 150+ notes.

### 6. Diagram-or-example rule (multimedia + dual-coding)

*Sources*: [[theory-mayer-multimedia-principles]] (multimedia principle: text+image > text alone), [[theory-paivio-dual-coding]] (verbal + visual channels processed separately).

**Applied as**: every section that introduces a non-trivial concept includes a **diagram, table, or fully worked code example**. Pure-prose explanation is a CTML / DCT anti-pattern. The agent-loop concept in Ch 1, for example, requires an SVG diagram — not just prose description.

### 7. Make scanning succeed — first-word and first-sentence carry the load

*Sources*: [[nng-f-shaped-pattern]] (readers scan in F-shape), [[book-krug-dont-make-me-think]] (Billboard Design 101), [[book-boulton-designing-for-the-web]] (size + weight = hierarchy).

**Applied as**: every heading's **first word is the most distinctive content word** ("Configure CLAUDE.md" not "How to configure CLAUDE.md"). Every section's first sentence states the section's claim, not the section's plan. Bullets > prose for enumerable content (≤5 per list). Long paragraphs splinter.

### 8. Match form to reader-mode (Diátaxis discipline)

*Sources*: [[framework-diataxis]] (four reader modes), [[site-react-dev]] (Learn vs Reference as cleanest reduction), [[site-cloudflare-docs]] (explicit content-type pill badges per page), [[nng-ia-vs-navigation]] (IA serves reader state).

**Applied as**: a single chapter dominates in one mode — **Handbook chapters = tutorial + explanation**; **Architect's Reference recipes = reference + explanation**; **Field-Guide chapters = how-to + explanation**. Cross-link to other modes; don't inline. Reader knows which mode they're in by the chapter's structure, not by reading a badge.

---

## Visual-separation conventions (how multi-format content coexists)

The user's stated concern: *"Otherwise it is a mash up of every style which is no style."* The research surfaces a clear answer: **template differentiation by content type + URL-prefix by volume**, not pill badges or content-type labels.

### Volume-level separation: URL prefix + chrome

*Sources*: [[site-vercel-docs]] (`/docs/` vs `/kb/`), [[site-linear-docs]] + [[site-linear-method]] (separate domains entirely), [[site-react-dev]] (two-mode Learn/Reference toggle).

The three volumes (Handbook / Architect's Reference / Field-Guide) live at separate URL roots. Each has its own visual chrome: typography, accent color, navigation rail behavior. A reader who lands on a Handbook chapter knows immediately, by visual register, that they're in tutorial mode — without needing to read a badge.

**Specific**:
- Handbook → narrative typography (slightly larger body, wider line-height, serif-leaning option for prose sections)
- Architect's Reference → reference typography (denser, monospace-friendly code-prose mix, table-heavy)
- Field-Guide → research-report typography (compact, callout-dense, citation-heavy)

### Chapter-level separation: template by content type

*Sources*: [[site-tailwind-docs]] (distinct page templates: installation ≠ utility reference), [[book-refactoring-fowler]] (uniform recipe template differs from prose-chapter template), [[site-react-dev]] (Note vs Pitfall vs DeepDive vs Recipes — different visual treatment per kind).

Within a volume, **template = content type signal**:
- **Tutorial chapter** (Handbook main chapters) → executive summary → mechanism → worked example → principles → spiral references → exercise
- **How-to guide** (supplements, Field-Guide chapters) → problem statement → prerequisites → numbered steps → expected outcome → see-also
- **Reference recipe** (Architect's Reference) → Sketch → When-to-use → Mechanics → Example → Things-to-Remember
- **Reference appendix** (handbook appendices) → topic → entries with consistent shape per entry (e.g., one row per hook event)
- **Cheat sheet** (if adopted) → tables + matrices + command snippets; minimal prose
- **TL;DR companion** (if adopted) → 1-page chapter summary; same content as chapter exec summary + 2-3 elaboration paragraphs

The user doesn't need badges or labels to know which they're reading — the template's structure carries the signal.

### Callout-level separation: rich vocabulary, used sparingly

*Sources*: [[site-react-dev]] (rich callout vocabulary: `<Note>`, `<Pitfall>`, `<DeepDive>`, `<Recipes>`, `<YouWillLearn>`), [[site-mdn]] (single canonical yellow Note style — high signal because there's only one), [[theory-mayer-multimedia-principles]] (signaling principle).

**The handbook commits to ~8 callout types, each with a distinct visual treatment**:
- `<KeyIdea>` — crystallized takeaway (high prominence)
- `<TryThis>` — 10-minute exercise (active green border)
- `<InsightBox title="...">` — "Why X matters" explanation (muted border, italic intro)
- `<BeforeAfter>` — contrast pair (two-column layout)
- `<DecisionBox>` — decision framework (green callout with branching arrows)
- `<MaturityLevel n={1..5}>` — inline maturity-level chip
- `<MarginNote variant="note|warning|tip" label="...">` — semantic margin annotation (8 labels: Official / Tip / Warning / Cost / Enterprise / Template / Vocab / Cross-Ref)
- `<Tag kind="official|practitioner|convergence">` — inline source attribution
- **`<WorkedExample>` (Phase 0.7 scaffold work)** — collapsible worked example
- **`<Pitfall>` (Phase 0.7 scaffold work)** — common-mistake warning, distinct from generic Warning

**Used sparingly**: a chapter that uses every callout type once is doing it right; a chapter that uses 12 `<MarginNote>`s in a single section has lost the signal. The 25-word margin-note cap exists to enforce density discipline.

### What we explicitly REJECT

From the research:
- **Generic `info/warning/danger/note` callouts** (Docusaurus / Starlight default). Low signal; replaced by the rich vocabulary above.
- **Content-type pill badges on every page** (Cloudflare's most rigorous approach). High discipline cost; replaced by template differentiation.
- **Three-level nested progressive disclosure** (banned by [[nng-progressive-disclosure]]). Two levels only.
- **Decorative section breaks, "happy talk" intros, fun facts mid-chapter** (Mayer coherence principle; Tufte chartjunk; Krug "omit needless words").
- **Mixing per-chapter visual conventions** (the "mash up = no style" failure mode).

---

## Concrete adoption shortlist (research-derived recommendations)

Synthesized across all 4 sub-area READMEs ([[../docs/research/11-pedagogy/01-doc-ux-patterns/]], [[../docs/research/11-pedagogy/02-information-design/]], [[../docs/research/11-pedagogy/03-multimedia-learning/]], [[../docs/research/11-pedagogy/04-handbook-genre/]]):

**Volume-level**:
1. **React.dev's two-mode Learn/Reference pivot** (volume URL roots + chrome differentiation; [[site-react-dev]])
2. **`llms.txt` + "for agents reading this book" pivot page** in each volume ([[site-resend-docs]], [[site-vercel-docs]])

**Chapter-level**:
3. **Refactoring's uniform per-recipe template** for Architect's Reference ([[book-refactoring-fowler]])
4. **Effective-series imperative item titles** ("Prefer X", "Avoid Y") for Handbook chapter subsections ([[book-effective-series]])
5. **Worked example first; fade across the book** (Sweller worked-example effect + expertise reversal; [[theory-sweller-cognitive-load]])
6. **Retrieval prompts (not summaries) at chapter end** — 2-4 "close the book and answer" prompts before any recap ([[theory-bjork-desirable-difficulties]])
7. **Chapter learning objectives written with Bloom verbs**, mixed across cognitive levels ([[theory-blooms-taxonomy]])
8. **Spiral cross-references between chapters revisiting the same spine concept** ([[theory-bruner-spiral-curriculum]])

**Callout-level**:
9. **Rich callout vocabulary** (`<KeyIdea>`, `<TryThis>`, `<Pitfall>`, `<DeepDive>`, etc.) — see "Callout-level separation" above ([[site-react-dev]])
10. **Inline annotations next to the code/diagram they describe**, not in a paragraph below ([[theory-mayer-multimedia-principles]] spatial contiguity)
11. **Cut seductive details** — no off-topic anecdotes, no decorative imagery ([[theory-mayer-multimedia-principles]] coherence)

**Cross-cutting**:
12. **Inline `[[slug]]` cross-references** (extend the existing cache convention into chapter prose; [[site-mdn]])
13. **War-story sidebars** — 1 per chapter, named Anthropic engineer/customer narrative, 2-4 pages ([[book-skiena-algorithm-design]])
14. **Working-memory budget per section** — ≤5 bullets, ≤5 boxes per diagram, ≤30 words per sentence, ≤3 new concepts per section ([[theory-miller-chunking-schemas]])

**Open / discretionary**:
15. **Numbered Tips à la Pragmatic Programmer** — global numbering across all volumes, capped at ~50 total ([[book-pragmatic-programmer]]). Decision deferred — could enrich the handbook but adds editorial coordination cost.
16. **Two-tier exercise model** (inline Stop-and-Think with chapter-end solutions + harder Production Exercises without solutions, CS:APP style; [[book-csapp-bryant]]). Decision deferred — Phase 0.7 scaffold work needed for the exercise components.

---

## The four-layer model

Pedagogy in `claude-books` operates at four nested scales. Each scale uses different tools and serves a different reader need.

### Layer 1 — Macro (book-level architecture)

**Tools**:
- The L1–L5 Maturity Model (where readers self-place)
- The four-Part structure (Foundations / Personal Practice / Scaling & Craft / Team & Enterprise)
- Persona-routed entry pathways (new / configured / experienced / lead)
- Part Intros that declare progression ("you are at L_n; by the end of this Part you'll be at L_{n+1}")

**Reader need**: orient. "Where am I? Where do I go next?"

### Layer 2 — Chapter (Bruner spiral + cert-domain anchoring)

**Tools**:
- Each chapter declares a primary maturity level + a list of `spiral_concepts:` (concepts that get revisited at depth elsewhere). For example, Ch 2 (Your First CLAUDE.md) and Ch 9 (Scaling Configuration) form a spiral pair — readers re-encounter CLAUDE.md at increasing depth.
- `cert_domains` frontmatter + the coverage matrix in `docs/cert-coverage.md` provide a second orthogonal organization (by competency rather than by maturity level).
- Cross-references between spiral pairs use `<XRef>` so the connection is visible in rendered output, not just metadata.

**Reader need**: build a coherent mental model. "How does this chapter relate to what came before and what comes after?"

### Layer 3 — Section (hierarchical disclosure)

The user's "big picture → drill down" preference lives here.

**Tools**:
- **Chapter executive summary** — opens every chapter; 1-3 paragraphs + a `<KeyIdea>` callout. Readers can stop here and have the gist.
- **Section TL;DR sentence** — every `## section` starts with a single italicized sentence summarizing what the section establishes.
- **Worked examples** — marked via `<WorkedExample>` (Phase 0.7 scaffold component, planned). Renders collapsed by default so readers can choose whether to drill in.
- **"See also" cross-links** — at section end, `<XRef>` pointers to related sections in other chapters and to relevant how-to guides.

**Reader need**: scan first, drill on demand. "Show me the shape; let me decide what to read deeply."

### Layer 4 — Micro (callouts, margins, tags)

**Tools** (all already exist in the scaffold or LaTeX source — formalize their use):

- **`<MarginNote variant="note|warning|tip">`** with `label` ∈ {Official, Tip, Warning, Cost, Enterprise, Template, Vocab, Cross-Ref}. 25-word cap. The 8 categories carry semantic + visual distinction; readers learn to recognize Cost ≠ Warning at a glance.
- **`<Tag kind="official|practitioner|convergence">`** for inline source attribution. Every named practice gets a tag.
- **`<KeyIdea>`**, **`<TryThis>`**, **`<InsightBox>`**, **`<BeforeAfter>`**, **`<DecisionBox>`** — pedagogical box types. Used sparingly so each retains signal.

**Reader need**: contextual cues without losing flow. "Tell me when something is important, dangerous, or worth knowing the source of — without breaking my reading."

---

## Content type taxonomy

**OPEN — framework naming**: Should we name this as Diátaxis explicitly, or define handbook-owned vocabulary?

Two candidate framings:

### Option A — Diátaxis explicit (recommendation pending Phase A)

The [Diátaxis framework](https://diataxis.fr/) divides technical content into four quadrants:

| Diátaxis quadrant | claude-books artifact |
|---|---|
| **Tutorial** (learning-oriented; longest form) | Chapter (`src/content/chapters/*.mdx`) |
| **How-to guide** (task-oriented; short focused) | Supplement (`src/content/poc/*.mdx` in PoCs; will move to `src/content/how-to/` if adopted) |
| **Reference** (information-oriented; look-up) | Appendices (A: advanced context, B: prompting cost, C: extension reference) + cheat sheets if adopted |
| **Explanation** (understanding-oriented) | `<InsightBox>` callouts inside chapters + dedicated "why" sections |

Adopting Diátaxis explicitly gives the handbook a recognized vocabulary. Readers who know Diátaxis can map immediately. Tradeoff: ties the handbook to an external framework that might evolve.

### Option B — Handbook-owned vocabulary

Same four content types but named in handbook terms (e.g., **Chapter** / **How-To** / **Reference** / **Insight**). Owns the model; lower citation surface; readers don't need external context.

### Supplement format options (under exploration)

The user's "quick read supplements" need has several candidate shapes. Phase C builds PoCs of each so they can be compared side-by-side:

1. **Task-oriented how-to guide** — Diátaxis-style; one problem → solution. Lives at `src/content/how-to/<slug>.mdx`.
2. **Per-chapter TL;DR** — 1-page summary of each chapter; ~5-min read. Same content, compressed.
3. **Per-Part Executive Summary** — 1-2 pages covering a whole Part. Bigger scope than TL;DR.
4. **Cheat sheet / reference card** — dense one-pager: tables, decision matrices, command snippets. Look-up oriented.

**OPEN — supplement format**: User to pick after viewing PoCs (Phase C output). Options: adopt 1, adopt 2-3 with explicit visual differentiation, or adopt all 4 with visual conventions that make their roles obvious at a glance.

---

## Worked-example labeling + collapsible disclosure

**Adopted convention** (shipped in scaffold v4.1.0, 2026-05-23):

The MDX component `<WorkedExample>` is now available at `@brandon_m_behring/book-scaffold-astro/components/WorkedExample.astro`:
- A `title` prop (1-sentence summary: "Example: configuring CLAUDE.md for a monorepo")
- A collapsible body via native `<details>` (closed by default — hierarchical disclosure; zero JS)
- An `id` prop that becomes `#worked-example-{id}` (prefixed to avoid heading-anchor collisions) for direct linking from TL;DRs and cheat-sheets
- Optional `expanded` prop to ship open by default for small examples

Rationale (Sweller's worked-example effect + NN/g progressive disclosure): full theoretical justification in [`../docs/design/2026-05-23_visual-pedagogy.md`](../../docs/design/2026-05-23_visual-pedagogy.md) § "Worked-example collapsible — why this specific UX".

**Adoption plan**: PoCs use inline worked examples for now (the existing Ch 1 / Ch 5-8 tutorial PoCs); chapter v1.0 prose adopts `<WorkedExample>` opportunistically when worked examples exceed ~30 lines. Round 1 / 2 cross-chapter observation: worked examples are the spine of every tutorial; collapsing the heaviest ones lets the surrounding narrative breathe.

---

## Figures + diagrams

Backed by 9 tech-comparison notes at [[../docs/research/11-pedagogy/05-figures-diagrams/]] surveying Mermaid, D2, TikZ→SVG, authored SVG, ASCII, Excalidraw, Graphviz, PlantUML, and the deferred interactive set (D3 / React Flow).

**Core commitment** — every diagram in the handbook is **SVG in production**, regardless of how it was authored. SVG is the universal output target: accessibility hooks (`<title>` / `<desc>` / `role="img"`), dark-mode via CSS-variable substitution, print-clean vectors, and uniform tooling all assume SVG. ([[tech-mermaid]] cross-cutting finding 1.)

### Four-tier adoption stack (v1.0)

Pick by use case, not by author preference. Per-figure decisions go through the tree at the end of this section.

| Tier | Tech | Best for | Est. count (across 3 volumes) |
|---|---|---|---|
| 1 (default) | **Mermaid** | Flowcharts, sequence diagrams, state machines, simple ER, decision trees | 30–50 figures |
| 2 (inherited) | **TikZ → SVG pipeline** | Diagrams already authored in the LaTeX source repo (agent loop, L1–L5 pyramid, context-budget charts, configuration hierarchy) — also the format we hand-author new figures in. In place 2026-05-24: `figures/agent-loop/`, `figures/context-budget/`, `figures/collaboration-flowchart/`, `figures/collaboration-quadrant/`, `figures/validation-pyramid/`, `figures/extension-decision/` (10 SVGs total across tutorial + compact-cheat-sheet variants) | 8–15 figures |
| 3 (hero) | **Authored SVG** (Figma → export → process) | Chapter-opening visuals, volume-pivot illustrations, "this metaphor unlocks the chapter" diagrams | 6–10 figures |
| 4 (text-native) | **ASCII / box-drawing** | Cheat-sheet supplements, code-context diagrams, print-dense reference; the Ch 1 cheat-sheet PoC already uses this | 5–10 figures |

**Deferred to v1.5+ or rejected for v1.0**:
- **D2** ([[tech-d2]]) — defer unless Mermaid's layout proves insufficient
- **Excalidraw** ([[tech-excalidraw]]) — possibly for Volume 3 (Field-Guide) where the hand-drawn register fits the empirical voice
- **Graphviz / DOT** ([[tech-graphviz-dot]]) — do not adopt; Mermaid covers the same use cases with better author UX + built-in accessibility
- **PlantUML** ([[tech-plantuml]]) — do not adopt for v1.0; revisit only if Volume 2 (Architect's Reference) needs C4 architecture diagrams Mermaid can't render acceptably
- **D3.js + React Flow** ([[tech-interactive-d3-reactflow]]) — defer all runtime/interactive rendering to v1.5+. v1.0 ships static
- **KaTeX** (for math) — implicit: adopt for any token-economics / sampling / cost-formula notation. Build-time, accessible by default. Filed as a follow-up if MDX integration friction surfaces

### Why Mermaid is the default (not just "common")

Mermaid wins for *one specific reason* that none of the alternatives match: **built-in accessibility primitives** (`accTitle` + `accDescr` directives that emit `<title>` / `<desc>` on the resulting SVG). Every other diagrams-as-code tool requires post-processing or manual SVG editing to inject those tags. Combined with native MDX integration via `remark-mermaidjs` (build-time SVG emission), this is the single tilt that locks Mermaid as the default. ([[tech-mermaid]] § Accessibility.)

### Per-figure decision tree

For each new diagram an author adds, the algorithm is:

```
Is this diagram already in the LaTeX source repo (~/claude-best-practices)?
├── YES → Tier 2 (TikZ → SVG). Preserve the source-repo work.
└── NO ↓
    Is this a hero / chapter-opener / metaphor diagram?
    ├── YES → Tier 3 (authored SVG). Budget design time.
    └── NO ↓
        Is this a cheat-sheet or code-context diagram (lives next to dense text)?
        ├── YES → Tier 4 (ASCII / box-drawing).
        └── NO → Tier 1 (Mermaid). Default.
```

**Authors should never weigh "D2 vs Mermaid" per-diagram.** One default, held. ([[../docs/research/11-pedagogy/05-figures-diagrams/README]] § Recommended decision posture.)

### Cross-cutting requirements (apply to all tiers)

1. **Accessibility is mandatory, not optional.** Every figure ships with `<title>` + `<desc>` (or `accTitle` + `accDescr` in Mermaid source) + a prose figcaption. The scaffold validator (Phase 2.6+) should fail the build on figures missing these.

2. **Dark mode via CSS-variable substitution.** SVG fills/strokes use `var(--diagram-primary, #fallback)`; page CSS swaps the variable per theme. One SVG, two themes — no JS swap, no dual files. Tools that don't emit CSS-variable SVG (TikZ, Excalidraw, some Mermaid themes) need a post-export rewrite step in the scaffold's diagram pipeline. ([[../docs/research/11-pedagogy/05-figures-diagrams/README]] § cross-cutting finding 4.)

3. **Build-time, not runtime.** Mermaid + D2 + TikZ + authored SVG all render to static `public/figures/*.svg` at build. The static site has zero diagram-rendering toolchain in production. Source-hash caching avoids re-rendering unchanged diagrams.

4. **Source and artifact separate.** The `.mermaid` fence (or `.tex` file, or Figma export) lives in repo as the editable source; the `.svg` in `public/figures/` is the build artifact. Diff review reads source; readers consume artifact.

5. **Working-memory cap.** Diagrams obey the same Miller/Cowan ≤7-node limit as prose chunks ([[theory-miller-chunking-schemas]]). Bigger architectures get decomposed across multiple linked diagrams, not crammed into one.

6. **Print-friendly fonts.** Print/PDF pipelines either embed font outlines as `<path>` or restrict to system-available fonts. Decision deferred until v2 PDF work begins.

### Math notation

For inline + display math (token-economics, sampling, cost formulas), adopt **KaTeX** via `rehype-katex`. Build-time, accessible (KaTeX emits `<math>` MathML alongside the rendered output), no runtime dependency. MathJax is more feature-complete but heavier; KaTeX covers what a practitioner book needs. Filed as Phase 0.7 scaffold work item if the integration doesn't already exist.

### Open questions for the figure pipeline

- **Mermaid plugin choice**: `remark-mermaidjs` (Puppeteer-based, mature) vs `@theguild/remark-mermaid` (newer, lighter). Needs a small PoC before settling.
- ~~**TikZ pipeline ownership**: does `book-scaffold-astro` own the LaTeX → SVG conversion, or does the LaTeX source repo build its own SVG artifacts that `handbook/` consumes?~~ **RESOLVED 2026-05-23 in scaffold [v4.2.0](https://github.com/brandon-behring/book-scaffold-astro/releases/tag/v4.2.0)**: `book-scaffold build-figures` now auto-compiles TikZ `\documentclass{standalone}` `.tex` sources via `pdflatex` → `pdf2svg` pipeline. Source `.tex` lives in `figures/<topic>/`; output `.svg` in `public/figures/<topic>/`. Recipe at `package/recipes/16-tikz-figures.md`. Consumers without TeX Live get a clear ERROR + skip; pre-built `.pdf` files still convert normally.
- **CSS-variable injection step**: a regex-replace pass that rewrites Mermaid's emitted `fill="#xxx"` → `fill="var(--diagram-x, #xxx)"`. Build once in the scaffold; reuse across volumes.
- **C4 architecture diagrams** (Volume 2): Mermaid added C4 in v9.4 but quality is uneven. C4-PlantUML is the best-in-class option. Defer decision until Volume 2 outlines exist.
- **Interactive figure scaffold** (v1.5+): when scoped, design `<InteractiveFigure>` to enforce keyboard nav + `aria-live` + no-JS fallback as a structural constraint, not per-figure manual responsibility.

---

## Source attribution + freshness (already in place)

Two existing conventions stay as the v1.0 baseline:

- **`<Tag kind="official|practitioner|convergence">`** for every named practice. Inline. Renders as a small visual chip.
- **`volatility` + `last_updated` + `introduced_in_version`** in chapter frontmatter. The staleness banner renders when `volatility !== "stable-principle"` and `last_updated > 90 days`.

These give readers **epistemic transparency**: they see *where* claims come from and *when* the content was last verified. Crucial for a fast-moving topic like Claude Code.

---

## Interleaving rationale (Bruner + Bjork)

Why the spiral curriculum + scattered worked examples + cross-references — instead of "introduce a concept fully, then never revisit it"?

**Full theoretical rationale extracted to [`../docs/design/2026-05-23_visual-pedagogy.md`](../../docs/design/2026-05-23_visual-pedagogy.md)** during the 2026-05-24 design-doc refactor. That doc cites the five load-bearing bodies of theory (Bruner spiral, Bjork desirable difficulties, Mayer signaling, Sweller worked-example effect, Miller/Cowan chunking) and explains how they combine to justify the decisions below.

Quick reference:
- **Bruner spiral** → decision #1 + #10 (concepts recur at depth; ≥3-chapter spine)
- **Bjork desirable difficulties** → decision #15 (retrieval prompts at chapter end, not summary recap)
- **Mayer signaling** → decision #5 (8-category margin notes) + #11 (visual presentation principles) + #14 (rich callout vocabulary)
- **Sweller worked-example effect** → decision #8 (`<WorkedExample>` collapsible; SHIPPED + ADOPTED)
- **Miller/Cowan chunking** → visual presentation principles + figures-section node-cap rule (≤7 per diagram)

Decisions below operationalize these theories as engineering constraints on chapter authoring.

---

## Decision log

State of each pedagogical choice as of 2026-05-23. **OPEN** = still exploring; **DECIDED** = locked in (with date).

| # | Decision | State | Notes |
|---|---|---|---|
| 1 | Adopt Bruner's spiral curriculum | **DECIDED** (predates this doc — already in LaTeX source) | Continue; explicitly name in PEDAGOGY.md |
| 2 | Adopt L1–L5 Maturity Model | **DECIDED** (predates this doc) | Continue |
| 3 | Adopt four-persona reader routing | **DECIDED** (predates this doc) | Add explicit MDX-rendered router on landing page (Phase 0.7 scaffold work) |
| 4 | Adopt source-tag attribution (`official/practitioner/convergence`) | **DECIDED** (predates this doc) | Continue |
| 5 | Adopt 8-category margin-note system | **DECIDED** (predates this doc) | Continue; consider Vocab as `<TermDef>` link once glossary lands |
| 6 | Adopt Diátaxis content-type quadrant explicitly | **DECIDED** (2026-05-23) — adopt, but volume names lead | Diátaxis vocabulary in PEDAGOGY.md + research notes; reader-facing nomenclature uses volume names (Handbook / Architect's Ref / Field-Guide) rather than "tutorial/reference/how-to" labels. Volumes inherently map: Handbook=tutorial+explanation, Architect's Ref=reference+explanation, Field-Guide=how-to+explanation |
| 7 | Final supplement format(s) | **OPEN** (Round 2 evidence strengthens but doesn't close) | Round 1 (Ch 1 × 5): tutorial / how-to / TL;DR / cheat-sheet visually distinct + worth keeping; Part-summary OPEN. Round 2 (Part II × 5; Ch 5-8 × 4 formats + part2-summary) on 2026-05-23: tutorial-vs-cheat-sheet distinction holds across 4 chapters with different content registers; recommend tightening to **tutorial + TL;DR + 1 how-to + 1 cheat-sheet = 4 per chapter** as the v1.0 commitment (60 artifacts × 15 chapters). Part-summary slot still OPEN — Round 2 found it structurally repetitive vs longer TL;DR. Pending final user review |
| 8 | `<WorkedExample>` collapsible component | **DECIDED + SHIPPED + ADOPTED** (scaffold v4.1.0 2026-05-23; adopted in Ch 1 + Ch 5-8 tutorial PoCs 2026-05-24) | Available at `@brandon_m_behring/book-scaffold-astro/components/WorkedExample.astro` with `#worked-example-{id}` anchor pattern. Adopted IDs so far: `agent-loop-walkthrough` (Ch 1), `context-fill-example` (Ch 5), `sycophancy-interview` (Ch 6), `median-bug` (Ch 7), `security-review-composition` (Ch 8) |
| 9 | Sub-chapter prerequisite tagging (e.g., section-level maturity) | **DEFERRED to v1.1** | Adds complexity; top-level chapter maturity tag sufficient for v1.0 |
| 10 | Interleaving rationale section in PEDAGOGY.md | **DECIDED** (this doc) | See "Interleaving rationale" above |
| 11 | Visual presentation principles (concrete) | **DECIDED** (2026-05-23) — 8 principles | See "Visual presentation principles" section. Backed by 38 source notes in `docs/research/11-pedagogy/` |
| 12 | Visual separation conventions for multi-format coexistence | **DECIDED** (2026-05-23) — template + URL-prefix, not badges | See "Visual-separation conventions" section. Reader recognizes content type by template structure + volume chrome, not by reading a content-type label |
| 13 | Framework citation strategy (cite Bruner/Bjork/Mayer explicitly vs not) | **DECIDED** (this doc) | Cite explicitly in interleaving rationale; references in `docs/research/11-pedagogy/03-multimedia-learning/` |
| 14 | Rich callout vocabulary (`<Pitfall>` etc.) vs generic info/warn | **DECIDED + SHIPPED + ADOPTED** (scaffold v4.1.0 2026-05-23; adopted across Ch 1 + Ch 5-8 tutorial PoCs 2026-05-24) | `<Pitfall>` / `<WorkedExample>` / `<YouWillLearn>` pedagogy family present in 5 of 5 chapter tutorials. Pitfall count by chapter: Ch 1 = 3, Ch 5 = 4, Ch 6 = 3, Ch 7 = 5, Ch 8 = 2 (new). YouWillLearn opens every tutorial with the appropriate prerequisites prop |
| 15 | Retrieval prompts at chapter end (vs summary recap) | **DECIDED** (2026-05-23) — retrieval prompts | 2-4 "close the book and answer" prompts before any recap ([[theory-bjork-desirable-difficulties]]) |
| 16 | War-story sidebars in chapters | **OPEN** (recommended) | Per [[book-skiena-algorithm-design]]; 1 per chapter when a named anecdote exists. Decision deferred until first 2-3 chapters land — does the format work for Anthropic-specific content? |
| 17 | Volume-level chrome differentiation (typography / accent color per volume) | **DECIDED** (2026-05-23) — yes | See "Volume-level separation". Visual register signals reader-mode without needing labels |
| 18 | Numbered Tips à la Pragmatic Programmer | **OPEN** | ~50 total cap across volumes if adopted. Decision deferred — could enrich the handbook but adds editorial coordination cost |
| 19 | Two-tier exercise model (inline + end-of-chapter) | **OPEN** | Recommended per [[book-csapp-bryant]]; needs Phase 0.7 `<Practice>` component. Decision deferred until that scaffold work is sized |
| 20 | `llms.txt` + "for agents" pivot page per volume | **DECIDED** (2026-05-23) — yes | Becoming table-stakes per [[site-resend-docs]] + [[site-vercel-docs]]. Implementation in Phase 1.5 (deploy) per existing roadmap |
| 21 | Four-tier figure stack (Mermaid / TikZ-inherited / authored SVG / ASCII) | **DECIDED** (2026-05-23) | See "Figures + diagrams" section. Backed by 9 tech-comparison notes in `docs/research/11-pedagogy/05-figures-diagrams/`. Per-figure decision tree locked |
| 22 | Mermaid as the diagrams-as-code default (not D2, not Graphviz, not PlantUML) | **DECIDED** (2026-05-23) | Tilt: built-in `accTitle`/`accDescr` accessibility primitives ([[tech-mermaid]]). No other diagrams-as-code tool emits a11y tags without post-processing |
| 23 | SVG as universal output target (regardless of source tech) | **DECIDED** (2026-05-23) | Enables uniform accessibility hooks, CSS-variable dark mode, print-clean vectors, source-hash caching. Source format diverges; production artifact does not |
| 24 | Dark mode via CSS-variable substitution (one SVG, two themes) | **DECIDED** (2026-05-23) | Avoid dual-file swap pattern (doubles build cost, duplicates a11y tags, breaks print-CSS). Post-export rewrite step in scaffold's diagram pipeline handles tools that don't emit CSS-variable SVG natively |
| 25 | KaTeX for math notation (not MathJax, not images) | **DECIDED** (2026-05-23) | KaTeX is faster and lighter; emits MathML for a11y. Phase 0.7 scaffold work if not already wired |
| 26 | D3 / React Flow / runtime-rendered interactive figures | **DEFERRED to v1.5+** | All static for v1.0. When scoped, `<InteractiveFigure>` enforces keyboard nav + `aria-live` + no-JS fallback as structural constraints |

---

## Open questions deferred to v1.1+

Full list moved to [`../docs/design/2026-05-23_visual-pedagogy.md`](../../docs/design/2026-05-23_visual-pedagogy.md) § "Open questions deferred to v1.1+" during the 2026-05-24 refactor (includes the original 5 items plus 2 added from guides-recon: PFL transfer-model adoption + multi-paradigm presentation lint).

Quick reference:
- Sub-chapter prerequisite tagging (DEFERRED to v1.1 per decision #9)
- Reader profile router on landing page (blocked on Phase 0.7 scaffold work)
- Glossary integration (`<TermDef>` / `<Term>`, blocked on Phase 0.7)
- Live API playgrounds (deferred to post-v1.0 per roadmap)
- Re-audit cadence CI check (after Ch 1-5 land in v1.0)
- PFL transfer-model adoption (P2 per guides-recon)
- Multi-paradigm presentation lint (P3 per guides-recon)

---

## How to use this doc

- **As an author**: read once before writing your first chapter; refer when applying a pedagogical primitive (margin note category, callout, source tag) to know the canonical convention.
- **As a reviewer**: check that the chapter draft uses Layer 1-4 tools correctly (executive summary present? margin-note categories applied correctly? source tags on named practices?).
- **As a contributor adding a new chapter type**: extend the Decision log with a new row + add the new convention to the appropriate Layer.

---

## Provenance

- **Inventory section** derived from Explore agent findings 2026-05-23 surveying `~/claude-best-practices/` LaTeX source + `~/claude-books/handbook/`.
- **Visual presentation + Visual separation sections** filled by Phase A research synthesizing `docs/research/11-pedagogy/`.
- **Interleaving rationale** cites Bruner / Bjork / Mayer per verified primary sources in `docs/research/11-pedagogy/03-multimedia-learning/`.
- **Decision log** maintained as choices land. Open items resolve via PEDAGOGY.md edits + a BURN_IN-style note in this doc's commit history.
