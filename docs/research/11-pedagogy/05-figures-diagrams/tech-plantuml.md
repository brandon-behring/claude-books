---
source_url: https://plantuml.com/
canonical_url: https://plantuml.com/
source_title: "PlantUML — Open-source tool that uses simple textual descriptions to draw beautiful UML diagrams"
fetched_at: 2026-05-23
last_verified_at: 2026-05-23
topic: pedagogy-figures-diagrams
tier: T1-official
cert_domains: []
cert_task_areas: []
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# PlantUML — for claude-books

## What it is + best-fit use case
- Java-based diagrams-as-code system, in continuous development since 2009. Specialized for UML and UML-adjacent diagrams.
- Supports: sequence diagrams, class diagrams, use-case, activity, component, deployment, state, object, timing, ER, JSON/YAML visualization, C4 (via C4-PlantUML extension), Gantt, mind maps, work-breakdown structure, math diagrams.
- Uses Graphviz under the hood for some layout (specifically class and activity diagrams).
- **Best fit**:
  - UML class hierarchies (the historical sweet spot — class boxes with methods/attributes).
  - Sequence diagrams when the diagram is large (PlantUML handles wide sequence diagrams better than Mermaid).
  - C4 architecture diagrams (with the C4-PlantUML extension — best-in-class C4 support).
  - Books or technical docs in the enterprise / banking / Java ecosystem where UML is the lingua franca.
- For claude-books specifically: the audience is not strongly UML-trained. The Mermaid sequence-diagram sweet spot covers the handbook's needs without PlantUML's overhead.

## Astro/MDX integration
- No first-party Astro plugin. Integration patterns:
  1. **Server / build-time via PlantUML JAR**: `java -jar plantuml.jar -tsvg input.puml`. Output SVG. Heavy: requires JRE in CI.
  2. **PlantUML web server (`plantuml-server`)**: a self-hosted HTTP API. Author posts source, gets SVG. Possible but introduces a runtime dependency.
  3. **Hosted PlantUML proxy (`www.plantuml.com/plantuml/svg/<encoded>`)**: free public proxy; encode the diagram source into a URL fragment, get SVG back. Some sites use this directly (privacy concern — every page view leaks the diagram source to a third party).
  4. **WASM build (community `plantuml-wasm`)**: emerging but immature.
- For claude-books, pattern #1 with a build-time JAR is the only acceptable option (privacy + offline-build) — but the JRE dep is a real cost. Adds ~200 MB to the CI image.

## Source format + maintainability
- `.puml` text files. Syntax is mature and well-documented. Example sequence:
  ```
  @startuml
  participant User
  participant "Claude Code" as CC
  participant Filesystem as FS
  User -> CC: prompt
  CC -> FS: Read(path)
  FS --> CC: file contents
  CC --> User: response
  @enduml
  ```
- Diff-friendly. Authors familiar with UML find PlantUML highly productive.
- Learning curve: low for sequence, medium for class/state, high for the more exotic diagram types (timing diagrams, deployment diagrams) which have a lot of syntax.

## Build vs runtime + dependencies
- Build-time JAR. Requires JRE. Heavy CI dep.
- Output SVG sizes: comparable to Mermaid/D2 (3–15 KB per diagram).
- Build cost per diagram: 1–3 seconds (JVM startup is the main cost; multiple diagrams per JVM session amortize this).

## Accessibility
- SVG output is text-readable (PlantUML emits `<text>` for all labels).
- No explicit `accTitle` directive — title goes in `title` element via PlantUML's `title "Your title"` syntax.
- `caption` and `header`/`footer` also supported and rendered as text.
- Color contrast: PlantUML's default theme is fine for light mode; many alternative skins (e.g., `!theme amiga`, `!theme cerulean`) are available. Dark-mode skin exists but is less polished than Mermaid's dark theme.

## Theme-awareness (dark mode + print)
- Built-in skin system via `skinparam` directives or `!theme <name>`. Some dark-mode themes.
- Dual-render workflow: same source file, two builds with different `!theme` declarations. Or use `skinparam` overrides in a build wrapper.
- Print: SVG, scales cleanly.

## Performance
- Slow build (JVM startup). With caching by source-hash, incremental builds are fast.
- Output size and runtime page-weight are comparable to Mermaid.

## Real-world examples
- **Enterprise software documentation**: PlantUML is heavily used in finance, banking, telecom, and other heavily-regulated industries where UML compliance is a contractual requirement.
- **Spring Framework documentation** uses PlantUML for architectural diagrams.
- **arc42 / C4 model adopters**: Simon Brown's C4 architecture model is best-supported via the C4-PlantUML extension; most C4 adopters use PlantUML to author.
- **Atlassian Confluence** has a PlantUML macro popular in enterprise wikis.
- **Adoption in OSS books / tech books**: rarer than Mermaid in the OSS book ecosystem. PlantUML's footprint is more "internal enterprise documentation" than "public technical book."

## Recommendation for claude-books
- **Do not adopt for v1.0.** Mermaid covers sequence diagrams (PlantUML's main strength) with vastly better Astro integration and no JRE dependency. The handbook is not a UML-focused book.
- **Reconsider for v2+ if** the Architect's Reference volume (Volume 2) needs C4 architecture diagrams. The C4-PlantUML extension is best-in-class for C4 modeling. Mermaid added C4 support in v9.4 but it's still less polished than C4-PlantUML.
- **If adopted later**: standardize on `@startuml/!theme/@enduml` shell, write a `remark-plantuml` integration that shells out to the JAR at build time, scope adoption to specific chapters (don't mix PlantUML and Mermaid in the same chapter).
- **The general lesson**: PlantUML's strength is breadth (every UML diagram type, plus C4). The handbook needs depth in 2–3 diagram types, not breadth. Mermaid wins on focus.

## Quoted (citation-ready)

> "PlantUML is an open-source tool allowing users to create diagrams from a plain text language."
>
> — PlantUML, home page introduction
>
> Anchor: `home page introduction + PlantUML is an open-source tool`

> "Diagrams are defined using a simple and intuitive language. Images can be generated in PNG, SVG, or LaTeX format."
>
> — PlantUML, home page features list
>
> Anchor: `home page features list + Diagrams are defined using a simple and intuitive language`

## Cross-references
- See [[tech-mermaid]] for the lighter-weight alternative covering sequence/class diagrams.
- See [[tech-d2]] for the modern alternative also supporting C4-style diagrams.
- See [[tech-graphviz-dot]] for the layout engine PlantUML uses internally.
- See the topic README for the cross-tech synthesis.
