# Contributing

`claude-books` is a multi-book practitioner reference for Claude Code + the Anthropic stack — see [`docs/BOOK-MAP.md`](./docs/BOOK-MAP.md) for the book model and [`docs/ROADMAP.md`](./docs/ROADMAP.md) for status.

## Where to send PRs

| Change type | Repo |
|---|---|
| Handbook content (chapter MDX, PoC artifacts, figures, OUTLINE / PEDAGOGY / COMPARISON / NOTES) | This repo (`claude-books`) |
| Workspace-level docs (research cache, design docs, friction logs, recon memos) | This repo (`claude-books`) |
| Architect's Reference / Agentic Systems Design content | This repo (single-repo workspace; per-book extraction stays available on a real trigger — see `agentic-systems-design/SPLIT.md`) |
| Scaffold bugs / enhancements / component requests | [`book-scaffold-astro`](https://github.com/brandon-behring/book-scaffold-astro) with label `consumer:claude-books` |
| Research toolkit (lint methodology, validator improvements, skill updates) | [`research_toolkit`](https://github.com/brandon-behring/research_toolkit) |

## Where to file issues

| Issue type | Repo + label |
|---|---|
| Handbook factual corrections, typos, clarity issues | This repo |
| Methodology / pedagogy feedback (PEDAGOGY decisions, COMPARISON observations) | This repo |
| Scaffold friction (presentation, components, schemas, build tooling) | `book-scaffold-astro` with `consumer:claude-books` |
| Research-cache or lint methodology issues | `research_toolkit` |

## Durable upstream-issue policy

**Don't patch locally; surface friction upstream.** Any presentation / component / schema / build-tooling friction with `@brandon_m_behring/book-scaffold-astro` surfaces as an issue with `consumer:claude-books` label — NOT as a local workaround or fork. Six issues (#56-#61) filed during the 2026-05-23 pedagogy round all shipped in scaffold v4.1.0; the v4.2.0 release added the TikZ→SVG pipeline (closing the figure-tier-2 spec from `handbook/PEDAGOGY.md`). The policy works because the scaffold maintainer (same person as the consumer author) takes the upstream issues seriously.

Likewise for `research_toolkit`: lessons surface as new entries in `~/Claude/research_toolkit/BURN_IN_NOTES.md` (items 1-11 currently); validator + skill improvements ship in toolkit releases rather than as local patches in `docs/research/.lint.py`. Local linter exemption for pedagogy-topic notes (the "Key takeaways" exemption applied 2026-05-23) is the documented exception — when the toolkit doesn't yet support the case, a documented local relaxation is acceptable; otherwise upstream.

## Going-forward round-closeout discipline

Each substantial round of work ends with a wrap-up at `docs/plans/done/<date>_<round-name>_wrap_up.md` BEFORE moving to the next round. Format (mirroring `~/guides/docs/plans/done/`):

- **Date completed**
- **Plan reference** (pointer to the relevant section in `~/.claude/plans/this-repo-is-supposed-buzzing-eclipse.md`)
- **What completed** (acceptance gates met)
- **Friction + surprises** (what surprised; what mitigations applied)
- **Open follow-ups** (what's deferred + why)
- **Handoff hook** (next round's entry point)

Backfills for the 5 already-shipped rounds live under `docs/plans/done/` as of 2026-05-24.

## AI authorship disclosure

This repo is co-authored with Claude (Anthropic) via Claude Code. See `AUTHORS.md` for the full division of labor + AI tooling scope + human-in-the-loop disciplines. PRs that touch chapter content preserve the disclosure; PRs that touch tooling don't need a separate disclosure since the MIT-licensed scripts are content-neutral.

## License

- Content (chapter MDX, figures, design docs, research notes, prose): CC BY 4.0 — see `LICENSE`
- Scripts / source code (Astro config, GitHub workflows, lint scripts, future `.claude/skills/`): MIT — see `LICENSE-SCRIPTS`

The split removes ambiguity for downstream consumers: a developer copying an Astro config snippet doesn't need to attribute, whereas someone redistributing a chapter does.
