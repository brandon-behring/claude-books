# Initial bootstrap design — claude-books project roadmap

**Date**: 2026-05-22 (with 2026-05-24 hub+sibling architecture flag added)
**Status**: canonical reference for the project's long-term shape.
**Provenance**: extracted from `~/.claude/plans/this-repo-is-supposed-buzzing-eclipse.md` § "Project roadmap (approved context)" during the Bundle D guides-recon-action round (2026-05-24). Promoted to in-repo design docs per recon §9 so contributors can see it.

## Context

`claude-books` is the **Astro/MDX home for a three-volume Claude practitioner reference**, evolved from two paired LaTeX books plus a new from-scratch volume inspired by Anthropic's *Claude Certified Architect — Foundations* exam guide (v0.1, Feb 2025).

The three books:

| Book | Source | Profile | Audience |
|---|---|---|---|
| **Handbook** | rewrite of `~/claude-best-practices` (16 .tex ch, v2.9) | `tools` | Practitioners using Claude Code day-to-day |
| **Architect's Reference** | from scratch, cert-domain-aligned | TBD (likely `tools` or new) | Solution architects building Agent SDK / API / MCP systems |
| **Field-Guide** | rewrite of `~/claude-code-field-guide` (12 ch + 3 app) | `research-portfolio` | Engineering leaders studying production patterns (audit of 67 repos) |

A fourth workspace member, **`glossary/`**, ships a shared terminology resource that all three books link to.

As of the bootstrap, only **Ch1 of the handbook** is in this repo as a Phase 0 smoke test. The repo also **dogfoods `@brandon_m_behring/book-scaffold-astro`** — gaps and feature needs surface here and get fixed upstream.

## Decisions confirmed at bootstrap

1. **Three books, not two** — handbook + field-guide + a new Architect's Reference. The cert guide's coverage of Agent SDK, MCP design, and production scenarios was the natural segmentation trigger.
2. **Activity-based book boundary** (refinable later): Handbook = how to *use* Claude effectively; Architect's Reference = how to *design* Claude-powered systems; Field-Guide = what teams actually *did*. Overlapping topics may appear in multiple books from their respective angles, but each angle is distinct.
3. **Cert as thoroughness anchor (+ possible exam-prep volume)** — books align to the 5 publicly-known cert domains as a coverage checklist. The Architect's Reference may explicitly serve as the cert-prep book; final positioning decided during its outline phase.
4. **Public, polished works** for the wider Claude Code community — quality bar comparable to published technical books.
5. **Free open content (CC BY 4.0)** — matches existing LICENSE. No paid tier, no auth. "Suggest an edit" → GitHub PR as community contribution path.
6. **Rewrite, not port** — LaTeX is a draft. Restructure freely; drop outdated content; add new sections informed by the cert taxonomy.
7. **Existing Ch01 = draft only** — full rewrite during Phase 1, not preserved as v1.0 content.
8. **Site topology** — each book deploys independently for now (Cloudflare Workers). A future "all my books" hub is possible but deferred; conventions stay consistent so a future merge is cheap.
9. **LaTeX sunset** — both source repos archived on GitHub once their book ships v1.0.
10. **Scaffold gap policy** — fix all 5 known gaps upfront (Phase 0.5) + build cert-inspired components and living-doc features as scaffold work, before chapter writing accelerates.
11. **Version model** — each book carries a **semver version**; each chapter carries a **`last_updated` stamp + `introduced_in_version`**. v1.0 = full table of contents written and shipped.
12. **Living-document features** must ship with/before v1.0: per-chapter "last updated" badge; site-wide `/changelog`; RSS/Atom feed; volatility-aware staleness warnings.
13. **Cert-inspired components** (all four): `<Scenario>`, `<CheckYourself>`, `<Domain>` badge, `<TaskStatement>` block.
14. **Shared glossary** at workspace level — `glossary/` is a fourth member; both/all books deep-link in.
15. **Cert tracking is an ongoing concern** — `docs/cert-tracking.md` + watch list + monthly check (auto-or-manual TBD).
16. **Confidential PDF stays internal** — the v0.1 cert exam guide in this repo is marked Confidential NTK. Use as internal research aid only; public book content cites the publicly-available taxonomy and the free Anthropic Academy courses.
17. **Outline phase per book — yes, but not yet** (after Phase 0.5).
18. **Pace & working mode** — left open. Decided per-phase.
19. **No pandoc** — manual rewrite. Use MDX components LaTeX couldn't.
20. **URLs: always `/latest/`** — no versioned URL paths. Older versions accessible only via git tags. Optimizes SEO + reader simplicity.
21. **Interactive elements deferred** — v1.0 ships static (Shiki-highlighted code samples only). Live API playgrounds revisited post-v1.0 based on reader signal.
22. **Reader feedback** — "Edit this page" link → GitHub PR, plus a GitHub Discussions thread per chapter (auto-created, comment count embedded).

## Open question carried into the roadmap

**Second-position book — Architect's Reference vs. Field-Guide?** Original plan was handbook → field-guide. The new Architect's Reference is timely (cert just launched), but it's *greenfield* (no draft to lean on). Field-Guide has a draft and is smaller (~1.9k lines). Recommendation: **Handbook → Architect's Reference → Field-Guide**, capitalizing on the cert moment while it's hot. Easy to redirect if you prefer the smaller-first sequencing.

## Cert ecosystem snapshot (verified May 2026)

- **Claude Certified Architect — Foundations (CCA-F)** officially launched **March 12, 2026** as part of the new Claude Partner Network ($100M investment).
- **Format**: 60 multiple-choice questions, 120-minute proctored exam, partner-gated. Free study via Anthropic Academy.
- **5-domain taxonomy is public** (covered widely by dev.to, Substack, explainx.ai, certsafari.com, claudecertifications.com, Udemy). Same domains and weights as the PDF you supplied.
- **The v0.1 PDF** in this repo is marked **"Confidential Need to Know"** on every page — it appears to be early-adopter / beta-program material. Plan treats it as **internal research aid only**; public-facing book content aligns to the *publicly available* domain taxonomy, not the PDF's verbatim task statements or sample questions.
- **Anthropic Academy** (anthropic.skilljar.com) hosts ~17 free courses (~15-20 hrs of content) covering: AI Fluency, Claude Code 101, Claude Code in Action, Subagents, Agent Skills, Building with the Claude API (8 hrs, 10 quizzes — biggest course), Intro to MCP, MCP Advanced Topics, plus Bedrock and Vertex tracks. These are major **T1 source citations** for the Architect's Reference and acceptable cross-references for the Handbook.
- **Future tiers planned** (per Anthropic announcements): Sellers, Architects (higher-tier than Foundations), Developers — to be introduced later in 2026. Likely 2027+ content opportunity.
- **Competitive landscape exists**: third-party study guides, blog syntheses, Udemy courses, free practice questions already online. Differentiation = depth, empirical grounding (field-guide), long-lasting reference value vs. cheat-sheet ephemera.
- **Tracking mechanism** (set up alongside Phase 0.5 — small standalone task, doesn't block scaffold work):
  - `docs/cert-tracking.md` — records last-known version/date, domain weights, course catalog, deltas observed.
  - Watch list: `anthropic.com/news`, `claude.com/resources/courses`, `claude.com/resources/certifications`, `anthropic.skilljar.com`.
  - **Cadence: weekly.** Implemented as a **scheduled remote agent** (via `/schedule` skill) that fetches and diffs the watch list and writes findings to `docs/cert-tracking.md`. Weekly automation > manual cadence given the active rollout phase.

## Roadmap

### Phase 0 — Bootstrap + smoke test ✓ done
Workspace + scaffold v3.5.0 wired up; Ch1 of handbook ported as MDX smoke test.

### Phase 0.5 — Scaffold sprint (next)

Work happens in **`~/book-scaffold-astro`**, not in `claude-books`. End state: tagged scaffold release, handbook bumped.

**Fix the 5 known gaps** (from `docs/scaffold-gaps.md`):
- **HIGH** — `create-book` emits `src/pages/index.astro` + `chapters/[...slug].astro`.
- `LATEX_TO_MDX_MAPPING.md` — document practice-tag mapping for `<Tag kind="...">`.
- `LATEX_TO_MDX_MAPPING.md` — fill MarginNote Props column with `variant` + `label`.
- `XRef.astro` JSDoc — reflect Phase 2.6 validator behavior.
- `book-scaffold validate` — resolve the misleading "profile=minimal" log line.

**Port the LaTeX linters**: `~/claude-best-practices/scripts/lint_margin_notes.py` + `lint_practice_tags.py` → scaffold MDX validator.

**Audit `.claude/skills/` from both source repos** for anything useful to carry over.

**Parallel task** (independent of scaffold work): set up the **weekly cert-tracking scheduled agent** via the `/schedule` skill. Initial `docs/cert-tracking.md` populated with the current snapshot.

Exit criteria: new scaffold version published; `handbook` consumes it; build green; cert-tracking agent running and producing weekly diffs.

### Phase 0.7 — Cert-inspired scaffold components + living-doc features

Independent scaffold work; can land alongside Phase 1 outlining. Built once, inherited by all three books.

**Cert-inspired components** (all four):
- **`<Scenario name="...">`** — declares one of the 6 cert scenarios (CSR, Code Gen, Multi-Agent Research, Dev Productivity, CI/CD, Structured Data Extraction) as a chapter's running example. Renders with a labeled chip; powers a per-book "scenarios catalog" page.
- **`<CheckYourself>`** — scenario + MC question + explanation block (mirrors cert exam format). Optional answer reveal. Heaviest usage in Architect's Reference; sparing in other books.
- **`<Domain>` badge** — frontmatter field `cert_domains: [1, 2, 3, 4, 5]`. Renders as a chip in chapter meta. Powers a `/cert-map` page per book.
- **`<TaskStatement>` block** — `Knowledge of:` + `Skills in:` two-column block. Optional, but a powerful chapter-opener for Architect's Reference.

**Living-doc features**:
- Per-chapter "last updated" badge + version-introduced label.
- `/changelog` route + `CHANGELOG.md` convention.
- `/rss.xml` for chapter updates and version releases.
- Volatility-aware staleness banner.

**Glossary integration**: `<Term id="...">` component that resolves to the workspace glossary; `<TermDef>` for inline definitions that auto-register with the glossary.

**Feedback affordances**:
- **"Edit this page"** link per chapter — opens the source MDX in GitHub's editor; readers can submit PRs.
- **GitHub Discussions thread per chapter** — auto-create on publish; embed a comment count + "Join the discussion" link in the chapter footer. Uses GitHub's API; no third-party JS.

### Phase 1 — Handbook: outline + rewrite

#### Step 1: Outline
Read all 16 .tex chapters. Decide final chapter list with these inputs:
- **Cross-check against cert Domain 3** (Claude Code Configuration & Workflows, 20%) and relevant parts of 4 (Prompt Engineering, 20%) and 5 (Context Management, 15%) — this book should comprehensively cover those domains.
- Resolve the two `05_*` files in the source.
- Identify chapters where MDX-native presentation materially helps.
- Flag any candidate splits/merges.

Deliverable: `handbook/OUTLINE.md` committed.

#### Step 2: Rewrite (rolling)
**Per chapter**:
1. Open the relevant `.tex` as a draft input — extract bones, write fresh prose.
2. Frontmatter: `title`, `chapter`, `volatility`, `last_updated`, `introduced_in_version`, `tools_compared`, `cert_domains`.
3. Use MDX components — `<KeyIdea>`, `<TryThis>`, `<BeforeAfter>`, `<MarginNote>`, `<InsightBox>`, `<Tag>`, `<XRef>`, optionally `<Scenario>`/`<CheckYourself>` where useful.
4. Add citations to `handbook/sources/manifest.yaml` (tier T1-official / T2-release-notes / T3-practitioner / T4-conjecture).
5. Register new glossary terms via `<TermDef>`.
6. `npm run build` green; scaffold validator clean.
7. Log new scaffold gaps to `docs/scaffold-gaps.md`.

### Phase 1.5 — Handbook v1.0 release
- All planned chapters in; bibliography reviewed; XRefs resolve.
- Real domain in `handbook/astro.config.mjs` + `wrangler.toml`.
- SEO + social: sitemap, robots.txt, OpenGraph cards per chapter, canonical URLs.
- `/changelog` populated with v1.0 entry; RSS live; cert-domain map page if applicable.
- Public deploy → **`handbook-v1.0.0`** git tag.
- Archive `brandonmbehring-dev/claude-best-practices` with a redirect note.

### Phase 2 — Architect's Reference: research + reference implementations + bootstrap + outline

This is the **from-scratch volume**. No LaTeX draft. Foundations come from a deliberate research + experimentation sprint before any chapter writing starts.

**Structural pre-decision (flagged 2026-05-24 from guides-repo recon)**: when Architect's Reference (and later Field-Guide) bootstraps, evaluate the **hub + sibling-repos architecture** that the `~/guides/` + `~/guides-experimentation/` pair uses (`~/guides/` hub owns landing + methodology + about + design docs + shared styles; per-guide content lives in sibling repos deploying to subroutes). See `docs/guides-recon.md` § 13 for the full analysis. Current workspace-member-under-one-repo plan is the default; the hub+sibling option is preserved for when the multi-volume reality makes it warranted. Decision deferred to the Phase 2 Step 3 bootstrap.

#### Step 1: Research sprint
Take relevant Anthropic Academy courses end-to-end and read related primary sources:
- **Building with the Claude API** (8.1 hr, 10 quizzes — biggest input)
- **Intro to MCP + MCP Advanced Topics** (~2 hr)
- **Claude Code in Action**, **Subagents**, **Agent Skills** (~2 hr)
- **AI Fluency: Framework & Foundations** for vocabulary alignment
- Anthropic Engineering blog (agent patterns, Claude Code internals, MCP design)

Notes accumulate in `architect-reference/notes/` — raw research material that informs outline + chapters. Cite as **T1 sources** in the bibliography.

#### Step 2: Reference implementations (2-3 cert scenarios, built end-to-end)

Pick 2-3 of the 6 cert scenarios and **actually build them**. Recommended subset (covers Domains 1, 2, 4, 5 well):
- **CSR Agent** — Customer Support Resolution (Domains 1, 2, 5)
- **Multi-Agent Research System** — coordinator/subagent pattern (Domains 1, 2, 5)
- **Structured Data Extraction** — `tool_use` + JSON schemas + validation loops (Domains 4, 5)

For each implementation:
- Build and dogfood end-to-end — real working code, not pseudocode.
- Document the journey (design decisions, dead-ends, fixes, gotchas) — this prose becomes chapter material.
- Code lives in dedicated repos (e.g., `claude-books-csr-example`) and is linked from chapters; **not** part of `claude-books/` workspace itself to keep this repo focused on prose.

Open question: a `claude-books/examples/` workspace member instead of separate repos? Decide pre-Phase 2.

#### Step 3: Bootstrap
- Run `create-book` (profile TBD — likely `tools`) for `architect-reference`.
- Add `"architect-reference"` to root workspaces.
- Smoke-test with a placeholder chapter exercising `<Scenario>`, `<CheckYourself>`, `<TaskStatement>`, `<Domain>` badges.

#### Step 4: Outline
Informed by research notes + lessons from reference implementations. Aligned to cert **Domains 1, 2, parts of 4 and 5**:
- Domain 1: Agentic Architecture & Orchestration (27%) — agentic loops, multi-agent patterns, subagent context, hooks, task decomposition, session state
- Domain 2: Tool Design & MCP Integration (18%) — tool descriptions, MCP server config, structured errors, tool distribution, built-in tools
- Domain 4 subset: structured output via `tool_use`, JSON schemas, validation/retry loops, batch processing
- Domain 5 subset: error propagation across multi-agent systems, information provenance

Decide here: is this volume *also explicitly* the cert-prep book? If yes, lean into `<CheckYourself>` + `<TaskStatement>` blocks; add a "How to use this for the Foundations cert" appendix. If no, treat the cert taxonomy as scaffolding and write a deeper architect's reference.

Deliverable: `architect-reference/OUTLINE.md`.

### Phase 3 — Architect's Reference: rewrite

Per-chapter workflow, drawing on Phase 2's research notes + reference implementations:
- Pull from `architect-reference/notes/` and the dogfood logs of the reference implementations as primary source material.
- Use the **6 cert scenarios** as recurring case studies — each chapter declares its scenario(s) via `<Scenario>`. The 3 you built get the deepest treatment; the other 3 referenced more lightly.
- Heavy use of `<CheckYourself>` blocks if cert-prep positioned.
- Cross-link to handbook via `<XRef book="handbook" id="..."/>`.
- Build shared glossary terms aggressively (this book introduces a lot of new vocabulary).

### Phase 3.5 — Architect's Reference v1.0 release
- Same shape as Phase 1.5 — real domain, SEO, changelog, RSS, public deploy, **`architect-reference-v1.0.0`** git tag.
- If positioned as cert-prep: announce alongside the cert in the broader community.

### Phase 4 — Field-Guide: outline + rewrite

#### Bootstrap
- `create-book --profile=research-portfolio field-guide`.
- Add to workspaces.

#### Outline
Cross-check against cert domains for coverage gaps the empirical chapters could fill. Especially helpful for grounding cert principles in real-world observed patterns.

#### Rewrite
Per-chapter shape as Phase 1 Step 2, plus:
- **Extract audit data** as you encounter it — `field-guide/src/data/audit-repos.yaml` with `{ id, name, github_url, observed_patterns, notes_md }`. Powers future filter/table UI; doubles as bibliography source.
- **Decide refresh policy for the audit** — locking the 67-repo snapshot is fine; flag if/when re-audit happens (probably a v2.0 trigger).
- **Cross-link aggressively** to handbook ("what to do") and architect's reference ("how to design the system") via `<XRef book="..." id="..."/>`.

### Phase 4.5 — Field-Guide v1.0 release
- Same shape as Phase 1.5 / 3.5 — real domain, SEO, changelog, RSS, public deploy, **`field-guide-v1.0.0`** git tag.
- Archive `brandon-behring/claude-code-field-guide`.

### Phase 5+ — Living maintenance + hub future
- Cadence for chapter updates as Claude Code, Agent SDK, MCP, and the cert evolve. Minor/patch releases.
- Re-audit trigger for Field-Guide (v2.0 candidate).
- Hub site (third deliverable): top-level landing, both/all books at sub-paths, unified Pagefind, promoted cross-book `<XRef>`.
- Possible cert evolutions: when Anthropic ships Foundations v0.2 / a higher-tier cert, mirror in Architect's Reference.

## Cross-cutting concerns

### A. Workspace structure
```
claude-books/
├── handbook/              (Phase 1)
├── architect-reference/   (Phase 2-3)  [NEW]
│   └── notes/             (Phase 2 research notes — citeable from chapters)
├── field-guide/           (Phase 4)
├── glossary/              (new shared deliverable)  [NEW]
├── examples/              (open question — Phase 2 reference implementations
│                           may live here OR as separate GitHub repos)
└── docs/, .github/, etc.
```

### B. Shared glossary
- Workspace member `glossary/` — its own Astro site OR a shared package consumed by each book that renders `/glossary` in-context.
- v1.0 baseline = the cert appendix's "Technologies and Concepts" list + your own terms encountered during writing.
- Each book registers terms via `<TermDef>`; references via `<Term id="...">`.
- Deferred decision: standalone site vs in-book route. Recommend in-book route (less infrastructure) but standalone is simpler conceptually.

### C. Cert-domain coverage map
- Maintain a coverage matrix (likely in `docs/cert-coverage.md`) — each cert domain × task statement × which book/chapter covers it.
- Used during each book's outline phase as a thoroughness check.
- Updated as the cert itself evolves.

### D. Bibliography
- Neither LaTeX repo has a `.bib`. Build fresh per book.
- Tier system (T1-T4) from day 1.
- Cert guide and Anthropic docs become primary T1 sources for the Architect's Reference.

### E. Content freshness
- Frontmatter: `volatility` + `last_updated` + `introduced_in_version` + `cert_domains`.
- Scaffold renders "last updated" badge + staleness banner.
- CI check: warn if `volatility !== stable-principle` and `last_updated > 90 days`.

### F. Audit dataset (field-guide-specific)
- Extract `field-guide/src/data/audit-repos.yaml` during Phase 4 rewrite.
- Powers filter/table UI + bibliography.

### G. Linting + CI/CD
- Scaffold validator runs on PR for all books.
- GitHub Actions from Phase 1.5+: build → preview deploy per PR. (Note 2026-05-24: regression-catching CI workflows landed early at `.github/workflows/` per `docs/guides-recon.md` §12.)

### H. SEO / public-launch polish
- Sitemap + robots.txt per book.
- OpenGraph + Twitter card metadata per chapter (frontmatter-driven).
- Pretty URLs; pagefind search per book.
- Cert-domain map page per applicable book — SEO surface for cert-prep searchers.
- Analytics — Cloudflare Web Analytics or Plausible (decide pre-Phase 1.5).

### I. Versioning & releases
- **Per book**: semver. v1.0.0 = full TOC complete. Git tags scoped per book (`handbook-v1.0.0`, etc.).
- **Per chapter**: `last_updated` + `introduced_in_version`.
- **Changelog**: per-book `CHANGELOG.md`.

### J. Deploy
- Each book = separate Cloudflare Worker (and glossary if standalone-routed).
- Domain TBD — flag before Phase 1.5.

### K. Scaffold-version coordination
- All three books pin the same scaffold major version. Bump together.

## Open questions to revisit (not blocking)

1. **Architect's Reference profile** — reuse `tools`, or warrant a new profile? Decided in Phase 2 bootstrap.
2. **Cert-prep positioning of Architect's Reference** — explicit cert-prep book, or cert-aligned reference? Decided in Phase 2 outline.
3. **Reference implementation hosting** — separate GitHub repos vs `claude-books/examples/` workspace member? Decide pre-Phase 2.
4. **Glossary deployment** — standalone site vs in-book route. Decided in Phase 0.7.
5. **Second-book order** — Architect's Reference vs Field-Guide as #2? Currently recommending Architect's; trivially redirectable.
6. **Third-book partition validation** — does the cert-aligned split feel natural after Phase 1 outlining? If not, redistribute.
7. **Domain naming** — per-book subdomains, single domain w/ paths, etc. Pre-Phase 1.5.
8. **PDF output** — Print CSS or skip? Defer past v1.0.
9. **Re-audit cadence (field-guide)** — defer to v2.0 trigger.
10. **Analytics provider** — pre-Phase 1.5.
11. **AI-assisted drafting policy** — codified 2026-05-24 in `AUTHORS.md`.
12. **GitHub remote / repo visibility** — public from day 1, or private until first book ships? Decide pre-Phase 1.5.
13. **Higher-tier certs** (Sellers/Architects/Developers, coming later in 2026 per Anthropic) — extend the book series to match? Defer until those certs land.

## Critical files / utilities to reuse

- `~/book-scaffold-astro/` — scaffold source (Phase 0.5 + 0.7 work).
- `~/claude-best-practices/scripts/lint_margin_notes.py` + `lint_practice_tags.py` — port to scaffold validator.
- `~/claude-best-practices/output/claude_best_practices.pdf` — reference reading during handbook outline (not fidelity target).
- `~/claude-books/instructor_..._Claude+Certified+Architect+...pdf` — **internal-only** research aid for Architect's Reference (marked Confidential NTK; do not cite verbatim in public content).
- `handbook/src/content/chapters/ch01-principles.mdx` — chapter-conventions reference (full rewrite expected in Phase 1).
- `docs/scaffold-gaps.md` — append new gaps; batch at phase boundaries.
- `docs/cert-tracking.md` — weekly cert/Academy diff log.
- `book-scaffold-astro/LATEX_TO_MDX_MAPPING.md` — reference when rewriting; flag gaps.

## Public source pool (citeable as T1)

- **Anthropic Academy courses** (anthropic.skilljar.com) — 13+ free courses, ~15-20 hrs total. Especially "Building with the Claude API," "Intro to MCP," "MCP Advanced Topics," "Claude Code in Action," "Subagents," "Agent Skills."
- **claude.com/resources/courses** — canonical course catalog.
- **anthropic.com/news** — Partner Network and product announcements.
- **Anthropic Engineering blog** — agent design patterns, internal-architecture posts.
- **Anthropic docs** — code.claude.com/docs, api docs, MCP spec.
- **Public cert summaries** — dev.to, Substack syntheses, claudecertifications.com (free study guide), explainx.ai. Useful for confirming what's publicly known vs what's confidential.

## Verification approach

- **Per chapter**: MDX builds clean; validator passes; Pagefind indexes; manual read-through; XRefs resolve; glossary terms register.
- **Per book outline**: cert-domain coverage matrix updated; no obvious gaps for the book's intended scope.
- **Per phase**: full-repo `npm run build` green; all planned chapters present.
- **Pre-v1.0**: full book read-through for tone + accuracy; SEO check (Lighthouse, sitemap, social cards); RSS feed validates; cert-domain map renders.
- **Post-deploy**: real-URL spot checks; Pagefind returns expected results; cross-book links resolve.
