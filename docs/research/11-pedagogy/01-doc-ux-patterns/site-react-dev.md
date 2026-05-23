---
source_url: https://react.dev/learn
canonical_url: https://react.dev/learn
source_title: "React.dev"
fetched_at: 2026-05-23
last_verified_at: 2026-05-23
topic: pedagogy-doc-ux
tier: T3-practitioner
cert_domains: []
cert_task_areas: []
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# React.dev — UX + visual presentation patterns

## Site context
- The official React documentation at `react.dev`, launched 2023 as a wholesale rewrite/restructure of `reactjs.org`. Audience: React developers from beginners through framework authors. Known as the **most thoughtfully-designed open-source framework docs of the post-2022 wave**, with explicit pedagogical intent: aim for 80% coverage in the Learn track, separate Reference cleanly.
- Distinctive feature: every concept page has **interactive Sandpack examples** (embedded modifiable code editors) inline with prose. Set a benchmark that newer frameworks have largely failed to match.

## Layout + IA observations
- Two-mode top-nav pivot: **Learn** vs **Reference**. This is the strongest Diátaxis-aligned IA in the entire research set — two parallel tracks, visually different chrome, but linked across.
- Within each mode: three-column layout. Left sidebar with hierarchical chapter/section nav; wide center prose + Sandpack; right "On this page" anchor list.
- Sidebar shows progress indicators in the Learn track — small filled/empty dots next to chapter names showing what you've visited.
- Search across both modes from the same palette.
- Breadcrumbs minimal — IA is shallow enough not to need them.

## Code + prose interleaving
- **Sandpack** is the signature primitive. Inline modifiable code editor with file tabs (App.js / index.js / styles.css), live preview pane, and console. Readers can edit any code and see immediate results without leaving the page.
- Static (non-interactive) code blocks use Shiki syntax highlighting with **line-number highlights**: ```` ```js {3} ```` marks line 3 as the focal point with a colored background stripe.
- Inline `code` for syntax terms (`useState`, `componentDidMount`).
- Pattern within sections: prose → small static code snippet → interactive Sandpack with extended example.

## Multi-format coexistence pattern
- **Learn vs Reference** is the canonical content-type pivot. The visual differentiation between the two tracks is one of the most studied design choices in modern docs:
  - **Learn pages**: narrative flow, problem→solution pairing, `<YouWillLearn>` outcome lists, interactive sandboxes, `<DeepDive>` collapsibles, illustrated diagrams (state-flow `<DiagramGroup>` components).
  - **Reference pages**: spec-first structure (`useState(initialState)` as monospace H3), Parameters / Returns / Caveats sub-headers, `<Pitfall>` red-bordered warning callouts, `<Recipes>` grouped example sets, `<InlineToc>` auto-generated TOC.
- Cross-links from Learn → Reference are inline and frequent: a Learn page mentions `useState` and links it directly to `/reference/react/useState`. Reference → Learn cross-links are rarer; reference assumes you've done Learn.

## Visual hierarchy techniques
- Custom-built component library (MDX-based) instead of a generic theme. Each callout type has distinct chrome:
  - `<Note>` — neutral blue/gray bordered box.
  - `<Pitfall>` — red/amber bordered box for "Calling the set function does not change the current state in the already executing code..."
  - `<DeepDive>` — collapsible/expandable for optional deep content.
  - `<Recipes>` — grouped set of related Sandpack examples.
  - `<YouWillLearn>` — bulleted outcome list at top of Learn pages.
- Typography: clean sans-serif, generous line height, larger base font than most docs.
- Custom illustrations: cartoon-style diagrams (think "lifting state up" diagrams with characters) — high illustration investment, sets the tone as pedagogical rather than reference.
- Capitalized convention call-outs in prose ("React component names must always start with a capital letter") with bold emphasis for the constraint.
- 🚩 / ✅ emoji for mistakes/correct patterns inline — readable, low-cost visual cue.

## What's worth borrowing for claude-books
- **Two-mode Learn/Reference top-nav pivot is the cleanest Diátaxis implementation for pedagogical content.** For claude-books across three volumes, the structure could be: **Read** (long-form chapters) vs **Reference** (API/skill/hook lookups) vs **Try** (case-study walkthroughs). Three modes works too if you commit.
- **Distinct callout components** (Note / Pitfall / DeepDive / Recipes / YouWillLearn) is a great vocabulary. Way more useful than the generic info/warning/danger triple most docs ship with.
- **`<YouWillLearn>` at chapter open** is a pattern every chapter should adopt — explicit 4-6 bullet outcome list before the prose starts.
- **`<DeepDive>` collapsibles** are the right home for "here's the actually advanced version of this concept" content — keep the main flow clean for the 80% reader, let the 20% expand for depth.
- **80/20 framing** is explicit on the React.dev Quick Start page: "This page will give you an introduction to 80% of the React concepts that you will use on a daily basis." Books should be similarly upfront about coverage promises.
- **Cartoon illustrations** for conceptual diagrams are a brave choice that pays off — adds editorial voice; signals the docs are friendly. For claude-books, custom illustrations for "agent loop" / "context window" / "tool use" concepts would be a major differentiator.

## What to avoid
- Sandpack is **very expensive** to implement and maintain — interactive code-execution sandboxes inline with prose require infrastructure investment most books can't justify. The lighter equivalent is animated GIFs or recorded terminal sessions.
- The illustration investment is significant — original characters and consistent visual style cost serious design time. A book ships once; React.dev iterates illustrations as the library evolves.
- The Learn/Reference visual split works because React has a small enough API surface (hooks + a handful of patterns) that "Reference" stays manageable. Claude Code's API surface is larger (29 hooks + Skills + MCP + Subagents + tools) — Reference visual chrome needs to scale farther.

## Quoted (citation-ready)

> "Welcome to the React documentation! This page will give you an introduction to 80% of the React concepts that you will use on a daily basis."
>
> — React.dev, Quick Start opening
>
> Anchor: `Quick Start opening + Welcome to the React documentation`

> "Calling the set function does not change the current state in the already executing code... It only affects what useState will return starting from the next render."
>
> — React.dev, Reference / useState / Pitfall callout
>
> Anchor: `useState Pitfall + Calling the set function does not change the current state`

> "Hooks are more restrictive than other functions. You can only call Hooks at the top of your components..."
>
> — React.dev, Learn / Quick Start / constraint statement
>
> Anchor: `Quick Start constraint statement + Hooks are more restrictive`

## Cross-references
- See [[site-diataxis]] for the framework React.dev's Learn/Reference split most cleanly implements.
- See [[site-astro-docs]] for an alternative four-mode top-nav pivot (Tutorial / Guide / Reference / Ecosystem) versus React's two-mode.
- See [[site-tailwind-docs]] for an alternative "templates do the differentiation" approach to content-type signaling.
- See [[site-mdn]] for the older-generation reference site that newer docs (incl. React.dev) iterate on.
- See [[README]] for the cross-site synthesis.
