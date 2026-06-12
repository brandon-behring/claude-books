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

## v1.0 targets (what "done" means; ordering committed under Next)

Every book's v1.0 additionally means **published at its public URL** (deployment plan below: draft
banner + `noindex` come *off* at v1.0).

| Book | v1.0 = | Gated on |
|---|---|---|
| Handbook | all 15 ch ported from LaTeX (Parts I–IV); labels/XRefs resolve; published | authoring time; **step 0 = clone `brandon-behring/claude-best-practices`** (sources not local) |
| Cert | 30 ch (done) + **factual-accuracy audit (done 2026-06-08)** + **depth (Round-2, 2026-06-02)** + study apparatus; published | spine **WIRED 2026-06-09**; **upstream epic #122 COMPLETE 2026-06-10** (every heavier component shipped, v4.19–v4.22) — remaining is *in-repo*: **Sprint 1 apparatus adoption** + **Sprint 2 bank expansion** (see Next) |
| Design | Vols 1–3 (Vol 1 polished + Vols 2–3 authored from existing dossiers); published; applied vol = v2.0 | authoring (XRef gate #96 shipped v4.16) |
| Glossary | infra + initial shared term set (harvest dossier `agent_index/` glossaries) + deep-links; published | **gate LIFTED** — scaffold #115 `<Glossary>` shipped (v4.19/v4.22); remaining = authoring |

## Next — two horizons (adopted 2026-06-12)

> Sizing: **S/M/L + estimated sessions**, no calendar dates (solo, variable availability — dates
> drift into falsehood). Calibration: the 30-ch `/loop` study-guide conversion ≈ 1 day; handbook
> Part I (4 ch + supplements) ≈ 1–2 sessions.

### Horizon 1 — committed (the cert track)
- **Sprint 1 — apparatus adoption** — ✅ **DONE 2026-06-12** (1 session). Scaffold bumped `^4.18` →
  `^4.23` across all three workspaces; the cert book wired end-to-end: `<Diagnostic>` ×30 **with
  authored answer keys** (replacing the hand-faked DIKTA sections; cert-audit Check 9 now requires
  the component), `<PartReview>` ×5, scored **ExamRunner** on `/practice-exam`, `<AssessmentTest>`
  on `/assessment`, `/answers` rationale appendix, #10 folded (`BOOK_PROFILE=tools` via script
  prefixes). **Scope note:** `<Glossary>` + flashcards deferred to item 3 — the flashcards deck
  derives from the `glossary` collection, which is exactly that item's deliverable. Plan + recon
  record: [`plans/done/2026-06-12_cert-apparatus-adoption.md`](./plans/done/2026-06-12_cert-apparatus-adoption.md).
- **Sprint 2 — question-bank expansion** *(M, ~2–3 sessions)*. Grow the 10-q seed toward per-chapter
  coverage (a `/loop` over chapters fits; item-writing rules locked in
  `architect-reference/OUTLINE.md`). Sequenced *after* Sprint 1 so every question lands in the final
  rendering pipeline.
- **Riding along:** the cert tail — 27 advisory over-cap MarginNotes; `last_verified` cadence on the
  feature-surface chapters (Checks 12/13 are the tripwire).

### Horizon 2 — committed order (2026-06-12)
3. **Glossary infra** *(S, ~1–2 sessions)* — *gate lifted* (scaffold #115 `<Glossary>` shipped);
   harvest the 23 dossiers' `agent_index/` glossary sections into the shared term layer. Slotted
   first because it's small and **compounds with early deploys** (shared terms deep-linked across
   every public book). Also unlocks the cert book's `/glossary` + `/flashcards` routes — the
   flashcards deck derives from the `glossary` collection (deferred out of Sprint 1 for exactly
   this reason: design the term shape once, here).
4. **Handbook Parts II–IV port** *(M–L, ~4–6 sessions)* — ch05–15 + 3 appendices, to the proven
   Part-I template. **Step 0: `git clone` `brandon-behring/claude-best-practices`** (private; the
   LaTeX sources are NOT on this machine).
5. **Design Vol 1 polish** *(S–M)*, then **Vols 2–3** *(L — the largest open authoring)* from the
   dossiers (Vol 2 ← tool/MCP/sub-agent/multi-agent/build-vs-buy; Vol 3 ← eval + ops). Sequenced
   last *because* the freshness loop keeps the dossiers warm — waiting costs accuracy nothing.
6. **Applied volume** (Design v2.0).

### Deployment (decided 2026-06-12)
**Host = Cloudflare Pages** (the `brandon-behring.dev` DNS already lives on Cloudflare — one
dashboard, one-click subdomains later). One Pages project per book, deployed **early, from the
private repo**, with **`noindex` + a visible draft banner until each book's v1.0**.

- Stand-up tasks *(S, ~1 session + dashboard steps)*: create the per-book Pages projects (host-native
  build or CI artifact) → set per-book `site` in `astro.config.mjs` → fill the `siblingBooks`
  origin registry → **BookLink/cross-book XRef gate lifts** (#96 shipped v4.16).
- **Domain migration (soon):** `cert.` / `handbook.` / `design.brandon-behring.dev` **subdomains** —
  these keep every book at root base. *Path-style hosting under the apex is gated on upstream #140*
  (base-unaware absolute links); subdomains make #140 irrelevant.
- **Gated items:** (a) **repo-public** — a deliberate visibility flip + full-history secret/leak
  sweep; unlocks the dormant edit-this-page links + per-chapter Discussions; (b) **per-book v1.0
  flip** — noindex off, draft banner off, domain final.

### Ops lane (each on its own trigger)
- Revive the weekly **cert-tracking agent** (dormant; diff log stops at the 2026-05-22 baseline) —
  *trigger unchanged: the manual cadence becomes a chore.*
- **Freshness-loop heartbeat** re-run — *per model release or quarterly* (recipe in
  [`design/2026-06-08_curriculum-live-dossier-loop.md`](./design/2026-06-08_curriculum-live-dossier-loop.md) §3);
  the same heartbeat **re-verifies the 23 external dossiers** (`bib_ledger` `stale_after` radar),
  not just the cert chapters.
- **Figures pipeline** — TikZ→SVG via the scaffold's `build-figures` (shipped v4.2); *trigger: the
  first chapter needing a new diagram — expected during the handbook port.*
- Upstream **#83** — roll the v4.8.0 provenance backfill out to the consumer books (P3).
- Upstream **#140** (base-unaware absolute links) — only blocks *path-style* hosting; the subdomain
  deployment plan above makes it non-blocking. Watch for the fix anyway.

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
- **Horizon 2 hardened to a COMMITTED order (2026-06-12, refinement pass):** glossary → handbook →
  Design Vols 2–3 → applied. Rationale: glossary is S-sized post-#115 and compounds with early
  deploys; the handbook port is template-proven mechanical work one `git clone` from unblocked;
  the freshness loop keeps the Design dossiers warm, so sequencing them last costs no accuracy.
- **Deployment decided (2026-06-12):** Cloudflare Pages (DNS colocation with `brandon-behring.dev`),
  one project per book, drafts deployed early **from the private repo**, `noindex` + draft banner
  until each v1.0; domain target = `*.brandon-behring.dev` **subdomains** (root base — paths under
  the apex stay gated on upstream #140). **Repo-public is a separate gated decision** (deliberate
  flip + full-history sweep); until then edit-links/Discussions stay dormant.
- **Hub+sibling repo split considered and declined (2026-06-08):** single-repo workspace is final; per-book extraction stays available on a real trigger (see each book's `SPLIT.md`).
- **Meta-doc model de-duplicated (2026-06-08):** `docs/BOOK-MAP.md` is the single full statement of the book model; other meta-docs carry a one-line identity + a pointer, not a restatement (drift-proofing).
