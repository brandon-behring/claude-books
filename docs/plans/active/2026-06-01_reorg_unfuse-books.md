# Reorg: un-fuse the books, collapse to one trunk

**Date:** 2026-06-01 · **Canonical plan:** `~/.claude/plans/this-repo-has-gotten-humble-origami.md`
(this is the in-repo record per the Large-Task Protocol; the canonical plan carries full detail).

## Why

`claude-books` had two drifts: (1) `architect-reference` fused a **cert-aligned** identity with an
**agentic-systems-design** deep-dive (the env+context volume); (2) a 4-worktree stack with a bare
`main` outlived its trigger once the books integrated. Goal: five clearly-scoped books on a single
trunk, the design content as its own book ready for a one-day extraction.

## Decisions made (5 clarifying rounds with the user)

1. "Agentic coding" = the design volume (env+context, 11 ch).
2. Scope & rename now, **split later** — keep it in the monorepo; document the one-day split.
3. Promote the superset → `main`; archive the two subsumed snapshot branches as tags.
4. Keep **cert alignment** first-class — a clean cert-aligned book is wanted.
5. **Two sibling books**: cert-aligned `architect-reference` (D1–D5) + `agentic-systems-design`
   (env+context). The cert book XRefs into the design book; never the reverse.

**Alternatives rejected:** physical split now (premature — book unwritten, no trigger); full
directory rename of `architect-reference` (dilutes the cert signal, ripples through configs); one
book with the agentic content as a Part (the user wanted two distinct scopes).

## What was done

- **Phase A** — 4 `backup/*` tags (reversibility net).
- **Phase B** — merge `architect-reference-v0 → main` (`.gitignore` union; REPO-MAP + continuity
  bundle preserved; normal fast-forward push, no force).
- **Phase C** — `git mv architect-reference agentic-systems-design` + identity edits; fresh cert
  `architect-reference/` skeleton with a D1–D5 `OUTLINE.md`. Both build (17 / 6 pages, validate clean).
- **Phase D** — `docs/BOOK-MAP.md`, `agentic-systems-design/SPLIT.md`; reconciled README / CLAUDE.md /
  root package.json / cert-coverage.md / REPO-MAP.md; loose-file triage.
- **Phase E** — retire `part-i-v1.0-prose` + `research-program-v0` → `archive/*` tags.
- **Phase F** — push to origin (gated on explicit approval).

## Out of scope (deferred)

Physical repo extraction; cert-book chapter authoring; `taxonomy.graph.json` `book_targets`
retarget; field-guide port; glossary. **No force-push to `main`.**
