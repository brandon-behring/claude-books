# Authors

## Primary author

**Brandon Behring** — final responsibility for content, claims, structure, design decisions, and review.

## AI collaboration

Co-authored with **Claude** (Anthropic, via Claude Code).

**Tooling scope** — Claude is used for:

- Research dispatch + per-source-note authoring (the `docs/research/` cache)
- Chapter prose drafting from human-led outlines + PEDAGOGY conventions
- PoC artifact authoring (the `handbook/src/content/poc/` artifacts)
- TikZ figure authoring + iteration (the `handbook/figures/*.tex` sources)
- Schema design + Zod extension (when content collections evolve)
- Structural review + revision (cross-chapter consistency, lint-rule application)
- Citation lookup + verification (against the per-source markdown cache)
- Scaffold-component adoption + scaffold-gap surfacing
- Wrap-up doc authoring + friction-log capture
- Pre-PR self-review

**Out of scope for AI tooling**:

- **No autonomous chapter-prose merges before human review.** Every chapter v1.0 prose draft goes through human review before merge to `main`.
- **No autonomous PEDAGOGY decision-log status changes from OPEN to DECIDED.** Status promotion requires human approval; Claude can propose, not commit.
- **No autonomous scaffold-issue filings without showing the user the issue body first.** (Six scaffold issues #56-#61 were filed autonomously during the 2026-05-23 pedagogy round; this is the codification of going-forward discipline, not a retroactive rebuke.)
- **No autonomous changes to design docs at `docs/design/`** without explicit user direction. The design archaeology is human-curated.
- **No final acceptance of any factual claim.** Human reviews every chapter against the cited primary sources before promotion to `validated` status.

This project follows the AI-collaboration disclosure norms set by ACM 2023, Nature 2023, and COPE 2023. AI tooling is not listed as an author of the work; the human author takes final responsibility for what ships.

## Per-section authorship plan (when chapters land)

Per the project's pedagogical-transparency commitments (PEDAGOGY decision-log row 11: "Source attribution + freshness"), each chapter's frontmatter will declare:

- `volatility` (stable-principle / architectural-pattern / feature-surface / fast-moving)
- `last_updated: YYYY-MM-DD`
- `introduced_in_version: <semver>`
- `cert_domains: [int subset of 1..5]`

Future scaffold-component work (Phase 0.7+) may add inline `<AICollaborationDisclosure>` per chapter (parallels guides-experimentation's pattern). Until then, the workspace-level disclosure here is canonical.

## Contributing

PRs welcome for factual corrections, clarity improvements, and convention updates. See `CONTRIBUTING.md` for routing + scope.
