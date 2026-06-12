# claude-books — project roadmap

> Canonical forward plan + current state. **What each companion owns:** [`BOOK-MAP.md`](./BOOK-MAP.md)
> = the book model & scopes · [`REPO-MAP.md`](./REPO-MAP.md) = git topology · [`cert-coverage.md`](./cert-coverage.md)
> = cert-book status (authority) · [`scaffold-gaps.md`](./scaffold-gaps.md) = scaffold epics ·
> [`research-program/`](./research-program/) = the strict-live dossiers. Last updated 2026-06-12.

## The series (model + status)

**Public = 3 books + a shared glossary layer** (single content-bearing trunk `main`):

| Book | Lens | Identity | Status |
|---|---|---|---|
| `handbook/` | Use | Claude Code, daily practice (not API / claude.ai) | Part I shipped (4/15 ch prose); ch05–15 port pending |
| `architect-reference/` | Cert | Self-contained CCA-F D1–D5 study guide | 30 ch authored, Round-2 study-guide COMPLETE (2026-06-02) |
| `agentic-systems-design/` | Design | The broad book — **multi-volume** (see below) | Vol 1 drafted (11 ch); Vols 2–3 + applied pending |
| `glossary/` | Vocabulary | Shared deep-link term layer — **infrastructure, not a book** | not started |

**Agentic Systems Design — the volumes** (foundation-first):
Vol 1 **Environment & Context** *(drafted)* → Vol 2 **Tools & Orchestration** → Vol 3 **Evaluation &
Operations** → **+ a problem-first applied volume** (re-traverses the material through real problems;
reviews + breadcrumbs back to Vols 1–3). **Design v1.0 = Vols 1–3**; the applied volume is v2.0.

**Repositioned:** the old **Field-Guide** (Observe) leaves the public lineup — its "what teams did"
mission becomes Design's problem-first applied volume. A **private self-audit** of your own work stays
a tentative personal artifact, outside the public series.

Research backbone: 23 strict-live dossiers (external `~/Claude/`), all D1–D5, Waves 1–7 done — they
back the Design volumes (Vol 2 ← tool / MCP / sub-agent / multi-agent / build-vs-buy dossiers; Vol 3 ←
eval + ops dossiers). Scaffold: consumes `book-scaffold-astro ^4.18.0`.

### Conventions
- **Duplication is fine** — the Cert guide especially must stand fully alone.
- **Every explanation is complete where it sits** — never "see the other book for the real version."
- **Cross-refs are bidirectional breadcrumbs** — so updating a topic surfaces every place it's covered.

## Shipped
- **Research program complete** — 23 strict-live dossiers, Waves 1–7, all D1–D5 (2026-05-27).
- **Books un-fused → single trunk** — `architect-reference` split into Cert + Design (2026-06-01).
- **Cert book** — 30 ch + Round-2 self-contained study-guide conversion (2026-06-02).
- **Design Vol 1** — Environment & Context first full draft, 11 ch (2026-05-30).
- **Handbook Part I** — ch01–04 prose (2026-05-25).
- **Model re-architecture + doc-set reconcile** — 5 books → 3 + glossary; this roadmap (2026-06-08).
- **Deferred-debt batch** — research-lint green (matcher fix) + scaffold → 4.18 (#96 cross-book XRef) + cert-coverage Design column (2026-06-08).
- **Cert factual-accuracy audit + freshness pipeline** — 13 ch re-verified vs live docs (Opus 4.7→4.8 cutover + count/citation drift); a curriculum→live-dossier freshness loop: cert-audit **Check 12** (staleness) + **Check 13** (correctness-currency) + a factored-CoVe gate + `last_reviewed` marker (2026-06-08).
- **Cert study-apparatus spine wired** — consumed the scaffold v4.17 spine: `examDomains` + the `questions` collection + the static `/practice-exam` route + `<ObjectiveMap>` (landing page), seeded 10-question bank (2/domain, chapter-grounded); build green in-workspace (2026-06-09).

## v1.0 targets (what "done" means; ordering provisional)

| Book | v1.0 = | Gated on |
|---|---|---|
| Handbook | all 15 ch ported from LaTeX (Parts I–IV); labels/XRefs resolve | authoring time |
| Cert | 30 ch (done) + **factual-accuracy audit (done 2026-06-08)** + **depth (Round-2, 2026-06-02)** + study apparatus | spine **WIRED 2026-06-09**; **upstream epic #122 COMPLETE 2026-06-10** (every heavier component shipped, v4.19–v4.22) — remaining is *in-repo*: **Sprint 1 apparatus adoption** + **Sprint 2 bank expansion** (see Next) |
| Design | Vols 1–3 (Vol 1 polished + Vols 2–3 authored from existing dossiers); applied vol = v2.0 | authoring (XRef gate #96 shipped v4.16) |
| Glossary | infra + initial shared term set (harvest dossier `agent_index/` glossaries) + deep-links | **gate LIFTED** — scaffold #115 `<Glossary>` shipped (v4.19/v4.22); remaining = authoring |

## Next — two horizons (adopted 2026-06-12)

### Horizon 1 — committed (the cert track)
- **Sprint 1 — apparatus adoption.** Bump scaffold `^4.18` → `^4.23` and wire the **full study-guide
  layer** into the cert book: `<Diagnostic>` (replaces the 30 hand-faked "Do I know this already?"
  sections), `<PartReview>`, the scored **ExamRunner** on `/practice-exam`, `<AssessmentTest>`, the
  `/answers` rationale appendix, `<Glossary>`, flashcards. Upstream epic **#122 closed 2026-06-10**
  (v4.19 apparatus + TS-types fix · v4.20 triage · v4.21 interactive layer · v4.22 flashcards · v4.23
  sidebar brand). Folds repo issue **#10** (`BOOK_PROFILE=tools`). Execution plan:
  [`plans/active/2026-06-12_cert-apparatus-adoption.md`](./plans/active/2026-06-12_cert-apparatus-adoption.md).
- **Sprint 2 — question-bank expansion.** Grow the 10-q seed toward per-chapter coverage (a `/loop`
  over chapters fits; item-writing rules locked in `architect-reference/OUTLINE.md`). Sequenced
  *after* Sprint 1 so every question lands in the final rendering pipeline.
- **Riding along:** the cert tail — 27 advisory over-cap MarginNotes; `last_verified` cadence on the
  feature-surface chapters (Checks 12/13 are the tripwire).

### Horizon 2 — recommended order (trigger-revisable, not binding)
1. **Handbook Parts II–IV port** (ch05–15 + 3 appendices) — *trigger: authoring time.*
2. **Design Vol 1 polish.**
3. **Design Vols 2–3** (Tools & Orchestration; Evaluation & Operations) from the dossiers.
4. **Glossary infra** — *gate lifted* (scaffold #115 shipped); harvest `agent_index/` glossaries.
5. **Applied volume** (Design v2.0).

### Ops lane (each on its own trigger)
- Revive the weekly **cert-tracking agent** (dormant; diff log stops at the 2026-05-22 baseline) —
  *trigger unchanged: the manual cadence becomes a chore.*
- **Freshness-loop heartbeat** re-run — *per model release or quarterly* (recipe in
  [`design/2026-06-08_curriculum-live-dossier-loop.md`](./design/2026-06-08_curriculum-live-dossier-loop.md) §3).
- Upstream **#83** — roll the v4.8.0 provenance backfill out to the consumer books (P3).
- Upstream **#140** (base-unaware absolute links) = **the deployment gate** — do not deploy any book
  under a non-root base path until it ships.
- **BookLink / cross-book XRef adoption** — *gate: design-book deploy* (#96 shipped v4.16).

## Known debt (tracked, with triggers)
- **Cert apparatus — upstream DONE, adoption remains.** The v4.17 static spine is consumed (spine
  wired 2026-06-09: `examDomains` + `questions` collection + `/practice-exam` + `<ObjectiveMap>`,
  10-q seed, builds green in-workspace). **Upstream epic #122 closed 2026-06-10** — #110/#111/#112-UI/
  #113/#114/#115/#116 all shipped across v4.19–v4.22 (verified via `gh issue view` + release log,
  2026-06-12). What remains is **in-repo adoption** (Horizon-1 Sprint 1) + **bank expansion**
  (Sprint 2). Lockfile still pins **4.18.0** until the Sprint-1 bump.
- **`research-program/content-map.md` topic→book map predates multi-volume Design** — rows still map
  to the old book set. *Trigger:* when authoring a Design volume needs the precise atom→section map.

## Authority map (who owns which truth — prevents re-drift)
- **ROADMAP** = forward plan + current snapshot + decisions log.
- **BOOK-MAP** = the book model, scopes, lenses, XRef convention.
- **REPO-MAP** = git topology + where things live.
- **cert-coverage** = cert-book status (authority) + the D1–D5 task matrix.
- **scaffold-gaps** = scaffold epic / issue status.
- **research-program/** = the strict-live dossiers + their topic graph.

## Decisions log
- Single content-bearing trunk (`main`); feature branches retired to `archive/*` tags (2026-06-01).
- Un-fused 2026-06-01: Cert (`architect-reference`) + Design (`agentic-systems-design`) are siblings.
- **Re-architected 2026-06-08: public = 3 books + glossary layer** (down from 5). Field-Guide leaves
  the public lineup (→ Design's problem-first applied volume; private self-audit personal).
- **Design is the broad book, multi-volume** (Env&Context → Tools&Orchestration → Eval&Ops + applied);
  **Design v1.0 = Vols 1–3.**
- **Glossary = shared infrastructure**, not a read-through book.
- **XRef convention:** duplication OK (Cert stands alone); complete-in-place explanations;
  bidirectional breadcrumbs. (Refines the old "Design points outward only" rule.)
- Cert book genre = self-contained study guide (Round-2, 2026-06-02).
- Research program complete (Waves 1–7); dossiers external, bridge via `docs/research-program/`.
- Forward arc: per-book v1.0 criteria defined; **ordering left provisional** (2026-06-08).
- **Two-horizon sequencing adopted (2026-06-12):** Horizon 1 = committed cert track (apparatus
  adoption → bank expansion); Horizon 2 = recommended-but-revisable book order with explicit
  triggers + an ops lane. Prompted by upstream epic #122 completing 2026-06-10.
- **Hub+sibling repo split considered and declined (2026-06-08):** single-repo workspace is final; per-book extraction stays available on a real trigger (see each book's `SPLIT.md`).
- **Meta-doc model de-duplicated (2026-06-08):** `docs/BOOK-MAP.md` is the single full statement of the book model; other meta-docs carry a one-line identity + a pointer, not a restatement (drift-proofing).
