# claude-books — project roadmap

> Canonical forward plan + current state. **What each companion owns:** [`BOOK-MAP.md`](./BOOK-MAP.md)
> = the book model & scopes · [`REPO-MAP.md`](./REPO-MAP.md) = git topology · [`cert-coverage.md`](./cert-coverage.md)
> = cert-book status (authority) · [`scaffold-gaps.md`](./scaffold-gaps.md) = scaffold epics ·
> [`research-program/`](./research-program/) = the strict-live dossiers. Last updated 2026-06-17.

**▶ The series is LIVE.** One Cloudflare Worker serves `claude-books.brandon-behring.dev` — hub landing
+ `/architect/` · `/design/` · `/agentic-coding/`; the handbook is served-but-`noindex` until its v1.0.
Deployed 2026-06-16 (#18); auto-deploys on push to `main`.

**▶ Next action:** v1.0 polish + post-go-live cleanup → committed keep-current build → handbook port →
applied volume (see [Next](#next--re-set-2026-06-17)).

## The series (model + status)

**Public = 4 books + a shared glossary layer** (single content-bearing trunk `main`):

| Book | Lens | Identity | Status |
|---|---|---|---|
| `handbook/` | Use | Claude Code, daily practice (not API / claude.ai) | **Live (served-`noindex`)** — Part I = 4 ch prose; ch05–15 port pending |
| `agentic-coding/` | Use | Building software with AI coding agents — cross-tool (Claude Code · Gemini CLI · Codex CLI) | **Live** — 17 ch + 6 appendices; folded in via PR #18 |
| `architect-reference/` | Cert | Self-contained CCA-F D1–D5 study guide | **Live** — 30 ch, Round-2 study-guide COMPLETE (2026-06-02); apparatus + 75-q bank wired |
| `agentic-systems-design/` | Design | The broad book — **multi-volume** (see below) | **Live** — Vols 1–3 drafted, **Design v1.0 COMPLETE 2026-06-14** (28 ch / 34 pages); applied (v2.0) pending |
| `glossary/` | Vocabulary | Shared deep-link term layer — **infrastructure, not a book** | v1 shipped 2026-06-13 — 70-term bank + sync infra; cert consumer live |

**Agentic Systems Design — the volumes** (foundation-first):
Vol 1 **Environment & Context** → Vol 2 **Tools & Orchestration** → Vol 3 **Evaluation & Operations**
→ **+ a problem-first applied volume** (re-traverses the material through real problems; reviews +
breadcrumbs back to Vols 1–3). **Design v1.0 = Vols 1–3**; the applied volume is v2.0.

**Repositioned:** the old **Field-Guide** (Observe) leaves the public lineup — its "what teams did"
mission becomes Design's problem-first applied volume. A **private self-audit** of your own work stays
a tentative personal artifact, outside the public series.

Research backbone: 23 strict-live dossiers (external `~/Claude/`), all D1–D5, Waves 1–7 done — they back
the Design volumes (Vol 2 ← tool / MCP / sub-agent / multi-agent / build-vs-buy dossiers; Vol 3 ← eval +
ops dossiers). A cross-cutting `youtube_talks` source pool feeds many topics on-cite. Scaffold: consumes
`book-scaffold-astro ^4.25.0`.

### Conventions
- **Duplication is fine** — the Cert guide especially must stand fully alone.
- **Every explanation is complete where it sits** — never "see the other book for the real version."
- **Cross-refs are bidirectional breadcrumbs** — so updating a topic surfaces every place it's covered.

## Shipped
- **Books live** — one Cloudflare Worker (apex + subroutes, combined-dist), 2026-06-16 (#18): hub +
  `/architect//design//agentic-coding/` (+ handbook served-`noindex`); the **Agentic Coding** book folded
  in (book-template v3→v4); `CLOUDFLARE_*` secrets set, repo **public**, `deploy.yml` auto-deploys on
  `main`. Mechanism + DNS: [`deploy-cloudflare.md`](./deploy-cloudflare.md).
- **YouTube-talks source pool + guide-impact + source watch-map** (2026-06-17) — external `youtube_talks`
  dossier (134 talks; **105 indexed / 26 pending / 3 no-speech** after the Whisper-fill; `synthesis.md`
  = 12 trend claims; **tri-engine audited**). In-repo: [`youtube-talks-guide-impact.md`](./research-program/youtube-talks-guide-impact.md)
  (12 claims → chapter impact) + [`source-registry.md`](./research-program/source-registry.md) (watch-map, **decisions D8**).
- **Cert track complete (in-repo)** — 30 ch + Round-2 self-contained study-guide (2026-06-02) + factual-accuracy
  audit + freshness pipeline (Checks 12/13 + factored-CoVe + `last_reviewed`, 2026-06-08) + apparatus adoption
  (`<Diagnostic>`×30 / `<PartReview>` / scored ExamRunner / `/answers`) + **75-q bank** (≥2/ch, Check 14) (2026-06-12).
- **Design v1.0 content complete** — Vols 1–3 authored, 28 ch / 34 pages (2026-06-14); Vol 1 first draft 2026-05-30.
- **Glossary v1** — canonical `glossary/terms/` (70 terms) + sync infra; cert `/glossary` + `/flashcards` live (2026-06-13).
- **Handbook Part I** — ch01–04 prose (2026-05-25).
- **Model re-architecture** — 5 books → 3 + glossary; books un-fused → single trunk; this roadmap (2026-06-01/08).
- **Deferred-debt batch** — research-lint green + scaffold→4.18 (#96) + cert-coverage Design column (2026-06-08).
- **Research program complete** — 23 strict-live dossiers, Waves 1–7, all D1–D5 (2026-05-27).

(Full sprint records in [`plans/done/`](./plans/done/).)

## v1.0 targets (what "done" means)

Deployment is **done** — every book is published at its public URL. A book reaches **v1.0** when its
content is complete and its **draft banner + `noindex` come off**.

| Book | v1.0 = | Gated on |
|---|---|---|
| Handbook | all 15 ch (Parts I–IV); labels/XRefs resolve; banner+`noindex` off | the ch05–15 port; **step 0 = clone `brandon-behring/claude-best-practices`** (sources not local) |
| Agentic Coding | content (17 ch + 6 app, done) + the ch00-promised version-branch infra; banner off | **live/published (v0.2.0)**; content-complete, convergence dashboard live (2026-06-17 honesty pass); **v1.0 gated on version-branches — deferred (Stage 3), no live trigger yet** |
| Cert | 30 ch + audit + depth + study apparatus (all done) | **in-repo complete + live**; v1.0 = drop draft banner |
| Design | Vols 1–3 (done) + Vol-1 Round-2 polish; live | **content COMPLETE 2026-06-14**; v1.0 = Vol-1 polish (#17) + drop banner; applied vol = v2.0 |
| Glossary | infra + initial term set + deep-links (done) | **v1 SHIPPED 2026-06-13**; remaining: inline `<Term>` retrofit + wiring handbook/Design consumers |

## Next — re-set 2026-06-17

> Sizing: **S/M/L + estimated sessions**, no calendar dates (solo, variable availability). Calibration:
> the 30-ch `/loop` study-guide conversion ≈ 1 day; handbook Part I (4 ch) ≈ 1–2 sessions.

The 2026-06-12 two-horizon plan is **largely shipped** (cert track, glossary, Design Vols 2–3 — all in
Shipped; records in [`plans/done/`](./plans/done/)). Now that the books are live, the committed order is:

1. **v1.0 polish + post-go-live cleanup** *(S–M)* — Vol-1 Round-2 polish (#17); the `<Term>` glossary
   retrofit across chapters (infra + script ready); enable the dormant **edit-this-page links + per-chapter
   Discussions** (unblocked by repo-public); confirm per-book draft-banner/`noindex` flips. *(Agentic Coding
   had its review + honesty pass 2026-06-17 — content-complete + dashboard live; version-branches deferred to Stage 3.)*
2. **Keep-current program (committed build)** — see [Keep-current](#keep-current-committed--whats-watched--cadence--automation).
3. **Handbook Parts II–IV port** *(M–L, ~4–6 sessions)* — ch05–15 + 3 appendices to the proven Part-I
   template, then flip `noindex`→v1.0. **Step 0 (blocking): `git clone brandon-behring/claude-best-practices`**
   — the LaTeX sources are NOT on this machine.
4. **Applied volume (Design v2.0)** *(L)* — the problem-first re-traversal (absorbs the retired
   Field-Guide's "what teams did" mission); reviews + breadcrumbs back to Vols 1–3.

## Keep-current (committed) — what's watched · cadence · automation

The books are live and public, so keeping them current is a **first-class, committed workstream** (item 2
above) — consolidating freshness work that was scattered across the old ops/debt lanes. Owner = solo.

| Watch | Source | Cadence | State |
|---|---|---|---|
| Cert / CCA-F ecosystem | [`cert-tracking.md`](./cert-tracking.md) | weekly | **dormant** (diff log stops at the 2026-05-22 baseline) → revive |
| Anthropic feeds · code · samples · channels | [`source-registry.md`](./research-program/source-registry.md) (D8 `[feed]`s) | per registry cadence | watch-map shipped; automation pending |
| 23 strict-live dossiers | `bib_ledger` `stale_after` radar | per model release / quarterly | heartbeat recipe in [`design/…curriculum-live-dossier-loop.md`](./design/2026-06-08_curriculum-live-dossier-loop.md) §3 |
| `youtube_talks` pool | external dossier | freshness pass | re-check the 26 caption-pending; **re-run `synthesis.md`** to fold in the 2 Whisper-filled talks |

**Committed build:**
- **Revive the weekly cert-tracking agent** on a real schedule (scheduled remote agent diffing the
  cert/course surfaces) — the manual cadence had become a chore.
- **Change-digest** — a recurring *what's new · what changed · new samples · book-impact* digest sourced
  from the `source-registry` feeds (monthly / per-release).
- **Scheduled freshness/automation agent** — wire the `source-registry` `[feed]`s + the freshness
  heartbeat (re-verify the dossiers; sweep the `youtube_talks` pool), and apply the
  [`youtube-talks-guide-impact.md`](./research-program/youtube-talks-guide-impact.md) staleness items
  (D5.6 model-name table; effort-dial / MCP-ladder framing refreshes) as it runs.

## Deployment (shipped 2026-06-16) — how it works
One Worker serves the whole apex. `scripts/assemble-hub.mjs` (run by the root `build`) builds each book
into `dist/<subroute>/`; `wrangler.jsonc` serves `./dist`; `.github/workflows/deploy.yml` (reusable
`deploy-workflows@v1`, `secrets: inherit`) auto-deploys on push to `main`. Each book sets
`base: '/<subroute>/'` + `site:` in `astro.config.mjs` (scaffold **^4.25** — base-aware links via
#140/#141). The **Agentic Coding** book (cross-tool "Use") was folded in from `book-template-astro`
(v3→v4). Handbook ships served-but-`noindex` (`dist/robots.txt` → `Disallow: /handbook/`) and omitted
from the hub until its v1.0. Runbook + DNS binding: [`deploy-cloudflare.md`](./deploy-cloudflare.md).
- **Remaining gated item:** per-book v1.0 flips (draft banner off, `noindex` off) — currently the handbook.

## Ops lane (each on its own trigger)
- **Figures pipeline** — TikZ→SVG via the scaffold's `build-figures` (shipped v4.2); *trigger:* the first
  chapter needing a new diagram — expected during the handbook port.
- Upstream **#83** — roll the v4.8.0 provenance backfill out to the consumer books (P3).

*(Freshness — cert-tracking revival, dossier heartbeat, source-registry feeds — moved to
[Keep-current](#keep-current-committed--whats-watched--cadence--automation). Upstream #140/#141 shipped in scaffold v4.25.)*

## Known debt (tracked, with triggers)
- **`research-program/content-map.md` predates multi-volume Design** — rows still map to the old book
  set. *Trigger:* when authoring a Design volume needs the precise atom→section map.
- **YouTube-talks → guide impact** — the 12 trend claims mapped to current chapters; prioritized report
  [`youtube-talks-guide-impact.md`](./research-program/youtube-talks-guide-impact.md) (tri-engine audited
  2026-06-17, **0 surviving P1**). The **chapter fixes are not yet applied** — re-tier the D5.6 model-name
  table to a freshness-UPDATE; the effort-dial (cert D2.3 + Design ch16) + primitives→custom→MCP-ladder
  (cert D2.4 + Design ch15) framing refreshes (also citation wins); new-primitive gaps route to
  already-planned authoring (handbook port, applied vol, `<Term>` retrofit). *Trigger:* staleness items
  ride the freshness heartbeat (Keep-current); gaps land as each owning chapter is next edited.
  Honest-tiering: ch26 (auto-mode) + ch10 (memory) stay **directional notes**, not corrections.

## Authority map (who owns which truth — prevents re-drift)
- **ROADMAP** = forward plan + current snapshot + decisions log.
- **BOOK-MAP** = the book model, scopes, lenses, XRef convention.
- **REPO-MAP** = git topology + where things live.
- **cert-coverage** = cert-book status (authority) + the D1–D5 task matrix.
- **scaffold-gaps** = scaffold epic / issue status.
- **research-program/** = the strict-live dossiers + their topic graph; **`source-registry.md` = the
  freshness watch-map** (what's watched + cadence; decisions D8).

## Decisions log
- **Books live 2026-06-16** — Cloudflare Workers apex+subroutes (one Worker, combined-dist); the
  **Agentic Coding** book folded in (4th book); repo made **public**. **Supersedes** the 2026-06-12/16
  "deployment pending + user-side go-live gate" framing.
- **Forward sequence re-set 2026-06-17** — polish/go-live cleanup → keep-current (committed) → handbook →
  applied; re-prioritizes keeping the now-live books current ahead of the next authoring push.
  **Keep-current promoted to a committed workstream.**
- Single content-bearing trunk (`main`); feature branches retired to `archive/*` tags (2026-06-01).
- Un-fused 2026-06-01: Cert (`architect-reference`) + Design (`agentic-systems-design`) are siblings.
- Re-architected 2026-06-08: public = 3 books + glossary (down from 5); Field-Guide → Design's applied
  volume. **Agentic Coding added as a 4th book via PR #18 (2026-06-16).**
- **Design is the broad book, multi-volume** (Env&Context → Tools&Orchestration → Eval&Ops + applied); **Design v1.0 = Vols 1–3.**
- **Glossary = shared infrastructure**, not a read-through book.
- **XRef convention:** duplication OK (Cert stands alone); complete-in-place explanations; bidirectional breadcrumbs.
- Cert book genre = self-contained study guide (Round-2, 2026-06-02).
- Research program complete (Waves 1–7); dossiers external, bridged via `docs/research-program/`.
- Two-horizon sequencing adopted 2026-06-12 — now largely shipped; **superseded by the 2026-06-17 re-set** above.
- Hub+sibling repo split considered and **declined** (2026-06-08): single-repo workspace is final (per-book `SPLIT.md` on a real trigger).
- Meta-doc model **de-duplicated** (2026-06-08): `docs/BOOK-MAP.md` is the single full statement of the book model; other meta-docs carry a one-line identity + pointer.
