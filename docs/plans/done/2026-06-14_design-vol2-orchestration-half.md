# Design Vol 2 — Orchestration half (ch18–20) — sprint record

**Date:** 2026-06-14 · **Status:** ✅ DONE (committed; push pending user word) · **Issue:** #16 (Vol 2 completion)

## What shipped

The **Orchestration half of Volume 2** of the Design book — **3 chapters, ch18–20** — completing
**Vol 2 (ch12–20)**. Hand-authored (not fanned out), full Vol-1-parity apparatus + a TikZ figure each.

| Ch | Title | Backing | Figure |
|----|-------|---------|--------|
| ch18 | Sub-Agents: The Context-Isolation Primitive | `sub_agents` | isolation contract |
| ch19 | Multi-Agent: Coordinating Many *(honesty-critical)* | `multi_agent` | topology→coordinator→verifier→cost chain |
| ch20 | Composing Tools & Orchestration *(capstone)* | authored synthesis (ch12–19) | composed decision workflow |

**Commit** (on `main`, not yet pushed): `a48cef6` (the 3 chapters + 3 figures + 11 manifest entries),
then a records commit. Gate: `design-audit` 0 FAIL (20 ch, 117 manifest ids), full build green (26 pages).

## Decisions made (the 7, with the why)

From the question-driven planning (3 first-round + 4 via `/exploring-options`):
1. **Hand-author all 3** — at n=3 with two hand-required chapters (ch20 synthesis, ch19 honesty-critical),
   a Workflow fan-out's parallelism doesn't pay; only ch18 was fan-out-able. Anti-over-engineering.
2. **Author the ch20 capstone this sprint** — closes Vol 2 as one system; mirrors Vol 1's ch11.
3. **Per-chapter adversarial reviewer** (3, grounded) + the deterministic gate.
4. **ch19 disagreement presentation** = a dedicated two-voice subsection, framed as a **current open
   issue**, an **objective date-stamped comparison** (Anthropic 2025-06-13 vs Cognition 2025-06 +
   2026-04-22), no winner crowned. *(The user enriched the "dedicated subsection" option with the
   open-issue + objective-comparison + date-clarity asks.)*
5. **All three chapters get a TikZ figure** (isolation contract / decision chain / composed workflow).
6. **ch20 mirrors ch11** + the composed-workflow figure (integrative; no new evidence).
7. **External `/adversarial-review` baked in** (chapters-only, privacy-safe) before push.

## Honesty disciplines (ch19, the load-bearing ones) — held

- The **~15×** token figure is quoted verbatim ("multi-agent systems use about 15× more tokens than
  chats"; ~4× single-agent) and explicitly **not generalized** (a single first-party datapoint).
- The **Anthropic↔Cognition disagreement is preserved unflattened**: a dated, objective two-voice
  comparison framed as a live open question; Cognition (Walden Yan) is T3-practitioner, phrased
  "Cognition argues," in the worth-it section only, never load-bearing; both converge on the
  parallelizability test and disagree on the window width; no winner crowned.
- **One** convergence tag (syn_03, decompose→delegate→aggregate by two independent first-party posts).
- ch18's **isolation-not-capability** + **Planner/Generator/Evaluator** rendered as the book's
  imported framing (not verbatim Anthropic); quantified cost deferred to Vol 3.
- ch20 marked integrative — no `<Tag kind="official">` on the book's own synthesis.

## Review outcomes

- **Per-chapter adversarial reviewers (3, dossier-grounded):** all FIX-THEN-SHIP; folded — ch18 two
  citation-form fixes (restore "Each subagent"; un-fragment a verbatim clause); ch19 LangGraph
  supervisor/swarm `practitioner`→`official` (T2 vendor docs, matching ch13's convention — which
  cleanly reserves `practitioner` for Cognition) + lead the synthesis InsightBox with its
  "book's reading" disclaimer; ch20 strip two `<Tag kind="official">` from evidence-map *synthesis*
  sentences (keep citations, per ch11) + distinguish ch14's three-separate-vendors convergence from
  ch19's two-Anthropic-posts.
- **External `/adversarial-review` (chapters-only, baked in):** gemini `ok` with **0 findings**
  (clean); **codex `timeout` (>300s)** — no signal (large payload), surfaced not treated as clean;
  my blind pass = 2 low items, both grounded as non-issues (figure caption/alt all match their
  `.tex`; ch19 table cells are characterizations with the cited verbatim claims in the prose). No
  tool-verified findings from that pass.
- **ch19-scoped codex re-pass:** since codex timed out on the combined payload, ran a second
  `/adversarial-review` isolated to **ch19 alone** (a throwaway `git worktree` at `origin/main` with
  only ch19 present, so the payload was ~198 lines — small enough to finish). codex completed `ok`
  and caught **one real apparatus gap the per-chapter reviewer missed: `ch19-pr-1` had no
  `<Solution>`** (ch19-ex-1 + ch19-pr-2 did) — folded (added the worked solution). codex's other
  findings (missing manifest ids / figure SVG / ch18) were **worktree-isolation artifacts**
  (origin/main + ch19 only), tool-refuted against the real HEAD (design-audit 0 FAIL, build 26pp,
  ch18 committed). gemini's 2 "Caveat label" findings were the standing false positive (the binding
  linter's APPROVED_LABELS includes `Caveat`). **Lesson:** isolating one chapter in a worktree lets
  codex finish on a honesty-critical chapter, at the cost of cross-repo false positives that are
  trivially refuted against HEAD — a good trade for the one real catch.

## Lessons / notes

- **codex timeout on large chapter payloads.** Two big honesty-critical chapters + manifest + 3
  figures (~657-line payload) exceeded codex's 300s. gemini completed clean. If a future sprint wants
  the codex voice guaranteed on a honesty-critical chapter, scope the external pass to that one
  chapter so the payload is small enough to finish.
- **The framework-doc tag convention is `official`-relative-to-vendor** (ch13 set it; ch19 now
  matches). Keep `practitioner` for genuine third-party practitioner voices (Cognition).
- Figure caption/alt were checked against each `.tex` (the last-sprint inversion lesson) — clean.

## Remaining

**Vol 2 is complete (ch12–20).** Next = **Vol 3 (ch21–28: eval + ops)**, from the eval/ops dossiers,
one cluster per sprint. Then the handbook port, deployment (#14), `<Term>` retrofit (#15), Vol-1
Round-2 polish (#17).
