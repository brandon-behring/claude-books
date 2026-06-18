# Handbook source audit — quality + currency triage

**Date**: 2026-06-18
**Auditor**: Claude (Opus 4.8), in-session
**Subject**: `~/claude-best-practices` (LaTeX v2.9) — the porting source for `handbook/` — plus the shipped Part I MDX (Ch 1–4).
**Purpose**: decide, per chapter, what is worth porting as-is vs. updating vs. rewriting vs. cutting, before committing to the Parts II–IV port under the slim content model (PEDAGOGY #7 → slim, decided 2026-06-18).
**Depth**: two-axis triage (Quality × Currency), not line-by-line. See *Method* and *Limitations*.

---

## Headline verdict

The source is a **strong, well-written foundation that is worth porting — not rewriting wholesale.** The problem is **currency, not quality.** Two facts dominate:

1. **Content is frozen at 2026-03-27** and the repo was **explicitly sunset 2026-04-18** (`SUNDOWN.md`). The sunset pivoted *forward* work to a tool-agnostic successor (*Agentic Coding*, now `agentic-coding/`) because the LaTeX had "scope drift toward **Claude-specific trivia**." That Claude-specificity is precisely the **handbook's** mandate — so the port premise holds; the handbook is the right home for this material.
2. Currency has a clean **bimodal split**: stable-principle chapters port cheaply; feature-surface chapters need a fact-refresh pass; and **one chapter (Agents & Parallel Work) has a genuine paradigm gap** — the June-2026 multi-agent-orchestration layer (Agent View, `/goal`, `/workflows`, nested subagents) postdates the source entirely.

A live June-2026 check estimates **~30–40% of the guide's volatile surface is stale**; the stable ~half is durable. **Nothing warrants cutting for quality.**

---

## Method

- **Git/CHANGELOG**: established the freeze date (last content commit `be1ba46`, 2026-03-27) and sunset (`b927401`, 2026-04-18). v2.9 was an *expansion* (+543 lines of practitioner content) and passed a quality audit (4 factual errors fixed, 2 platitudes cut).
- **Leveraged the existing in-repo audit**: `codex_claude_best_practices_audit_2026-03-25.md` already did a currency pass — verdict: *"directionally strong on stable practice; volatile product-surface facts drifted."* Its P0/P1 findings (hooks, permission modes, model wording, FedRAMP) are the March baseline.
- **Live June-2026 currency check** (via claude-code-guide / live docs): re-verified the volatile surfaces three months on (see *Currency deltas*).
- **Firsthand quality reads**: Ch 1 (Principles) and Ch 14/Enterprise — the stable exemplar and the highest-volatility chapter — to confirm the quality axis directly.
- **Seeded** per-chapter verdicts from `handbook/OUTLINE.md`'s existing per-chapter "Stale signals."

**Currency anchor**: the source predates Opus 4.8, Fable 5 (GA 2026-06-09), `opusplan`, 1M-context-as-default, hooks growing 22→30, and the entire agent-orchestration surface.

---

## Per-chapter triage

Quality: ●●● strong / ●●○ good-needs-edits. Currency: 🟢 OK / 🟡 drifted (fact-refresh) / 🔴 badly stale or paradigm gap.
Verdict: **PORT+** (port, light update) · **REFRESH** (port + currency pass) · **REWRITE/EXPAND** · **CUT**.

| # | Source `.tex` | Target ch | Qual | Curr | Verdict | Why |
|---|---|---|---|---|---|---|
| — | 00_preamble | Landing | ●●● | 🟢 | PORT+ | Persona routing / source-labels / spiral are structural. Nod to the "two Use books" framing. |
| 1 | 01_principles | Ch 1 | ●●● | 🟢 | PORT+ *(shipped)* | Agent loop + 4 principles — timeless. Confirmed strong firsthand. |
| 2 | 02_first_claude_md | Ch 2 | ●●● | 🟢 | PORT+ *(shipped)* | `/init`, deny rules stable; minor `.claude/rules/` paths note. |
| 3 | 03_first_session | Ch 3 | ●●● | 🟡 | REFRESH *(shipped — re-verify)* | Shortcuts drifted (Alt+M undocumented, Ctrl+G = open plan in editor); 6 permission modes stable; rewind. **Part I shipped — re-check it didn't ship stale.** |
| 4 | 04_prompting | Ch 4 | ●●● | 🟡 | REFRESH *(shipped)* | Model-capabilities table: 4.6→**4.8**, +Fable 5, +`opusplan`, adaptive thinking. |
| 5 | 05_context | Ch 5 | ●●● | 🟡 | REFRESH | 60–70% threshold flagged too-hard (codex P1); 1M now GA/default; emphasize durable artifacts > compaction alone. |
| 6 | 05_thinking_partner | Ch 6 | ●●● | 🟢 | PORT+ | Collaboration / anti-sycophancy / ADRs — durable mindset. |
| 7 | 06_testing | Ch 7 | ●●● | 🟢 | PORT+ | 6-layer validation + domain correctness — stable. |
| 8 | 07_extending | Ch 8 | ●●● | 🔴 | REFRESH (heavy) | Densest feature surface: hooks **22→30**, plugins/marketplaces evolved, IDE matrix, `/reload-skills`, local plugin auto-load. Longest chapter (822 ln). |
| 9 | 08_claude_md_architecture | Ch 9 | ●●● | 🟡 | REFRESH (light) | Hub-spoke / tiers / settings precedence stable; managed-settings keys expanded. |
| 10 | 09_agents_parallel | Ch 10 | ●●○ | 🔴 | **REWRITE/EXPAND** | **Paradigm gap.** Agent View, `/goal`, `/workflows`, nested subagents, Agent Teams now core — none in source. Strong candidate to split into a new orchestration chapter. |
| 11 | 10_projects | Ch 11 | ●●● | 🟢 | PORT+ | Greenfield/brownfield/refactoring/characterization tests — durable. |
| 12 | 12_automation | Ch 12 | ●●● | 🟡 | REFRESH | Headless stable; Remote Control now on Bedrock/Vertex; `/schedule`, `/code-review`; overlaps new orchestration. |
| 13 | 11_antipatterns | Ch 13 | ●●● | 🟢 | PORT+ | 8 antipatterns + 4-layer diagnosis — durable. |
| 14 | 13_team | Ch 14 | ●●● | 🟡 | REFRESH (light) | Managed settings expanded (`enforceAvailableModels`, `requiredMinimumVersion`, …). |
| 15 | 14_enterprise | Ch 15 | ●●● | 🔴 | REFRESH (heavy) | Confirmed firsthand: **FedRAMP High mis-stated** (Bedrock-only, not Claude Code), pricing table on 4.6, Copilot "Feb 2026 preview", partner numbers dated. Highest fast-moving volatility. |
| A/B/C | appendices/* | Appendices | ●●● | 🟡–🔴 | REFRESH | Appendix C (hook events 22→30, env vars, CLI flags) + reference_card badly stale; maturity model stable. |

---

## Currency deltas to apply during the port (June-2026 truth)

- **Models** 🔴: `opus`→**Opus 4.8** (default), **Fable 5** (`fable`/`best`, GA 2026-06-09), `opusplan` hybrid, `sonnet`→4.6, `haiku`→4.5; **1M context GA/default**. Touches Ch 4 + Ch 15 pricing.
- **Hooks** 🟡: **30 events** (was ~22) — +`Elicitation*`, `InstructionsLoaded`, `ConfigChange`, `CwdChanged`, `FileChanged`, `Worktree*`, etc. Touches Ch 8 + Appendix C.
- **Permission modes** 🟢: 6, stable. Shortcuts drifted (Alt+M gone; Ctrl+G = open plan in editor). Touches Ch 3.
- **Compliance** 🔴: FedRAMP High = **Bedrock-only, NOT Claude Code** (correct the March error); +data residency, +Enterprise RBAC. Touches Ch 15.
- **Agent orchestration** 🔴 (the big one): Agent View (`claude agents`), `/goal`, **`/workflows`**, nested subagents (5 deep), background-subagent state. Touches Ch 10 (rewrite) + Ch 12.
- **Smaller adds**: `/cd`, voice mode, local plugin auto-load, `/code-review` (←`/simplify`), fallback model chains, `Tool(param:value)` permission matching.

---

## Recommendation

1. **Port — don't rewrite.** Quality is uniformly strong; this is a fact-refresh job, not a re-authoring job.
2. **Port order by cost:** the 🟢 stable chapters first (1, 2, 6, 7, 11, 13 — cheap, high-confidence), then the 🟡 refresh chapters, then the 🔴 heavy ones (8, 15) and the **Ch 10 rewrite/expand** last (most new authoring; decide whether it becomes a dedicated orchestration chapter — this is the one place the 15-chapter OUTLINE scope may need to grow).
3. **Re-verify shipped Part I** (Ch 3 especially) for the shortcut/model drift above — it shipped 2026-05-25 and may carry stale strings.
4. **Reconciliation (next step)**: with quality confirmed strong, the orphan Ch 5–8 `poc/` supplements are usable drafting basis; Part I's 5/ch supplements can stay (grandfathered) rather than be pruned. Pruning was *not* indicated by the audit.

---

## Limitations

Triage depth, by design — full firsthand reads on Ch 1 + Ch 15 only; the other 14 chapters' verdicts rest on the in-repo codex 2026-03-25 audit + OUTLINE stale-signals + git/CHANGELOG + the live currency check. The 🔴 chapters (8, 10, 15) warrant a deeper claim-by-claim pass *at port time*, not before. Pricing specifics (Ch 15) need a live pull at authoring time, not from this triage.
