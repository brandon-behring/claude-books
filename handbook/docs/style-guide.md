# Style Guide v0.0 — handbook author rules

**Status**: Draft, pre-pilot. Each rule below is marked `keep` / `change` / `drop` per the rule's status relative to the LaTeX-era source.
**Source**: Ported from `~/claude-best-practices/scripts/lint_*.py` (the LaTeX-era enforcement scripts) and synthesized with PEDAGOGY decisions.
**Lifecycle**: v0.0 → v0.1 (refined after Ch 1 v1.0 prose lands) → v1.0 (after Part I complete + 2 chapters of Part II shipped).
**Companion docs**:
- [`PEDAGOGY.md`](../PEDAGOGY.md) — *what we decided* + visual conventions + decision-log (this style guide is the author-facing derivative)
- [`../../docs/design/2026-05-23_visual-pedagogy.md`](../../docs/design/2026-05-23_visual-pedagogy.md) — *why we decided* (theoretical rationale)

## How to read this

Each section corresponds to one rule family. Each section has:

- **Status**: `keep` (rule applies to MDX as-is), `change` (rule applies but mechanism differs), `drop` (LaTeX-specific or superseded)
- **Source**: pointer to the original LaTeX rule + the PEDAGOGY decision-log row that codifies it
- **MDX adaptation** (when `change`): how the rule translates from LaTeX to MDX + scaffold component vocabulary
- **Phase 1 deferred**: items requiring chapter-prose evidence before locking

## 1. Margin notes — `keep`

**Source**: `~/claude-best-practices/scripts/lint_margin_notes.py` (LaTeX-era enforcement); PEDAGOGY decision #5 (8-category margin-note system).

The 7-category allowlist carries over from the LaTeX-era enforcement (`Official / Tip / Warning / Cost / Enterprise / Template / Note`). PEDAGOGY decision #5 references an 8-category system; the 8th (`Vocab` / `Cross-Ref`) is conceptual — currently rendered via different scaffold components (`<TermDef>` for Vocab when glossary lands; `<XRef>` for Cross-Ref). For pure margin notes, the allowlist is the 7-category LaTeX-era set.

Mechanism switches from `\marginnote[Category]{text}` to:

```mdx
<MarginNote variant="warning" label="Warning">
  Pre-1M context: degradation begins around 60-70% fill.
</MarginNote>
```

Quality rules unchanged from LaTeX-era:
- **25-word body cap** (enforced; the v4.1.0 scaffold's lint-validator hook is the long-term enforcement; manual count for now)
- One idea per note
- Actionable (reader can do something with the info)
- Consistent category (don't tag a `Warning` note as `Tip`)
- 4-group color routing: Danger (Warning) / Action (Tip / Template) / Navigate (Cross-Ref via `<XRef>`) / Signal (Official / Cost / Enterprise)

Plus the v4.1.0 pedagogy family (separate from margin notes — these are full-width callouts, not marginalia):
- `<YouWillLearn prerequisites="...">` — chapter-opener; gold border
- `<WorkedExample id="..." title="...">` — collapsible demonstration; plum border; `#worked-example-{id}` anchor
- `<Pitfall title="...">` — retrospective "common mistake"; crimson border

**Phase 1 deferred**: density targets (1-2 per section foundations, 2-3 per section core methods — recalibrate for MDX chapter shape vs LaTeX chapter sections). Margin-note vs. inline-callout choice criteria — when is the same content better as a `<KeyIdea>` vs a `<MarginNote variant="tip">`?

## 2. Content quality — `keep`

**Source**: PEDAGOGY decision #11 (8 visual presentation principles, especially #6 "diagram-or-example rule").

The seven-condition margin-note test from LaTeX-era applies to MDX margin notes:
1. **Supplementary** — not load-bearing for the main argument
2. **Non-redundant** — not just restating the adjacent prose
3. **Not seductive** — doesn't pull attention away from the main flow
4. **Atomic** — one self-contained idea
5. **Category-tagged** — the variant + label match the content register
6. **Actionable** — reader can act on it (or know to seek deeper)
7. **Density-controlled** — see Phase 1 deferred above

Key-concept boxes use the scaffold's `<KeyIdea>` component (NOT `\begin{keyconcept}`); the "interviewer test" rule (would a careful reader notice if you removed this?) applies unchanged.

Section-level discipline (from PEDAGOGY decision #11 visual principles):
- ≤4-5 bullets per list (Miller 7±2 cap)
- ≤5 boxes per architecture diagram (per the figures-section node-cap)
- ≤30 words per sentence
- ≤3 new concepts per section

**Phase 1 deferred**: quality dashboard targets (KeyIdea-per-chapter / margin-notes-per-chapter / pitfall-per-chapter density). Lint-enforced or guidance-only?

## 3. Citation quality — `change`

**Source**: LaTeX-era used BiBLaTeX + `\cite{}`/`\textcite{}`. MDX-era uses YAML sources manifest + scaffold's citation components. PEDAGOGY adds source-tag attribution per decision #4.

**MDX adaptation — two citation mechanisms; the handbook (tools profile) uses the first**:
- **`<Citation src="id" />`** — resolves an entry in `handbook/sources/manifest.yaml` (the `sources` content collection, which auto-registers once the manifest is non-empty). Renders as a margin sidenote with a tier badge by default, or inline via `as="inline"`. This is the tools-profile mechanism and the handbook standard. LaTeX `\cite{key}` → `<Citation src="id" />`; `\textcite{key}` → `<Citation src="id" as="inline" />`.
- **`<Cite key="..." />`** — the academic CSL path: resolves `src/data/references.json`, which `npm run build:bib` builds from a BibTeX `.bib` file (`bibliography.bib`). The handbook ships no `.bib`, so `<Cite>` is unused here and an unknown key fails the build. Reserved for academic-profile volumes.
- LaTeX `\footcite{key}` → MDX `<MarginNote variant="note">` containing the source link (no direct footcite equivalent).
- Inline practice tags from LaTeX (`\official{}` / `\practitioner{}` / `\convergence{}`) → MDX `<Tag kind="official|practitioner|convergence">claim</Tag>` (per scaffold v4.1.0 `<Tag>` component)

Practice-tag enforcement from `~/claude-best-practices/scripts/lint_practice_tags.py`:
- Practice tags must NOT nest (a `<Tag>` inside another `<Tag>` is almost always an accidental double-wrap)
- Per-chapter counts of each tag worth tracking (a chapter with zero practice tags is suspicious; a chapter with 50 is exhausting)

T1/T2/T3 evidence tier system (from research cache convention):
- **T1-official** — Anthropic-authored docs, spec material, official engineering blog posts; cite via `<Tag kind="official">claim</Tag>` + URL in `manifest.yaml`
- **T2-release-notes** — Anthropic Academy, GitHub release notes; cite via `<Tag kind="official">` (still official, but less spec-grade)
- **T3-practitioner** — observed-in-the-wild from real teams; cite via `<Tag kind="practitioner">`
- **Convergence** — when multiple T1+ sources agree; cite via `<Tag kind="convergence">`

**Phase 1 deferred**: dangling-reference audit script for MDX (the LaTeX-era `audit_citation_quality.py` doesn't port directly; scaffold-side or in-repo Python equivalent). 90% bibkey match-rate target carries over but needs MDX-side enforcement.

## 4. Evidence standards — `keep`

**Source**: LaTeX-era tier-1 (must-cite) + tier-2 (should-cite) rules. PEDAGOGY decision #4 (source-tag attribution) reinforces.

**Tier 1 — must-cite**:
- Specific percentages ("60% of context-window degradation begins")
- Named author/year claims
- Company / product practice claims ("Anthropic Academy does X")
- Multiplier claims ("3x faster")

**Tier 2 — should-cite**:
- Soft quantifiers ("most teams")
- Causal claims ("X leads to Y")
- Comparative claims ("X is better than Y for this use case")
- Research attribution (named theory: Sweller, Bjork, Mayer, etc.)

**Citation proximity**: within 10 lines of the claim.

**Suppression mechanism** (different from LaTeX): use `volatility: fast-moving` + `last_updated` frontmatter for claims that are time-sensitive — the staleness banner handles the disclosure.

**Phase 1 deferred**: tier-1 audit script port (LaTeX had `audit_evidence_standards.py`; MDX equivalent TBD). Per-section evidence-density target (Tier 1 + Tier 2 combined: 2-4 cites per section foundations chapter; 3-6 per section advanced).

## 5. Cross-reference quality — `keep`

**Source**: PEDAGOGY conventions; scaffold's `<XRef>` component.

Cross-ref format pattern (within-handbook):
- Format: `<XRef id="ch5-context-clear">/clear command</XRef>` (resolves via `src/data/labels.json` built by `npm run build:labels`)
- Validation rules: label exists in target file, chapter exists, no self-references

Cross-volume (future):
- `<XRef book="architect-reference" id="d2-mcp-config" />`
- `<XRef book="field-guide" id="ch4-monorepo-pattern" />`

Semantic-anchor convention (kebab-case immutable): if a chapter is renumbered, the anchor stays. Avoid auto-generated heading anchors for cross-references; use explicit `id="..."` props on labeled components (`<KeyIdea id="...">`, `<WorkedExample id="...">`, `<Figure id="...">`).

**Phase 1 deferred**: stable-anchor validation script — confirm semantic-anchor immutability + within-link existence at build time (scaffold validator extension).

## 6. Term consistency — `keep`

**Source**: LaTeX-era term-consistency rule + PEDAGOGY decision #5 (Vocab margin-note category will become `<TermDef>` when glossary lands).

Rules (from LaTeX-era):
- **Within-book duplicate tolerance**: 0 (don't define the same term twice in different ways)
- **Cross-book inconsistency threshold**: Jaccard < 0.5 between competing definitions when glossary lands (i.e., if Handbook defines a term and Architect's Ref defines it differently, the differences should be ≥50% lexically distinct — if they're 90% the same, pick one definition)
- **Canonical form rule**: one authoritative definition per term, in the glossary; chapters cite via `<Term id="...">`

**MDX adaptation**:
- LaTeX: `\term{CUPED}{Controlled-experiment Using Pre-Experiment Data...}` (no equivalent in claude-books LaTeX source; the convention came from the LaTeX rule)
- MDX option 1: standard markdown definition list (`Term\n: definition`)
- MDX option 2: scaffold-component `<TermDef name="..." expansion="...">` (Phase 0.7 deferred)
- MDX option 3: glossary workspace member with `<Term id="...">` references (Phase 1.5 / when glossary bootstraps)

**Phase 1 decision**: pick option at first chapter that introduces ≥3 new terms.

## 7. Cert-domain mapping — `change` (replaces guides' LOS standards)

**Source**: PEDAGOGY decisions tied to `cert_domains` frontmatter + `docs/cert-coverage.md` matrix.

Every chapter declares `cert_domains: [int subset of 1..5]` in frontmatter. Chapter must cover at least one cert task area for each declared domain.

Cert domains (CCA-F):
- D1 — Agentic Architecture & Orchestration (27%)
- D2 — Tool Design & MCP Integration (18%)
- D3 — Claude Code Configuration & Workflows (20%)
- D4 — Prompt Engineering (20%)
- D5 — Context Management (15%)

Coverage matrix: `~/claude-books/docs/cert-coverage.md` tracks chapter × domain × task-area.

LaTeX-era LOS standards (`PREFIX-CHAPTER.NUMBER` naming with Bloom verb) are NOT ported — claude-books uses the cert-task-area mapping instead. Bloom verbs may surface in PEDAGOGY decision #1 (spiral-curriculum verb progression) but are not first-class metadata.

**Phase 1 deferred**: per-chapter cert-task-area declaration in frontmatter (currently lives in `docs/cert-coverage.md` only; could promote to chapter-level for lint-enforced coverage).

## 8. Code quality — `keep`

**Source**: LaTeX-era code-quality rules; scaffold's Shiki integration.

Rules:
- **Shiki-highlighted** by default (scaffold provides via Astro's built-in Shiki)
- **Language tag mandatory** — never use plain ` ``` ` without a language identifier
- **Line numbers** on diff-style examples (`diff` language) and any code > 15 lines
- **Runnable vs illustrative** — runnable snippets clearly marked (e.g., `python title="run me"`); illustrative snippets use a different visual treatment (e.g., italic prose framing)
- **Length**: prefer 5-15 lines per block; longer blocks should be in `<details>` collapse OR linked to a companion file

**Phase 1 deferred**: companion file convention (e.g., `handbook/examples/<chapter>/<snippet>.py` for long runnable snippets). Auto-test-on-build for runnable snippets (Phase 1.5+ when example infrastructure exists).

## 9. Content freshness — `change`

**Source**: PEDAGOGY decisions #11 (volatility metadata) + #12 (visual-separation conventions, which include staleness banner).

**Required frontmatter** (per chapter):
- `volatility: stable-principle | architectural-pattern | feature-surface | fast-moving`
- `last_updated: YYYY-MM-DD` (ISO format, no time component)
- `introduced_in_version: <semver>` (e.g., `"1.0.0"`)

**Volatility scale** (from `docs/cert-coverage.md` conventions):
- `stable-principle` — engineering principles, mental models, named patterns; rarely change
- `architectural-pattern` — agentic architectures, MCP design patterns; change with major Anthropic releases
- `feature-surface` — specific tools, commands, settings; change with minor Anthropic releases
- `fast-moving` — pricing, model versions, cert evolution, plugin ecosystem; change monthly+

**Staleness banner trigger**: `volatility !== "stable-principle"` AND `last_updated > 90 days`. Scaffold renders the banner automatically.

**MDX adaptation**:
- LaTeX-era used `\lastupdated{2026-05-23}` + manual banner; MDX uses frontmatter + scaffold-auto-banner
- Chapter 15 (Enterprise Deployment) is the canonical `fast-moving` example because of pricing/cert/auth changes

**Phase 1 deferred**: CI check that fails the build for content > 90 days stale + `volatility: fast-moving` (per recon §12 follow-up). The `research-lint.yml` workflow (shipped in Commit 2 of this round) handles research-cache freshness; chapter-level freshness lint is the next extension.

## Provenance

- 2026-05-24: extracted from PEDAGOGY decisions + LaTeX-era lint scripts (`~/claude-best-practices/scripts/lint_*.py`) during the Bundle D guides-recon-action round.
- Adapts the structure of `~/guides/docs/style-guide-v0.0.md` (interview-prep audience) to claude-books' practitioner-reference audience.
- Author rules + lint enforcement should converge: every section's "Phase 1 deferred" items become enforcement-script work in later rounds.
