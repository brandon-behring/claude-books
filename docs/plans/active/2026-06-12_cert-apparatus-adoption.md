# Sprint 1 — Cert study-apparatus adoption (scaffold 4.18 → 4.23)

> **Status:** active (planned 2026-06-12; **refined same day after API recon** — see Decisions).
> Horizon-1 Sprint 1 in [`../../ROADMAP.md`](../../ROADMAP.md). Sprint 2 (question-bank expansion)
> is sequenced *after* this so every new question lands in the final rendering pipeline.

## Goal

Make the cert book **apparatus-complete** (minus the glossary-gated surfaces — deferred, see
Decisions): bump `@brandon_m_behring/book-scaffold-astro` to `^4.23.0` across all three workspaces
and wire the study-guide layer (shipped upstream 2026-06-10, epic #122 closed) into
`architect-reference/`.

**What ships in the bump** (upstream release log, verified 2026-06-12):

| Release | Contents | Cert-book use |
|---|---|---|
| v4.19.0 | `<Diagnostic>` (#110) + `<PartReview>` (#111) + `<Glossary>` (#115) + TS-types fix (#133/#134) | DIKTA sections, Part reviews; glossary **deferred** |
| v4.20.0 | triage: validate los-anchor binding (#130), landing shadow warning (#129), multi-guide recipe (#132) | shadow warning WILL fire (we own `index.astro`) → `routes: { landing: false }` |
| v4.21.0 | scored **ExamRunner** island (#112-UI) + `<AssessmentTest>` (#113) + `/answers` appendix (#114) | scored practice exam (automatic — route already on), `/assessment` page, rationale appendix |
| v4.22.0 | flashcards deck: `/flashcards` route + island (#116) | **deferred** — deck derives from the `glossary` collection, not questions |
| v4.23.0 | sidebar brand reads `defineBookConfig` title + subtitle (#135) | set/check title+subtitle in all three books |

## API recon — DONE 2026-06-12 (read from the `v4.23.0` tag + installed 4.18 bin)

- **`<Diagnostic>` is slot-based**: props `title?` / `skimTo?` (default "Exam essentials") /
  `routing?`; default slot = the numbered question list; optional `slot="answers"` collapsible key
  (presence-gated). The 30 hand-faked DIKTA sections wrap cleanly — **the schema-mismatch risk in
  the original plan is retired**.
- **`/flashcards` builds its deck from the `glossary` collection, NOT the questions bank**
  (question-derived cards = a later upstream increment). No `src/content/glossary/` exists here →
  flashcards + `/glossary` require authoring key terms (real content work).
- **Scored ExamRunner is automatic**: the package's own `/practice-exam` page mounts it; our route
  is already enabled and all 10 bank questions are `mcq` + `<Rationale>` → scoreable on bump day.
- **`/answers`** = `routes: { answers: true }`; pairs with `<Rationale appendix for="<id>">` (link
  everywhere except `/answers`); `validate` enforces `for=` ↔ frontmatter-id match and fails loud
  if `appendix` is used while the route is off.
- **`<AssessmentTest>`** is consumer-placed; validates `passMark`/`count` at build; weak-domain
  readout links string-slug chapters and cross-links the bank when `practiceExam` is on.
- **`<PartReview part={N}>`** reads the `build-exercises` index (`src/data/exercises.json`) + the
  chapters' `part` field. All 30 chapters use `<Exercise>` and `part: 1–5` — but the book has **no
  `build:exercises` script** and no index yet. CLI subcommand `build-exercises` confirmed in the
  installed 4.18 bin.

## Steps

1. **Bump.** `^4.23.0` in `architect-reference/package.json`, `handbook/package.json`,
   `agentic-systems-design/package.json`; root `npm install`; build **all three** books as the
   regression gate (v4.20 triage + v4.23 sidebar may shift validate output/visuals — capture diffs,
   don't auto-accept).
2. **Wire (cert book only).**
   - `astro.config.mjs`: `routes: { practiceExam: true, answers: true, landing: false }`.
   - `.env`: `BOOK_PROFILE=tools` — folds repo issue **#10** (chrome-island parity; schemas
     identical per the 2026-06-01 finding).
   - `package.json`: add `build:exercises` (`book-scaffold build-exercises`), wire into the
     predev/prebuild chains.
   - New `src/pages/assessment.astro` mounting `<AssessmentTest>`; link it from the landing page.
   - `<PartReview part={N}>` at the end of each Part's final chapter (×5 — no part-divider pages
     exist; Cisco convention).
   - Swap the 30 hand-faked `## Do I know this already?` sections → `<Diagnostic>` across
     `src/content/chapters/d*-*.mdx`: wrap the question list (default slot), **author a 5-line
     `<Fragment slot="answers">` key condensed from that chapter's own prose** (condensation, not
     new authoring), drop the hand-written routing sentence (the component renders its own), keep
     the pre-testing `<MarginNote>` adjacent. Pattern once on `d1-01-agentic-loops.mdx`, verify
     build + render, then loop the remaining 29.
   - Convert the 10 existing questions' `<Rationale>` → `<Rationale appendix for="<id>">` (Sybex
     style; keeps the bank page clean; validate has teeth for the `for=` match).
3. **Verify.** `npm run build:labels && npm run validate && npm run build` +
   `node scripts/cert-audit.mjs` (**13 checks**); all three books build; render checks:
   `/practice-exam` scored flow, `/answers` pre-expanded, `/assessment` weak-domain readout, one
   converted chapter's `<Diagnostic>` answer reveal, one `<PartReview>`. Smoke-test each newly
   enabled route in-workspace (the tips.astro hoisting precedent). Note: the "converted" signal
   convention changes — DIKTA = a real `<Diagnostic>` import now, not the
   `## Do I know this already?` heading.
4. **Record.** Flip the adoption status in `docs/scaffold-gaps.md`; close repo issue #10 + the
   Sprint-1 tracked issue (#12); commit per the repo git pattern (chore(deps) bump +
   feat(architect-reference) wiring, or combined — judgment at commit time); update project memory.

## Decisions made (for posthoc analysis)

- **Adoption-first, bank-second** (user, 2026-06-12): authoring questions into the static spine and
  re-rendering later was rejected — adoption first means Sprint 2 authors into the final pipeline.
- **Glossary + flashcards OUT of Sprint 1** (user, 2026-06-12 refinement): both gate on authoring
  `src/content/glossary/` key terms. Deferred to the Horizon-2 shared-glossary item so per-book
  term shape is designed once, not retrofitted. Sprint 1 stays zero-new-content wiring (S–M).
- **Diagnostic answer keys IN, same loop pass** (user, 2026-06-12 refinement): the component's
  optional `answers` slot gets a condensed key per chapter — one pass over 30 files instead of two;
  matches the self-contained study-guide genre (Pearson DIKTA ships keys).
- **`<AssessmentTest>` on a dedicated `/assessment` page** (user, 2026-06-12 refinement): Sybex
  front-matter convention; keeps the landing (which already carries `<ObjectiveMap>`) lean.
- **Bump all three workspaces, not just cert** (consistent with the 2026-06-12 all-workspace build
  validation choice): one scaffold version across the monorepo; consumer-triage fixes benefit all.
- **#10 folded in** rather than standalone: one-line `.env` change touching the same book/config.
- **Deployment explicitly out of scope** — tracked separately (#14); subdomain hosting keeps root
  base, so upstream #140 no longer gates it.

## Risks / assumptions

- ~~Diagnostic schema may differ from the prose DIKTA format~~ — **retired by recon**: slot-based,
  wraps cleanly.
- **TS-types fix (4.19)**: if any consumer code worked around broken 4.18 type exports, remove the
  workaround rather than layering on it.
- **v4.20 validate changes** (los-anchor binding) may newly WARN/error on existing content — triage
  as real findings, not noise, before suppressing. The landing shadow warning is expected and
  handled by `routes: { landing: false }`.
- Answer-key condensation is judgment work ×30 — keep each key to one line per question, sourced
  from that chapter's prose only (no new claims; the cert-audit citation checks still apply).
- Workspace hoisting bit `/tips` injection once before (route imports at fixed `node_modules`
  depth); smoke-test each newly enabled route in-workspace before assuming it works.

## Done =

All three books build green on 4.23; cert-audit 13/13; `/practice-exam` (scored), `/answers`,
`/assessment` render; 30/30 chapters use `<Diagnostic>` **with answer keys**; `<PartReview>` ×5;
Rationale-appendix style adopted; #10 + #12 closed; glossary/flashcards explicitly deferred to the
Horizon-2 glossary item; scaffold-gaps adoption status current.
