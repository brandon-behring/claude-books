# PoC comparison — Ch 1 in 5 supplement formats

Written 2026-05-23 after the visual-pedagogy research sprint ([[../docs/research/11-pedagogy/]]). Five PoCs render Ch 1 (Principles & Mental Model) in five distinct content formats so the visual approaches can be tested side-by-side. **The artifacts themselves are the primary deliverable** — read this memo *after* viewing the rendered PoCs in `npm run dev` at `/poc`.

## The 5 PoCs

| # | Kind | File | Rendered at | Lines | Visual register |
|---|---|---|---|---|---|
| 1 | **tutorial** | [`ch01-tutorial.mdx`](../src/content/poc/ch01-tutorial.mdx) | `/poc/ch01-tutorial` | ~210 | Narrative + worked example; spaced callouts; retrieval prompts at end |
| 2 | **how-to** | [`ch01-howto-claudemd-monorepo.mdx`](../src/content/poc/ch01-howto-claudemd-monorepo.mdx) | `/poc/ch01-howto-claudemd-monorepo` | ~130 | Procedural; numbered steps; code-heavy; minimal prose |
| 3 | **TL;DR** | [`ch01-tldr.mdx`](../src/content/poc/ch01-tldr.mdx) | `/poc/ch01-tldr` | ~70 | Compressed; principle-table; "drill in" pointers |
| 4 | **part-summary** | [`part1-summary.mdx`](../src/content/poc/part1-summary.mdx) | `/poc/part1-summary` | ~95 | Reader-journey arc; cross-chapter scope; bullet-dense |
| 5 | **cheat-sheet** | [`ch01-cheat-sheet.mdx`](../src/content/poc/ch01-cheat-sheet.mdx) | `/poc/ch01-cheat-sheet` | ~125 | Reference-card density; tables + matrices; minimal prose |

All five render successfully via `npm run build` (14 pages total = 8 scaffold-default + 6 PoC routes). All MDX uses components already in the scaffold (no Phase 0.7 dependencies blocked).

## Side-by-side observations

### What works (genuinely visually distinct)

**The tutorial vs cheat-sheet distinction is sharp** — the tutorial's narrative prose + spaced callouts feel structurally different from the cheat-sheet's table-dense, look-up-oriented register. A reader scanning at thumbnail zoom can immediately tell which is which. This validates the "template differentiation by content type" principle ([[../docs/research/11-pedagogy/01-doc-ux-patterns/site-tailwind-docs]] + [[../docs/research/11-pedagogy/01-doc-ux-patterns/site-react-dev]]) — no badge needed; the structure carries the signal.

**The how-to is properly procedural** — numbered steps, code-heavy, problem→outcome arc. Distinct from the tutorial's narrative arc. Maps cleanly to Diátaxis "how-to" mode. Also surfaces a sharp use case for the chapter material (CLAUDE.md hierarchy for a monorepo) that's hard to demonstrate in the tutorial without breaking the chapter's narrative spine.

**The TL;DR isn't redundant with the tutorial's executive summary** — they serve different needs. The tutorial's executive summary is "macro view of the same content you're about to read." The TL;DR is "you're not going to read the whole thing — here's the gist with cross-links if you want to drill in." Distinct readership; distinct length budget.

### What's less compelling

**The Part-summary feels less differentiated** — at ~95 lines it sits between TL;DR (~70) and tutorial (~210) but doesn't have a clearly distinct *register*. Reads like a longer TL;DR. The reader-journey-arc framing (L1 → L2 progression) is the only feature that genuinely differs from a TL;DR. **Open question**: is the part-summary a redundant content type, or does it earn its keep by giving readers a 2-page view of an entire Part's arc?

**The cheat-sheet has rendering limits** — the agent-loop ASCII diagram is OK in the codeblock but begs for an actual SVG. Tables work. Decision matrices work. But the "look-up oriented" feel really wants typographic differentiation that the current minimal shared layout doesn't provide. **The cheat sheet's strongest features would come from a custom layout**, not just MDX content choices.

### What's missing (scaffold gaps surfaced)

1. **Per-PoC-kind layouts** — every PoC currently renders with the same shared layout in `src/pages/poc/[...slug].astro`. A cheat-sheet wants narrower line-width, wider page, denser default spacing. A how-to wants emphasized numbered-step headings. A tutorial wants generous line-height for narrative flow. The same shared layout dilutes the visual differentiation. **Phase 0.7 scaffold work to file**: `<PocLayout kind="cheat-sheet|how-to|tutorial|tldr|part-summary">` component that swaps page-shell typography + spacing per kind.

2. **`<WorkedExample>` collapsible** — the tutorial PoC's "worked example: agent loop in one session" section is currently inline. The PEDAGOGY.md commits to this being collapsible (closed by default) to support two-level disclosure. Phase 0.7 scaffold work — already on the list.

3. **`<Pitfall>` callout** — the tutorial's "common first-session mistakes" section currently uses a plain H2. Should be a distinct callout type with a visual signature distinct from generic Warning. Add to Phase 0.7.

4. **`<YouWillLearn>` opener** — the tutorial currently uses a `>` blockquote for "You will learn...". React.dev has `<YouWillLearn>` as a first-class callout; the visual treatment makes the chapter's promise scannable. Add to Phase 0.7.

5. **Empty `sources/manifest.yaml` warning is noisy** — `npm run build` warns `[file-loader] No items found in sources/manifest.yaml`. Once we add even one bibliography entry the warning goes away, but for now it's confusing. Worth filing as a scaffold gap: empty bibliography should be valid + warning-free.

6. **YAML date types need explicit quoting** — when defining a custom collection with `z.string()` for a date field, YAML auto-parses unquoted dates as Date objects, failing the schema. The scaffold's existing `chapters` collection accepts dates either because its schema is `z.coerce.date()` or because `last_verified` is differently shaped. Documentation gap: scaffold guidance for custom collections should mention this.

## Recommendation for v1.0

Based on the visual side-by-side:

**Adopt (DECIDED)**:
- **Tutorial** as the main chapter format. Every chapter ships in this register. Layer-3 hierarchical disclosure (exec summary → mechanism → worked example → principles → spiral refs → retrieval prompts).
- **Cheat sheet** as a companion artifact for chapters with reference-y content (Ch 1 principles, Ch 8 hooks/skills, Ch 9 settings hierarchy). One per chapter where it earns its keep. Will benefit substantially from the per-kind layout (Phase 0.7).
- **How-to guides** as a separate content type at `src/content/how-to/<slug>.mdx`. Not 1:1 with chapters — written when a specific task warrants. Maybe 0-2 per chapter for v1.0; grows organically.

**Defer / open question**:
- **Part-summary** — recommend writing one per Part (Foundations / Practice / Scaling / Team & Enterprise) but make a final call after Part I is fully written. Risk: feels too thin to earn the slot.
- **TL;DR per chapter** — recommend writing for chapters that are explicitly hierarchical-disclosure entry points (Ch 1, Ch 5, Ch 11 antipatterns). Don't blanket-write for every chapter.

**Phase 0.7 scaffold work to add to `docs/scaffold-gaps.md`**:
- `<PocLayout kind="...">` page shell selector
- `<WorkedExample>` collapsible component
- `<Pitfall>` callout variant
- `<YouWillLearn>` chapter-opener callout
- Empty `sources/manifest.yaml` warning suppression
- Documentation: YAML date quoting in custom collection schemas

## What this PoC round did NOT test

- **Real visual differentiation** at the layout level — see the per-PoC-kind layouts gap above. The shared minimal layout undercut the comparison's strongest signal.
- **Long-form chapter at full size** — the tutorial PoC is ~210 lines, but a real Ch 1 in v1.0 might land at ~350 lines (per `OUTLINE.md`'s target). Need to see whether the visual conventions hold at full length.
- **Interactive components** — `<DeepDive>`-style in-place collapsibles, `<Sandpack>`-style live code, etc. Deferred per the project roadmap's "interactive elements: v1.0 ships static."
- **Cross-PoC navigation** — the PoCs cross-reference each other via plain links right now. A real handbook would have these as scaffold-aware `<XRef>` links with hover previews.

## How to look at the PoCs

```bash
cd handbook && npm run dev
# Open http://localhost:4321/poc
```

Click through the 5 PoCs at the index page. **The point is not which PoC has the best prose** — the prose is placeholder. **The point is whether the visual register feels distinguishably different** across content types.

If yes: the PEDAGOGY.md framework holds. We commit to the v1.0 plan.

If the visual difference feels too subtle: we need more per-kind layout differentiation (Phase 0.7 scaffold work) before chapter prose drafting starts.

## Provenance

- Sprint: 2026-05-23. Phase A research (4 parallel agents) + Phase B PEDAGOGY.md + Phase C 5 PoCs + this Phase D synthesis.
- Total round artifacts: 38 research notes + 1 PEDAGOGY.md (~700 lines) + 5 PoC MDX (~630 lines) + this memo + content collection scaffolding.
- Tool budget: ~100 calls research + ~10 calls PoC writing + ~5 calls synthesis = ~115 calls total this round.

---

# Round 2 (2026-05-23): Part II × 5 formats

Second iteration of the PoC experiment, this time across **4 chapters of Part II** (Ch 5 Context as Currency / Ch 6 Thinking Together / Ch 7 Testing & Verification / Ch 8 Extending Claude) plus a Part-summary. 16 chapter PoCs + 1 part-summary = 17 new MDX files. All render under `/poc/*`; total PoC route count now **24** (1 Part I summary + 6 Ch 1 + 16 Ch 5-8 + 1 Part II summary).

## What we tested

The user's question after Round 1 was: *"does the format distinction hold beyond a single chapter, or does it work for Ch 1 specifically?"* Round 2 stress-tests this by applying the same template (`tutorial / how-to / TL;DR / cheat-sheet`) to chapters with **structurally different content registers**:

| Chapter | Content register | Predicted hardest format |
|---|---|---|
| Ch 5 — Context as Currency | Reference-y with 4 named commands | Tutorial (narrative spine isn't obvious) |
| Ch 6 — Thinking Together | Mindset + 4 named patterns | Cheat sheet (mindset content resists tabular form) |
| Ch 7 — Testing & Verification | Layered framework + procedural | TL;DR (compressing 6+1 layers loses pedagogical work) |
| Ch 8 — Extending Claude | Decision framework + 5 extension types | How-to (which task best demonstrates the framework?) |

## Cross-chapter findings

### What works (confirmed across all 4 chapters)

**The tutorial-vs-cheat-sheet distinction holds for every chapter.** Each tutorial spends ~180-220 lines on narrative + worked example + retrieval prompts; each cheat-sheet spends ~120-165 lines on tables + matrices + ASCII diagrams. At thumbnail zoom, the visual register is consistently distinguishable regardless of content topic. **The principle generalizes** — it's not Ch 1-specific.

**Worked examples are the spine of every tutorial.** Each chapter's tutorial PoC uses a single concrete worked example as the load-bearing narrative element:
- Ch 5: "30 messages in, context bloated, mid-task" → recovery
- Ch 6: "Claude pattern-matches a sycophantic fix on a CI failure" → interview pattern recovers (turns out to be EST/EDT fixture rot)
- Ch 7: "all 6 automated layers pass and the code is still wrong" → domain correctness as the 7th layer
- Ch 8: "security review on every PR" → walked live through the decision tree (skill + CLI + GitHub Action, zero new MCP server)

Without the worked example, each tutorial would feel like a list of named techniques. With it, the technique is *demonstrated* before being named. This validates Sweller's worked-example-effect ([[../docs/research/11-pedagogy/03-multimedia-learning/theory-sweller-cognitive-load]]) as a chapter-design *rule*, not just a pedagogical option.

**How-tos clarify what the chapter is "for."** Each how-to picks a sharp use case that grounds the chapter's material:
- Ch 5 how-to → "you're 30 messages in and the task is mid-stride" (saves the session)
- Ch 6 how-to → "you're about to make an irreversible architectural decision" (saves the decision)
- Ch 7 how-to → "you want Claude to actually verify each layer, not just say 'looks good'" (saves a regression)
- Ch 8 how-to → "you want to package a procedure so future sessions can invoke it" (saves the procedure)

Picking a sharp use case is what made the how-tos easy to write. **Predict: this also makes the chapters easier to write** when prose drafting starts, because the how-to's use case is the same load-bearing example a tutorial chapter would use.

**The TL;DR is a different artifact from the tutorial executive summary.** Confirmed across all 4 chapters: the TL;DR is for the reader who *isn't going to read the tutorial*, while the executive summary is for the reader who *is*. Different needs; different lengths; not redundant.

### What's less compelling at Part-level

**The Part-summary feels structurally repetitive across the two rounds.** Both `part1-summary.mdx` and `part2-summary.mdx` use the same arc-diagram + chapter-summary-list + "what you'll have built" + "what's NOT in" + "drill in" structure. Reads more like a longer TL;DR than a distinct artifact. **Open question carried from Round 1**: does Part-summary earn its slot, or is it redundant with the chapter TL;DRs? Round 2 doesn't resolve this — same finding as Round 1.

**The cheat-sheet's strongest features still want a custom layout.** The shared minimal layout (`src/pages/poc/[...slug].astro`) doesn't differentiate enough. Ch 7's cheat-sheet wants 6+1 layer pyramid at wider width than the tutorial's narrative line-length. Ch 8's cheat-sheet wants the ASCII decision flowchart wider still. **Phase 0.7 scaffold gap #56 ([`<PocLayout>`](https://github.com/brandon-behring/book-scaffold-astro/issues/56)) remains the highest-leverage scaffold work item.**

### New observations from Round 2

**MDX angle-bracket gotcha** — the Ch 6 agent surfaced this: placeholders like `<relevant file>` inside markdown table cells parse as JSX and break the build. Backticks (`` `[relevant file]` ``) protect them. Worth documenting in `handbook/CLAUDE.md` as authoring guidance + filing as a scaffold doc gap. Currently the only path is "hit it in build then learn." (Filed during Round 1 already as YAML-date docs gap #61 — same flavor.)

**Cross-PoC navigation needs the scaffold's `<XRef>` treatment.** The Part-summary and TL;DRs link extensively to drill-in PoCs via plain markdown. A real handbook would have these as `<XRef>` with hover previews + per-link integrity validation. Functional now but visually weaker than what the scaffold's component vocabulary affords.

**Agent dispatch + ~25-call cap scales cleanly.** 4 parallel agents (one per chapter) each within budget; no crashes; one minor cross-agent collision (Ch 6's broken JSX briefly blocked Ch 5's build verification). The collision was resolved cleanly because each agent owned its own files. **Pattern validation**: per-chapter agent ownership is the right granularity for round 3+ if we extend to Part III/IV.

### Does Ch 5-8 prose drafting unblock?

Yes for Ch 7 and Ch 8 specifically. The how-to use cases are sharp enough that the chapter's load-bearing example is already chosen. Tutorial PoC prose can move to chapter prose with light editing.

Less so for Ch 5 and Ch 6 — both chapters benefit from a still-OPEN decision: **does Ch 5 also become a `<CURRENT_WORK.md>` deep-dive (long), or stay focused on the 4 commands (compact)?** The PoC kept it compact; the chapter outline allows either. Same for Ch 6: does "ADRs" get a chapter section or a Part-summary callout?

These are content-shape decisions, not pedagogy decisions. They'd be settled in OUTLINE.md before prose drafting starts.

## Recommendation refinement (vs Round 1)

Round 1 recommended:
- Tutorial as main chapter format (DECIDED)
- Cheat sheet as companion for chapters with reference-y content
- How-to as separate content type, ~0-2 per chapter
- Part-summary OPEN (one per Part to evaluate)
- TL;DR for explicit hierarchical-disclosure entry points

Round 2 evidence:
- **Tutorial as main format**: validated across 4 more chapters — same shape works
- **Cheat sheet**: every Part II chapter produced a useful cheat sheet (not just Ch 1). Suggest expanding to "every chapter gets a cheat sheet" rather than "only reference-y chapters"
- **How-to**: every Part II chapter produced ONE sharp how-to. Suggest "1 how-to per chapter" as a soft rule rather than "0-2"
- **Part-summary**: structurally repetitive between Round 1 and Round 2. **Soften the recommendation** — Part-summary may be redundant with chapter TL;DRs; final decision still pending visual review
- **TL;DR**: validated as distinct artifact. Suggest "every chapter gets a TL;DR"

If accepted, the v1.0 commitment per chapter becomes: **tutorial + TL;DR + 1 how-to + 1 cheat sheet = 4 artifacts per chapter** (15 chapters × 4 = 60 artifacts) + optional per-Part summaries. That's a lot — viable as a sustained commitment only if the chapter prose is the bottleneck (it is) and the supplements are derived during chapter drafting (one drafting pass produces all 4 formats).

## Provenance (Round 2)

- Sprint: 2026-05-23. 4 parallel agents (one per chapter), each capped at ~25 tool calls per `references/agent_discipline.md`. Total ~80 calls research + ~15 calls part-summary/synthesis = ~95 calls.
- 17 new PoC artifacts (16 chapter PoCs + 1 part-summary). All render at `/poc/*`. Build clean (30 HTML pages total).
- Cross-agent collision: 1 (Ch 6's broken JSX briefly blocked Ch 5's build); self-resolving via per-agent file ownership.
