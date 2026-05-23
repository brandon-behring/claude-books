# Information design + IA literature

Per-source notes on the canonical literature for *presenting dense information without overwhelming readers* — the theoretical and practitioner foundations behind `claude-books`'s stated pedagogy: **big picture → drill down**, scannable, layered, and mode-disciplined.

Eight notes spanning four canonical authors (Tufte, Wurman, Krug, Boulton), the three most-cited NN/g articles, the cognitive-science basis (Sweller CLT + Hick's Law), and the modern docs-IA framework (Diátaxis).

## Notes in this directory

| File | Title | Tier | Key idea (1 line) |
|---|---|---|---|
| [book-tufte-visual-display](./book-tufte-visual-display.md) | The Visual Display of Quantitative Information | T1 | Data-ink ratio, chartjunk, graphical excellence — maximize information density per mark |
| [book-tufte-envisioning-information](./book-tufte-envisioning-information.md) | Envisioning Information | T1 | Micro/macro readings, layering and separation, small multiples — density without overwhelm |
| [nng-progressive-disclosure](./nng-progressive-disclosure.md) | Progressive Disclosure (NN/g) | T1 | Defer rare options to a second layer; two-level limit |
| [nng-f-shaped-pattern](./nng-f-shaped-pattern.md) | F-Shaped Pattern of Reading on the Web (NN/g) | T1 | Readers scan in an F-shape — first words and headings carry the load |
| [nng-ia-vs-navigation](./nng-ia-vs-navigation.md) | Information Architecture vs Navigation (NN/g) | T1 | IA is the backbone; navigation is the surface. Define IA first. |
| [book-wurman-information-anxiety](./book-wurman-information-anxiety.md) | Information Anxiety (Wurman / LATCH / 5 Hat Racks) | T1 | The five fundamental organizing schemes: Location, Alphabet, Time, Category, Hierarchy |
| [book-krug-dont-make-me-think](./book-krug-dont-make-me-think.md) | Don't Make Me Think (Krug) | T1 | Users scan, satisfice, muddle through. Eliminate extraneous cognition. |
| [book-boulton-designing-for-the-web](./book-boulton-designing-for-the-web.md) | A Practical Guide to Designing for the Web (Boulton) | T1 | Grid systems, typographic hierarchy, design-as-communication |
| [framework-cognitive-load](./framework-cognitive-load.md) | Cognitive Load + Hick's Law | T1 | Sweller's CLT: minimize extraneous load. Hick: decision time is logarithmic in choice count. |
| [framework-diataxis](./framework-diataxis.md) | Diátaxis Framework | T1 | The four documentation modes: tutorial / how-to / reference / explanation |

## Seven canonical principles for `claude-books`

Distilled across all sources — each principle has at least three independent sources backing it.

### 1. Big picture, then drill down (micro/macro readings)

*Tufte* (micro/macro), *Krug* (satisficing readers commit early), *NN/g* (F-pattern: first lines and headings carry the load). Every chapter opens with the macro view; the rest of the chapter resolves to micro detail *of the same content*. Not a separate "executive summary"; an integrated overview the body fills in.

### 2. Layer hierarchically, but only two levels (progressive disclosure)

*NN/g* (progressive disclosure: two-level limit), *Tufte* (layering and separation), *Sweller* (CLT: chunking, working-memory bounds). Primary body for everyone; one secondary layer (callouts, footnotes, expandable details) for the 20% who want depth. Three nested levels fails.

### 3. Maximize signal, erase decoration (data-ink / extraneous load)

*Tufte* (data-ink ratio, chartjunk), *Krug* ("omit needless words"), *Sweller* (extraneous load reduction). For prose: every paragraph should change what the reader knows. Decorative section breaks, "happy talk" intros, redundant emphasis — all chartjunk-equivalent.

### 4. Pick exactly one organizing scheme — LATCH

*Wurman* (LATCH: 5 organizing schemes), *NN/g* (define IA before navigation), *Diátaxis* (the four-mode taxonomy is a specific Category scheme). For `claude-books`: top-level taxonomy is Category (topic), tier is Hierarchy (T1/T2/T3), volatility is Hierarchy (stable / evolving / fast-moving), verified-at is Time. Multi-axis access is fine; *mixing all five at the same level* is the failure mode.

### 5. Pattern-recognition over per-instance learning (small multiples / conventions)

*Tufte* (small multiples), *Krug* (conventions are virtues), *Boulton* (humans recognize order; grid systems). Parallel structure across notes (identical frontmatter, identical section sequence) lets readers learn the *shape* once and then read all 120 cache notes as a single small-multiples grid. Inventing per-note formats burns cognitive budget for zero gain.

### 6. Match form to reader-mode (Diátaxis discipline)

*Diátaxis* (four modes), *NN/g* (IA must serve user state), *Krug* (don't make me think — about which mode I'm in). A single chapter should dominate in one mode (Handbook = tutorial+explanation; Field Guide = how-to; Architect's Reference = reference+explanation). Cross-link to other modes; don't inline.

### 7. Make scanning succeed (F-pattern + visual hierarchy)

*NN/g* (F-pattern), *Krug* (Billboard Design 101), *Boulton* (size + weight = hierarchy). First word of every heading must be the most distinctive content word. First sentence of every section must state the section's claim. Bullets > prose for enumerable content. Long lines wrap; long paragraphs splinter.

## How this dossier feeds the books

- **Handbook** (tutorial + explanation): use principles 1 (macro/micro), 6 (mode discipline), 7 (scannability).
- **Field Guide** (how-to): use principles 2 (progressive disclosure for depth), 4 (LATCH for chapter organization), 5 (parallel structure across how-tos).
- **Architect's Reference** (reference + explanation): use principles 3 (data-ink), 4 (LATCH for taxonomy), 5 (small-multiples tables), 6 (mode discipline at the section level).
- **Research cache itself**: already implements principles 2, 4, 5 (frontmatter LATCH, parallel structure, two-level layering with topic READMEs). Principle 3 is the active ongoing discipline (cut redundant words during note refresh).

## Open questions for this topic

- **Specific docs-IA practitioner authors** (e.g., Mike Pope, Andrew Etter's *Modern Technical Writing*, Tom Johnson's *I'd Rather Be Writing*) were not captured — Diátaxis is the dominant modern framework but practitioner-blog-level treatments exist that could be added in a refresh.
- **Tufte's *Visual Explanations* (1997)** and **Tufte's *Beautiful Evidence* (2006)** were not given dedicated notes — the principles overlap heavily with the two Tufte notes captured. Add if a chapter needs the specific sparkline (BE) or causal-explanation (VE) treatments.
- **Edward Tufte's blog and Ask E.T. forum** (`edwardtufte.com/notebook/`) host extensive case-study material that would supplement the book notes.
- **NN/g card-sorting article** (a fourth canonical NN/g piece) was deferred — the IA-vs-navigation note covers the principle; the card-sorting article is technique-specific.

## Sprint log

- **2026-05-23**: Initial dossier — 8 notes spanning all 7 requested source areas, plus topic README authored inline. Tufte split into two notes (VDQI + Envisioning) because the principles divide cleanly between content-density (VDQI) and multivariate-layering (Envisioning).
