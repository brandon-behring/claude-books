# Handbook lean-trim recipe

Distilled from the **ch06 + ch14 pilot** (2026-06-20) — the spec the de-dupe fan-out follows.
Companion docs: the series pedagogy audit (`../../docs/audits/2026-06-19_series-pedagogy-and-positioning-audit.md`,
Part C de-dupe map), the depth-ladder doctrine (`../../docs/BOOK-MAP.md` §"The depth ladder"), and the
port recipe (`./port-recipe.md` — this is its de-dupe sibling).

**Why.** The 16 chapters were ported (per `port-recipe.md`) *before* the depth ladder was decided, so
several duplicate tool-agnostic principle that **agentic-coding** (rung 2) now owns. The lean-trim pass
keeps the handbook **lean-but-standalone**: full on the Claude-specific *how*, **compact** on shared
principle, with a `<BookLink>` breadcrumb that *invites* the deeper rung — never "see the other book for the
real version" (`BOOK-MAP.md:34` standalone doctrine stays intact).

## 1. When to apply

Trigger = a handbook chapter that **overlaps an agentic-coding twin** (the audit's Part C de-dupe map).
Pilot coverage + the fan-out queue:

| Handbook | AC twin | Overlap | Status |
|---|---|---|---|
| ch06 Thinking Together | `06-thinking-together` | HIGH | ✅ pilot |
| ch14 Antipatterns & Recovery | `11-antipatterns-recovery` | HIGH | ✅ pilot |
| ch05 Context as Currency | `02-context-as-currency` | MED | fan-out |
| ch10 Agents & Parallel | `09-delegation-and-parallelism` | MED–HIGH | fan-out |
| ch15 Team Patterns | `13-team-patterns-and-governance` | MED | fan-out |

Clean (no trim): ch11 Orchestration (legitimately Claude-specific), ch16 Enterprise (the perpendicular model).

## 2. The trim test (per section)

For each section in the handbook chapter, classify:

| Classify | Test | Action |
|---|---|---|
| **TRIM** | Tool-agnostic principle the AC twin owns — the *why*, cross-LLM patterns, generic prompt templates | Compact + breadcrumb (§3) |
| **KEEP** | Claude-specific *how* — commands (`/clear`, `/memory`, `/effort`), config (`.claude/rules/`, `settings.json`), hooks, tool names, daily-practice mechanics | Leave as-is |
| **KEEP** | A worked example / before-after that *demonstrates* the Claude workflow | Leave as-is |

Most sections mix both — **split** them: keep the Claude-specific sentences, compact the principle around them.

**Breadcrumb-only is a valid outcome.** When a chapter's body is already mostly Claude-specific *how* (e.g.
ch14's antipattern recoveries + the four-layer *instruments*), there is little tool-agnostic prose to
compact — the de-dupe is then the **breadcrumb alone**, acknowledging AC owns the cross-tool catalog. Don't
manufacture trims: in the pilot, ch06 (principle-heavy) compacted prose, while ch14 (recovery-heavy) added
breadcrumbs and removed nothing — both correct. Expect the fan-out to split the same way per chapter.

## 3. The replace pattern — compact treatment + breadcrumb

Trim depth is **compact, not maximal** (decided 2026-06-20): leave a tighter-but-real treatment, not a
2-sentence stub. Residual overlap with AC is acceptable (the series XRef convention — "duplication OK; every
explanation complete where it sits"). For each TRIM section:

1. Reduce the principle to a **short paragraph or list** — the core idea, stated concisely, complete enough
   to stand alone at the handbook's altitude.
2. Append a **`<BookLink>` deep-link** to the exact AC section that owns the full treatment (§4).
3. Phrase the breadcrumb as an **invitation** — "for the cross-tool *why*, see …" — never "the real version
   is in …".

## 4. Breadcrumb mechanics (bidirectional)

Breadcrumbs are **bidirectional** (the series convention: cross-refs are bidirectional breadcrumbs):

- **handbook → AC** (down-rung principle): `<BookLink book="agentic-coding" to="<ac-slug>/#<anchor>">…</BookLink>`
- **AC → handbook** (Claude-specific *how*): `<BookLink book="handbook" to="chapters/<hb-slug>/#<anchor>">…</BookLink>`

**Router shapes differ — get the `to` right:**

| Target book | URL shape | `to=` form |
|---|---|---|
| handbook | `/handbook/chapters/<slug>/` | `chapters/<slug>/#<anchor>` |
| agentic-coding | `/agentic-coding/<slug>/` (no `/chapters/`) | `<slug>/#<anchor>` |

- `siblingBooks` must be wired in both books' `astro.config.mjs` (done — already on `main`, landed in #31) or `<BookLink>` throws at build.
- **Anchors are auto-slugged headings** (`### Mode 1: Hypothesis-driven debugging` → `#mode-1-hypothesis-driven-debugging`).
  Target a **stable heading**, and **verify the anchor against the target's real headings** — the `to` path
  is unvalidated upstream (scaffold #167), so a typo is a silent dead link.
- Import: `import BookLink from '@brandon_m_behring/book-scaffold-astro/components/BookLink.astro';`
- **Keep down-rung links sparse** — ≤3–4 per chapter, each to a *distinct* target section, placed at the
  relevant section. Don't stack an umbrella link (e.g. `#operation`) with separate links to its own
  sub-sections unless each is genuinely useful where it sits.

## 5. Preserve the spine + apparatus

A trim must not break the chapter's standalone structure (`../PEDAGOGY.md`, tutorial genre). After trimming:

- [ ] `<YouWillLearn>` outcomes are still all delivered by the remaining body.
- [ ] `<Exercise>`↔`<Solution>` pairing intact; exercises still solvable from the chapter alone.
- [ ] `<Tip>` numbering still sequential (renumber if a trim removed one).
- [ ] `## Quick reference` intact; `## Where this goes next` updated — it's the natural home for the
  down-rung `<BookLink>` when a section-level breadcrumb doesn't fit.
- [ ] Keep the worked examples, ADR / recovery mechanics, and Claude-specific pitfalls.

## 6. Verification bar (per chapter, both books)

- [ ] `npm run build` (or `npm run validate` for figure-heavy books — avoids the figure-rebuild churn) green
  for **both** the handbook and agentic-coding (the AC reverse-breadcrumb edit needs its own build).
- [ ] `grep` the built HTML for the BookLink hrefs → confirm the `/agentic-coding/<slug>/#<anchor>` and
  `/handbook/chapters/<slug>/#<anchor>` shapes; **cross-check each anchor against the target's real
  headings** (the `to` is unvalidated — scaffold #167). **Summarize the resolved hrefs in the PR**
  (built-HTML grep or a source-heading check) — the required checked-link step until #167 lands validation.
- [ ] Keep cross-book links to **stable** target headings, and avoid naming volatile tool-surface
  detail (slash-commands, flags) *in the sibling book* — name it where it's verified, and breadcrumb to
  it (a reverse breadcrumb into agentic-coding must not import the handbook's command surface).
- [ ] Standalone check (§5).
- [ ] **2-voice review** (codex + Claude; gemini gated via `AR_GEMINI_BIN=/nonexistent`): each breadcrumb
  lands on the section that owns the trimmed material, and no Claude-specific *how* was trimmed as principle.

## 7. Fan-out

With the recipe proven on ch06 + ch14, the MED pairs (ch05, ch10, ch15) follow one chapter each against this
spec. **Hand-author** (the trims are judgment calls, not mechanical) with a per-chapter 2-voice review. The
agentic-coding rigor audit (backlog item 6) is the natural home for any AC-side cleanup the reverse
breadcrumbs surface.
