# agentic-systems-design — AI authoring guide

This book is built with `@brandon_m_behring/book-scaffold-astro` (tools profile, `^4.23.0`). It's the **Design** book of the claude-books series — the broad, **multi-volume** discipline of engineering agentic systems: the environment an agent acts in and the context it reasons over, then tools, orchestration, evaluation, and operations.

**Status — multi-volume, foundation-first:**

- **Vol 1 — Environment & Context** — **11 ch (`ch01`–`ch11`); deep-QA pass done 2026-06-13** (8 fixes across 6 ch; new `design-audit.mjs` linter + `validate:design` gate).
- **Vol 2 — Tools & Orchestration** — **the Tools half (ch12–17) authored 2026-06-13** (ch12 spine, ch13 build-vs-buy, ch14 tool-minimization, ch15 MCP, ch16 prompting, ch17 structured output — the former merged "Shaping I/O" ch16 was split into ch16+ch17); **the Orchestration half (ch18 sub-agents · ch19 multi-agent · ch20 capstone) is outlined, authoring pending** (see `OUTLINE.md`).
- **Vol 3 — Evaluation & Operations** — **rich outline done 2026-06-13 (ch21–28, renumbered +1 after the ch16 split); authoring pending** (backed by the eval + ops dossiers; see `OUTLINE.md`).
- **+ a problem-first applied volume** (v2.0) — re-traverses the material through real problems; carries the public "what teams did" mission (the retired Field-Guide's role).

**Design v1.0 = Vols 1–3.** See [`OUTLINE.md`](./OUTLINE.md) (Vols 1–3 outline) and [`../docs/ROADMAP.md`](../docs/ROADMAP.md).

**Where things live**:

- Chapters: `src/content/chapters/chNN-*.mdx` (Vol 1, 11 ch)
- Outline + narrative arc: [`OUTLINE.md`](./OUTLINE.md)
- Extraction contract: [`SPLIT.md`](./SPLIT.md) — designed for a clean one-day extraction into its own repo on a real trigger.
- Figures: `figures/` → `public/figures/` via `book-scaffold build-figures`

**Genre — reference + explanation, hybrid form** (a short explanatory spine + per-topic chapters, each with a scannable pattern section). **Standalone (decided):** no `<XRef>`-out and no inbound `<XRef>` — the cert book points *in* via plain prose breadcrumbs only, so this book carries no cross-book build dependency (stays cleanly extractable per [`SPLIT.md`](./SPLIT.md)).

**Workspace-level conventions** (whole series): [`../CLAUDE.md`](../CLAUDE.md) (book model + editorial standards), [`../docs/BOOK-MAP.md`](../docs/BOOK-MAP.md) (**single source** for the book model), [`../AUTHORS.md`](../AUTHORS.md), [`../CONTRIBUTING.md`](../CONTRIBUTING.md), [`../LICENSE`](../LICENSE) (CC BY 4.0) + [`../LICENSE-SCRIPTS`](../LICENSE-SCRIPTS) (MIT).

**Cert-domain footprint** (floor; see [`../docs/cert-coverage.md`](../docs/cert-coverage.md)): reference-altitude depth feeding **D1** (architecture / orchestration), **D3** (Claude Code config — environment), **D5** (context & reliability), plus **D2** (tools / MCP) in Vol 2.

**Filing scaffold gaps**: log in [`../docs/scaffold-gaps.md`](../docs/scaffold-gaps.md) and file upstream with label `consumer:claude-books` — do **not** patch the scaffold locally.
