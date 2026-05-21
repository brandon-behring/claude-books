# claude-books

Astro port of two Claude Code book projects, both built on [`@brandon_m_behring/book-scaffold-astro`](https://github.com/brandon-behring/book-scaffold-astro).

## Workspace members

| Member | Source LaTeX | Profile | Status |
|---|---|---|---|
| [`handbook/`](./handbook/) | [`claude-best-practices`](https://github.com/brandon-behring/claude-best-practices) (LaTeX, v2.9 sunset) | `tools` | Bootstrapping (Phase 0) |
| `field-guide/` (Phase 2) | [`claude-code-field-guide`](https://github.com/brandon-behring/claude-code-field-guide) | `research-portfolio` | Not yet started |

## Why

The two source books are paired by design — the handbook says *what to do*; the field-guide shows the empirical evidence for *why* (audit of 67 Claude Code repos). Both deserve to live on the modern Astro stack alongside the rest of the Claude-related Astro work (`book-template-astro`, `post-transformers/guides/web/`).

## Workflow

This repo is also dogfooding for `book-scaffold-astro`. Gaps surfaced while porting are logged in [`docs/scaffold-gaps.md`](./docs/scaffold-gaps.md) and batched as upstream issues / PRs at phase boundaries. See [`.github/ISSUE_TEMPLATE/scaffold-gap.md`](./.github/ISSUE_TEMPLATE/scaffold-gap.md).

## Develop

```bash
npm install                    # at repo root
cd handbook && npm run dev     # localhost:4321
```

## License

Content: [CC BY 4.0](./LICENSE) (matching the LaTeX originals).
Scaffold package itself: MIT, consumed via npm.
