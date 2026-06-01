# SPLIT.md — extracting Agentic Systems Design into its own repo

This book lives in the `claude-books` monorepo today, but it is **designed for a clean one-day
extraction** into a standalone repo whenever a real trigger appears (independent release cadence,
separate audience, or it simply outgrows the monorepo).

It is **not** extracted now — there is no benefit yet (the book is outlined/authored but the
series hasn't shipped, and it's fully decoupled either way). This file records exactly what makes
the extraction cheap, so the decoupling doesn't silently rot.

## Why it's a one-day move

- **0 cross-refs in.** No other book XRefs into this one. The cert-aligned `architect-reference`
  points *outward* to this book; nothing points back.
  Verify: `grep -rn "agentic-systems-design" ../handbook ../architect-reference`.
- **0 cross-refs out.** No `<XRef>`-to-handbook (`OUTLINE.md`: "Standalone (decided)"). The book
  assumes a model + harness and develops the environment + context layers around them.
  Verify: `grep -rn "<XRef" src/content/chapters/` → none.
- **Own scaffold wiring.** `package.json` (scaffold deps + scripts), `astro.config.mjs`,
  `src/content.config.ts`, `.env` (`BOOK_PROFILE=tools`) — all self-contained. The scaffold is an
  npm package; nothing is vendored.
- **Own title surface.** `src/pages/index.astro` hard-codes the title; not derived from the repo.

## What it would vendor on extraction

- The strict-live research dossiers it cites (`sources/manifest.yaml` ids map to):
  `harness_frame`, `repo_design`, `claudemd_discipline`, `env_skills`, `guardrails`,
  `cross_domain`, `context_rot`, `context_assembly`, `memory` — external projects under
  `~/Claude/research_agent_*/`, not committed here today.
- The env+context slice of `docs/research-program/` (the content-map rows backing these chapters).
- `docs/scaffold-gaps.md` (the `/tips` deferral its `astro.config.mjs` references).

## Extraction sketch

1. `git filter-repo --subdirectory-filter agentic-systems-design` (preserves history).
2. New repo: `npm install` (scaffold from npm) → `npm run dev` verifies.
3. Re-home the cited dossiers + research-program env/context slice into the new repo's `docs/`.
4. Replace this monorepo dir with a short stub pointer (or drop it from the root `workspaces`).

See [`../docs/BOOK-MAP.md`](../docs/BOOK-MAP.md) for how this book relates to the others.
