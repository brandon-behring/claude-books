# Design Vol 3 — Evaluation & Operations (ch21–28) — sprint record

**Date:** 2026-06-14 · **Status:** ✅ DONE (committed; push pending user word) · **Issue:** #16
**This completes Design v1.0 (Vols 1–3).**

## What shipped

**Volume 3 — Evaluation & Operations, all 8 chapters (ch21–28)** — the *"you cannot operate what
you cannot measure"* lens, arc **measure → see → spend → oversee → defend**. Full Vol-1-parity
apparatus + one TikZ figure each. Gate: `design-audit` 0 FAIL (28 ch, 161 manifest ids), full build
green (34 pages).

| Ch | Title | Backing | Figure |
|----|-------|---------|--------|
| ch21 | Measuring & Operating Agents *(spine)* | cross-dossier (authored) | the five-surface arc |
| ch22 | Evaluating a Prompt: The Four-Step Loop | `prompt_evaluation` | the four-step loop |
| ch23 | Evaluating an Agent: Harnesses, Suites & the Judge | `eval_harnesses` | eval/harness discipline |
| ch24 | Observability: Seeing What the Agent Did | `ops_observability` | four surfaces over one log |
| ch25 | Cost: The Economics of Running Agents | `ops_cost` | the four cost levers |
| ch26 | Human-in-the-Loop: Keeping a Human in Control | `ops_hitl` | gate placements on the model |
| ch27 | Security: The Adversarial-Input Layer *(honesty-critical)* | `ops_security` | the lethal trifecta |
| ch28 | Operating the Whole: Eval + Ops as One Loop *(capstone)* | authored synthesis | the operate-improve loop |

## Decisions made (the 7, with the why)

From the question-driven planning (5 surfaced via the one-at-a-time flow):
1. **Scope: all 8 (ch21–28), one sprint** — completes Vol 3 + Design v1.0 cleanly; the recipe was proven.
2. **Mechanism: ch21 pilot → Workflow fan-out (ch22–26) → hand-finish ch27 + ch28** — at n=8 the
   fan-out parallelism pays (unlike the n=3 orchestration half); ch27 (honesty-critical) + ch28
   (capstone synthesis) are hand-required.
3. **Review: per-chapter grounded reviewer on every chapter + external `/adversarial-review` on every
   chapter** (the thorough option) — per-chapter *scoped* external runs given the codex >300s timeout.
4. **Figures: one per chapter (8)** — full Vol-2 parity.
5. **ch27 spine: trifecta-as-spine** — Willison threat model → incidents as one shape → convergence →
   residual-risk → supply-chain.
6. **ch25 numbers: qualitative + ratios, NO per-MTok dollars** — the honest home for ch19's deferred ~15×.
7. **ch28 scope: Vol-3 capstone (mirror ch11/ch20) + a short Design-v1.0 coda.**

## Honesty disciplines (the load-bearing ones) — held

- **Volume-wide rule:** five of six dossiers are single-vendor / first-party by construction → **no
  `<Tag kind="convergence">` in ch21–26**; **ch27 is the lone genuine convergence** (design-by-
  construction). ch21 states this inverse-honesty premise up front.
- **ch27 (honesty-critical):** the lethal trifecta is **Willison's practitioner coinage** (attributed,
  never laundered to official); design-by-construction is the **one** convergence tag (citing CaMeL +
  Beurer-Kellner + SecAlign); ASR **23.6%→11.2%** is T1 **self-reported**, framed reduce-**not**-
  eliminate; the **EchoLeak CVSS score is omitted** (unsettled NIST 7.5 vs MS 9.3); the **"~12–20%
  malicious skills" folk figure is explicitly disowned**; LaTeX-only efficacy numbers (CaMeL 77/84,
  DataFlip 0/91) not asserted — only the plain-ASCII WASP "up to 86% / security by incompetence" and
  Hackett "up to 100% … in some instances," qualified verbatim.
- **ch23:** the Zheng ">80% judge agreement" is a **bare `<Citation>`** (academic, not laundered
  official); eval-first is **not** tagged convergence (first-party, not triangulated).
- **ch24:** OTel GenAI conventions carry a "Status: Development / recheck-after-2026-08-25" caveat;
  the `/cost`→`/usage` rename + traces-beta/metrics-GA split noted; OTel specs bare-cited.
- **ch25:** qualitative tier ladder + ratios, **no dollar figures**; the ~4×/~15× and "80% variance"
  attributed as Anthropic's own-workload measurements, not universal constants.
- **ch26:** the unverified "3-consecutive / 20-total denials" folk mechanism omitted; approval-fatigue
  framed as an open trade-off; calibration presented as sparse + imperfect.
- **ch28 (capstone):** integrative, **zero `<Tag>`** (does not even import Tag); evidence-map uses bare
  `<Citation>`; flagged as the book's framing.

## Mechanism + review outcomes

- **ch21 pilot** hand-authored + gated solo (set the chapter-form pattern), then a **Workflow
  author→review pipeline** fanned out **ch22–26** (5 dossier-grounded authors → 5 in-pipeline
  adversarial reviewers; all FIX-THEN-SHIP with the only CRITICAL/HIGH being the expected
  not-yet-merged manifest ids). Manifest entries returned by the authors and **merged centrally**
  (26 unique new ids; `claude-code-github-actions` deduped across ch24/ch26). ch27 + ch28
  hand-authored last.
- **Per-chapter standalone adversarial review** of the 3 hand-authored chapters: **ch27 SHIP**
  (0 HIGH/CRITICAL, all 8 honesty disciplines verified PASS against the dossier); ch21 FIX-THEN-SHIP
  (one real: an unearned `effective-context-engineering` citation on the book's own tag-taxonomy claim
  — removed + dropped from frontmatter); ch28 SHIP (one real: a dead `WorkedExample` import — removed).
- **External `/adversarial-review` on all 8** (chapters-only, privacy-safe), scoped per-chapter via
  worktrees so codex finished. **codex earned the pass — 8 real refinements folded:** ch27 (the
  Convergence box said "first-party" of academic primaries → fixed to "independent / academic
  primaries"; SecAlign overstated as "cut a leg" → reframed model-hardening as construction-not-leg-
  cutting); ch22 (step 2 said "small" suite → prompt-evals favor automatable *volume*, the ch23 seam);
  ch23 (resampling measures the judge's *consistency*, not accuracy — added the distinction); ch25
  ("output irrelevant" scoped to context-heavy agent loops; Batch "all four at once" scoped to async/
  batchable, not live turns); ch26 (the "may not be stopping" caveat re-attributed to *one* post not
  both; "never proceed unattended" scoped to exclude a deliberate bypass-permissions override); ch28
  ("adds no new sources" → "no new evidence"). **All gemini findings were false positives** (the
  standing `Caveat`-label misread of the stale CLAUDE.md base list — `Caveat` *is* in the binding
  linter's `APPROVED_LABELS`; "use `<XRef>`" and "use `<Sidenote>`" both contradict this book's
  standalone, `<Citation>`-based genre) and **codex's worktree-isolation artifacts** ("ch21–26 don't
  exist") were trivially refuted against the real 34-page build.

## Lessons / notes

- **The worktree-base recipe scales the codex-timeout workaround.** Seed a throwaway worktree at
  `origin/main` with the current manifest + all figures **committed** as the base, then copy in one (or
  two) chapters and run `adversarial-review --uncommitted` → each payload is just that chapter's diff
  (~180 lines), citations + figures resolve, and **codex finishes**. Run several worktrees in parallel
  (background) to cut wall-clock. The orchestration-half "scope to one chapter" lesson, generalized.
- **The external pass was worth running on all 8, not just ch27.** The decorrelated codex voice found
  6 real refinements in the fan-out + capstone chapters that 5 grounded in-pipeline reviewers + 3
  standalone reviewers + the deterministic gate all missed (volume-vs-small, judge variance≠accuracy,
  Batch-not-for-live-sessions, bypass-permissions exception, one-post-not-both attribution).
- **Academic primaries map to `T3-practitioner`** in the 4-value manifest enum (the known #17
  tier-drift; the enum has no academic tier) — this is reader-invisible (the inline `<Tag>`/bare-
  `<Citation>` carries the real honesty signal), so codex's "mis-tiers" note on the metadata is not a
  reader-facing defect.
- **Framework-doc tag convention held** (Inspect/AISI tagged `official`-relative-to-vendor, matching
  ch13's LangGraph convention) — codex flagged it as a gray area (#17), declined for consistency.
- Figure caption/alt checked against each `.tex`; `git checkout` the part-map/window-regions re-theme
  churn before staging.

## Remaining (Design)

**Design v1.0 content is complete (Vols 1–3, 28 ch, 34 pages).** Next: handbook Parts II–IV port
(step 0 = clone `brandon-behring/claude-best-practices`), deployment (#14, Cloudflare), `<Term>`
retrofit (#15), Vol-1 Round-2 polish (#17), then the problem-first applied volume (v2.0).
