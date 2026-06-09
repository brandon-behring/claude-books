# claude-books — project roadmap

> Canonical forward plan + current state. **What each companion owns:** [`BOOK-MAP.md`](./BOOK-MAP.md)
> = the book model & scopes · [`REPO-MAP.md`](./REPO-MAP.md) = git topology · [`cert-coverage.md`](./cert-coverage.md)
> = cert-book status (authority) · [`scaffold-gaps.md`](./scaffold-gaps.md) = scaffold epics ·
> [`research-program/`](./research-program/) = the strict-live dossiers. Last updated 2026-06-08.

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
| Cert | 30 ch (done) + **factual-accuracy audit (done 2026-06-08)** + **depth (Round-2, 2026-06-02)** + study apparatus | spine **WIRED 2026-06-09** — `questions` collection + `/practice-exam` + `<ObjectiveMap>` live, **seeded 10-q bank** (2/domain); remaining = **expand the bank** toward per-chapter coverage + the heavier components #110/#111/#113/#115/#116 (open upstream) |
| Design | Vols 1–3 (Vol 1 polished + Vols 2–3 authored from existing dossiers); applied vol = v2.0 | authoring (XRef gate #96 shipped v4.16) |
| Glossary | infra + initial shared term set (harvest dossier `agent_index/` glossaries) + deep-links | scaffold #115 glossary (still open) |

## Next (provisional — sequenced on a real trigger)
- **Finish drafted:** Cert apparatus — spine **wired** (2026-06-09); next is **expanding the question bank** toward per-chapter coverage (a `/loop` over chapters fits), then the heavier components (#110/#111/#113/#115/#116). Design Vol 1 polish.
- **Extend:** Design Vol 2 (Tools & Orchestration) + Vol 3 (Evaluation & Operations) from the dossiers;
  Handbook Parts II–IV port.
- **Infra:** stand up the Glossary deep-link layer; figures pipeline; dossier freshness re-verify.

## Known debt (tracked, with triggers)
- **Cert apparatus — spine wired (2026-06-09); bank + heavy components remain.** The scaffold v4.17
  spine (#112/#114/#117) is now **consumed** in the cert book: `examDomains` + the `questions` collection
  + the static `/practice-exam` route + `<ObjectiveMap>` (landing page) build green **in-workspace** (no
  hoisting bug, unlike `tips.astro`), with a seeded **10-question bank** (2/domain, chapter-grounded).
  *Remaining:* (a) **expand the bank** toward per-chapter coverage (cert-book authoring — a `/loop` over
  chapters fits); (b) the heavier components **#110/#111/#113/#115/#116** + the fuller **#112/#114**, still
  open upstream (epic **#122**; the `feat/tier3-inc1-questions-spine` branch is a dead pre-squash
  leftover) — scaffold-repo work ending in a release.
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
- **Hub+sibling repo split considered and declined (2026-06-08):** single-repo workspace is final; per-book extraction stays available on a real trigger (see each book's `SPLIT.md`).
- **Meta-doc model de-duplicated (2026-06-08):** `docs/BOOK-MAP.md` is the single full statement of the book model; other meta-docs carry a one-line identity + a pointer, not a restatement (drift-proofing).
