# Design book — Vol 2–3 rich outline + Vol 1 deep polish + `design-audit.mjs`

> **Status (2026-06-13): COMPLETE.** Shipped in one session, 5 commits `2bfd1f4` (plan) →
> `0c5688a` (linter) → `8abd5f8` (outline) → `4cfccae` (Check-7 fix) → `2b2a874` (QA). Vol 2–3
> rich outline (ch12–27) in `OUTLINE.md`; `design-audit.mjs` green (0 FAIL) + wired; Vol 1 QA = 8
> fixes across 6 ch after an 11-reviewer fan-out. Build green. **NOT yet pushed — awaiting user.**

## Context

Agentic Systems Design is the series' **largest open authoring** (v1.0 = Vols 1–3). Vol 1
(Environment & Context, 11 ch) is prose-complete and builds; **Vols 2–3 are greenfield — no
chapter-level outline** (only high-level scope). The research is done: ~14 strict-live dossiers
(`research_agent_*`) back Vols 2–3, bridged via `docs/research-program/content-map.md`. This
sprint does the two things that unblock the big authoring without doing it: **(A)** lay the rich
Vol 2–3 chapter blueprint, **(B)** deep-polish Vol 1 (adversarial QA), **(C)** build a reusable
Design linter so the QA + all future volumes have a deterministic gate.

## Locked decisions (user, 2026-06-13)

1. **Next sprint = Design Vols** (over handbook port / deploy #14 / `<Term>` retrofit).
2. **Scope = outline Vols 2–3 + polish Vol 1** (bounded; authoring Vols 2–3 = future sprints).
3. **Outline depth = rich** (per chapter: title/scope/dossiers/sections/claims/evidence-tier) → extend `OUTLINE.md` + update `content-map.md`.
4. **Vol 1 polish = deep** (read-through + adversarial QA + fixes).
5. **QA = adversarial agent pass + build `design-audit.mjs`** (permanent linter, like `cert-audit.mjs`).

## Conventions (recon)

Volumes = `part:` field; chapters one collection, globally numbered (Vol 1 ch01–11, Vol 2 ch12+, Vol 3 after). Genre = reference-altitude hybrid (spine + per-topic pattern section); **standalone — NO `<XRef>` in/out** (clean extraction per `SPLIT.md`). Evidence-tiered: `<Tag kind="official|practitioner|convergence">` + `<Citation src>` → `sources/manifest.yaml`. Frontmatter (tools): title/part/chapter/volatility/tools_compared/cert_domains/introduced_in_version/last_updated/last_verified/sources/description (no `last_reviewed`).

## Workstream A — Vol 2–3 rich outline (proposed carving; ~8 ch/vol)

**Vol 2 — Tools & Orchestration** (`part: 2`, ch12–ch19; arc: capability-as-cost → tools → I/O → orchestration):
ch12 Spine (capability=context cost; unit=isolation) · ch13 Build vs Buy (`harness_buildvsbuy`) · ch14 Tool Minimization (`tool_minimization`; the one convergence chapter — 3 case studies) · ch15 MCP (`mcp_design`; feature-surface; 2026-07-28 RC) · ch16 Shaping I/O: prompting + structured output (`prompt_engineering`+`structured_output` merged) · ch17 Sub-Agents (`sub_agents`) · ch18 Multi-Agent (`multi_agent`; ~15× cost gate; preserve Anthropic↔Cognition) · ch19 *(optional)* capstone.

**Vol 3 — Evaluation & Operations** (`part: 3`, ch20–ch27; arc: measure → see → spend → oversee → defend):
ch20 Spine (+ honesty rule: 5/6 dossiers single-vendor NOT convergence; security is the one real convergence) · ch21 Evaluating a Prompt (`prompt_evaluation`; unit=prompt) · ch22 Evaluating an Agent (`eval_harnesses`; unit=trajectory; judge-as-instrument) · ch23 Observability (`ops_observability`; OTel GenAI) · ch24 Cost (`ops_cost`; tiers qualitative, no $/MTok) · ch25 HITL (`ops_hitl`; workflow-on-Vol1-guardrails-model) · ch26 Security (`ops_security`; tag convergence on design thesis; trifecta=practitioner) · ch27 *(optional)* capstone.

**Boundary discipline** (encode in outline): Vol 2/3 reference Vol 1 in prose, don't re-derive. ch25 HITL = workflow on Vol-1 guardrails' permission *model*; ch24 cost = economics of ch09's cache *mechanism*; ch22 owns judge *calibration*, ch21 only *uses* it; ch26 `authorized-but-forged` vs Vol-1 `authorized-but-risky`.

The full rich per-chapter entries (section sketches + load-bearing claims/atoms + evidence-tier notes) were drafted by the Phase-2 dossier-reading agents and get written into `OUTLINE.md`; dossier→chapter rows go into `content-map.md`. Numbers/titles are working drafts.

## Workstream C — `agentic-systems-design/scripts/design-audit.mjs` (build first; gates B)

Fork `cert-audit.mjs` structure. Lean checks: (1) frontmatter completeness+types, (2) volatility enum, (3) `<Citation src>` + frontmatter `sources:` resolve to manifest ids, (4) manifest dup ids, (5) **genre guard: no `<XRef>`** [new], (6) approved `<MarginNote label>` + `<Tag kind>` enum, (7) `<Tag>`/`<Citation>` co-location [WARN], (8) freshness vs volatility budget [WARN], (9) best-effort citation→dossier-backing, presence-gated [WARN, INFO-skip if dossiers absent]. Drop cert-only checks (last_reviewed/CoVe, bank, glossary, DIKTA, PDF-leak, examDomains, phantom-guard). Wire `validate:design` into prebuild; negative-test.

## Workstream B — Vol 1 deep adversarial QA

1. `design-audit.mjs` → fix all FAILs → exit 0.
2. 11 chapter reviewers (one/ch), each reads chapter + `sources` manifest entries + backing dossier `agent_index` (ch03→repo_design, ch04→claudemd_discipline, ch05→env_skills, ch06→guardrails, ch07→cross_domain, ch08→context_rot, ch09→context_assembly, ch10→memory, ch01/02→harness_frame). Axes: claim-support, evidence-honesty (tripwires: ch05 no-convergence, ch08 context-rot directional-not-%), cross-chapter consistency (5 spiral concepts), genre. Verdict/claim: pass/fix(+suggested_fix)/flag.
3. Consistency aggregator diffs the 11 reports for spiral-concept drift.
4. Apply fixes; route flags to user; re-run audit (exit 0); targeted re-review of edited chapters; bump dates.
> If QA surfaces heavy structural fixes → split remediation into its own follow-up sprint (file an issue, don't balloon this one).

## Sequencing + commits (git pattern; push only on user's word)
1. This plan doc — `docs(plans):`
2. `design-audit.mjs` (build first) — `feat(agentic-systems-design):`
3. Vol 2–3 rich outline → OUTLINE.md + content-map.md — `docs(design):` *(independent; can interleave)*
4. Vol 1 deep QA — `fix(agentic-systems-design):`
5. Records: ROADMAP item 5 progress; this doc → `done/`; memory; flags + Vols-2–3-authoring follow-up issue.

## Verification
`cd agentic-systems-design && npm run build` green (prebuild runs validate + validate:design); design-audit exits 0 + negative-tested; OUTLINE+content-map carry the blueprint; `grep -rn "<XRef" src/content/chapters` empty; Vol-1 fixes applied+re-verified, flags surfaced, dates bumped; git clean (no dossier content committed).

## Deferred (tracked)
Authoring Vols 2–3 (future sprints, now unblocked); optional capstones ch19/ch27 (decide post-draft); applied volume = v2.0; heavy Vol-1 remediation → own sprint if needed.

## Done =
OUTLINE.md + content-map.md carry a rich reviewable Vol 2–3 blueprint (~8 ch each, dossier-mapped, claim-level, tiered); `design-audit.mjs` green + negative-tested + wired into prebuild; Vol 1 passed 11-chapter adversarial QA (fixes applied, dates bumped, flags surfaced); build green; records reconciled.

---

## Decisions made (post-hoc log)

- **Carving** (2 Plan agents read the dossiers → synthesized into OUTLINE.md): Vol 2 = ch12–19 (8, incl optional capstone ch19), Vol 3 = ch20–27 (8, incl optional capstone ch27). Notable: ch16 **merges** prompt_engineering + structured_output (sibling Wave-7 dossiers; split later if too large); ch17/ch18 keep sub-agent vs multi-agent **distinct** (the primitive-vs-topology boundary is load-bearing); **ch14 + ch26 are the only convergence-tagged chapters**; harness_frame/env_skills stay Vol-1-owned (referenced, not re-derived).
- **`design-audit.mjs`**: 9 lean checks (cert-only checks dropped). Baseline 0 FAIL. **Check 7 refined mid-sprint** to count only `official`/`practitioner` tags — `convergence` is a multi-source SUMMARY tag (no 1:1 citation) and was false-positiving on every convergence line + a backticked mention; the refinement removed 3 false positives. Check 9 (dossier-backing) correctly WARNs on the 2 author-added non-dossier sources (lutke, anthropic-containment).
- **Vol-1 QA**: 11-reviewer fan-out (Opus general-purpose; no authoring this sprint, so no Fable question). 6 chapters clean/flag-only; **8 fixes applied** across ch01/02/06/08/09/10 — all quote-fidelity / attribution defects, reviewer-supplied verbatim corrections. Re-verify was **deterministic (validate + design-audit + build)** rather than a 2nd full fan-out — proportionate to surgical, source-grounded edits (anti-over-engineering).
- **Notable catches:** ch01/ch02 singularized "LLMs"→"LLM" *inside quotes*; ch06 "problematic"→"overeager" on the 83% figure (caught via live WebFetch); ch10 "reads its own notes and continues" was mis-attributed to ji-manus but is Anthropic's (effective-context-engineering); ch08 NoLiMa quote dropped its relative qualifier + quoted a dossier *gloss* as a source span.
- **Editorial FLAGs NOT auto-applied** (judgment calls → filed as a tracked issue, surfaced to user): ch03 convergence-scope (examples-as-constraints leg is single-source); ch04 "strongest convergence in this book" superlative + ETH study is a T3 arXiv preprint; ch06 Replit `practitioner` tag (press-about-third-party); **manifest tier-drift** (peer-reviewed papers tagged `T3-practitioner` — the enum has no academic tier; affects ch08/09/11, reader-invisible); ch10 LangMem vendor `practitioner` tag; ch11 "the one measured result" superlative. Mostly dossier-inherited / taxonomy decisions.
- **Dates:** `last_updated`/`last_verified` → 2026-06-13 on the **6 edited** chapters only; the 5 unedited (ch03/04/05/07/11) reviewed clean and stay 2026-05-29 (still fresh — 16 days, well under the 45-day floor).
