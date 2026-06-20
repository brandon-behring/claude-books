# Series pedagogy & positioning audit

**Date**: 2026-06-19
**Auditor**: Claude (Opus 4.8), in-session
**Subject**: the whole `claude-books` series — 4 public books (`handbook/`, `agentic-coding/`,
`architect-reference/`, `agentic-systems-design/`) + the `glossary/` layer.
**Purpose**: judge **pedagogy** across the books, **resolve** the handbook ↔ agentic-coding
coverage overlap, and sharpen **how each book is framed and its separate goal** — a pre-v1.0
deliberateness pass so the series reads as one intentional set rather than four books with
overlapping chapters and divergent teaching styles.
**Scope discipline**: pedagogy-led. **Visual style is align-and-defer** — brandon-behring.dev
(canonical Warm-Tol palette) + the scaffold are the style source of truth; this audit only checks
alignment and files style/figure gaps as upstream issues (`CONTRIBUTING.md:24-28`). It does *not*
re-derive or deeply assess visual style, and it is *not* a full pre-v1.0 completeness QA.
**Depth**: device-matrix grep (reproduced this session) + side-by-side deep reads of all six
twinned chapter pairs. See *Method*.

---

## Headline verdict

1. **The two Use books are a genuine altitude split, not redundancy — keep both.** Verified by
   reading all six twinned chapter pairs: handbook is Claude-specific operational HOW-TO;
   agentic-coding is tool-agnostic PRINCIPLE with real Claude/Gemini/Codex comparison. They are
   complementary, and merging them would lose an altitude.

2. **But the handbook currently carries cross-tool *principle* it should not own.** Under the
   adopted architecture (**lean-but-standalone handbook + a depth ladder**), the principle *core*
   canonically deepens in agentic-coding; handbook keeps a brief treatment + an inviting
   breadcrumb. Two pairs are HIGH de-dupe hotspots today (**Thinking Together**, **Antipatterns**);
   "Enterprise" and the Claude-specific orchestration chapter (ch11) are the clean model.

3. **Pedagogy divergence across the four books is mostly genre-defensible, with named
   exceptions.** Each book's device profile fits its genre (tutorial / principle / study-guide /
   reference). The real drift is narrow: the source-`<Tag>` system is used only in cert + design;
   the figure standard is handbook-only while design ships 18 figures without it; and `PEDAGOGY.md`
   itself has stale content. These get a series-level home (a genre→device matrix).

4. **The earlier exploration mis-counted several device totals.** Reproduced grep this session
   corrects them — most importantly, **agentic-coding is *not* apparatus-free** (44 citations, 18
   `<TryThis>`, 62 convergence/divergence blocks), and **agentic-systems-design *does* have
   exercises** (33). The rigor concern for agentic-coding is softer than first reported but still
   real on *content* axes (cross-tool depth is "map, not territory"; `last_verified` frozen
   2026-04-17) — hence a scoped rigor re-examination, not a rewrite.

---

## Method

- **Device matrix** — `grep -rohE "<Comp[ >/]"` across each book's `src/content/chapters/`,
  reproduced this session so every count below is verifiable (not inherited from the exploration
  pass, which erred — see *Corrections*). Figures counted as `.tex` assets in each book's
  `figures/` dir (the `<Figure>` component is barely used; figures are build assets).
- **Coverage** — side-by-side deep reads of all six twinned pairs (context, thinking-together,
  enterprise read first; antipatterns, team-patterns, orchestration/delegation read second),
  judging altitude, overlap, de-dupe hotspot severity, and cross-tool depth with quoted evidence.
- **Framing** — read `docs/BOOK-MAP.md`, `docs/ROADMAP.md`, `CLAUDE.md`, root `README.md`,
  `docs/cert-coverage.md`; located the upstream style authority at `~/Claude/brandon-behring.dev/`
  and the scaffold alignment layer at `~/Claude/book-scaffold-astro/`.
- **House style** — modeled on `docs/audits/2026-06-18_handbook-source-audit.md`.

### Corrections to the exploration counts (epistemic honesty)

| Device | Exploration said | Verified (this session) |
|---|---|---|
| agentic-coding Citation | 9 (one agent said 0) | **44** |
| agentic-coding Convergence+Divergence | 174 | **62** (20 + 42) |
| agentic-coding apparatus | "zero" | has **18 `<TryThis>`**, 23 KeyIdea, 18 ConceptBox |
| agentic-systems-design Exercise/Practice | 0 / 0 | **33 / 34** (+ 62 Solution) |
| agentic-systems-design Citation | 390 | **625** |
| architect-reference Pitfall | 0 | **53** |
| handbook Exercise / MarginNote / Pitfall | 64 / 99 / 93 | **48 / 51 / 79** |

Use the verified column. The corrections do not change the *altitude-split* verdict (a content
judgment from the deep reads), but they soften the "agentic-coding is thin/empty" framing.

---

## Part A — Per-book profile, sharpened goal, ladder position

The adopted architecture is a **depth ladder**: *use it today → understand why → engineer it*,
with the cert book orthogonal. Each book stays **standalone**; breadcrumbs *invite* the deeper
rung, they never say "see the other book for the real version" (`BOOK-MAP.md:88` preserved).

| Book | Sharpened one-line goal | Genre / altitude | Ladder position |
|---|---|---|---|
| **handbook** | *Use Claude Code well, today.* | Tutorial / how-to, Claude-specific, lean-but-standalone | **Rung 1 — entry** |
| **agentic-coding** | *Understand why agentic coding works — and where the tools differ.* | Principle / comparative essay, cross-tool (Claude = home lens) | **Rung 2 — the "why" anchor** |
| **agentic-systems-design** | *Engineer agentic systems.* | Reference treatise, multi-volume | **Rung 3 — deepest** |
| **architect-reference** | *Pass the CCA-F cert with one self-contained book.* | Study guide / exam prep | **Orthogonal — exam path** |
| **glossary** | *Define the shared vocabulary once.* | Infra term layer (not read-through) | **Cross-cutting** |

**handbook** — Device profile fits the tutorial genre: exercise-heavy (48 Exercise + 46 Practice +
48 Solution), Pitfall 79, Tip 44, BeforeAfter 18, MarginNote 51, 14 figure assets, a
`FIGURE-STANDARD.md`. No `<Tag>`, no assessment apparatus — correct for the genre. **Drift to fix:
it carries cross-tool principle that should trim to breadcrumbs** (Part C). It is the *unfinished*
book (4/16 ch shipped + ch06 pilot), so the lean trim also lightens the remaining port.

**agentic-coding** — Device profile fits the principle/comparative genre: `<Convergence>` 20 +
`<Divergence>` 42 (its signature apparatus), ConceptBox 18, TryThis 18, **Citation 44**, KeyIdea
23, Sidenote 5. No exercises/figures — defensible for an essay. **Now the ladder's "go deeper"
anchor**, so its content rigor matters: deep reads found cross-tool material that *names* rather
than *explores* Gemini/Codex differences, and `last_verified` is frozen 2026-04-17. → scoped
rigor re-examination (Part E), not a rewrite.

**agentic-systems-design** — Device profile fits a citation-dense reference treatise: **Citation
625** (highest), `<Tag>` 282, MarginNote 61, InsightBox 28, ConceptBox 26, WorkedExample 15, **18
figure assets**, and — notably — Exercise 33 / Practice 34 / Solution 62 (applied reinforcement;
defensible). **Gap: 18 figures with no figure standard** (handbook has the only one) and **no
prior independent audit.**

**architect-reference** — The strongest apparatus discipline: Diagnostic 30 (one per chapter),
PartReview 5, Practice 64, Solution 94, Exercise 30, WorkedExample 30, `<Tag>` 297, Citation 303,
YouWillLearn 30, Pitfall 53. Heavily audited already (three prior reports). Self-contained by
design; orthogonal to the ladder.

**glossary** — 70 canonical terms, sync infra live, cert consumer wired; handbook/design retrofit
pending. Out of pedagogy scope except as the model for the shared series page (Part E).

---

## Part B — Pedagogy matrix + genre→device consistency

### Verified device matrix (chapters only; figures = `.tex` assets)

| Device | handbook | agentic-coding | architect-ref | design |
|---|---:|---:|---:|---:|
| files / lines | 20 / 5622 | 23 / 3823 | 30 / 5217 | 28 / 4623 |
| Exercise | 48 | 0 | 30 | 33 |
| Practice | 46 | 0 | 64 | 34 |
| Solution | 48 | 0 | 94 | 62 |
| Citation | 97 | 44 | 303 | 625 |
| Tag | **0** | **0** | 297 | 282 |
| MarginNote | 51 | 0 | 45 | 61 |
| Sidenote | 0 | 5 | 0 | 0 |
| KeyIdea | 36 | 23 | 50 | 38 |
| Pitfall | 79 | 0 | 53 | 27 |
| WorkedExample | 7 | 0 | 30 | 15 |
| YouWillLearn | 16 | 0 | 30 | 28 |
| InsightBox | 23 | 0 | 0 | 28 |
| BeforeAfter | 18 | 0 | 0 | 0 |
| Tip | 44 | 0 | 0 | 0 |
| TryThis | 0 | 18 | 0 | 0 |
| ConceptBox | 0 | 18 | 43 | 26 |
| Convergence | 0 | 20 | 0 | 10 |
| Divergence | 0 | 42 | 0 | 0 |
| Diagnostic | 0 | 0 | 30 | 0 |
| PartReview | 0 | 0 | 5 | 0 |
| Figures (`.tex`) | 14 | 0 | 0 | 18 |

### Proposed genre→device matrix (the consistency rule)

The fix for "four divergent styles" is not uniformity — it is an explicit rule of *which devices
belong in which genre*. Devices below are **core** (expected), **optional**, or **out** (genre
mismatch).

| Genre (book) | Core devices | Optional | Out |
|---|---|---|---|
| **Tutorial** (handbook) | YouWillLearn, KeyIdea, BeforeAfter, WorkedExample, Tip, Pitfall, Exercise/Practice/Solution, MarginNote, Figures | Convergence breadcrumb | Diagnostic, PartReview, full Tag system |
| **Principle/comparative** (agentic-coding) | KeyIdea, ConceptBox, Convergence, Divergence, Citation, TryThis | Figures (comparison), Sidenote | Exercise/Practice (no drilling), Diagnostic |
| **Study guide** (architect-reference) | Diagnostic, YouWillLearn, Exercise/Practice/Solution, Rationale, PartReview, WorkedExample, Tag, Citation, Pitfall | ConceptBox | BeforeAfter (rare) |
| **Reference** (design) | Citation (dense), Tag, KeyIdea, ConceptBox, InsightBox, MarginNote, WorkedExample, Figures | Exercise/Practice (applied) | Diagnostic, PartReview |

### Drift vs intentional

- **Intentional (defensible):** agentic-coding has no exercises (principle book); cert owns the
  assessment stack; design is citation-dense; handbook is exercise/Pitfall-heavy. All correct.
- **Drift #1 — `<Tag>` source-attribution is used only in cert (297) + design (282); zero in both
  Use books.** `PEDAGOGY.md` decision #4 frames source-tagging as a standard. Either adopt a
  lightweight Tag in the Use books or **scope decision #4 to cert/design**. (Recommended: scope it
  — the Use books cite via `<Citation>`; pervasive Tag suits reference/cert, not tutorial/essay.)
- **Drift #2 — figure standard is handbook-only; design ships 18 figures without it.** Design
  should consume the standard. (The standard + `--fig-*` tokens are *upstream* concerns — Part D.)
- **Drift #3 — MarginNote load varies (handbook 51, design 61, cert 45, AC 0) with no per-genre
  guidance**, and `PEDAGOGY.md:55` still cites a *retired* "25-word cap enforced."
- **Drift #4 — `PEDAGOGY.md` doc-drift:** lists the retired volatility enum `evolving / fast-moving`
  (`:68`; real enum = `stable-principle / architectural-pattern / feature-surface`) and the retired
  25-word cap (`:55`). It is also still handbook-scoped though it reasons about all four books.

→ All four drifts get a durable home by **elevating `PEDAGOGY.md` to a series-level pedagogy doc
carrying the genre→device matrix above** (Part E, decision D4).

---

## Part C — handbook ↔ agentic-coding (the headline)

**Verdict: genuine altitude split.** handbook = Claude-specific operational HOW-TO; agentic-coding
= tool-agnostic principle + real Claude/Gemini/Codex comparison. The books are complementary. But
under the lean-but-standalone ladder, handbook must **trim cross-tool principle to a brief +
breadcrumb**, letting the principle *core* canonically deepen in agentic-coding.

### Per-pair de-dupe map (all six twinned pairs)

| Pair (handbook ↔ agentic-coding) | Altitude holds? | Overlap | Hotspot | Trim from handbook → keep in handbook |
|---|---|---|---|---|
| **Context** (ch05 ↔ 02) | ✓ | Partial (shared core, then diverge) | **MED** | Trim: *why* context rots (principle) → AC. Keep: `/clear` `/compact` `/rewind` `/context`, CURRENT_WORK.md, `--resume`. |
| **Thinking Together** (ch06 ↔ 06) | ✓ | Substantial (5 modes near-verbatim) | **HIGH** | Trim: the five collaboration modes (principle) → AC. Keep: the worked sycophancy-recovery example + ADR mechanics in Claude. |
| **Extending** (ch08 ↔ 08) | ✓ | Partial | MED | Trim: extension *concepts*. Keep: hooks (30 events), plugins, MCP config in Claude Code. |
| **Agents & Parallel** (ch10 ↔ 09) | ✓ | Partial (delegation principle) | **MED-HIGH** | Trim: delegation decision + parallelism sweet-spot + Writer/Reviewer + worktree *principle* → AC. Keep: Task tool API, subagent types, `/batch`, prompt design. |
| **Orchestration** (ch11 ↔ —) | ✓ | **Orthogonal** | **NONE** | Keep as-is. Agent View, `/goal`, `/workflows`, Agent Teams, nested subagents are Claude-specific; AC doesn't generalize them. Add a one-line breadcrumb to AC ch09 for the underlying delegation principle. |
| **Antipatterns** (ch14 ↔ 11) | ✓ | Substantial (8 patterns + 4-layer diagnosis wholesale) | **HIGH** | Trim: the 8 antipattern definitions + 4-layer diagnosis (tool-agnostic) → AC. Keep: Claude recovery mechanics (`/clear`, `/memory`, hooks, settings.json deny vs CLAUDE.md advisory). |
| **Team Patterns** (ch15 ↔ 13) | ✓ (caveat) | Partial | MED | Trim: shared-briefing-doc + review *principle* → AC. Keep (legitimately Claude-specific): managed-settings delivery, managed-only controls, 5-level precedence, `/init`. |
| **Enterprise** (ch16 ↔ 14) | ✓ | **Minimal (perpendicular)** | **LOW** | The model. Keep Claude compliance/cost/managed-settings; AC owns the envelope-first cross-tool design. |

**Resolution pattern (the de-dupe doctrine for the Use books):** for each shared concept,
agentic-coding owns the **principle/cross-tool core**; handbook keeps the **Claude-specific
how** + a one-or-two-sentence principle summary + a breadcrumb inviting AC. Because the books are
separate Astro apps/subdomains, breadcrumbs use `<BookLink>` (scaffold-provided), not `<XRef>`.
"Enterprise" (ch16) and "Orchestration" (ch11) already exhibit the target shape.

**Cross-tool depth caveat:** agentic-coding *does* deliver three-tool comparison (Convergence +
Divergence blocks throughout, with command-level examples — e.g., `--worktree` vs manual
`git worktree add`, ch09), but depth is uneven: strong on orchestration/enterprise, thinner
("naming, not exploring") on thinking-together and context. This feeds the D2 rigor re-examination.

---

## Part D — Style alignment (brief; deferred upstream)

Posture confirmed: **books inherit style from the scaffold (`^4.25.0`, zero local overrides);
the scaffold mirrors brandon-behring.dev's canonical Warm-Tol palette.** Alignment is healthy.
Gaps are *upstream* concerns to file (not in-repo work), per `CONTRIBUTING.md:24-28`:

- **No named `--fig-*` tokens** — figure palette is hardcoded in LaTeX; pale fills collapse in
  dark mode (border carries meaning). Logged `FIGURE-STANDARD.md:141-149` + `scaffold-gaps.md`,
  **not yet filed.** → file the scaffold issue.
- **Palette hex duplicated** in brandon-behring.dev and the scaffold (no single source) → file.
- **No semantic "when to use each color" design-guide** at brandon-behring.dev → optional upstream.
- **Figure standard is handbook-only** while design has 18 figures → once `--fig-*` lands, design
  consumes the shared standard (in-repo follow-up, gated on the upstream token work).

---

## Part E — Remediation backlog

Prioritized + sequenced. **No edits made in this audit phase** — this backlog is the hand-off;
Brandon authorizes execution. Each item: *what · where · effort · in-repo vs upstream · decision?*

### P1 — Framing (make the ladder real)

1. **Sharpen per-book goals + encode the depth ladder** · `docs/BOOK-MAP.md`, `docs/ROADMAP.md` ·
   S · in-repo. Use the Part A one-liners + ladder positions; add the honest note that
   agentic-coding is framing-depth (not tutorial-depth) and the apparatus asymmetry is by genre.
2. **Fix stale framing docs** · root `README.md` (+ agentic-coding entry + two-Use-books framing),
   `docs/cert-coverage.md` (+ agentic-coding column/row) · S · in-repo.
3. **Shared "How the series fits together" page** · canonical source + `scripts/sync-glossary.mjs`
   pattern → each book's `src/content/` · M · in-repo (+ **upstream** scaffold issue if a route/
   component is needed) · *decision:* confirm sync-vs-route mechanism.

### P1 — Coverage (de-dupe under the ladder)

4. **Trim handbook's cross-tool principle to brief + `<BookLink>` breadcrumb**, AC owns the core ·
   `handbook/src/content/chapters/{ch06,ch14}` (HIGH first), then `{ch05,ch10}` (MED-HIGH/MED),
   then `{ch08,ch15}` · M–L · in-repo · per the Part C map. ch11 + ch16 already model the target.
   *Gated on:* the P3 handbook lean-port (the trim is part of porting those chapters).

### P2 — Pedagogy (durable home)

5. **Elevate `PEDAGOGY.md` → series-level + genre→device matrix** (Part B), fix drift (`:55`
   retired cap, `:68` retired enum), scope decision #4 (`<Tag>` = cert/design only), add
   per-genre MarginNote guidance · `handbook/PEDAGOGY.md` → repo-level · M · in-repo ·
   *decision:* final genre→device rule + new doc location.

### P2 — Rigor (own follow-up audit)

6. **Scope a dedicated agentic-coding rigor re-examination** · new
   `docs/audits/<date>_agentic-coding-rigor-audit.md` · method: citation sufficiency (44/23 is
   light for the depth anchor) + cross-tool *depth* pass (turn "naming" into "exploring" on the
   thin pairs) + currency re-verify (`last_verified` 2026-04-17) · L · in-repo · **sequenced after
   the handbook port** so it doesn't steal focus from the unfinished book.

### P2 — Style (upstream issues)

7. **File the deferred style gaps** · `--fig-*` tokens, palette single-sourcing, optional color
   design-guide · scaffold / brandon-behring.dev via `consumer:claude-books` · S each · **upstream**.
   Then (in-repo, gated) design adopts the figure standard.

### P3 — Handbook lean-port continuation

8. **Continue porting handbook ch05/07–15 + appendices in the lean-but-standalone shape**
   (carries item 4's trims chapter-by-chapter) · `handbook/src/content/chapters/*` · L · in-repo ·
   per `handbook/docs/port-recipe.md`. The ladder decision *reduces* the per-chapter principle load.

---

## Limitations

- **Style not deeply assessed** (deferred upstream by scope) — Part D is alignment-check only.
- **Not a full completeness QA** — Brandon chose positioning-led, not the readiness/gaps audit;
  completeness enters only where it bears on pedagogy/coverage (e.g., handbook mid-port).
- **Device matrix counts opening tags** — minor over/under-count possible for components with
  shared prefixes, but the `[ >/]` bound makes this small; counts are reproducible via the *Method*
  command.
- **agentic-coding cross-tool depth** is judged qualitatively from sampled sections; the P2 rigor
  audit (item 6) is the rigorous pass.
