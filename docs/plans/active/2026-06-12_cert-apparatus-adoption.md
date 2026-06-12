# Sprint 1 — Cert study-apparatus adoption (scaffold 4.18 → 4.23)

> **Status:** active (planned 2026-06-12, not started). Horizon-1 Sprint 1 in
> [`../../ROADMAP.md`](../../ROADMAP.md). Sprint 2 (question-bank expansion) is sequenced *after*
> this so every new question lands in the final rendering pipeline.

## Goal

Make the cert book **apparatus-complete**: bump `@brandon_m_behring/book-scaffold-astro` to
`^4.23.0` across all three workspaces and wire the full study-guide layer (shipped upstream
2026-06-10, epic #122 closed) into `architect-reference/`.

**What ships in the bump** (upstream release log, verified 2026-06-12):

| Release | Contents | Cert-book use |
|---|---|---|
| v4.19.0 | `<Diagnostic>` (#110) + `<PartReview>` (#111) + `<Glossary>` (#115) + TS-types fix (#133/#134) | DIKTA sections, Part reviews, key terms |
| v4.20.0 | triage: validate los-anchor binding (#130), landing shadow warning (#129), multi-guide recipe (#132) | validate behavior may change — regression-check |
| v4.21.0 | scored **ExamRunner** island (#112-UI) + `<AssessmentTest>` (#113) + `/answers` appendix (#114) | interactive practice exam, front-matter assessment, rationale appendix |
| v4.22.0 | flashcards deck: `/flashcards` route + island (#116) | spaced-recall surface |
| v4.23.0 | sidebar brand reads `defineBookConfig` title + subtitle (#135) | cosmetic — check sidebar after bump |

## Steps

0. **API recon (read-only, after the bump installs).** Read the *installed* package docs —
   `node_modules/@brandon_m_behring/book-scaffold-astro/` `PACKAGE_DESIGN.md` + the 4.19–4.23
   release notes — for the exact props/route keys of Diagnostic, PartReview, ExamRunner,
   AssessmentTest, answers, Glossary, Flashcards. **Do not guess APIs**; the schemas in
   `src/schemas.ts` + `pages/*.astro` of the installed package are the ground truth.
1. **Bump.** `^4.23.0` in `architect-reference/package.json`, `handbook/package.json`,
   `agentic-systems-design/package.json`; root `npm install`; build **all three** books as the
   regression gate (v4.20 triage + v4.23 sidebar may shift validate output/visuals — capture diffs,
   don't auto-accept).
2. **Wire (cert book only).**
   - `architect-reference/astro.config.mjs`: enable the new routes (answers / flashcards /
     glossary / assessment — per the actual route-key API found in step 0).
   - Swap the 30 hand-faked `## Do I know this already?` sections → `<Diagnostic>` across
     `src/content/chapters/d*-*.mdx`. The questions/rubrics already exist in prose — this is a
     **wrap, not a rewrite**. Pattern the conversion once on `d1-01-agentic-loops.mdx`, verify build
     + render, then loop the remaining 29.
   - Add `<AssessmentTest>` (front matter / landing) + `<PartReview>` surfaces where the API wants
     them; keep `<ObjectiveMap>` as is.
   - Fold repo issue **#10**: `BOOK_PROFILE=tools` in `architect-reference/.env` (chrome-island
     parity; schemas identical per the 2026-06-01 finding).
3. **Verify.** `npm run build:labels && npm run validate && npm run build` +
   `node scripts/cert-audit.mjs` (**13 checks** — 12 staleness + 13 correctness-currency included);
   manual render check: `/practice-exam` scored mode, `/answers`, `/flashcards`, one converted
   chapter's `<Diagnostic>`. Note: the "converted" signal convention changes — DIKTA = a real
   `<Diagnostic>` import now, not the `## Do I know this already?` heading.
4. **Record.** Flip the adoption status in `docs/scaffold-gaps.md`; close repo issue #10 + the
   Sprint-1 tracked issue; commit per the repo git pattern (feat(architect-reference) + a chore(deps)
   commit, or one combined — judgment at commit time); update project memory.

## Decisions made (for posthoc analysis)

- **Adoption-first, bank-second** (user, 2026-06-12): authoring questions into the static spine and
  re-rendering later was rejected — adoption first means Sprint 2 authors into the final pipeline.
- **Bump all three workspaces, not just cert** (consistent with the 2026-06-12 all-workspace build
  validation choice): one scaffold version across the monorepo; consumer-triage fixes benefit all.
- **#10 folded in** rather than standalone: one-line `.env` change touching the same book/config.
- **Deployment explicitly out of scope**: upstream **#140** (base-unaware absolute links) is the
  deployment gate; do not deploy under a non-root base path until it ships.

## Risks / assumptions

- **TS-types fix (4.19)**: if any consumer code worked around broken 4.18 type exports, remove the
  workaround rather than layering on it.
- **v4.20 validate changes** (los-anchor binding) may newly WARN/error on existing content — triage
  as real findings, not noise, before suppressing.
- The 30-file Diagnostic swap is the bulk of the work; if the component's question schema differs
  from the prose DIKTA format, the "wrap, not rewrite" assumption breaks → re-scope before looping.
- Workspace hoisting bit `/tips` injection once before (route imports at fixed `node_modules`
  depth); smoke-test each newly enabled route in-workspace before assuming it works.

## Done =

All three books build green on 4.23; cert-audit 13/13; `/practice-exam` (scored), `/answers`,
`/flashcards` render; 30/30 chapters use `<Diagnostic>`; #10 + Sprint-1 issue closed; scaffold-gaps
adoption status current.
