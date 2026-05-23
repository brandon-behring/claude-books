# claude-books

The Astro/MDX home for a three-volume **Claude practitioner reference**, plus a shared glossary. All four members consume [`@brandon_m_behring/book-scaffold-astro`](https://github.com/brandon-behring/book-scaffold-astro).

## Workspace members

| Member | Source | Profile | Status |
|---|---|---|---|
| [`handbook/`](./handbook/) | rewrite of [`claude-best-practices`](https://github.com/brandon-behring/claude-best-practices) (LaTeX, v2.9 sunset) | `tools` | Phase 0 done · outline next |
| `architect-reference/` *(planned)* | from scratch, cert-aligned | TBD | Phase 2 |
| `field-guide/` *(planned)* | rewrite of [`claude-code-field-guide`](https://github.com/brandon-behring/claude-code-field-guide) | `research-portfolio` | Phase 4 |
| `glossary/` *(planned)* | shared terminology, deep-linked by all books | n/a | Phase 0.7 |

## What this is

Three paired volumes, each from a different angle on Claude Code and the surrounding agent stack:

- **Handbook** — *how to use Claude effectively.* The practitioner's guide.
- **Architect's Reference** — *how to design Claude-powered systems.* Agent SDK, MCP, the Claude API, and production patterns. Aligned to (but deeper than) Anthropic's Claude Certified Architect — Foundations competency model.
- **Field-Guide** — *what teams actually did.* An empirical audit of 67 production Claude Code repos.

All three are **free, CC BY 4.0** living documents (semver per book, per-chapter `last_updated`, RSS, changelog, "Edit this page" → PR).

## Background

This repo replaces two LaTeX books (`claude-best-practices` v2.9 and `claude-code-field-guide`) and adds a third volume that emerged from analyzing the *Claude Certified Architect — Foundations* taxonomy. The LaTeX repos are drafts, not sources of truth — each is archived on GitHub when its successor ships v1.0.

The current project roadmap and phase plan lives in `~/.claude/plans/`. Scaffold gaps surfaced while authoring are logged in [`docs/scaffold-gaps.md`](./docs/scaffold-gaps.md) and filed as upstream issues. Cert/Academy changes are tracked weekly in [`docs/cert-tracking.md`](./docs/cert-tracking.md) via a scheduled agent.

## Develop

```bash
npm install                    # at repo root
cd handbook && npm run dev     # localhost:4321
```

(Other workspace members come online in later phases.)

## License

Content: [CC BY 4.0](./LICENSE).
Scaffold package itself: MIT, consumed via npm.
