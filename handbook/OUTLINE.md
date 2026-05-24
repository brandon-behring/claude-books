# Handbook — v3.0 outline

The handbook's lens: **how to *use* Claude effectively day-to-day.** Architectural design (Agent SDK loop internals, MCP server design, multi-agent pipeline architecture, structured-output JSON schema design) is **not** in this book — it lives in the upcoming Architect's Reference. Cross-references go via `<XRef book="architect-reference" id="..."/>`.

**Cert-domain primary ownership** (handbook is primary for Domain 3; cross-cuts into 4 + 5):
- D3 — Claude Code Configuration & Workflows (20%) ← primary
- D4 — Prompt Engineering & Structured Output (20%) ← prompting basics; advanced/structured output goes to architect-reference
- D5 — Context Management & Reliability (15%) ← shared cross-cut

**Structure**: 1 landing page + 15 chapters across 4 parts + 3 appendices.

**Status convention** (for tracking through the rewrite):
- ⬜ not started
- 🟡 outlined (this doc)
- 🟢 in rewrite
- ✅ shipped in v1.0

All entries below are currently 🟡.

---

## Landing page

**From**: `00_preamble.tex` (89 lines).
**Not a chapter** — converts to interactive entry point at `/`:
- Reader-profile router ("new to Claude Code" / "already configured" / "team lead" / "enterprise decision-maker") → suggests starting chapter
- Two-source label legend (Official / Practitioner / Convergence) as a callout style demo
- Spiral-structure concept map (interactive SVG) showing how chapters revisit concepts at deeper levels

**MDX components used**: `<Tag>`, `<MarginNote>`, custom landing-page route in `src/pages/index.astro`.

---

## Part I — Foundations (read in order)

### Ch 1. Principles & Mental Model
**Source**: `01_principles.tex` (202 lines) → target ~250 lines MDX.
**Theme**: Agent loop, finite context, tool use, configuration layers. Four engineering principles.
**Cert domains**: D1 (agent architecture concept), D4 (fail-fast).
**Stale signals**: None. Mental-model content is durable.
**MDX-native**:
- Agent-loop diagram — per [PEDAGOGY.md § Figures + diagrams](./PEDAGOGY.md#figures--diagrams) this is a **Tier 2 (TikZ→SVG inherited)** diagram since the source repo already has it. The `<BeforeAfter>` and `<InsightBox>` usage below follow the visual conventions in PEDAGOGY.md.
- `<BeforeAfter>` for "chatbot mindset" vs "agent mindset" prompt examples
- `<InsightBox>` for "Why the Mental Model Matters"
**Pedagogy + visual conventions**: see [`PEDAGOGY.md`](./PEDAGOGY.md) — applies to every chapter in this outline, but Ch 1 is the canonical first application.
**PoC artifacts** (2026-05-23): five supplement-format prototypes of Ch 1's material live at [`src/content/poc/`](./src/content/poc/) and render at `/poc` in dev. They demonstrate tutorial / how-to / TL;DR / part-summary / cheat-sheet shapes side-by-side. See [`poc/COMPARISON.md`](./poc/COMPARISON.md) for the synthesis memo. Ch 1 prose-rewrite is **blocked on user review of these PoCs** (PEDAGOGY decision-log #7 OPEN: supplement-format adoption).
**Rewrites needed**: The existing `ch01-principles.mdx` (smoke test) is a starting draft only — re-do per these conventions with `cert_domains: [1, 4]` frontmatter and new `last_updated`/`introduced_in_version` fields.

### Ch 2. Your First CLAUDE.md
**Source**: `02_first_claude_md.tex` (195 lines) → ~220 lines.
**Theme**: What to include / exclude in a starter CLAUDE.md; deny rules; `/init`.
**Cert domains**: D3 (central), D5 (hierarchical loading).
**Stale signals**: None.
**MDX-native**: Tabbed "what to include" / "what to exclude" panel. Interactive "starter CLAUDE.md" generator (later post-v1.0).

### Ch 3. Your First Session
**Source**: `03_first_session.tex` (304 lines) → ~280 lines.
**Theme**: Session loop. Three prompting basics. Context hygiene. Plan Mode. Course correction (Esc, `/rewind`).
**Cert domains**: D3, D4, D5.
**Stale signals**: Some keyboard shortcuts may shift; permission-mode names have evolved — verify on rewrite.
**MDX-native**: Expandable session-loop diagram. Worked example with annotations.

### Ch 4. Working Productively
**Source**: `04_prompting.tex` (429 lines) → ~280 lines (significantly trimmed).
**Theme**: Precision vocabulary. XML-tagged multi-component prompts. Scope control. Model selection basics.
**Cert domains**: D4 (central — practitioner subset), D5 (scope).
**Stale signals**: Model knowledge cutoffs drift per release. Extended-thinking mechanics may shift (Opus adaptive thinking).
**MDX-native**: Sortable model-capabilities table. Precision-vocabulary "vague vs precise" table with hover annotations.
**Moved to Appendix B**: Extended thinking deep-dive, cost optimization (caching/Batch API specifics), fast mode (research preview).
**Rationale for trim**: Part I shouldn't require deep understanding of cost-optimization or extended-thinking knobs; new readers need practical prompting. Advanced material is still in the book, just in an appendix.

---

## Part II — Personal Practice

### Ch 5. Context as Currency
**Source**: `05_context.tex` (896 lines — the longest in the source) → ~450 lines (substantially split).
**Theme**: Why context degrades. `/clear`, `/compact`, `/rewind`, `/btw`. Two-failure rule. Session naming + `CURRENT_WORK.md` + auto-memory.
**Cert domains**: D5 (primary), D3 (memory/hooks), D1 (sessions).
**Stale signals**: The 60-70% threshold heuristic was measured pre-1M; needs caveat. Auto-compaction trigger (~83%) is system-level and stable.
**MDX-native**: Animated context-degradation chart (degradation increases with usage). Session-naming generator.
**Moved to Appendix A**: 1M-window strategy (absolute tokens not percentages), compaction protocol, PreCompact/PostCompact hooks, context-curation concentric-rings model, horizontal-scaling strategies.
**Rationale for split**: Core context hygiene (window management) is Part II material everyone needs. Scaling strategies are Part III/advanced — keep them in the book but as a focused appendix.
**PoC artifacts** (2026-05-23): 4 supplement-format PoCs at [`src/content/poc/ch05-*`](./src/content/poc/) render at `/poc/ch05-tutorial`, `/poc/ch05-howto-recover-runaway-context`, `/poc/ch05-tldr`, `/poc/ch05-cheat-sheet`. Tutorial worked example: "30 messages in, context bloated, mid-task" → recovery.

### Ch 6. Thinking Together
**Source**: `05_thinking_partner.tex` (515 lines) → ~500 lines (minimal trim).
**Theme**: Claude as collaborative thinking partner. Hypothesis debugging. Tests as exploration. Anti-sycophancy. Pre-mortem / Feynman prompts. Interview pattern. ADRs.
**Cert domains**: D4 (anti-sycophancy, hypothesis), D5 (ADRs for decision provenance), D3 (memory for decisions).
**Stale signals**: None. Mindset content is durable.
**MDX-native**: `<BeforeAfter>` for "delegate" vs "collaborate" prompt patterns. Collapsible code-block prompt templates for pre-mortem / Feynman.
**Renumbering note**: This is the second `05_` in the source. Renumbered to `06_` here.
**PoC artifacts** (2026-05-23): 4 supplement-format PoCs render at `/poc/ch06-tutorial` (Claude-starts-wrong → interview-pattern recovery on a CI failure), `/poc/ch06-howto-pre-mortem`, `/poc/ch06-tldr`, `/poc/ch06-cheat-sheet`.

### Ch 7. Testing & Verification
**Source**: `06_testing.tex` (331 lines) → ~330 lines (minimal trim).
**Theme**: 6-layer validation. Domain correctness (the 7th layer). Phase-appropriate standards. Test-first. Verification criteria in CLAUDE.md. Hooks as enforcement.
**Cert domains**: D5 (verification = reliability), D4 (verification criteria), D3 (hooks).
**Stale signals**: None.
**MDX-native**: Expandable 6-layer validation grid. Phase-transitions table with checklists per phase. Hypothesis (property-based) code example with annotations.
**PoC artifacts** (2026-05-23): 4 supplement-format PoCs render at `/poc/ch07-tutorial` ("all 6 automated layers pass and the code is still wrong" worked example), `/poc/ch07-howto-add-verification-gate`, `/poc/ch07-tldr`, `/poc/ch07-cheat-sheet`.

### Ch 8. Extending Claude
**Source**: `07_extending.tex` (822 lines — second-longest) → ~450 lines (substantially trimmed).
**Theme**: Decision framework (which extension type?). Commands, skills, hooks (overview). MCP overview. Plugins. CLI tools. IDE integrations.
**Cert domains**: D2 (central — but the *use-side* of D2; *design* of MCP servers goes to architect-reference), D3 (skills, hooks), D1 (sub-agent via forked skills).
**Stale signals**: Hook events list grows (currently 25 — keep the full table in Appendix C and link to it). IDE integrations are evolving. Plugin ecosystem is evolving.
**MDX-native**: **Interactive extension-decision flowchart** (command → skill → hook → MCP). Sortable hook-events table (Appendix C). Skill frontmatter templates with copy-paste.
**Moved to Appendix C**: Full 25-event hook reference with examples, hook debugging walkthrough, sandboxing edge cases.
**Boundary note**: This chapter teaches *which extension to reach for and how to consume one*. **Designing MCP servers, designing custom tools, Agent SDK hook authoring → Architect's Reference**.
**PoC artifacts** (2026-05-23): 4 supplement-format PoCs render at `/poc/ch08-tutorial` ("security review on every PR" walked through the decision tree → skill + CLI + GitHub Action, zero new MCP server), `/poc/ch08-howto-first-skill`, `/poc/ch08-tldr`, `/poc/ch08-cheat-sheet`.

---

## Part III — Scaling & Craft

### Ch 9. Scaling Configuration
**Source**: `08_claude_md_architecture.tex` (260 lines) → ~280 lines.
**Theme**: Hub-and-spoke. Tier classification (T0–T5). Conditional rules (`.claude/rules/` with `paths:` glob frontmatter). Settings 5-level precedence. CLAUDE.md length limits. Output styles.
**Cert domains**: D3 (central), D1 (multi-project scaling).
**Stale signals**: None.
**MDX-native**: Interactive config-hierarchy layer visualization. Tier-classification questionnaire ("answer 5 questions, see your tier"). `.claude/rules/` example builder (select domain → generate `paths:` pattern).

### Ch 10. Agents & Parallel Work
**Source**: `09_agents_parallel.tex` (407 lines) → ~400 lines.
**Theme**: Subagents (using them, not building them — `Task` tool, frontmatter `tools`/`isolation`/`memory`). Delegation decision. Git worktrees. Writer/reviewer pattern. `/batch` skill.
**Cert domains**: D1 (use side), D2 (worktrees, isolation), D3 (subagent frontmatter).
**Stale signals**: Agent Teams is experimental (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`). `/batch` API may shift.
**MDX-native**: Delegation decision flowchart. Worktree `<BeforeAfter>` diagram. `<Scenario>` block — the Multi-Agent Research scenario can ground worked examples.
**Boundary note**: This is "use subagents as a developer." Designing multi-agent systems with the SDK, `fork_session`, `AgentDefinition` orchestration → Architect's Reference.

### Ch 11. Project Lifecycle
**Source**: `10_projects.tex` (273 lines) → ~280 lines.
**Theme**: Greenfield (day 1 → week 1 → month 1). Brownfield (introducing Claude to legacy code). Incremental refactoring protocol (extract → test → harden → promote). Characterization tests. Golden-master testing.
**Cert domains**: D3 (lifecycle, phases), D4 (characterization test prompts), D5 (small sessions).
**Stale signals**: None.
**MDX-native**: Greenfield progression as an interactive timeline. Refactoring-cycle animation. Golden-master tolerance calculator.

### Ch 12. Headless & Automation
**Source**: `12_automation.tex` (472 lines) → ~250 lines (significantly trimmed; SDK material removed).
**Theme**: Headless mode (`claude -p`). Fan-out pattern. `--allowedTools` / `--output-format json` for pipeline consumption. Bare mode. Scheduled tasks (cloud, desktop, `/loop`). GitHub Actions integration. Remote Control.
**Cert domains**: D3 (headless CLI, scheduled tasks).
**Stale signals**: GitHub Actions integration may shift. `/schedule` evolving. Cloud-vs-desktop scheduler comparison may shift.
**MDX-native**: Automation-progression guided tour (manual → scripted → CI → scheduled). Headless-mode "try it" playgrounds (post-v1.0 if/when interactive elements land).
**Moved out of handbook entirely → Architect's Reference**: Claude Agent SDK (Python/TypeScript) deep-dive. Custom tools via SDK. Programmatic hooks. `/batch` design internals. Pipeline traffic-light dashboards (architecture).
**Boundary note**: This chapter is "automating *your own* Claude Code workflows." Architect's Reference covers "building Claude-powered systems with the SDK."

### Ch 13. Antipatterns & Recovery
**Source**: `11_antipatterns.tex` (397 lines) → ~400 lines (minimal trim).
**Theme**: Eight common anti-patterns + recovery guides. Four-layer failure diagnosis (prompt → CLAUDE.md → codebase → model). Testing CLAUDE.md (smoke + adversarial).
**Cert domains**: D5 (diagnosis), D3 (context overload), D4 (over-correcting).
**Stale signals**: None.
**MDX-native**: Each antipattern as a card → expandable modal with recovery checklist. Interactive four-layer diagnosis ("describe symptom" → walks through layers). Cross-links to other chapters for each antipattern's prevention path.

---

## Part IV — Team & Enterprise

### Ch 14. Team Patterns & Governance
**Source**: `13_team.tex` (242 lines) → ~270 lines.
**Theme**: Shared CLAUDE.md in git. Managed settings (IT enforcement: `allowManagedPermissionRulesOnly`, `availableModels`, `companyAnnouncements`). Onboarding new members. Shared extensions (skills with `context: fork`, hooks). Code review patterns (pre-PR self-review, reviewer-assist).
**Cert domains**: D3 (shared config), D1 (team coordination).
**Stale signals**: None.
**MDX-native**: Onboarding interactive checklist (check off each step). Managed-settings IT checklist. Code review `<BeforeAfter>` simulated PRs.

### Ch 15. Enterprise Deployment
**Source**: `14_enterprise.tex` (259 lines) → ~280 lines + versioned content callouts.
**Theme**: Certifications (SOC 2 Type II, ISO 27001, ISO/IEC 42001, HIPAA BAA, FedRAMP High, IL5). IAM (SAML, OIDC, SCIM, RBAC). Data protection + ZDR. 50-person rollout. Cost optimization at scale. Decision matrix.
**Cert domains**: D1–D5 all touched (enterprise scaling); D5 primary (reliability + compliance).
**Stale signals — HIGH**: Pricing table snapshots, model cutoff dates, government authorizations, GitHub Copilot integration status. **Frontmatter `volatility: fast-moving`** triggers the staleness banner if `last_updated > 90d`.
**MDX-native**: Interactive 50-person rollout timeline. Cost calculator (developers × sessions/day × avg tokens → monthly cost, with caching/batch toggles). Decision matrix ("select org type → recommended deployment"). "Last updated" date prominent at top.

---

## Appendices

### Appendix A. Advanced Context Strategies
**From**: `05_context.tex` section 6 (1M strategy) + advanced compaction + horizontal scaling.
**Audience**: Practitioners managing very long sessions / 1M-window deployments.

### Appendix B. Advanced Prompting & Cost
**From**: `04_prompting.tex` (extended thinking, caching deep-dive, Batch API, fast mode).
**Audience**: Practitioners optimizing for cost or working with complex multi-step reasoning.

### Appendix C. Extension Reference
**From**: `07_extending.tex` (full 25-event hook table, hook debugging procedures, sandboxing details, IDE integration matrix).
**Audience**: Reference material; not meant to be read linearly. Filterable table.

---

## Not in this book (cross-references to other volumes)

These topics surface naturally during handbook chapters but live in sibling books:

- **Claude Agent SDK** (Python / TypeScript SDK internals, programmatic agent design) → Architect's Reference
- **MCP server design** (writing tool descriptions, structured errors, `isError`/`errorCategory`/`isRetryable`, tool distribution) → Architect's Reference
- **Multi-agent orchestration architecture** (coordinator/subagent patterns at the system level, `fork_session` deep dives, error propagation across agents) → Architect's Reference
- **Structured output design** (JSON schema design for `tool_use`, validation-retry loops, batch processing architectures) → Architect's Reference
- **Empirical observations** ("what 67 teams actually did with CLAUDE.md at scale," scaling patterns observed, hygiene findings) → Field-Guide

Each handbook chapter that touches these will link out via `<XRef book="architect-reference" id="..."/>` or plain hyperlink (until cross-book XRef resolution is built — Phase 4+ hub feature).

---

## Source → target mapping summary

| Source `.tex` | Lines | Target chapter | Target lines | Notes |
|---|---|---|---|---|
| 00_preamble | 89 | Landing page | n/a | Interactive routing |
| 01_principles | 202 | Ch 1 | ~250 | Existing `ch01-principles.mdx` is a draft; rewrite |
| 02_first_claude_md | 195 | Ch 2 | ~220 | Minimal changes |
| 03_first_session | 304 | Ch 3 | ~280 | Verify keyboard shortcuts |
| 04_prompting | 429 | Ch 4 + App B | ~280 + ~150 | Split — basics in ch, advanced in appendix |
| 05_context | 896 | Ch 5 + App A | ~450 + ~250 | Substantial split |
| 05_thinking_partner | 515 | Ch 6 | ~500 | Renumbered |
| 06_testing | 331 | Ch 7 | ~330 | Minimal changes |
| 07_extending | 822 | Ch 8 + App C | ~450 + ~250 | Substantial split |
| 08_claude_md_architecture | 260 | Ch 9 | ~280 | Minimal changes |
| 09_agents_parallel | 407 | Ch 10 | ~400 | Boundary: use-side only; design → Architect's Ref |
| 10_projects | 273 | Ch 11 | ~280 | Minimal changes |
| 11_antipatterns | 397 | Ch 13 | ~400 | Minimal changes |
| 12_automation | 472 | Ch 12 (partial) | ~250 | SDK material → Architect's Ref |
| 13_team | 242 | Ch 14 | ~270 | Minimal changes |
| 14_enterprise | 259 | Ch 15 | ~280 | Versioned; pricing/certs need refresh policy |

**Source totals**: 6,461 lines.
**Target totals**: ~5,140 lines main chapters + ~650 lines appendices = ~5,790 lines.

---

## Open decisions to resolve during rewrite

1. **Chapter slugs / URL structure** — `/chapters/01-principles` vs `/chapters/principles`? Numbered URLs are stable but less SEO-friendly; named URLs are nicer but make reordering painful. Recommend: numbered for v1.0.
2. **Whether to actually use parts** — explicit "Part I / II / III / IV" structure in the TOC, or just a flat 15-chapter list with grouping in nav? Recommend: parts visible in TOC + nav.
3. **Landing page complexity** — full interactive router at v1.0, or simple chapter list + concept map first? Recommend: simple at v1.0; promote post-v1.0.
4. **Existing `ch01-principles.mdx`** — confirmed will be rewritten (smoke test, not v1.0 content per plan).
5. **Appendix routing** — under `/appendices/A-advanced-context/` or numbered into the main `/chapters/` flow? Recommend: separate `/appendices/` route to signal status.

---

## Verification (per chapter, during rewrite)

- Frontmatter fields complete: `title`, `chapter`, `part`, `volatility`, `last_updated`, `introduced_in_version`, `cert_domains`, `tools_compared`.
- Cross-references resolve (`<XRef>` builds clean; no `[?id]` placeholders).
- New glossary terms registered via `<TermDef>` (waits on Phase 0.7 scaffold work).
- Manual read-through against the source `.tex` to confirm no major content loss except where intentionally cut.
- Scaffold validator clean.

Once all 15 chapters + 3 appendices + landing page hit ✅, the handbook ships v1.0.
