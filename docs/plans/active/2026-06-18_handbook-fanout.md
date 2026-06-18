# Handbook Parts II–IV fan-out — roadmap

**Status**: active — Phase 0 in progress (2026-06-18)
**Type**: Large Task (~5–8 sessions) · multi-phase
**Decided via**: `/exploring-options`, 7 decisions, 2026-06-18
**Tracking issue**: [claude-books#21](https://github.com/brandon-behring/claude-books/issues/21) · **Pilot precedent**: Ch 6 (`docs/plans/active/2026-06-18_handbook-ch06-pilot-port.md`) · **Recipe**: `handbook/docs/port-recipe.md`

## Context

Part I (ch01–04) + Ch 6 are ported; the Ch 6 pilot proved the **tutorial-first** recipe. Audit
(`docs/audits/2026-06-18_handbook-source-audit.md`) = *port-don't-rewrite*; LaTeX source on disk at
`~/claude-best-practices/chapters/`; research backbone (`~/Claude/research-dossiers`) current. This
roadmap finishes the handbook toward v1.0: **10 chapters (ch05, 07–15) + a new Orchestration chapter
(the Ch 10 split → 16 ch) + appendices A/B/C.**

## Decisions (7)
1. **Mechanism — staged**: Workflow fan-out the low-risk chapters (in-Workflow verify); HAND-author the hard ones.
2. **Ch 10 — split → 16 ch**: new **Ch 11 Orchestration** (Agent View, `/goal`, `/workflows`, nested subagents, Agent Teams); Ch 10 keeps use-side parallel work. *(OUTLINE restructured 2026-06-18.)*
3. **Appendices — all 3**: A rides ch05, C rides ch08, B standalone (ch04 material).
4. **Review — full 3-voice** `/adversarial-review` on every chapter + appendix.
5. **`.tex`-first pilot FIRST**: hand-port **ch12 Project Lifecycle** to prove `.tex`-first + update the recipe, *then* fan out.
6. **Tracking**: this doc + one `tracked` epic issue on claude-books.
7. **Currency — dedicated pre-pass**: verified `handbook/docs/currency-brief-2026-06.md` (June-2026 deltas), consumed by every author.

## The 16-chapter structure (post-restructure)

| New | Title | Source `.tex` | Tier | Method | Track |
|----|-------|---------------|------|--------|-------|
| 05 | Context as Currency | 05_context | REFRESH | tutorial-first (+App A) | fan-out |
| 07 | Testing & Verification | 06_testing | PORT+ | tutorial-first | fan-out |
| 08 | Extending Claude | 07_extending | heavy REFRESH | tutorial-first (+App C) | **hand** |
| 09 | Scaling Configuration | 08_claude_md_architecture | REFRESH | `.tex`-first | fan-out |
| 10 | Agents & Parallel Work | 09_agents_parallel | use-side | `.tex`-first | **hand** |
| 11 | **Orchestration (NEW)** | new + live research | REWRITE | research-first | **hand** |
| 12 | Project Lifecycle | 10_projects | PORT+ | `.tex`-first | **pilot (1a)** |
| 13 | Headless & Automation | 12_automation | REFRESH | `.tex`-first | fan-out |
| 14 | Antipatterns & Recovery | 11_antipatterns | PORT+ | `.tex`-first | fan-out |
| 15 | Team Patterns & Governance | 13_team | REFRESH | `.tex`-first | fan-out |
| 16 | Enterprise Deployment | 14_enterprise | heavy REFRESH | `.tex`-first | **hand** |

Pilot (1): **ch12**. Fan-out (6): 05(+App A), 07, 09, 13, 14, 15. Hand (4 + App B/C): 08(+App C), 10, 11, 16, + App B.

## Phases

- [ ] **Phase 0 — Prep + currency + tracking**
  - [x] OUTLINE restructure → 16 ch (Orchestration @11; old 11–15 → 12–16); ch06 forward-refs bumped (Project 11→12, Team 14→15)
  - [x] this plan doc + the `tracked` epic issue (claude-books#21)
  - [x] currency pre-pass → `handbook/docs/currency-brief-2026-06.md` (6 UNVERIFIED items flagged for chapter-time checks — incl. the "Remote Control on Bedrock/Vertex" mis-attribution)
- [ ] **Phase 1a — `.tex`-first pilot (ch12 Project Lifecycle)** — hand-port `10_projects.tex`; prove the method; fold specifics into the recipe; full 3-voice review; commit. *(Gate before fan-out.)*
- [ ] **Phase 1b — Fan-out the 6 (Workflow) + App A** — `pipeline(author, verify)`, worktree isolation; each author gets the `.tex` + (draft tutorial for 05/07) + recipe + ch06/ch12 templates + the currency brief.
- [ ] **Phase 2 — Hand-author** ch08 (+App C), ch16, ch10, **ch11 Orchestration** (live research), App B.
- [ ] **Phase 3 — Full 3-voice review** on each chapter + appendix; fold confirmed findings; reject FPs.
- [ ] **Phase 4 — Consistency + close** — Tip renumber (reading order across 16 ch); `_(forthcoming)_` → real links as chapters land; full build + validate; update OUTLINE status + memory.

## Verification
- Per chapter: build + validate green; Go-deeper renders correct supplements; no dangling/old-number refs; 3-voice review folded.
- Whole-handbook: 16 ch + 3 app build; Tip numbers monotonic; all cross-refs resolve.

## Decisions Made (rationale, for posthoc)
- **Staged over full-fan-out**: the heavy-refresh + paradigm-gap chapters need live currency/research judgment that blind subagents handle poorly; fan-out only the low-risk tiers.
- **Split Ch 10 → 16 ch**: the June-2026 orchestration layer is substantial enough to overload a single Ch 10 (audit's "strong candidate to split").
- **`.tex`-first pilot first**: Ch 6 only proved tutorial-first; `.tex`-first is unexercised under the recipe — pilot one stable chapter before parallelizing 6.
- **Currency pre-pass**: verify the volatile facts once, consistently, vs N flaky per-subagent lookups (currency was the Ch 6 review's highest-risk dimension).
