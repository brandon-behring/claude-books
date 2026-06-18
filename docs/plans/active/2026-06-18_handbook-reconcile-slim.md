# Handbook reconcile + slim restructure (Promote + grandfather + wire)

**Date**: 2026-06-18
**Status**: active
**Type**: Large Task (collection rename + 34-file move + route rename + new component + chapter wiring + docs)
**Prior art**: `docs/audits/2026-06-18_handbook-source-audit.md` (the audit that triggered this).

## Context

The handbook is the series laggard — Part I (ch01–04) ported, on the current scaffold (`^4.25.0`),
Parts II–IV pending. The 2026-06-18 audit established the LaTeX source is quality-strong but
currency-stale, and the content model was revised (via `/exploring-options`) to **SLIM** — core
chapter + *earned* supplements (keeping #18 Tips / #19 exercises). That slim decision was never
recorded in code, and the `poc/` ("proof-of-concept") supplement collection — now permanent in fact —
still carried its experiment name and was **orphaned**: the shipped ch01–04 chapters linked to none
of their supplements, `/poc` wasn't in nav, and only `part1-summary.mdx` surfaced them.

This task: (1) record #7→slim durably + fix doc-drift; (2) **promote + grandfather + wire** — give the
supplement collection a permanent home, wire Part I in (so it's discoverable), and mark ch05–08 as
drafts. **No pruning** of per-chapter supplements.

## Decisions Made (via /exploring-options, 2026-06-18)

**Round 1 (forks):**
- Content model **#7 → SLIM**; **#18 Tips + #19 exercises KEPT**.
- Scope = **core + content reconciliation** (not docs-only; not the cap-drift branch).
- Shape = **promote + grandfather + wire, no pruning**.

**Round 2 (execution choices):**
- **Name**: `poc` → **`supplements`** (`/supplements/`); field `poc_kind` → **`kind`**; keep the unified
  single-collection + scaffold `<PocLayout>` pattern. *Rejected*: per-kind Diátaxis dirs (gratuitous
  churn against working routing).
- **Wiring**: convention-derived component `<ChapterSupplements chapter={N} />` querying the
  `supplements` collection by `chapter_source`, filtering `!draft`. *Rejected*: manual markdown links
  (rot-prone, is how they got orphaned) and frontmatter `supplements:` lists (duplicates `chapter_source`).
- **Part-summaries**: **keep but trim** — drop the now-redundant per-chapter supplement-link lists
  (the component owns that), keep the L-progression arc. part1 published / part2 draft. *Rejected*:
  drop entirely (= pruning, against the shape decision).
- **Draft posture**: ch05–08 + part2-summary = **build + noindex + segregate** (routes build, filtered
  from main listing + nav, shown under a labeled "Drafts" section + DRAFT marker). Matches deploy #14.

## Out of scope (explicit)
- Pruning per-chapter supplements.
- The 25-word-margin-cap doc-drift in PEDAGOGY (ll. 48/174/258) — the *other* scope branch, deferred.
- The actual Parts II–IV chapter port (separate future Large Task).

## Work (see the session plan file for full per-file detail)
0. This record. 1. Core reconcile docs. 2. Rename `poc`→`supplements`. 3. `ChapterSupplements`
component + wire ch01–04 + nav. 4. Part-summary trim + draft handling. 5. Build/validate/grep. 6. Memory.

## Verification
`cd handbook && npm run build && npm run validate` pass; `grep -rn "/poc/" handbook/src` → zero
route-links; `grep -rn "poc_kind\|getCollection('poc')" handbook/src` → zero; Part I chapters render
the Go-deeper block; `/supplements` in nav; ch05–08 segregated under the drafts label.
