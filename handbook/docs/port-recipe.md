# Handbook chapter port recipe

Distilled from the **Ch 6 pilot** (2026-06-18) — the spec the Parts II–IV fan-out follows.
Companion docs: the source audit (`../../docs/audits/2026-06-18_handbook-source-audit.md`, per-chapter
tiers) and the pilot record (`../../docs/plans/active/2026-06-18_handbook-ch06-pilot-port.md`).

**No pandoc.** Manual LaTeX→MDX rewrite (repo convention).

## 1. Pick the method by source type

| Chapters | Have draft supplements? | Method |
|---|---|---|
| **ch05–08** | yes (tutorial + how-to + tldr + cheat-sheet each, in `src/content/supplements/`) | **tutorial-first** |
| **ch09–15** | no | **`.tex`-first** |

- **tutorial-first**: `git mv` the `chNN-tutorial.mdx` into `src/content/chapters/chNN-slug.mdx` (preserves
  history — the chapter descends from the draft), then transform it per §2 and reconcile against the `.tex`.
- **`.tex`-first**: port `~/claude-best-practices/chapters/NN_*.tex` directly onto the §2 template.

**The `.tex` is always the source-of-truth completeness check.** Tutorials were written tighter and *drop*
material: Ch 6's tutorial omitted five substantive `.tex` sections (tests-as-thinking, quick-wins,
two of three anti-sycophancy techniques, code archaeology, the prompt-pattern-library hook). Diff the
`.tex` and fold back anything the draft dropped — tutorial-first ≠ tutorial-only.

## 2. Per-chapter checklist (slim model)

**Frontmatter** (match `src/content/chapters/ch01-principles.mdx`):
- [ ] `title, part, chapter, volatility` (per audit tier: `stable-principle` | `evolving` | `fast-moving`),
  `tools_compared: [claude-code]`, `cert_domains` (per `../../docs/cert-coverage.md`),
  `introduced_in_version`, `last_updated` + `last_verified` (today), `sources` (keys in
  `sources/manifest.yaml`), `description`.

**Imports** — the full ported-chapter block (copy from ch01): `YouWillLearn, WorkedExample, Pitfall,
Figure, MarginNote, KeyIdea, InsightBox, Citation, Tip, Exercise, Practice, Solution, ExerciseSolutions`
+ `../../components/BeforeAfter` + `../../components/ChapterSupplements`.

**Body structure** (the spine all ch01–04 follow):
- [ ] `<YouWillLearn prerequisites="…">` opener, 3–4 outcomes
- [ ] one-paragraph italic interstice
- [ ] core sections; each major concept earns a `KeyIdea` / `InsightBox` / `BeforeAfter` / `WorkedExample`
- [ ] **2–4 numbered `<Tip n="X" title="…">`** (single-sentence rules — see §4 on numbering)
- [ ] **3 inline `<Exercise id="chN-ex-M">`** at concept-introduction points (question only)
- [ ] `## Where this goes next` — spiral cross-refs (real `/chapters/chN-slug` link when the target is on
  disk; **bare prose + _(forthcoming)_** for unported chapters)
- [ ] `## Common pitfalls` — 3–5 named `<Pitfall>`
- [ ] `## Quick reference` — recap; **absorb the TL;DR draft's tables here**
- [ ] `## Practice` — **2–3 `<Practice id="chN-pr-M" difficulty="1-4">`**
- [ ] `<ExerciseSolutions>` with one `<Solution for="chN-ex-M">` per inline exercise
- [ ] `<ChapterSupplements chapter={N} />` as the **last line**

## 3. Citations + currency

- [ ] Every Anthropic-attributed claim gets `<Citation src="key" />` (key in `sources/manifest.yaml`).
  The `.tex` flags these as `\official{… \sourceurl{URL}}` — port them. Part I uses `<Citation>`, **not
  `<Tag>`** — match it (a `<Tag>` retrofit, if ever, is a separate pass).
- [ ] **Currency spot-check by audit tier**: stable PORT+ chapters (6, 7, 11, 13) rarely need it;
  REFRESH chapters (5, 9, 12, 14) update model names / hook count (30) / feature surface per the audit's
  June-2026 reference points; heavy REFRESH (8, 15) need the most; the Ch 10 REWRITE adds Agent View,
  `/goal`, `/workflows`, nested subagents.

## 4. Tip numbering

Tips are globally numbered across the handbook **in reading order**. Part I used **1–8**. Porting *out of
reading order* (the fan-out does) → assign **provisional** numbers, then **re-sequence ch05→ch15 in reading
order once all of Parts II–IV land**. (Ch 6 pilot used provisional 9–11.)

## 5. Supplement disposition — the "earned" test

Promote a supplement only if the chapter genuinely can't absorb it:

| Draft kind | Disposition |
|---|---|
| **tutorial** | It *is* the chapter (tutorial-first `git mv`). Do not keep as a supplement. |
| **how-to** | **Promote** — a procedural Diátaxis recipe the chapter shouldn't become. Drop `draft: true`; fix `(#)` links; bump `last_updated`. |
| **cheat-sheet** | **Promote** — a dense lookup the chapter shouldn't become. Same edits. |
| **tldr** | **Fold** its tables into the chapter Quick Reference; **leave the file `draft: true`** (superseded-draft cleanup is a batch decision at the end of the fan-out). |

- Net promoted surface ≈ **2 supplements/chapter**. `<ChapterSupplements>` auto-surfaces the non-draft
  supplements for the chapter — nothing to wire by hand; orphaning can't recur.
- Link hygiene in promoted supplements: chapter → `/chapters/chN-slug`; sibling → `/supplements/chN-kind`;
  unported chapter → bare prose + _(forthcoming)_.

## 6. Verification bar (per chapter)

- [ ] `npm run build` green (page count shifts by the routes you add/remove; a tutorial-first port is net 0)
- [ ] `npm run validate` → "no errors" (root-relative-link "may not resolve" warnings under
  `base:/handbook/` are pre-existing convention, **not** errors)
- [ ] `grep -oE '/supplements/chN-[a-z-]+' dist/chapters/chN-slug/index.html | sort -u` → only the promoted
  supplements appear in the Go-deeper block
- [ ] `grep -rn "chN-tutorial" src/` → no dangling refs after the `git mv`
- [ ] no unresolved `(#)` links in promoted supplements
- [ ] self-review against this checklist

## 7. Fan-out

With the recipe proven on Ch 6, the remaining 10 (ch05, 07–15) can be delegated to parallel subagents —
one chapter each — against this spec. Order: stable PORT+ (✅ 6; then 7, 11, 13) → refresh (5, 9, 12, 14)
→ heavy (8, 15) → **Ch 10 orchestration REWRITE last** (decide first whether the OUTLINE grows to 16 — the
one place scope may expand). Re-sequence Tip numbers in reading order at the end (§4).
