# The curriculum ⇄ live-dossier loop — design + roadmap (2026-06-08)

> **Status:** roadmap. The *minimal foundation* (below, §3) shipped with the 2026-06-08 cert
> factual-accuracy audit; the *automation* (§4) is deferred to real triggers, per the research
> program's meta-pattern (cheap discipline now, machinery on a trigger — `research-program/decisions.md`).

## 1. The idea
A **curriculum is itself a source.** A book's volatile claims (model IDs, API shapes, CLI flags, spec
versions) reveal *which subjects are high-churn and high-value* — and those are exactly the subjects
that warrant **live, continuously-maintained strict-live dossiers**. The dossiers are then the **single
source of truth** for those facts, serving **all** the work (every book + the composed KG). The loop:

```
   curriculum (cert / handbook / design)
        │  its volatile claims name the high-churn subjects
        ▼
   key subjects → LIVE strict-live dossiers   ◀── single source of truth
        │  (bib_ledger stale_after; atoms; CoVe)        for those facts
        ▼
   serve ALL work: every book + composed KG
        │  curricula refreshed FROM the dossiers
        └────────────────────────────────────────► curriculum stays current
```

This turns the research program from *"complete, fed the books once"* into *"living, maintained for the
subjects the curricula identify"* (`research-program/decisions.md` **D7**).

## 2. Why this shape (the inconsistency it avoids)
A freshness pipeline whose own tracking data is duplicated across files will drift — the exact failure
the 2026-06-08 doc-reconcile fixed with a single source (`BOOK-MAP`). So **no new authoritative store**:
- A *fact's* freshness lives in its backing **dossier `bib_ledger.yml`** (`stale_after_days`,
  `verified_at`) — or, for a fact cited straight from Anthropic docs with no dossier, the cert
  **manifest** entry.
- A *chapter's* freshness clock is its frontmatter **`last_verified` + `volatility`** — read by
  `cert-audit.mjs` **Check 12**. There is no parallel per-claim ledger; any claim view is *generated*.
- The **provenance tier is honest**: a live WebFetch re-confirm (`web-reconfirm`, e.g. the
  `mcp-rc-2026-07-28` source's `last_reconfirmed`) is labeled distinct from a strict-live SHA-cache
  capture.
- **Fresh ≠ correct.** `last_verified` + the deterministic linter prove *staleness* and *structure*,
  not *factual correctness*. The 2026-06-08 run shipped a fresh chapter (linter green) carrying a wrong
  MCP-RC status claim; only an independent skeptic caught it. The correctness gate is **factored
  chain-of-verification (CoVe)** — each verifier *blind to the edit*, given only `{claim + cited source
  URL}` (the toolkit's `/dossier-audit` Phase 3; the blindness is what prevents post-rationalization,
  Dhuliawala et al. 2309.11495). A *non*-factored verifier that reads the chapter first can rationalize
  it — this session's per-chapter fan-out did; only the decoupled diff-reviewer caught the error. So the
  gate must be **factored**, and is recorded by `last_reviewed` (§3), not the date bump.

## 3. The minimal foundation (shipped 2026-06-08)
1. **cert-audit Check 12** — WARNs when a chapter's `last_verified` outruns a volatility budget
   (`feature-surface` 45d · `architectural-pattern` 120d · `stable-principle` 180d). A latent tripwire;
   the freshness signal for the cert book.
2. **The curriculum registered as a tracked source** — `topic-backlog.yml` entries
   `model-lineup-flagship-cutover` (per-release model cutover) and `cert-volatile-surface-living` (the
   10 feature-surface chapters → their backing dossiers). The backlog *already* tracked most volatile
   subjects (prefill-deprecation, MCP-RC, OTel, pricing-recheck) with recheck triggers.
3. **The audit itself = run #1** — the 2026-06-08 factual-accuracy pass refreshed the volatile facts
   (Opus 4.7→4.8 + count/citation drift; see `docs/audits/2026-06-08_*`) and set the first deadlines.
4. **The correctness gate is machine-visible** — a `last_reviewed` chapter field + cert-audit **Check
   13** that WARNs when `last_verified` outruns it ("fresh but unreviewed for correctness"). Check 12 =
   *staleness*; Check 13 = *correctness-currency*. `last_reviewed` records a **factored-CoVe** pass.

**Re-run recipe (per model release or quarterly):** baseline `cert-audit.mjs` → fan out per
feature-surface chapter, verifying each volatile claim against its live cited source → model-version
grep sweep → refresh + bump `last_verified` → **a factored CoVe pass over the changed facts** —
decoupled skeptics each *blind to the edit*, given only `{claim + cited source URL}`, reusing the
toolkit's `/dossier-audit` Phase 3 (do **not** reinvent a vaguer "review") → *only then* bump
`last_reviewed` → re-run the linter (Check 13 flags any `last_verified` that outran `last_reviewed`).
This *is* the loop's heartbeat, runnable by hand or by an agent.

## 4. Deferred automation (on real triggers)
- **Scheduled freshness agent.** Revive the **dormant** weekly `/schedule` cert-tracking agent (its
  diff log stops at the 2026-05-22 baseline) to also run `/freshness-audit` on the backing dossiers +
  surface chapters past their Check-12 budget. *Trigger:* the manual re-run cadence becomes a chore.
- **Book-citation / atom-link validator** (the deferred research-program **D5**): once chapters cite
  dossier *atoms* (not just manifest sources), a validator that forwards superseded atoms + flags
  meaning-drift. *Trigger:* first atom-level book citation.
- **Cross-project KG feed + dashboard.** Surface "what's stale and why" across all books from the
  composed KG. *Trigger:* a second curriculum goes live.
- **Generalize to handbook + design curricula.** Same mechanism: their volatile claims → tracked
  subjects → live dossiers. *Trigger:* those books reach a volatile-surface state worth tracking.
- **CI hard-gate.** Promote Check 12 from WARN to a merge-gate on `feature-surface` chapters past
  budget. *Trigger:* a stale fact actually ships.

## 5. Open questions
- Volatility-budget tuning (is 45d right for `feature-surface`? Anthropic ships ~monthly).
- Where the "current facts" reference for a re-run lives (regenerated each run vs cached).
- Whether `Mythos Preview`-class research-preview models ever enter the cert book (currently: no).
