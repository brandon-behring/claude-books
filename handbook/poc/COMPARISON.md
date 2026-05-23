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
