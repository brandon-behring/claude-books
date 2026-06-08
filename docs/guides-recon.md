# Guides-repo recon — 13-category comparative analysis

**Date**: 2026-05-24
**Purpose**: Compare `~/guides/` + `~/guides-experimentation/` (sibling consumers of the same `@brandon_m_behring/book-scaffold-astro` v4.2.0 scaffold) against `~/claude-books/` to surface **decision categories that claude-books has not yet addressed**. This is a working memo, not an adoption plan. Each category articulates what guides chose, why, what claude-books currently has, what claude-books *could* do given its different audience and register, and (where recommended) a concrete adoption path.

**Why guides as the reference**: both repos use the same scaffold; guides has run further down the consumer path (multi-volume hub, design-doc discipline, friction logs, CI workflows, schema extensions, deploy patterns). It has surfaced decision categories empirically that claude-books would otherwise discover one at a time.

**Audience divergence to keep in mind**:

| Property | guides | claude-books |
|---|---|---|
| **Audience** | Interview-prep learners (DS / ML / AI engineering candidates) | Claude Code practitioners + AI engineering architects |
| **Register** | Tutorial / pedagogical (transfer + retention focus) | Practitioner reference + design reference |
| **Volume mix** | 1 hub + N per-guide sibling repos | 1 workspace, planned 3 volumes (handbook + architect-ref + field-guide) + glossary |
| **Verification model** | Capstone + portfolio | Citation tier + research cache |
| **Content shape** | Chapter MDX with chapter-companion code + capstone artifact | Long-form chapters + supplements + PoCs + figure library |
| **Scaffold preset** | `research-portfolio` (academic register) | `tools` (practitioner register) |
| **Style composition** | `[researchPortfolioStyle, guidesFamilyStyle]` (composed) | `[toolsStyle]` (single) |

The audience divergence is the lens. Many guides decisions translate; some don't. Each section says which.

---

## 1. License granularity — content (CC BY 4.0) + scripts (MIT) split

**What guides decided**: separate `LICENSE` (CC BY 4.0, content-only) + `LICENSE-SCRIPTS` (MIT, source-code-only). Both committed at the repo root. The `LICENSE` file explicitly states: *"Scripts and source code (Astro config, build scripts, .claude/skills/, etc.) are licensed under the MIT License — see LICENSE-SCRIPTS."* The `LICENSE-SCRIPTS` file states: *"This license applies to source code in this repository... Content under src/content/ is separately licensed under CC BY 4.0."* See `~/guides/LICENSE` + `~/guides/LICENSE-SCRIPTS`.

**Why**: a CC BY 4.0 license is well-suited to prose / diagrams / examples but ambiguous for source code (attribution-only doesn't fit how engineers actually consume scripts). MIT is the conventional choice for build scripts, Claude Code skills, and GitHub Actions. The split removes the ambiguity for downstream consumers — a developer copying an Astro config snippet doesn't need to attribute, whereas someone redistributing a chapter does.

**What claude-books currently has**: single `~/claude-books/LICENSE` (CC BY 4.0). No separate scripts license. The repo has scaffold consumer config (`handbook/astro.config.mjs`), CI-equivalent scripts (`docs/research/.lint.py`, `.crossref.py`), TikZ sources (`handbook/figures/*.tex`), no .claude/skills/ yet.

**What claude-books could do given its different audience**: adopt the split. Claude-books has the same artifact mix (prose content + scripts + config + figures) so the same ambiguity exists. The audience (Claude Code practitioners) is *more* likely than guides' audience to copy-paste scripts — making the licensing clarity more valuable, not less. Default: copy the guides pattern (CC BY 4.0 for `src/content/`, `figures/*.tex`, `docs/`; MIT for `astro.config.mjs`, scripts, future `.github/workflows/`, future `.claude/skills/`).

**Concrete adoption path** (small, ~15 min):
- Edit `~/claude-books/LICENSE` — add the "scripts separately licensed" sentence
- Create `~/claude-books/LICENSE-SCRIPTS` — MIT text + the boundary sentence

**File references**:
- `~/guides/LICENSE` (26 lines)
- `~/guides/LICENSE-SCRIPTS` (25 lines)

---

## 2. AUTHORS.md / AI-collaboration disclosure as a first-class artifact

**What guides decided**: `~/guides-experimentation/AUTHORS.md` (36 lines) is its own committed file separate from CONTRIBUTING. Structured into: (a) Primary author + final responsibility; (b) AI collaboration scope (concrete tooling list: chapter drafting, schema design, structural review, citation lookup, ADR drafting, pair-programming on companion code, pre-PR self-review); (c) Out-of-scope for AI tooling (HITL discipline: no autonomous commits to `companion/src/`, no autonomous commits to `capstone/src/`, no final acceptance of factual claims); (d) Cites the AI-disclosure norms (ACM 2023, Nature 2023, COPE 2023); (e) Per-section authorship plan (per design v0.2 §10.2, each chapter MDX will include inline `<AICollaborationDisclosure>` for primary author + AI tooling scope).

**Why**: AI authorship is becoming a first-class disclosure norm in academic + technical publishing. Naming what the AI *did* and what the human *retained* makes the trust boundary legible. The HITL out-of-scope items (no autonomous commits to specific paths) are the load-bearing part — they signal where the human is final reviewer, not just nominal author.

**What claude-books currently has**: no AUTHORS.md anywhere. The handbook's CLAUDE.md mentions co-authorship in commit messages (`Co-Authored-By: Claude Opus 4.7 (1M context)`) but there's no readme-level statement of the human/AI division of labor.

**What claude-books could do given its different audience**: this is *more* important for claude-books than for guides. The handbook teaches readers how to use Claude well; readers should know exactly what role Claude played in the handbook's own authoring. The audience will explicitly ask "did Claude write this guidance?" — a disclosure file with concrete in-scope / out-of-scope items lets readers calibrate trust. Adopt with claude-books-specific scope (no `companion/src/` analog; replace with: "no autonomous chapter-prose merges before human review", "no autonomous PEDAGOGY.md decision-log row promotion from OPEN to DECIDED").

**Concrete adoption path** (small, ~20 min):
- Create `~/claude-books/AUTHORS.md` mirroring the guides 5-section structure (primary author / AI scope / out-of-scope / norms / per-section plan)
- Adapt the "out of scope" list to claude-books reality: chapter-prose merges, decision-log status changes, scaffold-gap filings (the last is debatable — Claude has been filing those autonomously)
- Add a CLAUDE.md cross-reference pointing at AUTHORS.md

**File references**:
- `~/guides-experimentation/AUTHORS.md` (36 lines)
- `~/guides-experimentation/CLAUDE.md` § "AI collaboration" (cross-references AUTHORS.md)

---

## 3. CONTRIBUTING.md with explicit issue routing

**What guides decided**: `~/guides/CONTRIBUTING.md` (22 lines, very tight). Two tables: (a) where to send PRs by change type (hub vs per-guide vs scaffold); (b) where to file issues by issue type. Names the upstream label (`consumer:guides`) explicitly. Includes an AI-disclosure paragraph noting PRs that touch content must preserve `<AICollaborationDisclosure>` on relevant pages. Total length: 22 lines including blanks.

**Why**: contributors arriving cold need a 30-second answer to "where does this PR / issue go?" The hub+sibling architecture (covered in §13) makes this acute — without a routing table, contributors will file in the wrong repo. The tight length matters; a long CONTRIBUTING.md gets unread.

**What claude-books currently has**: no `CONTRIBUTING.md` anywhere. Six upstream scaffold issues (#56-#61) have been filed with `consumer:claude-books` label, but the policy is undocumented — only known via the BURN_IN_NOTES that lives in the research_toolkit repo.

**What claude-books could do given its different audience**: claude-books is single-repo currently (vs guides' hub+sibling split), so the routing table is simpler but still valuable. Three rows: (a) handbook content → this repo; (b) scaffold-related friction → `book-scaffold-astro` with `consumer:claude-books`; (c) research_toolkit friction → `research_toolkit` repo (this is a claude-books-specific row that guides doesn't have). Document the upstream-issue policy as **durable**: don't patch locally; surface friction upstream. Should match guides' "see `docs/plans/done/2026-05-22_phase_a0_scaffold_preflight_wrap_up.md` for policy rationale" reference but pointing at the claude-books-equivalent (currently lives at the toolkit-level BURN_IN_NOTES; should be reified in claude-books).

**Concrete adoption path** (small, ~25 min):
- Create `~/claude-books/CONTRIBUTING.md` (~30 lines): PR routing table (handbook content + future architect-ref + future field-guide + scaffold + toolkit) + issue routing table + AI-disclosure paragraph + upstream-policy statement
- When Architect's Reference or Field-Guide bootstrap, add rows for those

**File references**:
- `~/guides/CONTRIBUTING.md` (22 lines)
- `~/guides/docs/plans/done/2026-05-22_phase_a0_scaffold_preflight_wrap_up.md` § "Durable policy" (upstream-issue rationale)

---

## 4. Style guide as living author-facing rules

**What guides decided**: `~/guides/docs/style-guide-v0.0.md` (166 lines). Nine numbered sections, each with a `keep / change / drop` status, an MDX-adaptation note (where the LaTeX-era rule translates differently), a pointer to the original LaTeX rule, and Phase-1-deferred items. Topics: margin notes (9-category system + 25-word cap + 4-group color routing), content quality (7-condition margin-note test), citation quality (`<Cite>` component + 90% bibkey match target), evidence standards (Tier 1 must-cite + Tier 2 should-cite + within-10-lines proximity), cross-reference quality (semantic anchors, kebab-case immutable), term consistency (Jaccard < 0.5 across-guide), LOS standards (Bloom + `PREFIX-CHAPTER.NUMBER`), code quality, content freshness.

**Why**: PEDAGOGY-equivalent docs describe *why* (theory, principles, decision rationale). A style guide describes *what to do* — the rules an author reaches for when writing. Different artifacts, different uses. Guides ports its style guide directly from the LaTeX-era rules with explicit `keep / change / drop` per rule — preserves the discipline, makes the MDX-adaptation costs visible.

**What claude-books currently has**: `handbook/PEDAGOGY.md` (~750 lines) covers theory + decisions extensively. The decision-log captures *what was decided* but not *what to do as an author*. No dedicated style guide. The closest thing is the "Constraints + style" paragraphs in commit messages — implicit, not extracted.

**What claude-books could do given its different audience**: extract a `handbook/docs/style-guide.md` from PEDAGOGY decisions + the conventions in commits. Different content than guides' style guide because:
- No interview-prep margin-note categories (Interview / Practice / Pattern / etc.); claude-books uses the 8 scaffold-inherited categories (Official / Tip / Warning / Cost / Enterprise / Template / Vocab / Cross-Ref) plus the YouWillLearn / WorkedExample / Pitfall pedagogy family
- Different evidence-tier system (T1-official / T2-release-notes / T3-practitioner — already in the research cache; surface it for chapter authors)
- Citation pattern is the same `<Cite>` mechanism but with the YAML sources manifest (`handbook/sources/manifest.yaml`), not BibTeX
- LOS standards: claude-books has `cert_domains` + `cert_task_areas` mappings instead of Bloom — those are the load-bearing taxonomic structure

The style guide gets the same `keep / change / drop` treatment but anchored against the LaTeX source repo (`~/claude-best-practices/scripts/` lint rules) rather than guides' source repo.

**Concrete adoption path** (medium, ~2 hours):
- Audit `~/claude-best-practices/scripts/lint_*.py` for existing rules to port
- Create `handbook/docs/style-guide.md` with sections mirroring guides' 9 (margin notes / content quality / citation quality / evidence standards / cross-ref / term consistency / LOS — replace with cert-domain mapping / code quality / content freshness)
- Each section: status + MDX adaptation + LaTeX-rule source + Phase-1-deferred items

**File references**:
- `~/guides/docs/style-guide-v0.0.md` (166 lines, 9 sections)
- `~/claude-best-practices/scripts/lint_margin_notes.py` + `lint_practice_tags.py` (LaTeX-era rules to port)

---

## 5. Zod schema extensions for pedagogical lint

**What guides decided**: `~/guides-experimentation/src/content.config.ts` extends the scaffold's `researchPortfolioChapterSchema` with 10+ pedagogically-motivated frontmatter fields per design v0.2: `mode`, `target`, `ordering`, `commitment`, `paradigms` (validated against `default | udl | srl | andragogy` enum), `research_debt_addressed`, `los[]` (with `id: PREFIX-CHAPTER.NUMBER` pattern + Bloom verb + outcome statement). Per design v0.3 §2.2, future `paradigms[]` lint warns if <2 entries declared (fails UDL representation principle) OR if a declared paradigm is absent from chapter body.

**Why**: schema is enforcement. Theory in a doc is suggestion; theory in a Zod validator is a build error. Guides commits to pedagogical principles (transfer model, multi-paradigm presentation, UDL) and wants the lint to catch chapters that don't meet those commitments — *before* a reader sees them.

**What claude-books currently has**: `handbook/src/content.config.ts` extends the scaffold with a minimal `poc` collection for the 22 PoC artifacts. The `chapters` collection uses the scaffold default + per-chapter frontmatter convention (`cert_domains`, `tools_compared`, `volatility`, `last_verified`, `sources[]`). No pedagogical lint beyond the scaffold defaults.

**What claude-books could do given its different audience**: claude-books' equivalent pedagogical commitments live in PEDAGOGY.md (26-row decision log) but are not lint-enforced. Candidates for promotion to schema:
- **`pedagogy_layer: 1|2|3|4`** (the 4-layer model in PEDAGOGY) — lint warns if absent on chapters
- **`maturity_level: 1|2|3|4|5`** (L1-L5 model already in OUTLINE per-Part declarations) — lint enforces match against Part-level maturity
- **`worked_example_ids: string[]`** — list of `<WorkedExample>` IDs declared in the chapter; lint checks each ID exists in body + is referenced by at least one TL;DR or cheat-sheet for deep-linking
- **`figure_topics: string[]`** — list of figure directory slugs (e.g., `context-budget`); lint checks the SVG exists under `public/figures/<slug>/`

This is appealing but premature. Claude-books has only smoke-test Ch 1 in production schema — pedagogical lint with high opinionation locks in conventions before they've been validated across multiple chapters. Guides has the pilot guide producing real chapters that surface the right shape; claude-books doesn't yet.

**Concrete adoption path** (large, deferred to Phase 1 chapter-rewrite start):
- After 2-3 chapter prose drafts land, audit what frontmatter fields would have caught real issues
- Promote 2-3 highest-value fields to the schema with lint
- Don't try to specify the full pedagogical schema up front — let it emerge

**File references**:
- `~/guides-experimentation/src/content.config.ts` (extension pattern)
- `~/guides/docs/design/2026-05-23_design_v0.3.md` § 2.2 (paradigms validation spec)
- `~/claude-books/handbook/src/content.config.ts` (current minimal extension)

---

## 6. Transfer model + productive-failure framing operationalized

**What guides decided**: design v0.3 § 2.1 commits transfer-over-retention via two concrete moves: (a) **PFL-style assessment** — each chapter ends with a "stretch problem" that introduces a related-but-unseen technique and asks the learner to reason about it using the chapter's tools (~10% of chapter length, costs little, pays off in transfer measurement); (b) **productive failure for hard chapters** — ill-structured problems *before* explicit instruction (per Kapur 2008, empirically validated in 11th-grade kinematics; effect should generalize). Concrete example: chapter 4 (hypothesis testing) opens with a "what would you do?" framing of a real A/B test outcome *before* the formal machinery. The pessimism note: far transfer remains empirically rare; aspire to near-transfer within-domain + medium-transfer to adjacent technical roles, NOT far transfer.

**Why**: per `schwartz2005efficiency`, conventional sequestered problem-solving tests underestimate Preparation for Future Learning. Per `kapur2008productive`, ill-structured-first produces stronger transfer than well-structured-first. These are research-backed pedagogical commitments that bear on chapter shape, not just content.

**What claude-books currently has**: PEDAGOGY.md cites Sweller's worked-example effect, Bruner's spiral, Bjork's desirable difficulties, Mayer's signaling. It does *not* explicitly commit to PFL or "stretch problems" at chapter end. The retrieval-prompts pattern (close the page, answer N questions) is Bjork-style spaced retrieval but applied to recall, not transfer.

**What claude-books could do given its different audience**: claude-books' audience is professional practitioners, not learners taking an exam. The "stretch problem" pattern partially translates — the existing `<TryThis>` at the end of each tutorial PoC is the equivalent shape. But the productive-failure framing is interesting: imagine Ch 5 (Context as Currency) opening with "here's a session that produced bad output; what's the explanation?" *before* the four-commands framework. That's PFL-shaped and would work for the handbook's register.

The handbook should not over-claim transfer effects (the pessimism note applies here too — practitioners do plenty of within-domain near-transfer but rarely far-transfer to unrelated domains). Adopt selectively: PFL-framed openers for chapters where it fits the content; explicit `<TryThis>` extensions that introduce a related-but-unseen pattern (e.g., Ch 5 cheat-sheet's "When to do nothing" row is already a stretch).

**Concrete adoption path** (medium, deferred until chapter v1.0 prose):
- Add a PEDAGOGY decision-log row: "PFL openers for cognitively-heavy chapters (where worked example is too late)"
- During Ch 1, Ch 5, Ch 7, Ch 8 prose drafts, evaluate each for PFL fit; mark `pedagogy_pattern: pfl` in frontmatter if used
- The `<TryThis>` stretch can become the chapter-end pattern even where PFL opener isn't used

**File references**:
- `~/guides/docs/design/2026-05-23_design_v0.3.md` § 2.1 (PFL + productive failure)
- `~/guides-experimentation/src/content/experimentation/01-industrial-narrative.mdx` (Phase 1 chapter showing this pattern in practice)
- `~/claude-books/handbook/PEDAGOGY.md` § "Interleaving rationale" (cites Bjork but not PFL)

---

## 7. Multi-paradigm presentation as a lint rule

**What guides decided**: design v0.3 § 2.2 specifies a closed `paradigms[]` enum: `visual | symbolic | code | prose | tabular | interactive` (extensible per-guide). Per UDL (`cast2018udl`), key concepts must be accessible via ≥2 paradigms — complementarily, not redundantly (per Mayer redundancy principle). Lint warns if <2 paradigms declared OR if a paradigm is declared but absent from chapter body. Mayer's 12 principles constrain combinations (especially: don't present same info in prose + on-screen text simultaneously; prefer narration + visual over text + visual).

**Why**: UDL is a recognized accessibility framework (Universal Design for Learning). The multi-paradigm requirement makes chapters more accessible to varied learners + harder for AI authors to produce single-paradigm filler. The Mayer principles constrain HOW paradigms combine, not just THAT they combine.

**What claude-books currently has**: PEDAGOGY § "Figures + diagrams" commits to the 4-tier figure stack (Mermaid + TikZ + authored SVG + ASCII) which is a multi-paradigm commitment by another name. PEDAGOGY § "Visual presentation principles" cites Paivio dual-coding + Mayer. But no `paradigms[]` schema field; no lint enforcement.

**What claude-books could do given its different audience**: claude-books chapters already tend to use multiple paradigms (prose + code + figure + table) per the figure-after-WorkedExample pattern. Lint-enforcement would catch outliers (a chapter that's all prose, or all code blocks). The enum should match claude-books' artifact mix: `prose | code | figure | table | command-snippet | decision-tree`. Less academic than guides' enum; more practitioner-shaped.

The risk: lint-enforced multi-paradigm can become a checkbox rather than a meaningful constraint. Chapters might declare `paradigms: [prose, code, figure]` perfunctorily even when the figure adds little. The mitigation guides plans (warn if paradigm declared but absent from body) is good; need a way to also warn if a paradigm is *present* but adds no information (much harder to lint).

**Concrete adoption path** (medium, deferred until Phase 1 chapter authoring + after §5 schema decisions land):
- After 3 chapters land, evaluate which paradigms actually appear and which feel forced
- Then propose a `paradigms[]` enum + lint rule, calibrated to what works

**File references**:
- `~/guides/docs/design/2026-05-23_design_v0.3.md` § 2.2 (UDL + Mayer multi-paradigm spec)
- `~/claude-books/handbook/PEDAGOGY.md` § "Visual presentation principles" + § "Figures + diagrams"

---

## 8. Dossier-backed decision provenance

**What guides decided**: design v0.3 cites named dossiers throughout (e.g., `ev_transfer_evaluation_methods_0001` is an evidence ID; `schwartz2005efficiency` is the bibkey). Each dossier lives at `~/guides/docs/research/<topic>/` with the v2.2+ strict-live structure: `bib_ledger.yml` (citations) + `cache_manifest.yml` (PDF SHA-256 cache pointers) + `evidence_ledger.yml` (per-claim evidence IDs) + `claim_graph.jsonl` (provenance graph) + `dashboard.md` (status overview) + `agent_index/` (5-bullet block per primary source). 11 dossiers currently (5 migrated v1-era + 4 new v2.2 pedagogy + 2 content per-guide).

**Why**: design decisions need traceability — *which research backs this claim?* The dossier structure makes that traceable: a claim cites an `evidence_id`; the evidence_id resolves to a `bibkey` + a cached PDF + an agent_index entry that says where in the PDF the supporting passage lives. This is academic-paper-level provenance applied to a learning guide.

**What claude-books currently has**: `docs/research/` (167 notes, 11 topics) — per-source markdown notes with frontmatter (`tier`, `cert_domains`, `volatility`, `verified`) and `[[slug]]` cross-references. Topic-11 pedagogy sub-topics map closely to guides' pedagogy dossiers. But the structure is per-source notes, not the bib_ledger + cache_manifest + evidence_ledger + claim_graph + agent_index 5-artifact structure. PEDAGOGY decision-log cites `[[slug]]` cross-refs but not formal evidence IDs.

**What claude-books could do given its different audience**: claude-books' per-source-markdown convention is *lighter* than guides' v2.2+ strict-live but covers the same need (traceability). For a practitioner reference (vs an academic-leaning learning guide), this lighter weight is appropriate — the reader can follow the citation but doesn't need the academic paper-trail discipline.

Consideration for promotion: the PEDAGOGY decision-log currently uses `[[slug]]` references to research notes. Could be enriched with explicit "evidence" callouts on the highest-stakes decisions (e.g., decision #21 "4-tier figure stack" could cite the specific notes that drove each tier — Mermaid for accessibility per `[[tech-mermaid]]`, etc.). This is partly there already; explicit is better than implicit.

The full guides' dossier structure is over-engineering for claude-books' register. Adopt the *idea* (per-decision evidence trail) without the artifact count.

**Concrete adoption path** (small, opportunistic):
- During PEDAGOGY decision-log updates, when promoting a decision to DECIDED, add an explicit evidence cell with 1-3 `[[slug]]` references for the load-bearing notes
- No new directory structure; no bib_ledger; just denser citation in the decision-log table

**File references**:
- `~/guides/docs/design/2026-05-23_design_v0.3.md` § 5 (verification table mapping sections to evidence)
- `~/guides/docs/research/<topic>/dashboard.md` (sample dossier status doc)
- `~/claude-books/docs/research/11-pedagogy/README.md` (current per-topic README)

---

## 9. Date-prefixed design docs as a superseded chain

**What guides decided**: `~/guides/docs/design/2026-05-23_design_v0.3.md` is the canonical design doc. Filename includes date + version. v0.1 + v0.2 lived in `~/interview_prep_series/docs/plans/active/` (the previous home before the hub repo split); v0.3 is the first design doc native to the new repo. The convention is: each major design pivot gets a new dated file; older files get a supersession note pointing forward.

**Why**: design docs evolve. Append-mostly history in one big file loses the cleanness of "this was the design as of date X." Date-prefixed files + explicit supersession notes preserve the design archaeology, which matters because future readers (including future-you) need to know *when* each commitment was made + *why* it changed.

**What claude-books currently has**: single plan file at `~/.claude/plans/this-repo-is-supposed-buzzing-eclipse.md` with append-mostly history. Active-execution-plan H2 gets replaced each round; previous rounds become Completed sections. Currently 900+ lines covering 5+ planning rounds. The plan file lives in `~/.claude/plans/`, not in-repo, which means contributors can't see it.

**What claude-books could do given its different audience**: the design-doc-in-repo pattern is significantly better than the plan-file-in-Claude-config pattern. Contributors see what was designed; supersession is explicit; the doc is grep-able from the repo. Guides' decision was driven by *moving* design docs into the repo as part of the hub-split — claude-books could do the same shift without the architectural change. Convention to adopt:

- `docs/design/2026-05-24_initial-bootstrap.md` — captures the original scoping decisions (Three-volume series, cert alignment, CC BY 4.0, etc.)
- `docs/design/2026-05-23_visual-pedagogy.md` — captures PEDAGOGY's design (8 principles, 4-tier figure stack, decision log)
- Future design pivots get new files

This is a refactor of the existing planning artifacts (extract from `~/.claude/plans/` and from PEDAGOGY.md into `docs/design/`). Substantial effort but pays back in contributor onboarding + design archaeology.

**Concrete adoption path** (medium, ~2-3 hours):
- Create `~/claude-books/docs/design/` directory
- Extract the "Project roadmap" section from the plan file → `docs/design/2026-05-22_initial-bootstrap.md`
- Extract PEDAGOGY's design rationale → `docs/design/2026-05-23_visual-pedagogy.md` (leave the author-facing rules in PEDAGOGY.md or in the new style guide)
- Future design pivots create new files with supersession notes

**File references**:
- `~/guides/docs/design/2026-05-23_design_v0.3.md` (153 lines, canonical)
- `~/guides/CLAUDE.md` § "Where things live" (canonical pointer)
- `~/claude-books/.claude/plans/this-repo-is-supposed-buzzing-eclipse.md` (current single-file)

---

## 10. Per-phase friction logs committed in-repo

**What guides decided**: `~/guides/docs/plans/done/*.md` contains 10 wrap-up docs as of 2026-05-24, one per completed phase. Each wrap-up captures: acceptance gates met, filed issues, friction + surprises (e.g., "version jump from caret resolution surprised us — 2 of 7 just-filed issues were already silently fixed"), open follow-ups, handoff hook. Each ~50-100 lines. Committed to the repo.

**Why**: phases are the unit of execution; a phase that ships without a wrap-up loses the lessons. The wrap-up format makes the friction visible to future-you + contributors: "we hit X friction; here's how we mitigated; here's the upstream issue we filed." Guides' wrap-ups have driven concrete upstream actions (every wrap-up names which scaffold issues were filed during that phase).

**What claude-books currently has**: no `docs/plans/done/` directory. The closest analog is the BURN_IN_NOTES in the research_toolkit repo, which has accumulated 11 entries across two rounds of consumer feedback. Plan-file completed sections capture some friction in compact form. No per-phase wrap-up convention.

**What claude-books could do given its different audience**: claude-books' rounds map directly to guides' phases. Each commit-cluster I've shipped (visual-pedagogy research, Part II PoC round, scaffold v4 migration, TikZ practice, this recon round) corresponds to a guides-style phase. Adopting the wrap-up convention would mean a 50-line doc per round at `docs/plans/done/<date>_<phase-name>_wrap_up.md`.

The trade: friction logs are highest-value when phases are well-defined and ship distinct artifacts. Claude-books' rounds so far meet that criterion. The cost is the ~10 minutes of wrap-up writing per round, vs the benefit of preserving the friction.

**Concrete adoption path** (small + ongoing):
- Create `~/claude-books/docs/plans/done/` directory
- Backfill 5 wrap-ups for shipped rounds (compact, ~30 lines each): visual-pedagogy round, Part II PoC round, scaffold v4 migration, TikZ practice round, this recon round
- Going forward: write a wrap-up at the end of each round before moving to the next

**File references**:
- `~/guides/docs/plans/done/2026-05-22_phase_a0_scaffold_preflight_wrap_up.md` (60 lines — canonical wrap-up shape)
- `~/guides/docs/plans/done/2026-05-24_scaffold_v4_migration_wrap_up.md` (parallel to claude-books' own scaffold v4 migration which has no wrap-up)
- `~/guides/CLAUDE.md` § "Where things live" (lists wrap-ups as part of canonical resume path)

---

## 11. Session-handoff doc as the resume entry point

**What guides decided**: `~/guides/docs/plans/active/2026-05-24_session_handoff.md` is the file a fresh session reads first. Guides' CLAUDE.md says explicitly: *"Active session handoff (read first if resuming): docs/plans/active/2026-05-24_session_handoff.md."* The handoff is dated; gets replaced when a new session starts.

**Why**: between sessions, context is lost. The handoff doc compresses "where we are + what's blocked + what to do next" into one file. Replaces the conversation-continuity pattern that's brittle across days / weeks / context resets.

**What claude-books currently has**: relies on conversation continuity within a session + the plan file's "Active execution plan" section for cross-session continuity. The plan file is at `~/.claude/plans/` (not in-repo), so contributors can't see it. No equivalent "read this first" pointer.

**What claude-books could do given its different audience**: the value of a session-handoff depends on session frequency and gap length. Claude-books has been worked on intensively for ~3 days straight; the friction of "where were we?" is low because the rounds chain in conversation memory. Once work becomes more episodic (weekly chapters, monthly reviews), the handoff doc becomes valuable.

This is a pattern to adopt *when* the work cadence changes, not immediately. Premature adoption produces a handoff doc that's always already stale.

**Concrete adoption path** (defer until work cadence becomes episodic):
- When the first multi-week gap between sessions is anticipated (e.g., before chapter v1.0 prose drafting starts), create `docs/plans/active/<date>_session_handoff.md`
- Include: current status / what's blocked / next 3 actions / open decisions / file-paths to read first

**File references**:
- `~/guides/docs/plans/active/2026-05-24_session_handoff.md` (current handoff)
- `~/guides/CLAUDE.md` line 7 (canonical pointer to handoff doc)

---

## 12. GitHub Actions workflows for build + content validation

**What guides decided**: 4 workflows at `~/guides/.github/workflows/`: `astro-build.yml` (build site on push/PR, upload dist artifact for 7 days, Node 22, `BOOK_PRESET: research-portfolio` env), `content-validate.yml` (run `npx book-scaffold validate --preset research-portfolio` on content changes), `capstone-test.yml` (capstone Python tests), `companion-test.yml` (companion Python tests). The path-filter on `paths:` means workflows only run when relevant files change — cheap on CI minutes.

**Why**: validation catches regressions before merge. Build verification catches "this MDX edit broke the build" before deploy. The PRESET env var pattern (not relying on `.env` file which Pages doesn't auto-load) was learned the hard way per guides' Phase A.0 wrap-up.

**What claude-books currently has**: no `.github/workflows/` directory. Build verification happens manually (`npm run build`) at commit time. The lint + crossref scripts at `docs/research/.lint.py` + `.crossref.py` are run manually. Risk: a contributor PR that doesn't run these locally ships a broken build to main.

**What claude-books could do given its different audience**: claude-books doesn't deploy yet (per project roadmap, v1.0 deploy is Phase 1.5). So the build workflow's deploy-blocker value isn't relevant until deploy is set up. But the regression-catching value is real today — every PoC sprint has shipped multiple commits that could have broken builds.

Two workflows are appropriate (matching guides' `astro-build.yml` + `content-validate.yml`):
- `astro-build.yml` — Node 22 + `BOOK_PRESET: tools` + `npm run build` on `src/**`, `astro.config.mjs`, `package.json` changes
- `content-validate.yml` — `book-scaffold validate --preset tools` on `src/content/**`, `src/content.config.ts` changes
- Plus a claude-books-specific `research-lint.yml` — run `python3 docs/research/.lint.py` + `.crossref.py` on `docs/research/**` changes

The companion-test + capstone-test workflows don't apply (no companion package, no capstone artifact in claude-books' model).

**Concrete adoption path** (medium, ~45 min):
- Create `.github/workflows/astro-build.yml` (adapt guides' file)
- Create `.github/workflows/content-validate.yml` (adapt)
- Create `.github/workflows/research-lint.yml` (new, claude-books-specific)
- Test by pushing a deliberate violation in a feature branch

**File references**:
- `~/guides/.github/workflows/astro-build.yml` (39 lines)
- `~/guides/.github/workflows/content-validate.yml` (27 lines)
- `~/guides/docs/plans/done/2026-05-22_phase_a0_scaffold_preflight_wrap_up.md` (mentions Node 22 + BOOK_PRESET friction)

---

## 13. Hub + sibling-repos architecture for multi-volume

> **RESOLVED (2026-06-08).** Single-repo workspace is final — all three books shipped in this one repo,
> so Path A won by default. Path B (hub + sibling repos) is **not adopted**. Per-book extraction stays
> available on a real trigger, documented in each book's `SPLIT.md` (currently
> `agentic-systems-design/SPLIT.md`). The analysis below is preserved as the original 2026-05-24 recon.

**What guides decided**: hub at `~/guides/` owns: landing page + `/methodology` + `/about` + design docs + shared styles (`shared/styles/guides-family.ts`) + pedagogy dossiers (cross-cutting). Per-guide content lives in **sibling repos** (`~/guides-experimentation/` for the pilot; future guides like `~/guides-prompt-injection/` follow the same shape). Each sibling: own `wrangler.toml` (Pages), own CLAUDE.md, own AUTHORS.md, own `content.config.ts` (extends scaffold), own `.github/workflows/`, own bibliography. Deploys to a subroute (`/experimentation/`, `/prompt-injection/`). Both hub + siblings depend on `@brandon_m_behring/book-scaffold-astro` + the shared `guidesFamilyStyle` (currently duplicated inline at the sibling; to extract to npm package when 2nd guide arrives).

**Why**: independent release cadence per guide (each guide ships when its content + companion + capstone are ready, not gated by sibling progress). Per-guide companion Python packages cleanly isolated. Sibling repo authors don't see each other's WIP. ADR + design archaeology per guide. Stable URLs per guide subroute.

**What claude-books currently has**: single repo at `~/claude-books/` with planned workspace members: `handbook/`, `architect-reference/`, `field-guide/`, `glossary/`, possibly `examples/`. Currently only `handbook/` exists. Plan is for all to live under one repo as workspace members.

**What claude-books could do given its different audience**: this is the most significant pre-decision in the recon. Two paths:

**Path A — Stay with workspace members (current plan)**: each volume is a workspace member under one repo. Shared package.json + node_modules + lockfile. Versioning the whole repo or per-volume via git tags scoped per volume (`handbook-v1.0.0`). One CI workflow handles all volumes. Pros: lower overhead; simpler CI; cross-volume references resolve as relative paths. Cons: when architect-reference + field-guide land, the repo gets bigger; release coordination is heavier; per-volume contributor visibility is muddier.

**Path B — Adopt hub+sibling (guides pattern)**: split into `~/claude-books-hub/` (landing + methodology + about + roadmap + research cache + glossary) + `~/claude-books-handbook/` + `~/claude-books-architect-reference/` + `~/claude-books-field-guide/`. Each sibling has its own CI, deploy, etc. Pros: independent release cadence; cleaner per-volume contributor view; matches guides' proven pattern. Cons: cross-repo references break; the research cache + scaffold-gaps + cert-coverage docs need a clear home (probably the hub); migration cost is real.

The decision doesn't need to happen now (only the handbook is in flight). The roadmap note (added during this round's plan-mode phase) flags this as a Phase 2 Step 3 bootstrap decision — when Architect's Reference begins, that's when the architecture choice gets made. The guides recon means it'll get made *informed* rather than by default.

**Concrete adoption path** (deferred to Phase 2 Step 3):
- Before Architect's Reference scaffolding starts, write a short ADR comparing Path A vs Path B with the criteria
- Try Path A first (less risky); migrate to Path B if friction hits

**File references**:
- `~/guides/README.md` (hub overview)
- `~/guides-experimentation/CLAUDE.md` (sibling shape)
- `~/guides/shared/styles/guides-family.ts` (shared style composition, currently inline-duplicated in sibling pending npm extraction)
- This file's roadmap note in `~/.claude/plans/this-repo-is-supposed-buzzing-eclipse.md` § "Phase 2 — Architect's Reference"

---

## Reverse view — what claude-books does well that guides doesn't

This section catalogs claude-books innovations *not* present in guides. The point isn't competitive — it's preserving the load-bearing choices that should *not* be wholesale replaced by guides' patterns.

**Living comparative-PoC document** — `~/claude-books/handbook/poc/COMPARISON.md` is a multi-round living memo (Round 1: Ch 1 × 5 formats; Round 2: Ch 5-8 × 4 formats + Part II summary; Round 3: TikZ + v4 components across 5 chapters). Each round adds a section; the file grows. Guides has design docs (frozen at a version) and friction logs (per-phase); it doesn't have a *living* analysis doc that accretes cross-round observations. The COMPARISON.md format is purpose-built for the visual-design-experiment workflow claude-books has been running.

**4-tier figure stack with explicit per-figure decision tree** — PEDAGOGY's "Figures + diagrams" section commits to Mermaid (default) + TikZ (inherited) + authored SVG (hero) + ASCII (cheat-sheet) with a per-figure decision flowchart. Guides has no equivalent figure-strategy doc — its figures decisions are implicit per-chapter. The decision tree means new figures don't relitigate the choice.

**Hand-authored TikZ recipe library** — `~/claude-books/handbook/figures/NOTES.md` documents 4 figure recipes with technique observations + cross-figure patterns + open questions. Intended for upstream promotion to scaffold's `recipes/16-tikz-figures.md`. Guides hasn't authored its own TikZ figures (it uses primarily Mermaid + Jupyter-exported plots for `experimentation`); no recipe library exists there. The handbook's recipe library is the claude-books-specific innovation.

**Per-PoC-kind layout system** — `<PocLayout kind="...">` shipped in scaffold v4.1.0 (per claude-books-filed issue #56). Guides hasn't needed it (single content register — chapters); claude-books drove the upstream pattern that other consumers will benefit from. The 5 PoC kinds (tutorial / how-to / TL;DR / part-summary / cheat-sheet) with per-kind CSS-variable swap is claude-books' contribution to the scaffold's component vocabulary.

**5×4-format PoC experiment as a deliberate visual-comparison exercise** — running the same chapter content through 4 supplement formats (tutorial / how-to / TL;DR / cheat-sheet) for 5 chapters yields ~20 directly-comparable artifacts. Guides hasn't run this experiment (each guide chapter has one canonical form). The experiment surfaced concrete findings (worked examples are the spine of every tutorial; the tutorial-vs-cheat-sheet visual distinction holds across content registers) that wouldn't have been visible without the cross-format comparison.

**11-pedagogy research sub-topic with 47 source notes** — `~/claude-books/docs/research/11-pedagogy/` has 5 sub-areas (doc-UX patterns / info-design / multimedia learning / handbook-genre / figure tech) totaling 47 notes. Guides has 11 dossiers (richer per-dossier structure) but they're focused on pedagogy meta-theory (transfer, multi-paradigm, LLM-as-coach, capstone). The handbook's 47-note breadth across doc-UX *production sites* (14 site analyses!) is broader than guides' deep-on-theory dossiers. Different shape, different value.

**Lint relaxation for pedagogy-topic per-area templates** — the local `.lint.py` exempts pedagogy-topic notes from the flat "Key takeaways" requirement because their per-area template is structurally richer. Reduced lint failures 70 → 23 without losing meaning. Guides' lint is upstream-scaffold-based; claude-books' local relaxation pattern is novel.

**Decision-log with explicit DECIDED / SHIPPED / ADOPTED state tracking** — PEDAGOGY decision-log uses three states (DECIDED = locally locked; SHIPPED = scaffold-side component available; ADOPTED = in-use in real content). Guides' design docs use binary committed-vs-deferred state. The three-state pattern captures the claude-books-specific reality that some decisions depend on upstream scaffold work landing before adoption can happen.

These innovations should be preserved. Where a guides pattern would replace one of these, the guides pattern needs a strong case (the innovations exist because they're load-bearing for claude-books' specific work).

---

## Summary: recommended adoption priorities

| Priority | Category (§) | Effort | Why this rank |
|---|---|---|---|
| **P0** | §1 License split | ~15 min | Smallest + clearest gap; risk-free |
| **P0** | §2 AUTHORS.md | ~20 min | Most important for claude-books' audience (handbook *about* Claude, written *with* Claude) |
| **P0** | §3 CONTRIBUTING.md | ~25 min | Documents upstream-issue policy that's already in practice |
| **P1** | §12 GitHub Actions | ~45 min | Catches regressions; no deploy dependency; high durable value |
| **P1** | §10 Friction-log convention | ~30 min initial + ongoing | Backfill 5 wrap-ups for shipped rounds; adopt going forward |
| **P1** | §9 Date-prefixed design docs | ~2-3 hours | Refactor existing design content out of `.claude/plans/` and PEDAGOGY into `docs/design/` |
| **P2** | §4 Style guide | ~2 hours | After Ch 1 v1.0 prose lands; rules emerge from real authoring |
| **P2** | §8 Dossier evidence citations | Opportunistic | Layer onto decision-log updates; no new structure |
| **P2** | §6 PFL framing | Opportunistic | Apply where it fits during chapter prose; no immediate change |
| **P2** | §11 Session handoff | When cadence changes | Adopt when episodic work begins; premature now |
| **P3** | §5 Zod schema extensions | After 2-3 chapters land | Let schema emerge from real frontmatter use |
| **P3** | §7 Multi-paradigm lint | After §5 schema decisions | Builds on §5 |
| **P3** | §13 Hub+sibling architecture | At Architect's Reference bootstrap | Already flagged in roadmap; decision happens at Phase 2 Step 3 |

Where:
- **P0** = adopt next round (foundational, small, no dependencies)
- **P1** = adopt when next chapter prose round lands (or before, if a multi-week gap looms)
- **P2** = adopt after the first chapter v1.0 prose ships (rules emerge from real authoring; schemas calibrate to reality)
- **P3** = adopt at Phase 2 / Architect's Reference bootstrap (depends on multi-volume reality)

Three P0 items together (~1 hour total) would close the most-visible gaps. The three P1 items together (~4 hours) would close the documentation + regression-catching gaps. The P2 + P3 items wait for natural phase boundaries.

This memo is the input. Per-category adoption decisions stay with the user.

---

## Provenance

- Recon agent dispatched 2026-05-24; identified 13 categories.
- Verification reads of 12 guides files for concrete citations.
- Memo written 2026-05-24; one pass, ~5000 words.
- Plan file: `~/.claude/plans/this-repo-is-supposed-buzzing-eclipse.md` § "Active execution plan: deep guides-repo comparative recon" (approved 2026-05-24).
- Roadmap note added in plan file's Phase 2 entry (hub+sibling architecture flag).

---

## 2026-06-08 recon refresh

A re-audit (2026-06-08) against the current repo + the wider `~/*guide*` fleet:

**The 13-category memo is essentially spent.** Since 2026-05-24 claude-books has adopted the P0–P3
recommendations: §1 license split (`LICENSE-SCRIPTS`), §2 `AUTHORS.md`, §3 `CONTRIBUTING.md`, §4
`handbook/docs/style-guide.md`, §9 `docs/design/` dated chain, §10 `docs/plans/done/` friction logs,
§11 `docs/plans/active/` session handoffs, §12 `.github/workflows/` (astro-build + content-validate +
research-lint). §13 (hub+sibling) is **resolved** above (single-repo final). The only unadopted items —
§5 Zod pedagogical lint, §6 PFL framing, §7 multi-paradigm lint — are the ones the memo itself defers
until real chapter prose exists; they stay deferred.

**New ideas surfaced (from `guides-manning`, a 60+ guide fleet that postdates the memo) — logged, not
adopted.** Most are **fleet-scale machinery**, premature for a single-trunk 3-book repo; recorded here
with adoption triggers (anti-over-engineering — machinery on a real trigger):

| Idea (where) | Trigger to revisit |
|---|---|
| Fleet QA + health dashboards (`scripts/fleet/`, `guide_qa.yaml`, Bronze-gate CI) | A 2nd+ volume in active authoring, or per-chapter health worth tracking |
| Universal standards tree + per-family overlays (`tooling/standards/00_universal/` + overlays) | When ≥2 books need shared-but-overridable conventions |
| Symlink Makefile inheritance across books | ≥2 books with real shared QA targets |
| Pre-commit validation hook (cross-ref / dead-anchor / build) | When rapid drafting starts shipping regressions to `main` |
| `.claude/` skills + commands (validate-chapter, new-chapter scaffolder) | Cheap — revisit on real authoring friction |
| "Agent navigation" index (canonical where-do-I-find-X table) | Cheap — partly covered by ROADMAP's Authority map; revisit if fragmentation bites |

Already present in claude-books (no action): pagefind search; the CI workflows; license split; `AUTHORS.md`.
